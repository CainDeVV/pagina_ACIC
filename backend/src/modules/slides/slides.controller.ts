import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SlidesService } from './slides.service';
import { CreateSlideDto } from './dto/create-slide.dto';
import { UpdateSlideDto } from './dto/update-slide.dto';
import { AdminAuth } from '../../common/decorators/admin-auth.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { UserRole } from '@prisma/client';

@ApiTags('Slides')
@Controller()
export class SlidesController {
  constructor(private readonly slidesService: SlidesService) {}

  // === ROTAS PÚBLICAS ===
  @Get('slides')
  findAllPublic(@Query() paginationDto: PaginationDto) {
    return this.slidesService.findAllPublic(paginationDto);
  }

  // === ROTAS ADMINISTRATIVAS PROTEGIDAS ===
  @Get('admin/slides')
  @AdminAuth(UserRole.ADMIN, UserRole.EDITOR)
  findAllAdmin(@Query() paginationDto: PaginationDto) {
    return this.slidesService.findAllAdmin(paginationDto);
  }

  @Get('admin/slides/:id')
  @AdminAuth(UserRole.ADMIN, UserRole.EDITOR)
  findOneAdmin(@Param('id') id: string) {
    return this.slidesService.findOne(id);
  }

  @Post('admin/slides')
  @AdminAuth(UserRole.ADMIN, UserRole.EDITOR)
  create(@Body() createSlideDto: CreateSlideDto, @CurrentUser() user: any) {
    return this.slidesService.create(createSlideDto, user.id);
  }

  @Patch('admin/slides/:id')
  @AdminAuth(UserRole.ADMIN, UserRole.EDITOR)
  update(@Param('id') id: string, @Body() updateSlideDto: UpdateSlideDto) {
    return this.slidesService.update(id, updateSlideDto);
  }

  @Delete('admin/slides/:id')
  @AdminAuth(UserRole.ADMIN, UserRole.EDITOR)
  remove(@Param('id') id: string) {
    return this.slidesService.remove(id);
  }
}