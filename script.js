document.addEventListener("DOMContentLoaded", () => {
    progressBar();
    timelinePresent();
    certCarousel();
    sportsCarousel();
    darkMode();
    weather();
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

function weather() {
    // Weather
    fetch("https://api.open-meteo.com/v1/forecast?latitude=55.6758&longitude=12.5683&current=temperature_2m,weathercode")
        .then(res => res.json())
        .then(data => {
            const temp = data.current.temperature_2m;
            const code = data.current.weathercode;
            document.getElementById("weather-temp").textContent = `${temp}°C`;
            document.getElementById("weather-desc").textContent = `Weather code: ${code}`;
        });
}

function darkMode() {
    // dark mode
    const toggle = document.getElementById("dark-toggle");
    const thumb = document.getElementById("dark-toggle-thumb");

    toggle.addEventListener("click", () => {
        // Toggle dark mode class on <html>
        document.documentElement.classList.toggle("dark");

        // Animate thumb
        if (document.documentElement.classList.contains("dark")) {
            thumb.classList.add("translate-x-6");
        } else {
            thumb.classList.remove("translate-x-6");
        }

        // Optional: Save preference to localStorage
        localStorage.setItem("theme", document.documentElement.classList.contains("dark") ? "dark" : "light");
    });

    // On page load: restore theme
    if (localStorage.getItem("theme") === "dark") {
        document.documentElement.classList.add("dark");
        thumb.classList.add("translate-x-6");
    }
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
