// Enhanced Game state with better organization
let gameState = {
    gameId: null,
    playerName: "Adventurer",
    genre: "fantasy",
    hp: 100,
    maxHp: 100,
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    gold: 0,
    inventory: ["Torch", "Water Flask"],
    location: "Unknown",
    enemies: [],
    defeatedEnemies: [],
    readyForBattle: false,
    visitedLocations: [],
    gameOver: false,
    activityProgress: 0,
    requiredActivitiesForReadiness: 0
};

// DOM elements
const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const quickChoices = document.getElementById('quick-choices');
const inputArea = document.querySelector('.input-area');

// Boss enemies that can respawn in special encounters
const FINAL_BOSS_NAMES = [
    'The Nightbinder', 
    'Cosmic Entity', 
    'Society Mastermind',
    'Dragon',
    'Celestial Being', 
    'Demon Lord',
    'Ancient Dragon',
    'God of War',
    'Void Entity',
    'AI Overlord',
    'Time Master',
    'Reality Weaver'
];

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

// Initialize game with enhanced UI
function initGame() {
    const urlParams = new URLSearchParams(window.location.search);
    gameState.playerName = urlParams.get('name') || 'Adventurer';
    gameState.genre = urlParams.get('genre') || 'fantasy';
    
    // Set up chat container for proper scrolling
    setupChatContainer();
    
    updateStatusDisplay();
    startOfflineGame();
    
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

function startOfflineGame() {
    let initialScene = "";
    
    switch(gameState.genre) {
        case 'fantasy':
            initialScene = `Welcome, ${gameState.playerName}! You stand at the edge of an ancient forest. Tall trees whisper secrets in the wind, and a narrow path leads into the mysterious depths. The air is thick with magic and possibility.`;
            gameState.location = "Ancient Forest";
            break;
        case 'sci-fi':
            initialScene = `Commander ${gameState.playerName}, your starship emerges from hyperspace. Before you floats the derelict station XT-7, its lights flickering erratically. Scanners show anomalous energy readings from the core.`;
            gameState.location = "Derelict Space Station";
            break;
        case 'mystery':
            initialScene = `Detective ${gameState.playerName}, the rain pours down as you approach the old Hawthorne Manor. A single light flickers in an upstairs window. The case file in your pocket speaks of strange occurrences and missing persons.`;
            gameState.location = "Hawthorne Manor";
            break;
    }
    
    addMessage(initialScene, 'ai');
    showQuickChoices(["Explore the area carefully", "Check your equipment", "Move forward cautiously"]);
}

// Enhanced message display with animations and auto-scroll
function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.classList.add(sender === 'ai' ? 'ai-message' : 'user-message');
    
    // Enhanced message styling
    if (text.includes('LEVEL UP') || text.includes('🎉')) {
        messageDiv.classList.add('level-up-message');
    } else if (text.toLowerCase().includes('attack') || text.toLowerCase().includes('damage') || text.toLowerCase().includes('defeat')) {
        messageDiv.classList.add('combat-message');
    } else if (text.toLowerCase().includes('explore') || text.toLowerCase().includes('discover') || text.toLowerCase().includes('find')) {
        messageDiv.classList.add('exploration-message');
    } else if (text.toLowerCase().includes('inventory') || text.includes('🔦') || text.includes('❤️')) {
        messageDiv.classList.add('inventory-message');
    }
    
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
        gameState.storySoFar = gameState.storySoFar || [];
        gameState.storySoFar.push(`You: ${text}`);
    } else {
        gameState.storySoFar = gameState.storySoFar || [];
        gameState.storySoFar.push(`AI: ${text}`);
    }
    
    // Keep only last 50 messages to prevent memory issues
    if (chatMessages.children.length > 50) {
        chatMessages.removeChild(chatMessages.firstChild);
    }
}

// Enhanced typing indicator (minimal use)
function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.classList.add('typing-indicator');
    typingDiv.id = 'typing-indicator';
    
    const dotsDiv = document.createElement('div');
    dotsDiv.classList.add('typing-dots');
    
    for (let i = 0; i < 3; i++) {
        const dot = document.createElement('div');
        dot.classList.add('typing-dot');
        dotsDiv.appendChild(dot);
    }
    
    typingDiv.appendChild(dotsDiv);
    chatMessages.appendChild(typingDiv);
    scrollToBottom();
}

function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Enhanced quick choices with better animations
function showQuickChoices(choices) {
    quickChoices.innerHTML = '';
    choices.forEach(choice => {
        const button = document.createElement('button');
        button.classList.add('choice-btn');
        button.textContent = choice;
        button.style.opacity = '0';
        button.style.transform = 'translateY(10px)';
        
        button.onclick = () => {
            button.style.transform = 'scale(0.95)';
            setTimeout(() => {
                userInput.value = choice;
                sendMessage();
                button.style.transform = '';
            }, 150);
        };
        
        quickChoices.appendChild(button);
        
        // Staggered animation
        setTimeout(() => {
            button.style.opacity = '1';
            button.style.transform = 'translateY(0)';
        }, choices.indexOf(choice) * 100);
    });
    
    // Scroll to show quick choices
    setTimeout(() => {
        scrollToBottom();
    }, 200);
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
    
    // Very short typing indicator for UX
    showTypingIndicator();
    
    // FAST processing - minimal delay
    setTimeout(() => {
        hideTypingIndicator();
        processUserInputOffline(message);
        userInput.disabled = false;
        sendBtn.disabled = false;
        userInput.focus();
        
        // Ensure input area is visible after response
        setTimeout(() => {
            scrollToBottom();
        }, 100);
    }, 200);
}

