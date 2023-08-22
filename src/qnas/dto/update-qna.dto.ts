import { PartialType } from '@nestjs/mapped-types';
import { QnaCreateDto } from './create-qna.dto';

export class QnaUpdateDto extends PartialType(QnaCreateDto) {}
