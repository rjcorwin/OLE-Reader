 var couchapp = require('couchapp')
  , path = require('path')
  ;

ddoc = 
  { _id:'js-read-book-1'
  }
  ;

couchapp.loadAttachments(ddoc, path.join(__dirname, 'attachments'));

module.exports = ddoc;
