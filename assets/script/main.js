/*
    Global variables and constants
*/
const historyArray = JSON.parse(localStorage.getItem("historyArray")) || [];;
const historyUlEl = $("#searchHistoryUl");
const newsArticlesDevEl = $(`<div class="column is-full has-background-info" id="newsArticlesDiv">`);
const newsArticleUlEl = $("<ul id=\"newsArticlesUl\"></ul>");
$CompInfoBox = $(`<div class="box has-background-info has-text-white"></div>`);

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
    //call the news api to get the news
    callNewsApi(userInput)
    $('#searchInput').val(' ')
}

/*
    Function name: clearButtonClick
    Purpose: handles the clear button click event
    input: none
    return: none
*/
function clearButtonClick() {
    $("#searchHistoryUl").html("");
    console.log("delete");
    localStorage.clear()

}

/* 
    Function name: callStockPriceApi
    Purpose: calls the stock price api 
    Input: companySymbol - company symbol
    returns: TBD
*/
function callStockPriceApi(companySymbol) {
    // build API query with symbol
    APIQuery = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${companySymbol}&apikey=8XODZRFY9GB4A5XY`;
    // fetch the api and get the result
    fetch (APIQuery)
        .then((response) => response.json())
        .then((responseJson) => {
            // process the results
            let stockPrice = responseJson["Global Quote"]["05. price"];
            if (stockPrice != undefined) {
                let data=responseJson["Global Quote"];
                processStockPriceResults(data);
                addSymbolToHistory(companySymbol, priceRound(stockPrice));
            } else {
                $("#errorDescription").text("Invalid Company Symbol");
                $("#errorModal").addClass("is-active");
            }
            
        })
        .catch((error)=>{
            console.error(error);
            console.log("adding class is-active!");
            $("#errorDescription").text("Stock API connection error");
            $("#errorModal").addClass("is-active");
        });
}

/* 
    Function name: callNewsApi
    Purpose: calls the news api 
    Input: companySymbol - company symbol
    returns: TBD
*/
function callNewsApi(companySymbol) {
    var url = "https://api.mediastack.com/v1/news" + 
    "?access_key=79405bcf695dfdeab555e5180eb79a1e" + 
    "&keywords=" + companySymbol + 
    "&category=business&sort=published_desc&limit=5&languages=en";

    fetch(url)
    .then((response) => response.json())
        .then((responseJson) => {
            processNewsArticleResults(responseJson);
        })
        .catch((error)=>{
            $("#errorDescription").text("News API connection error");
            $("#errorModal").addClass("is-active");
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
    $companyName = $(`<h2 class="title has-text-white" id="companyName">Company Name: ${stockData['01. symbol']}</h2>`);
    $price = $(`<li class='is-small' id="price">Price: ${priceRound(stockData['05. price'])}</li>`);
    $openingPrice = $(`<li class='is-small' id="openingPrice">Opening Price: ${priceRound(stockData['02. open'])}</li>`);
    $weekHigh = $(`<li class='is-small' id="weekHigh">52 Week High: ${priceRound(stockData['03. high'])}</li>`);
    $volume = $(`<li class='is-small' id="volume">Volume: ${stockData['06. volume']}</li>`);

    $CompInfoBox.empty();
    $($CompInfoBox).append($companyName, $price, $openingPrice, $weekHigh, $volume);
    $('#CompanyInfo').prepend($CompInfoBox);
}

/*
    Function: processNewsArticleResults
    Purpose: prints results to screen 
    input: newsData - json of the result from the api call
    return: none
*/
function processNewsArticleResults(newsData) {
    //remove previous entries
    newsArticlesDevEl.empty()
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
        //set up the html element
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
    //remove the item from the list to avoid having duplicates
    let historyLiEl = $("<li class=\"button is-info is-size-5 is-clickable m-1\" id=\"" + symbol + "\">" 
    + symbol + ":" + price + "</li>");
    console.log(historyLiEl, historyUlEl);
    //add on click
    historyLiEl.click(function (event) {
        console.log(event.currentTarget.id);
        callNewsApi(symbol);
        callStockPriceApi(symbol);
        
    });
    $(`#${symbol}`).remove();
    historyUlEl.prepend(historyLiEl);
    
    let symbolIndex = historyArray.indexOf(symbol);
    if (symbolIndex != -1) {
        console.log(`symbol indeex ${symbolIndex}`);
        historyArray.splice(symbolIndex, 2);
        console.log(`history array after splice ${historyArray}`);
    }
    historyArray.push(symbol);
    historyArray.push(price);
    localStorage.setItem("historyArray", JSON.stringify(historyArray));
}

/* 
    Function: loadHistoryArray()
    Purpose: loads the history array from local storage and display the prices when the stock was last checked
    input: none
    return: none
*/
function loadHistoryArray() {
    let historyArray = JSON.parse(localStorage.getItem("historyArray")) || [];
    console.table(historyArray);
    let symbol = "";
    let price = "";
    
    //populate the buttons
    for (let i=0; i<historyArray.length; i++) {
        symbol = historyArray[i];
        price =  historyArray[++i];
        addSymbolToHistory(symbol, price);
    }
    //show the last visited stock
    if (symbol !== "") {    
        callNewsApi(symbol);
        callStockPriceApi(symbol);
    }
}

/* 
    Function: priceRound 
    purpose: changes the price to two decimal places
    input: string representation of the stock price
    return: string representation of the stock price rounded to two decimal places
*/
function priceRound(priceToRound) {
    let priceRoundFloat = parseFloat(priceToRound);
    priceRoundFloat.toFixed(2);
    return priceRoundFloat.toString();
}

/*
    Script Executions
*/
//add onclick handlers
$("#searchBtn").click(handleSearchButtonClick);
$("#clearAllBtn").click(clearButtonClick);
$(".modalDismissButton").click(function(event){
    $("#errorModal").removeClass("is-active");
});
//load the history data
loadHistoryArray();
