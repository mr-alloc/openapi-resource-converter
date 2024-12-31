## Summary

이 프로젝트는 Open API 3.0 스펙을 여러 데이터 형태로 변환할 수 있는 라이브러리 입니다.

---

## 설치

```shell

# Git 클론
git clone https://github.com/mr-alloc/openapi-resource-converter.git
cd openapi-resource-converter

# 의존성 설치
npm install # or yarn install


# Typescript 컴파일
npm run build # or yarn build

# bin 설정을 위한 권한부여
chmod +x dist/index.js

# 전역 설치
npm link # or yarn link

# 명령어 실행
orc postman -f <openapi json file path> -o <output file path>

#링크가 잘못 적용 된 경우 링크 삭제
npm unlink -g orc # or yarn unlink -g orc
```

## 옵션

### postman

postman 명령어는 OpenAPI 3.0 스펙을 Postman Collection v2.1 스펙으로 변환합니다.

* -f, --file : OpenAPI 3.0 스펙 JSON 파일 경로 (필수)
* -o, --output : 변환된 JSON 파일 경로 (필수)
* -c, --config : 변환 설정(yaml) 파일 경로 (선택)

포스트맨 컬렉션 변환 설정 파일은 다음과 같은 형식으로 작성합니다.

```yaml
postman:
  ...
```

#### 호스트 지정

포스트맨 요청생성시 사용할 호스트를 지정합니다.
```yaml
postman:
  host: "http://{{url}}" # 기본값: "{{url}}"
```

#### 파라미터 키 케이스 설정

파라미터 키의 케이스를 설정합니다.
사용 가능값: [`camel`, `snake`]
```yaml
postman:
  case: snake # 기본값: camel
```

#### 제외 경로 설정

변환에서 제외할 경로를 설정합니다.
```yaml
postman:
  excludePaths:
    - "/foo/*/move"
    - "/bar/internal/**"
    - "/"
```

#### 기본 헤더 추가

모든 요청에 추가할 기본 헤더를 설정합니다.
```yaml
postman:
  headers:
    Authorization: "Bearer {{token}}"
    Content-Type: application/json
```

#### 플레이스홀더 설정

변환된 요청에 사용할 플레이스홀더를 설정합니다.
포맷은 타입에따라 자동으로 적용됩니다.
```yaml
postman:
  placeholders:
    userId: uid
```
결과:
```text
{
  "userId": {{uid}}, // 숫자형인 경우
  "userId": "{{uid}}" // 문자열인 경우
}
```

#### 요청 래핑 또는 기본값 추가

생성되는 요청을 다른 객체로 감싸서 내부적인 프로토콜에 대응할 수 있습니다.

**JSON 형식의 내부 프로토콜**

🚨 **`type`을 `raw`로 적용해야 합니다.**

아래와 같이 옵션을 적용하는 경우 다음과 같이 `${body}`에 바인딩 되어 적용 됩니다.

```yaml
postman:
  request-wrapper:
    - path: /api/v1/**
      type: raw
      format: |
        {
          "id": {{id}},
          "app": "{{version}}",
          "message": ${body}
        }
```

*AS IS*

```
{
  "userId": {{userId}}
}
```

*TO BE*

/api/v1/users: `/api/v1/**`에 해당 되므로 옵션이 요청이 래핑됩니다.

```
{
  "id": {{id}},
  "app": "{{version}}",
  "message": {
    "userId": {{userId}}
  }
}
```

/api/v2/users: `/api/v1/**`에 해당되지 않으므로 그대로 출력됩니다.

```
{
  "userId": {{userId}}
}
```

**Formdata 형식의 파라미터 목록**

🚨 **`type`을 `formdata`로 적용해야 합니다.**

```yaml
postman:
  request-wrapper:
    - path: /api/v1/**
      type: formdata
      values:
        - name: token
          description: 인증토큰
          value: "{{token}}"
        - name: timestamp
          description: 클라이언트 시간
          value: "{{timestamp}}"
        - name: isAdult
          description: 성인여부
          value: "{{isAdult}}"
```

위와 같이 적용시 다른 formdata 파라미터와 함께 적용되어 아래와 같이 보여집니다.

![Formdata 옵션](/images/formdata-option.png)

---
