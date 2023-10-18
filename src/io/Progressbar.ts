/**
 * Display a progress bar in the console based on the given progress and total values.
 *
 * @param {number} progress - The current progress value.
 * @param {number} total - The total value representing the completion of a task.
 */
const showProgressBar = (progress: number, total: number): void => {
    const percentage = (progress / total) * 100;
    const barLength = 30;
    const progressChars = Math.floor((percentage / 100) * barLength);
    const progressBar = `[${'='.repeat(progressChars)}${' '.repeat(barLength - progressChars)}] ${percentage.toFixed(2)}%`;
    console.log(progressBar);
};

export { showProgressBar }