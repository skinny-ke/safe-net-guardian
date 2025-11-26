import { MSG_SAFE_MODE_STATUS, MSG_ANALYTICS_EVENT } from '../utils/messages.js';
import { observeDOMChanges } from './observer.js';
import { detectToxicity } from './detector.js';
import { highlightContent, removeHighlights } from './highlighter.js';

let isSafeModeEnabled = false;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === MSG_SAFE_MODE_STATUS) {
        isSafeModeEnabled = request.payload;
        if (isSafeModeEnabled) {
            processNodeForToxicity(document.body);
        } else {
            removeHighlights();
        }
    }
});

const debouncedProcessNode = debounce(processNodeForToxicity, 300);

observeDOMChanges((mutations) => {
    if (!isSafeModeEnabled) return;
    mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
                debouncedProcessNode(node);
            }
        });
    });
});

async function processNodeForToxicity(node) {
    if (!isSafeModeEnabled) return;

    const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
    let textNode;
    while (textNode = walker.nextNode()) {
        const text = textNode.textContent.trim();
        if (text.length > 10) { // Only process reasonably long text
            const isToxic = await detectToxicity(text);
            if (isToxic) {
                highlightContent(textNode, text);
                chrome.runtime.sendMessage({
                    type: MSG_ANALYTICS_EVENT,
                    payload: { event: 'toxic_content_detected' }
                });
            }
        }
    }
}
