import { loadToxicityModel } from '../libs/toxicity.js';

let model;

export async function detectToxicity(text) {
    if (!model) {
        model = await loadToxicityModel();
    }
    return await model.classify(text);
}