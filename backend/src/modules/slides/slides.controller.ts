import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SlidesService } from './slides.service';
import { CreateSlideDto } from './dto/create-slide.dto';
import { UpdateSlideDto } from './dto/update-slide.dto';
import { AdminAuth } from '../../common/decorators/admin-auth.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtPayload } from '../../common/interfaces/request-user.interface';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { UserRole } from '@prisma/client';

@ApiTags('Slides')
@Controller()
export class SlidesController {
  constructor(private readonly slidesService: SlidesService) {}

  // === ROTAS PÚBLICAS ===
  @ApiOperation({ summary: 'Listar slides (Público)' })
  @ApiResponse({ status: 200, description: 'Lista de slides.' })
  @Get('slides')
  findAllPublic(@Query() paginationDto: PaginationDto) {
    return this.slidesService.findAllPublic(paginationDto);
  }

  // === ROTAS ADMINISTRATIVAS PROTEGIDAS ===
  @ApiOperation({ summary: 'Listar slides (Admin)' })
  @ApiResponse({ status: 200, description: 'Lista de slides.' })
  @Get('admin/slides')
  @AdminAuth(UserRole.ADMIN, UserRole.EDITOR)
  findAllAdmin(@Query() paginationDto: PaginationDto) {
    return this.slidesService.findAllAdmin(paginationDto);
  }

  @ApiOperation({ summary: 'Buscar slide por ID' })
  @ApiResponse({ status: 200, description: 'Slide encontrado.' })
  @ApiResponse({ status: 404, description: 'Slide não encontrado.' })
  @Get('admin/slides/:id')
  @AdminAuth(UserRole.ADMIN, UserRole.EDITOR)
  findOneAdmin(@Param('id') id: string) {
    return this.slidesService.findOne(id);
  }

  @ApiOperation({ summary: 'Criar novo slide' })
  @ApiResponse({ status: 201, description: 'Slide criado com sucesso.' })
  @Post('admin/slides')
  @AdminAuth(UserRole.ADMIN, UserRole.EDITOR)
  create(
    @Body() createSlideDto: CreateSlideDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.slidesService.create(createSlideDto, user.id);
  }

  @ApiOperation({ summary: 'Atualizar slide' })
  @ApiResponse({ status: 200, description: 'Slide atualizado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Slide não encontrado.' })
  @Patch('admin/slides/:id')
  @AdminAuth(UserRole.ADMIN, UserRole.EDITOR)
  update(@Param('id') id: string, @Body() updateSlideDto: UpdateSlideDto) {
    return this.slidesService.update(id, updateSlideDto);
  }

  @ApiOperation({ summary: 'Remover slide' })
  @ApiResponse({ status: 200, description: 'Slide removido com sucesso.' })
  @ApiResponse({ status: 404, description: 'Slide não encontrado.' })
  @Delete('admin/slides/:id')
  @AdminAuth(UserRole.ADMIN, UserRole.EDITOR)
  remove(@Param('id') id: string) {
    return this.slidesService.remove(id);
  }
}
