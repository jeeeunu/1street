# 1️⃣ 넘버원

## 🧑‍💻 팀: **넘버원**

팀장: 유지은

부팀장: 한조원

팀원 : 이병수, 홍진택

## 📌 1번가 프로젝트

### 💁 프로젝트 소개

![](https://velog.velcdn.com/images/jw01987/post/83fadb58-5df5-4175-b2e4-9fc575e16c61/image.png)

쇼핑몰·오픈마켓·소셜커머스

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

#### webRTC 도입

- 도입이유
  - 판매자의 쇼핑 라이브 서비스를 실시간으로 방송하기 위해
- 문제상황
  - webRTC와 HLS중 어느 것을 적용시킬지에 대한 문제
- 해결방안
  - webRTC사용
- 의견조율
  - HLS는 영상등을 전송하는 데 시간이 조금 더 걸림
  - 처음 사용해보는 기술이라 좀 더 접근하기 쉬운 webRTC를 사용하기로 함
- 의견결정
  - 마감을 우선으로하고 이후에 시간이 남는다면 HLS를 추가로 적용해보기로 결정

---

#### Redis 도입

- 도입이유
  - 장바구니 서비스에서 유저의 편의를 위해 일정기간 상품을 저장하기 위해
- 문제상황
  - 장바구니의 상품을 일정기간 저장할 방법이 필요
  - 데이터 베이스에 저장하기에는 과부하가 우려됨
- 해결방안
  - 인메모리 데이터베이스인 Redis 사용
- 의견조율
  - 메모리에 저장하기 때문에 디스크 기반 데이터베이스보다 더 빠르게 데이터를 읽을 수 있다.
  - 문법적으로 사용하기 쉽고, 작성할 개발코드 양이 적다
- 의견결정
  - 구매자의 장바구니 데이터를 Redis에 저장 하는것으로 결정

# ⚽️ 트러블 슈팅

## 유지은님

### 📝 문제상황

DOM 조작시 성능저하되는 문제

데이터를 불러와 innerHTML으로 프론트 코드를 짰는데, 서버측의 이미지가 GET NOT /undefined 에러가 뜬다.

### 💊 해결방법

해당 문제는 처음 메인 페이지를 렌더링할때 한번 발생하는데  
아마 카테고리,검색 페이지도 데이터가 많아지면 동일한 문제가 생길것이라고 예측한다.  
기존 innerHTML 으로 간단하게 짰던걸,

![](https://velog.velcdn.com/images/jw01987/post/cfbaf37a-f808-4816-b11b-1ff765eeec8f/image.png)

DocumentFragment을 사용해서 해결했다.  
일반적으로 DOM에 요소를 추가하거나 변경할 때마다 브라우저는 렌더링을 다시 수행하게 되는데,  
이런 작업을 빈번하게 하면 성능 저하가 발생할 뿐만 아니라 나와 같은 문제가 생길 수 있다.

이때 DocumentFragment를 사용하면 한번에 여러 개의 DOM 요소를 일괄적으로 추가할 수 있어 렌더링 작업을 줄일 수 있는데,  
여러 DOM 요소가 메모리에만 생성되고 실제 DOM에 추가될 때 한 번의 렌더링만 발생한다.

![](https://velog.velcdn.com/images/jw01987/post/0d491462-69e1-4d2c-a0de-a85f2a810fe9/image.png)

## 이병수님

### 📝 문제상황

QNA 기능을 구현하는 코드를 작성하면서 결과에 포함되는 다른 영역의 엔티티를 불러오는데 어려움이 있었다.

### 💊 해결방법

팀원분께 여쭤보고 관계 테이블을 이용해 검색하는 방법을 알게되었고 그것을 이용해 해당 부분에 대한 문제를 해결했다.  
해당 코드에서는 QNA 값을 불러오는 데 연결된 사용자와 제품 정보가 필요했다.  
따라서 각각의 엔티티에서 아래와 같은 관계를 설정해주었고,  
![](https://velog.velcdn.com/images/jw01987/post/f952290e-89ff-4244-a703-7432788df0d3/image.png)

서비스 단에서는 where, relations를 이용해 제품에 대한 QNA 값을 반환하도록 했다.
![](https://velog.velcdn.com/images/jw01987/post/b74e70de-03d7-4b6b-8ba1-4814d7bb4141/image.png)

## 한조원님

### 📝 문제상황

setRemoteDescription를 실행하지 못 하는 문제

![](https://velog.velcdn.com/images/jw01987/post/c84f8053-d760-4fa8-a8fd-251cd5b7ac70/image.png)

```
Uncaught (in promise) DOMException: Failed to execute 'setRemoteDescription' on 'RTCPeerConnection': Failed to parse SessionDescription.
```

### 💊 해결방법

SDP파싱을 하는데 오류가 생긴 경우로  
RTCPeerConnection의 상태가 `stable`가 아닐경우 오류가 나는 것이였다  
그래서 RTCPeerConnection의 상태를 확인해 `have-local-offer`일때 `setRemoteDescription`를 주어 새로 answer를 세팅해서 오류를 해결했다  
![](https://velog.velcdn.com/images/jw01987/post/27c91158-2fd5-4a3b-9220-3f46876e9d51/image.png)

## 홍진택님

### 📝 문제상황

장바구니 기능을 Redis를 사용해서 구현할때의 로직 문제

### 💊 해결방법

Redis를 처음 사용해 봤기 때문에 구현에 많은 어려움이 있었다

Redis는 set key값 value값 으로 값을 넣을 수 있으며  
get key값으로 value값을 가져올수 있다  
먼저 값을 추가할때 배열 형태로 추가하여 계속 장바구니에 정보를 넣을수 있게끔 하였고  
장바구니가 비어 있으면 빈 배열을 내뱉게 구현하였다.

장바구니 물품 추가하기
![](https://velog.velcdn.com/images/jw01987/post/f83c6665-35a1-4565-ad9a-7f792eedc103/image.png)

장바구니 불러오기
![](https://velog.velcdn.com/images/jw01987/post/19f2c698-206b-435b-911c-a8786ea18edc/image.png)