// Genre-specific content
function getGenreContent() {
    const genreContent = {
        'fantasy': {
            locations: ['Ancient Forest', 'Dragon Cave', 'Enchanted Castle', 'Mystic Ruins', 'Elven Village', 'Shadow Swamp'],
            locationDescriptions: {
                'Ancient Forest': "The trees here are ancient, their bark carved with mysterious runes that glow with faint magic.",
                'Dragon Cave': "The air is hot and smells of sulfur. Gold coins and precious gems glitter in the dim light.",
                'Enchanted Castle': "Magic crackles in the air. Portraits on the walls seem to watch your every move with knowing eyes.",
                'Mystic Ruins': "Stones float in the air, arranged in patterns that defy gravity and conventional understanding.",
                'Elven Village': "Ethereal music floats through the air. The elves watch you with curious, ancient eyes.",
                'Shadow Swamp': "Thick mist obscures your vision. Strange creatures move in the murky waters."
            },
            explorationEvents: [
                "You discover ancient runes carved into a standing stone. They seem to tell a story of lost kingdoms and forgotten magic.",
                "An ancient tree whispers secrets of a forgotten kingdom as you pass beneath its branches.",
                "You find a hidden path that leads to a shimmering portal of pure energy.",
                "A friendly fairy offers to guide you through the forest in exchange for a story."
            ],
            restEvents: [
                "During your rest, you have a vivid dream about a legendary artifact hidden deep in the mountains.",
                "While resting, you notice strange symbols carved into nearby trees that you hadn't seen before.",
                "As you rest, a gentle rain begins to fall, washing away your fatigue and refreshing the forest."
            ],
            regularEnemies: [
                {name: 'Goblin', level: 1, hp: 30, xp: 20, drops: ['Health Potion', 'Rusty Dagger']},
                {name: 'Kobold', level: 1, hp: 25, xp: 15, drops: ['Torch', 'Rations']},
                {name: 'Orc', level: 2, hp: 50, xp: 35, drops: ['Health Potion', 'Iron Sword']},
                {name: 'Skeleton Warrior', level: 2, hp: 45, xp: 30, drops: ['Bone Dust', 'Rusty Sword']},
                {name: 'Forest Troll', level: 3, hp: 80, xp: 50, drops: ['Greater Health Potion', 'Troll Hide']},
                {name: 'Dark Wizard', level: 4, hp: 100, xp: 70, drops: ['Mana Potion', 'Spell Scroll']},
                {name: 'Ogre', level: 4, hp: 120, xp: 65, drops: ['Greater Health Potion', 'Ogre Club']},
                {name: 'Minotaur', level: 5, hp: 140, xp: 90, drops: ['Magic Sword', 'Leather Armor']},
                {name: 'Ancient Lich', level: 6, hp: 180, xp: 130, drops: ['Phoenix Feather', 'Crown of Kings']},
                {name: 'Giant', level: 6, hp: 200, xp: 120, drops: ['Giant Club', 'Ancient Coin']},
                {name: 'Archmage', level: 7, hp: 190, xp: 160, drops: ['Ancient Scroll', 'Crystal Shard']},
                {name: 'Phoenix', level: 8, hp: 230, xp: 190, drops: ['Phoenix Feather', 'Fire Essence']},
                {name: 'Titan', level: 9, hp: 280, xp: 230, drops: ['Titan Hammer', 'Star Metal']}
            ],
            bossEnemies: [
                {name: 'Dragon', level: 5, hp: 150, xp: 100, drops: ['Dragon Scale', 'Ancient Artifact']},
                {name: 'Celestial Being', level: 7, hp: 220, xp: 170, drops: ['Excalibur', 'Dragon Heart']},
                {name: 'Demon Lord', level: 8, hp: 250, xp: 200, drops: ['Demon Horn', 'Enchanted Amulet']},
                {name: 'Ancient Dragon', level: 9, hp: 300, xp: 250, drops: ['Dragon Heart', 'Scale Armor']},
                {name: 'God of War', level: 10, hp: 350, xp: 300, drops: ['Divine Sword', 'Godly Armor']},
                {name: 'The Nightbinder', level: 15, hp: 500, xp: 500, drops: ['Ultimate Artifact', 'Eternal Crown']}
            ]
        },
        'sci-fi': {
            locations: ['Derelict Space Station', 'Alien Planet', 'Cybernetic City', 'Quantum Laboratory', 'Asteroid Base', 'Dimensional Rift'],
            locationDescriptions: {
                'Derelict Space Station': "Flickering lights and emergency alerts create an eerie atmosphere. The station hums with residual power.",
                'Alien Planet': "Strange flora glows with bioluminescent light. The air smells of ozone and unknown minerals.",
                'Cybernetic City': "Holographic advertisements flicker between buildings. Drones patrol the skies silently.",
                'Quantum Laboratory': "Reality seems to warp at the edges. Strange particles float in containment fields.",
                'Asteroid Base': "Artificial gravity generators create a comfortable environment amidst the vacuum of space.",
                'Dimensional Rift': "Colors shift unnaturally. The laws of physics seem to bend and twist around you."
            },
            explorationEvents: [
                "You discover a hidden data terminal with classified information about the station's final moments.",
                "An alien artifact pulses with strange energy, revealing star maps to unknown systems.",
                "You find a working escape pod with emergency supplies and navigation data.",
                "A holographic recording shows the last moments of the station crew before something went wrong."
            ],
            restEvents: [
                "During your rest cycle, the ship's AI analyzes combat data and suggests tactical improvements.",
                "While recharging, you discover a hidden compartment with advanced technology blueprints.",
                "The station's environmental systems create a perfect resting atmosphere, accelerating your recovery."
            ],
            regularEnemies: [
                {name: 'Security Drone', level: 1, hp: 30, xp: 20, drops: ['Energy Cell', 'Scrap Metal']},
                {name: 'Mutant Rat', level: 1, hp: 25, xp: 15, drops: ['Bio-sample', 'Emergency Rations']},
                {name: 'Cyborg Guard', level: 2, hp: 50, xp: 35, drops: ['Laser Pistol', 'Medkit']},
                {name: 'Alien Scout', level: 2, hp: 45, xp: 30, drops: ['Alien Alloy', 'Strange Crystal']},
                {name: 'Combat Android', level: 3, hp: 80, xp: 50, drops: ['Plasma Cartridge', 'Circuit Board']},
                {name: 'Hologram Assassin', level: 4, hp: 100, xp: 70, drops: ['Holo-emitter', 'Data Chip']},
                {name: 'Plasma Trooper', level: 4, hp: 120, xp: 65, drops: ['Plasma Rifle', 'Shield Generator']},
                {name: 'Battle Mech', level: 5, hp: 140, xp: 90, drops: ['Heavy Armor', 'Rocket Pack']},
                {name: 'AI Core', level: 6, hp: 180, xp: 130, drops: ['Quantum Processor', 'Neural Interface']},
                {name: 'Quantum Soldier', level: 6, hp: 200, xp: 120, drops: ['Phase Rifle', 'Temporal Device']},
                {name: 'Starship Captain', level: 7, hp: 190, xp: 160, drops: ['Command Codes', 'Advanced Medkit']},
                {name: 'Time Agent', level: 8, hp: 230, xp: 190, drops: ['Chronal Stabilizer', 'Reality Anchor']},
                {name: 'Cyborg Tyrant', level: 9, hp: 280, xp: 230, drops: ['Cybernetic Implants', 'Force Field']}
            ],
            bossEnemies: [
                {name: 'Alien Warrior', level: 5, hp: 150, xp: 100, drops: ['Alien Technology', 'Warp Crystal']},
                {name: 'Dimensional Being', level: 7, hp: 220, xp: 170, drops: ['Dimensional Shard', 'Reality Gem']},
                {name: 'AI Overlord', level: 8, hp: 250, xp: 200, drops: ['Master AI Core', 'Network Key']},
                {name: 'Cosmic Horror', level: 9, hp: 300, xp: 250, drops: ['Eldritch Essence', 'Star Map']},
                {name: 'Galactic Emperor', level: 10, hp: 350, xp: 300, drops: ['Imperial Seal', 'Fleet Codes']},
                {name: 'Cosmic Entity', level: 15, hp: 500, xp: 500, drops: ['Cosmic Core', 'Universal Key']}
            ]
        },
        'mystery': {
            locations: ['Hawthorne Manor', 'Abandoned Asylum', 'Museum of Antiquities', 'Underground Tunnels', 'Seaside Cliff', 'Clocktower'],
            locationDescriptions: {
                'Hawthorne Manor': "Dust covers every surface. Portraits of stern ancestors watch your every move from the walls.",
                'Abandoned Asylum': "The air is cold and heavy. Faint whispers seem to echo from empty rooms.",
                'Museum of Antiquities': "Ancient artifacts stand in glass cases, their histories shrouded in mystery and legend.",
                'Underground Tunnels': "Damp stone walls glisten in the dim light. The sound of dripping water echoes endlessly.",
                'Seaside Cliff': "Waves crash against the rocks below. A lonely lighthouse stands guard over the turbulent sea.",
                'Clocktower': "Gears turn rhythmically. Each tick of the clock seems to measure something more than just time."
            },
            explorationEvents: [
                "You discover a hidden diary page that reveals a crucial clue about the mystery.",
                "An old photograph falls from a book, showing people who shouldn't have been together.",
                "You find a secret passage behind a moving bookcase, leading to unknown depths.",
                "A coded message is hidden in plain sight, waiting for someone clever enough to decipher it."
            ],
            restEvents: [
                "During your rest, you piece together clues in your mind, gaining new insights into the case.",
                "While taking a break, you notice a pattern you hadn't seen before in the evidence.",
                "A moment of quiet reflection brings sudden clarity to the mysterious events."
            ],
            regularEnemies: [
                {name: 'Thug', level: 1, hp: 30, xp: 20, drops: ['Brass Knuckles', 'Whiskey Flask']},
                {name: 'Corrupt Guard', level: 1, hp: 25, xp: 15, drops: ['Badge', 'Handcuffs']},
                {name: 'Assassin', level: 2, hp: 50, xp: 35, drops: ['Silenced Pistol', 'Smoke Bomb']},
                {name: 'Crime Boss', level: 2, hp: 45, xp: 30, drops: ['Ledger', 'Expensive Cigar']},
                {name: 'Cultist', level: 3, hp: 80, xp: 50, drops: ['Ritual Dagger', 'Strange Symbol']},
                {name: 'Mad Scientist', level: 4, hp: 100, xp: 70, drops: ['Experimental Serum', 'Research Notes']},
                {name: 'Doppelganger', level: 4, hp: 120, xp: 65, drops: ['Disguise Kit', 'Mirror Shard']},
                {name: 'Ghost', level: 5, hp: 140, xp: 90, drops: ['Ectoplasmic Residue', 'Haunted Locket']},
                {name: 'Crime Lord', level: 6, hp: 180, xp: 130, drops: ['Blackmail Evidence', 'Safe Combination']},
                {name: 'Ancient Spirit', level: 6, hp: 200, xp: 120, drops: ['Spirit Essence', 'Ancient Talisman']},
                {name: 'Master Criminal', level: 7, hp: 190, xp: 160, drops: ['Master Key', 'Cipher Book']},
                {name: 'Reality Warper', level: 8, hp: 230, xp: 190, drops: ['Reality Shard', 'Paradox Crystal']},
                {name: 'Dimension Walker', level: 9, hp: 280, xp: 230, drops: ['Dimensional Map', 'Portal Key']}
            ],
            bossEnemies: [
                {name: 'Vampire', level: 5, hp: 150, xp: 100, drops: ['Vampire Dust', 'Ancient Ring']},
                {name: 'Time Traveler', level: 7, hp: 220, xp: 170, drops: ['Pocket Watch', 'Temporal Device']},
                {name: 'Ultimate Conspirator', level: 8, hp: 250, xp: 200, drops: ['Conspiracy Files', 'Master Plan']},
                {name: 'Fate Weaver', level: 9, hp: 300, xp: 250, drops: ['Thread of Fate', 'Destiny Crystal']},
                {name: 'Mastermind of Reality', level: 10, hp: 350, xp: 300, drops: ['Reality Anchor', 'Cosmic Blueprint']},
                {name: 'Society Mastermind', level: 15, hp: 500, xp: 500, drops: ['Master Key', 'Final Evidence']}
            ]
        }
    };
    
    return genreContent[gameState.genre] || genreContent.fantasy;
}

