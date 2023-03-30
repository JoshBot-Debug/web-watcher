
const log = []

const logger = ({type, value = null}) => ({type, value, timestamp: new Date().toISOString()})

chrome.history.onVisited.addListener(function(historyItem) {
  log.push(logger({type: "visited", value: {url: historyItem.url}}))
});

chrome.tabs.onActivated.addListener(function(activeInfo) {
  chrome.tabs.get(activeInfo.tabId, function(tab) {
    log.push(logger({type: "switched_tab", value: {url: tab.url}}))
  });
});


chrome.tabs.onRemoved.addListener(function (_, removeInfo) {
  log.push(logger({type: "closed_tab"}))
})

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status === "complete") {
    chrome.scripting.executeScript({
      target: {tabId, allFrames: true},
      files: ['contentScript.js'],
    })
  }
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  log.push(logger(request))
});

// setInterval(() => console.log(log), 5000)