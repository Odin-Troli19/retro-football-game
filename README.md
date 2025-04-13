# Retro Football Game

A retro-style American football game built with Phaser.js featuring pixel-perfect sprites, frame-by-frame animations, and simple controls inspired by games like Retro Bowl.

## Project Overview

This game recreates the nostalgic feel of classic American football games with:
- Pixel art graphics
- Simple, intuitive controls
- Arcade-style gameplay
- Season management mechanics

## Getting Started

### Prerequisites

- Node.js (v14.0.0 or higher)
- Web browser with JavaScript enabled

### Installation

1. Clone the repository:
```
git clone https://github.com/yourusername/retro-football-game.git
cd retro-football-game
```

2. Install dependencies:
```
npm install
```

3. Start the development server:
```
npm start
```

4. Open your browser and navigate to `http://localhost:8080`

## Project Structure

```
retro-football-game/
├── index.html              # Main HTML entry point
├── assets/                 # Game assets
│   ├── images/             # Sprites and background images
│   ├── audio/              # Sound effects and music
│   └── fonts/              # Pixel fonts
├── src/                    # Source code
│   ├── main.js             # Game configuration and initialization
│   ├── scenes/             # Game scenes (menu, game, etc.)
│   ├── objects/            # Game object classes (players, ball, etc.)
│   ├── managers/           # Game state managers
│   └── utils/              # Utility functions
└── package.json            # Project dependencies and scripts
```

## Game Controls

- **Arrow Keys**: Move player
- **Space**: Pass the ball/Select in menus
- **Z**: Sprint/Tackle
- **X**: Special move
- **Enter**: Pause game

## Features

- **Single-player Campaign**: Play through a season, improve your team
- **Quick Play Mode**: Jump into a game with random teams
- **Team Management**: Draft players, manage roster, improve facilities
- **Retro Aesthetics**: Pixel art graphics and chiptune soundtrack

## Development

### Building for Production

```
npm run build
```

The production build will be available in the `dist/` directory.

### Code Conventions

- Use ES6+ syntax
- Follow the Phaser.js recommended patterns
- Document with JSDoc comments

## Credits

- Game Engine: [Phaser 3](https://phaser.io/)
- Artwork: [Your Name/Studio]
- Sound Effects: [Source]
- Music: [Composer/Source]

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by Retro Bowl and classic football games
- Thanks to the Phaser.js community for their excellent documentation and examples