// FAST process input with immediate responses
function processUserInputOffline(message) {
    const lowerMessage = message.toLowerCase();
    let response = "";
    let choices = [];

    // Process immediately
    if (lowerMessage.includes('attack') || lowerMessage.includes('fight') || lowerMessage.includes('battle')) {
        response = handleCombatOffline(message);
        choices = ['Attack again', 'Try to flee', 'Use item from inventory'];
    } else if (lowerMessage.includes('explore') || lowerMessage.includes('search') || lowerMessage.includes('look')) {
        response = handleExplorationOffline(message);
        choices = ['Continue exploring', 'Move to new area', 'Check your surroundings'];
    } else if (lowerMessage.includes('rest') || lowerMessage.includes('sleep') || lowerMessage.includes('heal')) {
        response = handleRestOffline(message);
        choices = ['Continue your journey', 'Explore the area', 'Check inventory'];
    } else if (lowerMessage.includes('move') || lowerMessage.includes('go') || lowerMessage.includes('travel')) {
        response = handleMovementOffline(message);
        choices = ['Explore this area', 'Continue moving', 'Rest for a moment'];
    } else if (lowerMessage.includes('inventory') || lowerMessage.includes('items') || lowerMessage.includes('equipment')) {
        response = handleInventoryOffline(message);
        choices = ['Continue adventure', 'Explore area', 'Move to new location'];
    } else if (lowerMessage.includes('use') || lowerMessage.includes('consume') || lowerMessage.includes('drink')) {
        response = handleItemUseOffline(message);
        choices = ['Continue adventure', 'Check inventory', 'Explore area'];
    } else if (lowerMessage.includes('level') || lowerMessage.includes('stats') || lowerMessage.includes('status')) {
        response = handleStatusCheckOffline(message);
        choices = ['Continue adventure', 'Check inventory', 'Explore area'];
    } else {
        response = handleGeneralActionOffline(message);
        choices = ['Explore', 'Move forward', 'Check status', 'Look for clues'];
    }

    updateStatusDisplay();
    addMessage(response, 'ai');
    showQuickChoices(choices);
    checkLevelUp();
}

