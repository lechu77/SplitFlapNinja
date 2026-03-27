const ROWS = 5;
const COLS = 18;
const ALLOWED_CHARS = " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-".split('');
const ANIMATION_SPEED = 40; // ms per half-flip

class Flap {
    constructor(element) {
        this.element = element;
        this.currentValue = ' ';
        this.targetValue = ' ';
        this.isFlipping = false;
        this.renderSteady();
    }

    renderSteady() {
        this.element.innerHTML = `
            <div class="flap-half top"><span>${this.currentValue}</span></div>
            <div class="flap-half bottom"><span>${this.currentValue}</span></div>
        `;
    }

    setTarget(char, forceCycle = true) {
        char = char.toUpperCase();
        if (!ALLOWED_CHARS.includes(char)) char = ' ';
        this.targetValue = char;
        
        if (!this.isFlipping) {
            let isNotEmpty = (this.currentValue !== ' ' || this.targetValue !== ' ');
            if (this.currentValue !== this.targetValue || (forceCycle && isNotEmpty)) {
                this.flipToNext();
            }
        }
    }

    getNextChar(char) {
        let idx = ALLOWED_CHARS.indexOf(char);
        if (idx === -1) idx = 0;
        return ALLOWED_CHARS[(idx + 1) % ALLOWED_CHARS.length];
    }

    flipToNext() {
        this.isFlipping = true;
        const nextValue = this.getNextChar(this.currentValue);

        // Render the sequence for one character flip
        this.element.innerHTML = `
            <div class="flap-half top"><span>${nextValue}</span></div>
            <div class="flap-half bottom"><span>${this.currentValue}</span></div>
            <div class="flap-half top flip-top"><span>${this.currentValue}</span></div>
            <div class="flap-half bottom flip-bottom"><span>${nextValue}</span></div>
        `;

        setTimeout(() => {
            this.currentValue = nextValue;
            if (this.currentValue === this.targetValue) {
                this.isFlipping = false;
                this.renderSteady();
            } else {
                this.flipToNext();
            }
        }, ANIMATION_SPEED * 2);
    }
}

class Board {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.flaps = [];
        this.initBoard();
    }

    initBoard() {
        this.container.innerHTML = '';
        for (let r = 0; r < ROWS; r++) {
            const rowArr = [];
            for (let c = 0; c < COLS; c++) {
                const flapWrapper = document.createElement('div');
                flapWrapper.className = 'flap-wrapper';
                
                const flapEl = document.createElement('div');
                flapEl.className = 'flap';
                
                flapWrapper.appendChild(flapEl);
                this.container.appendChild(flapWrapper);
                
                rowArr.push(new Flap(flapEl));
            }
            this.flaps.push(rowArr);
        }
    }

    setMessage(message, forceCycle = true) {
        const lines = message.split('\n');
        const CHAR_STAGGER = 60;  // ms between letters within a word
        const FLIP_DURATION = ANIMATION_SPEED * 2; // time for one flip step
        const WORD_GAP = 150;     // ms pause after a word finishes before next starts
        let wordDelay = 0;

        for (let r = 0; r < ROWS; r++) {
            const line = (lines[r] || '').padEnd(COLS, ' ');
            let c = 0;
            while (c < COLS) {
                if (line[c] === ' ') {
                    const col = c, row = r;
                    setTimeout(() => this.flaps[row][col].setTarget(' ', forceCycle), wordDelay);
                    c++;
                } else {
                    let wordStart = c;
                    while (c < COLS && line[c] !== ' ') c++;
                    const word = line.slice(wordStart, c);
                    word.split('').forEach((char, i) => {
                        const col = wordStart + i, row = r;
                        setTimeout(() => this.flaps[row][col].setTarget(char, forceCycle), wordDelay + i * CHAR_STAGGER);
                    });
                    // advance delay past the time the last letter of this word finishes flipping
                    wordDelay += (word.length - 1) * CHAR_STAGGER + FLIP_DURATION + WORD_GAP;
                }
            }
        }
    }
}

