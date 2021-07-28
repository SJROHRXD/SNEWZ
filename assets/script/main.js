/*
    Global variables and constants
*/


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
    //read the value of the search field and store it
    let userInput=$("#searchInput").val().trim();
    //call the news api to get the news
    callNewsApi(userInput);
    console.log(userInput);
    //call the stockprice api to get the data 
    callStockPriceApi(userInput);

}

function clearButtonClick() {
    $("#searchHistoryUl").html("");
    console.log("delete");
     //localStorage.clear()

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
            let stockPrice = responseJson["Global Quote"]["05. price"];
            if (stockPrice != undefined) {
                let data=responseJson["Global Quote"];
                processStockPriceResults(data);
                addSymbolToHistory(companySymbol, responseJson["Global Quote"]["05. price"]);
            }
            
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
            processNewsArticleResults(responseJson);
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
$CompInfoBox = $(`<div class="box has-background-info has-text-white"></div>`)
function processStockPriceResults(stockData) {
    console.log("stockData", stockData);


    
    $companyName = $(`<h2 class="title has-text-white" id="companyName">Company Name: ${stockData['01. symbol']}</h2>`)
    $price = $(`<li class='is-small' id="price">Price: ${stockData['05. price']}</li>`)
    $openingPrice = $(`<li class='is-small' id="openingPrice">Opening Price: ${stockData['02. open']}</li>`)
    $weekHigh = $(`<li class='is-small' id="weekHigh">52 Week High: ${stockData['03. high']}</li>`)
    $volume = $(`<li class='is-small' id="volume">Volume: ${stockData['06. volume']}</li>`)

    $CompInfoBox.empty();
    $($CompInfoBox).append($companyName, $price, $openingPrice, $weekHigh, $volume)
    $('#CompanyInfo').prepend($CompInfoBox)

    // $("#companyName").text("Company Name: " + stockData["01. symbol"]);
    // //TODO: handle the price color display
    // $("#price").text("Price: " + stockData ["05. price"]);
    // $("#openingPrice").text("Opening: " + stockData ["02. open"]);
    // $("#weekHigh").text("52 Weeks High: " + stockData ["03. high"]);
    // $("#volume").text("Market Volume: " + stockData ["06. volume"]);
}

/*
    Function: processNewsArticlResults
    Purpose: prints results to screen 
    input: newsData - json of the result from the api call
    return: none
*/
function processNewsArticleResults(newsData) {
    console.log(newsData);
    let newsArticlesDevEl = $(`<div class="column is-full has-background-info" id="newsArticlesDiv">`);
    let newsArticleUlEl = $("<ul id=\"newsArticlesUl\"></ul>");
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
        let newsArticleLiEl = $("<li class=\"box news-article has-background-dark has-text-white\">" +
        "<h4 id=\"articleName\">"+ title + "</h4>" +
        "<p id=\"articleDesc\">"+ date + ": " + description +  "</p></li>");
        newsArticleLiEl.click(function() {
            window.open(url, "_blank").focus();
        });
        newsArticleUlEl.append(newsArticleLiEl);
    }
    newsArticlesDevEl.append(newsArticleUlEl);
    $('#CompanyInfo').append(newsArticlesDevEl);
}

/*
    Function: addSymbolToHistory
    Purpose: Adds company symbol to the history 
    input: symbol - they company's symbol to add
    return: none
*/
function addSymbolToHistory(symbol, price){
    console.log("adding symbol to history");
    symbol = symbol.toUpperCase();
    //get the history elements
    let historyUlEl = $("#searchHistoryUl");
    // let historyLiEl = $(`#${symbol}`);
    //remove the item from the list to avoid having duplicates
    //  historyLiEl.remove();
    
    let historyLiEl = $("<li class=\"button is-info is-size-5 is-clickable m-1\" id=\"" + symbol + "\">" 
    + symbol + ":" + price + "</li>");
    console.log(historyLiEl, historyUlEl);
    //add on click
    historyLiEl.click(function (event) {
        console.log(event.currentTarget.id);
        callNewsApi(symbol);
        callStockPriceApi(symbol);
        
    });
    historyUlEl.prepend(historyLiEl);
    
    //TODO: need to write to storage
}

/*
    Function: getStockPriceColor
    Purpose: determines if the stock price is lower or higher than the open price
    input: stockPrice - the current stock price
            openingPrice - the open price for the stock 
    return: string - the color code corresponding to if the stock is at a loss or gain
*/
function getStockPriceColor(stockPrice, openingPrice) {
    return null;
}

/*
    Script Executions
*/
$("#searchBtn").click(handleSearchButtonClick);

$("#clearAllBtn").click(clearButtonClick)
