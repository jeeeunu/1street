import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

@Controller()
export class AppController {
  //-- 메인 페이지 --//
  @Get()
  main(@Req() request: Request, @Res() response: Response): void {
    const isIndexPath = request.url === '/';
    response.render('index', {
      isIndexPath,
    });
  }

  //-- 로그인 --//
  @Get('sign-in')
  singIn(@Res() response: Response) {
    response.render('sign-in', {
      title: '테스트',
      subtitle: '서브 테스트',
    });
  }

  //-- 장바구니 --//
  @Get('cart')
  cart(@Res() response: Response) {
    response.render('cart', {
      title: '테스트',
      subtitle: '서브 테스트',
    });
  }

  //-- 상품 상세보가 --//
  @Get('product-detail')
  productDetail(@Res() response: Response) {
    response.render('product-detail', {
      title: '테스트',
      subtitle: '서브 테스트',
    });
  }
}
