import { promptInput, promptBooleanInput, promptConfirm, promptNumberInput } from "./util/PromptInput";
import { KeyboardListener } from "./util/KeyListener";
import { showProgressBar } from "./io/Progressbar";
import { ChalkInstance } from "chalk";
import menus from "./io/Menus";


export const setup = async () => {
    // typescript compiler f**ks this up needs to be manually fixed after compilation
    const chalk = (await import("chalk")).default;

    const { textMenu, numberedMenu, checkboxMenu, radioSelectionMenu } = menus(chalk);

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