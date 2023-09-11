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
  // shop을 또 어떻게 표현해줘야할까 직접적으로 qna에 심어주자니 너무 넓어지는것 같고
  // 직접 그렇게 하는것보다
  // shop -> product -> qna의 관계를 끌어와서 검색할 수 있으면 좋을텐데
  // product 정보를 불러왔을때 shop_id 정보를 받아올 수 있다.
  // product를 등록할 때 포함되는 정보에 shop_id가 포함되기 때문에
  // @Get('shop/:shop_id')
  // async getQnasForShop(
  //   @Param('shop_id') shopId: number,
  // ): Promise<QnasEntity[]> {
  //   return await this.qnasService.findByShopId(shopId);
  // }

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

  @Post(':id/answer')
  @UseGuards(AuthGuard)
  async createQnaAnswer(
    @Param('id') qnaId: number,
    @Body() createQnaAnswerDto: CreateQnaAnswerDto,
  ): Promise<ResultableInterface> {
    try {
      const { answerContent } = createQnaAnswerDto;
      await this.qnasService.createQnaAnswer(qnaId, answerContent);
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
    return await this.qnasService.getQnaAnswer(qnaId);
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
