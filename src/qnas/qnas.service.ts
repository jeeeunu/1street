import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QnasEntity } from './entities/qnas.entity';
import { RequestUserInterface } from 'src/users/interfaces';
import { ResultableInterface } from 'src/common/interfaces';
import { QnaUpdateDto } from './dto/update-qna.dto';
import { Repository } from 'typeorm';

@Injectable()
export class QnaService {
  constructor(
    @InjectRepository(QnasEntity)
    private qnaRepository: Repository<QnasEntity>,
  ) {}

  //-- 상품 아이디로 QNA 찾기 (수정 필요) --//
  // qna id를 이용하는 것이 아니라 product id를 이용해서 찾아야 한다.
  async find(id: number): Promise<QnasEntity> {
    try {
      const qna = await this.qnaRepository.findOne({
        // 이러면 qna_id 를 통해 검색되지 않나?
        where: { id },
        // product와의 관계를 로드한다?
        relations: ['product'],
      });
      if (!qna) throw new NotFoundException('QNA가 존재하지 않습니다.');
      return qna;
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(
        '서버 내부 오류로 처리할 수 없습니다. 나중에 다시 시도해주세요.',
      );
    }
  }
  //-- QNA 만들기 --//
  createQna(name: string, content: string) {
    this.qnaRepository.insert({
      name,
      content,
    });
  }

  //-- QNA 수정 --//
  async updateQna(
    qnaData: QnaUpdateDto,
    authUser: RequestUserInterface,
  ): Promise<ResultableInterface> {
    const qna = await this.find(qnaData.id);
    if (qna.id !== authUser.user_id)
      throw new ForbiddenException('질문을 등록한 사람만 수정할 수 있습니다.');
    const updateQna = Object.assign(qna, qnaData);
    try {
      await this.qnaRepository.save(updateQna);
      return { status: true, message: '질문이 수정되었습니다.' };
    } catch (err) {
      throw new InternalServerErrorException(
        '서버 내부 오류로 처리할 수 없습니다. 나중에 다시 시도해주세요.',
      );
    }
  }

  //-- QNA 삭제 --//
  async deleteQna(
    qnaId: number,
    authUser: RequestUserInterface,
  ): Promise<ResultableInterface> {
    const qna = await this.find(qnaId);
    if (qna.id !== authUser.user_id)
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
