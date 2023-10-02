import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, UserFlattened } from './user.schema';
import { Model } from 'mongoose';
import { Page, PageBuilder } from 'src/common/util/page-builder';
import { CreateUserDto } from 'src/common/dtos/create-user.dto';
import ErrorMessage from 'src/common/enums/error-message.enum';
import { PageRequest } from 'src/common/dtos/page-request.dto';
import { UserRole } from 'src/common/enums/user-roles.enum';
import { hashSync } from 'bcrypt';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {
    const existingSystemAdmin = this.userModel.findOne({
      roles: { $in: [UserRole.SYSTEM_ADMIN] },
    });
    if (existingSystemAdmin === null) {
      this.logger.log('System admin not found. Creating new system admin...');
      this.createSystemAdmin();
    }
  }

  async createSystemAdmin() {
    const systemAdmin = new this.userModel();
    systemAdmin.firstName = 'John';
    systemAdmin.lastName = 'Doe';
    systemAdmin.password = hashSync('password', 10);
    systemAdmin.email = 'johndoe@gmail.com';
    systemAdmin.isAuthorized = true;
    systemAdmin.companyId = 'SYSTEM';
    await systemAdmin.save();
    this.logger.log('New system admin created');
  }

  async updateUser(id: string, userDto: CreateUserDto): Promise<UserDocument> {
    this.logger.log(`Attempting to find user with id '${id}'`);
    const updatedUser = await this.userModel.findByIdAndUpdate(id, userDto);

    if (updatedUser === null) {
      this.logger.warn(`Could not find an existing user with id '${id}'`);
      throw new BadRequestException(ErrorMessage.USER_NOT_FOUND, {
        description: `User with id '${id}' was not found`,
      });
    }
    return updatedUser.toJSON();
  }

  async getUser(id: string): Promise<UserDocument> {
    this.logger.log(`Attempting to find user with id '${id}'`);
    const existingUser = await this.userModel.findById(id);

    if (existingUser === null) {
      this.logger.warn(`Could not find an existing user with id '${id}'`);
      throw new BadRequestException(ErrorMessage.USER_NOT_FOUND, {
        description: `User with id '${id}' was not found`,
      });
    }

    return existingUser.toJSON();
  }

  async getUserByEmail(email: string): Promise<UserDocument> {
    this.logger.log(`Attempting to find user with email '${email}'`);
    const existingUser = await this.userModel.findOne({ email });

    if (existingUser === null) {
      this.logger.warn(`Could not find an existing user with email '${email}'`);
      throw new BadRequestException(ErrorMessage.USER_NOT_FOUND, {
        description: `User with email '${email}' was not found`,
      });
    }

    return existingUser.toJSON();
  }

  async deleteUser(id: string) {
    this.logger.log(`Attempting to find user with id '${id}'`);
    const deletedUser = await this.userModel.findByIdAndDelete(id);

    if (deletedUser === null) {
      this.logger.warn(`Could not find an existing user with id '${id}'`);
      throw new BadRequestException(ErrorMessage.USER_NOT_FOUND, {
        description: `User with id '${id}' was not found`,
      });
    }

    // TODO: Delete orders, reviews.
  }

  async getUserPage({
    pageNum = 1,
    pageSize = 10,
    sort,
  }: PageRequest): Promise<Page<UserFlattened>> {
    const skippedDocuments = (pageNum - 1) * pageSize;
    const [totalDocuments, users] = await Promise.all([
      this.userModel.count({}),
      this.userModel
        .find({})
        .select({ password: 0 })
        .limit(pageSize)
        .skip(skippedDocuments)
        .sort(
          sort !== undefined
            ? { [sort?.field ?? '_id']: sort?.direction ?? 'asc' }
            : undefined,
        ),
    ]);

    const userPage = PageBuilder.buildPage(
      users.map((user) => user.toJSON() as UserFlattened),
      {
        pageNum,
        pageSize,
        totalDocuments,
        sort,
      },
    );

    return userPage;
  }
}
