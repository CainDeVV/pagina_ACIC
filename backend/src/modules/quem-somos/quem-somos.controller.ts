import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { QuemSomosService } from './quem-somos.service';
import { CreateQuemSomosDto } from './dto/create-quem-somos.dto';
import { UpdateQuemSomosDto } from './dto/update-quem-somos.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Institucional')
@Controller()
export class QuemSomosController {
  constructor(private readonly quemSomosService: QuemSomosService) {}

  // ROTA PÚBLICA
  @Get('quem-somos')
  findAll() {
    return this.quemSomosService.findAll();
  }

  // ROTA PÚBLICA: Busca flexível por ID ou por KEY (Ex: /api/quem-somos/cmec)
  @Get('quem-somos/:idOrKey')
  findOne(@Param('idOrKey') idOrKey: string) {
    return this.quemSomosService.findOne(idOrKey);
  }

  // ROTAS ADMINISTRATIVAS
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @Post('admin/quem-somos')
  create(@Body() createQuemSomosDto: CreateQuemSomosDto) {
    return this.quemSomosService.create(createQuemSomosDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @Patch('admin/quem-somos/:id')
  update(@Param('id') id: string, @Body() updateQuemSomosDto: UpdateQuemSomosDto) {
    return this.quemSomosService.update(id, updateQuemSomosDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @Delete('admin/quem-somos/:id')
  remove(@Param('id') id: string) {
    return this.quemSomosService.remove(id);
  }
}