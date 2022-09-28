import { Tenant } from "src/shared/entities/Tenant";
import { GenderViewModel } from "./gender.view-model";
import { RoomViewModel } from "./room.view-model";
import { UserViewModel } from "./user.view-model";

export class TenantViewModel {
  tenantId: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  address: string;
  fullName: string;
  gender: GenderViewModel;
  user: UserViewModel;
  birthDate: Date;
  age: string;
  room: RoomViewModel;
  constructor(model: Tenant | undefined) {
    if (!model || model === null) {
      return null;
    }
    this.tenantId = model.tenantId;
    this.firstName = model.firstName;
    this.middleName = model.middleName;
    this.lastName = model.lastName;
    this.email = model.email;
    this.mobileNumber = model.mobileNumber;
    this.address = model.address;
    this.fullName =
      this.firstName +
      (this.middleName ? " " + this.middleName + " " : " ") +
      this.lastName;
    this.gender = model.gender;
    this.user = new UserViewModel(model.user);
    this.birthDate = model.birthDate;
    this.age = model.age;
    this.room = new RoomViewModel(model.room);
  }
}
