### Thread-SSE data and client actions
------------

| id | Action | bulk | tag |
|-------|-------|---------|--------|
| 8000 | Prints bulk to browser console | Non-empty string | "" |
| 8010 | Prints bulk to information box | Non-empty string | "" |
| 8020 | Prints bulk to modal box | Non-empty string |  |
| 8030 | Prints bulk to pop-up window | Non-empty string |  |
| 8060 | Saves bulk to a file | Non-empty string |  |
| 8070 | Saves bulk and tag to sessionStorage | Non-empty string |  |
| 8080 | Remove bulk and tag from sessionStorage | "" | "" |
| 8100 | Scrolls the document to top | "" | "" |
| 8110 | Scrolls the document to center | "" | "" |
| 8120 | Scrolls the document to bottom | "" | "" |
| 8130 | Scrolls the document to the specified coordinates | "" | "" |
| 8140 | Scrolls the document by the specified number of pixels | "" | "" |
| 8200 | Adds an existed class to the element(s) | One of 'id=value', 'classname=value', 'name=value', 'tagname=value', 'tagnamens=value' | The name of the class |
| 8210 | Removes an existed class from the element(s) | One of 'id=value', 'classname=value', 'name=value', 'tagname=value', 'tagnamens=value' | The name of the class |
| 8220 | Toggles a class on the element(s) | One of 'id=value', 'classname=value', 'name=value', 'tagname=value', 'tagnamens=value' | The name of the class |
| 8230 | Adds and updates style to element(s) | One of 'id=value', 'classname=value', 'name=value', 'tagname=value', 'tagnamens=value' | CSS content |
| 8240 | Cleans style to the element(s) | One of 'id=value', 'classname=value', 'name=value', 'tagname=value', 'tagnamens=value' | "" |
| 8280 | Triggers a specific event on the given element(s) | One of 'id=value', 'classname=value', 'name=value', 'tagname=value', 'tagnamens=value' | The name of the event |
| 8300 | Loads external JavaScript file(s) | A URL or multiple URLs separated by ; to JavaScript file(s) | "" or a JSON object |
| 8310 | Removes external JavaScript file(s) | A URL or multiple URLs separated by ; to JavaScript file(s) | "" |
| 8320 | Loads external CSS file(s) | A URL or multiple URLs separated by ; to CSS file(s) | "" or a JSON object |
| 8330 | Removes external CSS file(s) | A URL or multiple URLs separated by ; to CSS file(s) | "" |
| 8340 | Loads external JavaScript and CSS files | A URL or multiple URLs separated by ; to JavaScript file(s) | A URL or multiple URLs separated by ; to CSS file(s) |
| 8350 | Removes external JavaScript and CSS files | A URL or multiple URLs separated by ; to JavaScript file(s) | A URL or multiple URLs separated by ; to CSS file(s) |
| 8400 | Refreshes current page | "" | "" |
| 8410 | Redirects in same browser tab | A path or URL to the redirection | "" |
| 8420 | Redirects to new browser tab | A path or URL to the redirection | "" |
| 8430 | Posts HTTP request in same browser tab | A path or URL to the request | Post data in URL query format |
| 8440 | Posts HTTP request to new browser tab | A path or URL to the request | Post data in URL query format |
| 8950 | Closes a browser tab opened by redirection | "" or a positive integer that represents the order of the tab opened | "" |
| 8990 | Closes thread SSE server-side and client-side | "" | "" |

Developers can create client actions for the data id with one of "8300", "8320" and "8340", the custom client actions would be run after the default client actions completed.


### Examples
------------

| id | bulk | tag |
|-------|-------|---------|
| 8020, 8030 | "Susie works in a shoeshine shop. Where she shines she sits, and where she sits she shines" | "width=400, height=200" |
| 8130  | 925 | 750 |
| 8140 | 300 | 200 |
| 8200, 8210 | "id=result" | "center " |
| 8220 | "classname=logo" | "trans-size" |
| 8230 | "tagname=img" | "opacity: 0.5; filter: grayscale(100%);" |
| 8240 | tagname=img" | "" |
| 8280 | "id=mybtn" | "click" |
| 8300 | "https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js; https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" | "" |
| 8310 | "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" | "" |
| 8320, 8330 | "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" | "" |
| 8340 | "https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js; https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" | "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" |
| 8350 | "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" | "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" |
| 8410 | "https://www.w3plan.net/" | "" |
| 8420 | "https://www.w3plan.net/products/" | "" |
| 8430, 8440 | "https://www.w3schools.com/action_page.php" | "fname=jack&lname=ban" |


[**⛪ Go to Thread-SSE documentation**](./document.md "Thread-SSE documentation")
