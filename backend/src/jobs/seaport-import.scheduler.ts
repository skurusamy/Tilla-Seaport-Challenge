import { Injectable } from "@nestjs/common";
import { loadPendingSeaportFiles } from "./load-seaports.job";
import { Cron, CronExpression } from "@nestjs/schedule";

@Injectable()
export class SeaportImportScheduler {
    private isRunning = false;

    @Cron(CronExpression.EVERY_MINUTE)
    async handleCron() {
        if (this.isRunning) {
            console.log('Seaport import is already running');
            return;
        }
        this.isRunning = true;

        try {
            const result = await loadPendingSeaportFiles();
            if (result.length == 0) {
                console.log(`No pending seaport files to import at ${new Date().toLocaleString()}`);
                return;
            }
            console.log(`Seaport import completed successfully: ${result.length} files at ${new Date().toLocaleString()}`);
            console.log(JSON.stringify(result, null, 2));
        } catch (error) {
            console.error('Error occurred during seaport import:', error);
        } finally {
            this.isRunning = false;
        }
    }
}