let displayBoard;

document.addEventListener('DOMContentLoaded', () => {
    displayBoard = new Board('board');
    
    const input = document.getElementById('message-input');
    const launchBtn = document.getElementById('launch-btn');
    const previewBtn = document.getElementById('preview-btn');
    const shareBtn = document.getElementById('share-btn');
    const wrapper = document.getElementById('fullscreen-wrapper');

    function updateBoard(forceCycle = true) {
        const rawLines = input.value.split('\n');
        const formattedLines = rawLines.slice(0, ROWS).map(line => line.substring(0, COLS).toUpperCase());
        displayBoard.setMessage(formattedLines.join('\n'), forceCycle);
    }
    
    // Check URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const msgParam = urlParams.get('msg');
    
    if (msgParam) {
        // Need to run it through the input filter to guarantee format
        input.value = decodeURIComponent(msgParam);
        // Dispatching event triggers the sanitizer created above initially but we haven't created it yet.
    } else {
        // Default welcome message
        setTimeout(() => {
            displayBoard.setMessage("   SPLIT  FLAP\n   NINJA BOARD\n\n   EDIT MESSAGE\n     TO START", false);
        }, 500);
    }
    
    // Enforce limits in real time
    input.addEventListener('input', function() {
        let cursorStart = this.selectionStart;
        let originalLength = this.value.length;
        
        let lines = this.value.toUpperCase().split('\n');
        
        // Remove lines beyond max ROWS
        if (lines.length > ROWS) {
            lines = lines.slice(0, ROWS);
        }
        
        // Filter out disallowed characters and truncate to COLS
        lines = lines.map(line => {
            let filtered = line.split('').filter(char => ALLOWED_CHARS.includes(char)).join('');
            return filtered.substring(0, COLS);
        });
        
        let newValue = lines.join('\n');
        
        if (this.value !== newValue) {
            this.value = newValue;
            // Best effort to maintain cursor position
            let diff = newValue.length - originalLength;
            this.setSelectionRange(cursorStart + diff, cursorStart + diff);
        }
    });

    // If URL had a message, sanitize and display it now that the listener exists
    if (msgParam) {
        input.dispatchEvent(new Event('input'));
        setTimeout(() => {
            updateBoard(false);
        }, 500);
    }

    // Share URL Logic
    shareBtn.addEventListener('click', () => {
        const cleanMsg = input.value;
        const newUrl = window.location.origin + window.location.pathname + '?msg=' + encodeURIComponent(cleanMsg);
        
        navigator.clipboard.writeText(newUrl).then(() => {
            const originalText = shareBtn.innerText;
            shareBtn.innerText = 'Copied!';
            setTimeout(() => {
                shareBtn.innerText = originalText;
            }, 2000);
        }).catch(err => {
            console.error('Could not copy text: ', err);
            prompt("Copía la URL para compartir:", newUrl); // Fallback
        });
    });

    // Auto-refresh the board every 30 seconds
    setInterval(() => {
        updateBoard(true);
    }, 30000);

    // Theme switcher
    document.querySelectorAll('.tpl-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tpl-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const theme = btn.dataset.theme;
            document.body.className = theme === 'default' ? '' : `theme-${theme}`;
        });
    });

    previewBtn.addEventListener('click', () => {
        updateBoard(true);
    });

    launchBtn.addEventListener('click', () => {
        updateBoard(true);
        
        if (wrapper.requestFullscreen) {
            wrapper.requestFullscreen();
        } else if (wrapper.mozRequestFullScreen) {
            wrapper.mozRequestFullScreen();
        } else if (wrapper.webkitRequestFullscreen) {
            wrapper.webkitRequestFullscreen();
        } else if (wrapper.msRequestFullscreen) {
            wrapper.msRequestFullscreen();
        }
    });
});
