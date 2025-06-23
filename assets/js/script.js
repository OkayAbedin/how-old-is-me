document.addEventListener('DOMContentLoaded', () => {
    console.log('Page loaded, starting URL processing...');
    
    // URL-based date sharing functionality
    const parseUrlForDate = () => {
        let path = window.location.pathname;
        let pathParts = path.split('/').filter(part => part.length > 0);
        
        // Also check hash for compatibility with servers that don't support client-side routing
        if (window.location.hash && window.location.hash.startsWith('#/')) {
            const hashPath = window.location.hash.substring(2); // Remove #/
            pathParts = hashPath.split('/').filter(part => part.length > 0);
        }
          // Look for date pattern MM-DD-YYYY (for URLs)
        const datePattern = /^(\d{1,2})-(\d{1,2})-(\d{4})$/;
        
        for (let i = 0; i < pathParts.length; i++) {
            const part = pathParts[i];
            const match = part.match(datePattern);
            if (match) {
                const [, month, day, year] = match;
                  // Validate the date (MM-DD-YYYY format from URL)
                const date = new Date(year, month - 1, day);
                if (date.getFullYear() == year && 
                    date.getMonth() == month - 1 && 
                    date.getDate() == day &&
                    date <= new Date()) { // Must be in the past
                    
                    // Check if there's a name in the next part
                    let name = null;
                    if (i + 1 < pathParts.length) {
                        const namePart = pathParts[i + 1];
                        // Decode URL encoding and validate name (letters, spaces, hyphens, apostrophes)
                        const decodedName = decodeURIComponent(namePart);
                        if (/^[a-zA-Z\s\-'\.]+$/.test(decodedName) && decodedName.length <= 50) {
                            name = decodedName;
                        }
                    }
                      return {
                        day: parseInt(day),
                        month: parseInt(month),
                        year: parseInt(year),
                        name: name,
                        dateString: `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
                    };
                }
            }
        }
        return null;
    };    const generateShareableUrl = (birthdate, name = null) => {
        if (!birthdate) return window.location.origin + window.location.pathname;
        
        const day = birthdate.getDate().toString().padStart(2, '0');
        const month = (birthdate.getMonth() + 1).toString().padStart(2, '0');
        const year = birthdate.getFullYear();
        
        const baseUrl = window.location.origin;
        let basePath = window.location.pathname.replace(/\/\d{1,2}-\d{1,2}-\d{4}(\/[^\/]*)?$/, '');
        
        // Ensure basePath doesn't end with a slash to avoid double slashes
        basePath = basePath.replace(/\/$/, '');
          // Use MM-DD-YYYY format for URLs
        let urlPath = `${basePath}/${month}-${day}-${year}`;
        
        // Add name if provided
        if (name && name.trim()) {
            const cleanName = name.trim().replace(/[^a-zA-Z\s\-'\.]/g, '');
            if (cleanName) {
                urlPath += `/${encodeURIComponent(cleanName)}`;
            }
        }
        
        return `${baseUrl}${urlPath}`;
    };

    // Alternative URL generator for hash-based routing (fallback)
    const generateHashUrl = (birthdate, name = null) => {
        if (!birthdate) return window.location.origin + window.location.pathname;
        
        const day = birthdate.getDate().toString().padStart(2, '0');
        const month = (birthdate.getMonth() + 1).toString().padStart(2, '0');
        const year = birthdate.getFullYear();
        
        const baseUrl = window.location.origin;
        let basePath = window.location.pathname.replace(/\/\d{1,2}-\d{1,2}-\d{4}(\/[^\/]*)?$/, '');
        basePath = basePath.replace(/\/$/, '');
          let hashPath = `${month}-${day}-${year}`;
        
        if (name && name.trim()) {
            const cleanName = name.trim().replace(/[^a-zA-Z\s\-'\.]/g, '');
            if (cleanName) {
                hashPath += `/${encodeURIComponent(cleanName)}`;
            }
        }
        
        return `${baseUrl}${basePath}#/${hashPath}`;
    };    const updateUrlWithDate = (birthdate, name = null) => {
        // For local development, use hash-based URLs
        // For production with proper server config, use clean URLs
        const isLocalHost = window.location.hostname === 'localhost' || 
                           window.location.hostname === '127.0.0.1' || 
                           window.location.protocol === 'file:';
        
        let newUrl;
        if (isLocalHost) {
            newUrl = generateHashUrl(birthdate, name);
            // Update hash without page reload
            const day = birthdate.getDate().toString().padStart(2, '0');
            const month = (birthdate.getMonth() + 1).toString().padStart(2, '0');
            const year = birthdate.getFullYear();            let hashPath = `${month}-${day}-${year}`;
            if (name && name.trim()) {
                const cleanName = name.trim().replace(/[^a-zA-Z\s\-'\.]/g, '');
                if (cleanName) {
                    hashPath += `/${encodeURIComponent(cleanName)}`;
                }
            }
            window.location.hash = `#/${hashPath}`;
        } else {
            newUrl = generateShareableUrl(birthdate, name);
            // Update URL without reloading the page
            window.history.pushState({}, '', newUrl);
        }
        
        // Update shareable URL display
        shareableUrlInput.value = newUrl;
        shareableUrlSection.hidden = false;
        
        // Show notification that URL has been updated
        showUrlNotification(newUrl);
    };

    const showUrlNotification = (url) => {
        // Remove existing notification if any
        const existing = document.querySelector('.url-notification');
        if (existing) {
            existing.remove();
        }

        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'url-notification';
        notification.innerHTML = `
            <div>✨ Shareable URL updated!</div>
            <div class="url-text">${url}</div>
        `;

        document.body.appendChild(notification);

        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // Hide notification after 4 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 4000);
    };    // DOM Elements
    const form = document.getElementById('ageForm');
    const resultDiv = document.getElementById('result');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const shareBtn = document.getElementById('shareBtn');
    const themeToggle = document.getElementById('themeToggle');
    const shareableUrlSection = document.getElementById('shareableUrlSection');
    const shareableUrlInput = document.getElementById('shareableUrl');
    const copyUrlBtn = document.getElementById('copyUrlBtn');

    // Default values & constants
    const LIFE_EXPECTANCY = {
        global: 72.6,
        america: 78.5,
        europe: 81.3,
        asia: 73.8,
        africa: 63.4,
        oceania: 82.1
    };
    
    // API Cache
    const apiCache = {
        events: {},
        births: {}
    };
      // Check for date in URL and auto-populate form
    const urlDate = parseUrlForDate();
    if (urlDate) {
        console.log('URL date parsed:', urlDate);
        const birthdateInput = document.getElementById('birthdate');
        const nameInput = document.getElementById('name');
        
        if (birthdateInput && nameInput) {
            birthdateInput.value = urlDate.dateString;
            if (urlDate.name) {
                nameInput.value = urlDate.name;
            }
            console.log('Form populated, submitting...');
            // Auto-submit the form to show results immediately
            setTimeout(() => {
                if (form) {
                    try {
                        console.log('About to submit form with values:', {
                            birthdate: birthdateInput.value,
                            name: nameInput.value
                        });
                        form.dispatchEvent(new Event('submit'));
                        console.log('Form submitted successfully');
                    } catch (error) {
                        console.error('Error submitting form:', error);
                    }
                } else {
                    console.error('Form not found!');
                }
            }, 200); // Slightly longer delay to ensure DOM is ready
        } else {
            console.error('Form inputs not found!', {
                birthdate: !!birthdateInput,
                name: !!nameInput
            });
        }
    } else {
        console.log('No valid date found in URL:', window.location.pathname, window.location.hash);
    }

    // Also handle when hash is set by the head script (for immediate processing)
    setTimeout(() => {
        const urlDateDelayed = parseUrlForDate();
        if (urlDateDelayed && !urlDate) {
            console.log('Delayed URL date check found date:', urlDateDelayed);
            const birthdateInput = document.getElementById('birthdate');
            const nameInput = document.getElementById('name');
            
            if (birthdateInput && nameInput) {
                birthdateInput.value = urlDateDelayed.dateString;
                if (urlDateDelayed.name) {
                    nameInput.value = urlDateDelayed.name;
                }
                console.log('Form populated from delayed check, submitting...');
                setTimeout(() => {
                    if (form) {
                        form.dispatchEvent(new Event('submit'));
                    }
                }, 100);
            }
        }
    }, 300); // Check again after head script has had time to set hash// Handle browser back/forward navigation
    window.addEventListener('popstate', () => {
        const urlDate = parseUrlForDate();
        if (urlDate) {
            document.getElementById('birthdate').value = urlDate.dateString;
            if (urlDate.name) {
                document.getElementById('name').value = urlDate.name;
            } else {
                document.getElementById('name').value = '';
            }
            setTimeout(() => {
                form.dispatchEvent(new Event('submit'));
            }, 100);
        } else {
            // Clear the form if no date in URL
            document.getElementById('birthdate').value = '';
            document.getElementById('name').value = '';
            resultDiv.innerHTML = '';
            shareableUrlSection.hidden = true;
        }
    });

    // Handle hash changes for hash-based routing
    window.addEventListener('hashchange', () => {
        const urlDate = parseUrlForDate();
        if (urlDate) {
            document.getElementById('birthdate').value = urlDate.dateString;
            if (urlDate.name) {
                document.getElementById('name').value = urlDate.name;
            } else {
                document.getElementById('name').value = '';
            }
            setTimeout(() => {
                form.dispatchEvent(new Event('submit'));
            }, 100);
        }
    });

    // Theme toggle functionality
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Update icon
        themeToggle.innerHTML = newTheme === 'dark' 
            ? '<i class="fas fa-moon"></i>' 
            : '<i class="fas fa-sun"></i>';
    });
    // Set initial theme from localStorage or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.setAttribute('data-theme', savedTheme);
    themeToggle.innerHTML = savedTheme === 'dark' 
        ? '<i class="fas fa-moon"></i>' 
        : '<i class="fas fa-sun"></i>';

    // Tab switching functionality
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.hidden = true);
            button.classList.add('active');
            document.getElementById(`${button.dataset.tab}Tab`).hidden = false;
        });
    });    // Get zodiac sign based on month and day
    const getZodiacSign = (month, day) => {
        if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) {
            return "Aquarius";
        } else if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) {
            return "Pisces";
        } else if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) {
            return "Aries";
        } else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) {
            return "Taurus";
        } else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) {
            return "Gemini";
        } else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) {
            return "Cancer";
        } else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) {
            return "Leo";
        } else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) {
            return "Virgo";
        } else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) {
            return "Libra";
        } else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) {
            return "Scorpio";
        } else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) {
            return "Sagittarius";
        } else {
            return "Capricorn";
        }
    };
    
    // Zodiac sign descriptions
    const getZodiacDescription = (sign) => {
        const descriptions = {
            "Aries": "Energetic, confident, and passionate. Aries are natural leaders who embrace challenges with enthusiasm.",
            "Taurus": "Reliable, patient, and practical. Taurus values stability and enjoys life's pleasures.",
            "Gemini": "Curious, adaptable, and communicative. Gemini are quick-witted and love to share ideas.",
            "Cancer": "Intuitive, emotional, and protective. Cancer are deeply connected to home and family.",
            "Leo": "Creative, passionate, and generous. Leo loves to be in the spotlight and has natural charisma.",
            "Virgo": "Analytical, practical, and methodical. Virgo pays attention to the smallest details.",
            "Libra": "Diplomatic, fair-minded, and social. Libra seeks harmony and values relationships.",
            "Scorpio": "Passionate, resourceful, and brave. Scorpio is determined and decisive.",
            "Sagittarius": "Optimistic, freedom-loving, and philosophical. Sagittarius loves to explore and seek knowledge.",
            "Capricorn": "Disciplined, responsible, and self-controlled. Capricorn is practical and values tradition.",
            "Aquarius": "Progressive, original, and independent. Aquarius values intellectual thought and humanitarian causes.",
            "Pisces": "Compassionate, artistic, and intuitive. Pisces are deeply connected to their emotions and the emotions of others."
        };
        
        return descriptions[sign] || "No description available";
    };// Moon phase calculation
    const getMoonPhase = (date) => {
        const lunarCycle = 29.53;
        // Julian date conversion
        const unixTime = date.getTime() / 1000;
        const julianDate = unixTime / 86400 + 2440587.5;
        // Days since new moon on Jan 6, 2000
        const daysSinceNewMoon = julianDate - 2451550.1;
        // Calculate current position in lunar cycle
        const position = (daysSinceNewMoon % lunarCycle) / lunarCycle;
        
        // Determine moon phase based on position in cycle
        if (position < 0.025) return "New Moon";
        if (position < 0.225) return "Waxing Crescent";
        if (position < 0.275) return "First Quarter";
        if (position < 0.475) return "Waxing Gibbous";
        if (position < 0.525) return "Full Moon";
        if (position < 0.725) return "Waning Gibbous";
        if (position < 0.775) return "Last Quarter";
        if (position < 0.975) return "Waning Crescent";
        return "New Moon";
    };

    // Next birthday calculation
    const getNextBirthday = (birthdate) => {
        const today = new Date();
        let nextBirthday = new Date(today.getFullYear(), 
                                  birthdate.getMonth(), 
                                  birthdate.getDate());
        
        if (nextBirthday < today) {
            nextBirthday.setFullYear(today.getFullYear() + 1);
        }
        
        const diff = nextBirthday - today;
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    };

    // Time unit conversions
    const calculateTimeUnits = (birthdate) => {
        const now = new Date();
        const diff = now - birthdate;
        return {
            years: Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25)),
            months: Math.floor(diff / (1000 * 60 * 60 * 24 * 30.44)),
            weeks: Math.floor(diff / (1000 * 60 * 60 * 24 * 7)),
            days: Math.floor(diff / (1000 * 60 * 60 * 24)),
            hours: Math.floor(diff / (1000 * 60 * 60)),
            minutes: Math.floor(diff / (1000 * 60)),
            seconds: Math.floor(diff / 1000)
        };
    };

    // Life expectancy calculation
    const calculateLifeExpectancy = (birthdate, region) => {
        const timeUnits = calculateTimeUnits(birthdate);
        const lifeExpectancy = LIFE_EXPECTANCY[region] || LIFE_EXPECTANCY.global;
        const agePercentage = (timeUnits.years / lifeExpectancy) * 100;
        const yearsLeft = lifeExpectancy - timeUnits.years;
        
        return {
            percentage: Math.min(agePercentage, 100).toFixed(1),
            yearsLeft: Math.max(yearsLeft, 0).toFixed(1),
            totalExpectancy: lifeExpectancy
        };
    };

    // Life statistics calculation
    const calculateLifeStats = (timeUnits) => {
        // Average sleep hours per day: 8 hours
        const sleepHours = Math.floor(timeUnits.days * 8);
        // Average heart beats per minute: 70 bpm
        const heartbeats = Math.floor(timeUnits.minutes * 70);
        // Average breaths per minute: 16 breaths
        const breaths = Math.floor(timeUnits.minutes * 16);
        
        return { sleepHours, heartbeats, breaths };
    };

    // Fetch historical events for birth year
    const fetchHistoricalEvents = async (year) => {
        if (apiCache.events[year]) {
            return apiCache.events[year];
        }
        try {
            const response = await fetch(`https://byabbe.se/on-this-day/${new Date().getMonth() + 1}/${new Date().getDate()}/events.json`);
            if (!response.ok) throw new Error('Failed to fetch historical events');
            
            const data = await response.json();
            const events = data.events.filter(event => event.year == year || Math.abs(event.year - year) < 5);
            apiCache.events[year] = events;
            return events;
        } catch (error) {
            console.error('Error fetching historical events:', error);
            return [];
        }
    };

    // Fetch famous people born on same day
    const fetchFamousBirthdays = async (month, day) => {
        const cacheKey = `${month}-${day}`;
        if (apiCache.births[cacheKey]) {
            return apiCache.births[cacheKey];
        }
        try {
            const response = await fetch(`https://byabbe.se/on-this-day/${month}/${day}/births.json`);
            if (!response.ok) throw new Error('Failed to fetch celebrity birthdays');
            
            const data = await response.json();
            const births = data.births.slice(0, 5); // Return 5 famous people
            apiCache.births[cacheKey] = births;
            return births;
        } catch (error) {
            console.error('Error fetching celebrity birthdays:', error);
            return [];
        }
    };

    // Create age visualization chart
    const createAgeVisualization = (timeUnits) => {
        const ctx = document.getElementById('ageVisual').getContext('2d');
        
        // Clear previous chart if exists
        if (window.ageChart) {
            window.ageChart.destroy();
        }
        
        window.ageChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Years', 'Months (remainder)', 'Days (remainder)'],
                datasets: [{
                    data: [
                        timeUnits.years,
                        Math.floor((timeUnits.months % 12)),
                        Math.floor((timeUnits.days % 30))
                    ],
                    backgroundColor: [
                        '#64FFDA',
                        '#FFCB6B',
                        '#FF5370'
                    ],
                    borderWidth: 1,
                    borderColor: 'rgba(255, 255, 255, 0.1)'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: getComputedStyle(document.body).getPropertyValue('--text-primary')
                        }
                    },
                    title: {
                        display: true,
                        text: 'Your Age Breakdown',
                        color: getComputedStyle(document.body).getPropertyValue('--text-primary')
                    }
                }
            }
        });
    };    // Create secondary visualization for life percentage
    const createLifePercentageChart = (percentage) => {
        const ctx = document.getElementById('lifePercentageChart').getContext('2d');
        
        // Clear previous chart if exists
        if (window.lifePercentageChart) {
            window.lifePercentageChart.destroy();
        }
        
        window.lifePercentageChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Life Lived', 'Estimated Remaining'],
                datasets: [{
                    data: [
                        parseFloat(percentage),
                        Math.max(0, 100 - parseFloat(percentage))
                    ],
                    backgroundColor: [
                        '#FF6B3D',
                        'rgba(200, 200, 200, 0.3)'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                cutout: '75%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: getComputedStyle(document.body).getPropertyValue('--text-primary')
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.label}: ${context.raw.toFixed(1)}%`;
                            }
                        }
                    }
                }
            }
        });
    };    // Real-time age counter
    const startRealTimeCounter = (birthdate) => {
        // Clear previous interval if exists
        if (window.ageCounterInterval) {
            clearInterval(window.ageCounterInterval);
            window.ageCounterInterval = null;
        }
        
        const counterElement = document.getElementById('realTimeCounter');
        if (!counterElement) return;
        
        const updateCounter = () => {
            try {
                const now = new Date();
                const diff = now - birthdate;
                
                const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
                const months = Math.floor((diff % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24 * 30.44));
                const days = Math.floor((diff % (1000 * 60 * 60 * 24 * 30.44)) / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);
                
                counterElement.innerHTML = `
                    <div class="counter-units">
                        <div class="counter-unit">${years}<span>years</span></div>
                        <div class="counter-unit">${months}<span>months</span></div>
                        <div class="counter-unit">${days}<span>days</span></div>
                        <div class="counter-unit">${hours}<span>hours</span></div>
                        <div class="counter-unit">${minutes}<span>minutes</span></div>
                        <div class="counter-unit">${seconds}<span>seconds</span></div>
                    </div>
                `;
            } catch (error) {
                console.error('Error updating real-time counter:', error);
                // If there's an error, stop the interval to prevent continuous errors
                if (window.ageCounterInterval) {
                    clearInterval(window.ageCounterInterval);
                    window.ageCounterInterval = null;
                }
            }
        };
        
        // Update immediately then set interval
        updateCounter();
        window.ageCounterInterval = setInterval(updateCounter, 1000);
    };

    // Historical age comparisons
    const getHistoricalComparisons = (age) => {
        const comparisons = [
            { age: 14, event: "Mozart had already composed several symphonies" },
            { age: 17, event: "Malala Yousafzai won the Nobel Peace Prize" },
            { age: 20, event: "Bill Gates founded Microsoft" },
            { age: 23, event: "Lionel Messi won his first Ballon d'Or" },
            { age: 25, event: "Mark Zuckerberg became a billionaire" },
            { age: 26, event: "Albert Einstein published his Theory of Relativity" },
            { age: 30, event: "J.K. Rowling began writing the Harry Potter series" },
            { age: 35, event: "Marie Curie discovered radium and polonium" },
            { age: 42, event: "Neil Armstrong walked on the moon" },
            { age: 44, event: "Steve Jobs introduced the first iPhone" },
            { age: 50, event: "Morgan Freeman got his big break in 'Driving Miss Daisy'" },
            { age: 52, event: "Ray Kroc started expanding McDonald's" },
            { age: 65, event: "Colonel Sanders founded KFC" },
            { age: 75, event: "Nelson Mandela became President of South Africa" },
            { age: 80, event: "Grandma Moses began her painting career" },
            { age: 100, event: "Fauja Singh became the first centenarian to complete a marathon" }
        ];
        
        // Find achievements at your current age or below
        const current = comparisons.filter(comp => comp.age <= age).slice(-3);
        
        // Find achievements you might reach in the future
        const future = comparisons.filter(comp => comp.age > age).slice(0, 3);
        
        return { current, future };
    };

    // Generate life timeline
    const generateLifeTimeline = (birthYear, currentAge) => {
        const milestones = [];
        const currentYear = new Date().getFullYear();
        
        // Add birth
        milestones.push({
            age: 0,
            year: birthYear,
            event: "You were born",
            past: true
        });
        
        // Common life milestones
        const commonMilestones = [
            { age: 5, event: "Started school" },
            { age: 13, event: "Became a teenager" },
            { age: 18, event: "Graduated high school / Became an adult" },
            { age: 21, event: "Reached drinking age in many countries" },
            { age: 22, event: "Graduated college (typical age)" },
            { age: 30, event: "Entered your thirties" },
            { age: 40, event: "Reached middle age" },
            { age: 50, event: "Half a century" },
            { age: 65, event: "Retirement age in many countries" },
            { age: 80, event: "Became an octogenarian" },
            { age: 90, event: "Reached your nineties" },
            { age: 100, event: "Became a centenarian" }
        ];
        
        // Add common milestones
        commonMilestones.forEach(milestone => {
            milestones.push({
                age: milestone.age,
                year: birthYear + milestone.age,
                event: milestone.event,
                past: milestone.age <= currentAge
            });
        });
        
        // Sort by age
        return milestones.sort((a, b) => a.age - b.age);
    };    // Form submission handler
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const birthdate = new Date(document.getElementById('birthdate').value);
        const today = new Date();
        const name = document.getElementById('name').value || 'You';
        
        if (birthdate > today) {
            // Add subtle validation feedback
            const birthdateInput = document.getElementById('birthdate');
            birthdateInput.classList.add('invalid-input');
            
            // Clear the result and show a friendly message
            resultDiv.innerHTML = `
                <div class="result-box error-message">
                    <p>Please select a date in the past. We can't calculate your age if you're not born yet! 😊</p>
                </div>
            `;
            
            // Remove the error styling after 3 seconds
            setTimeout(() => {
                birthdateInput.classList.remove('invalid-input');
            }, 3000);
            
            return;        }

        // Update URL with the entered date and name
        const enteredName = document.getElementById('name').value;
        updateUrlWithDate(birthdate, enteredName);

        try {
            // Calculate basic age
            let years = today.getFullYear() - birthdate.getFullYear();
            let months = today.getMonth() - birthdate.getMonth();
            let days = today.getDate() - birthdate.getDate();

            if (days < 0) {
                months--;
                days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
            }
            if (months < 0) {
                years--;
                months += 12;
            }        
            
            // Calculate additional information
            const timeUnits = calculateTimeUnits(birthdate);
            const zodiacSign = getZodiacSign(birthdate.getMonth() + 1, birthdate.getDate());
            const zodiacDescription = getZodiacDescription(zodiacSign);
            const dayOfWeek = birthdate.toLocaleString('en-us', { weekday: 'long' });
            const daysUntilBirthday = getNextBirthday(birthdate);
            const moonPhase = getMoonPhase(birthdate);
            const lifeExpectancy = calculateLifeExpectancy(birthdate, 'global');
            const lifeStats = calculateLifeStats(timeUnits);
            const ageComparisons = getHistoricalComparisons(timeUnits.years);
            const lifeTimeline = generateLifeTimeline(birthdate.getFullYear(), timeUnits.years);
            
            // Fetch historical events and famous birthdays
            const [historicalEvents, famousBirthdays] = await Promise.all([
                fetchHistoricalEvents(birthdate.getFullYear()),
                fetchFamousBirthdays(birthdate.getMonth() + 1, birthdate.getDate())
            ]);
            
            // Update UI - Basic Tab
            document.getElementById('basicTab').innerHTML = `
                <div class="result-box">
                    <h3>${name}'s Age</h3>
                    <p class="age-text">${years} years, ${months} months, ${days} days</p>
                    <p>Born on ${birthdate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <div class="real-time-counter" id="realTimeCounter"></div>
                    <p class="counter-label">Your age is increasing in real-time!</p>
                </div>
            `;
            
            // Start real-time counter
            startRealTimeCounter(birthdate);
            
            // Update UI - Detailed Tab
            document.getElementById('detailedTab').innerHTML = `
                <div class="time-units">
                    <h3>Your age in different units</h3>
                    <p>${timeUnits.years.toLocaleString()} years, ${months} months, ${days} days</p>
                    <p>${timeUnits.months.toLocaleString()} months</p>
                    <p>${timeUnits.weeks.toLocaleString()} weeks</p>
                    <p>${timeUnits.days.toLocaleString()} days</p>
                    <p>${timeUnits.hours.toLocaleString()} hours</p>
                    <p>${timeUnits.minutes.toLocaleString()} minutes</p>
                    <p>${timeUnits.seconds.toLocaleString()} seconds</p>
                </div>
                <div class="age-visualization">
                    <canvas id="ageVisual" width="300" height="200"></canvas>
                </div>
                <div class="age-comparisons">
                    <h3>Historical Age Comparisons</h3>
                    ${ageComparisons.current.length ? `
                    <div class="comparison-section">
                        <h4>By your age, these people had:</h4>
                        <ul class="comparison-list">
                            ${ageComparisons.current.map(comp => 
                                `<li>Age ${comp.age}: ${comp.event}</li>`
                            ).join('')}
                        </ul>
                    </div>` : ''}
                    ${ageComparisons.future.length ? `
                    <div class="comparison-section">
                        <h4>In your future, you could:</h4>
                        <ul class="comparison-list">
                            ${ageComparisons.future.map(comp => 
                                `<li>Age ${comp.age}: ${comp.event}</li>`
                            ).join('')}
                        </ul>
                    </div>` : ''}
                </div>
            `;
            
            // Create visualization chart
            createAgeVisualization(timeUnits);
            
            // Update UI - Astrology Tab
            document.getElementById('astroTab').innerHTML = `
                <div class="astro-info">
                    <h3>Astrological Information</h3>
                    <p><strong>Zodiac Sign:</strong> ${zodiacSign}</p>
                    <p>${zodiacDescription}</p>
                    <p><strong>Born on:</strong> ${dayOfWeek}</p>
                    <p><strong>Days until next birthday:</strong> ${daysUntilBirthday}</p>
                    <p><strong>Moon Phase at Birth:</strong> ${moonPhase}</p>
                </div>
            `;
            
            // Update UI - History Tab
            const historyHtml = `
                <div class="history-info">
                    <h3>Historical Context</h3>
                    <h4>Events around ${birthdate.getFullYear()}</h4>
                    <div class="events-list">
                        ${historicalEvents.length ? 
                            `<ul>${historicalEvents.map(event => 
                                `<li><strong>${event.year}:</strong> ${event.description}</li>`
                            ).join('')}</ul>` : 
                            '<p>No historical events found for this year.</p>'
                        }
                    </div>
                    <h4>Famous People Who Share Your Birthday</h4>
                    <div class="celebrity-list">
                        ${famousBirthdays.length ? 
                            `<ul>${famousBirthdays.map(person => 
                                `<li><strong>${person.year}:</strong> ${person.description}</li>`
                            ).join('')}</ul>` : 
                            '<p>No famous birthdays found for this date.</p>'
                        }
                    </div>
                </div>
            `;
            document.getElementById('historyTab').innerHTML = historyHtml;
            
            // Update UI - Life Stats Tab
            document.getElementById('lifeTab').innerHTML = `
                <div class="life-stats">
                    <h3>Life Statistics</h3>
                    <div class="life-expectancy-container">
                        <h4>Life Expectancy</h4>
                        <div class="progress-container">
                            <div class="progress-bar" id="lifeProgress" style="width: ${lifeExpectancy.percentage}%"></div>
                        </div>
                        <p>You've lived approximately ${lifeExpectancy.percentage}% of your life expectancy.</p>
                        <p>Average life expectancy in your region: ${lifeExpectancy.totalExpectancy} years</p>
                        <p>Statistical years remaining: ${lifeExpectancy.yearsLeft} years</p>
                    </div>
                    <div class="life-percentage-visualization">
                        <canvas id="lifePercentageChart" width="300" height="200"></canvas>
                    </div>
                    <h4>Other Life Statistics</h4>
                    <p>You've slept for approximately ${lifeStats.sleepHours.toLocaleString()} hours</p>
                    <p>Your heart has beaten approximately ${(lifeStats.heartbeats / 1000000).toFixed(1)} million times</p>
                    <p>You've taken approximately ${(lifeStats.breaths / 1000000).toFixed(1)} million breaths</p>
                    
                    <div class="life-timeline">
                        <h4>Your Life Timeline</h4>
                        <div class="timeline-container">
                            ${lifeTimeline.map(milestone => `
                                <div class="timeline-item ${milestone.past ? 'past' : 'future'}">
                                    <div class="timeline-marker"></div>
                                    <div class="timeline-content">
                                        <span class="timeline-year">${milestone.year}</span>
                                        <span class="timeline-age">Age ${milestone.age}</span>
                                        <p class="timeline-event">${milestone.event}</p>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;            // Create life percentage chart
            createLifePercentageChart(lifeExpectancy.percentage);
            
            // Update URL with the new birthdate
            updateUrlWithDate(birthdate);
        } catch (error) {
            // Just log the error but don't show it to the user
            console.error('Error calculating age:', error);
            // Clear any existing error message            resultDiv.innerHTML = '';
            shareableUrlSection.hidden = true;
        }
    });

    // Share functionality
    shareBtn.addEventListener('click', async () => {
        const birthdateInput = document.getElementById('birthdate');
        const nameInput = document.getElementById('name');
        const birthdate = birthdateInput.value ? new Date(birthdateInput.value) : null;
        const name = nameInput.value || null;
        
        // Use hash URLs for localhost, clean URLs for production
        const isLocalHost = window.location.hostname === 'localhost' || 
                           window.location.hostname === '127.0.0.1' || 
                           window.location.protocol === 'file:';
        
        const shareUrl = isLocalHost ? generateHashUrl(birthdate, name) : generateShareableUrl(birthdate, name);
        const text = document.querySelector('.age-text')?.textContent || '';
        const shareText = `${text}\n\nCalculate your age too: ${shareUrl}`;
        
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'My Age Calculation - How Old Is Me',
                    text: shareText,
                    url: shareUrl
                });
            } catch (err) {
                console.error('Share failed:', err);
                // Fallback to clipboard
                navigator.clipboard.writeText(shareUrl)
                    .then(() => alert('Shareable link copied to clipboard!'))
                    .catch(err => console.error('Copy failed:', err));
            }
        } else {
            navigator.clipboard.writeText(shareUrl)                .then(() => alert('Shareable link copied to clipboard!'))
                .catch(err => console.error('Copy failed:', err));
        }
    });

    // Copy URL functionality
    copyUrlBtn.addEventListener('click', async () => {
        const url = shareableUrlInput.value;
        if (url) {
            try {
                await navigator.clipboard.writeText(url);
                // Temporarily change the icon to show success
                copyUrlBtn.innerHTML = '<i class="fas fa-check"></i>';
                setTimeout(() => {
                    copyUrlBtn.innerHTML = '<i class="fas fa-copy"></i>';
                }, 1500);
            } catch (err) {
                console.error('Copy failed:', err);
                // Fallback for older browsers
                shareableUrlInput.select();
                document.execCommand('copy');
                copyUrlBtn.innerHTML = '<i class="fas fa-check"></i>';
                setTimeout(() => {
                    copyUrlBtn.innerHTML = '<i class="fas fa-copy"></i>';                }, 1500);
            }
        }
    });
}); // End of DOMContentLoaded event listener