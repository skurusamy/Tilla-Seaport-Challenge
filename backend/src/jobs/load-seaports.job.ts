import { validate } from "graphql";
import { cleanSeaportRecord } from "./cleaners/seaport-cleaner";
import { loadLocalExcelFile } from "./extractors/file-data-extractor";
import { validateSeaportRecord } from "./validators/seaport-validator";
import { PrismaClient } from "@prisma/client";
import { basename, extname, join } from "path";
import { mkdir, readdir, rename } from "fs/promises";

const prisma = new PrismaClient();

type FailedRecord = {
    portName: string,
    reason: string
}

type LoadSeaportsResult = {
    fileName: string,
    successRecords: number,
    failureRecords: number,
    failedRecords: FailedRecord[]
}

export async function loadSeaportsJob(filePath: string) {
    const rawRecords = await loadLocalExcelFile(filePath);

    let successRecord = 0;
    let failureRecord = 0;
    const failedRecords: FailedRecord[] = [];

    for (const rawRecord of rawRecords) {
        try {
            const cleaned = cleanSeaportRecord(rawRecord);
            const validation = validateSeaportRecord(cleaned);
            if (!validation.valid) {
                failureRecord++;
                failedRecords.push({
                    portName: cleaned.portName ?? 'Unknown Port',
                    reason: validation.errors!
                });
                continue;
            }
            //add valid record to db
            await prisma.seaport.upsert({
                where: { locode: cleaned.locode! },
                update: {
                    portName: cleaned.portName!,
                    latitude: cleaned.latitude!,
                    longitude: cleaned.longitude!,
                    timezoneOlson: cleaned.timezoneOlson!,
                    countryIso: cleaned.countryIso!,
                    source: cleaned.source!
                },
                create: {
                    locode: cleaned.locode!,
                    portName: cleaned.portName!,
                    latitude: cleaned.latitude!,
                    longitude: cleaned.longitude!,
                    timezoneOlson: cleaned.timezoneOlson!,
                    countryIso: cleaned.countryIso!,
                    source: cleaned.source!
                }
            });
            successRecord++;
        } catch {
            failureRecord++;
            failedRecords.push({
                portName: typeof rawRecord['Port Name'] === 'string' && rawRecord['Port Name'].trim() ?
                    rawRecord['Port Name'].trim() : "Unknown Port",
                reason: "Unexpected processing error"
            });

        }
    }

    return {
        fileName: basename(filePath),
        successRecords: successRecord,
        failureRecords: failureRecord,
        failedRecords: failedRecords
    }
}

export async function loadPendingSeaportFiles(): Promise<LoadSeaportsResult[]> {
    const dataDir = join(process.cwd(), 'data');
    const incomingDir = join(dataDir, 'incoming');
    const processedDir = join(dataDir, 'processed');

    await mkdir(processedDir, { recursive: true });
    const entries = await readdir(incomingDir, { withFileTypes: true });
    const files = entries
        .filter((entry => entry.isFile()))
        .map(entry => entry.name)
    .filter((name)=> ['.xlsx', '.xls'].includes(extname(name).toLowerCase()));

    const results: LoadSeaportsResult[] = [];
    for (const file of files) {
        const result = await loadSeaportsJob(join(incomingDir, file));
        results.push(result);

        const ext = extname(file);
        const name = basename(file, ext);
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const processedFileName = `${name}_${timestamp}${ext}`;
        const processedPath = join(processedDir, processedFileName);

        await rename(join(incomingDir, file), processedPath);
    }
    return results;
}

async function main() {
    const results = await loadPendingSeaportFiles();
    console.log('Seaport import complete');
    for (const result of results) {
        console.log(`File: ${result.fileName}`);
        console.log(`  SuccessRecords: ${result.successRecords}`);
        console.log(`  FailureRecords: ${result.failureRecords}`);
        if (result.failedRecords.length > 0) {
            console.log('  FailedRecords:');
            for (const fr of result.failedRecords) {
                console.log(`    - portName: ${fr.portName}, reason: ${fr.reason}`);
            }
        } else {
            console.log('  FailedRecords: none');
        }
    }
}

if (require.main === module) {
    main().catch((error) => {
        console.error('Error occurred while processing seaport files:', error);
        process.exit(1);
    }).finally(async () => {
        await prisma.$disconnect();
    });
}