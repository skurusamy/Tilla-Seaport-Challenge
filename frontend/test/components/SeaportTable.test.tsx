import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { SeaportTable } from '../../src/components/SeaportTable';

describe('SeaportTable', () => {

    it('should render table headers', () => {

        render(<SeaportTable seaports={[]} />);

        expect(screen.getByText('Port Name')).toBeInTheDocument();
        expect(screen.getByText('LOCODE')).toBeInTheDocument();
        expect(screen.getByText('Latitude')).toBeInTheDocument();
        expect(screen.getByText('Longitude')).toBeInTheDocument();
    });

    it('should render seaport data rows', () => {

        const mockData = [
            {
                id: 1,
                portName: 'Port Hamburg',
                locode: 'DEHAM',
                latitude: 53.5,
                longitude: 9.9,
                timezoneOlson: 'Europe/Berlin',
                countryIso: 'DE',
            },
        ];
        render(<SeaportTable seaports={mockData} />);

        expect(screen.getByText('Port Hamburg')).toBeInTheDocument();
        expect(screen.getByText('DEHAM')).toBeInTheDocument();
        expect(screen.getByText('53.5')).toBeInTheDocument();
        expect(screen.getByText('9.9')).toBeInTheDocument();
    });

});