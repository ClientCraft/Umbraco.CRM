declare global {
    interface Window {
        SpeechRecognition: typeof SpeechRecognition;
        webkitSpeechRecognition: typeof SpeechRecognition;
        SpeechGrammarList: typeof SpeechGrammarList;
        webkitSpeechGrammarList: typeof SpeechGrammarList;
        SpeechRecognitionEvent: typeof SpeechRecognitionEvent;
        webkitSpeechRecognitionEvent: typeof SpeechRecognitionEvent;
        SpeechRecognitionErrorEvent: typeof SpeechRecognitionErrorEvent;
        webkitSpeechRecognitionErrorEvent: typeof SpeechRecognitionErrorEvent;
    }
}

export {};