import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QnasEntity } from 'src/common/entities/qnas.entity';
import { RequestUserInterface } from 'src/users/interfaces';
import { ResultableInterface } from 'src/common/interfaces';
import { UpdateQnasDto } from './dto/update-qna.dto';
import { Repository } from 'typeorm';
import { CreateQnasDto } from './dto/create-qna.dto';
import { UserService } from 'src/users/users.service';

@Injectable()
export class QnasService {
  constructor(
    @InjectRepository(QnasEntity)
    private qnaRepository: Repository<QnasEntity>,
    // private readonly qnasEntity: Repository<QnasEntity>,
    private userService: UserService,
  ) {}

  //-- 상품 아이디로 QNA 찾기 --//

  async getForProduct(productId: number): Promise<QnasEntity[]> {
    const qna = await this.qnaRepository.find({
      where: { product: { id: productId } },
      relations: ['product'],
    });
    return qna;
    // return await this.qnaRepository.find({
    //   where: { product: { id: productId } },
    //   relations: ['product'],
    // });
    // const qna = await this.qnaRepository.findOne({
    //   where: { product: { id: qnaId.id } },
    //   relations: ['product'],
    // });
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

  //-- QNA 만들기 --//

  async create(
    data: CreateQnasDto,
    authUser: RequestUserInterface,
    // productId: number,
  ): Promise<ResultableInterface> {
    const user = await this.userService.findOne(authUser.user_id);
    // console.log(user);
    const { qna_name, qna_content } = data;
    const qna = await this.qnaRepository.save({
      user: { id: user.id },
      // product: { id: productId }, //product_id 받아오기
      qna_name,
      qna_content,
    });
    console.log(qna);
    return { status: true, message: '질문이 등록되었습니다.' };
  }

  //-- QNA 수정 --//
  async update(
    qnaId: UpdateQnasDto,
    authUser: RequestUserInterface,
  ): Promise<ResultableInterface> {
    const qna = await this.qnaRepository.findOne({
      where: { user: { id: qnaId.id } },
      relations: ['user'],
    });
    if (qna.user.id !== authUser.user_id)
      throw new ForbiddenException('질문을 등록한 사람만 수정할 수 있습니다.');
    const updateQna = Object.assign(qna, qnaId);
    console.log(updateQna);
    //   try {
    //     await this.qnaRepository.save(updateQna);
    return { status: true, message: '질문이 수정되었습니다.' };
    //   } catch (err) {
    //     throw new InternalServerErrorException(
    //       '서버 내부 오류로 처리할 수 없습니다. 나중에 다시 시도해주세요.',
    //     );
    //   }
  }

  //-- QNA 삭제 --//
  async delete(
    qnaId: number,
    authUser: RequestUserInterface,
  ): Promise<ResultableInterface> {
    const qna = await this.qnaRepository.findOne({
      where: { user: { id: qnaId } },
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
