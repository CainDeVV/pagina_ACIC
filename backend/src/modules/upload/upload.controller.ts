import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import sharp from 'sharp';
import {
  ApiTags,
  ApiConsumes,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { AdminAuth } from '../../common/decorators/admin-auth.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Upload')
@Controller('upload')
export class UploadController {
  @AdminAuth(UserRole.ADMIN, UserRole.EDITOR)
  @ApiOperation({ summary: 'Fazer upload de um arquivo' })
  @ApiResponse({ status: 201, description: 'Upload realizado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Arquivo inválido.' })
  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          let folderName = (req.query.folder as string) || 'geral';
          if (!/^[a-zA-Z0-9_-]+$/.test(folderName)) {
            folderName = 'geral';
          }

          const uploadPath = join('./uploads', folderName);

          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }

          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueName = uuidv4() + extname(file.originalname);
          cb(null, uniqueName);
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowedMimeTypes = [
          'image/jpeg',
          'image/png',
          'image/gif',
          'image/webp',
          'application/pdf',
          'application/msword', // .doc
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
          'application/vnd.ms-excel', // .xls
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
          'text/csv', // .csv
          'application/zip', // .zip
          'application/x-zip-compressed', // .zip (windows)
          'application/vnd.rar', // .rar
          'application/x-rar-compressed', // .rar
          'application/vnd.ms-powerpoint', // .ppt
          'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
        ];

        if (!allowedMimeTypes.includes(file.mimetype)) {
          return cb(
            new BadRequestException(
              'Formato de arquivo não permitido pelas políticas de segurança do servidor.',
            ),
            false,
          );
        }
        cb(null, true);
      },
      limits: {
        fileSize: 100 * 1024 * 1024, // 100MB global
      },
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    if (!file) {
      throw new BadRequestException('Nenhum arquivo válido foi enviado.');
    }

    let folderName = (req.query.folder as string) || 'geral';
    if (!/^[a-zA-Z0-9_-]+$/.test(folderName)) {
      folderName = 'geral';
    }

    const optimize = req.query.optimize !== 'false';
    const isImage = file.mimetype.startsWith('image/');
    let finalFilename = file.filename;
    let finalMimetype = file.mimetype;

    if (isImage && optimize) {
      const uploadDir = join('./uploads', folderName);
      const webpFilename = uuidv4() + '.webp';
      const webpPath = join(uploadDir, webpFilename);

      await sharp(file.path)
        .resize({ width: 3840, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(webpPath);

      // Deleta a imagem original pesada que o multer salvou no disco
      await fs.promises.unlink(file.path).catch(() => null);

      finalFilename = webpFilename;
      finalMimetype = 'image/webp';
    }

    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${folderName}/${finalFilename}`;

    return {
      success: 1,
      file: {
        url: fileUrl,
        name: file.originalname,
        size: file.size,
        extension: extname(file.originalname).replace('.', ''),
      },
      filename: finalFilename,
      mimetype: finalMimetype,
    };
  }
}
