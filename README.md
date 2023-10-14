# sussy-cli

**sussy-cli** is a versatile command-line tool designed for ease of use and productivity. Simplify your tasks with user-friendly commands and customization.

Explore features and get started below.

## Table of Contents

- [Introduction](#introduction)
- [Installation](#installation)
- [Usage](#usage)
- [License](#license)

## Introduction

sussy-cli is a powerful and flexible command-line tool that helps you accomplish various tasks with ease. It provides a set of useful commands and features to streamline your workflow.

## Installation

Explain how to install your module. You can provide code snippets or installation commands if necessary.

```bash
npm install sussy-cli
```

## Usage

```js
const sussyCLI = require('sussy-cli');

// Example 1: Using a menu
const menuOptions = ['Option 1', 'Option 2', 'Option 3'];
sussyCLI.radioSelectionMenu({ prompt: 'Choose an option:', options: menuOptions })
  .then((selectedOption) => {
    console.log(`You selected: ${menuOptions[selectedOption]}`);
  });

// Example 2: Creating a progress bar
const totalProgress = 100;
for (let progress = 0; progress <= totalProgress; progress += 10) {
  sussyCLI.showProgressBar(progress, totalProgress);
}
```

## License
This project is licensed under the GPL-3.0 - see the [LICENSE](LICENSE) file for details.