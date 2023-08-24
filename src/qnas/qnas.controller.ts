import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { QnasService } from './qnas.service';
import { CreateQnasDto } from './dto/create-qna.dto';
import { UpdateQnasDto } from './dto/update-qna.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthUser } from 'src/auth/auth.decorator';
import { RequestUserInterface } from 'src/users/interfaces';
import { ResultableInterface } from 'src/common/interfaces';
import { QnasEntity } from 'src/common/entities/qnas.entity';

@Controller('qnas')
export class QnasController {
  constructor(private readonly qnasService: QnasService) {}

  // QNA 조회
  @Get()
  @UseGuards(AuthGuard)
  async getQnas(
    @Query('product_id') productId?: number,
  ): Promise<QnasEntity[]> {
    if (productId) {
      // product_id를 사용하여 Q&A 항목을 조회하는 서비스 메서드를 호출
      return await this.qnasService.getForProduct(productId);
    }
    return [];
  }

  // QNA 등록
  @Post('/qnas')
  @UseGuards(AuthGuard)
  async createQna(
    @Body() data: CreateQnasDto,
    @AuthUser() authUser: RequestUserInterface,
  ): Promise<ResultableInterface> {
    return await this.qnasService.create(data, authUser);
  }

  // QNA 수정
  @Patch()
  @UseGuards(AuthGuard)
  async updateQna(
    @Body() qnaData: UpdateQnasDto,
    @AuthUser() authUser: RequestUserInterface,
  ): Promise<ResultableInterface> {
    return await this.qnasService.update(qnaData, authUser);
  }

  // QNA 삭제
  @Delete('/qnas/:qna_id')
  @UseGuards(AuthGuard)
  async deleteQna(
    @Param('id') qnaId: number,
    @AuthUser() authUser: RequestUserInterface,
  ): Promise<ResultableInterface> {
    return await this.qnasService.delete(qnaId, authUser);
  }
}
