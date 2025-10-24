// Enhanced Story state
let storyState = {
    playerName: "Storyteller",
    genre: "fantasy",
    storySoFar: [],
    currentScene: ""
};

// DOM elements
const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const continueBtn = document.getElementById('continue-btn');
const summarizeBtn = document.getElementById('summarize-btn');
const reframeBtn = document.getElementById('reframe-btn');
const inspireBtn = document.getElementById('inspire-btn');

// Robust auto-scroll function
function scrollToBottom() {
    if (chatMessages) {
        // Multiple attempts to ensure scroll works
        setTimeout(() => {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 10);
        
        setTimeout(() => {
            chatMessages.scrollTo({
                top: chatMessages.scrollHeight,
                behavior: 'smooth'
            });
        }, 50);
    }
}

// Enhanced initialization
function initStory() {
    const urlParams = new URLSearchParams(window.location.search);
    storyState.playerName = urlParams.get('name') || 'Storyteller';
    storyState.genre = urlParams.get('genre') || 'fantasy';
    
    // Set up chat container for proper scrolling
    setupChatContainer();
    
    startStory();
    
    // Focus on input field with enhanced animation
    setTimeout(() => {
        userInput.focus();
        userInput.style.transform = 'scale(1.02)';
        setTimeout(() => userInput.style.transform = 'scale(1)', 200);
    }, 500);
}

function setupChatContainer() {
    // Ensure chat container has proper CSS for scrolling
    if (chatMessages) {
        chatMessages.style.overflowY = 'auto';
        chatMessages.style.maxHeight = 'calc(100vh - 300px)'; // Adjusted for larger input
        chatMessages.style.minHeight = '200px';
    }
    
    // Set up larger input area
    if (userInput) {
        userInput.style.minHeight = '60px'; // Increased height
        userInput.style.maxHeight = '120px';
        userInput.style.padding = '15px'; // More padding
        userInput.style.fontSize = '16px'; // Larger font
    }
    
    // Style send button to be below input
    if (sendBtn) {
        sendBtn.style.marginTop = '10px';
        sendBtn.style.width = '100%';
        sendBtn.style.padding = '12px';
    }
}

function startStory() {
    let initialPrompt = "";
    
    switch(storyState.genre) {
        case 'fantasy':
            initialPrompt = `Welcome, ${storyState.playerName}, to the realm of Eldoria. Magic flows through every stream, ancient prophecies whisper in the wind, and legends wait to be written. Tell me about your character and the journey that brings you here.`;
            break;
        case 'sci-fi':
            initialPrompt = `Greetings, ${storyState.playerName}. Aboard the starship Event Horizon, humanity reaches for the stars. Strange signals from deep space, alien artifacts, and cosmic mysteries await. What role do you play in this grand adventure?`;
            break;
        case 'mystery':
            initialPrompt = `Hello, ${storyState.playerName}. The foggy streets of Ravenport hold secrets in every shadow. Unexplained events, cryptic clues, and suspicious characters fill this noir landscape. What mystery calls to you?`;
            break;
    }
    
    addMessage(initialPrompt, 'ai');
}

// Enhanced message display with proper auto-scroll
function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.classList.add(sender === 'ai' ? 'ai-message' : 'user-message');
    messageDiv.textContent = text;
    messageDiv.style.opacity = '0';
    messageDiv.style.transform = 'translateY(20px)';
    
    chatMessages.appendChild(messageDiv);
    
    // Enhanced animation
    setTimeout(() => {
        messageDiv.style.opacity = '1';
        messageDiv.style.transform = 'translateY(0)';
    }, 50);
    
    // Robust auto-scroll
    scrollToBottom();
    
    if (sender === 'user') {
        storyState.storySoFar.push(`You: ${text}`);
    } else {
        storyState.storySoFar.push(`AI: ${text}`);
    }
    
    // Keep only last 50 messages to prevent memory issues
    if (chatMessages.children.length > 50) {
        chatMessages.removeChild(chatMessages.firstChild);
    }
}

// Enhanced typing indicator
function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.classList.add('typing-indicator');
    typingDiv.id = 'typing-indicator';
    typingDiv.style.opacity = '0';
    
    const dotsDiv = document.createElement('div');
    dotsDiv.classList.add('typing-dots');
    
    for (let i = 0; i < 3; i++) {
        const dot = document.createElement('div');
        dot.classList.add('typing-dot');
        dotsDiv.appendChild(dot);
    }
    
    typingDiv.appendChild(dotsDiv);
    chatMessages.appendChild(typingDiv);
    
    setTimeout(() => {
        typingDiv.style.opacity = '1';
    }, 10);
    
    scrollToBottom();
}

