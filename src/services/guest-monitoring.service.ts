import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UpdateGuestMonitoringStatusDto } from "src/core/dto/guest-monitoring/guest-monitoring-status.update.dto";
import { CreateGuestMonitoringDto } from "src/core/dto/guest-monitoring/guest-monitoring.create.dto";
import { UpdateGuestMonitoringDto } from "src/core/dto/guest-monitoring/guest-monitoring.update.dto";
import { GuestMonitoringViewModel } from "src/core/view-model/guest-monitoring.view-model";
import { GuestMonitoring } from "src/shared/entities/GuestMonitoring";
import { Tenant } from "src/shared/entities/Tenant";
import { VisitStatus } from "src/shared/entities/VisitStatus";
import { VisitType } from "src/shared/entities/VisitType";
import { In, Repository } from "typeorm";

@Injectable()
export class GuestMonitoringService {
  constructor(
    @InjectRepository(GuestMonitoring)
    private readonly guestMonitoringRepo: Repository<GuestMonitoring>
  ) {}

  async find(keyword: string) {
    try {
      return <GuestMonitoringViewModel[]>(
        await this.guestMonitoringRepo.manager
          .createQueryBuilder("GuestMonitoring", "gm")
          //visit type
          .leftJoinAndSelect("gm.visitType", "vt")
          //visit status
          .leftJoinAndSelect("gm.visitStatus", "vs")
          //tenant
          .leftJoinAndSelect("gm.tenant", "t")
          .leftJoinAndSelect("t.user", "u")
          .leftJoinAndSelect("t.gender", "g")
          .leftJoinAndSelect("t.room", "r")
          .where("gm.guestMonitoringId like :keyword")
          .orWhere("gm.nameOfGuest like :keyword")
          .orWhere("gm.address like :keyword")
          .orWhere("ISNULL(t.firstName, '') like :keyword")
          .orWhere("ISNULL(t.middleName, '') like :keyword")
          .orWhere("ISNULL(t.lastName, '') like :keyword")
          .orWhere("vt.name like :keyword")
          .orWhere("vs.name like :keyword")
          .setParameters({ keyword })
          .orderBy("vs.visitStatusId", "ASC")
          .addOrderBy("gm.dateOfVisit", "ASC")
          .getMany()
      ).map((gm: GuestMonitoring) => {
        return new GuestMonitoringViewModel(gm);
      });
    } catch (e) {
      throw e;
    }
  }

  async findOne(options?: any) {
    try {
      const query = <GuestMonitoring>await this.guestMonitoringRepo.manager
        .createQueryBuilder("GuestMonitoring", "gm")
        //visit type
        .leftJoinAndSelect("gm.visitType", "vt")
        //visit status
        .leftJoinAndSelect("gm.visitStatus", "vs")
        //tenant
        .leftJoinAndSelect("gm.tenant", "t")
        .leftJoinAndSelect("t.user", "u")
        .leftJoinAndSelect("t.gender", "g")
        .leftJoinAndSelect("t.room", "r")
        .where(options)
        .getOne();
      return new GuestMonitoringViewModel(query);
    } catch (e) {
      throw e;
    }
  }

  async findById(guestMonitoringId: string) {
    try {
      const guestmonitoring = await this.findOne({ guestMonitoringId });
      if (!guestmonitoring) {
        throw new HttpException(
          "Guest Monitoring not found",
          HttpStatus.NOT_FOUND
        );
      }
      return guestmonitoring;
    } catch (e) {
      throw e;
    }
  }

  async add(createDto: CreateGuestMonitoringDto) {
    try {
      return await this.guestMonitoringRepo.manager.transaction(
        async (_entityManager) => {
          const guestmonitoring = new GuestMonitoring();
          guestmonitoring.nameOfGuest = createDto.nameOfGuest;
          guestmonitoring.address = createDto.address;
          guestmonitoring.dateOfVisit = createDto.dateOfVisit;
          guestmonitoring.visitType = await _entityManager.findOne(VisitType, {
            where: { visitTypeId: createDto.visitTypeId },
          });
          guestmonitoring.tenant = await _entityManager.findOne(Tenant, {
            where: { tenantId: createDto.tenantId },
          });
          return await _entityManager.save(guestmonitoring);
        }
      );
    } catch (e) {
      throw e;
    }
  }

  async update(roomDto: UpdateGuestMonitoringDto) {
    try {
      const { guestMonitoringId } = roomDto;
      return await this.guestMonitoringRepo.manager.transaction(
        async (_entityManager) => {
          const guestmonitoring = await _entityManager.findOne(
            GuestMonitoring,
            {
              where: { guestMonitoringId },
              relations: ["tenant", "visitType", "visitStatus"],
            }
          );
          if (!guestmonitoring) {
            throw new HttpException(
              "Guest Monitoring not found",
              HttpStatus.NOT_FOUND
            );
          }
          guestmonitoring.nameOfGuest = roomDto.nameOfGuest;
          guestmonitoring.address = roomDto.address;
          guestmonitoring.dateOfVisit = roomDto.dateOfVisit;
          guestmonitoring.visitType = await _entityManager.findOne(VisitType, {
            where: { visitTypeId: roomDto.visitTypeId },
          });
          return await _entityManager.save(guestmonitoring);
        }
      );
    } catch (e) {
      throw e;
    }
  }

  async updateVisitStatus(status: UpdateGuestMonitoringStatusDto) {
    try {
      const { guestMonitoringId } = status;
      return await this.guestMonitoringRepo.manager.transaction(
        async (_entityManager) => {
          const guestmonitoring = await _entityManager.findOne(
            GuestMonitoring,
            {
              where: { guestMonitoringId },
              relations: ["tenant", "visitType", "visitStatus"],
            }
          );
          if (!guestmonitoring) {
            throw new HttpException(
              "Guest Monitoring not found",
              HttpStatus.NOT_FOUND
            );
          }
          guestmonitoring.visitStatus = await _entityManager.findOne(
            VisitStatus,
            {
              where: { visitStatusId: status.visitStatusId },
            }
          );
          return await _entityManager.save(guestmonitoring);
        }
      );
    } catch (e) {
      throw e;
    }
  }
}
