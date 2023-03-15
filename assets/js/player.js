//
// player.js
//

window.onload = function() {
    const playerListContainer = document.getElementById("select-players");
    const playersButton = document.getElementById("players");
    const selectedStream = document.getElementById("selected-stream");
    const playbackButton = document.getElementById("playButton");
    const hlsPlayerContainer = document.getElementById("hls-js-player-container");
    const dashPlayerContainer = document.getElementById("dash-js-player-container");

    // Build Players
    var selectedPlayer = "";
    var dashPlayer = dashjs.MediaPlayer().create();
    var hlsPlayer = null;
    if (Hls.isSupported()) {
        hlsPlayer = new Hls();
    }

    // Player UI Logics
    const matches = playerListContainer.querySelectorAll("li.dropdown-item").forEach(function(e) {
        e.addEventListener("click", function() {
            selectedPlayer = e.textContent;
            playersButton.textContent = e.textContent;
            disablePlayers();
            if (e.textContent == "hls.js") {
                enableHlsJsPlayer();
            } else if (e.textContent == "dash.js") {
                enableDashJsPlayer();
            }
        })
    });

    playbackButton.addEventListener("click", function() {
        console.log("Starting playback: ", selectedStream.value);
        if (selectedPlayer == "hls.js") {
            loadHlsJsPlayer(selectedStream.value);
        }
        else if (selectedPlayer == "dash.js") {
            loadDashJsPlayer(selectedStream.value);
        }
    });

    selectedStream.addEventListener("change", function() {
        var input = selectedStream.value;
        if (input.startsWith("https://") || input.startsWith("http://")) {
            playbackButton.disabled = false;
        } else {
            playbackButton.disabled = true;
        }
    });


    // Functions
    function disablePlayers() {
        hlsPlayerContainer.hidden = true;
        dashPlayerContainer.hidden = true;
        selectedStream.disabled = true;
        selectedStream.value = "";
        unloadDashJsPlayer();
        unloadHlsJsPlayer();
    };
    function enableHlsJsPlayer() {
        hlsPlayerContainer.hidden = false;
        selectedStream.disabled = false;
    };
    function enableDashJsPlayer() {
        dashPlayerContainer.hidden = false;
        selectedStream.disabled = false;
    };

    function loadDashJsPlayer(url) {
        //var url = 'https://dash.akamaized.net/envivio/EnvivioDash3/manifest.mpd';
        console.log("dash.js: load");
        var playerElement = document.getElementById('dash-js-player');
        dashPlayer.initialize(playerElement, url, true);
    }

    function unloadDashJsPlayer(url) {
        console.log("dash.js: unload");
        var playerElement = document.getElementById('dash-js-player');
        dashPlayer.initialize(playerElement);
        dashPlayer.reset();
    }

    function loadHlsJsPlayer(url) {
        //var url = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';
        console.log("hls.js: load");
        var playerElement = document.getElementById('hls-js-player');
        if (Hls.isSupported()) {
            hlsPlayer.once(Hls.Events.MEDIA_ATTACHED, function () {
                playerElement.play();
            });
            hlsPlayer.loadSource(url);
            hlsPlayer.attachMedia(playerElement);
        }
        // HLS.js is not supported on platforms that do not have Media Source
        // Extensions (MSE) enabled.
        //
        // When the browser has built-in HLS support (check using `canPlayType`),
        // we can provide an HLS manifest (i.e. .m3u8 URL) directly to the video
        // element through the `src` property. This is using the built-in support
        // of the plain video element, without using HLS.js.
        //
        // Note: it would be more normal to wait on the 'canplay' event below however
        // on Safari (where you are most likely to find built-in HLS support) the
        // video.src URL must be on the user-driven white-list before a 'canplay'
        // event will be emitted; the last video event that can be reliably
        // listened-for when the URL is not on the white-list is 'loadedmetadata'.
        else if (playerElement.canPlayType('application/vnd.apple.mpegurl')) {
            playerElement.src = url;
        }
    }

    function unloadHlsJsPlayer() {
        console.log("hls.js: unload");
        var playerElement = document.getElementById('hls-js-player');
        if (Hls.isSupported()) {
            hlsPlayer.detachMedia();
        }
        else if (playerElement.canPlayType('application/vnd.apple.mpegurl')) {
            playerElement.src = ""
        }
    }

    /*
    playersButton.addEventListener('shown.bs.dropdown', function () {
        console.log("Event fired: players dropdown shown");
    });
    playersButton.addEventListener('hidden.bs.dropdown', function () {
        console.log("Event fired: players dropdown hidden");
    });
    */
}
