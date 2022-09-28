import { GuestMonitoring } from "src/shared/entities/GuestMonitoring";
import { IncidentsReports } from "src/shared/entities/IncidentsReports";
import { TenantViewModel } from "./tenant.view-model";

export class IncidentsReportsViewModel {
  incidentsReportId: string;
  date: Date;
  title: string;
  message: string;
  tenant: TenantViewModel;
  incidentStatus: IncidentStatusVieModel;
  constructor(model: IncidentsReports | undefined){
    if (!model || model === null) {
      return null;
    }
    this.incidentsReportId = model.incidentsReportId;
    this.date = model.date;
    this.title = model.title;
    this.message = model.message;
    this.tenant = new TenantViewModel(model.tenant);
    this.incidentStatus = model.incidentStatus;
  }
}

export class IncidentStatusVieModel {
  incidentStatusId: string;
  name: string;
}