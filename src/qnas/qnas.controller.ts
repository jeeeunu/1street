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
import { CreateQnasDto } from './dtos/create-qna.dto';
import { UpdateQnasDto } from './dtos/update-qna.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthUser } from 'src/auth/auth.decorator';
import { RequestUserInterface } from 'src/users/interfaces';
import { ResultableInterface } from 'src/common/interfaces';
import { QnasEntity } from 'src/common/entities/qnas.entity';

@Controller('qnas')
export class QnasController {
  constructor(private readonly qnasService: QnasService) {}

  // QNA 등록
  @Post()
  @UseGuards(AuthGuard)
  async createQna(
    @Param('id') id: number, //
    @Body() data: CreateQnasDto,
    @AuthUser() authUser: RequestUserInterface,
  ): Promise<ResultableInterface> {
    // const productId = data.product_id;
    return await this.qnasService.create(id, data, authUser);
    //, productId);
  }

  // QNA 조회 (product_id)
  @Get()
  @UseGuards(AuthGuard)
  async getQnas(@Query('product_id') productId: number): Promise<QnasEntity[]> {
    if (productId) {
      // product_id를 사용하여 Q&A 항목을 조회하는 서비스 메서드를 호출
      return await this.qnasService.getForProduct(productId);
    }
    return [];
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
