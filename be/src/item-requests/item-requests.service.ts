import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import {
  FlatProcurement,
  ItemRequest,
  ItemRequestModel,
} from './item-request.schema';
import { InjectModel } from '@nestjs/mongoose';
import ErrorMessage from 'src/common/enums/error-message.enum';
import { CreateProcurementDto } from './dto/create-procurement.dto';
import { UserFlattened } from 'src/users/user.schema';
import { CompaniesService } from 'src/companies/companies.service';
import { ItemsService } from 'src/items/items.service';
import { SitesService } from 'src/sites/sites.service';
import { SuppliersService } from 'src/suppliers/suppliers.service';
import { ItemRequestStatus } from 'src/common/enums/item-request-status.enum';
import { ApprovalsService } from 'src/approvals/approvals.service';
import { PageRequest } from 'src/common/dtos/page-request.dto';
import { PageBuilder } from 'src/common/util/page-builder';
import { SortOrder } from 'mongoose';

@Injectable()
export class ItemRequestsService {
  constructor(
    private readonly sitesService: SitesService,
    private readonly itemsService: ItemsService,
    private readonly suppliersService: SuppliersService,
    private readonly companiesService: CompaniesService,
    @Inject(forwardRef(() => ApprovalsService))
    private readonly approvalsService: ApprovalsService,
    @InjectModel(ItemRequest.name)
    private readonly procurementModel: ItemRequestModel,
  ) {}

  async getProcurement(id: string) {
    const existingProcurement = await this.procurementModel.findById(id);
    if (existingProcurement === null) {
      throw new BadRequestException(
        ErrorMessage.PROCUREMENT_NOT_FOUND,
        `Procurement with the id '${id}' was not found`,
      );
    }
    return existingProcurement;
  }

  async createProcurement(
    user: UserFlattened,
    createProcurementDto: CreateProcurementDto,
  ) {
    // Only by Site managers
    const { companyId, itemId, qty, siteId, supplierId } = createProcurementDto;
    const company = await this.companiesService.getCompany(companyId);
    const item = await this.itemsService.getItem(itemId);
    if (item.companyId !== company.id) {
      throw new BadRequestException(ErrorMessage.ITEM_NOT_FOUND);
    }
    const site = await this.sitesService.getSite(siteId);
    if (site.companyId !== company.id) {
      throw new BadRequestException(ErrorMessage.SITE_NOT_FOUND);
    }
    const supplier = await this.suppliersService.getSupplier(supplierId);
    if (supplier.companyId !== company.id) {
      throw new BadRequestException(ErrorMessage.SUPPLIER_NOT_FOUND);
    }
    if (!Object.keys(supplier.items).includes(item.id)) {
      throw new BadRequestException(ErrorMessage.ITEM_NOT_FOUND);
    }
    const supplierItem = supplier.items[item.id];

    const price = qty * supplierItem.rate;
    const newProcurement = new this.procurementModel({
      companyId,
      itemId,
      qty,
      siteId,
      supplierId,
      price,
      createdAt: new Date(),
      createdBy: user._id,
    });
    const savedProcurement = await newProcurement.save();

    // Send approval request to random lowest level staff only if it needs approval.
    const isOverThreshold =
      price > (company.config.approvalThreshold || 100000);
    const isMustApproveItem = company.config.mustApproveItemIds?.includes(
      item.id,
    );
    if (!isOverThreshold && !isMustApproveItem) return;

    const selectedAdmin =
      await this.approvalsService.selectRandomProcurementAdmin(companyId);

    // const newApproval = new this.approvalModel({
    //   procurementId: savedProcurement.id,
    //   status: ApprovalStatus.PENDING,
    //   approvedBy: selectedAdmin.id,
    //   createdAt: new Date(),
    //   createdBy: user._id,
    // });

    // await newApproval.save();
    return savedProcurement;
  }

  async editProcurement(
    user: UserFlattened,
    id: string,
    editProcurementDto: Partial<CreateProcurementDto>,
  ) {
    // Only by Site managers
    const { qty, supplierId, itemId } = editProcurementDto;
    const existingProcurement = await this.getProcurement(id);

    // Only procurements that have not begun approval can be edited.
    if (existingProcurement.status !== ItemRequestStatus.PENDING_APPROVAL) {
      throw new ConflictException(
        ErrorMessage.PROCUREMENT_ALREADY_APPROVED,
        `The procurement with id '${id}' has already been approved by administrators. It can no longer be edited`,
      );
    }

    existingProcurement.qty = qty ?? existingProcurement.qty;
    existingProcurement.supplierId =
      supplierId ?? existingProcurement.supplierId;
    existingProcurement.itemId = itemId ?? existingProcurement.itemId;
    existingProcurement.updatedBy = user._id;
    existingProcurement.updatedAt = new Date();

    // Re-validate according to new values
    const company = await this.companiesService.getCompany(
      existingProcurement.companyId,
    );
    const item = await this.itemsService.getItem(existingProcurement.itemId);
    if (item.companyId !== company.id) {
      throw new BadRequestException(ErrorMessage.ITEM_NOT_FOUND);
    }
    const supplier = await this.suppliersService.getSupplier(
      existingProcurement.itemId,
    );
    if (supplier.companyId !== company.id) {
      throw new BadRequestException(ErrorMessage.SUPPLIER_NOT_FOUND);
    }
    if (!Object.keys(supplier.items).includes(item.id)) {
      throw new BadRequestException(ErrorMessage.ITEM_NOT_FOUND);
    }

    return await existingProcurement.save();
  }

  async deleteProcurement(id: string) {
    // Only by Site managers
    const existingProcurement = await this.getProcurement(id);

    // Only procurements that have not begun approval can be edited.
    if (existingProcurement.status !== ItemRequestStatus.PENDING_APPROVAL) {
      throw new ConflictException(
        ErrorMessage.PROCUREMENT_ALREADY_APPROVED,
        `The procurement with id '${id}' has already been approved by administrators. It can no longer be deleted`,
      );
    }

    await this.procurementModel.findByIdAndDelete(existingProcurement.id);
    return existingProcurement;
  }

  async getItemRequestPage({
    pageNum = 1,
    pageSize = 10,
    filter,
    sort,
  }: PageRequest) {
    const query = this.procurementModel.find({
      companyId: filter?.companyId?.value,
      itemId: filter?.itemId?.value,
      supplierId: filter?.supplierId?.value,
      siteId: filter?.siteId.value,
      invoiceId: filter?.invoiceId.value,
      status: filter?.status?.value,
    });
    const sortArr: [string, SortOrder][] = Object.entries(sort ?? {}).map(
      ([key, value]) => [key, value as SortOrder],
    );
    const [content, totalDocuments] = await Promise.all([
      query
        .clone()
        .sort(sortArr)
        .skip((pageNum - 1) * pageSize)
        .limit(pageSize)
        .exec(),
      query.clone().count().exec(),
    ]);
    const jsonContent = content.map((doc) =>
      doc.toJSON(),
    ) satisfies FlatProcurement[];
    const page = PageBuilder.buildPage(jsonContent, {
      pageNum,
      pageSize,
      totalDocuments,
      sort,
    });
    return page;
  }
}
