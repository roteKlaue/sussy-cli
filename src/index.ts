import { promptInput, promptBooleanInput, promptConfirm, promptNumberInput } from "./util/PromptInput";
import { KeyboardListener } from "./util/KeyListener";
import { showProgressBar } from "./io/Progressbar";
import { ChalkInstance } from "chalk";
import menus from "./io/Menus";


export const setup = async () => {
    const chalk = await import("chalk");

    const { textMenu, numberedMenu, checkboxMenu, radioSelectionMenu } = menus(chalk as unknown as ChalkInstance);

    return {
        KeyboardListener,
        radioSelectionMenu,
        checkboxMenu,
        numberedMenu,
        textMenu,
        showProgressBar,
        promptBooleanInput,
        promptNumberInput,
        promptConfirm,
        promptInput,
    }
};