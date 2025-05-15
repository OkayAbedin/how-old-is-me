// Add animations to the age results
document.addEventListener('DOMContentLoaded', () => {
    const ageForm = document.getElementById('ageForm');
    
    ageForm.addEventListener('submit', () => {
        // Use setTimeout to wait for the results to be populated
        setTimeout(() => {
            animateResults();
        }, 100);
    });
    
    function animateResults() {
        // Add entrance animation to each result box
        const resultBoxes = document.querySelectorAll('.result-box');
        resultBoxes.forEach((box, index) => {
            // Add staggered animation
            box.style.animation = `fadeInUp 0.6s ${index * 0.15}s both`;
        });
        
        // Add number counting animation for age text
        const ageTexts = document.querySelectorAll('.age-text');
        ageTexts.forEach(ageText => {
            const targetAge = parseInt(ageText.textContent.match(/\d+/)[0]);
            animateNumber(ageText, targetAge);
        });
        
        // Animate progress bars with a smoother transition
        const progressBars = document.querySelectorAll('.progress-bar');
        progressBars.forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0%';
            setTimeout(() => {
                bar.style.width = width;
            }, 300);
        });
    }
    
    function animateNumber(element, targetNumber) {
        // Get the text content
        const originalText = element.textContent;
        // Find the number in the text
        const numberMatch = originalText.match(/\d+/);
        
        if (!numberMatch) return;
        
        const startNumber = 0;
        const duration = 1500; // ms
        const framesPerSecond = 60;
        const totalFrames = duration / 1000 * framesPerSecond;
        const increment = (targetNumber - startNumber) / totalFrames;
        
        let currentNumber = startNumber;
        let frame = 0;
        
        // Replace the original number with 0
        let displayText = originalText.replace(/\d+/, startNumber);
        element.textContent = displayText;
        
        const animation = setInterval(() => {
            frame++;
            currentNumber += increment;
            
            // Update the text with the current number (rounded to integer)
            displayText = originalText.replace(/\d+/, Math.round(currentNumber));
            element.textContent = displayText;
            
            if (frame >= totalFrames) {
                // Ensure the final number is exactly the target
                displayText = originalText.replace(/\d+/, targetNumber);
                element.textContent = displayText;
                clearInterval(animation);
            }
        }, 1000 / framesPerSecond);
    }
});
