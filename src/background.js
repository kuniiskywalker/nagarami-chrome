
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
                runAt: 'document_start'  // and added this
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

