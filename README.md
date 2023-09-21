# 1️STREET

## 🧑‍💻 팀원

팀장: 유지은
부팀장: 한조원
팀원 : 이병수, 홍진택


### 💁 프로젝트 소개

![](https://velog.velcdn.com/images/jw01987/post/83fadb58-5df5-4175-b2e4-9fc575e16c61/image.png)

쇼핑몰·오픈마켓·소셜커머스

### Rest API

| Content              | Method     | Path                                       |
| -------------------- | ---------- | ------------------------------------------ |
| 로그인                   | `POST`     | /auth/login                              |
| 소셜로그인-google         | `GET`      | /google/login/callback                  |
| 소셜로그인-google redirect| `GET`      | /google/redirect                        |
| 로그아웃                  | `POST`      | /auth/logout                          |
| 회원가입                  | `POST`      | /users                                |
| 내정보 조회                | `GET`      | /users/user                            |
| 내정보 수정                | `PATCH`      | /users                               |
| 회원탈퇴                  | `DELETE`      | /users                              |
| 스토어 보기               | `GET`      | /users                                  |
| 내 스토어 정보            | `GET`      | /shops                                  |
| 스토어 생성              | `POST`      | /shops                                 |
| 스토어 수정              | `PATCH`      | /shops                                |
| 스토어 삭제              | `DELETE`      | /shops                               |
| 상품 상세보기             | `GET`      | /products/:productId                    |
| 상품 전체보기             | `GET`      | /products                               |
| 상품 검색(키워드,카테고리,필터별) | `GET`      | /products/search?keyword=키워드&limit=number&cursor=number       |
| 상품 카테고리 검색 | `GET`      | /products/search?categoryId=1&limit=number&cursor=number       |
| 상품 등록             | `POST`      | /products                                      |
| 상품 수정             | `PATCH`      | /products/:productId                           |
| 상품 삭제             | `DELETE`      | /products/:productId                         |
| ‘좋아요’한 상품보기     | `GET`      | /likes                                           |
| ‘좋아요’하기          | `POST`      | /likes/:productId                              |
| ‘좋아요’ 취소          | `DELETE`      | /likes/:productId                            |
| 주문 조회          | `GET`      | /orders                                            |
| 주문 등록          | `POST`      | /orders/carts                                     |
| 주문 상세 조회          | `GET`      | /orders/:order_id                              |
| 주문 수정          | `PATCH`      | /orders/:order_id                              |
| 주문 선택 취소          | `PATCH`      | /orders/:order_id/:order_detail_id/select      |
| 주문 취소          | `PATCH`      | /orders/:order_id/cancel                     |
| 주문 처리상태 수정 : 판매자          | `PATCH`      | /orders/:order_id/seller              |
| 리뷰 작성          | `POST`      | /reviews/:order_detail_id                     |
| 리뷰 조회 : 주문별          | `GET`      | /reviews?order_detail_id=123              |
| 리뷰 조회 : 상품별          | `GET`      | /reviews/:product_id                     |
| 리뷰 조회 : 샵          | `GET`      | /reviews/:user_id                     |
| 리뷰 수정          | `PATCH`      | /reviews/:review_id                     |
| 리뷰 삭제          | `DELETE`      | /reviews/:review_id                     |
| 질문 조회          | `GET`      | /qnas/:product_id                   |
| 질문 등록          | `POST`      | /qnas                                 |
| 질문 수정          | `POST`      | /qnas/:qna_id                          |
| 질문 삭제          | `DELETE`      | /qnas/:qna_id                   |
| 답변 조회          | `GET`      | /qna_answers/:product_id            |
| 답변 등록          | `POST`      | /qna_answers                          |
| 답변 수정          | `PATCH`      | /qna_answers/:qna_answer_id            |
| 답변 삭제          | `DELETE`      | /qna_answers/:qna_answer_id            |
| 장바구니 등록          | `POST`      | /carts                                 |
| 장바구니 조회          | `GET`      | /carts                                 |
| 장바구니 수정          | `GET`      | /carts                                 |
| 장바구니 삭제          | `DELETE`      | /carts                          |

### Wire Frame

https://www.figma.com/file/qdigPQBTAsd33sRy5geVpW/일번가?type=design&node-id=0%3A1&mode=design&t=BeGcRKIAN6lQkQaB-1

### ERD

https://www.erdcloud.com/d/KRrNZpgo4aszmk4eY
![일번가.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/0cb12d77-8646-4795-a966-20a1c68c5351/%EC%9D%BC%EB%B2%88%EA%B0%80.png)

#### 🔩 사용한 기술

`JavaScript` `TypeScript` `NestJS` `TypeORM` `S3` `RDS` `Redis` `socket.io` `webRTC`

##### NestJs

- MVC 디자인 패턴을 기본 패턴으로 하여 역할과 구현이 명확하게 구분된다는 장점이 있어 협업 시 매우 효율적으로 작업할 수 있다
- Typescript를 기본으로 적용하므로 잠재적인 오류 발생 확률을 줄일 수 있다.

##### TypeORM

- NestJ와 같이 TypeScript를 지원하고 TypeScript에 친화적이다

##### S3

- 서버에 많은 미디어 파일을 저장할때 한 곳에 모든 미디어 파일을 관리할 수 있고 확장이나 축소와 같은 DB 관리에 용이하다

##### RDS

- 데이터베이스의 설치, 모니터링 등 관리를 대신하고 데이터베이스 설정, 패치 및 백업과 같은 운영 작업을 자동화하여 편리하다

##### Redis

- 메모리에 저장하기 때문에 디스크 기반 데이터베이스보다 더 빠르게 데이터를 읽을 수 있다.
- 문법적으로 사용하기 쉽고, 작성할 개발코드 양이 적다

### ✏️ 프로젝트 아키텍쳐
![](https://velog.velcdn.com/images/jw01987/post/05b95ba7-6a0e-4c4e-8350-912c524087a8/image.jpg)

### 💬 기술적 의사결정

#### 오프셋 기반 vs 커서 기반 페이지네이션

- 결정: 일반적인 방법인 고유식별자 기준으로 커서기반 페이지네이션을 구현했다.
- 실시간 데이터 처리 능력, 누락/중복되지 않는 데이터에 이점이 있음
    
    단순 레코드의 수를 건너 뛰는 오프셋과 다르게 
    
    마지막 페이지를 담은 커서라는 포인터(dataset의 특정레코드, 로우)를 파라미터로 전달하는 방식이라, 누군가가 데이터를 삭제하든,수정하든 정상적으로 실시간으로 데이터를 얻을 수 있다.
    
- 뛰어난 실시간 데이터 처리 능력
    
    오프셋 페이징의 시간복잡성은 O(N), O(offset+limit)으로 데이터 양이 증가 할 수록 데이터 베이스 쿼리가 느려질 수 있다.
    
    커서 기반 페이지네이션은 O(1), O(limit)으로 항상 일정하기 때문에 페이지 로딩에 이점이 있다.
![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/c8fa7276-3610-4f11-923b-efe367f6d500/20b69847-11dd-48b5-9499-585ecc30c7b5/Untitled.png)

#### http vs https

결정: https 적용
- chrome 등의 브라우저에서 http 웹 사이트를 안전하지 않은 페이지로 분류
- webRTC를 활용한 라이브쇼핑이 활성화 되지 않는 문제

#### S3 이미지 업로드 시, 서버에서 이미지 리사이징 처리

결정: node sharp 모듈을 통한 이미지 리사이징 적용
- 사용자가 큰 용량의 이미지를 올렸을때의 대처
- 이미지 압축

#### CI / CD 와 테스트 코드

결정: 테스트 코드를 제외 하고 CI/CD 배포를 적용
- 프로젝트 배포 후에도 당분간 계속 추가,수정해야하기 때문에 CI/CD 자동화가 주는 이점이 큼, 테스트 코드를 배우고 실행하기에는 이미 많은 코드가 작성되어있어 다음 프로젝트를 기약함

#### HLS vs WebRTC

결정: WebRTC
- HLS는 영상들을 전송하는데 시간이 걸림
- 접근하기 쉬운 WebRTC를 사용하기로 함


# ⚽️ 트러블 슈팅

## EC2 배포 문제

### 문제

- NestJS 전역설치시, EC2 ssh 접속 등 모든 기능이 다운되는 문제.
- 인스턴스 삭제 말고는 해결이 되지 않았는데, 에러메세지 없이 인스턴스가 다운되는 현상이라 원인을 직접 찾았어야 했다.

  
### 해결방법

- Node.js 버전 업그레이드
- NestJS 설치를 하지않고,  Node.js 로 실행
    
    ```jsx
    "start": "node dist/src/main.js"
    ```
    
- 추후에 로그그룹 , AWS SAM 등을 이용해 배포/관리에 활용하기로 함

## DOM 조작시 성능저하되는 문제

### 문제

- 데이터를 불러와 innerHTML으로 프론트 코드를 작성, 서버측의 이미지가 GET NOT /undefined 에러가 뜸

### 해결방법

- 해당 문제는 처음 메인 페이지를 렌더링할때 한번 발생하는데  
아마 카테고리,검색 페이지도 데이터가 많아지면 동일한 문제가 생길것이라고 예측한다.
- 기존 innerHTML으로 짠 코드를 DocumentFragment으로 수정해서 해결했다.  
일반적으로 DOM에 요소를 추가하거나 변경할 때마다 브라우저는 렌더링을 다시 수행하게 되는데,  
이런 작업을 빈번하게 하면 성능 저하가 발생할 뿐만 아니라 같은 문제가 생길 수 있다.
- 이때 DocumentFragment를 사용하면 한번에 여러 개의 DOM 요소를 일괄적으로 추가할 수 있어 렌더링 작업을 줄일 수 있는데, 여러 DOM 요소가 메모리에만 생성되고 실제 DOM에 추가될 때 한 번의 렌더링만 발생한다.
- html 템플릿에 상품 이미지가 background-image 로 설정되어 있었는데, img 태그처럼 렌더링 우선순위를 보장받지 못하기 때문에 <img> 태그로 변경됨.


## 결과에 포함되는 다른 영역의 엔티티를 불러오는 문제

### 문제

- Q&A 기능을 구현하는 코드를 작성하면서 결과에 포함되는 다른 영역의 엔티티를 불러오고 연결하는데 어려움이 있었다.

### 해결방법

- 팀원분께 여쭤보고 관계 테이블을 이용해 검색하는 방법을 알게되었고 
그것을 이용해 해당 부분에 대한 문제를 해결했다.
- 해당 코드에서는 Q&A 값을 불러오는 데 연결된 사용자와 제품 정보가 필요했다.  
따라서 각각의 엔티티에서 아래와 같은 관계를 설정해주었고, 서비스 단에서는 where, relations를 이용해 제품에 대한 Q&A 값을 반환하도록 했다.

!https://velog.velcdn.com/images/jw01987/post/f952290e-89ff-4244-a703-7432788df0d3/image.png


## 장바구니 기능의 로직 문제

### 문제

- 장바구니 기능을 Redis를 사용해서 구현할때의 로직 문제

### 해결방법

- Redis는 set key값 value값 으로 값을 넣을 수 있으며, get key값으로 value값을 가져올수 있다.
- 먼저 값을 추가할때 배열 형태로 추가하여 계속 장바구니에 정보를 넣을수 있게끔 하였고,
장바구니가 비어 있으면 빈 배열을 반환하도록 구현하였다.




