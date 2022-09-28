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

@Injectable()
export class IncidentsReportsService {
  constructor(
    @InjectRepository(IncidentsReports)
    private readonly incidentsReportsRepo: Repository<IncidentsReports>
  ) {}

  async find(keyword: string) {
    try {
      return <IncidentsReportsViewModel[]>(
        await this.incidentsReportsRepo.manager
          .createQueryBuilder("IncidentsReports", "ir")
          //status
          .leftJoinAndSelect("ir.incidentStatus", "is")
          //tenant
          .leftJoinAndSelect("ir.tenant", "t")
          .leftJoinAndSelect("t.user", "u")
          .leftJoinAndSelect("t.gender", "g")
          .leftJoinAndSelect("t.room", "r")
          .where("ir.incidentsReportId like :keyword")
          .orWhere("ir.date like :keyword")
          .orWhere("ir.title like :keyword")
          .orWhere("ir.message like :keyword")
          .orWhere("ISNULL(t.firstName, '') like :keyword")
          .orWhere("ISNULL(t.middleName, '') like :keyword")
          .orWhere("ISNULL(t.lastName, '') like :keyword")
          .setParameters({ keyword })
          .orderBy("ir.incidentStatus", "ASC")
          .addOrderBy("ir.date", "ASC")
          .getMany()
      ).map((ir: IncidentsReports) => {
        return new IncidentsReportsViewModel(ir);
      });
    } catch (e) {
      throw e;
    }
  }

  async findOne(options?: any) {
    try {
      const query = <IncidentsReports>await this.incidentsReportsRepo.manager
        .createQueryBuilder("IncidentsReports", "ir")
        //visit type
        .leftJoinAndSelect("ir.incidentStatus", "is")
        //tenant
        .leftJoinAndSelect("ir.tenant", "t")
        .leftJoinAndSelect("t.user", "u")
        .leftJoinAndSelect("t.gender", "g")
        .leftJoinAndSelect("t.room", "r")
        .where(options)
        .getOne();
      return new IncidentsReportsViewModel(query);
    } catch (e) {
      throw e;
    }
  }

  async findById(incidentsReportId: string) {
    try {
      const incidentsReport = await this.findOne({ incidentsReportId });
      if (!incidentsReport) {
        throw new HttpException(
          "Guest Monitoring not found",
          HttpStatus.NOT_FOUND
        );
      }
      return incidentsReport;
    } catch (e) {
      throw e;
    }
  }

  async add(createDto: CreateIncidentReportDto) {
    try {
      return await this.incidentsReportsRepo.manager.transaction(
        async (_entityManager) => {
          const incidentsReport = new IncidentsReports();
          incidentsReport.date = createDto.date;
          incidentsReport.title = createDto.title;
          incidentsReport.message = createDto.message;
          incidentsReport.tenant = await _entityManager.findOne(Tenant, {
            where: { tenantId: createDto.tenantId },
          });
          return await _entityManager.save(incidentsReport);
        }
      );
    } catch (e) {
      throw e;
    }
  }

  async update(updateDto: UpdateIncidentReportDto) {
    try {
      const { incidentsReportId } = updateDto;
      return await this.incidentsReportsRepo.manager.transaction(
        async (_entityManager) => {
          const incidentsReport = await _entityManager.findOne(
            IncidentsReports,
            {
              where: { incidentsReportId },
              relations: ["tenant", "incidentStatus"],
            }
          );
          if (!incidentsReport) {
            throw new HttpException(
              "Guest Monitoring not found",
              HttpStatus.NOT_FOUND
            );
          }
          incidentsReport.date = updateDto.date;
          incidentsReport.title = updateDto.title;
          incidentsReport.message = updateDto.message;
          return await _entityManager.save(incidentsReport);
        }
      );
    } catch (e) {
      throw e;
    }
  }

  async updateStatus(status: UpdateIncidentReportStatusDto) {
    try {
      const { incidentsReportId } = status;
      return await this.incidentsReportsRepo.manager.transaction(
        async (_entityManager) => {
          const incidentsReport = await _entityManager.findOne(
            IncidentsReports,
            {
              where: { incidentsReportId },
              relations: ["tenant", "incidentStatus"],
            }
          );
          if (!incidentsReport) {
            throw new HttpException(
              "Incident Report not found",
              HttpStatus.NOT_FOUND
            );
          }
          if (
            Number(status.incidentStatusId) > 4 ||
            Number(status.incidentStatusId) <= 0
          ) {
            throw new HttpException("Invalid status", HttpStatus.BAD_REQUEST);
          }
          incidentsReport.incidentStatus = await _entityManager.findOne(
            IncidentStatus,
            {
              where: { incidentStatusId: status.incidentStatusId },
            }
          );
          return await _entityManager.save(incidentsReport);
        }
      );
    } catch (e) {
      throw e;
    }
  }
}
