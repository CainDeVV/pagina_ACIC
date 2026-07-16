import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { HomeService } from './home.service';

@ApiTags('Home (BFF)')
@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Get()
  @UseInterceptors(CacheInterceptor)
  @ApiOperation({
    summary: 'Busca hiper-otimizada (BFF) com os Destaques da Home.',
  })
  async getDestaques() {
    return this.homeService.getDestaques();
  }
}
