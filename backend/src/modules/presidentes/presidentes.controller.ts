import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PresidentesService } from './presidentes.service';
import { CreatePresidenteDto } from './dto/create-presidente.dto';
import { UpdatePresidenteDto } from './dto/update-presidente.dto';
import { AdminAuth } from '../../common/decorators/admin-auth.decorator';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { UserRole } from '@prisma/client';

@ApiTags('Presidentes')
@Controller()
export class PresidentesController {
  constructor(private readonly presidentesService: PresidentesService) {}

  @Get('presidentes')
  findAllPublic(@Query() paginationDto: PaginationDto) {
    return this.presidentesService.findAllPublic(paginationDto);
  }

  @Get('admin/presidentes')
  @AdminAuth(UserRole.ADMIN, UserRole.EDITOR)
  findAllAdmin(@Query() paginationDto: PaginationDto) {
    return this.presidentesService.findAllAdmin(paginationDto);
  }

  @Get('admin/presidentes/:id')
  @AdminAuth(UserRole.ADMIN, UserRole.EDITOR)
  findOne(@Param('id') id: string) {
    return this.presidentesService.findOne(id);
  }

  @Post('admin/presidentes')
  @AdminAuth(UserRole.ADMIN, UserRole.EDITOR)
  create(@Body() createPresidenteDto: CreatePresidenteDto) {
    return this.presidentesService.create(createPresidenteDto);
  }

  @Patch('admin/presidentes/:id')
  @AdminAuth(UserRole.ADMIN, UserRole.EDITOR)
  update(@Param('id') id: string, @Body() updatePresidenteDto: UpdatePresidenteDto) {
    return this.presidentesService.update(id, updatePresidenteDto);
  }

  @Delete('admin/presidentes/:id')
  @AdminAuth(UserRole.ADMIN, UserRole.EDITOR)
  remove(@Param('id') id: string) {
    return this.presidentesService.remove(id);
  }
}