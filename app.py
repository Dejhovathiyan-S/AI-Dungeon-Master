from flask import Flask, request, jsonify, send_from_directory
import random
import json
import os

app = Flask(__name__)

# Add CORS headers manually
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

# Serve static files
@app.route('/<path:filename>')
def serve_static(filename):
    return send_from_directory('.', filename)

# Simple in-memory storage for game states
game_states = {}
story_states = {}

# Enhanced Game content database (keep your existing content)
game_content = {
    'fantasy': {
        'locations': [
            'Ancient Forest', 'Dragon Cave', 'Enchanted Castle', 
            'Mystic Ruins', 'Elven Village', 'Shadow Swamp',
            'Crystal Caverns', 'Forgotten Temple', 'Mage Tower',
            'Royal Capital', 'Goblin Camp', 'Phoenix Nest'
        ],
        'enemies': [
            {'name': 'Goblin', 'level': 1, 'hp': 30, 'xp': 20, 'drops': ['Health Potion', 'Rusty Dagger']},
            {'name': 'Orc', 'level': 2, 'hp': 50, 'xp': 35, 'drops': ['Health Potion', 'Iron Sword']},
            {'name': 'Forest Troll', 'level': 3, 'hp': 80, 'xp': 50, 'drops': ['Greater Health Potion', 'Troll Hide']},
            {'name': 'Dark Wizard', 'level': 4, 'hp': 60, 'xp': 60, 'drops': ['Mana Potion', 'Spell Scroll']},
            {'name': 'Dragon', 'level': 5, 'hp': 150, 'xp': 100, 'drops': ['Dragon Scale', 'Ancient Artifact']},
            {'name': 'Skeleton Warrior', 'level': 2, 'hp': 40, 'xp': 30, 'drops': ['Bone Dust', 'Ancient Coin']}
        ],
        'items': {
            'common': ['Health Potion', 'Torch', 'Rations', 'Water Flask', 'Rope'],
            'uncommon': ['Magic Sword', 'Greater Health Potion', 'Mana Potion', 'Leather Armor'],
            'rare': ['Ancient Scroll', 'Dragon Scale', 'Crystal Shard', 'Enchanted Amulet'],
            'legendary': ['Excalibur', 'Phoenix Feather', 'Dragon Heart', 'Crown of Kings']
        },
        'events': [
            "You discover a hidden path that leads to a shimmering portal.",
            "An ancient tree whispers secrets of a forgotten kingdom.",
            "A friendly fairy offers to guide you through the forest.",
            "You find a map carved into a stone tablet.",
            "A mysterious fog rolls in, obscuring your vision.",
            "You stumble upon an abandoned campsite with useful supplies.",
            "A magical spring restores your health and energy.",
            "You discover ancient runes that glow with magical energy."
        ]
    },
    'sci-fi': {
        'locations': ['Derelict Space Station', 'Alien Planet', 'Starship Bridge', 'Research Lab', 'Asteroid Field'],
        'enemies': ['Alien Creature', 'Rogue Android', 'Space Pirate', 'Mutant', 'Security Drone'],
        'items': ['Laser Pistol', 'Medkit', 'Data Pad', 'Energy Cell', 'Teleporter'],
        'events': [
            "The ship's AI detects an unknown signal from a nearby planet.",
            "A hull breach alarm sounds - you need to act quickly!",
            "You discover encrypted files that could reveal the station's secrets.",
            "An energy surge temporarily disables all electronic systems.",
            "You find a cryo-pod with someone still inside."
        ]
    },
    'mystery': {
        'locations': ['Haunted Mansion', 'Abandoned Asylum', 'Secluded Cabin', 'Museum After Hours', 'Underground Tunnels'],
        'enemies': ['Mysterious Stranger', 'Cult Member', 'Corrupt Official', 'Secret Society Agent', 'Supernatural Entity'],
        'items': ['Old Diary', 'Cryptic Note', 'Hidden Key', 'Vintage Camera', 'Secret Map'],
        'events': [
            "You find a hidden passage behind a bookshelf.",
            "A sudden power outage plunges everything into darkness.",
            "You discover a collection of old photographs with faces scratched out.",
            "A mysterious phone rings with no one on the other end.",
            "You find bloodstains that weren't there before."
        ]
    }
}

