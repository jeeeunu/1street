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

import { AuthGuard } from '../auth/auth.guard';
import { AuthUser } from '../auth/auth.decorator';
import { ResultableInterface } from '../common/interfaces';
import { RequestUserInterface } from '../users/interfaces';
import { ShopCreateDto, ShopUpdateDto } from './dtos/index';
import { ShopsService } from './shops.service';
import { ShopsEntity } from '../common/entities';

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
    @AuthUser() authUser: RequestUserInterface,
  ): Promise<ResultableInterface> {
    //TODO:: 유저 아이디 받아오기
    return await this.shopsService.create(shopData, authUser);
  }

  //-- 스토어 수정 --//
  @Patch()
  @UseGuards(AuthGuard)
  async updateShop(
    @Body() shopData: ShopUpdateDto,
    @AuthUser() authUser: RequestUserInterface,
  ): Promise<ResultableInterface> {
    return await this.shopsService.update(shopData, authUser);
  }

  //-- 스토어 삭제 --//
  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteShop(
    @Param('id') shopId: number,
    @AuthUser() authUser: RequestUserInterface,
  ): Promise<ResultableInterface> {
    return await this.shopsService.delete(shopId, authUser);
  }
}
