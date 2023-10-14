import EventEmitter from "node:events";
import { MutableObject } from "sussy-util";

class KeyboardListener extends EventEmitter {
    private readonly stdin: NodeJS.ReadStream;
    private readonly encoding: BufferEncoding;

    constructor(input: NodeJS.ReadStream, encoding: BufferEncoding = 'utf8') {
        super();
        this.stdin = input;
        this.encoding = encoding;

        this.stdin.pause();
        this.stdin.setRawMode(true);
        this.stdin.resume();

        this.stdin.on('data', this.handleKeypress.bind(this));
    }

    handleKeypress = (data: Buffer) => {
        const key = data.toString(this.encoding);

        const keyMappings: MutableObject<string> = {
            '\u001B[A': 'ArrowUp',
            '\u001B[B': 'ArrowDown',
            '\u001B[C': 'ArrowRight',
            '\u001B[D': 'ArrowLeft',
            '\r': 'Enter',
            '\u0003': 'ControlC',
            '\u001B[3~': 'Delete',
            '\u001B[H': 'Home',
            '\u001B[F': 'End',
            '\u001B[5~': 'PageUp',
            '\u001B[6~': 'PageDown',
            '\u001B[Z': 'ShiftTab',
            ' ': 'Space',
            '\t': 'Tab',
        };

        const mappedKey = keyMappings[key] || key;

        const event = {
            key: mappedKey,
            code: key,
        };

        this.emit('keypress', event);
        this.emit(key);
    }

    stop() {
        this.stdin.removeListener('data', this.handleKeypress);
        this.stdin.setRawMode(false);
        this.stdin.pause();
    }
}

export { KeyboardListener };