import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UpdateIncidentReportStatusDto } from "src/core/dto/incidents-reports/incidents-reports-status.update.dto";
import { CreateIncidentReportDto } from "src/core/dto/incidents-reports/incidents-reports.create.dto";
import { UpdateIncidentReportDto } from "src/core/dto/incidents-reports/incidents-reports.update.dto";
import { IncidentsReportsViewModel } from "src/core/view-model/incidents-reports.view-model";
import { IncidentsReports } from "src/shared/entities/IncidentsReports";
import { IncidentStatus } from "src/shared/entities/IncidentStatus";
import { Tenant } from "src/shared/entities/Tenant";
import { VisitStatus } from "src/shared/entities/VisitStatus";
import { VisitType } from "src/shared/entities/VisitType";
import { In, Repository } from "typeorm";
import * as moment from "moment";
import { MonthlyDues } from "src/shared/entities/MonthlyDues";
import { CreateMonthlyDuesDto } from "src/core/dto/monthly-dues/monthly-dues.create.dto";
import { UpdateMonthlyDuePaymentDto } from "src/core/dto/monthly-dues/monthly-dues.update.dto";
import { Rooms } from "src/shared/entities/Rooms";
import { MonthlyDuesViewModel } from "src/core/view-model/monthly-dues.view-model";
import { TenantViewModel } from "src/core/view-model/tenant.view-model";

@Injectable()
export class MonthlyDuesService {
  constructor(
    @InjectRepository(MonthlyDues)
    private readonly monthlyDuesRepo: Repository<MonthlyDues>
  ) {}

  async find(tenantId: string, year: number) {
    try {
      const start = new Date(year, 1, 0);
      const lastDay = new Date(year, 12, 0);

      const param = {
        tenantId,
        start,
        lastDay,
      };
      return <MonthlyDuesViewModel[]>(
        await this.monthlyDuesRepo.manager
          .createQueryBuilder("MonthlyDues", "md")
          .leftJoinAndSelect("md.tenant", "t")
          .where("t.tenantId = :tenantId")
          .andWhere("md.dueDate between :start and :lastDay")
          .setParameters(param)
          .orderBy("md.dueDate", "DESC")
          .getMany()
      ).map((md: MonthlyDues) => {
        return new MonthlyDuesViewModel(md);
      });
    } catch (e) {
      throw e;
    }
  }

  async findOne(options?: any) {
    try {
      const query = <MonthlyDues>await this.monthlyDuesRepo.manager
        .createQueryBuilder("MonthlyDues", "md")
        //tenant
        .leftJoinAndSelect("md.tenant", "t")
        .leftJoinAndSelect("t.user", "u")
        .leftJoinAndSelect("t.gender", "g")
        .leftJoinAndSelect("t.room", "r")
        .where(options)
        .getOne();
      return new MonthlyDuesViewModel(query);
    } catch (e) {
      throw e;
    }
  }

  async findById(monthlyDueId: string) {
    try {
      const monthlyDue = await this.findOne({ monthlyDueId });
      if (!monthlyDue) {
        throw new HttpException("Month due not found", HttpStatus.NOT_FOUND);
      }
      return monthlyDue;
    } catch (e) {
      throw e;
    }
  }

  async add(createDto: CreateMonthlyDuesDto) {
    try {
      return await this.monthlyDuesRepo.manager.transaction(
        async (_entityManager) => {
          const start = new Date(
            createDto.dueDate.getFullYear(),
            createDto.dueDate.getMonth(),
            1
          );
          const lastDay = new Date(
            createDto.dueDate.getFullYear(),
            createDto.dueDate.getMonth() + 1,
            0
          );
          const query = <Tenant>(
            await _entityManager
              .createQueryBuilder("Tenant", "t")
              .leftJoinAndSelect("t.room", "r")
              .where("t.tenantId = :tenantId")
              .setParameters({ tenantId: createDto.tenantId })
              .getOne()
          );
          const tenant: any = new TenantViewModel(query);
          if (!tenant) {
            throw new HttpException("Tenant not found", HttpStatus.NOT_FOUND);
          }
          let monthlyDue = <MonthlyDues>await _entityManager
            .createQueryBuilder("MonthlyDues", "md")
            //tenant
            .leftJoinAndSelect("md.tenant", "t")
            .leftJoinAndSelect("t.room", "r")
            .where("md.dueDate between :start and :lastDay")
            .andWhere("t.tenantId = :tenantId")
            .setParameters({ start, lastDay, tenantId: createDto.tenantId })
            .getOne();
          if (!monthlyDue) {
            monthlyDue = new MonthlyDues();
            monthlyDue.dueDate = createDto.dueDate;
            monthlyDue.generatedDate = createDto.generatedDate;
            monthlyDue.tenant = tenant;
            monthlyDue.dueAmount = tenant.room.monthlyRate;
            return await _entityManager.save(monthlyDue);
          } else {
            return monthlyDue;
          }
        }
      );
    } catch (e) {
      throw e;
    }
  }

  async updatePayment(due: UpdateMonthlyDuePaymentDto) {
    try {
      const { monthlyDueId } = due;
      return await this.monthlyDuesRepo.manager.transaction(
        async (_entityManager) => {
          const monthlyDue = await _entityManager.findOne(MonthlyDues, {
            where: { monthlyDueId },
            relations: ["tenant"],
          });
          if (!monthlyDue) {
            throw new HttpException(
              "Month Due not found",
              HttpStatus.NOT_FOUND
            );
          }
          if (due.paymentAmount <= 0) {
            throw new HttpException("Invalid amount", HttpStatus.BAD_REQUEST);
          }
          if (
            monthlyDue.dueAmount < due.paymentAmount ||
            monthlyDue.dueAmount - monthlyDue.amountPaid < due.paymentAmount
          ) {
            throw new HttpException(
              "Payment is greater than due amount",
              HttpStatus.BAD_REQUEST
            );
          }
          const totalPayment = monthlyDue.amountPaid + due.paymentAmount;
          monthlyDue.amountPaid = totalPayment;
          monthlyDue.isPaid = totalPayment === monthlyDue.dueAmount;
          return await _entityManager.save(monthlyDue);
        }
      );
    } catch (e) {
      throw e;
    }
  }
}
