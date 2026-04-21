function toTrimmedString(value: unknown): string | null {
    if (typeof value != 'string') {
        return null;
    }
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
}

function cleanPortName(portName: unknown): string | null {
    const raw = toTrimmedString(portName);
    if (!raw) return null;
    return raw.replace(/[^\w\s\-()/.,]/g, ' ').replace(/\s+/g, ' ').trim();
    
}

function toNumber(value: unknown): number | null {
    if (typeof value === 'number' && Number.isFinite(value)) {
        return value;
    }
    if (typeof value === 'string' && value.trim() !== '') {

        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : null;
    }
    return null;
}

export function cleanSeaportRecord(record: Record<string, unknown>) {
    const portName = cleanPortName(record['Port Name']) ?? null;
    const locode = toTrimmedString(record['Port Locode'])?.toUpperCase() ?? null;
    const latitude = toNumber(record['Latitude']) ?? null;
    const longitude = toNumber(record['Longitude']) ?? null;
    const timezoneOlson = toTrimmedString(record['Timezone Olson']) ?? null;
    const countryIso = toTrimmedString(record['Country ISO'])?.toUpperCase() ?? null;
    const source = toTrimmedString(record['source']) ?? null;

    return {
        portName,
        locode,
        latitude,
        longitude,
        timezoneOlson,
        countryIso,
        source
    }

}