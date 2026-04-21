import { Query, Resolver } from "@nestjs/graphql";
import { SeaportEntity } from "./entity/seaport.entity";
import { SeaportService } from "./seaports.service";

@Resolver()
export class SeaportResolver {
  constructor(private readonly seaportService: SeaportService) {}

  @Query(() => [SeaportEntity])
  async findAllSeaports() {
    return this.seaportService.findAll();
  }
}