/*
    Global variables and constants
*/
let company = ["AMZN", "PYPL", "AAPL", "UBER", "LYFT", "DAL"];

/* 
    Functions
*/

/*
    Function name: handleSearchButtonClick
    purpose: handles the click event for the symbol to search
    input: event - the event that triggered the call
    returns: null
*/
function handleSearchButtonClick(event) {
    console.log(event.target);
    //TODO: read the value of the search field and store it

    //TODO: call the stockprice api to get the data 
    //TODO: call the news api to get the news
    //TODO: catch potential errors and stop execution
    //process the data and display it
}

/* 
    Function name: callStockPriceApi
    Purpose: calls the stock price api 
    Input: companySymbol - company symbol
    returns: TBD
*/
function callStockPriceApi(companySymbol) {
    // build API query with symbol
    console.log("company symbol " + companySymbol);
    APIQuery = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${companySymbol}&apikey=8XODZRFY9GB4A5XY`;
    // fetch the api and get the result
    fetch (APIQuery)
        .then((response) => response.json())
        .then((responseJson) => {
            //TODO: remove these logging statements before final submission
            console.log(responseJson);
            console.log(responseJson["Global Quote"]["05. price"]);
            // process the results
            processStockPriceResults(responseJson);
            addSymbolToHistory(companySymbol);
        })
        .catch((error)=>{
            console.error(error);
        });
}

/* 
    Function name: callNewsApi
    Purpose: calls the news api 
    Input: companySymbol - company symbol
    returns: TBD
*/
function callNewsApi(companySymbol) {
    //TODO: build API query with symbol
    APIQuery = "";
    
    //TODO: fetch the api and get the result

    //TODO: process the results
}

/*
    Function: processStockPriceResults
    Purpose: prints results to screen 
    input: stockData - json of the result from the api call
    return: none
*/
function processStockPriceResults(stockData) {}

/*
    Function: processNewsArticlResults
    Purpose: prints results to screen 
    input: newsData - json of the result from the api call
    return: none
*/
function processNewsArticlResults(newsData) {}

/*
    Function: addSymbolToHistory
    Purpose: Adds company symbol to the history 
    input: symbol - they company's symbol to add
    return: none
*/
function addSymbolToHistory(symbol){
    console.log("adding symbol to history");
}


/*
    Script Executions
*/
callStockPriceApi(company[0]);

//TODO: on refresh load the last searched stock