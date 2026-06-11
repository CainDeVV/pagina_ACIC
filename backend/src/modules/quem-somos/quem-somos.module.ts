import { Module } from '@nestjs/common';
import { QuemSomosService } from './quem-somos.service';
import { QuemSomosController } from './quem-somos.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [QuemSomosController],
  providers: [QuemSomosService],
})
export class QuemSomosModule {}
