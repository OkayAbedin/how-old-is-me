// Fun Facts Generator
document.addEventListener('DOMContentLoaded', function() {
    // Add a new tab in the HTML if it doesn't exist
    const tabsContainer = document.querySelector('.tabs');
    if (tabsContainer && !document.querySelector('[data-tab="funfacts"]')) {
        const funFactsTabBtn = document.createElement('button');
        funFactsTabBtn.className = 'tab-btn';
        funFactsTabBtn.setAttribute('data-tab', 'funfacts');
        funFactsTabBtn.textContent = 'Fun Facts';
        tabsContainer.appendChild(funFactsTabBtn);
        
        const resultTabs = document.querySelector('.result-tabs');
        const funFactsTab = document.createElement('div');
        funFactsTab.className = 'tab-content';
        funFactsTab.id = 'funfactsTab';
        funFactsTab.hidden = true;
        resultTabs.appendChild(funFactsTab);
    }
    
    // Collection of fun facts about age
    const funFacts = [
        "If you were born on February 29th, a leap day, you'd technically only celebrate your birthday once every four years.",
        "In some East Asian cultures, you're considered 1 year old at birth and gain a year on New Year's Day, not on your birthday.",
        "The 'birthday paradox' states that in a room of just 23 people, there's a 50% chance two people share a birthday.",
        "The oldest person ever documented was Jeanne Calment, who lived to be 122 years and 164 days old.",
        "The human body replaces all its cells every 7-10 years, so physically, you're a completely different person than you were a decade ago.",
        "The 'golden birthday' is when you turn the same age as your birth date (e.g., turning 18 on the 18th).",
        "The mathematical chance of being born on any given day is roughly 0.27%.",
        "The tradition of birthday candles dates back to ancient Greece, where people brought cakes adorned with lit candles to the temple of Artemis.",
        "The most common birth month in the United States is September, with the most common birthday being September 9th.",
        "In medieval times, many people didn't track their exact age or celebrate birthdays—they only had a general idea of how old they were.",
        "If you've lived 20 years, you've experienced about 7,300 days, 175,200 hours, or 10,512,000 minutes.",
        "Some cultures celebrate a 'death birthday,' honoring the anniversary of a loved one's death, rather than their birth.",
        "Your age on other planets would be different based on their orbital period. On Mercury, a 20-year-old would be about 83 years old!",
        "The 'biological age' of your body might be different from your chronological age based on lifestyle, diet, and genetics.",
        "Identical twins' cells age at the same rate, even if they live vastly different lifestyles."
    ];
    
    // FunFacts generator
    function generateFunFacts() {
        // Select 5 random facts
        const selectedFacts = [];
        const tempFacts = [...funFacts]; // Create a copy
        
        for (let i = 0; i < Math.min(5, tempFacts.length); i++) {
            const randomIndex = Math.floor(Math.random() * tempFacts.length);
            selectedFacts.push(tempFacts[randomIndex]);
            tempFacts.splice(randomIndex, 1); // Remove the selected fact
        }
        
        return selectedFacts;
    }
    
    // Update the Fun Facts tab when the form is submitted
    document.getElementById('ageForm').addEventListener('submit', function() {
        setTimeout(() => {
            const funFactsTab = document.getElementById('funfactsTab');
            if (funFactsTab) {
                const facts = generateFunFacts();
                
                funFactsTab.innerHTML = `
                    <div class="fun-facts">
                        <h3>Age Fun Facts</h3>
                        <div class="facts-container">
                            ${facts.map(fact => `
                                <div class="fact-card">
                                    <i class="fas fa-lightbulb fact-icon"></i>
                                    <p>${fact}</p>
                                </div>
                            `).join('')}
                        </div>
                        <button id="refreshFacts" class="refresh-btn">
                            <i class="fas fa-sync-alt"></i> Get New Facts
                        </button>
                    </div>
                `;
                
                // Add event listener to refresh button
                document.getElementById('refreshFacts').addEventListener('click', function() {
                    const newFacts = generateFunFacts();
                    const factsContainer = document.querySelector('.facts-container');
                    
                    factsContainer.innerHTML = newFacts.map(fact => `
                        <div class="fact-card">
                            <i class="fas fa-lightbulb fact-icon"></i>
                            <p>${fact}</p>
                        </div>
                    `).join('');
                });
            }
        }, 500);
    });
});
