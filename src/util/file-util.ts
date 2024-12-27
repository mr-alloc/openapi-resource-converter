import fs from "fs";
export function notExist(path: string): boolean {
    return !fs.existsSync(path);
}

export function readFile(path: string, encoding: BufferEncoding = 'utf-8'): string {
    return fs.readFileSync(path, encoding);
}

export function removeFile(path: string) {
    fs.rmSync(path, {
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