// UPDATED: findSpawnEnemy - prevents respawning of defeated regular enemies
function findSpawnEnemy(candidates) {
    // Filter out all defeated regular enemies
    const availableEnemies = candidates.filter(enemy => {
        // Boss enemies can always respawn
        if (FINAL_BOSS_NAMES.includes(enemy.name)) {
            return true;
        }
        // Regular enemies only if not defeated
        return !gameState.defeatedEnemies.includes(enemy.name);
    });

    // If no available enemies, return a random one (or create a default)
    if (availableEnemies.length === 0) {
        // Return a basic enemy if all are defeated
        return {name: 'Mysterious Stranger', level: gameState.level, hp: 50, xp: 25, drops: ['Health Potion']};
    }

    // Return a random available enemy
    return availableEnemies[Math.floor(Math.random() * availableEnemies.length)];
}

// UPDATED: handleUnderleveledSpawn - reduced restrictions
function handleUnderleveledSpawn(enemy) {
    // Only show warning for significantly higher level enemies, but don't block them
    if (enemy.level > gameState.level + 3) {
        addMessage(`Warning: The ${enemy.name} (Level ${enemy.level}) is much stronger than you! Proceed with caution.`, 'ai');
    }
    // Remove the activity requirement completely
}

// NEW: Create boss encounter function
function createBossEncounter() {
    const genreContent = getGenreContent();
    const bossEnemies = genreContent.bossEnemies;
    
    // For boss encounters, ignore the defeated enemies list
    const boss = bossEnemies[Math.floor(Math.random() * bossEnemies.length)];
    
    // Scale boss level to player level if needed
    const scaledBoss = {
        ...boss,
        level: Math.max(boss.level, gameState.level),
        hp: boss.hp * (Math.max(boss.level, gameState.level) / boss.level)
    };
    
    gameState.enemies = [scaledBoss];
    return `A powerful ${boss.name} appears! This is a boss encounter!`;
}

