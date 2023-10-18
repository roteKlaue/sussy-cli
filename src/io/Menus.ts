import { KeyboardListener } from "../util/KeyListener";
import { StringUtil } from "sussy-util";
import { ChalkInstance } from "chalk";

type Colors = {
    hovered: string;
    selected: string;
}

type CheckboxOption = {
    name: string;
    selected: boolean;
};

/**
 * Set up and configure menu utilities.
 *
 * @param {ChalkInstance} chalk - Chalk instance for color formatting.
 * @returns {object} - An object containing menu creation functions.
 */
const setup = (chalk: ChalkInstance) => {
    /**
     * Get a color function based on the provided color name.
     *
     * @param {string} colorName - The name of the color.
     * @returns {Function} - A color function from the Chalk instance.
     */
    const getColorFunction = (colorName: string): Function => {
        return chalk[colorName as keyof typeof chalk] as Function || chalk.green;
    };

    const displaySelectionMenu = (prompt: string, options: string[], current: number, color: string): void => {
        console.log(prompt);
        options.forEach((name, index) => {
            const func = getColorFunction(color);
            const line = index === current ? `  ${func(name)}` : `  ${name}`;
            console.log(line);
        });
    }
    
    /**
     * Display a radio selection menu.
     *
     * @param {object} options - Options for the radio selection menu.
     * @param {string} options.prompt - The menu prompt.
     * @param {string} [options.color="green"] - The color for menu items.
     * @param {string[]} options.options - The list of options.
     * @returns {Promise<number>} - A Promise that resolves to the selected option index.
     */
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

    
    /**
     * Display a checkbox selection menu.
     *
     * @param {object} options - Options for the checkbox selection menu.
     * @param {string} options.prompt - The menu prompt.
     * @param {Colors} options.colors - The colors for menu items.
     * @param {string[]} options.options - The list of options.
     * @param {string} options.last - The label for the last item.
     * @returns {Promise<number[]>} - A Promise that resolves to an array of selected option indexes.
     */
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

    /**
     * Display a numbered selection menu.
     *
     * @param {object} options - Options for the numbered selection menu.
     * @param {string} options.prompt - The menu prompt.
     * @param {string[]} options.options - The list of options.
     * @returns {Promise<number>} - A Promise that resolves to the selected option index.
     */
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

    /**
     * Display a text-based menu.
     *
     * @param {object} options - Options for the text-based menu.
     * @param {string} options.prompt - The menu prompt.
     * @param {string[]} options.options - The list of options.
     * @returns {Promise<number>} - A Promise that resolves to the selected option index.
     */
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

    return {
        checkboxMenu,
        radioSelectionMenu,
        numberedMenu,
        textMenu
    }
};

export default setup;