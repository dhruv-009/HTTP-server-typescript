import * as fs from 'node:fs';
import * as readline from 'readline';

function getLinesChannel(stream: fs.ReadStream, onLine: (line: string) => void): void {
    const rl = readline.createInterface({
        input: stream
    })
    rl.on('line', (chunk) => {
        onLine(chunk)
    })
    rl.on('error', (err) => {
        console.error('Error reading the files:', err)
    })
    rl.on('close', ()=>{
        stream.destroy()
    })
}

export function main(filePath:string): void {
    const stream = fs.createReadStream(filePath, {highWaterMark:8})
    getLinesChannel(stream, (line) => {
        console.log(`read: ${line}`)
    })
}
