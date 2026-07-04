import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  UseGuards,
  Req
} from '@nestjs/common';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
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
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueName = uuidv4() + extname(file.originalname);
          cb(null, uniqueName);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp|pdf)$/)) {
          return cb(
            new BadRequestException('Apenas arquivos de imagem e PDF são permitidos!'),
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

    // Retorna o caminho RELATIVO — o frontend monta a URL completa via VITE_API_URL
    // (já configurado em frontend/src/services/api.js)
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;

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