import { Test, TestingModule } from '@nestjs/testing';
import { CertificadosService } from './certificados.service';
import { PrismaService } from '../../prisma/prisma.service';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';

describe('CertificadosService', () => {
  let service: CertificadosService;
  let prisma: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    prisma = mockDeep<PrismaService>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CertificadosService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<CertificadosService>(CertificadosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
