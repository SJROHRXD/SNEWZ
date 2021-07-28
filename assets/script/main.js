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

    $CompInfoBox = $(`<div class="box has-background-info has-text-white"></div>`)
    $companyName = $(`<h2 class="title has-text-white" id="companyName">Company Name: ${stockData['01. symbol']}</h2>`)
    $price = $(`<li class='is-small' id="price">Price: ${stockData['05. price']}</li>`)
    $openingPrice = $(`<li class='is-small' id="openingPrice">Opening Price: ${stockData['02. open']}</li>`)
    $weekHigh = $(`<li class='is-small' id="weekHigh">52 Week High: ${stockData['03. high']}</li>`)
    $volume = $(`<li class='is-small' id="volume">Volume: ${stockData['06. volume']}</li>`)


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
//callStockPriceApi(company[0]);
callNewsApi(company[0]);


//TODO: on refresh load the last searched stock