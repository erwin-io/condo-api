import { GuestMonitoring } from "src/shared/entities/GuestMonitoring";
import { Tenant } from "src/shared/entities/Tenant";
import { TenantViewModel } from "./tenant.view-model";

export class GuestMonitoringViewModel {
  guestMonitoringId: string;
  nameOfGuest: string;
  address: string;
  dateOfVisit: Date;
  visitType: VisitTypeVieModel;
  visitStatus: VisitStatusVieModel;
  tenant: TenantViewModel;
  constructor(model: GuestMonitoring | undefined){
    if (!model || model === null) {
      return null;
    }
    this.guestMonitoringId = model.guestMonitoringId;
    this.nameOfGuest = model.nameOfGuest;
    this.address = model.address;
    this.dateOfVisit = model.dateOfVisit;
    this.visitType = model.visitType;
    this.visitStatus = model.visitStatus;
    this.tenant = new TenantViewModel(model.tenant);
  }
}


export class VisitTypeVieModel {
  visitTypeId: string;
  name: string;
}

export class VisitStatusVieModel {
  visitStatusId: string;
  name: string;
}