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
    let userInput=$("#searchInput").val();
    console.log(userInput);
    //TODO: read the value of the search field and store it
    //TODO: call the stockprice api to get the data 
    //TODO: call the news api to get the news
    //TODO: catch potential errors and stop execution
    //process the data and display it
callStockPriceApi(userInput);
callNewsApi(userInput)
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
            let data=responseJson["Global Quote"];
            processStockPriceResults(data);
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
    "&category=business&sort=published_desc&limit=5";

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
    console.log("stockData", stockData);
    // let stockInfoUlEl = $("#stockPanelData");
    // let stockPrice = stockData["05. price"];
    // let stockPriceEl = $("<li>Price: " + stockPrice + "</li>");


    // stockInfoUlEl.append(stockPriceEl);
    $("#companyName").text("Company Name: " + stockData["01. symbol"]);
    $("#price").text("Price: " + stockData ["05. price"]);
    $("#openingPrice").text("Opening: " + stockData ["02. open"]);
    $("#weekHigh").text("52 Weeks High: " + stockData ["03. high"]);
    $("#volume").text("Market Volume: " + stockData ["06. volume"]);


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
        let newsArticlLiEl = $("<li> <a href=" + url + ">" + title + "</a><p>"+ date + ": " + description +  "</p></li>");
        newsArticleUlEl.append(newsArticlLiEl);
    }
}

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
$("#searchBtn").click(handleSearchButtonClick)



//TODO: on refresh load the last searched stock