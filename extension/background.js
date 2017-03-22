if (Redux === undefined) {
    console.log("Redux is not loaded yet");
} else {
    console.log("Redux is available!");

}

const store = Redux.createStore(heatmapApp);

console.log("background.js heatmapApp: " + heatmapApp);
console.log("background.js store: " + store);

var loaded = false;

function handleMessage(request, sender, sendResponse) {
    // We have to wait for the first click to invoke the Redux code because JS
    // is stupid and we have no guarantees about which code is actually loaded
    console.log("In background.js .. Redux namespace: " + Redux);
}

function oldhandleMessage(request, sender, sendResponse) {
    if (request.type === 'LOAD_GUARD') {
        if (loaded) {
            console.log("Data is already loaded.");
            sendResponse({'type': 'IGNORE'});
            return;
        }
        loaded = true;
        // We want to load the data once and only once
        console.log("Data load requested to the popup");
        // sendResponse({'type': 'LOAD_DATA'});
    }
}

browser.runtime.onMessage.addListener(handleMessage);
