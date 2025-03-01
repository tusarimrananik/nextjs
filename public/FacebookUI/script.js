// function getCurrentTime() {
//     const date = new Date();
//     let hours = date.getHours();
//     const minutes = date.getMinutes();
//     const ampm = hours >= 12 ? 'PM' : 'AM';

//     // Convert 24-hour time to 12-hour time
//     hours = hours % 12;
//     hours = hours ? hours : 12; // if hour is 0, set it to 12
//     const minutesStr = minutes < 10 ? '0' + minutes : minutes; // add leading zero if needed

//     const currentTime = `${hours}:${minutesStr} ${ampm}`;
//     return currentTime;
// }

// function displayCurrentTime() {
//     const timeDisplay = document.getElementById("timeDisplay");
//     timeDisplay.textContent = getCurrentTime();
// }

// // Update time immediately and then every minute
// displayCurrentTime();
// setInterval(displayCurrentTime, 60000); // update every 60 seconds





// // document.querySelectorAll('.intro img').forEach(img => {
// //     const parentDiv = img.closest('div'); // Select the immediate parent div of the img
// //     if (parentDiv) {
// //         parentDiv.style.position = 'relative';

// //         const overlay = document.createElement('div');
// //         overlay.style.position = 'absolute';
// //         overlay.style.top = '0';
// //         overlay.style.left = '0';
// //         overlay.style.width = '100%';
// //         overlay.style.height = '100%';
// //         overlay.style.backgroundColor = 'rgba(128, 128, 128, 0.5)'; // Gray with 50% opacity
// //         overlay.style.pointerEvents = 'none';

// //         parentDiv.appendChild(overlay); // Append the overlay to the parent div
// //     }
// // });
