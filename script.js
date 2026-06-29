document.addEventListener('DOMContentLoaded', () => {
    // Subtle mouse tracking effect for cards
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Add a subtle glow that follows the mouse
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
            card.style.background = `radial-gradient(
                800px circle at ${x}px ${y}px,
                rgba(255, 255, 255, 0.06),
                transparent 40%
            ), var(--card-bg)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.background = 'var(--card-bg)';
            // Keep the highlight for the specific card
            if (card.classList.contains('highlight-card')) {
                card.style.background = 'linear-gradient(180deg, rgba(30, 30, 40, 0.8) 0%, rgba(20, 20, 25, 0.8) 100%)';
            }
        });
    });
});
