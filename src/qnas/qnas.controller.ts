import {
  Body,
  Controller,
  Delete,
  Get,
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
  // @Get('product/:product_id')
  // @UseGuards(AuthGuard)
  // async getQnasForProduct(
  //   @Query('product_id') productId: number,
  // ): Promise<QnasEntity[]> {
  //   return await this.qnasService.getForProduct(productId);
  // }

  // QNA 조회 (shop_id)
  // shop을 또 어떻게 표현해줘야할까 직접적으로 qna에 심어주자니 너무 넓어지는것 같고
  // 직접 그렇게 하는것보다
  // shop -> product -> qna의 관계를 끌어와서 검색할 수 있으면 좋을텐데
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
}
