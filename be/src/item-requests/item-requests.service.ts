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
import { PageBuilder } from 'src/common/util/page.util';
import { ApprovalStatus } from 'src/common/enums/approval-status.enum';
import { QueryUtil } from 'src/common/util/query.util';

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
    const { itemId, qty, siteId, supplierId } = createProcurementDto;
    const item = await this.itemsService.getItem(itemId);
    const company = await this.companiesService.getCompany(item.companyId);
    const site = await this.sitesService.getSite(siteId);
    if (site.companyId !== company.id) {
      throw new BadRequestException(
        ErrorMessage.SITE_NOT_FOUND,
        `Site with id ${site.id} does not belong to company with id ${company.id}`,
      );
    }
    const supplier = await this.suppliersService.getSupplier(supplierId);
    if (supplier.companyId !== company.id) {
      throw new BadRequestException(
        ErrorMessage.SUPPLIER_NOT_FOUND,
        `Supplier with id ${supplierId} does not belong to company with id ${company.id}`,
      );
    }
    if (!Object.keys(supplier.items).includes(item.id)) {
      throw new BadRequestException(
        ErrorMessage.ITEM_NOT_FOUND,
        `Supplier with id ${supplierId} does not provide the item with id ${itemId}`,
      );
    }

    let status: ItemRequestStatus = ItemRequestStatus.PENDING_APPROVAL;
    const supplierItem = supplier.items[item.id];
    const price = qty * supplierItem.rate;
    const isOverThreshold =
      price > (company.config.approvalThreshold || 100000);
    const isMustApproveItem = company.config.mustApproveItemIds?.includes(
      item.id,
    );
    if (!isOverThreshold && !isMustApproveItem) {
      status = ItemRequestStatus.APPROVED;
    }

    const savedProcurement = await this.procurementModel.create({
      companyId: item.companyId,
      itemId,
      qty,
      siteId,
      supplierId,
      price,
      status,
      createdAt: new Date(),
      createdBy: user._id,
    });

    // Send approval request to random lowest level staff only if it needs approval.
    if (status === ItemRequestStatus.APPROVED) return;

    const selectedAdmin =
      await this.approvalsService.selectRandomProcurementAdmin(item.companyId);

    await this.approvalsService.createInitialApproval({
      companyId: item.companyId,
      procurementId: savedProcurement.id,
      status: ApprovalStatus.PENDING,
      approvedBy: selectedAdmin.id,
      createdAt: new Date(),
      createdBy: user._id,
    });
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
      existingProcurement.supplierId,
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
    await existingProcurement.deleteOne();
  }

  async getItemRequestPage({
    pageNum = 1,
    pageSize = 10,
    filter,
    sort,
  }: PageRequest) {
    const [content, totalDocuments] = await Promise.all([
      this.procurementModel
        .find(QueryUtil.buildQueryFromFilter(filter))
        .sort(QueryUtil.buildSort(sort))
        .skip((pageNum - 1) * pageSize)
        .limit(pageSize)
        .exec(),
      this.procurementModel
        .find(QueryUtil.buildQueryFromFilter(filter))
        .count()
        .exec(),
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
