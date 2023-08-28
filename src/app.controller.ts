import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { UserService } from './users/users.service';
import { AuthUser } from './auth/auth.decorator';
import { RequestUserInterface } from './users/interfaces';
import { ShopsService } from './shops/shops.service';
import { ProductsService } from './products/products.service';

@Controller()
export class AppController {
  constructor(
    private readonly userService: UserService,
    private readonly shopsService: ShopsService,
    private readonly productsService: ProductsService,
  ) {}

  //-- 공통 : admin --//
  async adminPageData(authUser: RequestUserInterface, response: Response) {
    if (!authUser.isAdmin) {
      response.status(403).render('error-page', {
        errorMessage: '접근이 불가능합니다.',
      });
      return;
    }

    const userInfo = await this.userService.find(authUser.user_id);
    const user = userInfo.results;
    const shop = await this.shopsService.findByUserId(authUser.user_id);

    return { user, shop };
  }

  //-- 메인 페이지 --//
  @Get()
  main(
    @AuthUser() authUser: RequestUserInterface,
    @Req() request: Request,
    @Res() response: Response,
  ): void {
    const isIndexPath = request.url === '/';

    console.log(authUser);
    if (authUser && authUser !== null && authUser.isAdmin === true) {
      return response.redirect('admin-my-page');
    }
    response.render('index', {
      isIndexPath,
      authUser,
    });
  }

  //-- 회원가입 --//
  @Get('sign-up')
  singUp(
    @AuthUser() authUser: RequestUserInterface,
    @Req() request: Request,
    @Res() response: Response,
  ): void {
    const isIndexPath = request.url === '/';

    response.render('sign-up', {
      isIndexPath,
      authUser,
    });
  }

  //-- 로그인 --//
  @Get('sign-in')
  singIn(
    @AuthUser() authUser: RequestUserInterface,
    @Req() request: Request,
    @Res() response: Response,
  ): void {
    const isIndexPath = request.url === '/';
    response.render('sign-in', {
      isIndexPath,
      authUser,
    });
  }

  //-- 회원정보 수정 --//
  @Get('my-page-user-edit')
  async userEdit(
    @AuthUser() authUser: RequestUserInterface,
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<void> {
    const isIndexPath = request.url === '/';
    const userInfo = await this.userService.find(authUser.user_id);
    const user = userInfo.results;
    response.render('my-page-user-edit', {
      isIndexPath,
      authUser,
      user,
    });
  }

  //-- 마이 페이지 --//
  @Get('my-page')
  async myPage(
    @AuthUser() authUser: RequestUserInterface,
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<void> {
    const isIndexPath = request.url === '/';
    const userInfo = await this.userService.find(authUser.user_id);
    const user = userInfo.results;
    response.render('my-page', {
      isIndexPath,
      authUser,
      user,
    });
  }

  //-- 장바구니 --//
  @Get('cart')
  cart(
    @AuthUser() authUser: RequestUserInterface,
    @Req() request: Request,
    @Res() response: Response,
  ): void {
    const isIndexPath = request.url === '/';
    response.render('cart', {
      isIndexPath,
      authUser,
    });
  }

  //-- 상품 상세보가 --//
  @Get('product-detail')
  productDetail(
    @AuthUser() authUser: RequestUserInterface,
    @Req() request: Request,
    @Res() response: Response,
  ): void {
    const isIndexPath = request.url === '/';
    response.render('product-detail', {
      isIndexPath,
      authUser,
    });
  }

  //-- admin : 메인 - 마이 페이지 --//
  @Get('admin-my-page')
  async adminMyPage(
    @AuthUser() authUser: RequestUserInterface,
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<void> {
    const { user, shop } = await this.adminPageData(authUser, response);
    const products = await this.productsService.findRegisteredAll(
      authUser.shop_id,
    );
    response.render('admin-my-page', {
      authUser,
      user,
      shop,
      products,
    });
  }

  //-- admin : 스토어 등록 --//
  @Get('admin-create-store')
  async adminCreateStore(
    @AuthUser() authUser: RequestUserInterface,
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<void> {
    const { user, shop } = await this.adminPageData(authUser, response);
    response.render('admin-create-store', {
      authUser,
      user,
      shop,
    });
  }

  //-- admin : 스토어 정보 수정 --//
  @Get('admin-edit-store')
  async adminEditStore(
    @AuthUser() authUser: RequestUserInterface,
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<void> {
    const { user, shop } = await this.adminPageData(authUser, response);
    response.render('admin-edit-store', {
      authUser,
      user,
      shop,
    });
  }

  //-- admin : 상품 등록 --//
  @Get('admin-create-product')
  async adminCreateProduct(
    @AuthUser() authUser: RequestUserInterface,
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<void> {
    const { user, shop } = await this.adminPageData(authUser, response);
    response.render('admin-create-product', {
      authUser,
      user,
      shop,
    });
  }

  //-- admin : 상품 수정 --//
  @Get('admin-edit-product/:product_id')
  async adminEditProduct(
    @Param('product_id') product_id: number,
    @AuthUser() authUser: RequestUserInterface,
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<void> {
    const { user, shop } = await this.adminPageData(authUser, response);
    const product = await this.productsService.findById(product_id);
    response.render('admin-edit-product', {
      authUser,
      user,
      shop,
      product,
    });
  }
}
