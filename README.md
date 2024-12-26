## Summary

This project is a library for generating **OpenAPI 3.0** specification from a TypeScript project.

---

## 설치

```shell

# Git 클론
git clone https://github.com/mr-alloc/openapi-resource-converter.git
cd openapi-resource-converter

# 의존성 설치
npm install

# 개발 의존성 설치 (ts-node, tsconfig-paths 등)
npm install --save-dev typescript ts-node tsconfig-paths @types/node

# Typescript 컴파일
npm run build

# bin 설정을 위한 권한부여
chmod +x dist/index.js

# 전역 설치
npm link

# 명령어 실행
orc postman
```

## 실행
```shell

yarn convert postman --file /your/file/path
```

## Usage
This library is designed to be used in a TypeScript project. The following steps are required to generate an OpenAPI 3.0 specification.
1. Put openapi.json into resources dir in the root of the project.
2. Use ts module of converter like below:
```typescript
import OpenApiParser from "@/parser/OpenApiParser";
import PostmanCollectionConverter from "@/converter/postman/PostmanCollectionConverter";
import PostmanConvertConfigures from "@/converter/postman/PostmanConvertConfigures";
import CaseMode from "@/type/postman/constant/CaseMode";
import {writeNewFile} from "@/util/FileUtil";

const openAPISpecification = OpenApiParser.parse('./resources/openapi.json');
const configures = new PostmanConvertConfigures("{{url}}", CaseMode.CAMEL); 
const converter = new PostmanCollectionConverter(openAPISpecification, configures);

const path = `${process.cwd()}/static/postman.json`
const converted = converter.convert();
writeNewFile(path, JSON.stringify(converted, null, 2));
```

---

## Options

### Choose case mode for key of parameters
```typescript
const configures = new PostmanConvertConfigures("{{url}}", CaseMode.SNAKE); 
```

#### As is
<img src="./images/asis_choose_case.png" width="300px" />

#### To be
<img src="images/tobe_choose_case.png" width="300px" />


### Exclude Path
```typescript
configures.addExcludePaths(["/foo", "/bar", "/"]);
```
This options will be support for excluding as a using asterisk soon.

### Wrapping Request Body
```typescript
configures.defaultBodyWrapper((path, method, body) => {
    return {
        version: "{{version}}",
        value: body
    } as IPostmanRequestBody;
});
```

#### As is
<img src="./images/asis_wrapping_body.png" width="300px" />

#### To be
<img src="images/tobe_wrapping_body.png" width="300px" />


### Add Placeholders

```typescript
configures.addPlaceholders(new Map<string, any>([
    ['email', 'custom_email'],
]))
```

#### As is
<img src="./images/asis_add_placeholder.png" width="300px" />

#### To be
<img src="images/tobe_add_placeholder.png" width="300px" />

---

## Convert your openapi spec right now!!
![Convert your Open API3 Spec right now!](./images/convert_right_now.png)