// FAST combat handler
function handleCombatOffline(message) {
    if (!gameState.enemies || gameState.enemies.length === 0) {
        const genreContent = getGenreContent();
        const allEnemies = [...genreContent.regularEnemies, ...genreContent.bossEnemies];

        let enemyData = findSpawnEnemy(allEnemies);
        const enemy = {
            name: enemyData.name,
            hp: enemyData.hp,
            max_hp: enemyData.hp,
            level: enemyData.level,
            xp: enemyData.xp,
            drops: enemyData.drops
        };
        gameState.enemies = [enemy];
        handleUnderleveledSpawn(enemy);
        return `You prepare for battle! A ${enemy.name} (Level ${enemy.level}) appears and attacks!`;
    }

    const enemy = gameState.enemies[0];
    const playerAttack = 10 + (gameState.level * 5);
    const enemyAttack = 8 + (enemy.level * 4);
    
    // Enhanced combat calculations
    const playerDamage = Math.floor(Math.random() * 11) + playerAttack - 5;
    enemy.hp -= playerDamage;
    
    let response = `You attack the ${enemy.name} dealing ${playerDamage} damage! `;
    
    if (enemy.hp <= 0) {
        const xpGain = enemy.xp;
        gameState.xp += xpGain;
        gameState.enemies = [];
        
        // Only add to defeated enemies if it's a regular enemy (not a boss)
        if (!FINAL_BOSS_NAMES.includes(enemy.name) && !gameState.defeatedEnemies.includes(enemy.name)) {
            gameState.defeatedEnemies.push(enemy.name);
        }
        
        grantKillRewards(enemy);
        
        response += `You defeat the ${enemy.name} and gain ${xpGain} XP!`;
        
        if (Math.random() > 0.3) {
            const item = enemy.drops[Math.floor(Math.random() * enemy.drops.length)];
            gameState.inventory.push(item);
            response += ` The enemy drops a ${item}!`;
        }
        
        const goldReward = enemy.level * 5;
        gameState.gold += goldReward;
        response += ` You find ${goldReward} gold coins.`;
    } else {
        const enemyDamage = Math.floor(Math.random() * 9) + enemyAttack - 3;
        gameState.hp = Math.max(0, gameState.hp - enemyDamage);
        response += `The ${enemy.name} counterattacks! You take ${enemyDamage} damage. HP: ${gameState.hp}/${gameState.maxHp}`;
        
        if (gameState.hp <= 0) {
            response += " You have been defeated! The adventure ends here.";
            gameState.gameOver = true;
        }
    }
    
    return response;
}

// FAST exploration
function handleExplorationOffline(message) {
    const genreContent = getGenreContent();
    const events = genreContent.explorationEvents;
    
    let response = events[Math.floor(Math.random() * events.length)];
    
    // Exploration rewards
    const rewards = [];
    
    if (Math.random() > 0.5) {
        const commonItems = ['Health Potion', 'Torch', 'Rations', 'Water Flask'];
        const item = commonItems[Math.floor(Math.random() * commonItems.length)];
        gameState.inventory.push(item);
        rewards.push(`a ${item}`);
    }
    
    if (Math.random() > 0.7) {
        const goldFound = Math.floor(Math.random() * 16) + 5 * gameState.level;
        gameState.gold += goldFound;
        rewards.push(`${goldFound} gold coins`);
    }
    
    if (rewards.length > 0) {
        response += ` You find ${rewards.join(' and ')}.`;
    }
    
    // Chance to encounter enemy (10% chance for boss encounter)
    if (Math.random() > 0.6 && !gameState.enemies.length) {
        if (Math.random() < 0.1) {
            // Boss encounter
            response += " " + createBossEncounter();
        } else {
            // Regular enemy encounter
            const genreContent = getGenreContent();
            let enemyData = findSpawnEnemy(genreContent.regularEnemies);
            if (enemyData) {
                const enemy = {
                    name: enemyData.name,
                    hp: 30 * enemyData.level,
                    max_hp: 30 * enemyData.level,
                    level: enemyData.level,
                    xp: 20 * enemyData.level,
                    drops: ['Health Potion']
                };
                gameState.enemies = [enemy];
                handleUnderleveledSpawn(enemy);
                response += ` Suddenly, a ${enemy.name} appears!`;
            }
        }
    }
    
    return response;
}

// FAST rest handler
function handleRestOffline(message) {
    const genreContent = getGenreContent();
    const baseHeal = 20 + (gameState.level * 5);
    const healAmount = Math.floor(Math.random() * 11) + baseHeal - 5;
    const oldHp = gameState.hp;
    gameState.hp = Math.min(gameState.maxHp, gameState.hp + healAmount);
    const actualHeal = gameState.hp - oldHp;
    
    let response = `You take a moment to rest and recover. You regain ${actualHeal} HP. Current HP: ${gameState.hp}/${gameState.maxHp}`;
    
    // Random event during rest
    if (Math.random() > 0.7) {
        const events = genreContent.restEvents;
        response += ` ${events[Math.floor(Math.random() * events.length)]}`;
    }
    
    return response;
}

// FAST movement handler
function handleMovementOffline(message) {
    const genreContent = getGenreContent();
    const locations = genreContent.locations;
    const locationDescriptions = genreContent.locationDescriptions;
    
    const availableLocations = locations.filter(loc => loc !== gameState.location);
    if (availableLocations.length > 0) {
        const newLocation = availableLocations[Math.floor(Math.random() * availableLocations.length)];
        gameState.location = newLocation;
        if (!gameState.visitedLocations.includes(newLocation)) {
            gameState.visitedLocations.push(newLocation);
        }
        
        let response = `You travel to ${newLocation}. ${locationDescriptions[newLocation]}`;
        
        // Higher chance of encounters in dangerous locations
        const dangerousLocations = locations.filter((_, index) => index > 2); // Last few locations are more dangerous
        if (dangerousLocations.includes(newLocation) && Math.random() > 0.3 && !gameState.enemies) {
            const genreContent = getGenreContent();
            const allEnemies = [...genreContent.regularEnemies, ...genreContent.bossEnemies];
            let enemyData = findSpawnEnemy(allEnemies);
            const enemy = {
                name: enemyData.name,
                hp: 30 * enemyData.level,
                max_hp: 30 * enemyData.level,
                level: enemyData.level,
                xp: 20 * enemyData.level,
                drops: ['Greater Health Potion']
            };
            gameState.enemies = [enemy];
            handleUnderleveledSpawn(enemy);
            response += ` A ${enemy.name} emerges, blocking your path!`;
        }
        
        return response;
    }
    
    return "You're already familiar with this area. Perhaps you should explore it more thoroughly.";
}

