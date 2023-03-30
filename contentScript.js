document.addEventListener("keydown", e => chrome.runtime.sendMessage({type: "keydown", value: {key: e.key}}));
window.addEventListener("focus", () => chrome.runtime.sendMessage({type: "focus"}));
window.addEventListener("blur", () => chrome.runtime.sendMessage({type: "blur"}));