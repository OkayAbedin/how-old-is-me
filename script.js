document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('ageForm');
    const resultDiv = document.getElementById('result');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Show loading state
        resultDiv.innerHTML = '<p>Calculating...</p>';
        
        const birthdate = new Date(document.getElementById('birthdate').value);
        const today = new Date();
        
        // Validate input
        if (birthdate > today) {
            resultDiv.innerHTML = '<p class="error">Birthdate cannot be in the future!</p>';
            return;
        }

        // Calculate age
        let years = today.getFullYear() - birthdate.getFullYear();
        let months = today.getMonth() - birthdate.getMonth();
        let days = today.getDate() - birthdate.getDate();

        // Adjust for negative months or days
        if (days < 0) {
            months--;
            days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
        }
        if (months < 0) {
            years--;
            months += 12;
        }

        // Format result
        setTimeout(() => {
            resultDiv.innerHTML = `
                <div class="result-box">
                    <p>You are</p>
                    <p class="age-text">${years} years, ${months} months, and ${days} days old</p>
                </div>
            `;
        }, 500);
    });
});