// FAST inventory handler
function handleInventoryOffline(message) {
    if (gameState.inventory && gameState.inventory.length > 0) {
        // Create a count of each item
        const itemCounts = {};
        for (const item of gameState.inventory) {
            itemCounts[item] = (itemCounts[item] || 0) + 1;
        }
        
        // Build the inventory display
        let inventoryText = "You check your inventory:\n\n";
        
        Object.entries(itemCounts).forEach(([item, count]) => {
            const icons = {
                'Health Potion': '❤️',
                'Greater Health Potion': '💖',
                'Mana Potion': '🔮',
                'Torch': '🔦',
                'Water Flask': '💧',
                'Rations': '🍖',
                'Rope': '🪢',
                'Magic Sword': '⚔️',
                'Leather Armor': '🛡️',
                'Rusty Dagger': '🔪',
                'Iron Sword': '🗡️',
                'Spell Scroll': '📜',
                'Dragon Scale': '🐉',
                'Ancient Artifact': '💎',
                'Ancient Scroll': '📜',
                'Crystal Shard': '💎',
                'Enchanted Amulet': '✨',
                'Excalibur': '⚔️',
                'Phoenix Feather': '🔥',
                'Dragon Heart': '🐉',
                'Crown of Kings': '👑',
                'Troll Hide': '🛡️',
                'Bone Dust': '💀',
                'Ancient Coin': '💰',
                // Sci-fi items
                'Energy Cell': '🔋',
                'Laser Pistol': '🔫',
                'Medkit': '💊',
                'Data Chip': '💿',
                'Plasma Rifle': '🔫',
                'Quantum Processor': '🧠',
                // Mystery items
                'Brass Knuckles': '👊',
                'Silenced Pistol': '🔫',
                'Ritual Dagger': '🔪',
                'Research Notes': '📄',
                'Haunted Locket': '📿'
            };
            
            const icon = icons[item] || '📦';
            inventoryText += `${icon} ${item} x${count}\n`;
        });
        
        // Add gold information
        if (gameState.gold > 0) {
            inventoryText += `\n💰 Gold: ${gameState.gold} coins`;
        }
        
        return inventoryText;
    } else {
        return "Your inventory is empty. Explore areas to find useful items!";
    }
}

// FAST item use handler
function handleItemUseOffline(message) {
    const lowerMessage = message.toLowerCase();
    let response = "You need to specify which item to use.";
    
    if (lowerMessage.includes('health potion') && gameState.inventory.includes('Health Potion')) {
        const healAmount = 30 + (gameState.level * 5);
        const oldHp = gameState.hp;
        gameState.hp = Math.min(gameState.maxHp, gameState.hp + healAmount);
        const actualHeal = gameState.hp - oldHp;
        gameState.inventory = gameState.inventory.filter(item => item !== 'Health Potion');
        response = `You drink a Health Potion and recover ${actualHeal} HP. Current HP: ${gameState.hp}/${gameState.maxHp}`;
    } else if (lowerMessage.includes('greater health potion') && gameState.inventory.includes('Greater Health Potion')) {
        const healAmount = 60 + (gameState.level * 8);
        const oldHp = gameState.hp;
        gameState.hp = Math.min(gameState.maxHp, gameState.hp + healAmount);
        const actualHeal = gameState.hp - oldHp;
        gameState.inventory = gameState.inventory.filter(item => item !== 'Greater Health Potion');
        response = `You drink a Greater Health Potion and recover ${actualHeal} HP. Current HP: ${gameState.hp}/${gameState.maxHp}`;
    } else if (lowerMessage.includes('mana potion') && gameState.inventory.includes('Mana Potion')) {
        gameState.inventory = gameState.inventory.filter(item => item !== 'Mana Potion');
        response = "You drink a Mana Potion. Magical energy courses through your veins, enhancing your abilities temporarily.";
    } else if (lowerMessage.includes('medkit') && gameState.inventory.includes('Medkit')) {
        const healAmount = 40 + (gameState.level * 6);
        const oldHp = gameState.hp;
        gameState.hp = Math.min(gameState.maxHp, gameState.hp + healAmount);
        const actualHeal = gameState.hp - oldHp;
        gameState.inventory = gameState.inventory.filter(item => item !== 'Medkit');
        response = `You use a Medkit and recover ${actualHeal} HP. Current HP: ${gameState.hp}/${gameState.maxHp}`;
    } else {
        // Try to find any mentioned item
        for (const item of gameState.inventory) {
            if (lowerMessage.includes(item.toLowerCase())) {
                gameState.inventory = gameState.inventory.filter(i => i !== item);
                response = `You use the ${item}. It serves its purpose well.`;
                break;
            }
        }
    }
    
    return response;
}

// FAST status check handler
function handleStatusCheckOffline(message) {
    let response = `Character Status:\n`;
    response += `Name: ${gameState.playerName}\n`;
    response += `Level: ${gameState.level}\n`;
    response += `HP: ${gameState.hp}/${gameState.maxHp}\n`;
    response += `XP: ${gameState.xp}/${gameState.xpToNextLevel}\n`;
    response += `Location: ${gameState.location}\n`;
    response += `Gold: ${gameState.gold}\n`;
    response += `Visited Locations: ${gameState.visitedLocations.length}`;
    response += `\nDefeated Enemies: ${gameState.defeatedEnemies.length}`;
    
    if (gameState.enemies && gameState.enemies.length > 0) {
        response += `\nCurrent Enemy: ${gameState.enemies[0].name} (Level ${gameState.enemies[0].level})`;
    }
    
    return response;
}

