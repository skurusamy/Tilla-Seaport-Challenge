import * as XLSX from "xlsx";
import { readFile } from 'node:fs/promises';

export async function loadLocalExcelFile(filePath: string): Promise<Record<string, unknown>[]> {
    const fileBuffer = await readFile(filePath);
    const workbook = XLSX.read(fileBuffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    return XLSX.utils.sheet_to_json(sheet);
}

