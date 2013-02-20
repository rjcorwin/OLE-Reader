// reader-audio.js

  function __log(e, data) {
    log.innerHTML += "\n" + e + " " + (data || '');
  }

  var audio_context;
  var recorder;

  function startUserMedia(stream) {
    var input = audio_context.createMediaStreamSource(stream);
    //__log('Media stream created.');
    
    input.connect(audio_context.destination);
    //__log('Input connected to audio context destination.');
    
    recorder = new Recorder(input);
    //__log('Recorder initialised.');
  }

  function startRecording(button) {
    recorder && recorder.record();
    button.disabled = true;
    button.nextElementSibling.disabled = false;
    //__log('Recording...');
  }

  function stopRecording(button) {
    recorder && recorder.stop();
    button.disabled = true;
    button.previousElementSibling.disabled = false;
    //__log('Stopped recording.');
    
    // create WAV download link using audio data blob
    createDownloadLink();
    
    recorder.clear();
  }

  function createDownloadLink() {
    recorder && recorder.exportWAV(function(blob) {
      var url = URL.createObjectURL(blob);
      var li = document.createElement('li');
      var au = document.createElement('audio');
      var hf = document.createElement('a');

      
      au.controls = true;
      au.src = url;
      hf.href = url;
      hf.download = new Date().toISOString() + '.wav';
      hf.innerHTML = hf.download;
      li.appendChild(au);
      li.appendChild(hf);
      recordingslist.appendChild(li);

        $.couch.db($.url().segment(1)).openDoc($.url().param("doc"), {
          success: function(doc) {
            var thisPage = 0
            if($.url().param("page")) {
                thisPage = parseInt($.url().param("page"))
            }
            if($.url().param("submit_page")) {
                thisPage = parseInt($.url().param("submit_page")) - 1
            }
            var xhr = new XMLHttpRequest()
            xhr.open('PUT', '/' + $.url().segment(1) + '/' + $.url().param("doc") + '/audio/' + thisPage + '.wav?rev=' + doc._rev, true)
            xhr.onload = function(response) { 
              if(response.status == 200) {
                alert("Your file has been uploaded.")
              }
            }
            xhr.send(blob, {type: 'audio/x-wav'})
          }
        })

    });
  }

