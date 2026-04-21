import { Module } from "@nestjs/common";
import { SeaportImportScheduler } from "./seaport-import.scheduler";

@Module({
    providers: [SeaportImportScheduler],
})
export class JobsModule {}