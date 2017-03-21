var loaded = false;

function handleMessage(request, sender, sendResponse) {
    if (request.type === 'LOAD_GUARD') {
        if (loaded) {
            console.log("Data is already loaded.");
            sendResponse({'type': 'IGNORE'});
            return;
        }
        loaded = true;
        // We want to load the data once and only once
        console.log("Data load requested to the popup");
        sendResponse({'type': 'LOAD_DATA'});
    }
}

browser.runtime.onMessage.addListener(handleMessage);
