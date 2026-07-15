import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AssociadosService } from './associados.service';
import { CreateAssociadoDto } from './dto/create-associado.dto';
import { UpdateAssociadoDto } from './dto/update-associado.dto';
import { AdminAuth } from '../../common/decorators/admin-auth.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtPayload } from '../../common/interfaces/request-user.interface';

@ApiTags('Associados')
@AdminAuth()
@Controller('associados')
export class AssociadosController {
  constructor(private readonly associadosService: AssociadosService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Criar um novo associado (Apenas Admin)' })
  create(@Body() createAssociadoDto: CreateAssociadoDto) {
    return this.associadosService.create(createAssociadoDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @ApiOperation({ summary: 'Listar todos os associados' })
  findAll() {
    return this.associadosService.findAll();
  }

  @Get('me')
  @Roles(UserRole.ASSOCIADO, UserRole.ADMIN)
  @ApiOperation({ summary: 'Obter dados da empresa do usuário logado' })
  findMe(@CurrentUser() user: JwtPayload) {
    return this.associadosService.findByUserId(user.id);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @ApiOperation({ summary: 'Buscar um associado por ID' })
  findOne(@Param('id') id: string) {
    return this.associadosService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.ASSOCIADO)
  @ApiOperation({ summary: 'Atualizar um associado' })
  update(
    @Param('id') id: string,
    @Body() updateAssociadoDto: UpdateAssociadoDto,
  ) {
    return this.associadosService.update(id, updateAssociadoDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Remover um associado' })
  remove(@Param('id') id: string) {
    return this.associadosService.remove(id);
  }
}
