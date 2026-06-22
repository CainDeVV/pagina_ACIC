import { PartialType } from '@nestjs/swagger';
import { CreateAssociadoDto } from './create-associado.dto';

export class UpdateAssociadoDto extends PartialType(CreateAssociadoDto) {}
