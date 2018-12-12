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

var stockIndex = 1;
var wsjIndex = 0;
var waPoIndex = 0;

window.onload = loadSelection();

filterButton.addEventListener('click',filterSelection);
headlineButton.addEventListener('click', getWSJHeadlines);
stockButton.addEventListener('click', getStockInfo);
headlineButton2.addEventListener('click', getWaPoHeadlines);


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


function addSelection(stockNames){
    var selectHTTP = "<option>Display All</option>";
    
    for(i = 1; i < stockNames.length; i++){
        selectHTTP += "<option>" + stockNames[i].Company.Name + "</option>";
    }
    
    dropDown.insertAdjacentHTML('beforeend', selectHTTP);    
}


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
        
        stockButton.disabled = false;
        
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
