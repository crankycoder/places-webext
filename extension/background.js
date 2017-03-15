import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

function handleMessage(request, sender, sendResponse) {
  console.log("Message from the content script: " +
    request.url);
  sendResponse({response: "Response from background script"});
}

browser.runtime.onMessage.addListener(handleMessage);

browser.placesdb.query({query: "select id, visit_type from moz_historyvisits limit 10", params: ['id', 'visit_type']}).then(
    function(results) {
        for (var i = 0; i < results.length; i++) {
            console.log("Row foo: " + results[i].id + " | " + results[i].visit_type);
        }
    },
    function(reason) {
        console.log("failure resason: " + reason); // Fail!
    }
);
