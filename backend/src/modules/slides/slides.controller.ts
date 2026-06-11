import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SlidesService } from './slides.service';
import { CreateSlideDto } from './dto/create-slide.dto';
import { UpdateSlideDto } from './dto/update-slide.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Slides')
@Controller()
export class SlidesController {
  constructor(private readonly slidesService: SlidesService) {}

  // ROTAS PÚBLICAS (Sem cadeado no Swagger)
  @Get('slides')
  findAll() {
    return this.slidesService.findAll();
  }

  @Get('slides/:id')
  findOne(@Param('id') id: string) {
    return this.slidesService.findOne(id);
  }

  // ROTAS ADMINISTRATIVAS PROTEGIDAS
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @Post('admin/slides')
  create(@Body() createSlideDto: CreateSlideDto, @CurrentUser() user: any) {
    return this.slidesService.create(createSlideDto, user.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @Patch('admin/slides/:id')
  update(@Param('id') id: string, @Body() updateSlideDto: UpdateSlideDto) {
    return this.slidesService.update(id, updateSlideDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @Delete('admin/slides/:id')
  remove(@Param('id') id: string) {
    return this.slidesService.remove(id);
  }
}