import { Controller, Post, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';

@ApiTags('Upload') // Cria uma seção bonitinha e organizada no Swagger
@Controller('admin/upload') // Removemos o 'api/' daqui porque o main.ts já coloca automaticamente
export class UploadController {
  @Post()
  @ApiConsumes('multipart/form-data') // Avisa o Swagger que é um formulário de arquivo
  @ApiBody({                          // Cria o botão visual de "Choose File"
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
        destination: './uploads', // Pasta raiz que criamos no docker-compose
        filename: (req, file, cb) => {
          // Gera um nome único: ex: "123e4567-e89b-12d3.jpg"
          const uniqueName = uuidv4() + extname(file.originalname);
          cb(null, uniqueName);
        },
      }),
      fileFilter: (req, file, cb) => {
        // Trava de segurança: Bloqueia executáveis e scripts maliciosos
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp|pdf)$/)) {
          return cb(new BadRequestException('Apenas arquivos de imagem e PDF são permitidos!'), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 10 * 1024 * 1024, // Limite de 10MB por arquivo
      },
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Nenhum arquivo válido foi enviado.');
    }

    // Constrói a URL completa que será salva no banco de dados e enviada ao React
    const fileUrl = `http://localhost:3000/uploads/${file.filename}`;
    
    return {
      message: 'Arquivo processado com sucesso',
      url: fileUrl,
      filename: file.filename,
      mimetype: file.mimetype,
    };
  }
}