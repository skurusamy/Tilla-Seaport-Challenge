import { SeaportService } from "./seaports.service";
import { SeaportResolver } from "./seaports.resolver";
import { Module } from "@nestjs/common";

@Module({
    providers: [SeaportService, SeaportResolver],
})

export class SeaportsModule {}