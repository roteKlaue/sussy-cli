import { MutableObject } from "sussy-util";
import EventEmitter from "node:events";

/**
 * A class for listening to keyboard input events and translating them into more
 * user-friendly key representations.
 *
 * @extends EventEmitter
 */
class KeyboardListener extends EventEmitter {
    private readonly stdin: NodeJS.ReadStream;
    private readonly encoding: BufferEncoding | "translated";

    /**
     * Create a new KeyboardListener instance.
     *
     * @param {NodeJS.ReadStream} input - The input stream to listen to for keyboard events.
     * @param {BufferEncoding | "translated"} encoding - The encoding to use for interpreting
     *   keyboard input. "translated" indicates using custom key mappings.
     */
    constructor(input: NodeJS.ReadStream, encoding: BufferEncoding | "translated" = 'utf8') {
        super();
        this.stdin = input;
        this.encoding = encoding;

        this.stdin.pause();
        this.stdin.setRawMode(true);
        this.stdin.resume();

        this.stdin.on('data', this.handleKeypress.bind(this));
    }

    /**
     * Handle a keypress event, translating the raw input into user-friendly key representations.
     *
     * @param {Buffer} data - The raw keyboard input data.
     * @private
     */
    handleKeypress = (data: Buffer) => {
        const key = data.toString(this.encoding === "translated" ? "utf8" : this.encoding);
        let mappedKey = key;

        if (this.encoding === "translated") {
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

            if (keyMappings[key]) mappedKey = keyMappings[key];
        }

        const event = {
            key: mappedKey,
            code: key,
            buffer: data
        };

        this.emit('keypress', event);
        this.emit(key);
    }

    /**
     * Stop the KeyboardListener and release the input stream.
     */
    stop() {
        this.stdin.removeListener('data', this.handleKeypress);
        this.stdin.setRawMode(false);
        this.stdin.pause();
    }
}

export { KeyboardListener };