# Convert to Postman Collection

[![NPM Version](https://img.shields.io/npm/v/openapi-resource-converter?style=flat-square)](https://www.npmjs.com/package/openapi-resource-converter)
![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)
![Build Status](https://img.shields.io/github/actions/workflow/status/mr-alloc/openapi-resource-converter/publish.yaml?style=flat-square)

```bash
orc postman -f <openapi json file path> -o <output file path>
```

postman 명령어는 OpenAPI 3.0 명세을 Postman Collection v2.1 명세로 변환합니다.

| 옵션           | 설명                             | 예시                         | 필수 |
|--------------|--------------------------------|----------------------------|----|
| -f, --file   | OpenAPI 3.0 스펙 JSON 파일 경로 (필수) | -f build/docs/openapi.json | ✅  |
| -o, --output | 변환된 JSON 파일 경로 (필수)            | -o build/docs/postman.json | ✅  |
| -c, --config | 변환 설정(yaml) 파일 경로 (선택)         | -c .postman/orc.yaml       | ❌  |
| -l, --lint   | 설정 파일 검증, -c 옵션과 함께 사용         | -l                         | ❌  |

포스트맨 컬렉션 변환 설정 파일은 다음과 같은 형식으로 작성합니다. (The file that configuring specification that will be converted should be start
with:)

## 설정 파일

```yaml
postman:
  ...
```

> 포스트맨 컬렉션 변환은 설정 파일을 제공하므로써 좀 더 상세한 변환이 가능합니다.

## 공통 설정파일 구성

포스트맨 컬렉션 변환은 `postman` 속성에 옵션을 적용합니다.

### 호스트 지정

```yaml
postman:
  host: "http://{{url}}" # 기본값: "{{url}}"
```

포스트맨 요청생성시 사용할 호스트를 지정합니다.

### 파라미터 키 케이스 설정

파라미터 키의 케이스를 설정합니다. (Set the case for naming convention)
사용 가능값: [`camel`, `snake`] (available values)

```yaml
postman:
  case: snake # 기본값: camel
```

예를 들어, `snake` 를 지정한 경우 아래와 같이 키 이름이 적용됩니다. 반대로 `carmel`을 선택한 경우 `userId`로 대치 됩니다.

```json
{
    "user_id": "..."
}
```

### 제외 경로 설정

```yaml
postman:
  exclude-paths:
    - "/foo/*/move"
    - "/bar/internal/**"
    - "/"
```

변환에서 제외할 경로를 설정합니다. 해당 옵션에 포함된 경로는 변환 대상에서 제외됩니다.

### 공통 기본 헤더 추가

```yaml
postman:
  headers:
    Authorization: "Bearer {{token}}"
    Content-Type: application/json
```

모든 요청에 추가할 기본 헤더를 설정합니다. 만약 `request-wrapper` 옵션과 겹친다면, 공통 정보는 덮어쓰여집니다.

### 플레이스홀더 설정 (Set the placeholder)

변환된 요청에 사용할 플레이스홀더를 설정합니다. (Set the placeholders that be used while converting)
포맷은 타입에따라 자동으로 적용됩니다. (The format specified according to its type)

```yaml
postman:
  placeholders:
    userId: uid
```

결과:

```json
{
    "userId": "{{uid}}"
    //정수형인 경우 {{uid}}
}
```

---

## 요청별 설정파일 구성

요청 별 구성은 일부 공통 옵션과 동일한 값에대해 덮어쓰며, 개별적으로 상세한 적용이 가능합니다.

```yaml
postman:
  # (공통설정 생략)
  request-wrapper:
    - path: ...
```

공통 설정의 경우 모든 요청에 대해 적용되지만, 이 경우 일부 요청별로 세밀하게 다른 작은 부분을 제어할수 없습니다.
하지만 요청별로 옵션을 구분하여, 설정한다면 컬렉션 Import 직후 매번 반복적인 수정작업을 하지 않아도 됩니다.

### Path and Method

기본적으로 요청을 세밀하기 구분하기 위해서는 `path` 속성과 `method` 속성을 사용합니다.

* (필수) `path` 속성의 경우 한개의 문자열을 받으며, [`Glob Pattern`](https://en.wikipedia.org/wiki/Glob_(programming))로 패턴 매칭이 적용됩니다.
* (기본 값 `all`) `method` 속성은 `HTTP_METHOD` 속성이 적용되며, **all** 값으로 전체 범위 적용이 가능합니다.

```yaml
postman:
  request-wrapper:
    - path: /**
      method: delete
```

예시1: 전체 경로에 대해 `DELETE` 메서드를 가지는 모든 요청에 적용합니다.

```yaml
postman:
  request-wrapper:
    - path: /team
      method: all
```

만약 `/team` 에 대해 조회(`GET`)와 등록(`POST`) 및 삭제(`DELETE`)를 모두 잡고 싶다면 위와 같이 할 수 있고,
`/team`으로 시작하는 모든 패턴 매칭을 하려면, `Glob` 패턴 매칭을 활용하여 `path: /team{,/**}`로 적용 할 수도 있습니다.

### Type

```yaml
postman:
  request-wrapper:
    - path: /team
      method: post
      type: ...
```

**타입**은 해당 요청이 어떤 규격으로 전달되는가를 의미하는 값 입니다.

| type       | 설명                   |
|------------|----------------------|
| all        | 전체 (기본)              |
| raw        | JSON, XML 등 본문       |
| formdata   | 멀티 파트 폼 데이터(텍스트, 파일) |
| urlencoded | HTML Form 전송         |

#### Type: raw

`raw` 타입은 `JSON`이나 `XML` 을 지원 하지만, 현재 기능들은 주로 `JSON`에 대응되어있습니다.
예를들어 `format` 키워드는 요청 바디 자체를 특정 유형으로 래핑하여 사용할 수 있습니다.

**일반 요청**

```json
{
    "name": "verok"
}
```

**래핑된 요청**

```json
{
    "userId": "{{user-id}}",
    "appVersion": "{{app-version}}",
    "body": {
        "name": "verok"
    }
}
```

`RESTful`한 서비스는 사용할 일이 많지 않겠지만, 오래된 서비스들은 구조를 바꾸기 쉽지 않기 때문에, 공통정보를 위와 같이 body에 포함시키는 경우가 있습니다.
이를 해결하기 위해 `format` 키워드로 요청을 감싸 새로운 요청을 만들 수 있습니다.

> 중요한 점은 값 자체는 문자열이며 `${body}` 키워드를 대체하는 것 입니다.

```yaml
postman:
  request-wrapper:
    - path: /team
      method: post
      type: raw
      format: |
        {
            "userId": "{{user-id}}",
            "appVersion": "{{app-version}}",
            "body": ${body}
        }
```

#### Type: formdata

`formdata`는 multipart form data을 지원합니다.
다양한 기본값을 추가 하기위해 `values` 키워드를 사용할 수 있습니다.

```yaml
postman:
  request-wrapper:
    - path: /api/v3/**
      type: formdata
      values:
        - name: token
          description: "인증 토큰"
          value: "{{token}}"
```

#### 개별 요청 헤더

```yaml
postman:
  headers:
    Authorization: "Bearer {{token}}"
  request-wrapper:
    - path: /priority-headers
      headers: # 우선적용
        Authorization: "Bearer {{overwriteToken}}"
```

공통적으로 헤더를 지정할 수 있지만, 특정 요청에 대해서도 개별적으로 적용이 가능합니다.
`request-wrapper[].headers` 위치에 지정이 가능하며, 공통 해더보다 우선적으로 적용됩니다.

---

### Event

만약 요청 전/후로 특정 이벤트 스크립트를 적용하고 싶다면 아래와 같이 작성할 수 있습니다.
스크립트는 기본적으로 `javascript`이며, 포스트맨 클라이언트에서 실행됩니다.

```yaml
postman:
  request-wrapper:
    - path: /sign-in
      type: all
      event:
        pre-request: |-
          console.log("Say Hi");
        post-response: |-
          const body = pm.response.json();
          pm.environment.set("access_token", body.accessToken);
          pm.environment.set("refresh_token", body.refreshToken);
```