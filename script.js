document.addEventListener("DOMContentLoaded", () => {
    progressBar();
    timelinePresent();
    certCarousel();
    sportsCarousel();
    darkMode();
    getWeather();
    blobBackground();

    // Example: change language on click
    document.querySelectorAll(".lang-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            loadLanguage(btn.dataset.lang);
        });
    });
});

function blobBackground() {
    const colors = [
        "#FBB6CE", "#BFDBFE", "#C6F6D5", "#FEF08A", "#D8B4FE",
        "#FF6B6B", "#4ECDC4", "#556270", "#C7F464", "#FF6F91",
        "#845EC2", "#FFC75F", "#008F7A", "#FF9671", "#2C73D2",
        "#F9F871", "#D65DB1", "#00C9A7", "#FFA500", "#A4DE02"
    ];
    const container = document.querySelector(".blobs-container");
    if (!container) return;

    const maxBlobs = 20;

    function createBlob() {
        const blob = document.createElement("div");
        blob.className = "blob";

        // Random color
        blob.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

        // Random position
        const size = 60 + Math.random() * 120;
        blob.style.width = `${size}px`;
        blob.style.height = `${size}px`;

        blob.style.top = `${Math.random() * (100 - (size / window.innerHeight) * 100)}%`;
        blob.style.left = `${Math.random() * (100 - (size / window.innerWidth) * 100)}%`;

        // Random animation duration and delay
        const duration = 15 + Math.random() * 15;
        blob.style.animationDuration = `${duration}s`;
        blob.style.animationDelay = `${Math.random() * 5}s`;

        container.appendChild(blob);

        // Fade in after appending
        setTimeout(() => blob.classList.add("fade-in"), 50);

        // Fade out and remove after lifespan
        setTimeout(() => {
            blob.classList.add("fade-out");
            blob.addEventListener("transitionend", () => blob.remove());
        }, (duration + Math.random() * 10) * 1000);
    }

    // Create new blobs every 2 seconds
    setInterval(() => {
        if (container.children.length < maxBlobs) createBlob();
    }, 2000);
}

// Run after DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    blobBackground();
});

function updateCountdowns() {
    const countdowns = document.querySelectorAll(".countdown");
    const now = new Date().getTime();

    countdowns.forEach(el => {
        const eventDate = new Date(el.getAttribute("data-date")).getTime();
        const diff = eventDate - now;

        if (diff > 0) {
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            el.textContent = `⏳ ${days}d ${hours}h ${minutes}m ${seconds}s left`;
        } else {
            el.textContent = "🎉 Event has started!";
        }
    });
}

function progressBar() {
    // progress
    const progressBar = document.getElementById("progress-bar");
    const sectionLinks = document.querySelectorAll(".relative.flex a");
    const sections = Array.from(sectionLinks).map(link => {
        const id = link.getAttribute("href").slice(1);
        return document.getElementById(id);
    });

    // Scroll progress update
    window.addEventListener("scroll", () => {
        const scrollTop = window.scrollY;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + "%";

        // Highlight the current section
        let current = sections[0];
        for (const sec of sections) {
            if (sec.offsetTop <= scrollTop + window.innerHeight / 3) {
                current = sec;
            }
        }
        sectionLinks.forEach(link => {
            const marker = link.querySelector("span.w-3");
            marker.classList.remove("bg-blue-600");
            marker.classList.add("bg-gray-600");
            if (link.getAttribute("href").slice(1) === current.id) {
                marker.classList.remove("bg-gray-600");
                marker.classList.add("bg-blue-600");
            }
        });
    });

    // Smooth scroll on click
    sectionLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const targetId = link.getAttribute("href").slice(1);
            const target = document.getElementById(targetId);
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 60, // adjust if you have sticky headers
                    behavior: "smooth"
                });
            }
        });
    });
}