// FAST general action handler
function handleGeneralActionOffline(message) {
    const genreContent = getGenreContent();
    let response = "";
    
    if (gameState.enemies && gameState.enemies.length > 0) {
        const enemy = gameState.enemies[0];
        const responses = [
            `The ${enemy.name} growls menacingly. You need to decide your next move in combat.`,
            `With the ${enemy.name} before you, the tension is palpable. What will you do?`,
            `The battle continues! The ${enemy.name} awaits your action.`
        ];
        response = responses[Math.floor(Math.random() * responses.length)];
    } else {
        const locationDesc = genreContent.locationDescriptions[gameState.location] || "In this mysterious place,";
        const responses = [
            `${locationDesc} your actions shape the world around you.`,
            `${locationDesc} every choice leads to new possibilities.`,
            `${locationDesc} the adventure continues based on your decisions.`,
            `${locationDesc} what destiny will you forge next?`
        ];
        response = responses[Math.floor(Math.random() * responses.length)];
    }
    
    // Add helpful hint
    const hints = [
        " Try exploring, resting, or checking your inventory.",
        " You can attack enemies, move to new locations, or use items.",
        " Consider your options carefully - each action has consequences."
    ];
    response += hints[Math.floor(Math.random() * hints.length)];
    
    return response;
}

// Enhanced level up with better rewards
function checkLevelUp() {
    let leveled = false;
    while (gameState.xp >= gameState.xpToNextLevel) {
        leveled = true;
        const oldLevel = gameState.level;
        gameState.level++;
        gameState.xp = gameState.xp - gameState.xpToNextLevel;
        gameState.xpToNextLevel = Math.floor(gameState.xpToNextLevel * 1.5);

        const oldMaxHp = gameState.maxHp;
        gameState.maxHp += 20 + (gameState.level * 2);
        gameState.hp = gameState.maxHp;

        let levelUpMessage = `🎉 LEVEL UP! You are now Level ${gameState.level}! `;
        levelUpMessage += `Your maximum HP increased from ${oldMaxHp} to ${gameState.maxHp}. `;
        levelUpMessage += `You are fully healed!`;

        const rewards = [];
        if (gameState.level % 3 === 0) {
            const uncommonItems = ['Magic Sword', 'Greater Health Potion', 'Mana Potion', 'Leather Armor'];
            const rewardItem = uncommonItems[Math.floor(Math.random() * uncommonItems.length)];
            gameState.inventory.push(rewardItem);
            rewards.push(rewardItem);
        }

        const goldReward = gameState.level * 10;
        gameState.gold += goldReward;
        rewards.push(`${goldReward} gold`);

        if (rewards.length > 0) {
            levelUpMessage += ` You receive: ${rewards.join(' and ')}!`;
        }

        addMessage(levelUpMessage, 'ai');
        updateStatusDisplay();
        showAchievement(`Reached Level ${gameState.level}`, "Your journey continues to grow more epic!");
        
        if (gameState.level % 3 === 0) {
            gameState.readyForBattle = true;
            addMessage("You feel battle-ready. Your training and experience make you prepared for tougher foes.", 'ai');
        }
    }
    return leveled;
}

// Enhanced status display with animations
function updateStatusDisplay() {
    document.getElementById('char-name').textContent = gameState.playerName;
    document.getElementById('char-hp').textContent = `${gameState.hp}/${gameState.maxHp}`;
    document.getElementById('char-level').textContent = gameState.level;
    document.getElementById('char-xp').textContent = `${gameState.xp}/${gameState.xpToNextLevel}`;
    document.getElementById('char-gold').textContent = gameState.gold;
    document.getElementById('game-location').textContent = gameState.location;
    document.getElementById('game-genre').textContent = gameState.genre.charAt(0).toUpperCase() + gameState.genre.slice(1);
    
    // Enhanced progress bars with smooth transitions
    const hpPercentage = (gameState.hp / gameState.maxHp) * 100;
    const xpPercentage = (gameState.xp / gameState.xpToNextLevel) * 100;
    
    document.getElementById('hp-bar').style.width = hpPercentage + '%';
    document.getElementById('xp-bar').style.width = Math.min(xpPercentage, 100) + '%';
    
    // Enhanced enemies display
    if (gameState.enemies && gameState.enemies.length > 0) {
        document.getElementById('game-enemies').textContent = `${gameState.enemies[0].name} (Level ${gameState.enemies[0].level})`;
        document.getElementById('game-enemies').style.color = 'var(--accent-pink)';
    } else {
        document.getElementById('game-enemies').textContent = 'None';
        document.getElementById('game-enemies').style.color = 'var(--accent-cyan)';
    }
    
    // Enhanced inventory display
    const inventoryList = document.getElementById('inventory-list');
    inventoryList.innerHTML = '';
    
    if (gameState.inventory.length === 0) {
        inventoryList.innerHTML = '<div class="inventory-item"><span class="item-name" style="color: var(--text-muted);">No items</span></div>';
    } else {
        const itemCounts = {};
        for (const item of gameState.inventory) {
            itemCounts[item] = (itemCounts[item] || 0) + 1;
        }
        
        Object.entries(itemCounts).forEach(([item, count]) => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'inventory-item';
            itemDiv.style.opacity = '0';
            itemDiv.style.transform = 'translateX(-10px)';
            
            const icons = {
                'Health Potion': '❤️',
                'Greater Health Potion': '💖',
                'Mana Potion': '🔮',
                'Torch': '🔦',
                'Water Flask': '💧',
                'Rations': '🍖',
                'Rope': '🪢',
                'Magic Sword': '⚔️',
                'Leather Armor': '🛡️',
                'Rusty Dagger': '🔪',
                'Iron Sword': '🗡️',
                'Spell Scroll': '📜',
                'Dragon Scale': '🐉',
                'Ancient Artifact': '💎',
                'Ancient Scroll': '📜',
                'Crystal Shard': '💎',
                'Enchanted Amulet': '✨',
                'Excalibur': '⚔️',
                'Phoenix Feather': '🔥',
                'Dragon Heart': '🐉',
                'Crown of Kings': '👑',
                'Troll Hide': '🛡️',
                'Bone Dust': '💀',
                'Ancient Coin': '💰'
            };
            
            const icon = icons[item] || '📦';
            
            itemDiv.innerHTML = `
                <span class="item-icon">${icon}</span>
                <span class="item-name">${item} ${count > 1 ? `(x${count})` : ''}</span>
            `;
            inventoryList.appendChild(itemDiv);
            
            // Staggered animation
            setTimeout(() => {
                itemDiv.style.opacity = '1';
                itemDiv.style.transform = 'translateX(0)';
            }, Object.keys(itemCounts).indexOf(item) * 50);
        });
    }
}

