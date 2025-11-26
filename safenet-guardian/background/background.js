import { MSG_SET_SAFE_MODE, MSG_GET_SAFE_MODE, MSG_GET_STATS, MSG_UPDATE_STATS, MSG_ANALYTICS_EVENT, MSG_SAFE_MODE_STATUS } from '../utils/messages.js';
import { getStorage, setStorage } from '../utils/storage.js';

const STORAGE_KEY_SAFE_MODE = 'safeModeEnabled';
const STORAGE_KEY_STATS = 'protectionStats';

let isSafeModeOn = true;
let protectionStats = {
    detectedIncidents: 0,
    lastScanTime: null
};

async function initialize() {
    const storedSafeMode = await getStorage(STORAGE_KEY_SAFE_MODE);
    isSafeModeOn = storedSafeMode === undefined ? true : storedSafeMode;

    const storedStats = await getStorage(STORAGE_KEY_STATS);
    if (storedStats) {
        protectionStats = storedStats;
    }
    console.log(`SafeNet Guardian background initialized. Safe Mode: ${isSafeModeOn}`);
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === MSG_GET_SAFE_MODE) {
        sendResponse({ payload: isSafeModeOn });
    } else if (request.type === MSG_SET_SAFE_MODE) {
        isSafeModeOn = request.payload;
        setStorage(STORAGE_KEY_SAFE_MODE, isSafeModeOn);
        broadcastSafeModeStatus();
        sendResponse({ status: "ok" });
    } else if (request.type === MSG_GET_STATS) {
        sendResponse(protectionStats);
    } else if (request.type === MSG_ANALYTICS_EVENT) {
        handleAnalyticsEvent(request.payload);
        sendResponse({ status: "acknowledged" });
    }
    return true;
});

function handleAnalyticsEvent(eventData) {
    if (eventData.event === 'toxic_content_detected') {
        protectionStats.detectedIncidents++;
        protectionStats.lastScanTime = Date.now();
        setStorage(STORAGE_KEY_STATS, protectionStats);
        chrome.runtime.sendMessage({ type: MSG_UPDATE_STATS, payload: protectionStats });
    }
}

function broadcastSafeModeStatus() {
    chrome.tabs.query({}, (tabs) => {
        tabs.forEach(tab => {
            if (tab.url && tab.url.startsWith('http')) {
                chrome.tabs.sendMessage(tab.id, { type: MSG_SAFE_MODE_STATUS, payload: isSafeModeOn })
                    .catch(error => {});
            }
        });
    });
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url && tab.url.startsWith('http')) {
        chrome.tabs.sendMessage(tabId, { type: MSG_SAFE_MODE_STATUS, payload: isSafeModeOn })
            .catch(error => {});
    }
});

initialize();