function certCarousel() {
    // Cert Carousel functionality
    const carousel = document.getElementById('carousel');
    const leftArrow = document.getElementById('left-arrow');
    const rightArrow = document.getElementById('right-arrow');

    leftArrow.addEventListener('click', () => {
        carousel.scrollBy({ left: -260, behavior: 'smooth' });
    });
    rightArrow.addEventListener('click', () => {
        carousel.scrollBy({ left: 260, behavior: 'smooth' });
    });

    // Drag to scroll
    let isDown = false;
    let startX;
    let scrollLeft;

    carousel.addEventListener('mousedown', (e) => {
        isDown = true;
        carousel.classList.add('cursor-grabbing');
        startX = e.pageX - carousel.offsetLeft;
        scrollLeft = carousel.scrollLeft;
    });
    carousel.addEventListener('mouseleave', () => {
        isDown = false;
        carousel.classList.remove('cursor-grabbing');
    });
    carousel.addEventListener('mouseup', () => {
        isDown = false;
        carousel.classList.remove('cursor-grabbing');
    });
    carousel.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - carousel.offsetLeft;
        const walk = (x - startX) * 2; // scroll speed
        carousel.scrollLeft = scrollLeft - walk;
    });
}

function sportsCarousel() {
    // Sports Carousel functionality
    const sportsCarousel = document.getElementById('sports-carousel');
    const leftSports = document.getElementById('left-sports');
    const rightSports = document.getElementById('right-sports');

    leftSports.addEventListener('click', () => sportsCarousel.scrollBy({ left: -220, behavior: 'smooth' }));
    rightSports.addEventListener('click', () => sportsCarousel.scrollBy({ left: 220, behavior: 'smooth' }));

    // Drag to scroll
    let isDownSports = false;
    let startXSports;
    let scrollLeftSports;

    sportsCarousel.addEventListener('mousedown', e => {
        isDownSports = true;
        sportsCarousel.classList.add('cursor-grabbing');
        startXSports = e.pageX - sportsCarousel.offsetLeft;
        scrollLeftSports = sportsCarousel.scrollLeftSports;
    });
    sportsCarousel.addEventListener('mouseleave', () => { isDownSports = false; sportsCarousel.classList.remove('cursor-grabbing'); });
    sportsCarousel.addEventListener('mouseup', () => { isDownSports = false; sportsCarousel.classList.remove('cursor-grabbing'); });
    sportsCarousel.addEventListener('mousemove', e => {
        if (!isDownSports) return;
        e.preventDefault();
        const x = e.pageX - sportsCarousel.offsetLeft;
        const walk = (x - startXSports) * 2;
        sportsCarousel.scrollLeftSports = scrollLeftSports - walk;
    });
}

async function getWeather() {
    const url = "https://api.open-meteo.com/v1/forecast?latitude=55.6758&longitude=12.5683&current=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation,weather_code";
    const res = await fetch(url);
    const data = await res.json();

    const current = data.current;

    document.getElementById("weather-temp").textContent = `${current.temperature_2m}°C`;
    document.getElementById("weather-desc").textContent = `Humidity: ${current.relative_humidity_2m}%, Wind: ${current.wind_speed_10m} m/s`;
}

function darkMode() {
    const darkToggle = document.getElementById("dark-toggle");
    const darkThumb = document.getElementById("dark-toggle-thumb");

    // Load saved preference
    if (localStorage.getItem("dark-mode") === "true") {
        document.documentElement.classList.add("dark");
        darkThumb.classList.add("translate-x-6");
    }

    darkToggle.addEventListener("click", () => {
        document.documentElement.classList.toggle("dark");
        darkThumb.classList.toggle("translate-x-6");
        localStorage.setItem("dark-mode", document.documentElement.classList.contains("dark"));
    });
}

setInterval(updateCountdowns, 1000);
updateCountdowns(); // run immediately on load

function toggleFlip(card) {
    card.classList.toggle("flipped");
}

function timelinePresent() {
    // Get today's month and year
    const dateMarker = document.getElementById("current-date-marker");
    const today = new Date();
    const options = { year: "numeric", month: "long" }; // e.g., September 2025
    dateMarker.textContent = today.toLocaleDateString(undefined, options);
}

function loadLanguage(lang) {
    fetch(`lang/${lang}.json`)
        .then(res => res.json())
        .then(data => {
            const elements = [
                "name-title", "profile-title", "profile-summary", "skills-title",
                "timeline-title", "work-title", "education-title", "further-title",
                "volunteer-title", "languages-title", "interests-title", "sports-title", "weather-title"
            ];

            elements.forEach(id => {
                if (data[id]) { // only set if translation exists
                    document.getElementById(id).textContent = data[id];
                }
            });
        });
    console.log(`Language changed to: ${lang}`);
}