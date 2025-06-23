# FEEN Viewer

[![Demo](https://img.shields.io/badge/Demo-Live-brightgreen)](https://sashite.github.io/feen-viewer.html/)
[![FEEN Spec](https://img.shields.io/badge/FEEN-v1.0.0-blue)](https://sashite.dev/documents/feen/1.0.0/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE.md)

A simple, interactive web-based viewer for **FEEN** (Forsyth–Edwards Enhanced Notation) board game positions.

## Overview

FEEN Viewer is a client-side web application that parses and visualizes board game positions encoded in the FEEN format. It provides a clean, responsive interface for displaying Chess, Shōgi, Xiangqi, and hybrid board game positions with support for captured pieces and cross-style scenarios.

## What is FEEN?

FEEN is like taking a snapshot of any board game position and turning it into a text string. Think of it as a "save file" format that works across different board games - from Chess to Shōgi to custom variants.

**Key Features:**

- **Rule-agnostic**: No knowledge of specific game rules required
- **Canonical**: Equivalent positions yield identical strings
- **Cross-style support**: Handles hybrid configurations with different piece sets
- **Multi-dimensional**: Supports 2D, 3D, and higher dimensional boards
- **Captured pieces**: Full support for pieces-in-hand mechanics
- **Compact**: Efficient representation with compression for empty spaces

## Features

### Core Functionality
- **FEEN Parsing**: Full compliance with FEEN specification v1.0.0
- **Visual Board Display**: Interactive 2D board representation with piece placement
- **Multi-Game Support**: Chess, Shōgi, Xiangqi, and custom game variants
- **Hybrid Positions**: Cross-style scenarios with different piece sets
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
- **Piece Modifiers**: Enhanced pieces (`+`), diminished pieces (`-`), and intermediate states (`'`)
- **Arbitrary Dimensions**: Future-ready for 3D boards (display limitation only)
- **Custom Games**: Any game using valid PNN (Piece Name Notation) identifiers

## Usage

### Basic Usage
1. Open `index.html` in any modern web browser
2. Enter a valid FEEN string in the input field
3. Click "Load Position" to display the board

### Understanding FEEN Format

A FEEN string has exactly **three parts separated by single spaces**:

```
<PIECE-PLACEMENT> <PIECES-IN-HAND> <STYLE-TURN>
```

#### Part 1: Piece Placement

The board shows where pieces are placed, always from the point of view of the player who plays first in the initial position:

- **Pieces**: Represented by PNN notation (case matters!)
  - `K` = piece belonging to first player (uppercase style)
  - `k` = piece belonging to second player (lowercase style)
  - `+P` = enhanced piece (modifier allowed on board)
  - `-R` = diminished piece (modifier allowed on board)
  - `N'` = intermediate state piece (modifier allowed on board)
- **Empty spaces**: Represented by numbers
  - `3` = three empty squares in a row
- **Ranks (rows)**: Separated by `/`
- **Higher dimensions**: Use multiple `/` characters (`//`, `///`, etc.)

#### Part 2: Pieces in Hand

Shows pieces that have been captured and are available for future placement:

- Format: `UPPERCASE_PIECES/lowercase_pieces`
- **Always separated by `/`** even if empty
- **Full PNN notation**: Modifiers allowed per FEEN specification
- Count notation: `3P` means three `P` pieces (never `1P` for single pieces)
- **Canonical sorting**: By quantity (descending), then alphabetical, then modifiers

#### Part 3: Style Turn

Identifies the style type associated with each player and whose turn it is:

- Format: `ACTIVE_PLAYER/INACTIVE_PLAYER`
- **One must be uppercase, other lowercase** (semantically significant casing)
- The uppercase name identifies the style system for uppercase pieces
- The lowercase name identifies the style system for lowercase pieces
- First name refers to the player to move

### Example FEEN Strings

#### Standard Chess Starting Position
```
+rnbq+kbn+r/pppppppp/8/8/8/8/PPPPPPPP/+RNBQ+KBN+R / CHESS/chess
```

#### Chess Position with Captures
```
r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R 2P/p CHESS/chess
```

#### Shōgi Starting Position
```
lnsgkgsnl/1r5b1/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL / SHOGI/shogi
```

#### Shōgi Position with Promoted Pieces
```
lnsgkgsnl/1r5b1/ppppppppp/9/9/2P6/PP1PPPPPP/1B5+R1/LNSGKGSNL 2PB/pr SHOGI/shogi
```

#### Cross-Style Hybrid Position (Chess vs Ōgi)
```
lnsiksnl/1r4b1/pppppppp/8/8/8/PPPPPPPP/+RNBQ+KBN+R / CHESS/ogi
```

#### Irregular Board Shape
```
rkr/pp/PPPP / GAME/game
```

#### 1D Chess Board (size 8) Starting Position
```
kp4PK / CHESS8/chess8
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

## FEEN Format Deep Dive

### Canonical Piece Sorting in Pieces in Hand

Captured pieces are automatically sorted in canonical order according to the FEEN specification:

1. **By player**: Uppercase pieces first, then lowercase pieces (separated by `/`)
2. **By quantity** (descending): Most frequent pieces first
3. **By base letter** (ascending): Alphabetical within same quantity
4. **By prefix** (specific order): For same base letter and quantity: `-`, `+`, then no prefix
5. **By suffix** (specific order): For same prefix: no suffix, then `'`

**Example sorting:**
```
# Input: PP+P'PPP+P'KS'S-PB+B+B+P'BBBPPPSP-P-P'-PRB
# Canonical: 2+B5BK3-P-P'3+P'9PR2SS'/
```

### Cross-Style Support

FEEN can represent positions mixing different game systems:

```
# Chess pieces vs Makruk pieces
KQkm P/s CHESS/makruk

# Shōgi vs Xiangqi
lnsgkg1nl/1r7/ppp1ppppp/3p5/9/2P6/PP1PPPPPP/1B5R1/LNSGKGSNL 2PB/pr SHOGI/xiangqi
```

### Dynamic Piece Ownership

FEEN supports piece ownership changes through capture and redeployment:

```
# A piece's current owner is determined by its case
# Regardless of its original style system
rK / CHESS/shogi  # lowercase 'r' owned by second player
                  # uppercase 'K' owned by first player
```

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
const { piecePlacement, piecesInHand, styleTurn } = parseFeen(feenString);

// Analyze style turn to determine active player
const { activePlayer, firstPlayer, secondPlayer } = analyzeStyleTurn(styleTurn);

// Categorize pieces in hand by player
const { firstPlayerPieces, secondPlayerPieces } = categorizePiecesInHand(piecesInHand);

// Validate FEEN format
try {
  displayPosition(feenString);
} catch (error) {
  console.error('Invalid FEEN:', error.message);
}
```

## FEEN Specification Compliance

This viewer implements **FEEN v1.0.0** specification with the following features:

### Core Properties ✓
- Rule-agnostic representation
- Canonical format enforcement
- Cross-style/hybrid position support
- Multi-dimensional board support (parsing only, 2D display)
- Two-player limitation (exactly)
- 26-piece limit per player (a-z, A-Z)

### Field Support ✓
- **Piece Placement**: Full PNN notation with modifiers on board
- **Pieces in Hand**: Full PNN notation with canonical sorting
- **Style Turn**: SNN-compliant identifiers with semantic casing

### Advanced Features ✓
- Dynamic piece ownership through capture
- Irregular board shapes
- 3D board parsing (display limited to 2D)
- Empty space compression
- Proper dimension separators (`/`, `//`, `///`)

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
- **[SNN (Style Name Notation)](https://sashite.dev/documents/snn/1.0.0/)** - Style identifier format
- **[GAN (General Actor Notation)](https://sashite.dev/documents/gan/1.0.0/)** - Style-qualified piece identifiers

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

**Canonical Sorting Issues**
- Pieces in hand must be sorted according to FEEN specification
- Use validator tools to check canonical format
- Refer to sorting algorithm documentation

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
