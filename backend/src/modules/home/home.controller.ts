import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { HomeService } from './home.service';

@ApiTags('Home (BFF)')
@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Get()
  @ApiOperation({
    summary: 'Busca hiper-otimizada (BFF) com os Destaques da Home.',
  })
  async getDestaques() {
    return this.homeService.getDestaques();
  }
}
