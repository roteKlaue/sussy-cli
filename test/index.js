require("../build/index").setup().then(e => {
    const { textMenu, radioSelectionMenu } = e;
    textMenu({ prompt: "hi", options:[
        "test 1",
        "test 2"
    ] }).then(e => {
        radioSelectionMenu({ prompt: "hi", color: "blue", options:[
            "test 1",
            "test 2"
        ] });
    })
})


