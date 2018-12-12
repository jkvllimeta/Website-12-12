/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mycompany.newsnstocks;


import static com.google.api.client.util.Charsets.UTF_8;
import com.google.auth.oauth2.ServiceAccountCredentials;
import com.google.cloud.storage.*;
import java.io.*;

import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 *
 * @author Joseph
 */
public class StockNewsServlet extends HttpServlet {

    
    String bucket_name = "cloudscrape";
    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
     * methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        
        System.out.println("Working path is +" + System.getProperty("user.dir"));
        
        response.setContentType("text/html;charset=UTF-8");
        System.out.println(request.getParameter("filename"));
        
        PrintWriter out = response.getWriter();
        out.print(download(bucket_name, request.getParameter("filename")));
        System.out.println(download(bucket_name, request.getParameter("filename")));
        }
    
    
    
    public static String download(String bucket, String object) throws IOException{

    Storage storage = StorageOptions.newBuilder().setCredentials(ServiceAccountCredentials.
            fromStream(new FileInputStream("C:\\Users\\Joseph\\Documents\\mdx\\CCE3110\\Mini Project 1\\StockNewsSite\\NewsNStocks\\src\\main\\java\\com\\mycompany\\newsnstocks\\gcloud-credentials.json"))).build().getService();

// Upload a blob to the newly created bucket
        BlobId blobId = BlobId.of(bucket, object);
        byte[] content = storage.readAllBytes(blobId);
        String contentString = new String(content, UTF_8);
    return contentString;
}

    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /**
     * Handles the HTTP <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>

}
