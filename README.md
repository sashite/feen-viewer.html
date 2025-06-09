# FEEN Viewer

A simple, interactive web-based viewer for **FEEN** (Forsyth–Edwards Enhanced Notation) board game positions.

## Overview

FEEN Viewer is a client-side web application that parses and visualizes board game positions encoded in the FEEN format. It provides a clean, responsive interface for displaying Chess, Shōgi, Xiangqi, and hybrid board game positions with support for captured pieces and cross-game scenarios.

## Features

### Core Functionality
- **FEEN Parsing**: Full compliance with FEEN specification v1.0.0
- **Visual Board Display**: Interactive 2D board representation with piece placement
- **Multi-Game Support**: Chess, Shōgi, Xiangqi, and custom game variants
- **Hybrid Positions**: Cross-game scenarios with different piece sets
- **Captured Pieces**: Display of pieces in hand for each player
- **Real-time Updates**: Instant position visualization as you type

### Technical Features
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Accessibility**: WCAG-compliant with proper ARIA labels and semantic HTML
- **PWA Ready**: Progressive Web App with offline capability
- **SEO Optimized**: Complete meta tags, JSON-LD structured data, and sitemap
- **Error Handling**: Comprehensive validation with helpful error messages

### Supported Formats
- **1D and 2D boards**: Standard rectangular grids and linear arrangements
- **Piece Modifiers**: Promoted pieces (`+`), diminished pieces (`-`), and intermediate states (`'`)
- **Arbitrary Dimensions**: Future-ready for 3D boards (display limitation only)
- **Custom Games**: Any game using valid PNN (Piece Name Notation) identifiers

## Usage

### Basic Usage
1. Open `index.html` in any modern web browser
2. Enter a valid FEEN string in the input field
3. Click "Load Position" to display the board

### Example FEEN Strings

#### Standard Chess Position
```
rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR / CHESS/chess
```

#### Chess Position with Captures
```
r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R 2P/p CHESS/chess
```

#### Shōgi Position with Promoted Pieces
```
lnsgkgsnl/1r5b1/ppppppppp/9/9/2P6/PP1PPPPPP/1B5+R1/LNSGKGSNL 2PB/pr SHOGI/shogi
```

#### Cross-Game Hybrid Position
```
lnsiksnl/1b4r1/pppppppp/8/8/8/PPPPPPPP/RNBQKBNR / CHESS/ogi
```

## Installation

### Simple Deployment
1. Clone or download the repository
2. Serve the files from any web server (Apache, Nginx, GitHub Pages, etc.)
3. No build process required - pure client-side HTML/CSS/JavaScript

### Local Development
```bash
# Clone the repository
git clone https://github.com/sashite/feen-viewer.html.git
cd feen-viewer.html

# Serve locally (Python example)
python -m http.server 8000

# Or use any other static file server
# Navigate to http://localhost:8000
```

## File Structure

```
feen-viewer/
├── index.html              # Main application page
├── app.js                  # Core FEEN parsing and display logic
├── style.css               # Responsive styling and layout
├── robots.txt              # SEO crawler instructions
├── sitemap.xml             # Site structure for search engines
├── site.webmanifest        # PWA configuration
├── favicon.ico             # Legacy favicon
├── favicon/                # Modern icon collection
│   ├── favicon.svg         # Scalable vector icon
│   ├── favicon-96x96.png   # Standard favicon
│   ├── apple-touch-icon.png # iOS home screen icon
│   ├── web-app-manifest-192x192.png # PWA icon
│   └── web-app-manifest-512x512.png # Large PWA icon
├── README.md               # This file
└── LICENSE.md              # MIT license
```

## FEEN Format Overview

FEEN (Forsyth–Edwards Enhanced Notation) extends traditional FEN notation with three space-separated fields:

```
<PIECE-PLACEMENT> <PIECES-IN-HAND> <GAMES-TURN>
```

### Field Descriptions

1. **Piece Placement**: Board configuration using `/` separators for ranks
2. **Pieces in Hand**: Captured pieces available for drop (`UPPERCASE/lowercase`)
3. **Games Turn**: Active player and game identifiers (`GAME1/game2`)

