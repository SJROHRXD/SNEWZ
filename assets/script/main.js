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
    
    var url = "http://api.mediastack.com/v1/news" + 
    "?access_key=fd3243985364e10fe4addcfc54c90c8c" + 
    "&keywords=" + companySymbol + 
    "&category=business&sort=published_desc&limit=5&languages=en";

    fetch(url)
    .then((response) => response.json())
        .then((responseJson) => {
            processNewsArticlResults(responseJson);
        })
        .catch((error)=>{
            console.error(error);
        });
}

/*
    Function: processStockPriceResults
    Purpose: prints results to html page 
    input: stockData - json of the result from the api call
    return: none
*/
function processStockPriceResults(stockData) {
    let stockInfoUlEl = $("#stockPanelData");
    let stockPrice = stockData["Global Quote"]["05. price"];
    let stockPriceEl = $("<li>Price: " + stockPrice + "</li>");
    stockInfoUlEl.append(stockPriceEl);
    //TODO: append other stock parameter to the list
}

/*
    Function: processNewsArticlResults
    Purpose: prints results to screen 
    input: newsData - json of the result from the api call
    return: none
*/
function processNewsArticlResults(newsData) {
    console.log(newsData);
    let newsArticleUlEl = $("#newsArticlesUl");
    newsArticleUlEl.empty();
    
    for (let i = 0; i < newsData.data.length; i++) {
        let image = newsData.data[i].image;
        if(image == null) {
            image = "";
        }
        let title = newsData.data[i].title;
        let url = newsData.data[i].url;
        let description = newsData.data[i].description;
        let date = new Date(newsData.data[i].published_at).toDateString();
        //TODO: make this cleaner
        let newsArticlLiEl = $("<li class=\"box has-background-dark has-text-white\">" +
        "<h4 id=\"articleName\">"+ title + "</h4>" +
        "<p id=\"articleDesc\">"+ date + ": " + description +  "</p></li>");
        newsArticlLiEl.click(function() {
            window.open(url, "_blank").focus();
        });
        newsArticleUlEl.append(newsArticlLiEl);
    }
}

/*
    Function: addSymbolToHistory
    Purpose: Adds company symbol to the history 
    input: symbol - they company's symbol to add
    return: none
*/
function addSymbolToHistory(symbol, price){
    console.log("adding symbol to history");
    //get the history elements
    let historyUlEl = $("#seachHistoryUi");
    let historyLiEl = $(`#${symbol}`);
    historyLiEl.remove();

    historyLiEl = $("<li class=\"button is-info is-size-5 is-clickable m-1\" id=\"" + symbol + "\">" 
    + symbol + ":" + price + "</li>");
    historyLiEl.click(function (event) {
        console.log(event.currentTarget.id);
        callNewsApi(symbol);
        //callStockPriceApi(symbo);
    });
    historyUlEl.prepend(historyLiEl);
    
    //TODO: need to write to storage
    //TODO: need to add on click
}

/*
    Function: getStockPriceColor
    Purpose: determines if the stock price is lower or higher than the open price
    input: stockPrice - the current stock price
            openningPrice - the open price for the stock 
    return: string - the color code corresponding to if the stock is at a loss or gain
*/
function getStockPriceColor(stockPrice, openningPrice) {
    return null;
}
/*
    Script Executions
*/
$("#searchBtn").click(handleSearchButtonClick)
//callStockPriceApi(company[0]);
//callNewsApi(company[0]);
function addSymbolHistoryTest() {
    addSymbolToHistory("amazon", "1000");
    addSymbolToHistory("apple", "200");
    addSymbolToHistory("netflix", "300");
    addSymbolToHistory("google", "2000");
    addSymbolToHistory("apple", "300");

    //should display in this order
    /*
        apple 300
        google 2000
        netflix 300
        amazon 1000
    */
}
addSymbolHistoryTest();




//TODO: on refresh load the last searched stock