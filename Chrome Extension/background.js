chrome.action.onClicked.addListener((reason) => {
    chrome.tabs.create({
      url: '../html/tab.html'
    });
});

