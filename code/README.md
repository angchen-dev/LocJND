## Project Structure

This project uses the __Node Package Manager (NPM)__  to install external dependencies, such as D3 or Bootstrap automatically.
To use it, install Node.js either from your platform's package manager or from the [Node.js website](https://nodejs.org/).

After installing Node.js, you can tell NPM to install all dependencies of this project automatically.
In the main project folder, run:
```bash
npm install
```

After the command has finished, you will find a new folder `node_modules` and a new file `package-lock.json` in your project folder.
Those contain the dependencies as well as the version information for all the packages installed (so another person that wants to use this project can install all dependencies in the exact same version).
__You do not need to worry about these - just leave them there.__

### WebPack

WebPack is a _bundler_ for JavaScript.
It combines all the modules in this project (i.e., all `.js` files containing an `export`-statement) to static files.
This allows writing JavaScript in a modular way, without having to handle dependencies on your own.

To tell WebPack to bundle your files to the directory `./dist`, type the following command:
```bash
npm run build
```

From this folder, you can serve your project using an HTTP server of your choice.

However, for development, WebPack has a nice functionality: with __Webpack Dev Server__, it automatically bundles your project to an invisible directory that is directly served on `localhost:8080` (if port `8080` is available).
When you edit your code and save the file, it instantly updates the browser page with the new content.

To start the development server, type:
```bash
npm run start
```

### Linting

To ensure code quality and force multiple developers to follow the same coding standards, a linter defines a common rule set for code style.
To show the violations of this ruleset, type:
```bash
npm run eslint
```
__Please only hand in code that passes this test without errors!__

To fix straight-forward issues (e.g., replacing `"` with `'` in strings), you can execute
```bash
npm run eslint-fix
```
This will automatically fix the issues for which eslint knows a simple resolution.


## Adding Your Own Code

### `src/components/`

To add your visualizations, implement the classes in `src/components/`.
You can add your own files and classes, e.g., to create abstract base classes or add a new type of visualization.

### `src/tools/`

This folder contains helper functions, e.g., the data loading functionality can go into `data-manager.js`.

### `public/index.html`

This file is the template for your HTML page, i.e., WebPack injects the final JavaScript bundle into this template.
To include controls and modify your website layout, change this file.

### `src/main.js`

This is the main JavaScript file, i.e., the entry point of your application.
The control flow starts here.
Modify this file to
* load data
* select DOM elements
* add events to DOM elements
* pass data to your vis-components
* render your vis-components (by drawing them on SVG DOM elements)

### `static/`

This folder contains static assets for your project.
__Its content is copied _as-is_ to the root folder of your project.__
Currently, it only includes the folder `datasets`.
Therefore, you can access them as `datasets/{dataset-name}.csv` in your project.