/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var headlineButton = document.getElementById("headlineButton");
var headlineList = document.getElementById("headlineList");

var headlineButton2 = document.getElementById("headlineButton2");
var headlineList2 = document.getElementById("headlineList2");

var stockButton = document.getElementById("showStocks");
var stockList = document.getElementById("stockList");

var filterButton = document.getElementById("filterStocks");
var dropDown = document.getElementById("stockSelect");

// The stock information index starts from 1 as the Yahoo Finance page from which the data is taken
// has an invisible table row, resulting in a blank object at index 0.
var stockIndex = 1;
var wsjIndex = 0;
var waPoIndex = 0;

// The options of the drop down box are loaded from the stock information JSON file, which is stored
// on Google Cloud, upon initializing the website
window.onload = loadSelection();

// The buttons are paired with their corresponding methods which would trigger upon click
filterButton.addEventListener('click',filterSelection);
headlineButton.addEventListener('click', getWSJHeadlines);
stockButton.addEventListener('click', getStockInfo);
headlineButton2.addEventListener('click', getWaPoHeadlines);


// The getStockInfo function fetches the JSON file containing stock information from Google Cloud by sending 
// an AJAX GET request to the Servlet, bearing the corresponding file name as the parameter. Upon receiving the
// response from the Servlet, the String data is converted into a JSON object using JSON.parse and passed
// to the addStockInfo method which is in charge of formatting and displaying the information on the web page.
// The getWSJHeadlines and getWaPoHeadlines functions operate similarly with the file names
// and display functions changed accordingly.
function getStockInfo(){
    var xhttp = new XMLHttpRequest();
    var filename = "?filename=stocksjson";
    
    xhttp.open('GET',"http://localhost:8084/NewsNStocks/StockNewsServlet"+filename,true);
   
    xhttp.onload = function(){
        if (xhttp.status >= 200 && xhttp.status < 400){
            var stocks = JSON.parse(xhttp.responseText);
            addStockInfo(stocks);
        } else {
            console.log("Connection error");
        }
    }
    xhttp.send();   
}

 
function getWSJHeadlines(){

    var xhttp = new XMLHttpRequest();
    var filename = "?filename=WSJjson";
    xhttp.open('GET', "http://localhost:8084/NewsNStocks/StockNewsServlet"+filename, true);
    
    xhttp.onload = function(){
        if (xhttp.status >= 200 && xhttp.status < 400){
            var headlines = JSON.parse(xhttp.responseText);
            addWSJHeadline(headlines);
        } else {
            console.log("Connection error");
        }
    }
    xhttp.send();
}


function getWaPoHeadlines(){
    var xhttp = new XMLHttpRequest();
    var filename = "?filename=WaPojson";
    
    xhttp.open('GET', "http://localhost:8084/NewsNStocks/StockNewsServlet"+filename, true);
    xhttp.onload = function(){
        if (xhttp.status >= 200 && xhttp.status < 400){
            var headlines = JSON.parse(xhttp.responseText);
            addWaPoHeadline(headlines);
        } else {
            console.log("Connection error");
        }
    }
    xhttp.send();
}


// The addStockInfo function takes the JSON String passed onto it from the Servlet, formats the data into a table
// with the appropriate headers, then displays it inside the assigned container on the client side. The function is designed
// to display the stock information of companies incrementally as the View Stocks button is pressed by the user.
// The View Stocks button is set to be disabled once the last company on the JSON list is displayed. 
function addStockInfo(stockJSON){  
    var stocksHTML = "";
    
    stocksHTML += "<p><table><tr>" 
            + "<th>Symbol</th>" + "<th>Name</th>" + "<th>Last Price</th>" 
            + "<th>Market Time</th>" + "<th>Change Percent</th>" 
            + "<th>Change Volume</th>" + "<th>Average Volume</th>" 
            + "<th>Market Cap</th>" + "<th>Intraday LowHigh</th></tr>" 
            + "<tr>" + "<td>"+stockJSON[stockIndex].Company.Symbol+"</td>" + "<td>"+stockJSON[stockIndex].Company.Name+"</td>"
            + "<td>"+stockJSON[stockIndex].Company.LastPrice+"</td>" + "<td>"+stockJSON[stockIndex].Company.MarketTime+"</td>"
            + "<td>"+stockJSON[stockIndex].Company.ChangePercent+"</td>" + "<td>"+stockJSON[stockIndex].Company.ChangeVolume+"</td>"
            + "<td>"+stockJSON[stockIndex].Company.AverageVolume+"</td>" + "<td>"+stockJSON[stockIndex].Company.MarketCap+"</td>"
            + "<td>"+stockJSON[stockIndex].Company.IntradayLowHigh+"</td>" + "</tr></table></p>";
            
    stockList.insertAdjacentHTML('beforeend',stocksHTML);
    stockIndex++;

    if (stockIndex == stockJSON.length){
        stockButton.disabled = true;
    }
}


// The functions for adding headlines generally follow the principle of the addStockInfo function. The major difference
// here is the format, as the headlines are not on a table. The Link values from the JSON are used as HREF attributes
// to create functional links for the headline Titles.
function addWSJHeadline(wsjJSON){
    
    var headlineHTML = "";
           
    headlineHTML += "<p><a href="+ wsjJSON[wsjIndex].Headline.Link + " target=\"_blank\" class=\"hltext\">" + "•" + wsjJSON[wsjIndex].Headline.Title + "</a></p>";
    headlineList.insertAdjacentHTML('beforeend', headlineHTML);
    wsjIndex++;

    if (wsjIndex == wsjJSON.length){
        headlineButton.disabled = true;
    }
}


