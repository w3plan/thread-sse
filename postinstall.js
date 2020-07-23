const fs = require('fs');
const path = require('path');

const targetDir = process.cwd();

if (targetDir !== __dirname) {
  
  var publicPath = path.join(targetDir, 'public');
  var publicJsPath = path.join(publicPath, 'js');
  var publicImgPath = path.join(publicPath, 'img');
  var customPath = path.join(targetDir, 'custom');
  
  function tsseCopy(srcPath, destDir, destFile) {
    var srcFull = path.join(__dirname, srcPath);
    var destFull = path.join(destDir, destFile);
    
    return fs.createReadStream(srcFull).pipe(fs.createWriteStream(destFull));
  }
  
  if ( !fs.existsSync(publicPath) || !fs.statSync(publicPath).isDirectory() ) {
    fs.mkdirSync(publicPath);
    fs.mkdirSync(publicJsPath);
    fs.mkdirSync(publicImgPath);
    
    tsseCopy('/public/client.html', publicPath, 'client.html');
    tsseCopy('/public/favicon.ico', publicPath, 'favicon.ico');
    tsseCopy('/public/robots.txt', publicPath, 'robots.txt');
    
    tsseCopy('/public/js/tsse.js', publicJsPath, 'tsse.js');
    tsseCopy('/public/js/custom-tsse.js', publicJsPath, 'custom-tsse.js');
    
    tsseCopy('/public/img/tsse-logo-200x175.jpg', publicImgPath, 'tsse-logo-200x175.jpg');
    tsseCopy('/public/img/tsse-logo-24x24.png', publicImgPath, 'tsse-logo-24x24.png');
    
  } else if ( !fs.existsSync(publicJsPath) || !fs.statSync(publicJsPath).isDirectory() ) {
    fs.mkdirSync(publicJsPath);
    
    tsseCopy('/public/js/tsse.js', publicJsPath, 'tsse.js');
    tsseCopy('/public/js/custom-tsse.js', publicJsPath, 'custom-tsse.js');
    
  } else if ( !fs.existsSync(publicImgPath) || !fs.statSync(publicImgPath).isDirectory() ) {
    fs.mkdirSync(publicImgPath);
    
    tsseCopy('/public/img/tsse-logo-200x175.jpg', publicImgPath, 'tsse-logo-200x175.jpg');
    tsseCopy('/public/img/tsse-logo-24x24.png', publicImgPath, 'tsse-logo-24x24.png');
  }
  
  if ( !fs.existsSync(customPath) || !fs.statSync(customPath).isDirectory() ) {
    fs.mkdirSync(customPath);
    
    tsseCopy('/custom/validation.js', customPath, 'validation.js');
    tsseCopy('/custom/access-control.js', customPath, 'access-control.js');
    tsseCopy('/custom/localhost.key', customPath, 'localhost.key');
    tsseCopy('/custom/localhost.cert', customPath, 'localhost.cert');
  }
  
  if ( !fs.existsSync(path.join(targetDir, '/server-http.js')) ) {
    tsseCopy('/server-http.js', targetDir, 'server-http.js');
  }

  if ( !fs.existsSync(path.join(targetDir, '/cluster-server-http.js')) ) {
    tsseCopy('/cluster-server-http.js', targetDir, 'cluster-server-http.js');
  }
  
  if ( !fs.existsSync(path.join(targetDir, '/server-https.js')) ) {
    tsseCopy('/server-https.js', targetDir, 'server-https.js');
  }

  if ( !fs.existsSync(path.join(targetDir, '/server-http2.js')) ) {
    tsseCopy('/server-http2.js', targetDir, 'server-http2.js');
  }
  
  if (!fs.existsSync(path.join(targetDir, '/server-https.js'))) {
    tsseCopy('/server-express.js', targetDir, 'server-express.js');
  }

  if ( !fs.existsSync(path.join(targetDir, '/server-express.js')) ) {
    tsseCopy('/server-express-https.js', targetDir, 'server-express-https.js');                        
  }
  
  console.log('\nSet up Thread-SSE application environment to ' + targetDir + ' completed.'); 
  console.log('To access https://github.com/w3plan/thread-sse/blob/master/doc/document.md for the details.');
}
