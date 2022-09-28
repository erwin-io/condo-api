import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateRoomDto } from "src/core/dto/rooms/room.create.dto";
import { UpdateRoomDto } from "src/core/dto/rooms/room.update.dto";
import { RoomViewModel } from "src/core/view-model/room.view-model";
import { EntityStatus } from "src/shared/entities/EntityStatus";
import { Rooms } from "src/shared/entities/Rooms";
import { In, Repository } from "typeorm";

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Rooms)
    private readonly roomRepo: Repository<Rooms>
  ) {}

  async findAll() {
    try {
      // return await this.roomRepo.findBy({
      //   entityStatus: { entityStatusId: "1" },
      // });

      const query = <Rooms[]>(
        await this.roomRepo.manager
          .createQueryBuilder("Rooms", "r")
          .leftJoinAndSelect("r.tenants", "t")
          .leftJoinAndSelect("r.entityStatus", "es")
          .where("es.entityStatusId = :entityStatus")
          .setParameters({ entityStatus: 1 })
          .getMany()
      );
      return query.map((r: Rooms) => new RoomViewModel(r));
    } catch (e) {
      throw e;
    }
  }

  async findOne(options?: any) {
    try {
      const query = <Rooms>(
        await this.roomRepo.manager
          .createQueryBuilder("Rooms", "r")
          .leftJoinAndSelect("r.tenants", "t")
          .leftJoinAndSelect("t.user", "u")
          .leftJoinAndSelect("r.entityStatus", "es")
          .where("es.entityStatusId = :entityStatus")
          .setParameters({ entityStatus: 1 })
          .getOne()
      );
      return new RoomViewModel(query);
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async findById(roomId: string) {
    try {
      const room = await this.findOne({
        roomId: roomId,
        entityStatusId: "1",
      });
      if (!room) {
        throw new HttpException("Room not found", HttpStatus.NOT_FOUND);
      }
      return room;
    } catch (e) {
      throw e;
    }
  }

  async add(createDto: CreateRoomDto) {
    try {
      const room = new Rooms();
      room.name = createDto.name;
      room.monthlyRate = createDto.monthlyRate;
      return await this.roomRepo.save(room);
    } catch (e) {
      throw e;
    }
  }

  async update(roomDto: UpdateRoomDto) {
    try {
      const { roomId } = roomDto;
      const room = await this.findOne({
        roomId: roomId,
        entityStatusId: "1",
      });
      if (!room) {
        throw new HttpException("Room not found", HttpStatus.NOT_FOUND);
      }
      room.name = roomDto.name;
      room.monthlyRate = roomDto.monthlyRate;
      return await this.roomRepo.save(room);
    } catch (e) {
      throw e;
    }
  }

  async delete(roomId: string) {
    try {
      const room = await this.findOne({
        roomId: roomId,
        entityStatusId: "1",
      });
      if (!room) {
        throw new HttpException("Room not found", HttpStatus.NOT_FOUND);
      }
      room.name = `deleted_${roomId}_${new Date()}`;
      const entityStatus = new EntityStatus();
      entityStatus.entityStatusId = "2";
      room.entityStatus = entityStatus;
      return await this.roomRepo.save(room);
    } catch (e) {
      throw e;
    }
  }
}
