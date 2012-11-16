	(function($) {

		var url = $.url()
		
		// @todo If there is not doc defined, show a dialog for giving us a doc ID.

		//	
		// Get the attached pages from the document in couchdb
		//
		var doc = $.couch.db(url.segment(1)).openDoc(url.param("doc"), {
              success: function(doc) {

              	/*
              	 * Shelf widget
              	 
              	$("#other").click(function() {
              		var manifestText = " 
						CACHE MANIFEST
						# 2010-06-18:v3

						# Explicitly cached entries
						index.html
						css/style.css

						# offline.html will be displayed if the user is offline
						FALLBACK:
						/ /offline.html

						# All other resources (e.g. sites) require the user to be online. 
						NETWORK:
						*

						# Additional resources to cache
						CACHE:
              			pages/page-14.jpg


              		";
              		var xhr = new XMLHttpRequest()
					// Notice we're using PUT, not POST.  Also, what we want to name the file is in the URI.
					xhr.open('PUT', "/fupload/112/hello-world.txt?rev=15-05bbd9cf2a3c17fff5000d4c1e716099", true)
					xhr.onload = function(response) { 
					  if(response.status == 200) {
					  	alert("Your file has been uploaded.")
					  }
					}
					xhr.send(new Blob(['hello world'], {type: 'text/plain'}))

              	})
				*/
              	/*
              	 * Change page widget
              	 */
				$(".page-number").click(function() {
					$(".go-to").slideDown()
					return false
				})

				//
				// Set the "go to library" URL
				//
				// Dropping for now... $(".to-library").attr('href', "/" + url.segment(1) + "/_design/library/app.html#page-submit-feedback&id=" + url.segment(2))

        		var pages = [] 
				// Only put files in the pages directory into the pages array
				$.each(doc._attachments, function (key, value) {
					if(key.indexOf("pages/") === 0) {
						pages.push(key)
					}
				})
				pages.sort()

				//
				// Display the page
				//
				var thisPage = 0
				if(url.param("page")) {
					thisPage = parseInt(url.param("page"))
				}
				if(url.param("submit_page")) {
					thisPage = parseInt(url.param("submit_page")) - 1
				}

				// @todo Setting width to 100% works fine when the image is less than the 
				// screen width but will probably mess up your image if it is greater.
				// In cases where window.width < image.width we'll need to set the viewport
				// so that it rests with the full image width in view on load.  Haven't
				// had any luck making this work as of yet using the meta tags.
				$(".view").hide().html('<img width="100%" src="/' + url.segment(1) + '/' + url.param("doc") + '/' + pages[thisPage] + '">').show("slide", { direction: url.param("slide") }, 500);
				setTimeout(function() {
					var newHeight = $(".view img").height()
					$(".view").height(newHeight)
				}, 600)


				//
				// Display the page number
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
				// Set up the next and previous URLs
				//		

				// Determine next and previous pages
				if(thisPage == pages.length) {
					nextPage = 0
				}
				else {
					nextPage = thisPage + 1
				}

				if(thisPage == 0) {
					previousPage = pages.length
				}
				else {
					previousPage = thisPage - 1
				}
				// Set the URLs
				$("a.next").attr("href", url.attr("path") + "?slide=right&page=" + nextPage).click(function() {
					$(".view img").hide("slide", { direction: "left" }, 250);
					$(".page-number").fadeOut(300)
					setTimeout(function(){window.location.assign(url.attr("path") + "?slide=right&page=" + nextPage + "&doc=" + url.param('doc'))},300)
					return false
				})
				$("a.previous").attr("href", url.attr("path") + "?slide=left&page=" + previousPage).click(function() {
					$(".view img").hide("slide", { direction: "right" }, 250);
					$(".page-number").fadeOut(750)
					setTimeout(function(){window.location.assign(url.attr("path") + "?slide=left&page=" + previousPage + "&doc=" + url.param('doc'))},300)
					return false
				})

				//
				// Cache the next and previous page
				//
				$(".cache").append('<img width="100%" src="/' + url.segment(1) + '/' + url.param("doc") + '/' + pages[previousPage] + '">');
				$(".cache").append('<img width="100%" src="/' + url.segment(1) + '/' + url.param("doc") + '/' + pages[nextPage] + '">');


			  }
            })
	})(jQuery);