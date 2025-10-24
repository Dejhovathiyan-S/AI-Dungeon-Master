
# AI Dungeon Master 

An immersive, AI-powered interactive storytelling platform that offers two distinct modes for creative adventures and gaming experiences.

##  Features

### Game Mode 
- **Dynamic RPG System**: Level up, gain XP, and battle enemies
- **Strategic Combat**: Turn-based battles with various enemy types
- **Inventory Management**: Collect and use items, weapons, and potions
- **Exploration System**: Discover new locations and hidden treasures
- **Character Progression**: Stats, equipment, and skill development
- **Multiple Genres**: Fantasy, Sci-Fi, and Mystery settings

### Story Mode 
- **AI-Powered Narrative**: Collaborative storytelling with intelligent AI
- **Creative Writing Focus**: Emphasis on character development and world-building
- **Branching Storylines**: Your choices shape the narrative direction
- **Multiple Perspectives**: Change viewpoints and narrative styles
- **Inspiration Tools**: Get creative prompts and story ideas
- **Genre Flexibility**: Fantasy, Sci-Fi, and Mystery genres

##  Quick Start

### Prerequisites
- Python 3.7+
- Flask
- Modern web browser

### Installation
1. Clone the repository:
```bash
git clone <repository-url>
cd AI-Dungeon-Master
```

2. Install required dependencies:
```bash
pip install flask
```

3. Run the application:
```bash
python app.py
```

4. Open your browser and navigate to:
```
http://localhost:5000
```

##  How to Use

### Game Mode
1. **Setup**: Choose your character name and preferred genre
2. **Explore**: Navigate through different locations and environments
3. **Combat**: Battle enemies using strategic commands
4. **Progress**: Level up your character and collect valuable items
5. **Survive**: Manage your health and resources carefully

**Available Commands:**
- `attack [enemy]` - Engage in combat
- `explore` - Search the current area
- `rest` - Recover health
- `move` - Travel to new locations
- `use [item]` - Consume items from inventory
- `inventory` - Check your items
- `status` - View character stats

### Story Mode
1. **Setup**: Enter your name and choose a genre
2. **Create**: Start writing your story or provide initial prompts
3. **Collaborate**: The AI will respond and build upon your narrative
4. **Guide**: Use action buttons to direct the story flow
5. **Expand**: Develop characters, settings, and plotlines

**Available Actions:**
- **Continue Story**: Let the AI advance the narrative
- **Summarize**: Get a recap of the story so far
- **Change Perspective**: View the story from different angles
- **Get Inspiration**: Receive creative prompts and ideas

##  Genres Available

### Fantasy 
- Magical realms and ancient prophecies
- Mythical creatures and enchanted forests
- Epic quests and legendary artifacts

### Sci-Fi 
- Space exploration and alien encounters
- Advanced technology and cosmic mysteries
- Futuristic societies and interstellar travel

### Mystery 
- Crime investigations and hidden clues
- Suspenseful narratives and plot twists
- Detective work and puzzle solving

##  Technical Stack

- **Backend**: Python Flask
- **Frontend**: HTML5, CSS3, JavaScript
- **Styling**: Custom CSS with modern design
- **Architecture**: Client-server with RESTful API
- **Storage**: In-memory session management

##  Project Structure

```
AI-Dungeon-Master/
├── app.py                 # Main Flask application
├── index.html            # Landing page
├── game-setup.html       # Game mode setup
├── game-mode.html        # Game mode interface
├── game-mode.js          # Game mode client logic
├── story-setup.html      # Story mode setup
├── story-mode.html       # Story mode interface
├── story-mode.js         # Story mode client logic
├── style.css             # Comprehensive styling
└── README.md             # This file
```

##  Game Mechanics

### Character System
- **Health Points (HP)**: Manage your survival
- **Experience Points (XP)**: Earn through battles and exploration
- **Level Progression**: Unlock new abilities and stats
- **Inventory**: Collect and manage items
- **Gold**: Currency for future enhancements

### Combat System
- Turn-based battles with strategic depth
- Enemy variety with different strengths and weaknesses
- Item usage during combat
- XP and loot rewards for victories

### Exploration
- Multiple interconnected locations
- Random events and encounters
- Hidden treasures and secrets
- Environmental storytelling

##  Story Mechanics

### Narrative Tools
- **AI Collaboration**: Intelligent story building
- **Context Awareness**: Maintains story consistency
- **Creative Prompts**: Inspiration for writer's block
- **Genre Adaptation**: Tailored responses for each genre

### Writing Features
- **Character Development**: Deep character arcs and backstories
- **World Building**: Rich, detailed environments
- **Plot Development**: Complex, engaging storylines
- **Emotional Depth**: Nuanced emotional storytelling

##  Customization

The application is highly customizable:

- **Add New Genres**: Extend the genre system in `app.py`
- **Create New Items**: Modify the item database
- **Design New Locations**: Expand the exploration system
- **Implement New Mechanics**: Extend the game logic

##  Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

##  Known Limitations

- Game progress is session-based and doesn't persist after server restart
- No user authentication system
- Limited to single-player experiences
- Basic AI responses without external API integration

##  Future Enhancements

Planned features for future versions:

- **Persistent Save System**
- **Multiplayer Support**
- **Enhanced AI Integration**
- **Mobile App Version**
- **Expanded Item Crafting**
- **More Genre Options**
- **Visual Enhancements**




