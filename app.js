// FEEN Viewer - A simple viewer for FEEN notation
// Implements the FEEN specification version 1.0.0

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');
  const main = document.querySelector('main');

  // Parse initial FEEN from input field on page load
  displayPosition(document.querySelector('input[name="feen"]').value);

  // Handle form submission
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const feenInput = form.querySelector('input[name="feen"]').value;
    displayPosition(feenInput);
  });

  /**
   * Main function to parse FEEN and display the position
   * @param {string} feenString - The FEEN notation string
   */
  function displayPosition(feenString) {
    try {
      // Clear previous content
      main.innerHTML = '';

      // Parse FEEN string
      const { piecePlacement, piecesInHand, styleTurn } = parseFeen(feenString);

      // Analyze style turn to determine which player is active and the style associations
      const { activePlayer, firstPlayer, secondPlayer } = analyzeStyleTurn(styleTurn);

      // Categorize pieces in hand by player
      const { firstPlayerPieces, secondPlayerPieces } = categorizePiecesInHand(piecesInHand);

      // Create HTML representation
      const firstPlayerDL = createPlayerDL(firstPlayer, firstPlayerPieces);
      const secondPlayerDL = createPlayerDL(secondPlayer, secondPlayerPieces);
      const boardTable = createBoardTable(piecePlacement, activePlayer);

      // Append to main - first player (uppercase pieces) at top
      main.appendChild(firstPlayerDL);
      main.appendChild(boardTable);
      main.appendChild(secondPlayerDL);
    } catch (error) {
      // Display error message
      main.innerHTML = `<div class="error"><p>Error: ${error.message}</p></div>`;
    }
  }

  /**
   * Parses a FEEN string into its three components
   * @param {string} feenString - The FEEN notation string
   * @returns {Object} The parsed components
   */
  function parseFeen(feenString) {
    if (!feenString || typeof feenString !== 'string') {
      throw new Error('Invalid FEEN: must be a non-empty string');
    }

    const parts = feenString.trim().split(' ');

    if (parts.length !== 3) {
      throw new Error('Invalid FEEN format: must contain three space-separated fields');
    }

    const [piecePlacement, piecesInHand, styleTurn] = parts;

    return { piecePlacement, piecesInHand, styleTurn };
  }

  /**
   * Analyzes the style turn field to determine active player and style associations
   * @param {string} styleTurn - The style turn field from FEEN
   * @returns {Object} Information about the style associations and active player
   */
  function analyzeStyleTurn(styleTurn) {
    if (!styleTurn || typeof styleTurn !== 'string') {
      throw new Error('Invalid style turn: must be a non-empty string');
    }

    const parts = styleTurn.split('/');

    if (parts.length !== 2) {
      throw new Error('Invalid style turn format: must contain two styles separated by "/"');
    }

    const [firstStyle, secondStyle] = parts;

    // Validate format: one must be uppercase, one must be lowercase
    const isFirstUppercase = /^[A-Z][A-Z0-9]*$/.test(firstStyle);
    const isSecondUppercase = /^[A-Z][A-Z0-9]*$/.test(secondStyle);
    const isFirstLowercase = /^[a-z][a-z0-9]*$/.test(firstStyle);
    const isSecondLowercase = /^[a-z][a-z0-9]*$/.test(secondStyle);

    if (
      (isFirstUppercase && isSecondUppercase) ||
      (isFirstLowercase && isSecondLowercase) ||
      (!isFirstUppercase && !isFirstLowercase) ||
      (!isSecondUppercase && !isSecondLowercase)
    ) {
      throw new Error('Invalid style turn format: one style must be uppercase and one lowercase');
    }

    // The first style is always the player to move
    const activePlayer = firstStyle;

    // Determine which player corresponds to uppercase/lowercase pieces
    const firstPlayer = isFirstUppercase ? firstStyle : secondStyle;  // uppercase style
    const secondPlayer = isFirstLowercase ? firstStyle : secondStyle; // lowercase style

    return { activePlayer, firstPlayer, secondPlayer };
  }

  /**
   * Categorizes pieces in hand by player according to FEEN specification
   * @param {string} piecesInHand - The pieces in hand field from FEEN
   * @returns {Object} Pieces categorized by player
   */
  function categorizePiecesInHand(piecesInHand) {
    if (!piecesInHand || typeof piecesInHand !== 'string') {
      throw new Error('Invalid pieces in hand: must be a string');
    }

    // Check for separator
    if (!piecesInHand.includes('/')) {
      throw new Error('Invalid pieces in hand format: must contain "/" separator');
    }

    const parts = piecesInHand.split('/');
    if (parts.length !== 2) {
      throw new Error('Invalid pieces in hand format: must have exactly two parts separated by "/"');
    }

    const [uppercasePiecesStr, lowercasePiecesStr] = parts;

    const firstPlayerPieces = parsePiecesInHandSection(uppercasePiecesStr, true);   // uppercase pieces
    const secondPlayerPieces = parsePiecesInHandSection(lowercasePiecesStr, false); // lowercase pieces

    return { firstPlayerPieces, secondPlayerPieces };
  }

  /**
   * Parses a single section of the pieces in hand field
   * @param {string} section - The section to parse
   * @param {boolean} expectUppercase - Whether to expect uppercase pieces
   * @returns {Array} Array of piece objects with count and identifier
   */
  function parsePiecesInHandSection(section, expectUppercase) {
    if (section === '') {
      return [];
    }

    const pieces = [];
    let i = 0;

    while (i < section.length) {
      let count = 1;

      // Check for numeric prefix (2-9 or multi-digit starting with 1-9)
      if (/[2-9]/.test(section[i])) {
        const numStart = i;
        while (i < section.length && /[0-9]/.test(section[i])) {
          i++;
        }
        count = parseInt(section.slice(numStart, i), 10);
      }

      // Parse the piece with potential modifiers
      if (i >= section.length) {
        throw new Error('Invalid pieces in hand: count without piece identifier');
      }

      const pieceStart = i;
      let prefix = '';
      let basePiece = '';
      let suffix = '';

      // Check for prefix
      if (i < section.length && (section[i] === '+' || section[i] === '-')) {
        prefix = section[i];
        i++;
      }

      // Get the base piece identifier
      if (i >= section.length) {
        throw new Error(`Invalid pieces in hand: prefix "${prefix}" without piece identifier`);
      }

      if (!/^[a-zA-Z]$/.test(section[i])) {
        throw new Error(`Invalid piece identifier in pieces in hand: "${section[i]}"`);
      }

      basePiece = section[i];
      i++;

      // Check for suffix
      if (i < section.length && section[i] === "'") {
        suffix = section[i];
        i++;
      }

      // Validate piece casing matches expectation
      const isUppercase = basePiece === basePiece.toUpperCase();
      if (expectUppercase && !isUppercase) {
        throw new Error(`Lowercase piece "${basePiece}" found in uppercase section`);
      }
      if (!expectUppercase && isUppercase) {
        throw new Error(`Uppercase piece "${basePiece}" found in lowercase section`);
      }

      // Construct full piece identifier
      const piece = prefix + basePiece + suffix;

      pieces.push({ piece, count, basePiece, prefix, suffix });
    }

    // Validate canonical sorting: by count (descending), then base piece alphabetically (ascending), then modifiers
    for (let j = 1; j < pieces.length; j++) {
      const prev = pieces[j - 1];
      const curr = pieces[j];

      if (prev.count < curr.count) {
        throw new Error('Pieces in hand not sorted by count (descending)');
      }

      if (prev.count === curr.count) {
        if (prev.basePiece > curr.basePiece) {
          throw new Error('Pieces in hand not sorted alphabetically by base piece within same count');
        }

        if (prev.basePiece === curr.basePiece) {
          // Check prefix order: '-', '+', then no prefix
          const prefixOrder = { '-': 0, '+': 1, '': 2 };
          if (prefixOrder[prev.prefix] > prefixOrder[curr.prefix]) {
            throw new Error('Pieces in hand not sorted by prefix order within same count and base piece');
          }

          if (prev.prefix === curr.prefix) {
            // Check suffix order: no suffix, then "'"
            const suffixOrder = { '': 0, "'": 1 };
            if (suffixOrder[prev.suffix] > suffixOrder[curr.suffix]) {
              throw new Error('Pieces in hand not sorted by suffix order within same count, base piece, and prefix');
            }
          }
        }
      }
    }

    return pieces;
  }

  /**
   * Creates a definition list for a player
   * @param {string} style - The style name
   * @param {Array} pieces - The pieces in hand for this player
   * @returns {HTMLElement} The definition list
   */
  function createPlayerDL(style, pieces) {
    const dl = document.createElement('dl');

    const styleDt = document.createElement('dt');
    styleDt.textContent = 'Style';

    const styleDd = document.createElement('dd');
    styleDd.textContent = style;

    const piecesDt = document.createElement('dt');
    piecesDt.textContent = 'Pieces in hand';

    const piecesDd = document.createElement('dd');

    if (pieces.length === 0) {
      piecesDd.textContent = 'None';
    } else {
      const ul = document.createElement('ul');

      for (const { piece, count } of pieces) {
        const li = document.createElement('li');

        // Create a span with class 'piece' for consistency with board pieces
        const pieceSpan = document.createElement('span');
        pieceSpan.className = 'piece';

        // Display count prefix if > 1
        const displayText = count > 1 ? `${count}${piece}` : piece;
        pieceSpan.textContent = displayText;

        // Add appropriate class based on case of the base piece
        const basePiece = piece.replace(/^[-+]/, '').replace(/'$/, '');
        if (basePiece === basePiece.toUpperCase()) {
          pieceSpan.classList.add('uppercase');
        } else {
          pieceSpan.classList.add('lowercase');
        }

        li.appendChild(pieceSpan);
        ul.appendChild(li);
      }

      piecesDd.appendChild(ul);
    }

    dl.appendChild(styleDt);
    dl.appendChild(styleDd);
    dl.appendChild(piecesDt);
    dl.appendChild(piecesDd);

    return dl;
  }

  /**
   * Creates a board table from the piece placement field
   * @param {string} piecePlacement - The piece placement field from FEEN
   * @param {string} activePlayer - The active player's style
   * @returns {HTMLElement} The board table
   */
  function createBoardTable(piecePlacement, activePlayer) {
    if (!piecePlacement || typeof piecePlacement !== 'string') {
      throw new Error('Invalid piece placement: must be a non-empty string');
    }

    // Check if this is a multi-dimensional board beyond 2D
    if (piecePlacement.includes('//')) {
      throw new Error('Only 1D and 2D boards are supported in this viewer');
    }

    // Parse the board rows
    const rows = piecePlacement.split('/');

    // Calculate board dimensions
    let maxCols = 0;
    const parsedRows = [];

    for (let i = 0; i < rows.length; i++) {
      let colCount = 0;
      let j = 0;

      while (j < rows[i].length) {
        const char = rows[i][j];

        if (/[1-9]/.test(char)) {
          // Handle multi-digit numbers
          let numStart = j;
          while (j < rows[i].length && /[0-9]/.test(rows[i][j])) {
            j++;
          }
          const emptyCount = parseInt(rows[i].slice(numStart, j), 10);
          colCount += emptyCount;
        } else {
          // Skip piece and modifiers, count as one cell
          if (char === '+' || char === '-') {
            j++; // skip prefix
          }
          if (j < rows[i].length && /[a-zA-Z]/.test(rows[i][j])) {
            j++; // skip piece
          }
          if (j < rows[i].length && rows[i][j] === "'") {
            j++; // skip suffix
          }
          colCount++;
        }
      }

      parsedRows.push({ row: rows[i], colCount });
      maxCols = Math.max(maxCols, colCount);
    }

    // Create the table
    const table = document.createElement('table');

    // Set CSS custom property for column count to ensure proper grid layout
    table.style.setProperty('--board-cols', maxCols);

    // Add caption indicating the active player
    const caption = document.createElement('caption');
    caption.textContent = `${activePlayer}'s turn`;
    table.appendChild(caption);

    // Create the board
    for (let i = 0; i < rows.length; i++) {
      const tr = document.createElement('tr');

      // Parse the row
      let cellIndex = 0;
      let j = 0;

      while (j < rows[i].length) {
        const char = rows[i][j];

        // If it's a number, create that many empty cells
        if (/[1-9]/.test(char)) {
          // Handle multi-digit numbers
          let numStart = j;
          while (j < rows[i].length && /[0-9]/.test(rows[i][j])) {
            j++;
          }
          const emptyCount = parseInt(rows[i].slice(numStart, j), 10);

          for (let k = 0; k < emptyCount; k++) {
            const td = document.createElement('td');
            tr.appendChild(td);
            cellIndex++;
          }

          continue;
        }

        // Handle piece with potential modifiers
        const td = document.createElement('td');

        let prefix = '';
        let basePiece = '';
        let suffix = '';

        // Check for prefix
        if (char === '+' || char === '-') {
          prefix = char;
          j++;

          if (j >= rows[i].length || !/[a-zA-Z]/.test(rows[i][j])) {
            throw new Error(`Invalid piece notation: prefix "${prefix}" without piece identifier`);
          }
        }

        // Get the base piece identifier
        basePiece = rows[i][j];
        j++;

        // Check for suffix
        if (j < rows[i].length && rows[i][j] === "'") {
          suffix = rows[i][j];
          j++;
        }

        // Validate piece identifier
        if (!/^[a-zA-Z]$/.test(basePiece)) {
          throw new Error(`Invalid piece identifier: "${basePiece}"`);
        }

        // Create the piece element
        const pieceElement = document.createElement('span');
        pieceElement.className = 'piece';

        // Add uppercase or lowercase class based on the base piece's case
        if (basePiece === basePiece.toUpperCase()) {
          pieceElement.classList.add('uppercase');
        } else {
          pieceElement.classList.add('lowercase');
        }

        // Combine prefix + piece + suffix for display
        const displayText = prefix + basePiece + suffix;
        pieceElement.textContent = displayText;

        td.appendChild(pieceElement);
        tr.appendChild(td);
        cellIndex++;
      }

      table.appendChild(tr);
    }

    return table;
  }
});
