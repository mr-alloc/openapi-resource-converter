import fs from "fs";
import * as path from "path";

export function notExist(path: string): boolean {
    return !fs.existsSync(path);
}

export function readFile(path: string, encoding: BufferEncoding = 'utf-8'): string {
    return fs.readFileSync(path, encoding);
}

export function removeFile(filePath: string) {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });  // 재귀적으로 생성
    }
    fs.rmSync(filePath, {
        force: true
    });
}

export function writeFile(path: string, content: string) {
    fs.writeFileSync(path, content, {
        encoding: 'utf-8'
    });
}

export function refreshFile(path: string, content: string) {
    removeFile(path);
    writeFile(path, content);
}