function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.style.opacity = '0';
        setTimeout(() => {
            if (typingIndicator.parentElement) {
                typingIndicator.remove();
            }
        }, 300);
    }
}

// FAST send message with minimal delay and proper scrolling
function sendMessage() {
    const message = userInput.value.trim();
    if (message === '') return;
    
    addMessage(message, 'user');
    userInput.value = '';
    
    // Reset textarea height
    userInput.style.height = '60px';
    
    // Enhanced button feedback
    sendBtn.style.transform = 'scale(0.95)';
    setTimeout(() => sendBtn.style.transform = '', 150);
    
    userInput.disabled = true;
    sendBtn.disabled = true;
    
    showTypingIndicator();
    
    // FAST processing - minimal delay
    setTimeout(() => {
        hideTypingIndicator();
        const response = generateAIResponse(message);
        addMessage(response, 'ai');
        userInput.disabled = false;
        sendBtn.disabled = false;
        userInput.focus();
        
        // Ensure input area is visible after response
        setTimeout(() => {
            scrollToBottom();
        }, 100);
    }, 300);
}

// [Keep all the existing AI response functions the same - they don't need changes]
// Enhanced AI response generation
function generateAIResponse(input) {
    const genre = storyState.genre;
    const inputLower = input.toLowerCase();
    
    if (any(phrase => inputLower.includes(phrase), ['more about', 'tell me about', 'describe', 'explain'])) {
        return handleDescriptionRequest(input);
    } 
    else if (any(word => inputLower.includes(word), ['how', 'why', 'what if'])) {
        return handleQuestion(input);
    }
    else if (input.length < 15) {
        return handleBriefInput(input);
    }
    else {
        return handleDetailedInput(input);
    }
}

// Enhanced helper function
function any(predicate, array) {
    return array.some(predicate);
}

// Enhanced description handler
function handleDescriptionRequest(inputText) {
    const genre = storyState.genre;
    
    const descriptiveResponses = {
        'fantasy': `Let me paint a richer picture for you. The magic in Eldoria is ancient, woven into the very fabric of reality. Spells linger in the air like exotic perfumes, and mythical creatures watch from the shadows with knowing eyes. Every stone, every stream, every whisper of wind tells a story of empires risen and fallen, of heroes and villains whose legends echo through time.\n\nWhat specific aspect of this magical world would you like to explore further?`,
        'sci-fi': `The future unfolds before us in intricate, breathtaking detail. Technology and humanity blend in unexpected, often beautiful ways. Holograms flicker beside organic life forms, AI consciousness evolves in vast digital realms, and the universe reveals wonders that challenge our very understanding of existence. Each discovery opens new questions, each answered mystery reveals deeper layers of cosmic truth.\n\nWhich element of this future landscape captures your imagination most?`,
        'mystery': `The atmosphere thickens with each revelation, each uncovered clue. Secrets hide in plain sight, waiting only for the right perspective to reveal them. Every character carries burdens untold, every location holds memories like ghosts in the walls. The truth is an intricate puzzle, its pieces scattered across time and motive, waiting for the patient and perceptive to assemble them.\n\nWhat layer of this mystery shall we peel back next?`
    };
    
    return descriptiveResponses[genre] || "There are endless details to explore in our narrative. Each element we add brings more depth and texture to the world we're building together. What particular aspect would you like to develop further?";
}

// Enhanced question handler
function handleQuestion(inputText) {
    const genre = storyState.genre;
    
    const reflectiveResponses = {
        'fantasy': `That question touches the very heart of this realm's deepest mysteries. The ancient ones say that magic answers not to force, but to will and wonder—that destiny is written not in stone, but by those brave enough to grasp the pen. The sages in their towers and the druids in their forests have pondered such questions for millennia, yet the answers often reveal themselves differently to each seeker.\n\nWhat truths do you find yourself drawn to uncover in these enchanted lands?`,
        'sci-fi': `Science tirelessly seeks answers, yet the universe specializes in questions of infinite variety. Each discovery reveals new mysteries, each answered question births ten more in its place. Perhaps among the stars, the journey matters more than the destination—the questions we ask define us more than the answers we find. The cosmos reminds us that wonder is the true engine of progress.\n\nWhat mysteries of existence call most powerfully to you?`,
        'mystery': `Every question leads deeper into the labyrinth, where obvious answers often conceal greater truths beneath their surfaces. What seems simple often has roots reaching into darkness, connections weaving through time and motive in patterns only visible from certain angles. The truth rarely resides in what is said, but often in the silences between words, the spaces between actions.\n\nWhat patterns do you begin to perceive in the gathering shadows?`
    };
    
    return reflectiveResponses[genre] || "Your question opens new dimensions in our unfolding narrative. Each inquiry shapes the story in unique ways, guiding our creative journey into unexpected territories. What paths of exploration call to you in this moment?";
}

