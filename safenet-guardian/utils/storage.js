export async function getStorage(keys) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(keys, (result) => {
            if (chrome.runtime.lastError) {
                return reject(chrome.runtime.lastError);
            }
            if (Array.isArray(keys)) {
                resolve(result);
            } else {
                resolve(result[keys]);
            }
        });
    });
}

export async function setStorage(keyOrObject, value) {
    const itemsToSet = {};
    if (typeof keyOrObject === 'string') {
        itemsToSet[keyOrObject] = value;
    } else {
        Object.assign(itemsToSet, keyOrObject);
    }

    return new Promise((resolve, reject) => {
        chrome.storage.local.set(itemsToSet, () => {
            if (chrome.runtime.lastError) {
                return reject(chrome.runtime.lastError);
            }
            resolve();
        });
    });
}