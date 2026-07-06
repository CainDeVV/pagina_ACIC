import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import { ApiBearerAuth, ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Upload')
@Controller('upload')
export class UploadController {
  // ROTA ADMINISTRATIVA PROTEGIDA — mesmo padrão de eventos.controller.ts e servicos.controller.ts
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
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
          // Previne Directory Traversal e caracteres estranhos
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
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp|pdf)$/)) {
          return cb(
            new BadRequestException(
              'Apenas arquivos de imagem e PDF são permitidos!',
            ),
            false,
          );
        }
        cb(null, true);
      },
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    if (!file) {
      throw new BadRequestException('Nenhum arquivo válido foi enviado.');
    }

    let folderName = (req.query.folder as string) || 'geral';
    if (!/^[a-zA-Z0-9_-]+$/.test(folderName)) {
      folderName = 'geral';
    }

    // Retorna o caminho RELATIVO — o frontend monta a URL completa via VITE_API_URL
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${folderName}/${file.filename}`;

    return {
      success: 1,
      file: {
        url: fileUrl,
      },
      filename: file.filename,
      mimetype: file.mimetype,
    };
  }
}
