(function($) {

  var reader = {
    "docId": $.url().param("doc"),
    "docURL": "/" + $.url().segment(1) + "/" + $.url().param("doc"),
    "docDb": $.url().segment(1),
    "init": function(doc) { 

      // 
      // Configure page variables
      // 
      var pages = [] 
      var thisPage
      var nextPage
      var previousPage
      // Only put files in the pages directory into the pages array
      // to avoid other attachments that are not pages.
      $.each(doc._attachments, function (key, value) {
        if(key.indexOf("pages/") === 0) {
          pages.push(key)
        }
      })
      pages.sort()
      // Determine thisPage
      if($.url().param("page")) {
        thisPage = parseInt($.url().param("page"))
      }
      else if($.url().param("submit_page")) {
        thisPage = parseInt($.url().param("submit_page")) - 1
      }
      else {
        thisPage = 0
      }
      // Determine nextPage
      if(thisPage == pages.length) {
        nextPage = 0
      }
      else {
        nextPage = thisPage + 1
      }
      // Determine previousPage
      if(thisPage == 0) {
        previousPage = pages.length - 1
      }
      else {
        previousPage = thisPage - 1
      } 

      //
      // Cache widget
      //
      $(".cache-this").click(function() {reader.cacheDoc(doc)})

      //
      // Change page widget
      //
      $(".page-number").click(function() {
        $(".go-to").slideDown()
        return false
      })

      //
      // Set the "go to library" URL
      //
      $(".to-library").attr('href', "/" + $.url().segment(1) + "/_design/library/app.html#page-submit-feedback&id=" + $.url().segment(2))

      //
      // Page display
      //  
      // @todo Setting width to 100% works fine when the image is less than the 
      // screen width but will probably mess up your image if it is greater.
      // In cases where window.width < image.width we'll need to set the viewport
      // so that it rests with the full image width in view on load.  Haven't
      // had any luck making this work as of yet using the meta tags.
      var slideDirection = $.url().param("slide");
      if (slideDirection == null) {
        slideDirection = "right"
      }
      $(".view").hide().html('<img width="100%" src="/' + $.url().segment(1) + '/' + $.url().param("doc") + '/' + pages[thisPage] + '">').show("slide", { direction: slideDirection }, 500);
      setTimeout(function() {
        var newHeight = $(".view img").height()
        $(".view").height(newHeight)
      }, 600)

      //
      // Page number
      //
      var readPage = thisPage + 1
      // We may have an offset that we want to take into account
      if (doc.start_page) {
        if(doc.start_page > readPage) {
          // @todo Create a Roman Numeral
        }
        else {
          readPage = readPage - doc.start_page
        }
      }
      $('a.page-number').hide()
      $('a.page-number').html("<div class='page'>page</div>" + readPage)
      $('a.page-number').fadeIn()

      // 
      // Next and previous widgets
      //    
      $("a.next").attr("href", $.url().attr("path") + "?slide=right&page=" + nextPage).click(function() {
        $(".view img").hide("slide", { direction: "left" }, 250);
        $(".page-number").fadeOut(300)
        setTimeout(function(){window.location.assign($.url().attr("path") + "?slide=right&page=" + nextPage + "&doc=" + $.url().param('doc'))},300)
        return false
      })
      $("a.previous").attr("href", $.url().attr("path") + "?slide=left&page=" + previousPage).click(function() {
        $(".view img").hide("slide", { direction: "right" }, 250);
        $(".page-number").fadeOut(750)
        setTimeout(function(){window.location.assign($.url().attr("path") + "?slide=left&page=" + previousPage + "&doc=" + $.url().param('doc'))},300)
        return false
      })

      //
      // Cache the next and previous page
      //
      $(".cache").append('<img width="100%" src="/' + $.url().segment(1) + '/' + $.url().param("doc") + '/' + pages[previousPage] + '">');
      $(".cache").append('<img width="100%" src="/' + $.url().segment(1) + '/' + $.url().param("doc") + '/' + pages[nextPage] + '">');

    }, // End reader.init()

    "cacheDoc": function (doc) {

      // Generate the manifest file for caching
      // Making a file cacheable will need to move somewhere else where it makes sense when admin party is off
      var manifestArray = [
        'CACHE MANIFEST',
        "",
        'CACHE:',
        "cache.html", // In case the user hits it later...
        reader.docURL, // Caches the CouchDB object
        //reader.docURL + "/*" // Catch all
      ]
      // add every file in the _attachments
      $.each(doc._attachments, function(key, value) {
        if(key != "cache.html" && key != "manifest.appcache"){
          manifestArray.push(key)
        }
      })
      manifestArray.push('')
      manifestArray.push('NETWORK:')
      manifestArray.push('*')
      var manifestTxt = manifestArray.join("\n")

      // Save the manifest file
      var xhr = new XMLHttpRequest()
      xhr.open('PUT', reader.docURL + "/manifest.appcache?rev=" + doc._rev, true)
      xhr.onload = function(response) {
        var doc = $.parseJSON(response.currentTarget.response)
        if(response.target.status == 201) { 

          // Create the HTML document that will reference the manifest file
          var htmlTxt = "<!DOCTYPE html> <meta content='text/html;charset=utf-8' http-equiv='Content-Type'> <html manifest='manifest.appcache'> <head> <script type='text/javascript' src='/_utils/script/jquery.js'></script> <script type='text/javascript' src='/" + reader.docDb + "/_design/ole-reader/reader.cache.js'> </script> </head> <body><div class='status'>Loading...</div></body>  </html>"

          // Save the HTML document referencing the manifest file
          var xhr = new XMLHttpRequest()
          xhr.open('PUT', reader.docURL + "/cache.html?rev=" + doc.rev, true)
          xhr.onload = function(response) {
            if(response.target.status == 201) {
              // @todo add a reference to this in localStorage so Cork knows
              window.location = "http://" + window.location.host + reader.docURL + "/cache.html"               
            }
          }
          xhr.send(new Blob([htmlTxt], {type: 'text/html'}))

        }
      }
      xhr.send(new Blob([manifestTxt], {type: 'text/cache-manifest'}))

    } // End cacheDoc
  } // End reader

  /*
   * Get this party started
   */ 
  $.couch.db(reader.docDb).openDoc(reader.docId, {
    success: function(doc) {
      reader.init(doc)
    }
  })
/*
  $.get("/" + reader.docDb + "/" + reader.docId, function(data) { 
    console.log(data)
  })
*/
})(jQuery);