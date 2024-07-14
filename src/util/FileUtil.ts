import fs from "fs";

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

export function writeNewFile(path: string, content: string) {
    removeFile(path);
    writeFile(path, content);
}
