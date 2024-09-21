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

4. Install the necessary plugins and loaders:

    - Install `html-webpack-plugin` to generate an HTML file for the build:
      ```bash
      npm install html-webpack-plugin --save-dev
      ```

    - Install `clean-webpack-plugin` to clean up the `dist` folder before each build:
      ```bash
      npm install clean-webpack-plugin --save-dev
      ```

    - Install `babel-loader` and the required Babel packages to transpile JavaScript:
      ```bash
      npm install babel-loader @babel/core @babel/preset-env --save-dev
      ```

5. Create a `.babelrc` file in the root directory of your project with the following content:
    ```json
    {
      "presets": ["@babel/preset-env"]
    }
    ```

6. Run the following command to automatically update `bundle.js`:
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

This `README.md` file now includes the necessary steps for installing the missing dependencies and guides users through the entire process of setting up, developing, and building the project for production.