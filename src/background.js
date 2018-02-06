
/**
 * Listens for the app launching then creates the window
 *
 * @see http://developer.chrome.com/apps/app.runtime.html
 * @see http://developer.chrome.com/apps/app.window.html
 */
chrome.app.runtime.onLaunched.addListener(function() {
  runApp();
});

/**
 * Listens for the app restarting then re-creates the window.
 *
 * @see http://developer.chrome.com/apps/app.runtime.html
 */
chrome.app.runtime.onRestarted.addListener(function() {
  runApp();
});

/**
 * Creates the window for the application.
 *
 * @see http://developer.chrome.com/apps/app.window.html
 */
function runApp() {
  chrome.app.window.create(
        'src/index.html', 
        {
            'id': 'initialBrowserWindowID',
            bounds: {
                width: window.parent.screen.width,
                height: window.parent.screen.height
            }
        },
        function(newWindow) {
            newWindow.contentWindow.onload = function(window){
                var webview = window.target.querySelector('body webview');
                window.target.getElementById("close").onclick = function() {
                    newWindow.close();
                }
                window.target.getElementById("back").onclick = function() {
                    webview.back();
                }
                window.target.getElementById("forward").onclick = function() {
                    webview.forward();
                }
                const label = chrome.i18n.getMessage("menuLabel");
                webview.contextMenus.create({
                    type: 'normal',
                    id: 'hello',
                    contexts: ["link"],
                    title: label,
                    onclick: function(info) {
                        playMovie(info.linkUrl);
                    }
                });
            }
            newWindow.onClosed.addListener(function() {
                debugger;
            })
            newWindow.onClosed = function(){
debugger;
                var currentMovieWindow = chrome.app.window.get('playerWindowID');
                if (currentMovieWindow) {
                    currentMovieWindow.close();
                }
            }
        }
    );
}

function playMovie (linkUrl) {
    var height = 130;
    var width = 100;
    var top = window.parent.screen.height - height;
    var left = window.parent.screen.width - width;
    var currentMovieWindow = chrome.app.window.get('playerWindowID');
    if (currentMovieWindow) {
        var webview = currentMovieWindow.contentWindow.document.querySelector('body webview');
        webview.src = linkUrl;
        webview.addEventListener('loadcommit', function(e) {
            this.insertCSS({
                code: '#meta{display:none} #info{display:none} #page-manager{margin: 0px} #masthead-container{display:none} #container{display:none} #related{display:none} #items{display:none}',
                runAt: 'document_start'
            });
        });       
	return;
    } 
    chrome.app.window.create(
        'src/player.html', 
        {
            'id': 'playerWindowID',
            width: 100,
            height: 100,
            // frame: 'none',
            'alwaysOnTop': true,
            innerBounds: {
                top: top,
                left: left
            }
        },
        function(newWindow) {
            newWindow.contentWindow.onload = function(window){
                var webview = window.target.querySelector('body webview');
                webview.src = linkUrl;
                webview.addEventListener('loadcommit', function(e) {
                  this.insertCSS({
                    code: '#meta{display:none} #info{display:none} #page-manager{margin: 0px} #masthead-container{display:none} #container{display:none} #related{display:none} #items{display:none}',
                    runAt: 'document_start'  // and added this
                  });
                });
            }
        }
    );
}

