document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('ageForm');
    const resultDiv = document.getElementById('result');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const shareBtn = document.getElementById('shareBtn');
    const printBtn = document.getElementById('printBtn');

    // Tab switching functionality
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.hidden = true);
            button.classList.add('active');
            document.getElementById(`${button.dataset.tab}Tab`).hidden = false;
        });
    });

    // Zodiac sign calculation
    const getZodiacSign = (month, day) => {
        const signs = {
            'Capricorn': [12, 22, 1, 19],
            'Aquarius': [1, 20, 2, 18],
            'Pisces': [2, 19, 3, 20],
            'Aries': [3, 21, 4, 19],
            'Taurus': [4, 20, 5, 20],
            'Gemini': [5, 21, 6, 20],
            'Cancer': [6, 21, 7, 22],
            'Leo': [7, 23, 8, 22],
            'Virgo': [8, 23, 9, 22],
            'Libra': [9, 23, 10, 22],
            'Scorpio': [10, 23, 11, 21],
            'Sagittarius': [11, 22, 12, 21]
        };

        for (let sign in signs) {
            const [startMonth, startDay, endMonth, endDay] = signs[sign];
            if ((month === startMonth && day >= startDay) || 
                (month === endMonth && day <= endDay)) {
                return sign;
            }
        }
        return 'Capricorn';
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
            months: Math.floor(diff / (1000 * 60 * 60 * 24 * 30.44)),
            weeks: Math.floor(diff / (1000 * 60 * 60 * 24 * 7)),
            days: Math.floor(diff / (1000 * 60 * 60 * 24)),
            hours: Math.floor(diff / (1000 * 60 * 60))
        };
    };

    // Form submission handler
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const birthdate = new Date(document.getElementById('birthdate').value);
        const today = new Date();
        
        if (birthdate > today) {
            resultDiv.innerHTML = '<p class="error">Birthdate cannot be in the future!</p>';
            return;
        }

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
        const dayOfWeek = birthdate.toLocaleString('en-us', { weekday: 'long' });
        const daysUntilBirthday = getNextBirthday(birthdate);

        // Update UI
        document.getElementById('basicTab').innerHTML = `
            <div class="result-box">
                <p class="age-text">${years} years, ${months} months, ${days} days</p>
            </div>
        `;

        document.getElementById('detailedTab').innerHTML = `
            <div class="time-units">
                <p>${timeUnits.months.toLocaleString()} months</p>
                <p>${timeUnits.weeks.toLocaleString()} weeks</p>
                <p>${timeUnits.days.toLocaleString()} days</p>
                <p>${timeUnits.hours.toLocaleString()} hours</p>
            </div>
        `;

        document.getElementById('astroTab').innerHTML = `
            <div class="astro-info">
                <p>Zodiac Sign: ${zodiacSign}</p>
                <p>Born on: ${dayOfWeek}</p>
                <p>Days until next birthday: ${daysUntilBirthday}</p>
            </div>
        `;
    });

    // Share functionality
    shareBtn.addEventListener('click', async () => {
        const text = document.querySelector('.age-text')?.textContent || '';
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'My Age Calculation',
                    text: text
                });
            } catch (err) {
                console.error('Share failed:', err);
            }
        } else {
            navigator.clipboard.writeText(text)
                .then(() => alert('Results copied to clipboard!'))
                .catch(err => console.error('Copy failed:', err));
        }
    });

    // Print functionality
    printBtn.addEventListener('click', () => {
        window.print();
    });
});