// Enhanced brief input handler
function handleBriefInput(inputText) {
    const prompts = [
        `Can you tell me more about that? What specific details, emotions, or sensations come to mind as you imagine this moment?`,
        `I'd love to hear more. What makes this particular moment significant in the larger tapestry of our story?`,
        `Let's explore this further together. What sights, sounds, smells, and feelings accompany this scene in your imagination?`,
        `There's a rich story here waiting to unfold. What happens next in the movie of your mind?`,
        `This is intriguing! What deeper layers, hidden meanings, or unexpected connections can we add to this moment?`,
        `Wonderful detail! How does this element connect to the larger narrative we're weaving together?`
    ];
    
    return prompts[Math.floor(Math.random() * prompts.length)];
}

// Enhanced detailed input handler
function handleDetailedInput(inputText) {
    const genre = storyState.genre;
    
    const creativeResponses = {
        'fantasy': `As your words take form, the very air around us shimmers with new possibilities. Magic responds to your narrative, shaping reality around the vision you describe. The story deepens, the world expands, and the characters breathe with greater life. Ancient forests whisper approval, mythical creatures stir from their slumbers, and the fabric of destiny weaves itself around your choices.\n\nWhat wonders, challenges, or revelations emerge from the mists of imagination next?`,
        'sci-fi': `Your narrative echoes through the corridors of possibility, becoming part of the universe's ever-expanding story. Technology and humanity intertwine in new, unexpected patterns, creating futures previously unimagined. Stars align in new constellations, alien civilizations take clearer form, and the boundaries of known reality stretch to accommodate your vision.\n\nWhere does our cosmic journey lead from this pivotal moment? What new horizons appear on the edge of the unknown?`,
        'mystery': `Each word you add builds another layer to the enigma, another piece to the intricate puzzle taking shape before us. Shadows shift and reform, motives clarify and complicate, the plot thickens with delicious complexity. Clues rearrange themselves in new patterns, characters reveal hidden depths, and the truth becomes both clearer and more elusive.\n\nWhat revelation, what twist, what uncovered secret waits just beyond the next turned page?`
    };
    
    return creativeResponses[genre] || "Your contribution weaves another rich, vibrant thread into the tapestry of our shared narrative. The story breathes and grows with each new idea, each creative choice we make together. What direction shall our collaborative imagination explore in this next chapter?";
}

// FAST continue story
function continueStory() {
    userInput.disabled = true;
    sendBtn.disabled = true;
    continueBtn.style.transform = 'scale(0.95)';
    
    showTypingIndicator();
    
    setTimeout(() => {
        hideTypingIndicator();
        const continuation = generateStoryContinuation();
        storyState.currentScene = continuation;
        addMessage(continuation, 'ai');
        userInput.disabled = false;
        sendBtn.disabled = false;
        continueBtn.style.transform = '';
        
        // Ensure input area is visible after response
        setTimeout(() => {
            scrollToBottom();
        }, 100);
    }, 300);
}

// Enhanced story continuation
function generateStoryContinuation() {
    const genre = storyState.genre;
    
    const continuations = {
        'fantasy': `The path forward reveals new wonders and challenges at every turn. Ancient magic stirs in deep places, forgotten prophecies whisper on the edge of hearing, and the fate of kingdoms hangs in the delicate balance of choices yet unmade. Legendary creatures watch from shadowed realms, and the very stones remember stories older than time.\n\nWhat destiny calls to your character in this moment of infinite possibility? What new chapter begins in the epic tale we're writing together?`,
        'sci-fi': `The cosmos holds infinite possibilities, each more breathtaking than the last. New planets swim into view with atmospheres of impossible colors, alien civilizations extend tentative greetings across the void, and technological marvels beyond current understanding hum with latent power. The fabric of spacetime itself seems to ripple with the weight of discoveries waiting to be made.\n\nWhere does your journey lead from this point of cosmic intersection? What new frontier calls to the explorer's heart?`,
        'mystery': `Each clue we uncover reveals deeper, more complex layers of intrigue. Shadows hold secrets within secrets, and every character we meet has motives hidden beneath motives, stories concealed behind stories. The plot thickens like fog rolling in from the sea, obscuring some truths while revealing others in stark relief.\n\nWhat truth will you uncover next in this labyrinth of deception and revelation? Which thread, when pulled, will make the entire tapestry unravel?`
    };
    
    return continuations[genre] || "The narrative unfolds in unexpected, wonderful directions. Each choice opens new pathways through the storyscape we're mapping together. What surprising turn does the tale take as we write this next sentence, this next paragraph, this next chapter?";
}

