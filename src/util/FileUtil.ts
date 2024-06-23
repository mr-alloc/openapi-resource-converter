import fs from "fs";

export function removeFile(path: string) {
    fs.rmSync(path, {
        force: true
    });
}

export function writeFile(path: string, content: string) {
    fs.writeFileSync(path, JSON.stringify(content, null, 2), {
        encoding: 'utf-8'
    });
}

export function writeNewFile(path: string, content: string) {
    removeFile(path);
    writeFile(path, content);
}