### Key Advantages over FEN
- **Cross-game support**: Mix pieces from different game systems
- **Captured pieces**: Native support for drop mechanics (Shōgi-style)
- **Rule-agnostic**: No game-specific assumptions about legality
- **Extensible**: Ready for 3D and higher-dimensional boards

## Browser Support

### Minimum Requirements
- **Modern Browsers**: Chrome 60+, Firefox 55+, Safari 12+, Edge 79+
- **JavaScript**: ES6+ support required
- **CSS**: Grid and Flexbox support needed

### Tested Platforms
- ✅ Desktop: Windows, macOS, Linux
- ✅ Mobile: iOS Safari, Chrome Mobile, Firefox Mobile
- ✅ Tablets: iPad, Android tablets

## API Reference

### Core Functions

The viewer exposes several utility functions for developers:

```javascript
// Parse a FEEN string into components
const { piecePlacement, piecesInHand, gamesTurn } = parseFeen(feenString);

// Validate FEEN format
try {
  displayPosition(feenString);
} catch (error) {
  console.error('Invalid FEEN:', error.message);
}
```

## Contributing

We welcome contributions to improve FEEN Viewer! Areas for enhancement:

### Development Priorities
- **3D Board Support**: Visual representation of multi-dimensional games
- **Export Features**: Save positions as images or different notation formats
- **Game Rules**: Optional rule validation for specific games
- **Performance**: Optimization for very large boards
- **Internationalization**: Multi-language interface support

### How to Contribute
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards
- **ES6+ JavaScript**: Modern syntax and features
- **Semantic HTML**: Accessible markup structure
- **CSS Grid/Flexbox**: Responsive layout techniques
- **No Dependencies**: Keep the project dependency-free
- **Documentation**: Comment complex logic and update README

## Related Projects

FEEN Viewer is part of the Sashité ecosystem for abstract strategy games:

### Specifications
- **[FEEN Specification](https://sashite.dev/documents/feen/1.0.0/)** - Complete format documentation
- **[PNN (Piece Name Notation)](https://sashite.dev/documents/pnn/1.0.0/)** - Individual piece representation
- **[GAN (General Actor Notation)](https://sashite.dev/documents/gan/1.0.0/)** - Game-qualified piece identifiers
- **[GGN (General Gameplay Notation)](https://sashite.dev/documents/ggn/1.0.0/)** - Move and transformation notation

### Implementations
- **[Feen.rb](https://github.com/sashite/feen.rb)** - Ruby implementation with full FEEN support
- **[Sashite](https://sashite.com/)** - Main project promoting chess variants

## Known Limitations

- **Dimension Support**: Currently limited to 1D and 2D boards (3D+ parsing works, display doesn't)
- **Piece Graphics**: Text-based representation only (no custom piece images)
- **Game Rules**: No move validation or game-specific rule enforcement
- **Performance**: Not optimized for extremely large boards (100x100+)
- **Offline**: Requires initial online load (PWA caching improves subsequent visits)

## Troubleshooting

### Common Issues

**"Invalid FEEN format" Error**
- Ensure three space-separated fields
- Check piece placement uses `/` separators
- Verify pieces in hand format: `UPPERCASE/lowercase`

**Board Not Displaying**
- JavaScript must be enabled
- Check browser console for specific errors
- Ensure FEEN string follows specification

**Pieces Not Showing**
- Verify piece identifiers are valid letters `a-z` or `A-Z`
- Check for proper case usage in all fields
- Confirm modifiers (`+`, `-`, `'`) are correctly placed

### Getting Help
- **Issues**: Report bugs on [GitHub Issues](https://github.com/sashite/feen-viewer.html/issues)
- **Documentation**: Read the [FEEN Specification](https://sashite.dev/documents/feen/1.0.0/)
- **Community**: Join discussions at [Sashité](https://sashite.com/)

## License

Released under the [MIT License](LICENSE.md). Free for personal and commercial use.

## Acknowledgments

- **FEEN Specification**: Created by the Sashité team
- **Inspiration**: Built on the foundation of traditional FEN notation
- **Community**: Thanks to all contributors and users of chess variant notation systems

---

## About Sashité

This project is maintained by [Sashité](https://sashite.com/) - a project dedicated to promoting chess variants and sharing the beauty of Chinese, Japanese, and Western chess cultures.
