// test: http://127.0.0.1:5984/library-dev/_design/bell-reader/app.html?doc=english--1--book-kevins-birthday
(function($) {

  var reader = {
    "docId": $.url().param("doc"),
    "docURL": $.url().segment(1) + "/" + $.url().param("doc"),
    "docDb": $.url().segment(1),
    "onLine": true,
    "init": function(doc) { 

      // 
      // Configure pages
      // 
      var pages = [] 
      // Only put files in the pages directory into the pages array
      // to avoid other attachments that are not pages.
      $.each(doc._attachments, function (key, value) {
        if(key.indexOf("pages/") === 0) {
          pages.push(key)
        }
      })
      pages.sort()

      // 
      // Configure page variables
      // 
      var thisPage
      var nextPage
      var previousPage
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
      $(".view").html("<div style='color:#FFF'>anything</div>")
      reader.currentPageId = reader.docURL + "/" + pages[thisPage] 
      var slideDirection = $.url().param("slide");
      if (slideDirection == null) {
        slideDirection = "right"
      }
      if (reader.onLine) {
        reader.currentPageSrc = "/" + reader.currentPageId 
      }
      else {
        reader.currentPageSrc = localStorage.getItem("/" + reader.currentPageId)
        reader.currentPageSrc =  "data:image/png" + reader.currentPageSrc.substr(15, reader.currentPageSrc.length)
      }
      // Insert the page
      var pageHTML = '<img width="100%" src="' + reader.currentPageSrc + '" />'
      alert(pageHTML)
      //$(".view").hide().html(pageHTML).show("slide", { direction: slideDirection }, 500)
      $(".view").html("<div style='color:#FFF'>anything</div>")
      //$("body").html(this.readerPageSrc)
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
    "cacheData": {
      "queue": {},
      "progressPercent": function() {
        // @todo
      }
    },
    "cacheCount": 0,
    "cacheWorker": function() {
      // @todo
        var key = this.cacheKeys.pop()
        var xhr = new XMLHttpRequest();
        xhr.readerTarget = "/" + this.docURL + "/" + key
        xhr.open('GET', "/" + this.docURL + "/" + key, true);
        xhr.responseType = 'blob';
        xhr.onload = function(e) {
          if (this.status == 200) {
            // Note: .response instead of .responseText
            // @todo detect filetype
            var type = 'image/png'
            //var blob = new Blob([this.response], {type: type});
            var blob = this.response;
            //var srcBlobURL = window.URL.createObjectURL(blob)
            //var srcBase64 = 'data:image/png;base64,' + window.btoa(blob)
            var freader = new FileReader();
            freader.onload = function(event){
                //createImage(event.target.result); //event.target.results contains the base64 code to create the image.
                //$(".view").append('<img width="100%" src="' + event.target.result + '" />')
                //localStorage.setItem(this.readerTarget, 'data:image/png;base64,' + window.btoa(blob))
                localStorage.setItem(this.readerTarget, event.target.result)
                reader.cacheQueue("workerDone", reader.readerTarget, blob)
            };
            freader.readerTarget = this.readerTarget
            freader.readAsDataURL(blob)
            //$(".view").append('<img width="100%" src="' + srcBlobURL + '" />')
            //localStorage.setItem(this.readerTarget, 'data:image/png;base64,' + window.btoa(blob))
            //reader.cacheQueue("workerDone", this.readerTarget, blob)
          }
        };

        xhr.send();
    },

    "cacheStatus": function(message) {
      // @todo update the cache status message
      console.log(message)
    },
    "cacheKeys": {},

    "cacheQueue": function(op, data) {

      switch(op) {
        case "workerDone":
          this.cacheCount--
          this.cacheStatus(this.cacheCount + " files to download")
          if(this.cacheCount==0) {
            // @todo set to localStorage
            var doc = JSON.parse(localStorage.getItem(this.docURL))
            doc.cached = true
            localStorage.setItem(this.docURL, JSON.stringify(doc))
            this.cacheStatus("Done!")
          }
          else {
            this.cacheWorker()
          }
          break;

        case "start":
          this.cacheCount = this.cacheKeys.length
          this.cacheStatus(this.cacheCount + " files to download")
          // start the bubble
          this.cacheWorker()
          break;
      } 


    },

    "cacheDoc": function (doc) {
      // cache this document object
      localStorage.setItem(reader.docURL, JSON.stringify(doc))
      this.cacheKeys = Object.keys(doc._attachments)
      // start a cache queue
      this.cacheQueue("start")
    } // End cacheDoc
  
  } // End reader

  /*
   * Get this party started
   */ 

  if(navigator.onLine == false) {
    $.couch.db(reader.docDb).openDoc(reader.docId, {
      success: function(doc) {
        reader.init(doc)
      }
    })
  }
  else {
    console.log("offline")
    reader.onLine = false
    var doc = JSON.parse(localStorage.getItem(reader.docURL))
    if(doc) { 
      reader.init(doc)
    }
    else {
      // @todo notify the user they don't have this on their shelf
    }
  }
})(jQuery);