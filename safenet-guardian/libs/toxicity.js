const TOXICITY_LABELS = ['identity_attack', 'insult', 'obscene', 'severe_toxicity', 'sexual_explicit', 'threat', 'toxicity'];

const MOCK_TOXIC_WORDS = ['idiot', 'stupid', 'hate', 'kill', 'nasty'];

class MockToxicityModel {
    constructor(threshold) {
        this.threshold = threshold;
    }

    async classify(sentences) {
        const predictions = [];
        const text = Array.isArray(sentences) ? sentences.join(' ') : sentences;
        const lowerCaseText = text.toLowerCase();

        let isToxic = MOCK_TOXIC_WORDS.some(word => lowerCaseText.includes(word));

        return isToxic;
    }
}

export async function loadToxicityModel(threshold = 0.7) {
    console.log('Loading mock toxicity model...');
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate loading delay
    console.log('Mock toxicity model loaded.');
    return new MockToxicityModel(threshold);
}