const timeRef = document.querySelector(".current-time");
const hourInput = document.getElementById("hour-input");
const minuteInput = document.getElementById("minute-input");
const activeAlarms = document.querySelector(".alarms-lists");
const setAlarm = document.getElementById("set");
const clearAllButton = document.querySelector(".clear");
const alarmSound = new Audio("./assets/alarm.mp3");

let alarmIndex = 0;
let alarmsArray = [];

// Helper function to append a leading zero to single-digit values
const appendZero = (value) => (value < 10 ? "0" + value : value);

// Function to display the current time and trigger alarms
const displayTime = () => {
    const date = new Date();
    const currentTime = date.toLocaleTimeString("en-US", { hour12: false });
    timeRef.textContent = currentTime;

    // Check if it's time to trigger alarms
    const currentTimeFormatted = currentTime.slice(0, 5);
    alarmsArray.forEach((alarm) => {
        if (alarm.isActive && alarm.time === currentTimeFormatted) {
            alarmSound.play();
            createStopButton(alarm);
        }
    });
};

// Function to create a new alarm
const createAlarm = (hour, minute) => {
    alarmIndex += 1;

    const alarmObj = {
        id: `${alarmIndex}_${hour}_${minute}`,
        time: `${appendZero(hour)}:${appendZero(minute)}`,
        isActive: false
    };

    alarmsArray.push(alarmObj);
    const alarmDiv = document.createElement("div");
    alarmDiv.className = "alarm";
    alarmDiv.dataset.id = alarmObj.id;
    alarmDiv.innerHTML = `<span>${alarmObj.time}</span>`;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.addEventListener("change", () => toggleAlarm(alarmObj));
    alarmDiv.appendChild(checkbox);

    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
    deleteButton.className = "deleteButton";
    deleteButton.addEventListener("click", () => deleteAlarm(alarmObj));
    alarmDiv.appendChild(deleteButton);

    activeAlarms.appendChild(alarmDiv);
};

// Function to create and append stop button dynamically
const createStopButton = (alarm) => {
    const alarmDiv = document.querySelector(`[data-id="${alarm.id}"]`);
    if (alarmDiv) {
        // Check if a stop button already exists in the alarmDiv
        if (!alarmDiv.querySelector('.stopButton')) {
            const stopButton = document.createElement("button");
            stopButton.className = "stopButton";
            stopButton.innerHTML = '<i class="fa solid fa-circle-stop"></i>';
            stopButton.style.color = "#511f1f";
            stopButton.addEventListener("click", () => stopAlarm(alarm, stopButton));
            alarmDiv.appendChild(stopButton);
        }
    }
};


// Function to toggle an alarm
const toggleAlarm = (alarm) => {
    const currentTime = new Date().toLocaleTimeString("en-US", { hour12: false }).slice(0, 5);
    const alarmDiv = document.querySelector(`[data-id="${alarm.id}"]`);

    if (alarm.isActive) {
        // La alarma estaba activa y se está desactivando
        alarm.isActive = false;
        if (alarmDiv) {
            const stopButton = alarmDiv.querySelector('.stopButton');
            if (stopButton) {
                stopButton.remove(); // Eliminar el botón de detener si existe
            }
            alarmSound.pause(); // Pausar el sonido de la alarma si está sonando
        }
    } else {
        // La alarma estaba inactiva y se está activando
        alarm.isActive = true;
        if (alarm.time === currentTime) {
            // Si la alarma coincide con la hora actual, reproducir sonido de alarma
            alarmSound.play();
            if (alarmDiv) {
                createStopButton(alarm); // Crear y mostrar el botón de detener
            } 
        }
    }
    alarm.isActive = false;
    // Actualizar la interfaz de usuario de la alarma
    updateAlarmUI(alarm, currentTime);
};


// Function to update the alarm UI
const updateAlarmUI = (alarm, currentTime) => {
    const alarmDiv = document.querySelector(`[data-id="${alarm.id}"]`);
    if (alarmDiv) {
        if (alarm.isActive && alarm.time === currentTime) {
            alarmSound.play();
            createStopButton(alarm);
        } else {
            alarmSound.pause();
            const stopButton = alarmDiv.querySelector('.stop-button');
            if (stopButton) {
                stopButton.remove();
            }
        }
    } else {
        console.error(`Element with data-id="${alarm.id}" not found.`);
    }
};

// Function to stop an alarm
const stopAlarm = (alarm, stopButton) => {
    alarmSound.pause();
    alarm.isActive = false;
    stopButton.remove();
};

// Function to delete an alarm
const deleteAlarm = (alarm) => {
    const index = alarmsArray.findIndex((a) => a.id === alarm.id);
    if (index !== -1) {
        alarmsArray.splice(index, 1);
        const alarmDiv = document.querySelector(`[data-id="${alarm.id}"]`);
        if (alarmDiv) {
            alarmDiv.remove();
        }
    }
};

// Event listener for clearing all alarms
clearAllButton.addEventListener("click", () => {
    alarmsArray = [];
    activeAlarms.innerHTML = "";
});

// Event listener for setting new alarms
setAlarm.addEventListener("click", () => {
    let hour = parseInt(hourInput.value) || 0;
    let minute = parseInt(minuteInput.value) || 0;

    if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
        alert("Invalid hour or minute. Please enter values within the valid range!");
    } else {
        const newAlarmTime = `${appendZero(hour)}:${appendZero(minute)}`;
        if (!alarmsArray.some((alarm) => alarm.time === newAlarmTime)) {
            createAlarm(hour, minute);
        }
    }

    hourInput.value = "";
    minuteInput.value = "";
});

// Initialize the display and update every second
window.onload = () => {
    setInterval(displayTime, 1000);
    hourInput.value = "";
    minuteInput.value = "";
};
