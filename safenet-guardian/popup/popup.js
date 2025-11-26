import { MSG_GET_SAFE_MODE, MSG_SET_SAFE_MODE, MSG_GET_STATS, MSG_UPDATE_STATS } from '../utils/messages.js';

const safeModeToggle = document.getElementById('safeModeToggle');
const toggleStatusText = document.getElementById('toggleStatusText');
const detectedIncidentsSpan = document.getElementById('detectedIncidents');
const lastScanTimeSpan = document.getElementById('lastScanTime');

document.addEventListener('DOMContentLoaded', () => {
    chrome.runtime.sendMessage({ type: MSG_GET_SAFE_MODE }, (response) => {
        if (chrome.runtime.lastError) {
            console.error("Error getting Safe Mode status:", chrome.runtime.lastError.message);
            return;
        }
        if (response && response.payload !== undefined) {
            updateToggleStatus(response.payload);
        }
    });

    chrome.runtime.sendMessage({ type: MSG_GET_STATS }, (response) => {
        if (chrome.runtime.lastError) {
            console.error("Error getting stats:", chrome.runtime.lastError.message);
            return;
        }
        if (response) {
            updateStats(response);
        }
    });

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.type === MSG_UPDATE_STATS) {
            updateStats(request.payload);
        }
    });
});

safeModeToggle.addEventListener('change', (event) => {
    const isSafeModeOn = event.target.checked;
    updateToggleStatus(isSafeModeOn);
    chrome.runtime.sendMessage({ type: MSG_SET_SAFE_MODE, payload: isSafeModeOn });
});

function updateToggleStatus(isSafeModeOn) {
    safeModeToggle.checked = isSafeModeOn;
    toggleStatusText.textContent = isSafeModeOn ? "Safe Mode is ON" : "Safe Mode is OFF";
    toggleStatusText.style.color = isSafeModeOn ? "#38A169" : "#A0AEC0";
}

function updateStats(stats) {
    detectedIncidentsSpan.textContent = stats.detectedIncidents || 0;
    lastScanTimeSpan.textContent = stats.lastScanTime ? new Date(stats.lastScanTime).toLocaleString() : 'Never';
}