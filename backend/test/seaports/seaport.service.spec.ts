import { Test, TestingModule } from '@nestjs/testing';
import { SeaportService } from "../../src/seaports/seaports.service";
import { PrismaService } from '../../src/prisma/prisma.service';

describe('Seaport Service', () => {

    let service: SeaportService;
    let prismaService: { seaport: { findMany: jest.Mock } };
    beforeEach(async() => {
        prismaService = {
            seaport: {
                findMany: jest.fn()
            }
        };
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SeaportService,
                { provide: PrismaService, useValue: prismaService }
            ]
        }).compile();

        service = module.get<SeaportService>(SeaportService);

    });

    it('should find all seaports', async () => {
        const mockSeaports = [{
            id: 1,
            portName: 'Test Port',
            locode: 'USTST',
            latitude: 12.34,
            longitude: 56.78,
            timezoneOlson: 'UTC',
            countryIso: 'US',
            source: 'Test Source'
        }];
        prismaService.seaport.findMany.mockResolvedValue(mockSeaports);
        const result =  await service.findAll();
        expect(result).toEqual(mockSeaports);
    });

    it('should return an empty array if no seaports are found', async () => {
        prismaService.seaport.findMany.mockResolvedValue([]);
        const result = await service.findAll();
        expect(result).toEqual([]);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
});

