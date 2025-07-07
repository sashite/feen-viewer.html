# FEEN Viewer

[![Demo](https://img.shields.io/badge/Demo-Live-brightgreen)](https://sashite.github.io/feen-viewer.html/)
[![FEEN Spec](https://img.shields.io/badge/FEEN-v1.0.0-blue)](https://sashite.dev/specs/feen/1.0.0/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE.md)

A simple web viewer for **FEEN** (Forsyth–Edwards Enhanced Notation) board game positions.

## Usage

Open `index.html` in any modern web browser. Enter a valid FEEN string and click "Load Position".

## FEEN Format

FEEN uses three space-separated fields:

```
<PIECE-PLACEMENT> <PIECES-IN-HAND> <STYLE-TURN>
```

### Examples

```
# Chess starting position
+rnbq+kbn+r/+p+p+p+p+p+p+p+p/8/8/8/8/+P+P+P+P+P+P+P+P/+RNBQ+KBN+R / C/c

# Shōgi starting position
lnsgkgsnl/1r5b1/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL / S/s

# Cross-style position (Chess vs Ōgi)
lnsiksnl/1r4b1/pppppppp/8/8/8/+P+P+P+P+P+P+P+P/+RNBQ+KBN+R / C/o

# Position with captured pieces
r1bqkb1r/+p+p+p+p1+p+p+p/2n2n2/4p3/2B1P3/5N2/+P+P+P+P1+P+P+P/RNBQK2R 2P/p C/c
```

## Features

- Parse and visualize FEEN positions
- Support for 1D and 2D boards
- Cross-style hybrid games
- Captured pieces display
- Real-time position updates

## Specifications

- **[FEEN v1.0.0](https://sashite.dev/specs/feen/1.0.0/)** - Position notation
- **[EPIN v1.0.0](https://sashite.dev/specs/epin/1.0.0/)** - Piece identifiers
- **[SIN v1.0.0](https://sashite.dev/specs/sin/1.0.0/)** - Style identifiers

## License

Available as open source under the [MIT License](https://opensource.org/licenses/MIT).

## About

Maintained by [Sashité](https://sashite.com/) — promoting chess variants and sharing the beauty of board game cultures.
