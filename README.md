# FunRetro.io export

[![License][license-badge]][license-url]

> CLI tool to easily export [FunRetro.io](https://funretro.io/) retrospective boards using Playwright to TXT or CSV files.

## Installing / Getting started

It's required to have [npm](https://www.npmjs.com/get-npm) installed locally to follow the instructions.

```shell
git clone https://github.com/nicolewert/funretro-export.git
cd funretro-export
npm install
```

For CSV output type: 
```
npm start -- "http://funretro.io/board..." "CSV"
```

For TXT output type: 
```
npm start -- "http://funretro.io/board..."
```

For TXT output you may optionally include a file name to save the document under.

```
npm start -- "http://funretro.io/board..." "../exported-file.txt" 
```

## Description

This project accomplishes the following criteria:
- Introduces a command to enable the user to pick the output format (ex. original program logic for text files and new program logic for csv file)
- Adds new program logic for csv files: 
  - Output file has an extension of csv
  - The file name is the title of the board without spaces
  - The content is structured as Row1: Col 1, Col2, Col3, Row2: Col1, Col2, Col3, etc.
  - Only content with at least 1 vote is included in the file output
- Refactors code to adopt a functional modular approach

  *Assumptions:*
  - files will save to './funretro-export/filename.extension'
  - the csv will contain the column title of all columns from the retrospective board, even if there are no messages which meet the requirement of at least one like for that column 

### Project Goal 
The purpose of this project was to enable scrum masters to export the relevant content of their team's previous retrospective boards so that they can be uploaded into new retrospective boards in future meetings. 

## Built With

* [Playwrite](https://playwright.dev/) - Browser Control, Testing
* [Npm](https://www.npmjs.com/) - Package Management

## Authors

* **Matt Burgess** - *Initial work* - [funretro-export](https://github.com/matt-burgess/funretro-export)

## Licensing

MIT License

[license-badge]: https://img.shields.io/github/license/robertoachar/docker-express-mongodb.svg
[license-url]: https://opensource.org/licenses/MIT
