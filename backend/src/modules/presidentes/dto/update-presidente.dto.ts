import { PartialType } from '@nestjs/swagger';
import { CreatePresidenteDto } from './create-presidente.dto';

export class UpdatePresidenteDto extends PartialType(CreatePresidenteDto) {}