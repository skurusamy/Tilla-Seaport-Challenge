export type ValidationResult =
    | { valid: true }
    | { valid: false; errors: string };

export function validateSeaportRecord(record: {
    portName?: string | null;
    locode?: string | null;
    latitude?: number | null;
    longitude?: number | null;
}) {
    if (!record.portName || typeof record.portName !== 'string') {
        return { valid: false, errors: 'Invalid portName' };
    }
    if (!record.locode || typeof record.locode !== 'string') {
        return { valid: false, errors: 'Invalid locode' };
    }
    if (record.latitude == null || (record.latitude == undefined || Number.isNaN(record.latitude))) {
        return { valid: false, errors: 'Invalid latitude' };
    }
    if (record.longitude == null || (record.longitude == undefined || Number.isNaN(record.longitude))) {
        return { valid: false, errors: 'Invalid longitude' };
    }
    return { valid: true };
}