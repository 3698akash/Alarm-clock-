// Declaring variables:

const currentTime = document.querySelector (".current-time");
const setHours = document.querySelector (".hours");
const setMinutes = document.querySelector (".minutes");
const setSeconds = document.querySelector (".seconds");
const setAmPm = document.querySelector (".am-pm");
const setAlarmButton = document.querySelector ("#submitButton");
const alarmContainer = document.querySelector (".alarm-container");

// Adding hours, minutes and seconds in DropDown menu:

window.addEventListener("DOMContentLoaded", (event) => {
	dropDownMenu(1, 12, setHours);
	dropDownMenu(0, 59, setMinutes);
	dropDownMenu(0, 59, setSeconds);

	setInterval(getCurrentTime,1000);
	fetchAlarm();
});

// Adding event listener to set alarm button:

function dropDownMenu(start, end, element) {
	for (let i=start; i <= end; i++) {
		const dropDown = document.createElement("option");
		dropDown.value = 	i<10 ? "0" + i : i;
		dropDown.innerHTML = i<10 ? "0" + i : i;
		element.appendChild(dropDown);
	}
}

setAlarmButton.addEventListener("click", getInput);

// Getting current time:

function getCurrentTime(){
	let time = new Date();
	time = time.toLocaleTimeString();
	console.log(time);
	currentTime.innerHTML = time;
	return time;
}

// Getting alarm input from the user:

function getInput(e){
	e.preventDefault();

	const hourValue = setHours.value;
	const minuteValue = setMinutes.value;
	const secondValue = setSeconds.value;
	const amPmValue = setAmPm.value;

	const alarmTime = convertToTime(
		hourValue,
		minuteValue,
		secondValue,
		amPmValue,
		);

	setAlarm(alarmTime);
	console.log(alarmTime);
}

// Converting time to 24 hour format:

function convertToTime(hour,minute,second,amPm) {
	return `${parseInt(hour)}:${minute}:${second} ${amPm}`;
}

// Function to set alarm when current time matches the set alarm time:

function setAlarm(time, fetching = false) {
	const alarm = setInterval(() => {
		if (time == getCurrentTime()) {
			alert("Alarm Ringing");
		}
		console.log("Running");
	}, 500);
	addAlarmToDom(time, alarm);

	if (!fetching) {
		saveAlarm(time);
	}
}

// Alarm set by user displayed in HTML:

function addAlarmToDom(time, intervalId) {
	const alarm = document.createElement("div");
    alarm.classList.add("alarm");
	alarm.innerHTML = `
	<div>${time}
	<button class = "delete-alarm" data-id=${intervalId}>Delete</button></div>`;


	const deleteButton = alarm.querySelector(".delete-alarm");
	deleteButton.addEventListener("click", (event) => deleteAlarm(event, time, intervalId));

	alarmContainer.prepend(alarm);
}

// Check is alarm saved in local storage?

function checkAlarms() {
	let alarms = [];
	const isPresent = localStorage.getItem("alarms");
	if (isPresent) alarms = JSON.parse(isPresent);

	return alarms;
}

// Save alarm to local storage:

function saveAlarm(time) {
	const alarms = checkAlarms();
	alarms.push(time);
	localStorage.setItem("alarms", JSON.stringify(alarms));
}

// Fetching alarm from local storage:  

function fetchAlarm() {
	const alarms = checkAlarms();

	alarms.forEach((time) => {
		setAlarm(time, true);
	});

}

function deleteAlarm(event, time, intervalId) {
	const alarm = event.target.parentElement;
	clearInterval(intervalId);
	deleteAlarmFromLocalStorage(time);
	alarm.remove();
}

// Delete alarm from local storage:

function deleteAlarmFromLocalStorage(time) {
	const alarms = checkAlarms();

	const index = alarms.indexOf(time);
	alarms.splice(index, 1);
	localStorage.setItem("alarms", JSON.stringify(alarms));
}
