import { Controller, Get, Param, Query, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { UsersService } from './users/users.service';
import { AuthUser } from './auth/auth.decorator';
import { RequestUserInterface } from './users/interfaces';
import { ShopsService } from './shops/shops.service';
import { ProductsService } from './products/products.service';
import { CategorysService } from './categorys/categorys.service';
import { LikesService } from './likes/likes.service';
import { CartsService } from './carts/carts.service';
import { OrdersService } from './orders/orders.service';
import { ReviewsService } from './reviews/reviews.service';
import { QnasService } from './qnas/qnas.service';

@Controller()
export class AppController {
  constructor(
    private readonly usersService: UsersService,
    private readonly categorysService: CategorysService,
    private readonly shopsService: ShopsService,
    private readonly productsService: ProductsService,
    private readonly ordersService: OrdersService,
    private readonly likesService: LikesService,
    private readonly cartsService: CartsService,
    private readonly reviewsService: ReviewsService,
    private readonly qnasService: QnasService,
  ) {}

  //-- 공통 : 유저 --//
  async userPageData(request: Request, authUser: RequestUserInterface) {
    const isIndexPath = request.url === '/';
    const isSearchPath = request.url.startsWith('/product-list');
    const categories = await this.categorysService.findAll();
    if (authUser) {
      const carts = await this.cartsService.getCart(authUser.user_id);
      const userInfo = await this.usersService.findUserInfo(authUser.user_id);
      const user = userInfo.results;
      return { isIndexPath, isSearchPath, user, categories, carts };
    } else {
      return { isIndexPath, isSearchPath, categories };
    }
  }

  //-- 공통 : admin --//
  async adminPageData(authUser: RequestUserInterface, response: Response) {
    if (!authUser.isAdmin) {
      response.status(403).render('error-page', {
        errorMessage: '접근이 불가능합니다.',
      });
      return;
    }
    const userInfo = await this.usersService.findUserInfo(authUser.user_id);
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
    const { isIndexPath, isSearchPath, categories, user } =
      await this.userPageData(request, authUser);
    const latestProducts = await this.productsService.findLatestProducts();
    const findPopularProducts =
      await this.productsService.findPopularProducts();
    const findHighlyRatedProducts =
      await this.productsService.findHighlyRatedProducts();

    if (authUser && authUser !== null && authUser.isAdmin === true) {
      return response.redirect('admin-my-page');
    }

    response.render('index', {
      isIndexPath,
      isSearchPath,
      user,
      authUser,
      categories,
      latestProducts,
      findPopularProducts,
      findHighlyRatedProducts,
    });
  }

  //-- 회원가입 --//
  @Get('sign-up')
  async singUp(
    @AuthUser() authUser: RequestUserInterface,
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<void> {
    const { isIndexPath, isSearchPath, categories, user } =
      await this.userPageData(request, authUser);

    response.render('sign-up', {
      isIndexPath,
      isSearchPath,
      user,
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
    const { isIndexPath, isSearchPath, categories, user } =
      await this.userPageData(request, authUser);

    response.render('sign-in', {
      isIndexPath,
      isSearchPath,
      user,
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
    const { isIndexPath, isSearchPath, categories, user } =
      await this.userPageData(request, authUser);

    if (!authUser) return response.redirect('/');

    response.render('my-page-user-edit', {
      isIndexPath,
      isSearchPath,
      user,
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
    const { isIndexPath, isSearchPath, categories, user } =
      await this.userPageData(request, authUser);

    if (!authUser) return response.redirect('/');

    if (authUser && authUser !== null && authUser.isAdmin === true) {
      return response.redirect('admin-my-page');
    }

    const carts = await this.cartsService.getCart(authUser.user_id);
    const qnaCount = await this.qnasService.getQnaCount(authUser.user_id);

    response.render('my-page', {
      isIndexPath,
      isSearchPath,
      user,
      qnaCount,
      authUser,
      categories,
      carts,
    });
  }

  //-- 주문 상세 페이지 --//
  @Get('my-page-order/:order_id')
  async myPageOrder(
    @Param('order_id') order_id: number,
    @AuthUser() authUser: RequestUserInterface,
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<void> {
    const { isIndexPath, isSearchPath, categories, user } =
      await this.userPageData(request, authUser);
    const order = await this.ordersService.getDetailOrder(
      authUser.user_id,
      order_id,
    );
    response.render('my-page-order', {
      isIndexPath,
      isSearchPath,
      user,
      authUser,
      categories,
      order,
    });
  }

  //-- 판매자 주문 상세 페이지 --//
  @Get('admin-my-page-order/:order_id')
  async adminMyPageOrder(
    @Param('order_id') order_id: number,
    @AuthUser() authUser: RequestUserInterface,
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<void> {
    const { user, shop } = await this.adminPageData(authUser, response);
    const order = await this.ordersService.getDetailOrder(
      authUser.user_id,
      order_id,
    );
    response.render('admin-my-page-order', {
      user,
      shop,
      authUser,
      order,
    });
  }

  //-- 좋아요 --//
  @Get('like')
  async like(
    @AuthUser() authUser: RequestUserInterface,
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<void> {
    const { isIndexPath, isSearchPath, categories, user } =
      await this.userPageData(request, authUser);
    const myLikes = await this.likesService.findAllLikes(authUser);

    response.render('like', {
      isIndexPath,
      isSearchPath,
      user,
      authUser,
      categories,
      myLikes,
    });
  }

  //-- 장바구니 --//
  @Get('cart')
  async cart(
    @AuthUser() authUser: RequestUserInterface,
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<void> {
    const { isIndexPath, isSearchPath, categories, user } =
      await this.userPageData(request, authUser);
    const myCarts = await this.cartsService.findAllCarts(authUser);

    response.render('cart', {
      isIndexPath,
      isSearchPath,
      user,
      authUser,
      categories,
      myCarts,
    });
  }

  //-- QNA 리스트 --//
  @Get('my-page-user-qna/:user_id')
  async myPageUserQna(
    @Param('user_id') userId: number,
    @AuthUser() authUser: RequestUserInterface,
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<void> {
    const { isIndexPath, isSearchPath, categories, user } =
      await this.userPageData(request, authUser);
    const qna = await this.qnasService.getForUser(userId);
    response.render('my-page-user-qna', {
      isIndexPath,
      isSearchPath,
      user,
      qna,
      authUser,
      categories,
    });
  }

  //-- QNA 등록 --//
  @Get('user-qna/:product_id')
  async userQna(
    @Param('product_id') productId: number,
    @AuthUser() authUser: RequestUserInterface,
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<void> {
    const { isIndexPath, isSearchPath, categories, user } =
      await this.userPageData(request, authUser);
    const qna = await this.qnasService.getForProduct(productId);
    const product = await this.productsService.findById(productId);
    response.render('user-qna', {
      isIndexPath,
      isSearchPath,
      product,
      user,
      qna,
      authUser,
      categories,
    });
  }

  //-- 주문 --//
  @Get('checkout')
  async checkout(
    @AuthUser() authUser: RequestUserInterface,
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<void> {
    const { isIndexPath, isSearchPath, categories, user } =
      await this.userPageData(request, authUser);

    response.render('checkout', {
      isIndexPath,
      isSearchPath,
      authUser,
      user,
      categories,
    });
  }

  //-- 상품 검색 --//
  @Get('products-list')
  async productList(
    @Query('keyword') searchContent: string,
    @AuthUser() authUser: RequestUserInterface,
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<void> {
    const { isIndexPath, isSearchPath, categories, user } =
      await this.userPageData(request, authUser);
    const thisPath = request.url;

    response.render('product-list', {
      isIndexPath,
      isSearchPath,
      thisPath,
      user,
      authUser,
      categories,
      searchContent,
    });
  }

  //-- 카테고리 리스트 --//
  @Get('category-list')
  async categoryList(
    @Query('categoryId') categoryId: number,
    @AuthUser() authUser: RequestUserInterface,
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<void> {
    const { isIndexPath, isSearchPath, categories, user } =
      await this.userPageData(request, authUser);
    const pageCategory = await this.categorysService.findOne(categoryId);
    const thisPath = request.url;

    response.render('category-list', {
      isIndexPath,
      isSearchPath,
      thisPath,
      user,
      authUser,
      categories,
      pageCategory,
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
    const { isIndexPath, isSearchPath, categories, user } =
      await this.userPageData(request, authUser);
    const product = await this.productsService.findById(productId);
    const reviewRating = await this.productsService.getRatingAverage(productId);
    const reviews = await this.reviewsService.findAllByProductId(productId);
    const productQnAs = await this.qnasService.getForProduct(productId);
    response.render('product-detail', {
      isIndexPath,
      isSearchPath,
      user,
      authUser,
      product,
      categories,
      reviewRating,
      reviews,
      productQnAs,
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
    const { isIndexPath, isSearchPath, categories, user } =
      await this.userPageData(request, authUser);
    const shop = await this.shopsService.findOne(shopId);
    const products = await this.productsService.findRegisteredAll(shopId);

    response.render('contact', {
      isIndexPath,
      isSearchPath,
      user,
      authUser,
      categories,
      shop,
      products,
    });
  }

  //-- 리뷰 리스트 --//
  @Get('my-page/review-list')
  async reviewList(
    @AuthUser() authUser: RequestUserInterface,
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<void> {
    const { isIndexPath, isSearchPath, categories, user } =
      await this.userPageData(request, authUser);

    response.render('review-list', {
      isIndexPath,
      isSearchPath,
      authUser,
      user,
      categories,
    });
  }

  //-- 리뷰 작성 --//
  @Get('my-page/create-review/:order_detail_id')
  async createReview(
    @Param('order_detail_id') orderDetailId: number,
    @AuthUser() authUser: RequestUserInterface,
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<void> {
    const { isIndexPath, isSearchPath, categories, user } =
      await this.userPageData(request, authUser);
    const orderDetail = await this.ordersService.getDetailOrderById(
      orderDetailId,
    );

    response.render('create-review', {
      isIndexPath,
      isSearchPath,
      authUser,
      user,
      categories,
      orderDetail,
    });
  }

  //-- 리뷰 수정 --//
  @Get('my-page/edit-review/:order_detail_id')
  async editReview(
    @Param('order_detail_id') orderDetailId: number,
    @AuthUser() authUser: RequestUserInterface,
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<void> {
    const { isIndexPath, isSearchPath, categories, user } =
      await this.userPageData(request, authUser);
    const orderDetail = await this.ordersService.getDetailOrderById(
      orderDetailId,
    );
    const review = await this.reviewsService.findByOrderDetailId(orderDetailId);

    response.render('edit-review', {
      isIndexPath,
      isSearchPath,
      authUser,
      user,
      categories,
      orderDetail,
      review,
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
    const reviews = await this.reviewsService.findAllByShopId(authUser.shop_id);

    response.render('admin-my-page', {
      authUser,
      user,
      shop,
      products,
      reviews,
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

  // -- admin : 해당 상점 대상 QNA 리스트 --//
  @Get('admin-qna/:shop_id')
  async adminQnaPage(
    @Param('shop_id') shopId: number,
    @AuthUser() authUser: RequestUserInterface,
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<void> {
    const { user, shop } = await this.adminPageData(authUser, response);
    const products = await this.productsService.findRegisteredAll(
      authUser.shop_id,
    );
    const qna = await this.qnasService.getForShop(shopId);
    const qnaAnswer = await this.qnasService.getQnaAnswerByShopId(shopId);

    response.render('admin-qna', {
      authUser,
      user,
      shop,
      products,
      qna,
      qnaAnswer,
    });
  }

  // -- admin : QNA 답변 작성 --//
  @Get('admin-qna-detail/:qna_id')
  async adminQnaDetailPage(
    @Param('qna_id') qnaId: number,
    @AuthUser() authUser: RequestUserInterface,
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<void> {
    const { isIndexPath, isSearchPath, categories, user } =
      await this.userPageData(request, authUser);
    const qna = await this.qnasService.findById(qnaId);

    response.render('admin-qna-detail', {
      isIndexPath,
      isSearchPath,
      authUser,
      user,
      qna,
      categories,
    });
  }

  //-- 채팅구현 중 --//
  @Get('chat')
  async chat(@Res() response: Response) {
    response.render('chat');
  }
  @Get('live')
  async live(
    @Res() response: Response,
    @Query('title') title: string,
    @AuthUser() authUser: RequestUserInterface,
  ) {
    let isAdmin;
    if (!authUser || authUser.isAdmin === false) {
      isAdmin = false;
    } else {
      isAdmin = true;
    }
    response.render('live', { title, isAdmin, authUser });
  }
}