# Preset stories for Story Mode
preset_stories = {
    'fantasy': {
        'title': 'The Last Light of Elarion',
        'tone': 'Epic, magical, emotional',
        'summary': "In the fading kingdom of Elarion...",
        'levels': [...],  # Your existing levels data
        'characters': [...],  # Your existing characters data
        'final_battle': "At the Heart of Elarion..."  # Your existing final battle text
    },
    'sci-fi': {
        'title': 'Echoes Beyond the Stars',
        'tone': 'Futuristic, tense, cinematic',
        'summary': "Aboard the deep‑exploration vessel Event Horizon...",
        'levels': [...],  # Your existing levels data
        'characters': [...],  # Your existing characters data
        'final_battle': "The Event Horizon groans..."  # Your existing final battle text
    },
    'mystery': {
        'title': 'The Midnight Cipher',
        'tone': 'Dark, intelligent, suspenseful',
        'summary': "In a rain-slick modern metropolis...",
        'levels': [...],  # Your existing levels data
        'characters': [...],  # Your existing characters data
        'final_battle': "Deep beneath the city..."  # Your existing final battle text
    }
}

@app.route('/')
def index():
    # Serve your new index.html
    try:
        with open('index.html', 'r', encoding='utf-8') as f:
            return f.read()
    except FileNotFoundError:
        return "Main page not found", 404

@app.route('/game-setup')
def game_setup():
    # Serve the game setup page with your new UI
    try:
        with open('game-setup.html', 'r', encoding='utf-8') as f:
            return f.read()
    except FileNotFoundError:
        # Fallback to original setup page
        return '''
        <!DOCTYPE html>
        <html>
        <head>
            <title>Game Mode Setup</title>
            <link rel="stylesheet" href="style.css">
        </head>
        <body>
            <div class="bg-elements">
                <div class="bg-element bg-1"></div>
                <div class="bg-element bg-2"></div>
                <div class="bg-element bg-3"></div>
            </div>
            
            <div class="setup-container">
                <div class="setup-card">
                    <h1>Game Mode Setup</h1>
                    <form id="setup-form">
                        <div class="form-group">
                            <label for="player-name">Character Name:</label>
                            <input type="text" id="player-name" class="form-control" placeholder="Enter your character name" value="Adventurer">
                        </div>
                        
                        <div class="form-group">
                            <label for="genre">Choose Genre:</label>
                            <select id="genre" class="form-control">
                                <option value="fantasy">Fantasy</option>
                                <option value="sci-fi">Sci-Fi</option>
                                <option value="mystery">Mystery</option>
                            </select>
                        </div>
                        
                        <div class="btn-group">
                            <button type="button" class="btn game-mode" onclick="startGame()">Start Adventure</button>
                            <button type="button" class="btn btn-secondary" onclick="window.location.href='/'">Back</button>
                        </div>
                    </form>
                </div>
            </div>
            
            <script>
                function startGame() {
                    const playerName = document.getElementById('player-name').value || 'Adventurer';
                    const genre = document.getElementById('genre').value;
                    window.location.href = '/game-mode?name=' + encodeURIComponent(playerName) + '&genre=' + genre;
                }
            </script>
        </body>
        </html>
        '''

