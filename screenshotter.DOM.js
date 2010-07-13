(function() {
  
  var shared = {};
  
  // 1
  function screenshotBegin(shared) {
    shared.originalScrollTop = window.document.body.scrollTop; // ->[] save user scrollTop
    window.document.body.scrollTop = 0;
    setTimeout(function() { screenshotVisibleArea(shared); }, 100);
  }
  
  // 2
  function screenshotVisibleArea(shared) { chrome.extension.sendRequest({ action: 'screenshotVisibleArea', shared: shared }); }
  
  // 3
  function screenshotScroll(shared) {
    var scrollTopCurrent = window.document.body.scrollTop;
    
    //TODO: bug: doesn't screenshot correctly
    window.document.body.scrollTop += window.innerHeight; // scroll!
    
    if (window.document.body.scrollTop == scrollTopCurrent) {
      // END ||
      shared.imageDirtyCutAt = scrollTopCurrent % window.document.documentElement.clientHeight / window.document.documentElement.clientHeight;
      window.document.body.scrollTop = shared.originalScrollTop; // <-[] restore user scrollTop
      screenshotEnd(shared);
    } else {
      // LOOP >>
      setTimeout(function() { screenshotVisibleArea(shared); }, 100);
    }
  }
  
  // 4
  function screenshotEnd(shared) { chrome.extension.sendRequest({ action: 'screenshotEnd', shared: shared }); }
  
  // 5
  function screenshotReturn(shared) {
    var div = window.document.createElement('div');
    div.innerHTML = '<p style="-webkit-box-shadow: 0px 5px 8px #000000; margin: 20px; border: 1px solid #666666; padding: 1px; background: #ffffff; position: absolute; top: 0; z-index: 666; "><img src="' +  shared.imageDataURL + '" width= "500" /></p>';
    window.document.body.appendChild(div);
  }
  
  // ****** eventManagerInit
  var self = this;
  chrome.extension.onRequest.addListener(function(e) {
      switch (e.action) {
        case "screenshotBegin": screenshotBegin(e.shared); break;
        case "screenshotScroll": screenshotScroll(e.shared); break;
        case "screenshotReturn": screenshotReturn(e.shared); break;
      }
  });
})();