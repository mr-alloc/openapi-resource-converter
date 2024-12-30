export const isJson = (str?: string): boolean => {
    return !isEmpty(str) && str!.startsWith("{") && str!.endsWith("}");
}

export const isEmpty = (str?: string): boolean => {
    return str === null || str === undefined || str.trim().length === 0;
}

export const toJson = (str: string): any => {
    if (!isJson(str)) {
        console.error('this file is not a json file.');
        return;
    }

    return JSON.parse(str);
}
