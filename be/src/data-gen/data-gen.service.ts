import { faker } from '@faker-js/faker';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UserRole } from 'src/common/enums/user-roles.enum';
import { Company, Item, Site, Supplier } from 'src/companies/company.schema';
import {
  Approval,
  Delivery,
  ItemRequest,
  ItemRequestStatus,
} from 'src/item-requests/item-request.schema';
import { User } from 'src/users/user.schema';

@Injectable()
export class DataGenService {
  private readonly logger = new Logger(DataGenService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Company.name) private companyModel: Model<Company>,
    @InjectModel(ItemRequest.name) private itemRequestModel: Model<ItemRequest>,
  ) {}

  async generateAll() {
    this.logger.log('Starting data generation process....');
    // await this.generateCompanies(5);
    // await this.generateUsers(100);
    await this.generateItemRequests(5000);
  }

  private async generateUsers(n: number) {
    this.logger.log(`Generating ${n} users...`);
    const promises = Array(n).fill('').map(this.generateUser);
    await Promise.all(promises);
    this.logger.log('Succesfully generated users');
  }

  private async generateCompanies(n: number) {
    this.logger.log(`Generating ${n} companies...`);
    const promises = Array(n).fill('').map(this.generateCompany);
    await Promise.all(promises);
    this.logger.log('Succesfully generated companies');
  }

  private generateUser = async () => {
    const companies = await this.companyModel.find({});
    const selectedCompany = faker.helpers.arrayElement(companies);
    const newUser = new this.userModel({
      country: faker.location.countryCode(),
      email: faker.internet.email(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      createdAt: new Date(),
      roles: faker.helpers.arrayElement(Object.values(UserRole)),
      createdBy: 'DATA_GEN',
      companyId: selectedCompany.id,
    });
    const savedUser = await newUser.save();
    this.logger.log(`Saved user with id ${savedUser.id}`);
  };

  private generateItem = async () => {
    const newItem: Item = {
      createdAt: new Date(),
      createdBy: 'DATA_GEN',
      name: faker.word.noun(),
      imageUrls: [],
    };
    return newItem;
  };

  private generateSupplier = async (items: Company['items']) => {
    const selectedItems = items.filter(() => faker.datatype.boolean());
    const itemDetails: Supplier['items'] = new Types.Map();
    selectedItems.forEach((item) => {
      itemDetails.set(item.id, {
        rate: faker.number.float({ max: 1000, min: 100, precision: 1 }),
      });
    });

    const newSupplier: Supplier = {
      createdAt: new Date(),
      createdBy: 'DATA_GEN',
      accountNumbers: [faker.finance.accountNumber()],
      name: faker.company.name(),
      email: faker.internet.email(),
      mobiles: [faker.phone.number()],
      items: itemDetails,
    };
    return newSupplier;
  };

  private generateSite = async (userIds: string[]) => {
    const newSite: Site = {
      createdAt: new Date(),
      createdBy: 'DATA_GEN',
      name: faker.location.street(),
      address: faker.location.streetAddress(),
      mobiles: [faker.phone.number()],
      siteManagerIds: faker.helpers.arrayElements(userIds),
    };
    return newSite;
  };

  private generateCompany = async () => {
    const items = await Promise.all(
      Array(faker.number.int({ max: 10, min: 1 }))
        .fill('')
        .map(async () => await this.generateItem()),
    );

    const sites = await Promise.all(
      Array(faker.number.int({ max: 5, min: 1 }))
        .fill('')
        .map(async () => await this.generateSite([])),
    );

    const newCompany = new this.companyModel({
      name: faker.company.name(),
      createdAt: new Date(),
      createdBy: 'DATA_GEN',
      config: {},
      items,
      sites,
    });

    const savedCompany = await newCompany.save();

    const suppliers = await Promise.all(
      Array(faker.number.int({ max: 5, min: 1 }))
        .fill('')
        .map(async () => await this.generateSupplier(savedCompany.items)),
    );

    suppliers.forEach((supplier) => {
      savedCompany.suppliers.push(supplier);
    });

    await savedCompany.save();
    this.logger.log(`Saved company with id ${savedCompany.id}`);
  };

  private generateItemRequests = async (n: number) => {
    this.logger.log(`Generating ${n} item-requests`);
    const [companies, users] = await Promise.all([
      this.companyModel.find({}),
      this.userModel.find({}),
    ]);
    this.logger.log(
      `Fetched ${companies.length} companies' and ${users.length} users' data`,
    );

    const itemRequestBulk = Array(n)
      .fill('')
      .map(() => {
        const selectedCompany = faker.helpers.arrayElement(companies);
        const selectedProcurementAdmins = users.filter(
          (user) =>
            user.companyId === selectedCompany.id &&
            user.roles.includes(UserRole.PROCUREMENT_ADMIN),
        );
        const selectedSite = faker.helpers.arrayElement(selectedCompany.sites);
        const selectedSupplier = faker.helpers.arrayElement(
          selectedCompany.suppliers,
        );
        const selectedItemId = faker.helpers.arrayElement(
          Array.from(selectedSupplier.items.keys()),
        );

        const approvalsReceived = faker.number.int({ max: 3, min: 0 });
        let status: ItemRequestStatus = ItemRequestStatus.PENDING_APPROVAL;
        if (approvalsReceived == 3) status = ItemRequestStatus.APPROVED;
        if (approvalsReceived < 3 && approvalsReceived > 1)
          status = faker.datatype.boolean()
            ? ItemRequestStatus.PARTIALLY_APPROVED
            : ItemRequestStatus.APPROVED;

        const approvals = this.buildApprovalList(
          approvalsReceived,
          status,
          selectedProcurementAdmins.map((admin) => admin.id),
        );

        if (status === ItemRequestStatus.APPROVED && faker.datatype.boolean()) {
          status = faker.datatype.boolean()
            ? ItemRequestStatus.DELIVERED
            : ItemRequestStatus.PARTIALLY_DELIVERED;
        }

        const qty = faker.number.int({ max: 100, min: 10 });
        const deliveries = this.buildDeliveryList(status, qty);

        const invoice = { invoiceUrls: [] as string[] };
        if (
          status === ItemRequestStatus.DELIVERED &&
          faker.datatype.boolean()
        ) {
          status = faker.datatype.boolean()
            ? ItemRequestStatus.PENDING_INVOICE
            : ItemRequestStatus.COMPLETED;
          if (status === ItemRequestStatus.COMPLETED) {
            invoice.invoiceUrls.push(faker.internet.url());
          }
        }

        const newItemRequest = new this.itemRequestModel({
          companyId: selectedCompany.id,
          createdAt: new Date(),
          createdBy: 'DATA_GEN',
          supplierId: selectedSupplier.id,
          siteId: selectedSite.id,
          itemId: selectedItemId,
          qty: faker.number.int({ max: 100, min: 10 }),
          status,
          invoice,
        });
        newItemRequest.approvals.push(...approvals);
        newItemRequest.deliveries.push(...deliveries);
        const newItemRequestJson = newItemRequest.toJSON();
        console.log(newItemRequestJson);
        return newItemRequestJson;
      });

    this.logger.log(`Starting to save ${n} item-requests...`);
    // const bulkWriteResult = await this.itemRequestModel.insertMany(
    //   itemRequestBulk,
    // );
    // this.logger.log(
    //   `Saved ${bulkWriteResult.length} item-requests succesfully`,
    // );
  };

  private buildApprovalList = (
    approvalsReceived: number,
    status: ItemRequestStatus,
    approverUserIds: string[],
  ): Approval[] => {
    if (
      [
        ItemRequestStatus.APPROVED,
        ItemRequestStatus.PARTIALLY_APPROVED,
      ].includes(status as any)
    ) {
      let approvals = [];
      for (let i = 0; i < approvalsReceived; i++) {
        approvals.push({
          approvedBy: faker.helpers.arrayElement(approverUserIds),
          createdAt: new Date(),
          createdBy: 'DATA_GEN',
          isApproved: true,
          description: faker.lorem.paragraph(),
          referredTo:
            i === approvalsReceived - 1
              ? faker.helpers.arrayElement(approverUserIds)
              : undefined,
        });
      }
      return approvals;
    } else {
      return [];
    }
  };

  private buildDeliveryList = (
    status: ItemRequestStatus,
    qty: number,
  ): Delivery[] => {
    if (status === 'DELIVERED') {
      return [
        {
          qty,
          createdAt: new Date(),
          createdBy: 'DATA_GEN',
        },
      ];
    } else if (status === 'PARTIALLY_DELIVERED') {
      return [
        {
          qty: faker.number.int({ min: 1, max: qty }),
          createdAt: new Date(),
          createdBy: 'DATA_GEN',
        },
      ];
    } else {
      return [];
    }
  };
}
