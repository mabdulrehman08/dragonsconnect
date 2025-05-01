// Dark Mode Logic
var settingsmenu = document.querySelector(".settings-menu");
var darkBtn = document.getElementById("dark-btn");

if (localStorage.getItem("dark-mode") === "enabled") {
    document.body.classList.add("dark-mode");
    darkBtn.classList.add("dark-btn-on");
}

function settingsMenuToggle() {
    settingsmenu.classList.toggle("settings-menu-height");
}

darkBtn.onclick = function () {
    const isDarkMode = document.body.classList.toggle("dark-mode");
    darkBtn.classList.toggle("dark-btn-on", isDarkMode);
    localStorage.setItem("dark-mode", isDarkMode ? "enabled" : "disabled");
}

// Function to fetch events from your API (real or mocked)
async function fetchEvents() {
    try {
        // Replace this URL with your actual API endpoint
        const response = await fetch('http://localhost:3000/api/events');
        const events = await response.json();

        // Call function to update the event list on the page
        updateEventList(events);

    } catch (error) {
        console.error("Error fetching events:", error);

        // In case the API fails, you can fallback to mock events
        const mockEvents = [
            {
                date: "2025-05-10T10:00:00Z",
                title: "DragonLink Info Session",
                description: "Learn about DragonLink and how to use it.",
                link: "https://example.com/event/dragonlink-info"
            },
            {
                date: "2025-05-12T14:00:00Z",
                title: "Drexel Campus Tour",
                description: "Explore Drexel's campus with a guided tour.",
                link: "https://example.com/event/drexel-campus-tour"
            }
        ];
        updateEventList(mockEvents);
    }
}

// Function to dynamically add events to the HTML
function updateEventList(events) {
    const eventList = document.getElementById('event-list');
    eventList.innerHTML = ''; // Clear any previous content

    events.forEach(event => {
        const eventDiv = document.createElement('div');
        eventDiv.classList.add('event'); // Add class for styling

        // Insert event details into the div
        eventDiv.innerHTML = `
            <div class="left-event">
                <h3>${new Date(event.date).getDate()}</h3>
                <span>${new Date(event.date).toLocaleString('en-US', { month: 'long' })}</span>
            </div>
            <div class="right-event">
                <h4>${event.title}</h4>
                <p>${event.description}</p>
                <a href="${event.link}" target="_blank">More Info</a>
            </div>
        `;

        // Append event div to the event list
        eventList.appendChild(eventDiv);
    });
}

// Call the fetchEvents function when the page loads
document.addEventListener('DOMContentLoaded', fetchEvents);

// Optionally, set up polling to refresh events every 5 minutes
setInterval(fetchEvents, 300000); // Refresh events every 5 minutes (300000ms)
