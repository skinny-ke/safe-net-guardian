export function highlightContent(textNode, textToHighlight) {
    const parent = textNode.parentNode;
    if (!parent || parent.classList.contains('safenet-highlight-wrapper')) return;

    const highlightSpan = document.createElement('span');
    highlightSpan.className = 'safenet-highlight';
    highlightSpan.textContent = textToHighlight;

    const wrapper = document.createElement('span');
    wrapper.className = 'safenet-highlight-wrapper';

    const beforeText = textNode.textContent.substring(0, textNode.textContent.indexOf(textToHighlight));
    const afterText = textNode.textContent.substring(textNode.textContent.indexOf(textToHighlight) + textToHighlight.length);

    if (beforeText) wrapper.appendChild(document.createTextNode(beforeText));
    wrapper.appendChild(highlightSpan);
    if (afterText) wrapper.appendChild(document.createTextNode(afterText));

    parent.replaceChild(wrapper, textNode);
}

export function removeHighlights() {
    const wrappers = document.querySelectorAll('.safenet-highlight-wrapper');
    wrappers.forEach(wrapper => {
        const parent = wrapper.parentNode;
        if (parent) {
            parent.replaceChild(document.createTextNode(wrapper.textContent), wrapper);
            parent.normalize(); // Merges adjacent text nodes
        }
    });
}