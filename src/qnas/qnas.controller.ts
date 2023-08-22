import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { QnaService } from './qnas.service';
import { QnaCreateDto } from './dto/create-qna.dto';
import { QnaUpdateDto } from './dto/update-qna.dto';

@Controller('qnas')
export class QnasController {
  constructor(private readonly qnasService: QnaService) {}

  // qna 조회
  @Get('/qnas/:product_id')
  async getQnasById(@Param('id') productId: number) {
    return await this.qnasService.getQnasById(productId);
  }

  // qna 등록
  @Post('/qnas')
  createQna(@Body() data: QnaCreateDto) {
    return this.qnasService.createQna(data.name, data.content);
  }

  // qna 수정
  @Patch('/qnas/:qna_id')
  async updateQna(@Param('id') qnaId: number, @Body() data: QnaUpdateDto) {
    return await this.qnasService.updateQna(qnaId, data.name, data.content);
  }

  // qna 삭제
  @Delete('/qnas/:qna_id')
  async deleteQna(@Param('id') qnaId: number) {
    return await this.qnasService.deleteQna(qnaId);
  }
}
