const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const { exit } = require('process');


function getCommandLineArgs(){
    const [url, file] = process.argv.slice(2);

    if (!url) {
        throw 'Please provide a URL as the first argument.';
    }
    return {url, file}
}

async function getBoardTitleAndColumns(url){
    const browser = await chromium.launch();
    const page = await browser.newPage();

    await page.goto(url);
    await page.waitForSelector('.easy-card-list');

    const boardTitle = await page.$eval('.board-name', (node) => node.innerText);
    if (!boardTitle) {
        throw 'Board title does not exist. Please check if provided URL is correct.'
    }
    const columns = await page.$$('.easy-card-list');
    return {boardTitle, columns}
}

async function processForFile(boardTitle, columns){
    let parsedText = boardTitle.trim() + '\n\n';
    for (let i = 0; i < columns.length; i++) {
        const columnTitle = await columns[i].$eval('.column-header', (node) => node.innerText.trim());

        const messages = await columns[i].$$('.easy-board-front');
        if (messages.length) {
            parsedText += columnTitle + '\n';
        }
        for (let i = 0; i < messages.length; i++) {
            const messageText = await messages[i].$eval('.easy-card-main .easy-card-main-content .text', (node) => node.innerText.trim());
            const votes = await messages[i].$eval('.easy-card-votes-container .easy-badge-votes', (node) => node.innerText.trim());
            parsedText += `- ${messageText} (${votes})` + '\n';
        }

        if (messages.length) {
            parsedText += '\n';
        }
    }

    return parsedText;
}

async function processForCSV(boardTitle, columns){
    boardTitle = boardTitle.split(" ").join("")
    let parsedText =""
    const messagesByCol = []
    let longestArray = 0 

    for (let i = 0; i < columns.length; i++) {
        const columnTitle = await columns[i].$eval('.column-header', (node) => node.innerText.trim()); 
        const messages = await columns[i].$$('.easy-board-front');

        let likedMessages = [columnTitle]
        for (let i = 0; i < messages.length; i++) {
            const messageText = await messages[i].$eval('.easy-card-main .easy-card-main-content .text', (node) => node.innerText.trim());
            const votes = await messages[i].$eval('.easy-card-votes-container .easy-badge-votes', (node) => node.innerText.trim());
            
            if (votes>=1){
                likedMessages.push(messageText)
            }
        }

        if (likedMessages.length){
            messagesByCol.push(likedMessages)
        }

        if (likedMessages.length>longestArray){
            longestArray = likedMessages.length
        }
    }

    for(let i = 0; i<longestArray; i++){
        let row = []
        for(let j=0; j< messagesByCol.length; j++){
            let rowItem = messagesByCol[j][i]=== undefined ? "" : messagesByCol[j][i] 
            row.push(rowItem)
        }
        row = row.join(",")
        parsedText += (row +"\n")
    }
    return {boardTitle, parsedText}
    
}

function writeToFile(filePath, data) {
    const resolvedPath = path.resolve(filePath || `../${data.split('\n')[0].replace('/', '')}.txt`);
    fs.writeFile(resolvedPath, data, (error) => {
        if (error) {
            throw error;
        } else {
            console.log(`Successfully written to file at: ${resolvedPath}`);
        }
        process.exit();
    });
}

function writeToCSV(boardTitle, data){
    const resolvedPath= path.resolve(`../${boardTitle}.csv`);
    fs.writeFile(resolvedPath, data, (error) => {
        if (error) {
            throw error;
        } else {
            console.log(`Successfully written to file at: ${resolvedPath}`);
        }
        process.exit();
    });
}

function handleError(error) {
    console.error(error);
}

//MAIN
const {url, file} = getCommandLineArgs() 

getBoardTitleAndColumns(url)
.then(({boardTitle, columns}) =>{
    if(file !==undefined && file.toUpperCase()==="CSV"){
        processForCSV(boardTitle, columns)
        .then(({boardTitle, parsedText})=>writeToCSV(boardTitle, parsedText))
    }else{
        processForFile(boardTitle, columns)
        .then((parsedText)=>writeToFile(file, parsedText))
    }
})
.catch(handleError)