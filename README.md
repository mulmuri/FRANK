# 오픈소스 소개

### FRANK 를 소개합니다!

FRANK 는 RANK() 함수를 매우 빠르게 제공하는 데이터베이스입니다. 스택 오버플로우 등을 서베이하면 기존의 RDBMS 에서 RANK() 함수가 느린데, 어떻게 최적화 하냐는 글을 볼 수 있습니다. 사실 RANK() 함수는 전체 레코드를 정렬하여 하나씩 세아려야 하는 매우 무거운 함수로, 이 쿼리를 최적화 하는 데에는 한계가 있습니다. FRANK는 다른 데이터베이스와 함께 사용하여 RANK 의 성능을 극대화하고자 할 때 사용할 수 있습니다.

 

기존 RDBMS 에서 RANK() 함수의 시간복잡도는 O(nlogn) 입니다. FRANK 는 기존 rdbms 에서 사용하는 B+Tree 이외에도 Dynamic Segment Tree 를 사용하여 RANK() 함수를 O(log(range(n))) 에 제공합니다. 10만개의 record 기준으로 RDBMS 에서는 100 번의 RANK() 함수를 호출하는데 54000ms 가 걸리지만, FRANK 는 단 100ms 에 모든 쿼리를 처리할 수 있습니다. record 가 늘어날수록 격차는 더 커집니다.

### 언제 사용할 수 있나요?

1. 레코드의 수가 매우 클 때 사용할 수 있습니다.

레코드 수가 충분히 크지 않은 경우에는 RDBMS 에 내장된 RANK() 함수를 사용하여도 속도 문제가 없습니다. 다만 어느 수준을 넘어서게 되면 RANK() 함수가 급격하게 느려지게 됩니다. RANK() 쿼리 부하가 시스템의 운영에 부담을 줄 수 있다고 판단되면 FRANK 를 사용할 수 있습니다.

1. 스케줄링을 통한 준 실시간 RANK 제공이 매력적이지 않을 때 사용할 수 있습니다.

FRANK 를 사용하지 않는 경우에도 실시간을 포기하고 RANK() 결과를 제공하는 방법이 있습니다. 스케줄링을 통해 주기적으로 전체 레코드의 RANK 를 구해 새로운 테이블에 저장해놓고, 해당 결과를 제공하는 방법입니다. 다만 이 경우에 RANK 는 부정확한 값을 반환하며, 스케줄링을 관리하는 것과 관련된 여러 엔지니어링 부담이 발생할 수 있습니다.

### 어떻게 사용하나요?

아래와 같이 설치해주세요

```tsx
npm install frank
```

FRANK 는 key-value store 구조를 가지고 있습니다. 아래와 같이 key 와 value 의 타입을 지정하여 초기화할 수 있습니다.

- key 는 any, string, number 중 하나를 지정할 수 있으며, default 는 any 입니다.
- value 는 number 의 tuple 로 구성되며, point 의 하한과 상한을 지정해주어야 합니다. 범위가 작을수록 효율적으로 동작할 수 있으나 그 크기는 미미하기 때문에 넉넉하게 잡아주셔도 좋습니다.
- nodejs 의 실수 오차 문제로 인해 -2^53 ~ 2^53 의 범위에서만 선언할 수 있습니다.

```tsx
import FRANK from "frank";

const DB = FRANK({
    keyType: 'any',
    valueType: [
        {min: 0, max: 65535, order: 'asc'}, 
        {min: 0, max: 1e9, order: 'desc'},
    ]
});
```

FRANK 는 다음과 같은 쿼리를 제공합니다.

```tsx

...
const session = DB.session();

await session.insert('cat', [65, 12345]);
await session.insert('dog', [65, 23456]);

await session.rank('cat'); // 1
await session.rank('dog'); // 0

await session.update('cat', [65, 34567]);
await session.remove('dog');

await session.exists('cat'); // true
await session.exists('dog'); // false
```

### 어떠한 기능이 개발될 예정인가요?

현재 FRANK 는 nodejs 패키지로 작성되어 nodejs 에서만  npm 을 통해 모듈을 설치하여 사용할 수 있습니다.

만약 이 데이터베이스가 유용하고 redis 및 다른 데이터베이스와 같은 범언어 오픈소스로 작성될 필요가 있다고 생각하신다면 Star 을 눌러주세요!

### 벤치마크 테스트 내용

환경

- SEED : 1234
- Database : MySQL
- CPU : Apple M1
- Network : localhost

설명

- A 는 MySQL 을 독립적으로 사용하는 경우, B 는 MySQL 과 FRANK 를 함께 사용하는 경우이다.
- update, rank 쿼리의 수는 100개로 유지하며, record 의 수를 각각 10,000, 100,000, 1,000,000 으로 실험한다.
- B 에서 insert, update 는 MySQL 과 FRANK 에 모두 반영하며, rank 는 FRANK 를 통해서만 결과를 얻는다.
- B의 경우 업데이트 쿼리의 경우 2~3배 가량의 시간이 소요되나, RANK 를 호출하는 경우 시간을 획기적으로 단축한다.

| 10,000 | A | B |
| --- | --- | --- |
| insert | 148 ms | 213 ms |
| update | 62 ms | 61 ms |
| rank | 1341 ms | 7 ms |

| 100,000 | A | B |
| --- | --- | --- |
| insert | 976 ms | 1924 ms |
| update | 58 ms | 56 ms |
| rank | 15833 ms | 10 ms |

| 1,000,000 | A | B |
| --- | --- | --- |
| insert | 12592 ms | 37818 ms |
| update | 180 ms | 339 ms |
| rank | 385089 ms | 24 ms |