// FAST summarize story
function summarizeStory() {
    if (storyState.storySoFar.length === 0) {
        addMessage("Our story is just beginning, a blank canvas waiting for the first brushstrokes of our collective imagination. Each word we write together will build a world of wonder, mystery, and infinite possibility.", 'ai');
        return;
    }
    
    const recentEntries = storyState.storySoFar.slice(-8);
    let summary = "Here's where our story currently stands:\n\n";
    
    recentEntries.forEach(entry => {
        summary += `• ${entry}\n`;
    });
    
    summary += "\nEvery sentence we craft adds another layer of depth to our shared narrative. Each character, each location, each twist and turn contributes to the rich tapestry we're weaving together.\n\nWhat shall we write into existence next?";
    
    addMessage(summary, 'ai');
}

// FAST reframe story
function reframeStory() {
    const perspectives = [
        "Let's view this through a completely different lens. What if we shifted perspective to a minor character witnessing these events? How would they interpret what's happening? What details would they notice that our main perspective might miss?",
        "Imagine this moment from a new angle—perhaps from high above, like a bird watching the scene unfold, or from deep below, as if the very stones and earth had consciousness. How does the story change when viewed from this unconventional vantage point?",
        "What if we changed the emotional tone entirely? How would this scene feel if it were infused with more suspense, more humor, more melancholy, or more wonder? How would that shift alter the characters' choices and the story's direction?",
        "Let's play with time itself. What echoes from the distant past influence this exact moment? What shadows of the far future already fall upon it? How do different temporal perspectives enrich our understanding of what's happening now?",
        "Consider this scene through the lens of a different genre altogether. What if our fantasy adventure suddenly had noir elements? What if our sci-fi story borrowed from romantic traditions? How would that genre shift reveal new facets of our narrative?"
    ];
    
    addMessage(perspectives[Math.floor(Math.random() * perspectives.length)], 'ai');
}

// FAST get inspiration
function getInspiration() {
    const inspirations = {
        'fantasy': [
            "Imagine a city built entirely within the branches of a world-tree, where different districts exist on different massive limbs...",
            "What if magic wasn't cast with words or gestures, but through specific emotions that had to be genuinely felt?",
            "Consider a character who discovers they're the reincarnation of a legendary villain, not the hero everyone expected...",
            "Picture a library that contains every story that was never written, every tale that almost happened but didn't..."
        ],
        'sci-fi': [
            "Envision a society where memories can be traded as currency—what would someone sacrifice to buy a better past?",
            "What if humanity's first contact wasn't with aliens, but with our own descendants returning from the far future?",
            "Imagine a planet where time flows differently in various regions—how would civilization develop there?",
            "Consider a AI that becomes obsessed with creating the perfect piece of art, at any cost..."
        ],
        'mystery': [
            "What if the detective realizes the murder victim arranged their own death as the ultimate act of revenge?",
            "Imagine a small town where everyone has the same dream every night, and one morning someone from the dream turns up dead...",
            "Consider a series of thefts where nothing valuable is taken, only seemingly random personal items...",
            "What if the clues point to two completely different solutions, both equally plausible but mutually exclusive?"
        ]
    };
    
    const genreInspirations = inspirations[storyState.genre] || [
        "What if the most ordinary object in the room held the key to everything?",
        "Imagine a character who sees the world completely differently than anyone else...",
        "What secret could be hiding behind the most innocent smile?",
        "How might a single conversation change the course of everything?"
    ];
    
    const inspiration = genreInspirations[Math.floor(Math.random() * genreInspirations.length)];
    addMessage(`💡 **Story Inspiration:** ${inspiration}\n\nHow might this spark ignite new directions for our narrative?`, 'ai');
}

function newStory() {
    if (confirm('Are you sure you want to start a new story? Your current story will be lost.')) {
        window.location.href = '/story-setup?name=' + encodeURIComponent(storyState.playerName) + '&genre=' + storyState.genre;
    }
}

// Enhanced event listeners
document.addEventListener('DOMContentLoaded', function() {
    initStory();
    
    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    continueBtn.addEventListener('click', continueStory);
    summarizeBtn.addEventListener('click', summarizeStory);
    reframeBtn.addEventListener('click', reframeStory);
    inspireBtn.addEventListener('click', getInspiration);
    
    // Enhanced input focus effects
    userInput.addEventListener('focus', function() {
        this.style.boxShadow = '0 0 0 3px rgba(236, 72, 153, 0.3)';
    });
    
    userInput.addEventListener('blur', function() {
        this.style.boxShadow = '';
    });
    
    // Auto-resize textarea as user types
    userInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 120) + 'px';
        scrollToBottom();
    });
    
    // Enhanced button hover effects
    [continueBtn, summarizeBtn, reframeBtn, inspireBtn].forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
});