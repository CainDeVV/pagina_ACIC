import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PresidentesService } from './presidentes.service';
import { CreatePresidenteDto } from './dto/create-presidente.dto';
import { UpdatePresidenteDto } from './dto/update-presidente.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller()
export class PresidentesController {
  constructor(private readonly presidentesService: PresidentesService) {}

  @Get('presidentes')
  findAll() {
    return this.presidentesService.findAll();
  }

  @Get('presidentes/:id')
  findOne(@Param('id') id: string) {
    return this.presidentesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @Post('admin/presidentes')
  create(@Body() createPresidenteDto: CreatePresidenteDto) {
    return this.presidentesService.create(createPresidenteDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @Patch('admin/presidentes/:id')
  update(@Param('id') id: string, @Body() updatePresidenteDto: UpdatePresidenteDto) {
    return this.presidentesService.update(id, updatePresidenteDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @Delete('admin/presidentes/:id')
  remove(@Param('id') id: string) {
    return this.presidentesService.remove(id);
  }
}
