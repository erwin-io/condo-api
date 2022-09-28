import { Rooms } from "src/shared/entities/Rooms";
import { Tenant } from "src/shared/entities/Tenant";
import { EntityStatusViewModel } from "./entity-status.view-model";
import { TenantViewModel } from "./tenant.view-model";

export class RoomViewModel {
  roomId: string;
  name: string;
  monthlyRate: number;
  entityStatus: EntityStatusViewModel;
  tenants: TenantViewModel[];
  constructor(model: Rooms | undefined) {
    if (!model || model === null) {
      return null;
    }
    this.roomId = model.roomId;
    this.name = model.name;
    this.monthlyRate = model.monthlyRate;
    this.entityStatus = model.entityStatus;
    this.tenants = model.tenants
      ? model.tenants.map((t: Tenant) => new TenantViewModel(t))
      : [];
  }
}
