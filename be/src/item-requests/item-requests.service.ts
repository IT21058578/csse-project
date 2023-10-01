import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { ItemRequest, ItemRequestModel } from './item-request.schema';
import { InjectModel } from '@nestjs/mongoose';
import ErrorMessage from 'src/common/enums/error-message.enum';
import { CreateProcurementDto } from './dto/create-procurement.dto';
import { User, UserFlattened, UsersModel } from 'src/users/user.schema';
import { CompaniesService } from 'src/companies/companies.service';
import { ItemsService } from 'src/items/items.service';
import { SitesService } from 'src/sites/sites.service';
import { SuppliersService } from 'src/suppliers/suppliers.service';
import { Approval, ApprovalModel } from 'src/approvals/approval.schema';
import { ApprovalStatus } from 'src/common/enums/approval-status.enum';
import { ItemRequestStatus } from 'src/common/enums/item-request-status.enum';
import { ApprovalsService } from 'src/approvals/approvals.service';

@Injectable()
export class ItemRequestsService {
  constructor(
    private readonly sitesService: SitesService,
    private readonly itemsService: ItemsService,
    private readonly suppliersService: SuppliersService,
    private readonly companiesService: CompaniesService,
    private readonly approvalsService: ApprovalsService,
    @InjectModel(ItemRequest.name)
    private readonly itemRequestModel: ItemRequestModel,
    @InjectModel(User.name)
    private readonly userModel: UsersModel,
    @InjectModel(Approval.name)
    private readonly approvalModel: ApprovalModel,
  ) {}

  async getProcurement(id: string) {
    const existingProcurement = await this.itemRequestModel.findById(id);
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
    if (!supplier.items.has(item.id)) {
      throw new BadRequestException(ErrorMessage.ITEM_NOT_FOUND);
    }
    const supplierItem = supplier.items.get(item.id)!;

    const price = qty * supplierItem.rate;
    const newProcurement = new this.itemRequestModel({
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

    const newApproval = new this.approvalModel({
      procurementId: savedProcurement.id,
      status: ApprovalStatus.PENDING,
      approvedBy: selectedAdmin.id,
      createdAt: new Date(),
      createdBy: user._id,
    });
    await newApproval.save();
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
    if (!supplier.items.has(item.id)) {
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

    await this.itemRequestModel.findByIdAndDelete(existingProcurement.id);
    return existingProcurement;
  }

  async getItemRequestPage() {
    // Include names of anything refered to by id
  }
}
