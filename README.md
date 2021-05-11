[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
![GitHub package.json version](https://img.shields.io/github/package-json/v/iqb-berlin/verona-player-abi?style=flat-square)

# IQB Verona Player Abi
Verona interfaces are specifications concerning computer based assessment. You can learn
more about this German initiative [here](https://github.com/verona-interfaces/introduction).

IQB´s verona-player-abi is a software component which runs unit definitions inside verona
compliant web applications. The main target for this player are surveys. Unit
definitions are written as simple text scripts.

* [Script syntax](docs/syntax.md) (German only)
* [Response format](docs/key-value.md) (German only)


## Using the Player
* You need a Verona host system to run this software, for example the
[IQB-Testcenter](https://github.com/iqb-berlin/testcenter-setup) or the
[Verona-Player-Testbed](https://github.com/iqb-berlin/verona-player-testbed).
* This angular application builds to one single html file. You can find a ready-to-use player in [release section](https://github.com/iqb-berlin/verona-player-abi/releases) of
this repository.

## Development

This player is an Angular web application. After cloning this repository, you need to download all components this application depends on: 

```
npm install
```

### Build Verona Player Html File
The Verona Interface Specification requires all programming to be built in one single html file. All styles and images need to be packed in one file.
```
npm run build
```
This way, the Angular application is set up as custom element and will be placed inside a Html file. You get the HTML file in the *dist* directory, named `iqb-player-abi@<version>.html`.

### Build Html variant with upload buttons for tests 
There is one distribution variant to load and check unit definitions easily: 
```
npm run build -- dev
```
The wrapper will not support Verona communication spec. You still get one single html file, but with one button to load script files. This way, you can check the player and unit definitions without a server. Just load the html file locally into your browser. 
