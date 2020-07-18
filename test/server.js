/**
 * Thread-SSE Unit testing server-side 
 * 
 * (c) Copyright 2020-present Richard Li <richard.li@w3plan.net>
 * License: MIT
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

// Loads Thread-SSE module
const { getConnectionPath,
        setTsseConnection,
        getTsseServicePath,
        getsharedDataPath,
        tsseServer,
        libStyleGraph,
        responseClient,
        updateTsseData
      } = require('../index');

// Sets up testing server
var server = http.createServer (

  function (req, res) {
    var requestUrl = req.url;
    var tsseServicePath = getTsseServicePath(req);
    
    if (requestUrl === "/js/tsse.js") 
    {
      // the default Thread-SSE client library
      libStyleGraph(req, res, "/public/js/tsse.js");
    
    } else if (requestUrl === "/test/index.html") 
    { 
      // Thread-SSE Unit testing client
      var filePath = path.join(__dirname, "./index.html");
      
      try {
        var content = fs.readFileSync(filePath, 'utf8');

        responseClient(req, res, content);
      } catch (er) {
        console.log("Server can't read the client file.")
      }
      
    } else if (requestUrl === getConnectionPath()) 
    { 
      // Handles Thread-SSE connection request
      setTsseConnection(req, res);
      
    } else if (requestUrl === tsseServicePath && tsseServicePath !== '')
    { 
      // Thread-SSE server for the specific client
      tsseServer(tsseServicePath, res);
      
      // Suppose Thread-SSE users are visitors
      var tsseUser = '';
      
      setTimeout( function(){
        updateTsseData(tsseServicePath, tsseUser, "1000", "She sells sea shells by the sea shore.\nThe shells she sells are surely seashells.\nSo if she sells shells on the seashore,\nI'm sure she sells seashore shells");
       }, 1000 );
      
      setTimeout( function(){
        updateTsseData(tsseServicePath, tsseUser, "1002", "A non-empty string");
       }, 2000 );
      
      setTimeout( function(){
        updateTsseData(tsseServicePath, tsseUser, "1004", "");
       }, 3000 );

      setTimeout( function(){
        updateTsseData(tsseServicePath, tsseUser, "1006", "100.25");
       }, 4000 );

      setTimeout( function(){
        updateTsseData(tsseServicePath, tsseUser, "1008", "15");
       }, 5000 );

      setTimeout( function(){
        updateTsseData(tsseServicePath, tsseUser, "1010", "5.27");
       }, 6000 );

      setTimeout( function(){
        updateTsseData(tsseServicePath, tsseUser, "1012", "3/5");
       }, 7000 );

      setTimeout( function(){
        updateTsseData(tsseServicePath, tsseUser, "1014", "0x53656C66204465736372697074696F6E204A534F4E20536368656D61");
       }, 8000 );

      setTimeout( function(){
        updateTsseData(tsseServicePath, tsseUser, "1016", "0123 0145 0154 0146 040");
       }, 9000 );

      setTimeout( function(){
        updateTsseData(tsseServicePath, tsseUser, "1018", "010011110110111000101101011011100110111101110100011010010110001101100101");
       }, 10000 );
            
      setTimeout( function(){
        updateTsseData(tsseServicePath, tsseUser, "1020", "https://avatars2.githubusercontent.com/u/18145628?s=400&u=d9b9f7b81ba63e045478001da75f576927bfaf23&v=4");
       }, 11000 );

      setTimeout( function(){
        updateTsseData(tsseServicePath, tsseUser, "1022", "/u/18145628?s=400&u=d9b9f7b81ba63e045478001da75f576927bfaf23&v=4");
       }, 12000 );

      setTimeout( function(){
        updateTsseData(tsseServicePath, tsseUser, "1024", "https");
       }, 13000 );

      setTimeout( function(){
        updateTsseData(tsseServicePath, tsseUser, "1026", "richard:psword");
       }, 14000 );

      setTimeout( function(){
        updateTsseData(tsseServicePath, tsseUser, "1028", "en.wikipedia.org");
       }, 15000 );

      setTimeout( function(){
        updateTsseData(tsseServicePath, tsseUser, "1030", "91.198.174.192");
       }, 16000 );
      
      setTimeout( function(){
        updateTsseData(tsseServicePath, tsseUser, "1032", "2001:db8:85a3:8d3:1319:8a2e:370:7348");
       }, 17000 );

      setTimeout( function(){
        updateTsseData(tsseServicePath, tsseUser, "1034", "300");
       }, 18000 );

      setTimeout( function(){
        updateTsseData(tsseServicePath, tsseUser, "1036", "../js/tsse.js");
       }, 19000 );

      setTimeout( function(){
        updateTsseData(tsseServicePath, tsseUser, "1038", "?s=400&u=d9b9f7b81ba63e045478001da75f576927bfaf23&v=4");
       }, 20000 );
      
      setTimeout( function(){
        updateTsseData(tsseServicePath, tsseUser, "1040", "#pt001");
       }, 21000 );
       
      setTimeout( function(){
        updateTsseData(tsseServicePath, tsseUser, "1042", "jack.ban@example.com");
       }, 22000 );

      setTimeout( function(){
        updateTsseData(tsseServicePath, tsseUser, "1044", "jack.ban");
       }, 23000 );

      setTimeout( function(){
        updateTsseData(tsseServicePath, tsseUser, "1050", "en");
       }, 24000 );

      setTimeout( function(){
        updateTsseData(tsseServicePath, tsseUser, "1052", "ca");
       }, 25000 );
       
      setTimeout( function(){
        updateTsseData(tsseServicePath, tsseUser, "1054", "9624aeef-afac-43b7-aae9-f5278da52d17");
       }, 26000 );

      setTimeout( function(){
        updateTsseData(tsseServicePath, tsseUser, "1056", "83 101 108 102 32 68 101 115 99 114 105 112 116 105 111 110 32 74 83 79 78 32 83 99 104 101 109 97");
       }, 27000 );
      
      setTimeout( function(){
        updateTsseData(tsseServicePath, tsseUser, "1060", "Self%20Description%20JSON%20Schema");
       }, 28000 );

      setTimeout( function(){
        updateTsseData(tsseServicePath, tsseUser, "1070", "2020-06-19T21:58:14.963Z");
       }, 29000 );

      setTimeout( function(){
        updateTsseData(tsseServicePath, tsseUser, "1072", "2020-06-19");
       }, 30000 );

      setTimeout( function(){
        updateTsseData(tsseServicePath, tsseUser, "1074", "21:58:14");
       }, 31000 );

      setTimeout( function(){
        updateTsseData(tsseServicePath, tsseUser, "1076", "2020");
       }, 32000 );

      setTimeout( function(){
        updateTsseData(tsseServicePath, tsseUser, "1078", "06");
       }, 33000 );

      setTimeout( function(){
        updateTsseData(tsseServicePath, tsseUser, "1080", "19");
       }, 34000 );

      setTimeout( function(){
        updateTsseData(tsseServicePath, tsseUser, "1082", "21");
       }, 35000 );

      setTimeout( function(){
        updateTsseData(tsseServicePath, tsseUser, "1084", "58");
       }, 36000 );
      
      setTimeout( function(){
        updateTsseData(tsseServicePath, tsseUser, "1086", "14.963");
       }, 37000 );

      setTimeout( function(){
        updateTsseData(tsseServicePath, tsseUser, "1088", "3500");
       }, 38000 );
      
      setTimeout( function(){
        updateTsseData(tsseServicePath, tsseUser, "1090", "p{font-family:verdana; font-size:18px;}");
       }, 39000 );

      setTimeout( function(){
        updateTsseData(tsseServicePath, tsseUser, "1092", ".spacious");
       }, 40000 );

      setTimeout( function(){
        updateTsseData(tsseServicePath, tsseUser, "1094", "{color: red; text-align: center;}");
       }, 41000 );

      setTimeout( function(){
        updateTsseData(tsseServicePath, tsseUser, "1096", "rgb(255,69,0)");
       }, 42000 );

      setTimeout( function(){
        updateTsseData(tsseServicePath, tsseUser, "1200", 12.56);
       }, 43000 );

      setTimeout( function(){
        updateTsseData(tsseServicePath, tsseUser, "1202", 25);
       }, 44000 );

      setTimeout( function(){
        updateTsseData(tsseServicePath, tsseUser, "1204", -5.28);
       }, 45000 );

      setTimeout( function(){
        updateTsseData(tsseServicePath, tsseUser, "1206", 37.29);
       }, 46000 );
      
      setTimeout( function(){
        updateTsseData(tsseServicePath, tsseUser, "1208", 1.26);
       }, 47000 );

      setTimeout( function(){
        updateTsseData(tsseServicePath, tsseUser, "1210", -2.35);
       }, 48000 );

      setTimeout( function(){
        updateTsseData(tsseServicePath, tsseUser, "1212", 52);
       }, 49000 );

      setTimeout( function(){
        updateTsseData(tsseServicePath, tsseUser, "1214", 3);
       }, 50000 );

      setTimeout( function(){
        updateTsseData(tsseServicePath, tsseUser, "1216", -9);
       }, 51000 );

      setTimeout( function(){
        updateTsseData(tsseServicePath, tsseUser, "1218", 0);
       }, 52000 );

      setTimeout( function(){
        updateTsseData(tsseServicePath, tsseUser, "1300", true);
       }, 53000 );

      setTimeout( function(){
        updateTsseData(tsseServicePath, tsseUser, "1302", false);
       }, 54000 );
      
      setTimeout( function(){
        updateTsseData(tsseServicePath, tsseUser, "1350", null);
       }, 55000 );
      
      setTimeout( function(){
        updateTsseData(tsseServicePath, tsseUser, "3000", [-6.67, "x", null, "y", 100, true, [], {}, "b"]);
       }, 56000 );

      setTimeout( function(){
        updateTsseData(tsseServicePath, tsseUser, "3002", ["a", "b", "5.1", "x", "-10"]);
       }, 57000 );

      setTimeout( function(){
        updateTsseData(tsseServicePath, tsseUser, "3004", [2.34, 5, -6.67, 10.28]);
       }, 58000 );

      setTimeout( function(){
        updateTsseData(tsseServicePath, tsseUser, "3006", [8, 4, 3, 2, 10, 15]);
       }, 59000 );

      setTimeout( function(){
        updateTsseData(tsseServicePath, tsseUser, "3008", "6, 20, 2");
       }, 60000 );

      setTimeout( function(){
        updateTsseData(tsseServicePath, tsseUser, "3010", []);
       }, 61000 );

      setTimeout( function(){
        updateTsseData(tsseServicePath, tsseUser, "3100", {"city": "New York", "name": "Jonesy Band", "education": "No College", "age": 16});
       }, 62000 );

      setTimeout( function(){
        updateTsseData(tsseServicePath, tsseUser, "3110", {});
       }, 63000 );

      setTimeout( function(){
        updateTsseData(tsseServicePath, tsseUser, "3200", new Map( [ ["a", -10], ["b", 5.1] ] ));
       }, 64000 );

      setTimeout( function(){
        updateTsseData(tsseServicePath, tsseUser, "3400", "She sells sea shells by the sea shore. The shells she sells are surely seashells.");
       }, 65000 );

      setTimeout( function(){
        updateTsseData(tsseServicePath, tsseUser, "3430", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==");
       }, 66000 );

      setTimeout( function(){
        updateTsseData(tsseServicePath, tsseUser, "3450", "QVtP2fwKNw59");
       }, 67000 );

      setTimeout( function(){
        updateTsseData(tsseServicePath, tsseUser, "3460", "p3P*f$9&=S-rT()");
       }, 68000 );

      setTimeout( function(){
        updateTsseData(tsseServicePath, tsseUser, "3500", "/^((\\(\\d{3}\\) ?)|(\\d{3}-))?\\d{3}-\\d{4}$/", "(647) 823-7580");
       }, 69000 );
      
      setTimeout( function(){
        updateTsseData(tsseServicePath, tsseUser, "3530", "https%3A%2F%2Favatars2.githubusercontent.com%2Fu%2F18145628%3Fs%3D400%26u%3Dd9b9f7b81ba63e045478001da75f576927bfaf23%26v%3D4", "url encoding");
       }, 70000 );
      
      setTimeout( function(){
        updateTsseData(tsseServicePath, tsseUser, "3550", "fdd1fc91732d46de9ba3a604c5fdffc7", "md5");
       }, 71000 );

      setTimeout( function(){
        updateTsseData(tsseServicePath, tsseUser, "3560", "de581449385caeecdea8bbc02ce49c4f:f516dfb84b9051ed85b89cdc3a8ab7f5",  "md5 salted");
       }, 72000 );
      
      // Closes Thread-SSE connection
      setTimeout( function(){
        updateTsseData(tsseServicePath, tsseUser, "8990");
      }, 73000 ); 
    }
  }
);

// Starts testing sever
server.listen(3000, "localhost", () => console.log('Unit Test listening at http://localhost:3000'));
