import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'supertest';
import { AuthGuard } from '../auth/auth.guard';
import { ResultableInterface } from '../common/interfaces';
import { RequestUserInterface } from '../users/interfaces';
import { ShopCreateDto, ShopUpdateDto } from './dto/index';
import { ShopsEntity } from './entities/shops.entity';
import { ShopsService } from './shops.service';

@Controller('shops')
export class ShopsController {
  constructor(private readonly shopsService: ShopsService) {}

  //-- 스토어 상세보기 --//
  @Get(':id')
  async findShop(@Param('id') id: number): Promise<ShopsEntity> {
    return await this.shopsService.find(id);
  }

  //-- 스토어 생성 --//
  @Post()
  @UseGuards(AuthGuard)
  async createShop(
    @Body() shopData: ShopCreateDto,
    @Req() req: Request,
  ): Promise<ResultableInterface> {
    const authUser: RequestUserInterface = req['user'];
    //TODO:: 유저 아이디 받아오기
    return await this.shopsService.create(shopData, authUser);
  }

  //-- 스토어 수정 --//
  @Patch()
  @UseGuards(AuthGuard)
  async updateShop(
    @Body() shopData: ShopUpdateDto,
    @Req() req: RequestUserInterface,
  ): Promise<ResultableInterface> {
    const authUser: RequestUserInterface = req['user'];
    return await this.shopsService.update(shopData, authUser);
  }

  //-- 스토어 삭제 --//
  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteShop(
    @Param('id') shopId: number,
    @Req() req: RequestUserInterface,
  ): Promise<ResultableInterface> {
    const authUser = req['user'];
    return await this.shopsService.delete(shopId, authUser);
  }
}
