# SafeNet Guardian

## Elevator Pitch
SafeNet Guardian is an AI-powered Chrome extension that creates a safer online environment for women and girls by detecting and blocking digital violence in real-time, directly within their browser, all while prioritizing user privacy.

## Why This Matters
Digital violence against women and girls—harassment, threats, insults, sexism, hate speech, and sexual harassment—is a pervasive and harmful issue. It silences voices, causes immense distress, and limits participation in online spaces. Current solutions are often reactive or require manual reporting. SafeNet Guardian provides an immediate, proactive, and private defense mechanism, empowering users to browse with greater confidence and security.

## Key Features
*   **AI-Powered Detection:** Utilizes a pre-trained TensorFlow.js model for real-time identification of various forms of digital violence.
*   **Offline & Private:** All detection and processing happen locally on the user's device. No data is sent to the cloud.
*   **Real-time Blocking/Masking:** Automatically hides or masks harmful content as it appears.
*   **Safe Mode Toggle:** Easy one-click on/off switch for immediate control.
*   **Content Highlighting:** Visually flags potentially toxic content for user awareness.
*   **Protection Statistics:** Displays anonymized counts of detected incidents.
*   **User-Friendly Interface:** A clean, intuitive popup for managing settings and viewing stats.

## Tech Stack
*   **Frontend:** HTML, CSS, JavaScript
*   **AI/ML:** TensorFlow.js (for offline model inference)
*   **Browser Extension API:** Chrome Extension APIs (Manifest V3)

## Architecture Overview
SafeNet Guardian operates as a Chrome Extension with distinct components:
*   **Popup UI:** The user-facing interface for settings and stats.
*   **Background Service Worker:** Manages extension state, messaging, and analytics.
*   **Content Scripts:** Injected into web pages to monitor DOM, extract text, interact with the AI model, and apply highlights.
*   **TensorFlow.js Model:** Loaded and managed locally for toxicity detection.

Data flows from content scripts to the AI model and back, with state managed by the background script and stored locally using `chrome.storage.local`. Privacy is paramount, with all processing occurring offline.

## Installation Guide

### How to Load the Extension in Chrome
1.  **Download/Clone:** Obtain the project files.
2.  **Open Chrome Extensions:** Navigate to `chrome://extensions/`.
3.  **Enable Developer Mode:** Toggle the "Developer mode" switch.
4.  **Load Unpacked:** Click "Load unpacked".
5.  **Select Folder:** Select the project's root directory.
6.  **Extension Added:** The extension will now be active.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.