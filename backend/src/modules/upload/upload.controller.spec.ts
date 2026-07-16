import { Test, TestingModule } from '@nestjs/testing';
import { UploadController, multerOptions } from './upload.controller';
import { BadRequestException } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import * as fs from 'fs';

jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  existsSync: jest.fn(),
  mkdirSync: jest.fn(),
  promises: {
    unlink: jest.fn(),
  },
}));

jest.mock('sharp', () => {
  return jest.fn().mockImplementation(() => ({
    resize: jest.fn().mockReturnThis(),
    webp: jest.fn().mockReturnThis(),
    toFile: jest.fn().mockResolvedValue(true),
  }));
});

describe('UploadController', () => {
  let controller: UploadController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadController],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<UploadController>(UploadController);
    jest.clearAllMocks();
  });

  describe('Interceptor Configuration (multerOptions)', () => {
    describe('fileFilter', () => {
      it('deve rejeitar arquivos com MIME types não permitidos (ex: .exe)', () => {
        const mockCb = jest.fn();
        const fakeFile = { mimetype: 'application/x-msdownload' };

        multerOptions.fileFilter({} as any, fakeFile as any, mockCb);

        expect(mockCb).toHaveBeenCalledWith(
          expect.any(BadRequestException),
          false,
        );
        expect(mockCb.mock.calls[0][0].message).toBe(
          'Formato de arquivo não permitido pelas políticas de segurança do servidor.',
        );
      });

      it('deve aprovar arquivos com MIME types permitidos (ex: image/jpeg)', () => {
        const mockCb = jest.fn();
        const fakeFile = { mimetype: 'image/jpeg' };

        multerOptions.fileFilter({} as any, fakeFile as any, mockCb);

        expect(mockCb).toHaveBeenCalledWith(null, true);
      });
    });

    describe('destination', () => {
      it('deve usar o fallback "geral" se o folderName contiver Path Traversal', () => {
        const req = { query: { folder: '../../etc' } };
        const mockCb = jest.fn();

        // Simula que a pasta geral existe
        (fs.existsSync as jest.Mock).mockReturnValue(true);

        const destinationFn = (multerOptions.storage as any).getDestination;
        destinationFn(req, {} as any, mockCb);

        // 'geral' fallback
        expect(mockCb).toHaveBeenCalledWith(null, 'uploads\\geral');
        expect(fs.mkdirSync).not.toHaveBeenCalled();
      });

      it('deve criar o diretório "fotos" se não existir', () => {
        const req = { query: { folder: 'fotos' } };
        const mockCb = jest.fn();

        // Simula que a pasta não existe
        (fs.existsSync as jest.Mock).mockReturnValue(false);

        const destinationFn = (multerOptions.storage as any).getDestination;
        destinationFn(req, {} as any, mockCb);

        expect(fs.mkdirSync).toHaveBeenCalledWith('uploads\\fotos', {
          recursive: true,
        });
        expect(mockCb).toHaveBeenCalledWith(null, 'uploads\\fotos');
      });
    });
  });

  describe('uploadFile Method', () => {
    it('deve estourar BadRequest se não houver arquivo', async () => {
      await expect(
        controller.uploadFile(undefined as any, {} as any),
      ).rejects.toThrow(BadRequestException);
    });

    it('deve higienizar folderName malicioso e salvar em geral', async () => {
      const file = {
        originalname: 'doc.pdf',
        mimetype: 'application/pdf',
        filename: 'uuid.pdf',
        size: 100,
        path: '/tmp/uuid.pdf',
      } as Express.Multer.File;

      const req = {
        query: { folder: '../malicioso' },
        protocol: 'http',
        get: jest.fn().mockReturnValue('localhost'),
      } as unknown as Request;

      const result = await controller.uploadFile(file, req);

      expect(result.file.url).toContain('/uploads/geral/uuid.pdf');
    });

    it('deve ignorar otimização (sharp) se optimize=false', async () => {
      const file = {
        originalname: 'foto.jpg',
        mimetype: 'image/jpeg',
        filename: 'uuid.jpg',
        size: 100,
        path: '/tmp/uuid.jpg',
      } as Express.Multer.File;

      const req = {
        query: { folder: 'fotos', optimize: 'false' },
        protocol: 'http',
        get: jest.fn().mockReturnValue('localhost'),
      } as unknown as Request;

      const result = await controller.uploadFile(file, req);

      expect(result.mimetype).toBe('image/jpeg');
      expect(result.filename).toBe('uuid.jpg');
      const sharp = require('sharp');
      expect(sharp).not.toHaveBeenCalled();
      expect(fs.promises.unlink).not.toHaveBeenCalled();
    });

    it('deve estourar erro se sharp falhar, acionando o fs.unlink no finally para evitar Storage Leak', async () => {
      const file = {
        originalname: 'foto.jpg',
        mimetype: 'image/jpeg',
        filename: 'uuid.jpg',
        size: 100,
        path: '/tmp/uuid.jpg',
      } as Express.Multer.File;

      const req = {
        query: { folder: 'fotos', optimize: 'true' },
        protocol: 'http',
        get: jest.fn().mockReturnValue('localhost'),
      } as unknown as Request;

      const sharp = require('sharp');
      sharp.mockImplementationOnce(() => ({
        resize: jest.fn().mockReturnThis(),
        webp: jest.fn().mockReturnThis(),
        toFile: jest
          .fn()
          .mockRejectedValue(new Error('Formato de imagem corrompido')),
      }));

      (fs.promises.unlink as jest.Mock).mockResolvedValue(true);

      await expect(controller.uploadFile(file, req)).rejects.toThrow(
        new BadRequestException(
          'Falha ao processar a imagem. O arquivo pode estar corrompido.',
        ),
      );

      expect(fs.promises.unlink).toHaveBeenCalledWith('/tmp/uuid.jpg');
    });
  });
});
