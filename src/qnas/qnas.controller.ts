import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
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
import { CreateQnaAnswerDto } from './dtos/create-qna-answer.dto';
import { QnaAnswerEntity } from './entities/qna-answer.entity';
import { UpdateQnaAnswerDto } from './dtos/update-qna-answer.dto';

@Controller('qnas')
export class QnasController {
  constructor(private readonly qnasService: QnasService) {}

  // QNA 등록
  @Post()
  @UseGuards(AuthGuard)
  async createQna(
    // @Param('id') id: number, //
    @Body() data: CreateQnasDto,
    @AuthUser() authUser: RequestUserInterface,
  ): Promise<ResultableInterface> {
    // const productId = data.product_id;
    // const qnaName = data.qna_name;
    // const qnaContent = data.qna_content;
    return await this.qnasService.create(data, authUser);
    //, productId);
  }

  // QNA 조회 (qna_id)
  @Get(':id')
  @UseGuards(AuthGuard)
  async getDetail(@Param('id') id: number): Promise<QnasEntity> {
    return await this.qnasService.findById(id);
  }

  // QNA 조회 (product_id)
  @Get('product/:product_id')
  @UseGuards(AuthGuard)
  async getQnasForProduct(
    @Param('product_id') productId: number,
  ): Promise<QnasEntity[]> {
    return await this.qnasService.getForProduct(productId);
  }

  // QNA 조회 (user_id)
  @Get('user/:user_id')
  @UseGuards(AuthGuard)
  async getForUser(@Param('user_id') userId: number): Promise<QnasEntity[]> {
    return await this.qnasService.getForUser(userId);
  }

  // QNA 조회 (shop_id)
  @Get('shop/:shop_id')
  @UseGuards(AuthGuard)
  async getForShop(@Param('shop_id') shopId: number): Promise<QnasEntity[]> {
    return await this.qnasService.getForShop(shopId);
  }

  // QNA 개수 세기 (user_id)
  @Get('count/:userId')
  async getQnaCount(@Param('user_id') userId: number): Promise<number> {
    const qnaCount = await this.qnasService.getQnaCount(userId);
    return qnaCount;
  }

  // QNA 수정
  @Patch(':id')
  @UseGuards(AuthGuard)
  async updateQna(
    @Param('id') qnaId: number,
    @Body() data: UpdateQnasDto,
  ): Promise<ResultableInterface> {
    return await this.qnasService.update(qnaId, data);
  }

  // QNA 삭제
  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteQna(@Param('id') id: number): Promise<ResultableInterface> {
    return await this.qnasService.delete(id);
  }

  // QnaAnswer 등록
  @Post(':id/answer')
  @UseGuards(AuthGuard)
  async createQnaAnswer(
    @Param('id') qnaId: number,
    @Body() createQnaAnswerDto: CreateQnaAnswerDto,
  ): Promise<ResultableInterface> {
    try {
      const { shop_id, answerContent } = createQnaAnswerDto;
      await this.qnasService.createQnaAnswer(qnaId, shop_id, answerContent);
      return { status: true, message: 'QNA 답변이 등록되었습니다.' };
    } catch (e) {
      return {
        status: false,
        message: 'QNA 답변 등록 중 오류가 발생했습니다.',
      };
    }
  }

  // QnaAnswer 조회 (qna_id로)
  @Get(':id/answers')
  async getQnaAnswers(@Param('id') qnaId: number): Promise<QnaAnswerEntity[]> {
    const qnaAnswers = await this.qnasService.getQnaAnswer(qnaId);
    const qnaStatus = qnaAnswers.length > 0 ? '답변 완료' : '답변 대기중';

    // 상태를 추가하여 반환
    return qnaAnswers.map((qnaAnswer) => ({ ...qnaAnswer, status: qnaStatus }));
  }

  // QnaAnswer 조회 (shop_id로)
  @Get('answers/shops/:shop_id')
  async getQnaAnswerByShopId(
    @Param('shop_id') shopId: number,
  ): Promise<QnaAnswerEntity[]> {
    try {
      return await this.qnasService.getQnaAnswerByShopId(shopId);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  // QnaAnswer 조회 (answer_id로)
  @Get('answers/:answer_id')
  async getQnaAnswerById(
    @Param('answer_id') answerId: number,
  ): Promise<QnaAnswerEntity> {
    try {
      return await this.qnasService.getQnaAnswerById(answerId);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  // QnaAnswer 수정
  @Patch('answers/:answerId')
  async updateQnaAnswer(
    @Param('answerId') answerId: number,
    @Body() updateQnaAnswerDto: UpdateQnaAnswerDto,
  ): Promise<ResultableInterface> {
    const { answerContent } = updateQnaAnswerDto;
    return await this.qnasService.updateQnaAnswer(answerId, answerContent);
  }

  // QnaAnswer 삭제
  @Delete('answers/:answerId')
  async deleteQnaAnswer(
    @Param('answerId') answerId: number,
  ): Promise<ResultableInterface> {
    return await this.qnasService.deleteQnaAnswer(answerId);
  }
}
