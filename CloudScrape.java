/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mycompany.cloudscrape;

import static com.google.api.client.util.Charsets.UTF_8;
import com.google.auth.oauth2.ServiceAccountCredentials;
import com.google.cloud.storage.*;
import java.io.*;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
/**
 *
 * @author Joseph
 */
public class CloudScrape {
    
    // Initializing the variables to be used for holding the JSON data
    JSONObject companyDetails = new JSONObject();
    JSONObject company = new JSONObject();
    JSONArray companyList = new JSONArray();

    JSONObject headlineDetails = new JSONObject();
    JSONObject headlineObject = new JSONObject();
    JSONArray headlineList = new JSONArray();
                
    JSONObject headlineDetails2 = new JSONObject();
    JSONObject headlineObject2 = new JSONObject();
    JSONArray headlineList2 = new JSONArray();
        

public static void main(String args[]) throws Exception {
        
    CloudScrape cs = new CloudScrape();

 
    String stockSite = "https://finance.yahoo.com/trending-tickers";
    String newsSite = "https://www.wsj.com/europe";
    String newsSite2 = "https://www.washingtonpost.com/";
    
    // The scraping methods for all three websites are executed at runtime
    // to produce the JSON files needed for the website all at once.
    cs.headlineScrape1(newsSite);
    cs.headlineScrape2(newsSite2);
    cs.stockScrape(stockSite);
    
}

// The upload method from the Lab Activity is defined and will be used to upload the JSON information to Google Cloud.
public static void upload(String bucket, String object, String text) throws IOException {
Storage storage = StorageOptions.newBuilder().
setCredentials(ServiceAccountCredentials.fromStream(new FileInputStream("gcloud-credentials.json"))).build().getService();

// Upload a blob to the newly created bucket
    BlobId blobId = BlobId.of(bucket , object);
    BlobInfo blobInfo = BlobInfo.newBuilder(blobId).setContentType("text/plain").build();
    Blob blob = storage.create(blobInfo , text.getBytes(UTF_8));

}

/* 
   The following method scrapes the headlines of the day from the Wall Street Journal
   as well as their corresponding links. The method takes a String parameter which corresponds to the website
   the user wishes to scrape information from. The data gathered are stored inside JSON objects 
   under the "Title" and "Link" value pairs which will later be used for producing links on the website. 
   The collection of JSON objects are then compiled into a JSON array and stored on Google Cloud.
*/
public void headlineScrape1 (String newsSite){
    
    try{    
        Document newsConnect = Jsoup.connect(newsSite).get();
            
        Elements newsElements = newsConnect.select("h3.wsj-headline").select("a");
        
        
        //The following loop cycles through the individual Elements scraped from the website, 
        //namely the headline texts and the links, which are then converted into JSON objects and placed into a JSON array.
        for (Element headline : newsElements){
                
            headlineDetails = new JSONObject();
            headlineDetails.put("Title", headline.text());
            headlineDetails.put("Link", headline.attr("href"));
                
            headlineObject = new JSONObject();
            headlineObject.put("Headline", headlineDetails);
                
            headlineList.add(headlineObject);

        }
        
    // The JSON Array produced is saved both locally and on Google Cloud for redundancy. The file saved
    // on Google Cloud will later be accessed for use on the website.
    FileWriter file = new FileWriter("headlinesWSJ.json");
    file.write(headlineList.toJSONString());
    file.flush();
        
    upload("cloudscrape", "WSJjson", headlineList.toJSONString());
            
    } catch (Exception e){
            e.printStackTrace();
    }
}

// The following method performs a similar function to the first web scraper, but with the parameters adjusted
// for the Washington Post's html formatting.
public void headlineScrape2 (String newsSite2) {
        
    try{

        Document newsConnect = Jsoup.connect(newsSite2).get();
            
        Elements newsElements = newsConnect.select("div.headline").select("a");    
            
            for (Element headline : newsElements){
                
                headlineDetails2 = new JSONObject();
                headlineDetails2.put("Title", headline.text());
                headlineDetails2.put("Link", headline.attr("href"));
                
                headlineObject2 = new JSONObject();
                headlineObject2.put("Headline", headlineDetails2);
                
                headlineList2.add(headlineObject2);

            }
        
        FileWriter file = new FileWriter("headlinesWaPo.json");
        file.write(headlineList2.toJSONString());
        file.flush();
        
        upload("cloudscrape", "WaPojson", headlineList2.toJSONString());
        
    } catch (Exception e){
        e.printStackTrace();
    }    
}

/*
    The Stock Info scraper operates in much of the same way as the headline web scrapers, with an added level of
    complexity due to the amount of information gathered per object. The parameters are adjusted in this method
    in order to obtain information from a table. The value pairs under each Company JSON object are given appropriate
    titles corresponding to the headers presented on the website.
*/
public void stockScrape(String stockSite) {
    
    try{
        Document stockTable = Jsoup.connect(stockSite).get();

        Elements stockElements = stockTable.getElementsByTag("table").select("tr");
   
        for (Element stockEle : stockElements){
            String symbol = stockEle.select("td.data-col0").text();
            String name = stockEle.select("td.data-col1").text();
            String lastPrice = stockEle.select("td.data-col2").text();
            String marketTime = stockEle.select("td.data-col3").text();
            String change = stockEle.select("td.data-col4").text();
            String changeVol = stockEle.select("td.data-col5").text();
            String avgVol = stockEle.select("td.data-col6").text();
            String marketCap = stockEle.select("td.data-col7").text();
            String intraday = stockEle.select("td.data-col8").text();
            
            companyDetails = new JSONObject();
            
            companyDetails.put("Symbol", symbol);
            companyDetails.put("Name", name);
            companyDetails.put("LastPrice", lastPrice);
            companyDetails.put("MarketTime", marketTime);
            companyDetails.put("ChangePercent", change);
            companyDetails.put("ChangeVolume", changeVol);
            companyDetails.put("AverageVolume", avgVol);
            companyDetails.put("MarketCap", marketCap);
            companyDetails.put("IntradayLowHigh", intraday);

            company = new JSONObject();
            company.put("Company", companyDetails);
            
            companyList.add(company);
             
        }
        
        FileWriter file = new FileWriter("stockInfo.json");
        file.write(companyList.toJSONString());
        file.flush();
        
        upload("cloudscrape", "stocksjson", companyList.toJSONString());

    } catch (Exception e){
            e.printStackTrace();

    }   
}

}
