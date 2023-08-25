import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { UserService } from './users/users.service';
import { AuthUser } from './auth/auth.decorator';
import { RequestUserInterface } from './users/interfaces';

@Controller()
export class AppController {
  constructor(private readonly userService: UserService) {}

  //-- 메인 페이지 --//
  @Get()
  main(
    @AuthUser() authUser: RequestUserInterface,
    @Req() request: Request,
    @Res() response: Response,
  ): void {
    const isIndexPath = request.url === '/';
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
}
