import { KeyboardListener } from "../util/KeyListener";
import { StringUtil } from "sussy-util";
import chalk from "chalk";

type Colors = {
    hovered: string;
    selected: string;
}

type CheckboxOption = {
    name: string;
    selected: boolean;
};

const getColorFunction = (colorName: string): Function => {
    return chalk[colorName as keyof typeof chalk] as Function || chalk.green;
};

const displaySelectionMenu = (prompt: string, options: string[], current: number, color: string): void => {
    console.log(prompt);
    options.forEach((name, index) => {
        const func = getColorFunction(color);
        const line = index === current ? `  ${func((name))}` : `  ${name}`;
        console.log(line);
    });
}

const radioSelectionMenu = ({ prompt, color, options }: { prompt: string, color?: string, options: string[] }): Promise<number> => {
    return new Promise((resolve, _reject) => {
        const listener = new KeyboardListener(process.stdin, "utf-8");
        let current = 0;
        displaySelectionMenu(prompt, options, current, color ?? "green");

        listener.on('keypress', (key) => {
            switch (key.key) {
                case "Enter":
                    listener.stop();
                    resolve(current);
                    break;
                case "ArrowUp":
                    console.clear();
                    if (current > 0) {
                        current--;
                    }
                    displaySelectionMenu(prompt, options, current, color ?? "green");
                    break;
                case "ArrowDown":
                    console.clear();
                    if (current < options.length - 1) {
                        current++;
                    }
                    displaySelectionMenu(prompt, options, current, color ?? "green");
                    break;
            }
        });
    })
}

const displayCheckboxOptions = (options: CheckboxOption[], colors: Colors, currentIndex: number): void => {
    options.forEach(({ name, selected }, index) => {
        selected && (() => {
            name = getColorFunction(colors.selected)(name);
        })();
        index === currentIndex && (() => {
            name = getColorFunction(colors.hovered)(name);
        })();
        console.log(`  ${name}`);
    });
};

const checkboxMenu = ({ prompt, colors, options, last }: { prompt: string; colors: Colors; options: string[]; last: string }): Promise<number[]> => {
    colors.selected = `bg${StringUtil.capitalize(colors.selected)}`;

    return new Promise((resolve, _reject) => {
        const mappedOptions: CheckboxOption[] = options.map(name => ({ name, selected: false }));
        let currentIndex = 0;

        const listener = new KeyboardListener(process.stdin, "utf-8");

        const updateDisplay = () => {
            console.clear();
            console.log(prompt);
            displayCheckboxOptions(mappedOptions, colors, currentIndex);
            console.log(`  ${currentIndex === options.length ? getColorFunction(colors.hovered)(last) : last}`);
        };

        const toggleSelection = () => {
            const currentOption = mappedOptions[currentIndex];
            currentOption.selected = !currentOption.selected;
        };

        updateDisplay();

        listener.on('keypress', (key) => {
            switch (key.key) {
                case "Enter":
                    if (currentIndex === options.length) {
                        listener.stop();
                        const selectedIndexes = mappedOptions
                            .map((option, index) => (option.selected ? index : -1))
                            .filter(index => index !== -1);
                        resolve(selectedIndexes);
                    } else {
                        toggleSelection();
                    }
                    updateDisplay();
                    break;
                case "ArrowUp":
                    if (currentIndex > 0) {
                        currentIndex--;
                        updateDisplay();
                    }
                    break;
                case "ArrowDown":
                    if (currentIndex < options.length) {
                        currentIndex++;
                        updateDisplay();
                    }
                    break;
            }
        });
    });
};

const numberedMenu = ({ prompt, options }: { prompt: string; options: string[] }): Promise<number> => {
    return new Promise((resolve, _reject) => {
        const listener = new KeyboardListener(process.stdin, "utf-8");
        let current = 0;

        const displayMenu = () => {
            console.clear();
            console.log(prompt);
            options.forEach((option, index) => {
                const prefix = index === current ? "> " : "  ";
                console.log(`${prefix}${index + 1}. ${option}`);
            });
        };

        displayMenu();

        listener.on('keypress', (key) => {
            switch (key.key) {
                case "Enter":
                    listener.stop();
                    resolve(current);
                    break;
                case "ArrowUp":
                    if (current > 0) {
                        current--;
                        displayMenu();
                    }
                    break;
                case "ArrowDown":
                    if (current < options.length - 1) {
                        current++;
                        displayMenu();
                    }
                    break;
            }
        });
    });
};

const textMenu = ({ prompt, options }: { prompt: string; options: string[] }): Promise<number> => {
    return new Promise((resolve, _reject) => {
        const listener = new KeyboardListener(process.stdin, "utf-8");
        let current = 0;

        const displayMenu = () => {
            console.clear();
            console.log(prompt);
            options.forEach((option, index) => {
                const prefix = index === current ? "> " : "  ";
                console.log(`${prefix}${option}`);
            });
        };

        displayMenu();

        listener.on('keypress', (key) => {
            switch (key.key) {
                case "Enter":
                    listener.stop();
                    resolve(current);
                    break;
                case "ArrowUp":
                    if (current > 0) {
                        current--;
                        displayMenu();
                    }
                    break;
                case "ArrowDown":
                    if (current < options.length - 1) {
                        current++;
                        displayMenu();
                    }
                    break;
            }
        });
    });
};

export { radioSelectionMenu, checkboxMenu, numberedMenu, textMenu };