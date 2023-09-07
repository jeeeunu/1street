import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AuthUser } from '../auth/auth.decorator';
import { AuthGuard } from '../auth/auth.guard';
import { ProductsEntity } from '../common/entities/products.entity';
import { ResultableInterface } from '../common/interfaces';
import { RequestUserInterface } from '../users/interfaces';
import { ProductCreateDto, ProductUpdateDto } from './dtos';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  //-- 유저단 : 상품 전체보기 --//
  @Get()
  async getProducts(
    @Query('limit') limit: number,
    @Query('cursor') cursor: number,
  ): Promise<ProductsEntity[]> {
    return this.productsService.findAll(limit, cursor);
  }

  //-- 검색 --//
  @Get('search')
  async getSearchProducts(
    @Query('keyword') keyword: string,
    @Query('categoryId') categoryId: number,
    @Query('limit') limit: number,
    @Query('cursor') cursor: number,
    @Query('sort')
    sort: 'asc' | 'desc' | 'lowPrice' | 'highPrice' | 'sales' | 'latest',
  ): Promise<ProductsEntity[]> {
    return this.productsService.findByKeyword(
      limit,
      cursor,
      keyword,
      categoryId,
      sort,
    );
  }

  //-- 상품 상세보기 --//
  @Get(':id')
  async getDetail(@Param('id') id: number): Promise<ProductsEntity> {
    return await this.productsService.findById(id);
  }

  //-- 상품 등록 --//
  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(FilesInterceptor('files'))
  async createProduct(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() data: ProductCreateDto,
    @AuthUser() authUser: RequestUserInterface,
  ): Promise<ResultableInterface> {
    return await this.productsService.create(data, authUser, files);
  }

  //-- 상품 수정 --//
  @Put(':id')
  @UseGuards(AuthGuard)
  @UseInterceptors(FilesInterceptor('files'))
  async updateProduct(
    @Param('id') productId: number,
    @Body() data: ProductUpdateDto,
    @UploadedFiles() files: Express.Multer.File[],
    // @AuthUser() authUser: RequestUserInterface,
  ): Promise<ResultableInterface> {
    return await this.productsService.update(productId, data, files);
  }

  //-- 상품 삭제 --//
  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteProduct(@Param('id') id: number): Promise<ResultableInterface> {
    return await this.productsService.delete(id);
  }
}
