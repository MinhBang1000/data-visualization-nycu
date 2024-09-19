Here is a `README.md` file based on the instructions you've provided:

```markdown
# Project Setup and Build Guide

## Prerequisites

Ensure you have the following versions installed on your machine:

- **Node.js**: `v18.16.0`
- **npm**: `9.6.6`

You can check your versions by running:

```bash
node -v
npm --version
```

## Installation

To set up the project for development purposes, follow these steps:

1. Initialize the project:
    ```bash
    npm init -y
    ```

2. Install `webpack` and `webpack-cli` as development dependencies:
    ```bash
    npm install webpack webpack-cli --save-dev
    ```

3. Install `webpack-dev-server` as a development dependency:
    ```bash
    npm install -D webpack-dev-server
    ```

4. Run the following command to automatically update `bundle.js`:
    ```bash
    npx webpack serve
    ```

## Building the Project

After setting up the development environment, follow these additional steps to build the project:

1. **Uncomment the production code** in the webpack configuration file (`webpack.config.js`).
   
2. **Comment out the development version** of the configuration in the same file.

3. Run the following command to build the project:
    ```bash
    npm run build
    ```

4. After the build process completes, check the `dist` folder for the generated files.

5. Copy `style.css` to the `dist` folder so that it can be referenced by `index.html`.

---

Now your project is ready for production!
``` 

This `README.md` should guide users to install, run, and build your project with ease.