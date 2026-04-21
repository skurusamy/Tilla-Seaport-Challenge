import { describe } from "node:test";
import { cleanSeaportRecord } from "../../../src/jobs/cleaners/seaport-cleaner";

describe('Seaport Cleaner', () => {
   
    it('should clean and normalize valid input', () => {
        const input = {
            'Port Name': '  Test Port  ',
            'Port Locode': 'USNYC',
            'Latitude': '12.34',
            'Longitude': '56.78',
            'Timezone Olson': 'UTC',
            'Country ISO': 'US',
            'Source': 'Test Source'
        };
        const expectedOutput = {
            portName: 'Test Port',
            locode: 'USNYC',
            latitude: 12.34,
            longitude: 56.78,
            timezoneOlson: 'UTC',
            countryIso: 'US',
            source: 'Test Source'
        };
        const result = cleanSeaportRecord(input);
        expect(result).toEqual(expectedOutput);
    });

    it('should return null for invalid numeric fields', () => {
        const input = {
            'Port Name': '  Test Port  ',
            'Port Locode': 'USNYC',
            'Latitude': 'invalid',
            'Longitude': '56.78',
            'Timezone Olson': 'UTC',
            'Country ISO': 'US',
            'Source': 'Test Source'
        };
        const expectedOutput = {
            portName: 'Test Port',
            locode: 'USNYC',
            latitude: null,
            longitude: 56.78,
            timezoneOlson: 'UTC',
            countryIso: 'US',
            source: 'Test Source'
        };
        const result = cleanSeaportRecord(input);
        expect(result).toEqual(expectedOutput);
    });

    it('should return null for empty strings', () => {
        const input = {
            'Port Name': '  Test Port  ',
            'Port Locode': '',
            'Latitude': '12.23',
            'Longitude': '56.78',
            'Timezone Olson': 'UTC',
            'Country ISO': 'US',
            'Source': 'Test Source'
        };

        const expectedOutput = {
            portName: 'Test Port',
            locode: null,
            latitude: 12.23,
            longitude: 56.78,
            timezoneOlson: 'UTC',
            countryIso: 'US',
            source: 'Test Source'
        };
        const result = cleanSeaportRecord(input);
        expect(result).toEqual(expectedOutput);
    });

});
