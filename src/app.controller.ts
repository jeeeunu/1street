import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { UserService } from './users/users.service';
import { AuthUser } from './auth/auth.decorator';
import { RequestUserInterface } from './users/interfaces';
import { ShopsService } from './shops/shops.service';
import { ProductsService } from './products/products.service';
import { CategorysService } from './categorys/categorys.service';

@Controller()
export class AppController {
  constructor(
    private readonly userService: UserService,
    private readonly categorysService: CategorysService,
    private readonly shopsService: ShopsService,
    private readonly productsService: ProductsService,
  ) {}

  //-- 공통 : 유저 --//
  async userPageData() {
    const categories = await this.categorysService.findAll();
    return { categories };
  }

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
    const categories = await this.categorysService.findAll();
    return { user, shop, categories };
  }

  //-- 메인 페이지 --//
  @Get()
  async main(
    @AuthUser() authUser: RequestUserInterface,
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<void> {
    const isIndexPath = request.url === '/';
    const { categories } = await this.userPageData();

    if (authUser && authUser !== null && authUser.isAdmin === true) {
      return response.redirect('admin-my-page');
    }

    response.render('index', {
      isIndexPath,
      authUser,
      categories,
    });
  }

  //-- 회원가입 --//
  @Get('sign-up')
  async singUp(
    @AuthUser() authUser: RequestUserInterface,
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<void> {
    const isIndexPath = request.url === '/';
    const { categories } = await this.userPageData();
    response.render('sign-up', {
      isIndexPath,
      authUser,
      categories,
    });
  }

  //-- 로그인 --//
  @Get('sign-in')
  async singIn(
    @AuthUser() authUser: RequestUserInterface,
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<void> {
    const isIndexPath = request.url === '/';
    const { categories } = await this.userPageData();
    response.render('sign-in', {
      isIndexPath,
      authUser,
      categories,
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
    const { categories } = await this.userPageData();
    response.render('my-page-user-edit', {
      isIndexPath,
      authUser,
      categories,
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
    const { categories } = await this.userPageData();
    const userInfo = await this.userService.find(authUser.user_id);
    const user = userInfo.results;

    response.render('my-page', {
      isIndexPath,
      authUser,
      user,
      categories,
    });
  }

  //-- 장바구니 --//
  @Get('cart')
  async cart(
    @AuthUser() authUser: RequestUserInterface,
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<void> {
    const isIndexPath = request.url === '/';
    const { categories } = await this.userPageData();
    response.render('cart', {
      isIndexPath,
      authUser,
      categories,
    });
  }

  //-- 상품 상세보기 --//
  @Get('product-detail/:product_id')
  async productDetail(
    @Param('product_id') productId: number,
    @AuthUser() authUser: RequestUserInterface,
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<void> {
    const isIndexPath = request.url === '/';
    const product = await this.productsService.findById(productId);
    const { categories } = await this.userPageData();
    response.render('product-detail', {
      isIndexPath,
      authUser,
      product,
      categories,
    });
  }

  //-- 스토어 --//
  @Get('contact/:shop_id')
  async contact(
    @Param('shop_id') shopId: number,
    @AuthUser() authUser: RequestUserInterface,
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<void> {
    const isIndexPath = request.url === '/';
    const { categories } = await this.userPageData();
    const shop = await this.shopsService.find(shopId);
    const products = await this.productsService.findRegisteredAll(shopId);

    response.render('contact', {
      isIndexPath,
      authUser,
      categories,
      shop,
      products,
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
    const { user, shop, categories } = await this.adminPageData(
      authUser,
      response,
    );
    response.render('admin-create-product', {
      authUser,
      user,
      shop,
      categories,
    });
  }

  //-- admin : 상품 수정 --//
  @Get('admin-edit-product/:product_id')
  async adminEditProduct(
    @Param('product_id') productId: number,
    @AuthUser() authUser: RequestUserInterface,
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<void> {
    const { user, shop, categories } = await this.adminPageData(
      authUser,
      response,
    );
    const product = await this.productsService.findById(productId);
    response.render('admin-edit-product', {
      authUser,
      user,
      shop,
      product,
      categories,
    });
  }
}
