# Yadds

[![GitHub](https://img.shields.io/github/license/shensven/Yadds)](./LICENSE)
[![](https://img.shields.io/github/package-json/dependency-version/shensven/Yadds/dev/electron)](./package.json)
[![](https://img.shields.io/github/package-json/dependency-version/shensven/Yadds/react)](./package.json)
[![Test](https://github.com/shensven/Yadds/actions/workflows/test.yml/badge.svg?branch=dev)](https://github.com/shensven/Yadds/actions/workflows/test.yml)
[![Publish](https://github.com/shensven/Yadds/actions/workflows/publish.yml/badge.svg?branch=main)](https://github.com/shensven/Yadds/actions/workflows/publish.yml)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/2c554add7a15405094f0433d1c903f41)](https://app.codacy.com/gh/shensven/Yadds?utm_source=github.com&utm_medium=referral&utm_content=shensven/Yadds&utm_campaign=Badge_Grade_Settings)

Yet another DSM [Download Station](https://www.synology.com/en-us/dsm/packages/DownloadStation)

## FEATURES

- [x] Free and open source
- [x] Cross-platform support (macOS, Windows, Linux)
- [x] Multi-language hot-switching (English, Simplified Chinese and etc.)
- [x] Dark mode
- [ ] Download progress visualization
- [ ] DSM Multi-account support


## BUILD

### INTRO

- Written with [Electron](https://www.electronjs.org/) & [React](https://reactjs.org/)
- Use [WhiteSource Renovate](https://www.whitesourcesoftware.com/free-developer-tools/renovate) to keep dependencies up to date under the same major version
- Use [Github Workflow](https://github.com/shensven/Readhubn/actions) exclusively for testing and continuous integration

### PREREQUISITES

- [Node 14](https://nodejs.org) or higher, [nvm](https://github.com/nvm-sh/nvm) is recommended for installation
- [npm 7](https://www.npmjs.com/package/npm) or higher

### STARTING DEVELOPMENT

Start the app in the `dev` environment:

```bash
npm run start
```

### PACKAGING FOR PRODUCTION

To package apps for the local platform:

```bash
npm run package
```

## CREDITS

- [electron-react-boilerplate/electron-react-boilerplate](https://github.com/electron-react-boilerplate/electron-react-boilerplate)

## LICENSE

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fshensven%2FYadds.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Fshensven%2FYadds?ref=badge_large)