function addWaPoHeadline(waPoJSON){
    var headlineHTML2 = " ";
      
    headlineHTML2 += "<p><a href="+ waPoJSON[waPoIndex].Headline.Link + " target=\"_blank\" class=\"hltext\">" + "• " + waPoJSON[waPoIndex].Headline.Title + "</a></p>";
    headlineList2.insertAdjacentHTML('beforeend', headlineHTML2);
    waPoIndex++;
    
    if (waPoIndex == waPoJSON.length){
        headlineButton2.disabled = true;
    }
}


// The loadSelection function, along with the addSelection function, takes the company names from the stock info JSON
// and populates the drop down box that is used for filtering. The loadSelection function is invoked upon loading the page
// as to provide the users the convenience of searching for the companies they are interested in instead of having to
// go through the companies on the list one by one.
function loadSelection(){    
    var xhttp = new XMLHttpRequest();
    var filename = "?filename=stocksjson";
    
    xhttp.open('GET', "http://localhost:8084/NewsNStocks/StockNewsServlet"+filename, true);
    
    xhttp.onload = function(){
        if (xhttp.status >= 200 && xhttp.status < 400){
            var stockNames = JSON.parse(xhttp.responseText);
            addSelection(stockNames);
        } else {
            console.log("Connection error");
        }
    }
    xhttp.send();
}


function addSelection(stockNames){
    var selectHTTP = "<option>Display All</option>";
    
    for(i = 1; i < stockNames.length; i++){
        selectHTTP += "<option>" + stockNames[i].Company.Name + "</option>";
    }
    
    dropDown.insertAdjacentHTML('beforeend', selectHTTP);    
}


// The filterSelection and displayFilter functions conduct the aforementioned filtering via company name selection.
// The AJAX GET request as used in the previous functions is performed by the filterSelection function, which then
// passes the data received from the Servlet to the displayFilter function after converting it into a JSON object.
// The index of the company selected from the drop down box is also passed to the displayFilter function
// in order to retrieve the matching data.
function filterSelection(){
    var xhttp = new XMLHttpRequest();
    var filename = "?filename=stocksjson";
    var selectIndex = dropDown.selectedIndex;

    xhttp.open('GET',"http://localhost:8084/NewsNStocks/StockNewsServlet"+filename,true);
    
    xhttp.onload = function(){
        if (xhttp.status >= 200 && xhttp.status < 400){
            var stocks = JSON.parse(xhttp.responseText);
            displayFilter(stocks, selectIndex);
        } else {
            console.log("Connection error");
        }
    }
   
   xhttp.send();
}


// The displayFilter uses the index of the chosen company from the drop down box in order to retrieve and display
// the information relevant to the company from the JSON file to the user. As the company object at index 0 is empty, 
// index 0 is instead used to execute a Display All command. If the displayFilter function receives an index value of
// zero, it displays all of the companies at once with their corresponding information and subsequently disables
// the View Stocks button, as there are no more remaining stock information to add. 
function displayFilter(stockJSON, index){
    var filteredStocksHTML = "";
    
    if (index == 0){
        
        for (i = 1; i < stockJSON.length; i++){
            
            filteredStocksHTML += "<p><table><tr>" 
                + "<th>Symbol</th>" + "<th>Name</th>" + "<th>Last Price</th>" 
                + "<th>Market Time</th>" + "<th>Change Percent</th>" 
                + "<th>Change Volume</th>" + "<th>Average Volume</th>" 
                + "<th>Market Cap</th>" + "<th>Intraday LowHigh</th></tr>" 
                + "<tr>" + "<td>"+stockJSON[i].Company.Symbol+"</td>" + "<td>"+stockJSON[i].Company.Name+"</td>"
                + "<td>"+stockJSON[i].Company.LastPrice+"</td>" + "<td>"+stockJSON[i].Company.MarketTime+"</td>"
                + "<td>"+stockJSON[i].Company.ChangePercent+"</td>" + "<td>"+stockJSON[i].Company.ChangeVolume+"</td>"
                + "<td>"+stockJSON[i].Company.AverageVolume+"</td>" + "<td>"+stockJSON[i].Company.MarketCap+"</td>"
                + "<td>"+stockJSON[i].Company.IntradayLowHigh+"</td>" + "</tr></table></p>";
        }
        
        stockList.insertAdjacentHTML('beforeend', filteredStocksHTML);
        stockButton.disabled = true;
        
    }   else {
        
        if (stockButton.disabled = true){
        stockButton.disabled = false;
        }
        
        filteredStocksHTML = "<p><table><tr>" 
            + "<th>Symbol</th>" + "<th>Name</th>" + "<th>Last Price</th>" 
            + "<th>Market Time</th>" + "<th>Change Percent</th>" 
            + "<th>Change Volume</th>" + "<th>Average Volume</th>" 
            + "<th>Market Cap</th>" + "<th>Intraday LowHigh</th></tr>" 
            + "<tr>" + "<td>"+stockJSON[index].Company.Symbol+"</td>" + "<td>"+stockJSON[index].Company.Name+"</td>"
            + "<td>"+stockJSON[index].Company.LastPrice+"</td>" + "<td>"+stockJSON[index].Company.MarketTime+"</td>"
            + "<td>"+stockJSON[index].Company.ChangePercent+"</td>" + "<td>"+stockJSON[index].Company.ChangeVolume+"</td>"
            + "<td>"+stockJSON[index].Company.AverageVolume+"</td>" + "<td>"+stockJSON[index].Company.MarketCap+"</td>"
            + "<td>"+stockJSON[index].Company.IntradayLowHigh+"</td>" + "</tr></table></p>";
    
        stockList.innerHTML = filteredStocksHTML;
    }   
    
}
