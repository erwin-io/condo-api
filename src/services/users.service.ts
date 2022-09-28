import { Tenant } from "../shared/entities/Tenant";
import {
  UpdateTenantUserDto,
  UpdateStaffUserDto,
  UserDto,
} from "../core/dto/users/user.update.dto";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";
import {
  TenantUserDto,
  CreateTenantUserDto,
  CreateStaffUserDto,
  StaffUserDto,
} from "../core/dto/users/user.create.dto";
import {
  compare,
  hash,
  getAge,
  isStaffRegistrationApproved,
} from "../common/utils/utils";
import { Users } from "../shared/entities/Users";
import { Gender } from "../shared/entities/Gender";
import { Staff } from "../shared/entities/Staff";
import { UserType } from "../shared/entities/UserType";
import { EntityStatus } from "../shared/entities/EntityStatus";
import { Roles } from "../shared/entities/Roles";
import { RoleEnum } from "src/common/enums/role.enum copy";
import { StaffViewModel } from "src/core/view-model/staff.view-model";
import { TenantViewModel } from "src/core/view-model/tenant.view-model";
import { UserViewModel } from "src/core/view-model/user.view-model";
import { query } from "express";
import { UserTypeEnum } from "src/common/enums/user-type.enum";
import { Rooms } from "src/shared/entities/Rooms";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users) private readonly userRepo: Repository<Users>
  ) {}

  async findAll(userTypeId: string) {
    if (Number(userTypeId) === 1) {
      const query = <Staff[]>(
        await this.userRepo.manager
          .createQueryBuilder("Staff", "s")
          .innerJoinAndSelect("s.gender", "g")
          .innerJoinAndSelect("s.user", "u")
          .innerJoinAndSelect("u.role", "r")
          .innerJoinAndSelect("u.userType", "ut")
          .getMany()
      );
      return query.map((s: Staff) => {
        return new StaffViewModel(s);
      });
    } else if (Number(userTypeId) === 2) {
      const query = <Tenant[]>(
        await this.userRepo.manager
          .createQueryBuilder("Tenant", "s")
          .innerJoinAndSelect("s.gender", "g")
          .innerJoinAndSelect("s.user", "u")
          .innerJoinAndSelect("u.role", "r")
          .innerJoinAndSelect("u.userType", "ut")
          .getMany()
      );
      return query.map((c: Tenant) => {
        return new TenantViewModel(c);
      });
    }
  }

  async findStaffUserByFilter(
    advanceSearch: boolean,
    keyword: string,
    userId: string,
    username: string,
    roles: string[],
    email: string,
    mobileNumber: string,
    name: string
  ) {
    const params: any = {
      keyword: `%${keyword}%`,
      roles:
        roles.length === 0
          ? ["Admin", "Manager", "Veterinarian", "Front desk"]
          : roles,
    };
    let query = await this.userRepo.manager
      .createQueryBuilder("Staff", "s")
      .innerJoinAndSelect("s.gender", "g")
      .innerJoinAndSelect("s.user", "u")
      .innerJoinAndSelect("u.role", "r")
      .innerJoinAndSelect("u.userType", "ut");

    if (advanceSearch) {
      query = query
        .where("ISNULL(s.firstName, '') like :name")
        .orWhere("ISNULL(s.middleName, '') like :name")
        .orWhere("ISNULL(s.lastName, '') like :name");
      query = query
        .where("r.name IN(:...roles)")
        .andWhere("u.userId like :userId")
        .andWhere("u.username like :username")
        .andWhere("s.email like :email")
        .andWhere("s.mobileNumber like :mobileNumber")
        .orderBy("u.userId", "DESC");
      params.userId = `%${userId}%`;
      params.username = `%${username}%`;
      params.email = `%${email}%`;
      params.mobileNumber = `%${mobileNumber}%`;
      params.name = `%${name}%`;
    } else {
      query = query
        .where("r.name like :keyword")
        .orWhere("u.userId like :keyword")
        .orWhere("u.username like :keyword")
        .orWhere("s.email like :keyword")
        .orWhere("s.mobileNumber like :keyword")
        .orWhere("ISNULL(s.firstName, '') like :keyword")
        .orWhere("ISNULL(s.middleName, '') like :keyword")
        .orWhere("ISNULL(s.lastName, '') like :keyword")
        .orderBy("u.userId", "DESC");
    }
    query = query.setParameters(params);
    return (<Staff[]>await query.getMany()).map((s: Staff) => {
      return new StaffViewModel(s);
    });
  }

  async findTenantUserByFilter(
    advanceSearch: boolean,
    keyword: string,
    userId: string,
    username: string,
    email: string,
    mobileNumber: string,
    name: string
  ) {
    const params: any = {
      keyword: `%${keyword}%`,
    };
    let query = await this.userRepo.manager
      .createQueryBuilder("Tenant", "c")
      .innerJoinAndSelect("c.gender", "g")
      .innerJoinAndSelect("c.user", "u")
      .innerJoinAndSelect("u.role", "r")
      .innerJoinAndSelect("u.userType", "ut");

    if (advanceSearch) {
      query = query
        .where("ISNULL(c.firstName, '') like :name")
        .orWhere("ISNULL(c.middleName, '') like :name")
        .orWhere("ISNULL(c.lastName, '') like :name");
      query = query
        .where("c.userId like :userId")
        .andWhere("c.username like :username")
        .andWhere("c.email like :email")
        .andWhere("c.mobileNumber like :mobileNumber")
        .orderBy("u.userId", "DESC");
      params.userId = `%${userId}%`;
      params.username = `%${username}%`;
      params.email = `%${email}%`;
      params.mobileNumber = `%${mobileNumber}%`;
      params.name = `%${name}%`;
    } else {
      query = query
        .where("u.userId like :keyword")
        .orWhere("u.username like :keyword")
        .orWhere("c.email like :keyword")
        .orWhere("c.mobileNumber like :keyword")
        .orWhere("ISNULL(c.firstName, '') like :keyword")
        .orWhere("ISNULL(c.middleName, '') like :keyword")
        .orWhere("ISNULL(c.lastName, '') like :keyword")
        .orderBy("u.userId", "DESC");
    }
    query = query.setParameters(params);
    return (<Tenant[]>await query.getMany()).map((c: Tenant) => {
      return new TenantViewModel(c);
    });
  }

  async findOne(
    options?: any,
    sanitizeUser?: boolean,
    entityManager?: EntityManager
  ) {
    const user: any = await entityManager.findOne(Users, {
      where: options,
      relations: ["userType", "role"],
    });
    if (!user) {
      return;
    }
    user.hasActiveSession =
      user.currentHashedRefreshToken === null ||
      user.currentHashedRefreshToken === undefined ||
      user.currentHashedRefreshToken === ""
        ? false
        : true;
    const userTypeId = user.userType.userTypeId;
    if (Number(userTypeId) === 1) {
      const result: any = await entityManager.findOne(Staff, {
        where: {
          user: options,
        },
        relations: ["user", "gender"],
      });
      result.fullName =
        result.firstName +
        " " +
        (result.MiddleName !== undefined
          ? result.MiddleName + " " + result.lastName
          : result.lastName);
      result.user.role = user.role;
      result.user = sanitizeUser ? this._sanitizeUser(user) : result.user;
      if (result.user.role.roleId === RoleEnum.GUEST.toString())
        result.user.role.roleId = null;
      return result;
    } else {
      const result: any = await entityManager.findOne(Tenant, {
        where: {
          user: options,
        },
        relations: ["user", "gender", "room"],
      });
      result.fullName =
        result.firstName +
        " " +
        (result.MiddleName !== undefined
          ? result.MiddleName + " " + result.lastName
          : result.lastName);
      result.user.role = user.role;
      result.user = sanitizeUser ? this._sanitizeUser(user) : result.user;
      if (result.user.role.roleId === RoleEnum.GUEST.toString())
        result.user.role.roleId = null;
      return result;
    }
  }

  async findById(userId: string) {
    const result = await this.findOne({ userId }, true, this.userRepo.manager);
    if (!result) {
      throw new HttpException("User not found", HttpStatus.NOT_FOUND);
    }
    return result;
  }

  async findByUsername(username) {
    const result = await this.findOne(
      { username },
      false,
      this.userRepo.manager
    );
    if (result === (null || undefined)) return null;
    return this._sanitizeUser(result.user);
  }

  async findByLogin(username, password) {
    const result = await this.findOne(
      { username },
      false,
      this.userRepo.manager
    );
    if (!result) {
      throw new HttpException("Username not found", HttpStatus.NOT_FOUND);
    }
    if (!result.user.enable) {
      throw new HttpException("Yout account has been disabled", HttpStatus.OK);
    }
    const areEqual = await compare(result.user.password, password);
    if (!areEqual) {
      throw new HttpException("Invalid credentials", HttpStatus.NOT_ACCEPTABLE);
    }
    return this._sanitizeUser(result.user);
  }

  async findByLoginTenant(username, password) {
    const result = await this.findOne(
      { username, userType: { userTypeId: 2 } },
      false,
      this.userRepo.manager
    );
    if (!result) {
      throw new HttpException("Username not found", HttpStatus.NOT_FOUND);
    }
    if (!result.user.enable) {
      throw new HttpException("Yout account has been disabled", HttpStatus.OK);
    }
    const areEqual = await compare(result.user.password, password);
    if (!areEqual) {
      throw new HttpException("Invalid credentials", HttpStatus.NOT_ACCEPTABLE);
    }
    return this._sanitizeUser(result.user);
  }

  async registerTenantUser(userDto: TenantUserDto) {
    const { username } = userDto;
    return await this.userRepo.manager.transaction(async (entityManager) => {
      const userInDb = await this.findOne({ username }, false, entityManager);
      if (userInDb) {
        throw new HttpException("Username already exist", HttpStatus.CONFLICT);
      }
      let user = new Users();
      user.username = userDto.username;
      user.password = await hash(userDto.password);
      user.userType = new UserType();
      user.userType.userTypeId = UserTypeEnum.TENANT.toString();
      user.role = new Roles();
      user.role.roleId = RoleEnum.GUEST.toString();
      user.entityStatus = new EntityStatus();
      user.entityStatus.entityStatusId = "1";
      user = await entityManager.save(Users, user);
      let tenant = new Tenant();
      tenant.user = user;
      tenant.firstName = userDto.firstName;
      tenant.middleName = userDto.middleName;
      tenant.lastName = userDto.lastName;
      tenant.email = userDto.email;
      tenant.mobileNumber = userDto.mobileNumber;
      tenant.birthDate = userDto.birthDate;
      tenant.age = await (await getAge(userDto.birthDate)).toString();
      tenant.address = userDto.address;
      tenant.gender = new Gender();
      tenant.gender.genderId = userDto.genderId;
      tenant = await entityManager.save(Tenant, tenant);
      tenant.user = await this._sanitizeUser(user);
      return tenant;
    });
  }

  async registerStaffUser(userDto: StaffUserDto) {
    const { username } = userDto;

    return await this.userRepo.manager.transaction(async (entityManager) => {
      const userInDb = await this.findOne({ username }, false, entityManager);
      if (userInDb) {
        throw new HttpException("Username already exist", HttpStatus.CONFLICT);
      }
      let user = new Users();
      user.username = userDto.username;
      user.password = await hash(userDto.password);
      user.userType = new UserType();
      user.userType.userTypeId = UserTypeEnum.STAFF.toString();
      user.entityStatus = new EntityStatus();
      user.role = new Roles();
      user.role.roleId = RoleEnum.GUEST.toString();
      user.entityStatus.entityStatusId = "1";
      user = await entityManager.save(Users, user);
      let staff = new Staff();
      staff.user = user;
      staff.firstName = userDto.firstName;
      staff.middleName = userDto.middleName;
      staff.lastName = userDto.lastName;
      staff.email = userDto.email;
      staff.mobileNumber = userDto.mobileNumber;
      staff.address = userDto.address;
      staff.gender = new Gender();
      staff.gender.genderId = userDto.genderId;
      staff = await entityManager.save(Staff, staff);
      staff.user = await this._sanitizeUser(user);
      return staff;
    });
  }

  async createTenantUser(userDto: CreateTenantUserDto) {
    const { username } = userDto;

    return await this.userRepo.manager.transaction(async (entityManager) => {
      const userInDb = await this.findOne({ username }, false, entityManager);
      if (userInDb) {
        throw new HttpException("Username already exist", HttpStatus.CONFLICT);
      }
      let user = new Users();
      user.username = userDto.username;
      user.password = await hash(userDto.password);
      user.userType = new UserType();
      user.userType.userTypeId = UserTypeEnum.TENANT.toString();
      user.entityStatus = new EntityStatus();
      user.role = new Roles();
      user.role.roleId = RoleEnum.GUEST.toString();
      user.entityStatus.entityStatusId = "1";
      user.isAdminApproved = true;
      user = await entityManager.save(Users, user);
      let tenant = new Tenant();
      tenant.user = user;
      tenant.firstName = userDto.firstName;
      tenant.middleName = userDto.middleName;
      tenant.lastName = userDto.lastName;
      tenant.email = userDto.email;
      tenant.mobileNumber = userDto.mobileNumber;
      tenant.address = userDto.address;
      tenant.birthDate = userDto.birthDate;
      tenant.age = (await getAge(userDto.birthDate)).toString();
      tenant.gender = new Gender();
      tenant.gender.genderId = userDto.genderId;
      tenant.room = await entityManager.findOne(Rooms, {
        where: { roomId: userDto.roomId },
      });
      tenant = await entityManager.save(Tenant, tenant);
      tenant.user = await this._sanitizeUser(user);

      return tenant;
    });
  }

  async createStaffUser(userDto: CreateStaffUserDto) {
    const { username } = userDto;

    return await this.userRepo.manager.transaction(async (entityManager) => {
      const userInDb = await this.findOne({ username }, false, entityManager);
      if (userInDb) {
        throw new HttpException("Username already exist", HttpStatus.CONFLICT);
      }
      let user = new Users();
      user.username = userDto.username;
      user.password = await hash(userDto.password);
      user.userType = new UserType();
      user.userType.userTypeId = UserTypeEnum.STAFF.toString();
      user.entityStatus = new EntityStatus();
      user.role = new Roles();
      user.role.roleId = userDto.roleId;
      user.entityStatus.entityStatusId = "1";
      user.isAdminApproved = true;
      user = await entityManager.save(Users, user);
      let staff = new Staff();
      staff.user = user;
      staff.firstName = userDto.firstName;
      staff.middleName = userDto.middleName;
      staff.lastName = userDto.lastName;
      staff.email = userDto.email;
      staff.mobileNumber = userDto.mobileNumber;
      staff.address = userDto.address;
      staff.gender = new Gender();
      staff.gender.genderId = userDto.genderId;
      staff = await entityManager.save(Staff, staff);
      staff.user = await this._sanitizeUser(user);
      return staff;
    });
  }

  async updateTenantUser(userDto: UpdateTenantUserDto) {
    const userId = userDto.userId;

    return await this.userRepo.manager.transaction(async (entityManager) => {
      let tenant: any = await this.findOne(
        {
          userId,
          userType: { userTypeId: "2" },
        },
        true,
        entityManager
      );
      if (!tenant) {
        throw new HttpException(`User doesn't exist`, HttpStatus.NOT_FOUND);
      }
      tenant.firstName = userDto.firstName;
      tenant.middleName = userDto.middleName;
      tenant.lastName = userDto.lastName;
      tenant.email = userDto.email;
      tenant.mobileNumber = userDto.mobileNumber;
      tenant.birthDate = userDto.birthDate;
      tenant.age = await (await getAge(userDto.birthDate)).toString();
      tenant.address = userDto.address;
      tenant.gender = new Gender();
      tenant.gender.genderId = userDto.genderId;

      tenant.room = await entityManager.findOne(Rooms, {
        where: { roomId: userDto.roomId },
      });
      await entityManager.save(Tenant, tenant);
      tenant = await this.findOne({ userId }, true, entityManager);

      return tenant;
    });
  }

  async updateStaffUser(userDto: UpdateStaffUserDto) {
    const userId = userDto.userId;

    return await this.userRepo.manager.transaction(async (entityManager) => {
      let staff: any = await this.findOne(
        {
          userId,
          userType: { userTypeId: "1" },
        },
        true,
        entityManager
      );

      if (!staff) {
        throw new HttpException(`User doesn't exist`, HttpStatus.NOT_FOUND);
      }
      let user = staff.user;
      user.role.roleId = userDto.roleId;
      user.isAdminApproved = isStaffRegistrationApproved(
        Number(userDto.roleId)
      );
      user = await entityManager.save(Users, user);
      staff.firstName = userDto.firstName;
      staff.middleName = userDto.middleName;
      staff.lastName = userDto.lastName;
      staff.email = userDto.email;
      staff.mobileNumber = userDto.mobileNumber;
      staff.address = userDto.address;
      staff.gender = new Gender();
      staff.gender.genderId = userDto.genderId;

      await entityManager.save(Staff, staff);
      staff = await this.findOne({ userId }, true, entityManager);

      return staff;
    });
  }

  async getRefreshTokenUserById(userId: string) {
    const result = await this.findOne({ userId }, false, this.userRepo.manager);
    if (!result) {
      throw new HttpException("User not found", HttpStatus.NOT_FOUND);
    }
    return {
      userId: result.user.userId,
      refresh_token: result.user.currentHashedRefreshToken,
    };
  }

  async setCurrentRefreshToken(
    currentHashedRefreshToken: string,
    userId: number
  ) {
    await this.userRepo.update(userId, {
      currentHashedRefreshToken,
    });
  }

  async toggleEnable(enable: boolean, userId: number) {
    await this.userRepo.update(userId, {
      enable,
    });

    return await this.findOne({ userId }, true, this.userRepo.manager);
  }

  private _sanitizeUser(user: Users) {
    delete user.password;
    delete user.currentHashedRefreshToken;
    return user;
  }
}
