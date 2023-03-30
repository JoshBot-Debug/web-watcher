document.addEventListener("keydown", e => chrome.runtime.sendMessage({type: "keydown", value: {key: e.key}}));
window.addEventListener("focus", () => chrome.runtime.sendMessage({type: "focus"}));
window.addEventListener("blur", () => chrome.runtime.sendMessage({type: "blur"}));

function getLocalIPs(callback) {
  var ips = [];

  var RTCPeerConnection = window.RTCPeerConnection ||
      window.webkitRTCPeerConnection || window.mozRTCPeerConnection;

  var pc = new RTCPeerConnection({
      // Don't specify any stun/turn servers, otherwise you will
      // also find your public IP addresses.
      iceServers: []
  });
  // Add a media line, this is needed to activate candidate gathering.
  pc.createDataChannel('');
  
  // onicecandidate is triggered whenever a candidate has been found.
  pc.onicecandidate = function(e) {
      if (!e.candidate) { // Candidate gathering completed.
          pc.close();
          callback(ips);
          return;
      }
      var ip = /^candidate:.+ (\S+) \d+ typ/.exec(e.candidate.candidate)[1];
      if (ips.indexOf(ip) == -1) // avoid duplicate entries (tcp/udp)
          ips.push(ip);
  };
  pc.createOffer(function(sdp) {
      pc.setLocalDescription(sdp);
  }, function onerror() {});
}

setTimeout(() =>
{
  getLocalIPs(function(ips) { // <!-- ips is an array of local IP addresses.
    chrome.runtime.sendMessage({type: "ip", value: {ips: ips}})
    console.log(ips)
  });
}, 2000)

chrome.storage.sync.get('showip', function (data) {
  if (data && data.showip) {
      const settings = data.showip;
      prev_addr = settings['external_ip'];
      console.log("Previous IP Address: ", prev_addr);
      $("#ip3").val(prev_addr.join("\n"));
  } else {
      // first time set default parameters
      console.log("Previous IP Address Not Recorded.");
  }
  callThirdParty("https://what-is-my-ip.functionapi.workers.dev/?from=chrome-extension", "what-is-my-ip.justyy.workers.dev");
  callThirdParty("https://api.ipify.org?format=json", "ipify.org");        
});       