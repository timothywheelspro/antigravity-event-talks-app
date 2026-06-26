document.addEventListener('DOMContentLoaded', () => {
    const refreshBtn = document.getElementById('refresh-btn');
    const loadingState = document.getElementById('loading-state');
    const errorState = document.getElementById('error-state');
    const errorMessage = document.getElementById('error-message');
    const notesContainer = document.getElementById('notes-container');

    // Modal elements
    const twitterModal = document.getElementById('twitter-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const tweetTextarea = document.getElementById('tweet-textarea');
    const tweetCharCount = document.getElementById('tweet-char-count');
    const postTweetBtn = document.getElementById('post-tweet-btn');
    const tweetLinkUrl = document.getElementById('tweet-link-url');
    
    let currentTweetLink = '';

    // Fetch notes on initial load
    fetchNotes();

    refreshBtn.addEventListener('click', () => {
        fetchNotes();
    });

    async function fetchNotes() {
        // UI states
        refreshBtn.classList.add('refreshing');
        refreshBtn.disabled = true;
        notesContainer.innerHTML = '';
        errorState.classList.add('hidden');
        loadingState.classList.remove('hidden');

        try {
            const response = await fetch('/api/notes');
            const result = await response.json();

            if (result.status === 'success') {
                renderNotes(result.data);
            } else {
                throw new Error(result.message || 'Failed to fetch release notes.');
            }
        } catch (error) {
            console.error('Error fetching notes:', error);
            errorMessage.textContent = error.message;
            errorState.classList.remove('hidden');
        } finally {
            loadingState.classList.add('hidden');
            refreshBtn.classList.remove('refreshing');
            refreshBtn.disabled = false;
        }
    }

    function renderNotes(notes) {
        if (notes.length === 0) {
            notesContainer.innerHTML = '<div class="note-card"><p>No release notes found.</p></div>';
            return;
        }

        notes.forEach(note => {
            const card = document.createElement('div');
            card.className = 'note-card';

            // Create plain text for Twitter sharing
            // We'll extract a brief summary from the HTML content
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = note.content;
            
            // Try to find the first paragraph for the tweet text
            let tweetText = 'Check out the new BigQuery update!';
            const firstP = tempDiv.querySelector('p');
            if (firstP && firstP.textContent) {
                // Truncate to make room for URL
                let text = firstP.textContent.trim();
                if (text.length > 200) {
                    text = text.substring(0, 197) + '...';
                }
                tweetText = text;
            }
            
            // Alternatively, user might just want the title (date) + "BigQuery Update"
            tweetText = `BigQuery Update (${note.title}): ${tweetText}`;

            card.innerHTML = `
                <div class="note-header">
                    <div class="note-title-container">
                        <div class="note-date">${note.title}</div>
                        <a href="${note.link}" target="_blank" rel="noopener noreferrer" class="note-link">
                            View Official Docs <i class="fa-solid fa-arrow-up-right-from-square" style="font-size: 0.75em; margin-left: 2px;"></i>
                        </a>
                    </div>
                    <button class="tweet-btn" data-text="${encodeURIComponent(tweetText)}" data-link="${encodeURIComponent(note.link)}">
                        <i class="fa-brands fa-twitter"></i> Share on Twitter
                    </button>
                </div>
                <div class="note-content">
                    ${note.content}
                </div>
            `;
            notesContainer.appendChild(card);
        });

        // Add event listeners to new tweet buttons
        document.querySelectorAll('.tweet-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const text = decodeURIComponent(btn.getAttribute('data-text'));
                const link = decodeURIComponent(btn.getAttribute('data-link'));
                openTwitterModal(text, link);
            });
        });
    }

    // Twitter Modal Logic
    function openTwitterModal(text, link) {
        tweetTextarea.value = text;
        currentTweetLink = link;
        
        // Extract domain for preview
        try {
            const url = new URL(link);
            tweetLinkUrl.textContent = url.hostname;
        } catch (e) {
            tweetLinkUrl.textContent = link;
        }
        
        updateCharCount();
        twitterModal.classList.remove('hidden');
    }

    function closeTwitterModal() {
        twitterModal.classList.add('hidden');
    }

    function updateCharCount() {
        const textLength = tweetTextarea.value.length;
        // Twitter allows 280 chars. URLs take ~23 chars. 
        // We'll approximate available chars to 280 - 24 for link and space
        const maxChars = 256; 
        const remaining = maxChars - textLength;
        
        tweetCharCount.textContent = remaining;
        
        if (remaining < 0) {
            tweetCharCount.className = 'char-count danger';
            postTweetBtn.disabled = true;
        } else if (remaining <= 20) {
            tweetCharCount.className = 'char-count warning';
            postTweetBtn.disabled = false;
        } else {
            tweetCharCount.className = 'char-count';
            postTweetBtn.disabled = false;
        }
    }

    closeModalBtn.addEventListener('click', closeTwitterModal);
    
    // Close modal when clicking outside
    twitterModal.addEventListener('click', (e) => {
        if (e.target === twitterModal) {
            closeTwitterModal();
        }
    });

    tweetTextarea.addEventListener('input', updateCharCount);

    postTweetBtn.addEventListener('click', () => {
        const text = tweetTextarea.value;
        const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(currentTweetLink)}`;
        window.open(tweetUrl, '_blank', 'noopener,noreferrer');
        closeTwitterModal();
    });
});
