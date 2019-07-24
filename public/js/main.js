Demo.Main = (function() {
  var init = function() {
    console.log('Main Page Initialize');
  };

  var initApp = function() {
    Demo.Utils.changeContents('/pages/main.html');
  };

  initApp();

  return {
    init: init,
    initApp: initApp,
  };
})();
