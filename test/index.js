require("../build/index").setup().then(e => {
    const { textMenu, radioSelectionMenu } = e;
    /*textMenu({
        prompt: "hi", options: [
            "test 1",
            "test 2"
        ]
    }).then(e => {
        radioSelectionMenu({
            prompt: "hi", color: "blue", options: [
                "test 1",
                "test 2"
            ]
        });
    })*/
});


(async () => {
    const sussyCLI = await require("../build/index").setup();
    // Example 1: Using a menu
    const menuOptions = ["Option 1", "Option 2", "Option 3"];
    sussyCLI
        .radioSelectionMenu({ prompt: "Choose an option:", options: menuOptions })
        .then((selectedOption) => {
            console.log(`You selected: ${menuOptions[selectedOption]}`);
        });

    // Example 2: Creating a progress bar
    const totalProgress = 100;
    for (let progress = 0; progress <= totalProgress; progress += 10) {
        sussyCLI.showProgressBar(progress, totalProgress);
    }
})();