require("../build/index").setup().then(e => {
    const { textMenu } = e;
    textMenu({ prompt: "hi", options:[
        "test 1",
        "test 2"
    ] })
})


