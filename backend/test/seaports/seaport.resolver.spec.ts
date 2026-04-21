import { SeaportResolver } from "../../src/seaports/seaports.resolver";
import { SeaportService } from "../../src/seaports/seaports.service";
import { Test, TestingModule } from '@nestjs/testing';

describe('Seaport Resolver', () => {
    let resolver: SeaportResolver;
    let seaportService: { findAll: jest.Mock };

    beforeEach(async () => {
        seaportService = { findAll: jest.fn() };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SeaportResolver,
                { provide: SeaportService, useValue: seaportService }
            ]
        }).compile();

        resolver = module.get<SeaportResolver>(SeaportResolver);
    });

    it('should return an array of seaports', async () => {
        const mockSeaports = [
            { id: 1, portName: 'Test Port 1', locode: 'USTST1' },
            { id: 2, portName: 'Test Port 2', locode: 'USTST2' }
        ];
        seaportService.findAll.mockResolvedValue(mockSeaports);
        const result = await resolver.findAllSeaports();
        expect(result).toEqual(mockSeaports);
    });

    it('should return empty array if no seaports found', async () => {
        seaportService.findAll.mockResolvedValue([]);
        const result = await resolver.findAllSeaports();
        expect(result).toEqual([]);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
});

