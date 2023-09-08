import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QnasEntity } from 'src/common/entities/qnas.entity';
import { RequestUserInterface } from 'src/users/interfaces';
import { ResultableInterface } from 'src/common/interfaces';
import { UpdateQnasDto } from './dtos/update-qna.dto';
import { Repository } from 'typeorm';
import { CreateQnasDto } from './dtos/create-qna.dto';
import { UsersService } from 'src/users/users.service';
import { ProductsEntity } from 'src/common/entities';
import { QnaAnswerEntity } from './entities/qna-answer.entity';
import { CreateQnaAnswerDto } from './dtos/create-qna-answer.dto';

@Injectable()
export class QnasService {
  constructor(
    @InjectRepository(QnasEntity)
    private qnaRepository: Repository<QnasEntity>,
    private usersService: UsersService,
    @InjectRepository(ProductsEntity)
    private productRepository: Repository<ProductsEntity>,
    @InjectRepository(QnaAnswerEntity)
    private qnaAnswerRepository: Repository<QnaAnswerEntity>,
  ) {}

  //-- QNA 만들기 --//

  async create(
    // id: number, //
    data: CreateQnasDto,
    authUser: RequestUserInterface,
    // productId: number,
  ): Promise<ResultableInterface> {
    const user = await this.usersService.findUser(authUser.user_id);
    const { product_id, qna_name, qna_content } = data;
    // product 존재 여부 확인
    // const product = await this.productRepository.findOne({ where: { id } }); //
    // if (!product) {
    //   return { status: false, message: '해당 상품이 존재하지 않습니다.' };
    // }
    await this.qnaRepository.insert({
      user: { id: user.id },
      product: { id: product_id }, // 위에서 data 받은 게 있으니 data.product_id 이런식으로 안써도 된다
      qna_name,
      qna_content,
    });
    return { status: true, message: '질문이 등록되었습니다.' };
  }

  // qna_id로 QNA 찾기

  async findById(qnaId: number): Promise<QnasEntity> {
    const qna = await this.qnaRepository
      .createQueryBuilder('qna')
      .leftJoinAndSelect('qna.user', 'user')
      .where('qna.id = :id', { id: qnaId })
      .getOne();
    if (!qna) {
      throw new NotFoundException('해당 QNA가 존재하지 않습니다.');
    }

    return qna;
  }

  //-- 상품 아이디로 QNA 찾기 --//

  async getForProduct(productId: number): Promise<QnasEntity[]> {
    const qna = await this.qnaRepository
      .createQueryBuilder('qna')
      .leftJoinAndSelect('qna.product', 'product')
      .where('product_id = :productId', { productId })
      .getMany();
    if (!qna) {
      throw new NotFoundException('해당 QNA가 존재하지 않습니다.');
    }

    return qna;
  }

  // user_id로 QNA 찾기
  async getForUser(userId: number): Promise<QnasEntity[]> {
    const qna = await this.qnaRepository
      .createQueryBuilder('qna')
      .leftJoinAndSelect('qna.user', 'user')
      .leftJoinAndSelect('qna.product', 'product')
      .where('user_id = :userId', { userId })
      .getMany();
    if (!qna) {
      throw new NotFoundException('해당 QNA가 존재하지 않습니다.');
    }

    return qna;
  }

  // QNA 개수 세기
  async getQnaCount(): Promise<number> {
    try {
      const qnaCount = await this.qnaRepository.count();

      // 조회된 Q&A 데이터 개수를 반환합니다.
      return qnaCount;
    } catch (error) {
      console.error('Q&A 데이터 개수 조회 중 오류 발생:', error);
      return 0;
    }
  }

  //-- QNA 수정 --//
  async update(
    qnaId: number,
    data: UpdateQnasDto,
  ): Promise<ResultableInterface> {
    try {
      // qnaId를 사용하여 해당 QNA를 검색합니다.
      const existingQna = await this.qnaRepository.findOne({
        where: { id: qnaId },
      });

      // QNA가 존재하지 않을 경우 에러를 반환합니다.
      if (!existingQna) {
        return { status: false, message: '해당 QNA를 찾을 수 없습니다.' };
      }

      // 업데이트할 데이터에서 qna_name과 qna_content를 추출합니다.
      const { qna_name, qna_content } = data;

      // qna_name과 qna_content를 업데이트합니다.
      existingQna.qna_name = qna_name;
      existingQna.qna_content = qna_content;

      // 수정된 QNA를 저장합니다.
      await this.qnaRepository.save(existingQna);

      return { status: true, message: 'QNA가 성공적으로 수정되었습니다.' };
    } catch (error) {
      // 예외 발생 시 에러 메시지를 반환합니다.
      return { status: false, message: 'QNA 수정 중 오류가 발생했습니다.' };
    }
  }

  //-- QNA 삭제 --//

  async delete(id: number): Promise<ResultableInterface> {
    await this.qnaRepository.delete({ id });
    return { status: true, message: '질문을 성공적으로 삭제했습니다' };
  }

  // -- 관리자의 QNA 질문에 대한 답변 작성 --//

  async createQnaAnswer(
    qnaId: number,
    answerContent: string,
  ): Promise<QnaAnswerEntity> {
    const qnaAnswer = new QnaAnswerEntity();
    qnaAnswer.qna_id = qnaId;
    qnaAnswer.answer_content = answerContent;

    return await this.qnaAnswerRepository.save(qnaAnswer);
  }

  // QnaAnswer 조회 (qna_id로)
  async getQnaAnswer(qnaId: number): Promise<QnaAnswerEntity[]> {
    return await this.qnaAnswerRepository.find({
      where: { qna_id: qnaId },
    });
  }

  // QnaAnswer 조회 (answerId로)
  async getQnaAnswerById(answerId: number): Promise<QnaAnswerEntity> {
    const qnaAnswer = await this.qnaAnswerRepository.findOne({
      where: { id: answerId },
    });
    if (!qnaAnswer) {
      throw new NotFoundException('해당 QNA 답변을 찾을 수 없습니다.');
    }
    return qnaAnswer;
  }

  // QnaAnswer 수정
  async updateQnaAnswer(
    answerId: number,
    answerContent: string,
  ): Promise<ResultableInterface> {
    try {
      const qnaAnswer = await this.qnaAnswerRepository.findOne({
        where: { id: answerId },
      });
      if (!qnaAnswer) {
        return { status: false, message: 'QNA 답변을 찾을 수 없습니다.' };
      }

      qnaAnswer.answer_content = answerContent;
      await this.qnaAnswerRepository.save(qnaAnswer);

      return { status: true, message: 'QNA 답변이 수정되었습니다.' };
    } catch (error) {
      return {
        status: false,
        message: 'QNA 답변 수정 중 오류가 발생했습니다.',
      };
    }
  }

  // QnaAnswer 삭제
  async deleteQnaAnswer(answerId: number): Promise<ResultableInterface> {
    try {
      const qnaAnswer = await this.qnaAnswerRepository.findOne({
        where: { id: answerId },
      });
      if (!qnaAnswer) {
        return { status: false, message: 'QNA 답변을 찾을 수 없습니다.' };
      }

      await this.qnaAnswerRepository.remove(qnaAnswer);

      return { status: true, message: 'QNA 답변이 삭제되었습니다.' };
    } catch (error) {
      return {
        status: false,
        message: 'QNA 답변 삭제 중 오류가 발생했습니다.',
      };
    }
  }
}
