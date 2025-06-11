document.addEventListener('DOMContentLoaded', () => {
    const timeDisplay = document.getElementById('time-display');
    const startPauseBtn = document.getElementById('start-pause-btn');
    const resetBtn = document.getElementById('reset-btn');
    const modeButtons = document.querySelectorAll('.timer-modes button');
    const settingsToggle = document.querySelector('.timer-settings-toggle');
    const settingsPanel = document.querySelector('.timer-settings-panel');
    const sessionInfo = document.getElementById('session-info');
    const alarmSound = document.getElementById('alarm-sound');
    const inputs = {
        focus: document.getElementById('focus-input'),
        short: document.getElementById('short-break-input'),
        long: document.getElementById('long-break-input')
    };
    
    if(!timeDisplay) return;

    let settings = JSON.parse(localStorage.getItem('timerSettings')) || { focus: 25, short: 5, long: 15 };
    let currentMode = 'focus';
    let timeLeft = settings.focus * 60;
    let timerInterval = null;
    let isRunning = false;
    let sessionCount = 0;
    const SESSIONS_UNTIL_LONG_BREAK = 4;

    const saveSettings = () => localStorage.setItem('timerSettings', JSON.stringify(settings));

    const updateDisplay = () => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timeDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        
        const modeText = currentMode.replace('-', ' ');
        const capitalizedMode = modeText.charAt(0).toUpperCase() + modeText.slice(1);
        document.title = `${timeDisplay.textContent} - ${capitalizedMode}`;

        if (currentMode === 'focus') {
            sessionInfo.textContent = `Session ${sessionCount + 1} of ${SESSIONS_UNTIL_LONG_BREAK}`;
        } else {
            sessionInfo.textContent = capitalizedMode;
        }
    };
    
    const loadSettings = () => {
        inputs.focus.value = settings.focus;
        inputs.short.value = settings.short;
        inputs.long.value = settings.long;
    };

    const switchMode = (mode) => {
        currentMode = mode;
        modeButtons.forEach(btn => btn.classList.remove('active'));
        document.getElementById(`${mode}-btn`).classList.add('active'); 
        
        const settingsKey = mode.split('-')[0];
        timeLeft = settings[settingsKey] * 60;
        updateDisplay();
    };

    const stopTimer = () => {
        clearInterval(timerInterval);
        isRunning = false;
        startPauseBtn.textContent = 'START';
    };

    const startNextSession = () => {
        stopTimer();
        if (alarmSound) alarmSound.play().catch(e => console.log("Audio play failed:", e));

        if (currentMode === 'focus') {
            sessionCount++;
            if (sessionCount % SESSIONS_UNTIL_LONG_BREAK === 0) {
                switchMode('long-break');
            } else {
                switchMode('short-break');
            }
        } else {
            switchMode('focus');
        }
        
        startTimer();
    };

    const startTimer = () => {
        if (isRunning) return;
        isRunning = true;
        startPauseBtn.textContent = 'PAUSE';

        timerInterval = setInterval(() => {
            if (timeLeft <= 0) {
                timeLeft = 0;
                updateDisplay();
                startNextSession();
            } else {
                timeLeft--;
                updateDisplay();
            }
        }, 1000);
    };

    const hardReset = () => {
        stopTimer();
        sessionCount = 0;
        switchMode('focus');
    };

    startPauseBtn.addEventListener('click', () => isRunning ? stopTimer() : startTimer());
    resetBtn.addEventListener('click', hardReset);

    modeButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (isRunning) {
                if (!confirm("A session is running. Are you sure you want to switch and reset?")) {
                    return;
                }
            }
            stopTimer();
            sessionCount = 0;
            const mode = button.id.replace('-btn', '');
            switchMode(mode);
        });
    });
    
    settingsToggle.addEventListener('click', () => settingsPanel.classList.toggle('open'));

    for (const key in inputs) {
        inputs[key].addEventListener('change', (e) => {
            let value = parseInt(e.target.value);
            if (!isNaN(value) && value > 0) {
                settings[key] = value;
                saveSettings();
                
                let modePrefix = currentMode.split('-')[0];
                if (key === modePrefix) {
                    stopTimer();
                    timeLeft = value * 60;
                    updateDisplay();
                }
            } else {
                e.target.value = settings[key];
            }
        });
    }

    loadSettings();
    updateDisplay();
});