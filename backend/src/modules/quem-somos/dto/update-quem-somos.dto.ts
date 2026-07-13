import { PartialType } from '@nestjs/swagger';
import { CreateQuemSomosDto } from './create-quem-somos.dto';

export class UpdateQuemSomosDto extends PartialType(CreateQuemSomosDto) {}
