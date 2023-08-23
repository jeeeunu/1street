import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthUser } from '../auth/auth.decorator';
import { AuthGuard } from '../auth/auth.guard';
import { ProductsEntity } from '../common/entities';
import { ResultableInterface } from '../common/interfaces';
import { RequestUserInterface } from '../users/interfaces';
import { ProductCreateDto, ProductUpdateDto } from './dto';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  //-- 상품 상세보기 --//
  @Get(':id')
  async getDetail(@Param('id') id: number): Promise<ProductsEntity> {
    return await this.productsService.findById(id);
  }
  //-- 상품 검색 (검색어)--//
  @Get()
  async searchKeyword(
    @Query('search') keyword: string,
  ): Promise<ProductsEntity[]> {
    return await this.productsService.findByKeyword(keyword);
  }

  //-- 상품 검색 (카테고리 번호)--//
  @Get('search/:category')
  async searchCategory(
    @Param('category') category: number,
  ): Promise<ProductsEntity[]> {
    return await this.productsService.findByCategory(category);
  }

  //-- 상품 등록 --//
  @Post()
  @UseGuards(AuthGuard)
  async createProduct(
    @Body() data: ProductCreateDto,
    @AuthUser() authUser: RequestUserInterface,
  ): Promise<ResultableInterface> {
    return await this.productsService.create(data, authUser);
  }

  //-- 상품 수정 --//
  @Post(':id')
  @UseGuards(AuthGuard)
  async updateProduct(
    @Param('id') id: number,
    @Body() data: ProductUpdateDto,
    @AuthUser() authUser: RequestUserInterface,
  ): Promise<ResultableInterface> {
    return await this.productsService.update(id, data, authUser);
  }
  //-- 상품 삭제 --//
  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteProduct(
    @Param('id') id: number,
    @AuthUser() authUser: RequestUserInterface,
  ): Promise<ResultableInterface> {
    return await this.productsService.delete(id, authUser);
  }

  //-- 카테고리 만들기 (개발용) --//
  //   @Post('category')
  //   async category(@Body() data) {
  //     return await this.productsService.category(data);
  //   }
}
