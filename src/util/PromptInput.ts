import readline from 'node:readline';

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