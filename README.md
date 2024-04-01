# Requirements

---

- [Postgresql](https://www.postgresql.org/download/) - 14.11 버전을 사용했습니다.
- [Node.js](https://nodejs.org/en/download/) - 20.10.0 버전을 사용했습니다.
    - [Yarn](https://www.npmjs.com/package/yarn) - 1.22.19 버전을 사용했습니다.

# Setup

---

### DB 설정

설치된 Postgresql 에 직접 접속하여 사용자와 DB 를 생성해주세요

Postgresql 기본 cli 를 이용하거나 다른 도구를 통해서 DB 마스터 유저로 아래의 쿼리를 실행합니다.

1. 기본 cli 로 DB 접속: `psql -h <db_host> -U <master_user>`

```sql
-- 유저 생성
CREATE ROLE <UserName> WITH
		LOGIN
		NOSUPERUSER
		CREATEDB
		NOCREATEROLE
		INHERIT
		NOREPLICATION
		CONNECTION LIMIT -1
		PASSWORD '<UserPassword>';

-- DB 생성
CREATE DATABASE <DatabaseName>
    WITH
    OWNER = <UserName>
    ENCODING = 'UTF8'
    CONNECTION LIMIT = -1;
```

### env 설정

프로젝트 루트에 `.env` 파일을 생성해서 DB 접속 정보를 입력해주세요 예시로 `.env.sample` 파일이 있습니다.

```
CONF_DB_HOST=localhost
CONF_DB_PORT=5432
CONF_DB_USER=makestar
CONF_DB_PASSWORD=makestar
CONF_DB_NAME=makestar
CONF_LISTEN_PORT=8080
CONF_APPLE_MUSIC_KEY=apple_music_key
```

### node_modules 설치

터미널에서 프로젝트 루트로 이동한 뒤 `yarn` 명령어로 패키지를 설치합니다.

---

### 실행

모든 설치와 위 설정이 끝났다면 `yarn start` 명령어로 실행 하면 됩니다.

---

### API
- Playlist 조회
```
path: /v1/playlist
method: GET
query_params:
    id: playlistId
    countryCode: iso 3166 alpha-2 country code
    serviceType: 'spotify' or 'apple_music'
    availableOnly?: boolean
```

- AppleMusic 정보 동기화
```
path: /v1/sync/apple-music
method: GET
```
간단하게 처리하기 위해 API로 열어두었으나 메세지큐, 람다를 이용한 배치로 처리 혹은 신규 노래 등록 이벤트 트리거, 백오피스 기능으로 인증된 사용자의 요청으로 처리하는 것이 좋습니다.
