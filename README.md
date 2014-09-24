QlikSenseAngularDemo
====================

A lightweight browser demo of the new Qlik Engine API.

Description
===========

This demo web application demonstrates some of the capabilities of the new Qlik Engine API that comes with Qlik Sense (Desktop).
The demo itself runs completely inside the web browser (thanks to AngularJS) and does not need a separate web server.
In the package, though, a simple web server is contained in order to facilitate the use.

What you can see in this demo is the communication with the Qlik Engine API via a websocket connection. It shows some basic functionalities, as for instance querying the Qlik Sense version number, retrieving a list of accessible Qlik Sense Applications and displaying the metadata and the table structure of a chosen app.
Finally it demonstrates how to make use of dynamically defined hypercubes. 
This allows selection of a dimension and a measure and after that visualizes the result dataset with the Google Charts library (instead of the Qlik Sense vizs).


Installation
============

Node.js is required for this demo to set up and work.

Use npm to install the demo application.

Run **npm install -g qliksenseangulardemo** on commandline in order to install the demo appliction in the global scope.

Usage
=====

After installation you can start the demo application by executing **qliksenseangulardemo** from a shell:

 C:\>qliksenseangulardemo

The integrated web server will listen to port **8085**. The port can be changed in the run.js file.

To start the demo, open your favorite web browser and enter **http://localhost:8085/**. You should instantly see the entry page.

Ensure your Qlik Sense Desktop is up and running before interacting with the demo app.




