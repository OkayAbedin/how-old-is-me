// This code will be incorporated into script.js
// Function to update the Life Stats tab with improved visualization

function updateLifeStatsTab(lifeTab, lifeExpectancy, lifeStats, lifeTimeline) {
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
