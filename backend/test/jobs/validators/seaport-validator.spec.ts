import { validateSeaportRecord } from "../../../src/jobs/validators/seaport-validator";

describe('Seaport Validator', () => {
    it('should validate a correct seaport record', () => {
        const input = {
            portName: 'Test Port',
            locode: 'USNYC',
            latitude: 12.34,
            longitude: 56.78,
            timezoneOlson: 'UTC',
            countryIso: 'US',
            source: 'Test Source'
        };
        const result = validateSeaportRecord(input);
        expect(result).toEqual({valid: true});
    });

    it('should fail if portName is missing', () => {
        const input = {
            locode: 'USNYC',
            latitude: 12.34,
            longitude: 56.78,
            timezoneOlson: 'UTC',
            countryIso: 'US',
            source: 'Test Source'
        };
        const result = validateSeaportRecord(input);
        expect(result).toEqual({ valid: false, errors: 'Invalid portName' });
    });

    it('should fail if locode is missing', () => {
        const input = {
            portName: 'Test Port',
            latitude: 12.34,
            longitude: 56.78,
            timezoneOlson: 'UTC',
            countryIso: 'US',
            source: 'Test Source'
        };
        const result = validateSeaportRecord(input);
        expect(result).toEqual({ valid: false, errors: 'Invalid locode' });
    });

    it('should fail if latitude is invalid', () => {
        const input = {
            portName: 'Test Port',
            locode: 'USNYC',
            latitude: NaN,
            longitude: 56.78,
            timezoneOlson: 'UTC',
            countryIso: 'US',
            source: 'Test Source'
        };
        const result = validateSeaportRecord(input);
        expect(result).toEqual({ valid: false, errors: 'Invalid latitude' });
    });
    it('should fail if latitude is invalid', () => {
        const input = {
            portName: 'Test Port',
            locode: 'USNYC',
            latitude: 12.2,
            longitude: NaN,
            timezoneOlson: 'UTC',
            countryIso: 'US',
            source: 'Test Source'
        };
        const result = validateSeaportRecord(input);
        expect(result).toEqual({ valid: false, errors: 'Invalid longitude' });
    });
});


