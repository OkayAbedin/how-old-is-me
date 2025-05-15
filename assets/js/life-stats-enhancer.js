// This script adds the updated Life Stats tab implementation to the main script

// Wait for the main script to load
document.addEventListener('DOMContentLoaded', () => {
    // Get form element
    const form = document.getElementById('ageForm');
    
    // Store the original submit handler
    const originalSubmitHandler = form.onsubmit;
    
    // Replace it with our enhanced version
    form.addEventListener('submit', async function(e) {
        // Prevent default to make sure we handle the form submission
        e.preventDefault();
        
        // Get necessary data
        const birthdate = new Date(document.getElementById('birthdate').value);
        const region = document.getElementById('region').value;
        
        // Calculate required values 
        const timeUnits = calculateTimeUnits(birthdate);
        const lifeExpectancy = calculateLifeExpectancy(birthdate, region);
        const lifeStats = calculateLifeStats(timeUnits);
        const lifeTimeline = generateLifeTimeline(birthdate.getFullYear(), timeUnits.years);
        
        // Call the original handler to update other tabs
        // Let the form submission continue as normal
        // This happens after the form is processed
        
        // After a slight delay to ensure other UI updates are complete
        setTimeout(() => {
            // Get the life tab element
            const lifeTab = document.getElementById('lifeTab');
            
            // Update the life tab with our enhanced version
            if (lifeTab) {
                lifeTab.innerHTML = `
                    <div class="life-stats">
                        <h3>Life Statistics</h3>
                        <div class="life-expectancy-container">
                            <h4>Life Expectancy</h4>
                            <div class="life-chart-container">
                                <div class="progress-container">
                                    <div class="progress-bar" id="lifeProgress" style="width: ${lifeExpectancy.percentage}%"></div>
                                </div>
                                <canvas id="lifePercentageChart" width="180" height="180"></canvas>
                            </div>
                            <div class="life-percentage-text">
                                <p>You've lived approximately ${lifeExpectancy.percentage}% of your life expectancy.</p>
                                <p>Average life expectancy in your region: ${lifeExpectancy.totalExpectancy} years</p>
                                <p>Statistical years remaining: ${lifeExpectancy.yearsLeft} years</p>
                            </div>
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
                `;
                
                // Create the life percentage chart
                createLifePercentageChart(lifeExpectancy.percentage);
            }
        }, 500);
    });
});