@app.route('/story-setup')
def story_setup():
    # Serve the story setup page with your new UI
    try:
        with open('story-setup.html', 'r', encoding='utf-8') as f:
            return f.read()
    except FileNotFoundError:
        # Fallback to original setup page
        return '''
        <!DOCTYPE html>
        <html>
        <head>
            <title>Story Mode Setup</title>
            <link rel="stylesheet" href="style.css">
        </head>
        <body>
            <div class="bg-elements">
                <div class="bg-element bg-1"></div>
                <div class="bg-element bg-2"></div>
                <div class="bg-element bg-3"></div>
            </div>
            
            <div class="setup-container">
                <div class="setup-card">
                    <h1>Story Mode Setup</h1>
                    <form id="setup-form">
                        <div class="form-group">
                            <label for="player-name">Your Name:</label>
                            <input type="text" id="player-name" class="form-control" placeholder="Enter your name" value="Storyteller">
                        </div>
                        
                        <div class="form-group">
                            <label for="genre">Choose Genre:</label>
                            <select id="genre" class="form-control">
                                <option value="fantasy">Fantasy</option>
                                <option value="sci-fi">Sci-Fi</option>
                                <option value="mystery">Mystery</option>
                            </select>
                        </div>
                        
                        <div class="btn-group">
                            <button type="button" class="btn story-mode" onclick="startStory()">Begin Story</button>
                            <button type="button" class="btn btn-secondary" onclick="window.location.href='/'">Back</button>
                        </div>
                    </form>
                </div>
            </div>
            
            <script>
                function startStory() {
                    const playerName = document.getElementById('player-name').value || 'Storyteller';
                    const genre = document.getElementById('genre').value;
                    window.location.href = '/story-mode?name=' + encodeURIComponent(playerName) + '&genre=' + genre;
                }
            </script>
        </body>
        </html>
        '''

@app.route('/game-mode')
def game_mode():
    # Serve your new game-mode.html
    try:
        with open('game-mode.html', 'r', encoding='utf-8') as f:
            return f.read()
    except FileNotFoundError:
        return "Game mode page not found", 404

@app.route('/story-mode')
def story_mode():
    # Serve your new story-mode.html
    try:
        with open('story-mode.html', 'r', encoding='utf-8') as f:
            return f.read()
    except FileNotFoundError:
        return "Story mode page not found", 404

# Keep all your existing API routes - they don't need to change
@app.route('/api/game/start', methods=['POST'])
def start_game():
    data = request.get_json()
    player_name = data.get('player_name', 'Adventurer')
    genre = data.get('genre', 'fantasy')
    
    game_id = str(random.randint(1000, 9999))
    
    # Initialize game state with enhanced fantasy system
    game_states[game_id] = {
        'player_name': player_name,
        'genre': genre,
        'hp': 100,
        'max_hp': 100,
        'level': 1,
        'xp': 0,
        'xp_to_next_level': 100,
        'gold': 0,
        'inventory': ['Torch', 'Water Flask'],
        'location': game_content[genre]['locations'][0],
        'enemies': [],
        'visited_locations': [],
        'game_over': False
    }
    
    # Generate initial scene
    initial_scenes = {
        'fantasy': f"Welcome, {player_name}! You stand at the edge of an ancient forest. Tall trees whisper secrets in the wind, and a narrow path leads into the mysterious depths. The air is thick with magic and possibility.",
        'sci-fi': f"Commander {player_name}, your starship emerges from hyperspace. Before you floats the derelict station XT-7, its lights flickering erratically. Scanners show anomalous energy readings from the core.",
        'mystery': f"Detective {player_name}, the rain pours down as you approach the old Hawthorne Manor. A single light flickers in an upstairs window. The case file in your pocket speaks of strange occurrences and missing persons."
    }
    
    initial_scene = initial_scenes.get(genre, "Your adventure begins now. The world awaits your actions.")
    
    return jsonify({
        'game_id': game_id,
        'message': initial_scene,
        'state': game_states[game_id],
        'choices': ['Explore the area carefully', 'Check your equipment', 'Move forward cautiously']
    })

@app.route('/api/game/action', methods=['POST'])
def game_action():
    data = request.get_json()
    game_id = data.get('game_id')
    action = data.get('action', '')
    
    if game_id not in game_states:
        return jsonify({'error': 'Game not found'}), 404
    
    game_state = game_states[game_id]
    genre = game_state['genre']
    
    # Process action and generate response
    response = process_game_action(action, game_state, genre)
    
    return jsonify(response)

