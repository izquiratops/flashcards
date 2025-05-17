function flashcardApp() {
    return {
        decks: ["JLPT_N1","JLPT_N2","JLPT_N3","JLPT_N4","JLPT_N5","ドリル"],
        vocabulary: [],
        currentWord: { word: '', reading: '' },
        index: 0,
        page: 'home', // 'home' or 'ingame'
        isDraggingFile: false,
        readingHidden: true,

        showNewWord(index) {
            this.readingHidden = true;
            this.currentWord = this.vocabulary[this.index];
        },

        toggleReading() {
            if (this.readingHidden) {
                this.readingHidden = false;
            } else {
                this.index += 1;
                this.showNewWord();
            }
        },

        goToJisho() {
            window.open(`https://jisho.org/search/${encodeURIComponent(this.currentWord.word)}`, '_blank');
        },

        backToHome() {
            this.page = 'home';
        },

        processCSV(csvText) {
            const lines = csvText.split(/\r\n|\n/);
            const newVocabulary = [];
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i].trim();
                if (!line) continue;

                const firstCommaIndex = line.indexOf(',');
                if (firstCommaIndex !== -1) {
                    const word = line.substring(0, firstCommaIndex).trim();
                    const reading = line.substring(firstCommaIndex + 1).trim();
                    newVocabulary.push({ word, reading });
                }
            }
            if (newVocabulary.length > 0) {
                // Scramble with Fisher-Yates
                for (let i = newVocabulary.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [newVocabulary[i], newVocabulary[j]] = [newVocabulary[j], newVocabulary[i]];
                }

                // Setup state to initialize the flashcard game
                this.vocabulary = newVocabulary;
                this.page = 'ingame';
                this.index = 0;
                this.showNewWord();
            } else {
                alert('Could not load any words from the CSV file. Make sure the format is correct.');
            }
        },

        loadDeck(fileName) {
            fetch(`./decks/${fileName}.csv`)
                .then(response => {
                    if (!response.ok) throw new Error('Network response was not ok');
                    return response.text();
                })
                .then(csvText => {
                    this.processCSV(csvText);
                })
                .catch(error => {
                    console.error('Error loading local deck:', error);
                    alert('Could not load local deck file.');
                });
        },

        handleFile(file) {
            if (file?.type === 'text/csv' || file?.name.endsWith('.csv')) {
                const reader = new FileReader();
                reader.onload = (e) => this.processCSV(e.target.result);
                reader.readAsText(file);
            } else {
                alert('Please select a valid CSV file.');
            }
        },

        handleDrop(event) {
            this.isDraggingFile = false;
            this.handleFile(event.dataTransfer.files[0]);
        },

        handleFileSelect(event) {
            this.handleFile(event.target.files[0]);
        },
    };
}