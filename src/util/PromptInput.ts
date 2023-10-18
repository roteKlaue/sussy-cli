import readline from 'node:readline';

/**
 * Prompt the user for a string input and return a Promise with the user's response.
 *
 * @param {string} question - The question or prompt for the user.
 * @returns {Promise<string>} - A Promise that resolves to the user's string input.
 */
const promptInput = (question: string): Promise<string> => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            rl.close();
            resolve(answer);
        });
    });
};

/**
 * Prompt the user for a boolean input ('true' or 'false') and return a Promise with the user's response.
 *
 * @param {string} question - The question or prompt for the user.
 * @returns {Promise<boolean>} - A Promise that resolves to a boolean based on the user's response.
 */
const promptBooleanInput = (question: string): Promise<boolean> => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const resolver = (resolve: Function) => {
        rl.question(question, (answer) => {
            answer = answer.trim().toLowerCase();
            const ok = ["true", "false"].includes(answer);
            if (!ok) {
                resolver(resolve);
                return;
            }
            rl.close();
            resolve(answer === "true");
        });
    }

    return new Promise(resolver);
};

/**
 * Prompt the user for a numeric input and return a Promise with the user's response as a number.
 *
 * @param {string} question - The question or prompt for the user.
 * @returns {Promise<number>} - A Promise that resolves to the user's numeric input as a number.
 */
const promptNumberInput = (question: string): Promise<number> => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const resolver = (resolve: Function) => {
        rl.question(question, (answer) => {
            answer = answer.trim();
            if (isNaN(+answer)) {
                resolver(resolve);
                return;
            }
            rl.close();
            resolve(+answer);
        });
    }

    return new Promise(resolver);
};

/**
 * Prompt the user for confirmation (yes or no) and return a Promise with the user's response as a boolean.
 *
 * @param {string} question - The question or prompt for the user.
 * @returns {Promise<boolean>} - A Promise that resolves to `true` if the user confirms with 'yes', or `false` otherwise.
 */
const promptConfirm = async (question: string): Promise<boolean> => {
    const response = await promptInput(`${question} (yes/no): `);
    return response.toLowerCase().trim() === 'yes';
};

export {
    promptInput,
    promptBooleanInput,
    promptNumberInput,
    promptConfirm
}