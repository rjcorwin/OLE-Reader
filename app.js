 var couchapp = require('couchapp')
  , path = require('path')
  ;

ddoc = 
  { _id:'_design/ole-reader'
  , rewrites : 
    [ {from:"/", to:'index.html'}
    , {from:"/api", to:'../../'}
    , {from:"/api/*", to:'../../*'}
    , {from:"/*", to:'*'}
    ]
  }

couchapp.loadAttachments(ddoc, path.join(__dirname, 'attachments'));

module.exports = ddoc;

/* Submit the appcache file using your browser...
var xhr = new XMLHttpRequest()
// Notice we're using PUT, not POST. Also, what we want to name the file is in the URI.
xhr.open('PUT', "/library-dev/_design/ole-reader/manifest.appcache?rev=22-b90119e23b89a2015ef4ea91cc5f4c0b", true)
xhr.onload = function(response) {
  if(response.status == 200) {
   alert("Your file has been uploaded.")
  }
}

var manifestTxt = ['CACHE MANIFEST',
"app.html",
"reader.js",
"reader.css",
"jquery.min.js",
"jquery.url.js",
"jquery-ui-1.8.23.custom.min.js",
"/_utils/script/jquery.couch.js?0.11.0"].join("\n");

xhr.send(new Blob([manifestTxt], {type: 'text/cache-manifest'}))
*/
