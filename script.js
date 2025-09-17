function blobBackground() {
    const colors = [
        "#FBB6CE", "#BFDBFE", "#C6F6D5", "#FEF08A", "#D8B4FE",
        "#F87171", "#34D399", "#60A5FA", "#FCD34D", "#A78BFA",
        "#F472B6", "#22D3EE", "#4ADE80", "#FACC15", "#C084FC",
        "#F59E0B", "#EC4899", "#3B82F6", "#10B981", "#EAB308"
    ];
    const container = document.createElement("div");
    container.className = "blobs-container fixed inset-0 -z-10 pointer-events-none";
    document.body.appendChild(container);

    const blobs = [];
    const maxBlobs = 10;
    const minSize = 60;
    const maxSize = 150;

    function random(min, max) { return Math.random() * (max - min) + min; }

    function createBlob() {
        const blob = document.createElement("div");
        blob.className = "blob absolute rounded-full opacity-0";
        const size = random(minSize, maxSize);
        blob.style.width = `${size}px`;
        blob.style.height = `${size}px`;
        blob.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

        // Random initial position
        blob.x = random(0, window.innerWidth - size);
        blob.y = random(0, window.innerHeight - size);

        // Random velocity
        blob.vx = random(-1.5, 1.5);
        blob.vy = random(-1.5, 1.5);

        // Lifespan
        blob.lifespan = random(8, 20);
        blob.age = 0;

        container.appendChild(blob);
        blobs.push(blob);

        // Fade in
        requestAnimationFrame(() => {
            blob.style.transition = "opacity 1.5s";
            blob.style.opacity = "0.15";
        });
    }

    function animate() {
        blobs.forEach((b, i) => {
            b.x += b.vx;
            b.y += b.vy;

            // Bounce off walls
            if (b.x < 0 || b.x + b.offsetWidth > window.innerWidth) b.vx *= -1;
            if (b.y < 0 || b.y + b.offsetHeight > window.innerHeight) b.vy *= -1;

            // Bounce off other blobs
            for (let j = i + 1; j < blobs.length; j++) {
                const o = blobs[j];
                const dx = (b.x + b.offsetWidth / 2) - (o.x + o.offsetWidth / 2);
                const dy = (b.y + b.offsetHeight / 2) - (o.y + o.offsetHeight / 2);
                const dist = Math.sqrt(dx * dx + dy * dy);
                const minDist = (b.offsetWidth + o.offsetWidth) / 2;
                if (dist < minDist && dist > 0) {
                    const angle = Math.atan2(dy, dx);
                    const overlap = minDist - dist;
                    b.x += Math.cos(angle) * (overlap / 2);
                    b.y += Math.sin(angle) * (overlap / 2);
                    o.x -= Math.cos(angle) * (overlap / 2);
                    o.y -= Math.sin(angle) * (overlap / 2);
                    // swap velocities slightly
                    const tempVx = b.vx; const tempVy = b.vy;
                    b.vx = o.vx; b.vy = o.vy;
                    o.vx = tempVx; o.vy = tempVy;
                }
            }

            b.style.transform = `translate(${b.x}px, ${b.y}px)`;

            // Age & fade out
            b.age += 0.016; // approx 60fps
            if (b.age > b.lifespan) {
                b.style.transition = "opacity 2s";
                b.style.opacity = 0;
                setTimeout(() => {
                    container.removeChild(b);
                    blobs.splice(blobs.indexOf(b), 1);
                }, 2000);
            }
        });

        requestAnimationFrame(animate);
    }

    // Generate new blobs over time
    setInterval(() => {
        if (blobs.length < maxBlobs) createBlob();
    }, 2000);

    animate();
}

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

    document.getElementById("weather-temp").textContent = `Copenhagen: ${current.temperature_2m}°C`;
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
    document.querySelectorAll(".timeline-entry").forEach(entry => {
        const popup = entry.querySelector(".timeline-popup");

        // Hover effect: give user a clue that it's clickable
        entry.addEventListener("mouseenter", () => {
            entry.classList.add("scale-110");
        });
        entry.addEventListener("mouseleave", () => {
            entry.classList.remove("scale-110");
        });

        // Click toggle popup
        entry.addEventListener("click", () => {
            const isVisible = popup.classList.contains("opacity-100");
            if (isVisible) {
                popup.classList.remove("opacity-100");
                popup.classList.add("opacity-0", "pointer-events-none");
            } else {
                popup.classList.remove("opacity-0", "pointer-events-none");
                popup.classList.add("opacity-100");
            }
        });
    });
});
setInterval(updateCountdowns, 1000);
updateCountdowns(); // run immediately on load

document.addEventListener("DOMContentLoaded", () => {
    const overlay = document.getElementById("cookie-overlay");
    const banner = document.getElementById("cookie-banner");
    const acceptBtn = document.getElementById("accept-cookies");
    const rejectBtn = document.getElementById("reject-cookies");

    function hideBanner() {
        overlay.style.display = "none";
        banner.style.display = "none";
    }

    // Check if user has already made a choice
    const cookieConsent = localStorage.getItem("cookieConsent");
    if (cookieConsent === "accepted" || cookieConsent === "rejected") {
        hideBanner();
    }

    acceptBtn.addEventListener("click", () => {
        localStorage.setItem("cookieConsent", "accepted");
        hideBanner();
        // Load Google Analytics or other tracking scripts here
    });

    rejectBtn.addEventListener("click", () => {
        localStorage.setItem("cookieConsent", "rejected");
        hideBanner();
    });
});

document.getElementById("accept-cookies").addEventListener("click", () => {
    // Hide banner
    document.getElementById("cookie-banner").style.display = "none";

    // Save consent in localStorage
    localStorage.setItem("analytics-consent", "true");


    // Load GA script dynamically
    const script = document.createElement("script");
    script.src = "https://www.googletagmanager.com/gtag/js?id=G-FJQNSE4GQC";
    script.async = true;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', 'G-FJQNSE4GQC', { 'anonymize_ip': true });
    gtag('event', 'click', {
        'event_category': 'Button',
        'event_label': 'Download Resume'
    });
    // alert('You have accepted analytics cookies. Your interactions will be tracked.');
});

// Optional: handle reject button
document.getElementById("reject-cookies").addEventListener("click", () => {
    document.getElementById("cookie-banner").style.display = "none";
    localStorage.setItem("analytics-consent", "false");
    // alert('You have rejected analytics cookies. No data will be collected.');
});

let lastScrollTop = 0;
let headerHidden = false;
const header = document.getElementById('main-header');
const delta = 5;
const scrollUpTolerance = 50;

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (Math.abs(scrollTop - lastScrollTop) <= delta) return;

    if (scrollTop > lastScrollTop && scrollTop > header.offsetHeight) {
        // Scroll down → hide
        header.style.top = `-${header.offsetHeight}px`;
        headerHidden = true;
    } else if (headerHidden && scrollTop < lastScrollTop - scrollUpTolerance) {
        // Scroll up → show
        header.style.top = '0';
        headerHidden = false;
    }

    lastScrollTop = scrollTop;
});

document.querySelectorAll('.flip-card').forEach(card => {
    const duration = 5 + Math.random() * 4; // 5s - 9s
    const initialZ = (Math.random() - 0.5) * 4; // -2deg to 2deg
    card.style.transform = `rotateZ(${initialZ}deg)`;
    card.style.animationDuration = `${duration}s`;
});