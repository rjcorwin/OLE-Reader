(function($) {

  /*
   * Get this party started
   */ 

  if(navigator.onLine) {
    $.couch.db(reader.docDb).openDoc(reader.docId, {
      success: function(doc) {
        reader.init(doc)
      }
    })
  }
  else {
    reader.onLine = false
    var doc = localStorage.getItem(reader.docURL)
    if(doc) { 
      reader.init(doc)
    }
    else {
      // @todo notify the user they don't have this on their shelf
    }
  }

})(jQuery);