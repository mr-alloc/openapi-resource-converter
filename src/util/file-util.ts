import fs from "fs";
const baseDir = process.cwd();
export function notExist(path: string): boolean {
    return !fs.existsSync(baseDir + path);
}

export function readFile(path: string, encoding: BufferEncoding = 'utf-8'): string {
    return fs.readFileSync(baseDir + path, encoding);
}

export function removeFile(path: string) {
    fs.rmSync(baseDir + path, {
        force: true
    });
}

export function writeFile(path: string, content: string) {
    fs.writeFileSync(baseDir + path, content, {
        encoding: 'utf-8'
    });
}

export function refreshFile(path: string, content: string) {
    removeFile(path);
    writeFile(path, content);
}
