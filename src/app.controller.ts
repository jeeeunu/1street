import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

@Controller()
export class AppController {
  //-- 메인 페이지 --//
  @Get()
  main(@Req() request: Request, @Res() response: Response): void {
    const isIndexPath = request.url === '/';
    const authUser = request.user;
    response.render('index', {
      isIndexPath,
      authUser,
    });
  }

  //-- 회원가입 --//
  @Get('sign-up')
  singUp(@Req() request: Request, @Res() response: Response): void {
    const isIndexPath = request.url === '/';
    const authUser = request.user;
    response.render('sign-up', {
      isIndexPath,
      authUser,
    });
  }

  //-- 로그인 --//
  @Get('sign-in')
  singIn(@Req() request: Request, @Res() response: Response): void {
    const isIndexPath = request.url === '/';
    const authUser = request.user;
    response.render('sign-in', {
      isIndexPath,
      authUser,
    });
  }

  //-- 장바구니 --//
  @Get('cart')
  cart(@Req() request: Request, @Res() response: Response): void {
    const isIndexPath = request.url === '/';
    const authUser = request.user;
    response.render('cart', {
      isIndexPath,
      authUser,
    });
  }

  //-- 상품 상세보가 --//
  @Get('product-detail')
  productDetail(@Req() request: Request, @Res() response: Response): void {
    const isIndexPath = request.url === '/';
    const authUser = request.user;
    response.render('product-detail', {
      isIndexPath,
      authUser,
    });
  }
}
