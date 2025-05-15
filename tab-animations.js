// Tab animation enhancer
document.addEventListener('DOMContentLoaded', function() {
    // Get tab buttons and tab contents
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Add animation classes to tabs
    tabContents.forEach(content => {
        content.classList.add('tab-animate');
    });
    
    // Override default tab switching
    tabButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Prevent default behavior if needed
            e.stopPropagation();
            
            // Remove active class from all buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get tab ID
            const tabId = this.getAttribute('data-tab');
            
            // Hide all tab contents with animation
            tabContents.forEach(content => {
                if (content.id === `${tabId}Tab`) {
                    // Show this tab with animation
                    content.classList.add('tab-entering');
                    content.hidden = false;
                    setTimeout(() => {
                        content.classList.remove('tab-entering');
                    }, 300);
                } else {
                    // Hide other tabs
                    content.classList.add('tab-exiting');
                    setTimeout(() => {
                        content.hidden = true;
                        content.classList.remove('tab-exiting');
                    }, 300);
                }
            });
        }, { capture: true });
    });
});
