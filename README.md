# FEEN Viewer

[![Demo](https://img.shields.io/badge/Demo-Live-brightgreen)](https://sashite.github.io/feen-viewer.html/)
[![FEEN Spec](https://img.shields.io/badge/FEEN-v1.0.0-blue)](https://sashite.dev/specs/feen/1.0.0/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE.md)

A simple web viewer for **FEEN** (**Field Expression Encoding Notation**) board positions.

FEEN is a minimalistic, rule-agnostic format aimed at capturing static board positions in a canonical, compact, and game-neutral way.

## Usage

Open `index.html` in any modern web browser, or use the [live demo](https://sashite.github.io/feen-viewer.html/).

Enter a valid FEEN string and click **“Load Position”** to visualize the board.

## FEEN Format

FEEN uses three space-separated fields:

```text
<PIECE-PLACEMENT> <PIECES-IN-HAND> <GAMES-TURN>
```

### Examples

```text
# Chess starting position
+rnbq+k^bn+r/+p+p+p+p+p+p+p+p/8/8/8/8/+P+P+P+P+P+P+P+P/+RNBQ+K^BN+R / C/c

# Shōgi starting position
lnsgk^gsnl/1r5b1/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGK^GSNL / S/s

# Cross-style position (Chess vs Makruk)
rnsmk^snr/8/pppppppp/8/8/8/+P+P+P+P+P+P+P+P/+RNBQ+K^BN+R / C/m

# Position with captured pieces
+r1bq+k^b1+r/+p+p+p+p1+p+p+p/2n2n2/4p3/2B1P3/5N2/+P+P+P+P1+P+P+P/+RNBQ+K^2+R 2P/p C/c
```

## Features

* Parse and visualize FEEN positions
* Support for 1D and 2D boards
* Cross-style hybrid games (e.g. Chess vs Makruk)
* Captured pieces display (“pieces in hand”)
* Real-time position updates while editing the FEEN string

## Specifications

* **[FEEN v1.0.0](https://sashite.dev/specs/feen/1.0.0/)** – Field Expression Encoding Notation (position format)
* **[EPIN v1.0.0](https://sashite.dev/specs/epin/1.0.0/)** – Piece identifiers
* **[SIN v1.0.0](https://sashite.dev/specs/sin/1.0.0/)** – Style identifiers

## License

Available as open source under the [MIT License](https://opensource.org/licenses/MIT).

## About

Maintained by [Sashité](https://sashite.com/) — promoting chess variants and sharing the beauty of board game cultures.
