# XAML Zeplin Extension

[Zeplin extension](https://extensions.zeplin.io/) that generates XAML (Universal Windows Platform) snippets and resources from colors, text styles and layers.

## Getting Started

### Prerequisites

* [Zeplin for Mac](https://support.zeplin.io/quick-start/downloading-mac-and-windows-apps)
* [Node.js](https://nodejs.org/en/)
* [Git](https://git-scm.com/downloads)

### Installing

1. Clone the repository

```bash
git clone https://github.com/nventive/zeplin-extension-xaml
```

2. Navigate to the repository

```bash
cd zeplin-extension-xaml
```

3. Install the node packages locally

```bash
npm install
```

4. Build the extension using webpack

```bash
npm run build
```

5.  [Add the local extension to Zeplin](https://github.com/zeplin/zeplin-extension-documentation/blob/master/tutorial.md)

```
./dist/manifest.json
```

## Built With

* [Zeplin](https://zeplin.io/)
* [Node.js](https://nodejs.org/en/)
* [Visual Studio Code](https://code.visualstudio.com/)
* [webpack](https://webpack.js.org/)
* [mustache](https://mustache.github.io/)
* [Lodash](https://lodash.com/)

## License

This project is licensed under the Apache License, Version 2.0 - see the [LICENSE](LICENSE) file for details