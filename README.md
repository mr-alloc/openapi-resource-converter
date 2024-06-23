### Wrapping Request Body

```typescript
configures.defaultBodyWrapper((path, method, body) => {
    if (path.value.startsWith("/v1")) {
        return {
            member_id: "{{member_id}}",
            value: body
        } as IPostmanRequestBody;
    } else if (path.value.startsWith("/v2")) {
        const parameters = new Array<Parameter>();
        parameters.push(new Parameter("member_id", InType.QUERY, "Member Id", true, DataType.INTEGER, DataFormat.INT64));
        if (body) {
            Object.entries(body).forEach(([key, value]) => {
                parameters.push(new Parameter(key, InType.QUERY, key, true, DataType.STRING, DataFormat.NONE));
            })
        }
        return parameters;
    }

    return body;
});
```

### Add Placeholders

```typescript
configures.addPlaceholders(new Map<string, any>([
    ['memberId', 'memberId'],
]))
```
