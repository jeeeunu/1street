import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QnasEntity } from 'src/common/entities/qnas.entity';
import { RequestUserInterface } from 'src/users/interfaces';
import { ResultableInterface } from 'src/common/interfaces';
import { UpdateQnasDto } from './dtos/update-qna.dto';
import { Repository } from 'typeorm';
import { CreateQnasDto } from './dtos/create-qna.dto';
import { UserService } from 'src/users/users.service';
import { ProductsEntity } from 'src/common/entities';

@Injectable()
export class QnasService {
  constructor(
    @InjectRepository(QnasEntity)
    private qnaRepository: Repository<QnasEntity>,
    // private readonly qnasEntity: Repository<QnasEntity>,
    private userService: UserService,
    @InjectRepository(ProductsEntity)
    private productRepository: Repository<ProductsEntity>,
  ) {}

  //-- QNA 만들기 --//

  async create(
    id: number, //
    data: CreateQnasDto,
    authUser: RequestUserInterface,
    // productId: number,
  ): Promise<ResultableInterface> {
    const user = await this.userService.findOne(authUser.user_id);
    const { product_id, qna_name, qna_content } = data;
    // product 존재 여부 확인
    const product = await this.productRepository.findOne({ where: { id } }); //
    if (!product) {
      return { status: false, message: '해당 상품이 존재하지 않습니다.' };
    }
    await this.qnaRepository.insert({
      user: { id: user.id },
      product: { id: product_id }, // 위에서 data 받은 게 있으니 data.product_id 이런식으로 안써도 된다
      qna_name,
      qna_content,
    });
    return { status: true, message: '질문이 등록되었습니다.' };
  }

  //-- 상품 아이디로 QNA 찾기 --//

  async getForProduct(productId: number): Promise<QnasEntity[]> {
    const qna = await this.qnaRepository.find({
      where: { product: { id: productId } },
      relations: ['user', 'product'],
    });
    return qna;
    // return { status: true, message: '질문이 조회되었습니다.' };
  }
  // if (qna.user.id !== authUser.user_id)
  //   throw new ForbiddenException('질문을 등록한 사람만 수정할 수 있습니다.');
  // const updateQna = Object.assign(qna, qnaId);
  // try {
  //   await this.qnaRepository.save(updateQna);
  //   return { status: true, message: '질문이 수정되었습니다.' };
  // } catch (err) {
  //   throw new InternalServerErrorException(
  //     '서버 내부 오류로 처리할 수 없습니다. 나중에 다시 시도해주세요.',
  //   );
  // }
  // }

  // async getForProduct(productId: number): Promise<QnasEntity[]> {
  //   const qnas = await this.qnaRepository.find({
  //     where: { product_id: productId },
  //   });
  //   return qnas;
  // }

  //-- QNA 수정 --//
  async update(
    qnaData: UpdateQnasDto,
    authUser: RequestUserInterface,
  ): Promise<ResultableInterface> {
    const qna = await this.qnaRepository.findOne({
      where: { user: { id: qnaData.id } }, // { user X / id: qnaId.id }
      relations: ['user'],
    });
    if (qna.user.id !== authUser.user_id)
      throw new ForbiddenException('질문을 등록한 사람만 수정할 수 있습니다.');

    const { qna_name, qna_content } = qnaData;

    if (qna_name !== undefined) {
      qna.qna_name = qna_name;
    }

    if (qna_content !== undefined) {
      qna.qna_content = qna_content;
    }

    // const updateQna = Object.assign(qna, qnaId);
    // console.log(updateQna);
    try {
      await this.qnaRepository.save(qna);
      return { status: true, message: '질문이 수정되었습니다.' };
    } catch (err) {
      throw new InternalServerErrorException(
        '서버 내부 오류로 처리할 수 없습니다. 나중에 다시 시도해주세요.',
      );
    }
  }

  //-- QNA 삭제 --//
  async delete(
    qnaId: number,
    authUser: RequestUserInterface,
  ): Promise<ResultableInterface> {
    const qna = await this.qnaRepository.findOne({
      where: { user: { id: qnaId } }, // user X { id: qnaId}
      relations: ['user'],
    });
    if (qna.user.id !== authUser.user_id)
      throw new ForbiddenException('질문을 등록한 사람만 삭제할 수 있습니다.');
    try {
      await this.qnaRepository.remove(qna);
      return { status: true, message: '질문 삭제에 성공했습니다.' };
    } catch (err) {
      throw new InternalServerErrorException(
        '서버 내부 오류로 처리할 수 없습니다. 나중에 다시 시도해주세요.',
      );
    }
  }
}
