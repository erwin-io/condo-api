import { MonthlyDues } from "src/shared/entities/MonthlyDues";
import { Double } from "typeorm";
import { TenantViewModel } from "./tenant.view-model";

export class MonthlyDuesViewModel {
  monthlyDueId: string;
  dueDate: Date;
  generatedDate: Date;
  dueAmount: Double;
  amountPaid: Double;
  isPaid: boolean;
  markAsRead: boolean;
  tenant: TenantViewModel;
  constructor(model: MonthlyDues | undefined){
    if (!model || model === null) {
      return null;
    }
    this.monthlyDueId = model.monthlyDueId;
    this.dueDate = model.dueDate;
    this.generatedDate = model.generatedDate;
    this.dueAmount = model.dueAmount;
    this.amountPaid = model.amountPaid;
    this.isPaid = model.isPaid;
    this.markAsRead = model.markAsRead;
    this.tenant = new TenantViewModel(model.tenant);
  }
}