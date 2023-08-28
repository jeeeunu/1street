import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AuthUser } from '../auth/auth.decorator';
import { AuthGuard } from '../auth/auth.guard';
import { ProductsEntity } from '../common/entities/products.entity';
import { ResultableInterface } from '../common/interfaces';
import { RequestUserInterface } from '../users/interfaces';
import { ProductCreateDto, ProductUpdateDto } from './dtos';
import { ProductsService } from './products.service';
import { PaginationDto } from 'src/common/dtos';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  //-- 유저단 : 상품 전체보기 --//
  @Get()
  @UsePipes(ValidationPipe)
  async getProducts(
    @Query() paginationDto: PaginationDto,
  ): Promise<ProductsEntity[]> {
    return this.productsService.findAll(paginationDto);
  }

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
  // @Get('search/:category')
  // async searchCategory(
  //   @Param('category') category: number,
  // ): Promise<ProductsEntity[]> {
  //   return await this.productsService.findByCategory(category);
  // }

  //-- 상품 등록 --//
  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(FilesInterceptor('files'))
  async createProduct(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() data: ProductCreateDto,
    @AuthUser() authUser: RequestUserInterface,
  ): Promise<ResultableInterface> {
    console.log(files);
    console.log(data);
    return await this.productsService.create(data, authUser, files);
  }

  //-- 상품 수정 --//
  @Patch(':id')
  @UseGuards(AuthGuard)
  @UseInterceptors(FilesInterceptor('files'))
  async updateProduct(
    @Param('id') productId: number,
    @Body() data: ProductUpdateDto,
    @UploadedFiles() files: Express.Multer.File[],
    // @AuthUser() authUser: RequestUserInterface,
  ): Promise<ResultableInterface> {
    console.log(files);
    console.log(data);
    return await this.productsService.update(productId, data, files);
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
