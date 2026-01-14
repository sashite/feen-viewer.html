# FEEN Viewer

[![Demo](https://img.shields.io/badge/Demo-Live-brightgreen)](https://sashite.github.io/feen-viewer.html/)
[![FEEN Spec](https://img.shields.io/badge/FEEN-v1.0.0-blue)](https://sashite.dev/specs/feen/1.0.0/)
[![License: CC0-1.0](https://img.shields.io/badge/License-CC0_1.0-lightgrey.svg)](https://creativecommons.org/publicdomain/zero/1.0/)

A simple web viewer for **FEEN** (**Field Expression Encoding Notation**) board positions.

FEEN is a minimalistic, rule-agnostic format aimed at capturing static board positions in a canonical, compact, and game-neutral way.

## Usage

Open `index.html` in any modern web browser, or use the [live demo](https://sashite.github.io/feen-viewer.html/).

Enter a valid FEEN string and click **"Load Position"** to visualize the board.

## FEEN Format

FEEN uses three space-separated fields:

```text
<PIECE-PLACEMENT> <PIECES-IN-HAND> <GAMES-TURN>
```

### Examples

```text
# Chess starting position
-rnbqk^bn-r/+p+p+p+p+p+p+p+p/8/8/8/8/+P+P+P+P+P+P+P+P/-RNBQK^BN-R / C/c

# Shōgi starting position
lnsgk^gsnl/1r5b1/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGK^GSNL / S/s

# Cross-style position (Chess vs Makruk)
rnsmk^snr/8/pppppppp/8/8/8/+P+P+P+P+P+P+P+P/-RNBQK^BN-R / C/m

# Position with captured pieces
-r1bqk^b1-r/+p+p+p+p1+p+p+p/2n2n2/4p3/2B1P3/5N2/+P+P+P+P1+P+P+P/-RNBQK^2+R 2P/p C/c
```

## Features

* Parse and visualize FEEN positions
* Support for 1D and 2D boards
* Cross-style hybrid games (e.g. Chess vs Makruk)
* Captured pieces display ("pieces in hand")
* Real-time position updates while editing the FEEN string

## Related Specifications

- [Game Protocol](https://sashite.dev/game-protocol/) — Conceptual foundation
- [FEEN Specification](https://sashite.dev/specs/feen/1.0.0/) — Official specification
- [FEEN Examples](https://sashite.dev/specs/feen/1.0.0/examples/) — Usage examples

## License

Dedicated to the public domain under [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/).