def process_game_action(action, game_state, genre):
    # Your existing process_game_action function
    action_lower = action.lower()
    
    if any(word in action_lower for word in ['attack', 'fight', 'battle', 'kill', 'stab', 'slash']):
        return handle_combat(action, game_state, genre)
    elif any(word in action_lower for word in ['explore', 'search', 'look', 'investigate', 'examine']):
        return handle_exploration(action, game_state, genre)
    elif any(word in action_lower for word in ['rest', 'sleep', 'heal', 'recover']):
        return handle_rest(action, game_state, genre)
    elif any(word in action_lower for word in ['move', 'go', 'travel', 'proceed', 'walk', 'run']):
        return handle_movement(action, game_state, genre)
    elif any(word in action_lower for word in ['inventory', 'items', 'equipment', 'check inventory']):
        return handle_inventory(action, game_state, genre)
    elif any(word in action_lower for word in ['use', 'consume', 'drink', 'eat']):
        return handle_item_use(action, game_state, genre)
    elif any(word in action_lower for word in ['level', 'stats', 'status', 'character']):
        return handle_status_check(action, game_state, genre)
    else:
        return handle_general_action(action, game_state, genre)

# Keep all your existing handler functions (handle_combat, handle_exploration, etc.)
# They should remain exactly as they were in your original app.py

@app.route('/api/story/start', methods=['POST'])
def start_story():
    data = request.get_json()
    player_name = data.get('player_name', 'Storyteller')
    genre = data.get('genre', 'fantasy')
    
    story_id = str(random.randint(1000, 9999))
    
    story_states[story_id] = {
        'player_name': player_name,
        'genre': genre,
        'story_so_far': [],
        'current_scene': '',
        'characters': [],
        'locations': [],
        'tone': 'creative'
    }
    
    # Generate initial prompt
    initial_prompts = {
        'fantasy': f"Welcome, {player_name}, to the realm of Eldoria. Magic flows through every stream, ancient prophecies whisper in the wind, and legends wait to be written. Tell me about your character and the journey that brings you here.",
        'sci-fi': f"Greetings, {player_name}. Aboard the starship Event Horizon, humanity reaches for the stars. Strange signals from deep space, alien artifacts, and cosmic mysteries await. What role do you play in this grand adventure?",
        'mystery': f"Hello, {player_name}. The foggy streets of Ravenport hold secrets in every shadow. Unexplained events, cryptic clues, and suspicious characters fill this noir landscape. What mystery calls to you?"
    }
    
    initial_prompt = initial_prompts.get(genre, "A blank page awaits your story. Where shall we begin?")
    story_states[story_id]['current_scene'] = initial_prompt
    
    return jsonify({
        'story_id': story_id,
        'message': initial_prompt,
        'state': story_states[story_id]
    })

@app.route('/api/story/continue', methods=['POST'])
def continue_story():
    data = request.get_json()
    story_id = data.get('story_id')
    user_input = data.get('user_input', '')
    action = data.get('action', '')
    
    if story_id not in story_states:
        return jsonify({'error': 'Story not found'}), 404
    
    story_state = story_states[story_id]
    
    # Store user input
    if user_input:
        story_state['story_so_far'].append(f"You: {user_input}")
    
    # Process based on action or input
    if action == 'continue':
        response = generate_story_continuation(story_state)
    elif action == 'summarize':
        response = summarize_story(story_state)
    elif action == 'reframe':
        response = reframe_story(story_state)
    else:
        response = process_story_input(user_input, story_state)
    
    # Store AI response
    story_state['story_so_far'].append(f"AI: {response['message']}")
    story_state['current_scene'] = response['message']
    
    return jsonify(response)

# Keep all your existing story mode functions (generate_story_continuation, etc.)

if __name__ == '__main__':
    app.run(debug=True, port=5000)