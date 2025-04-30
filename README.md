# React Test Project Guide

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app), and is configured for static deployment via GitHub Pages.

---

## Local Development Scripts

In the project directory, you can run:

### `npm start`
Runs the app in development mode.

- Open [http://localhost:3000](http://localhost:3000) to view in your browser.
- The page will reload if you make edits.

---

### `npm test`
Launches the test runner in interactive watch mode.

Reference: [Running Tests](https://facebook.github.io/create-react-app/docs/running-tests)

---

### `npm run build`
Builds the app for production to the `build` folder.

- Bundles React in production mode and optimizes the build
- Minifies code and includes hash in filenames

---

### `npm run eject`
Exposes all underlying configuration files.

> Warning: This action is irreversible. Not recommended for beginners.

---

## Deploying to GitHub Pages

### `npm run deploy`
Uses [`gh-pages`](https://www.npmjs.com/package/gh-pages) to deploy the `build/` folder to the `gh-pages` branch.

```bash
npm run build      # Builds the app
npm run deploy     # Deploys to GitHub Pages
```

Make sure `package.json` is correctly set:
```json
"homepage": "https://<GitHubUsername>.github.io/<repository-name>"
```

Example:
```json
"homepage": "https://Raito-95.github.io/react-test"
```

---

## Cleaning Up `gh-pages` Branch History (Optional)
If long-term deployments bloat the `gh-pages` branch, you can clear its history and keep only the latest commit. Refer to:

[Reset gh-pages History Guide](./ClearBranch.md)

---

## Learn More

- [Create React App Documentation](https://facebook.github.io/create-react-app/docs/getting-started)
- [React Official Docs](https://reactjs.org/)
- [GitHub Pages Deployment Guide](https://facebook.github.io/create-react-app/docs/deployment)

---

## Advanced Topics (Moved to Official Docs)

- [Code Splitting](https://facebook.github.io/create-react-app/docs/code-splitting)
- [Analyzing Bundle Size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)
- [Progressive Web App](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)
- [Advanced Configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)
- [Build Errors & Minification Issues](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

---

This file is customized for actual project usage and is intended to replace the default Create React App README.