// Enhanced achievement popup
function showAchievement(title, description) {
    const popup = document.createElement('div');
    popup.classList.add('achievement-popup');
    popup.style.opacity = '0';
    popup.style.transform = 'scale(0.8) translate(-50%, -50%)';
    
    popup.innerHTML = `
        <div class="achievement-icon">🏆</div>
        <div class="achievement-title">${title}</div>
        <div class="achievement-desc">${description}</div>
        <button class="choice-btn" onclick="this.parentElement.remove()">Awesome!</button>
    `;
    
    document.body.appendChild(popup);
    
    // Enhanced animation
    setTimeout(() => {
        popup.style.opacity = '1';
        popup.style.transform = 'scale(1) translate(-50%, -50%)';
    }, 10);
    
    // Enhanced auto-remove
    setTimeout(() => {
        if (popup.parentElement) {
            popup.style.opacity = '0';
            popup.style.transform = 'scale(0.8) translate(-50%, -50%)';
            setTimeout(() => popup.remove(), 300);
        }
    }, 5000);
}

// Enhanced quick actions
function quickAction(action) {
    const actions = {
        'explore': 'explore the area',
        'rest': 'rest and recover',
        'inventory': 'check inventory',
        'status': 'check character status'
    };
    
    userInput.value = actions[action];
    sendMessage();
}

// FAST activities with better feedback
function hunt() {
    if (gameState.gameOver) { 
        addMessage('You cannot hunt while defeated.', 'ai'); 
        return; 
    }
    
    const xpGain = 10 + Math.floor(Math.random() * 11) + Math.floor(gameState.level * 2);
    gameState.xp += xpGain;
    addMessage(`You go hunting and gain ${xpGain} XP.`, 'ai');
    
    if (Math.random() > 0.6) {
        const loot = ['Ration', 'Leather Strip', 'Minor Rune'];
        const item = loot[Math.floor(Math.random() * loot.length)];
        gameState.inventory.push(item);
        addMessage(`You found: ${item}`, 'ai');
    }
    
    updateActivityProgress();
    checkLevelUp();
    updateStatusDisplay();
}

function practice() {
    if (gameState.gameOver) { 
        addMessage('You cannot practice while defeated.', 'ai'); 
        return; 
    }
    
    const xpGain = 8 + Math.floor(Math.random() * 7) + Math.floor(gameState.level);
    gameState.xp += xpGain;
    addMessage(`You spend time practicing and gain ${xpGain} XP.`, 'ai');
    
    if (Math.random() > 0.7) {
        const loot = ['Minor Amulet', 'Training Token'];
        const item = loot[Math.floor(Math.random() * loot.length)];
        gameState.inventory.push(item);
        addMessage(`Practice reward: ${item}`, 'ai');
    }
    
    updateActivityProgress();
    checkLevelUp();
    updateStatusDisplay();
}

function doJob() {
    if (gameState.gameOver) { 
        addMessage('You cannot do jobs while defeated.', 'ai'); 
        return; 
    }
    
    const xpGain = 6 + Math.floor(Math.random() * 9) + Math.floor(gameState.level / 2);
    const goldGain = 5 + Math.floor(Math.random() * 10) + gameState.level;
    gameState.xp += xpGain;
    gameState.gold += goldGain;
    addMessage(`You complete a job: +${xpGain} XP and +${goldGain} gold.`, 'ai');
    
    if (Math.random() > 0.8) {
        const loot = ['Tool Kit', 'Minor Rune'];
        const item = loot[Math.floor(Math.random() * loot.length)];
        gameState.inventory.push(item);
        addMessage(`Job bonus: ${item}`, 'ai');
    }
    
    updateActivityProgress();
    checkLevelUp();
    updateStatusDisplay();
}

function updateActivityProgress() {
    if (gameState.requiredActivitiesForReadiness > 0) {
        gameState.activityProgress += 1;
        addMessage(`Activity progress: ${gameState.activityProgress}/${gameState.requiredActivitiesForReadiness}`, 'ai');
        if (gameState.activityProgress >= gameState.requiredActivitiesForReadiness) {
            gameState.readyForBattle = true;
            gameState.requiredActivitiesForReadiness = 0;
            gameState.activityProgress = 0;
            addMessage('You feel prepared for battle after completing your training and tasks.', 'ai');
        }
    }
}

function restartGame() {
    if (confirm('Are you sure you want to restart?')) {
        window.location.href = '/game-setup?name=' + encodeURIComponent(gameState.playerName) + '&genre=' + gameState.genre;
    }
}

function grantKillRewards(enemy) {
    const giftsByLevel = {
        1: ['Ration', 'Lesser Rune'],
        2: ['Minor Amulet', 'Iron Tincture'],
        3: ['Greater Rune', 'Enchanted Band']
    };
    const possibleGifts = giftsByLevel[enemy.level] || ['Coin Pouch'];
    
    if (Math.random() > 0.4) {
        const gift = possibleGifts[Math.floor(Math.random() * possibleGifts.length)];
        gameState.inventory.push(gift);
        addMessage(`You receive a gift: ${gift}`, 'ai');
    }

    const bonusXp = Math.floor(enemy.level * 5 + Math.random() * 6);
    gameState.xp += bonusXp;
    addMessage(`Bonus XP gained: ${bonusXp}`, 'ai');
    checkLevelUp();
}

// Event listeners with enhanced feedback
document.addEventListener('DOMContentLoaded', function() {
    initGame();
    
    sendBtn.addEventListener('click', sendMessage);
    
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Enhanced input focus effects
    userInput.addEventListener('focus', function() {
        this.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.3)';
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
});