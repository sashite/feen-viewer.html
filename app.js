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

      // Analyze style turn to determine which player is active and the style variants
      const { activePlayer, firstPlayerStyle, secondPlayerStyle } = analyzeStyleTurn(styleTurn);

      // Categorize pieces in hand by player
      const { firstPlayerPieces, secondPlayerPieces } = categorizePiecesInHand(piecesInHand);

      // Create HTML representation - pieces are assigned by position in PIECES-IN-HAND, not by case
      // firstPlayerPieces (left side of /) always go with firstPlayerStyle (uppercase style)
      // secondPlayerPieces (right side of /) always go with secondPlayerStyle (lowercase style)
      const firstPlayerDL = createPlayerDL(firstPlayerStyle, firstPlayerPieces);
      const secondPlayerDL = createPlayerDL(secondPlayerStyle, secondPlayerPieces);
      const boardTable = createBoardTable(piecePlacement, activePlayer, firstPlayerStyle);

      // Determine which player is active and display according to chess convention:
      // - Inactive player at top (opponent's side)
      // - Active player at bottom (our side)
      const isFirstPlayerActive = activePlayer === firstPlayerStyle;
      const activePlayerDL = isFirstPlayerActive ? firstPlayerDL : secondPlayerDL;
      const inactivePlayerDL = isFirstPlayerActive ? secondPlayerDL : firstPlayerDL;

      // Append to main - inactive player at top, active player at bottom (chess convention)
      main.appendChild(inactivePlayerDL);
      main.appendChild(boardTable);
      main.appendChild(activePlayerDL);
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

    const trimmed = feenString.trim();
    if (!trimmed) {
      throw new Error('Invalid FEEN: must be a non-empty string');
    }

    const parts = trimmed.split(' ');

    if (parts.length !== 3) {
      throw new Error('Invalid FEEN format: must contain exactly three space-separated fields');
    }

    const [piecePlacement, piecesInHand, styleTurn] = parts;

    // Validate each field is non-empty
    if (!piecePlacement) {
      throw new Error('Invalid FEEN: piece placement field cannot be empty');
    }
    if (!piecesInHand) {
      throw new Error('Invalid FEEN: pieces in hand field cannot be empty');
    }
    if (!styleTurn) {
      throw new Error('Invalid FEEN: style turn field cannot be empty');
    }

    return { piecePlacement, piecesInHand, styleTurn };
  }

  /**
   * Analyzes the style turn field according to FEEN specification
   * @param {string} styleTurn - The style turn field from FEEN
   * @returns {Object} Information about the styles and active player
   */
  function analyzeStyleTurn(styleTurn) {
    if (!styleTurn || typeof styleTurn !== 'string') {
      throw new Error('Invalid style turn: must be a non-empty string');
    }

    const parts = styleTurn.split('/');

    if (parts.length !== 2) {
      throw new Error('Invalid style turn format: must contain exactly two styles separated by "/"');
    }

    const [firstStyle, secondStyle] = parts;

    // Validate that both styles are non-empty
    if (!firstStyle || !secondStyle) {
      throw new Error('Invalid style turn: both styles must be non-empty');
    }

    // Validate style format according to SNN specification
    const stylePattern = /^[A-Za-z][A-Za-z0-9]*$/;
    if (!stylePattern.test(firstStyle) || !stylePattern.test(secondStyle)) {
      throw new Error('Invalid style format: styles must start with a letter and contain only letters and digits');
    }

    // Validate case: one must be uppercase, one must be lowercase
    const isFirstUppercase = /^[A-Z][A-Z0-9]*$/.test(firstStyle);
    const isSecondUppercase = /^[A-Z][A-Z0-9]*$/.test(secondStyle);
    const isFirstLowercase = /^[a-z][a-z0-9]*$/.test(firstStyle);
    const isSecondLowercase = /^[a-z][a-z0-9]*$/.test(secondStyle);

    if ((isFirstUppercase && isSecondUppercase) || (isFirstLowercase && isSecondLowercase)) {
      throw new Error('Invalid style turn format: one style must be uppercase and one lowercase');
    }

    if ((!isFirstUppercase && !isFirstLowercase) || (!isSecondUppercase && !isSecondLowercase)) {
      throw new Error('Invalid style format: styles must be entirely uppercase or entirely lowercase');
    }

    // The first style is always the player to move (active player)
    const activePlayer = firstStyle;

    // Determine which player corresponds to uppercase/lowercase styles
    // First player ALWAYS has uppercase style, second player ALWAYS has lowercase style
    const firstPlayerStyle = isFirstUppercase ? firstStyle : secondStyle;   // uppercase style (first player)
    const secondPlayerStyle = isFirstLowercase ? firstStyle : secondStyle;  // lowercase style (second player)

    return { activePlayer, firstPlayerStyle, secondPlayerStyle };
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

    const [firstPlayerPiecesStr, secondPlayerPiecesStr] = parts;

    // According to FEEN spec:
    // - Left side of "/" = pieces owned by first player (uppercase style)
    // - Right side of "/" = pieces owned by second player (lowercase style)
    // The pieces themselves can have any case according to game capture rules
    const firstPlayerPieces = parsePiecesInHandSection(firstPlayerPiecesStr, 'first');
    const secondPlayerPieces = parsePiecesInHandSection(secondPlayerPiecesStr, 'second');

    return { firstPlayerPieces, secondPlayerPieces };
  }

  /**
   * Parses a single section of the pieces in hand field
   * @param {string} section - The section to parse
   * @param {string} playerType - 'first' or 'second' for error messages
   * @returns {Array} Array of piece objects with count and identifier
   */
  function parsePiecesInHandSection(section, playerType) {
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

        // Validate count is not 0 or 1 when explicitly stated
        if (count <= 1) {
          throw new Error(`Invalid pieces in hand: count "${count}" not allowed (must be 2 or greater when specified)`);
        }
      }

      // Get the piece identifier (can include PNN modifiers)
      if (i >= section.length) {
        throw new Error('Invalid pieces in hand: count without piece identifier');
      }

      // Parse PNN piece (with potential modifiers)
      const pieceStart = i;
      let prefix = '';
      let suffix = '';
      let piece = '';

      // Check for prefix modifier
      if (i < section.length && (section[i] === '+' || section[i] === '-')) {
        prefix = section[i];
        i++;
      }

      // Get the base piece letter
      if (i >= section.length || !/^[a-zA-Z]$/.test(section[i])) {
        throw new Error(`Invalid piece identifier in pieces in hand: expected letter after prefix`);
      }
      piece = section[i];
      i++;

      // Check for suffix modifier
      if (i < section.length && section[i] === "'") {
        suffix = section[i];
        i++;
      }

      // Build complete piece identifier
      const fullPiece = prefix + piece + suffix;

      pieces.push({ piece: fullPiece, count });
    }

    // Validate sorting according to FEEN specification
    validatePiecesInHandSorting(pieces);

    return pieces;
  }

  /**
   * Validates that pieces in hand are sorted according to FEEN specification
   * @param {Array} pieces - Array of piece objects to validate
   */
  function validatePiecesInHandSorting(pieces) {
    for (let i = 1; i < pieces.length; i++) {
      const prev = pieces[i - 1];
      const curr = pieces[i];

      // Extract base letter for comparison (ignoring modifiers)
      const prevBase = prev.piece.replace(/[+\-']/g, '');
      const currBase = curr.piece.replace(/[+\-']/g, '');

      // Rule 1: Sort by count (descending)
      if (prev.count < curr.count) {
        throw new Error('Pieces in hand not sorted by count (descending)');
      }

      // Rule 2: Within same count, sort by base letter (ascending, case-insensitive)
      if (prev.count === curr.count) {
        const prevLower = prevBase.toLowerCase();
        const currLower = currBase.toLowerCase();

        if (prevLower > currLower) {
          throw new Error('Pieces in hand not sorted alphabetically within same count');
        }

        // Rule 3: Same base letter, uppercase before lowercase
        if (prevLower === currLower && prevBase.toLowerCase() === currBase.toLowerCase()) {
          if (prevBase > currBase) {
            throw new Error('Pieces in hand not sorted by case (uppercase first) within same letter');
          }
        }
      }
    }
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

        // Add appropriate class based on case of the base letter
        const baseLetter = piece.replace(/[+\-']/g, '');
        if (baseLetter === baseLetter.toUpperCase()) {
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
   * Creates a chess board table from the piece placement field
   * @param {string} piecePlacement - The piece placement field from FEEN
   * @param {string} activePlayer - The active player's style
   * @param {string} firstPlayerStyle - The first player's style (uppercase)
   * @returns {HTMLElement} The board table
   */
  function createBoardTable(piecePlacement, activePlayer, firstPlayerStyle) {
    if (!piecePlacement || typeof piecePlacement !== 'string') {
      throw new Error('Invalid piece placement: must be a non-empty string');
    }

    // Check if this is a multi-dimensional board beyond 2D
    if (piecePlacement.includes('//')) {
      throw new Error('Only 1D and 2D boards are supported in this viewer');
    }

    // Parse the board rows/ranks
    const rows = piecePlacement.split('/');

    if (rows.length === 0) {
      throw new Error('Invalid piece placement: no ranks found');
    }

    // Determine if we need to flip the board (when second player is active)
    const shouldFlipBoard = activePlayer !== firstPlayerStyle;

    // Create the table
    const table = document.createElement('table');

    // Add caption indicating the active player
    const caption = document.createElement('caption');
    caption.textContent = `${activePlayer}'s turn`;
    table.appendChild(caption);

    // Determine maximum row width for consistent grid
    let maxCells = 0;
    const parsedRows = [];

    // First pass: parse all rows and determine dimensions
    for (let i = 0; i < rows.length; i++) {
      const parsedCells = parseRank(rows[i]);
      parsedRows.push(parsedCells);
      maxCells = Math.max(maxCells, parsedCells.length);
    }

    // If we need to flip the board, reverse the rows order
    const displayRows = shouldFlipBoard ? [...parsedRows].reverse() : parsedRows;

    // Second pass: create the table with consistent grid
    for (let i = 0; i < displayRows.length; i++) {
      const tr = document.createElement('tr');
      tr.style.gridTemplateColumns = `repeat(${maxCells}, 1fr)`;

      const cells = displayRows[i];

      // If we need to flip the board, also reverse each row
      const displayCells = shouldFlipBoard ? [...cells].reverse() : cells;

      // Add cells for this row
      for (let j = 0; j < displayCells.length; j++) {
        const td = document.createElement('td');

        if (displayCells[j] !== null) {
          // Create the piece element
          const pieceElement = document.createElement('span');
          pieceElement.className = 'piece';

          // Extract base letter for case determination
          const baseLetter = displayCells[j].replace(/[+\-']/g, '');

          // Add uppercase or lowercase class based on the piece's case
          if (baseLetter === baseLetter.toUpperCase()) {
            pieceElement.classList.add('uppercase');
          } else {
            pieceElement.classList.add('lowercase');
          }

          pieceElement.textContent = displayCells[j];
          td.appendChild(pieceElement);
        }

        tr.appendChild(td);
      }

      // Fill remaining cells if this row is shorter than maxCells
      for (let j = displayCells.length; j < maxCells; j++) {
        const td = document.createElement('td');
        tr.appendChild(td);
      }

      table.appendChild(tr);
    }

    return table;
  }

  /**
   * Parses a single rank/row string into an array of pieces/nulls
   * @param {string} rankStr - The rank string to parse
   * @returns {Array} Array where each element is either a piece string or null (empty)
   */
  function parseRank(rankStr) {
    const cells = [];
    let i = 0;

    while (i < rankStr.length) {
      const char = rankStr[i];

      // If it's a number, add that many empty cells
      if (/[1-9]/.test(char)) {
        // Handle multi-digit numbers
        let numStart = i;
        while (i < rankStr.length && /[0-9]/.test(rankStr[i])) {
          i++;
        }
        const emptyCount = parseInt(rankStr.slice(numStart, i), 10);

        for (let k = 0; k < emptyCount; k++) {
          cells.push(null);
        }

        continue;
      }

      // Handle piece with potential modifiers (PNN format)
      let pieceStr = '';

      // Check for prefix
      if (char === '+' || char === '-') {
        pieceStr += char;
        i++;

        if (i >= rankStr.length || !/[a-zA-Z]/.test(rankStr[i])) {
          throw new Error(`Invalid piece notation: prefix "${char}" without piece identifier`);
        }
      }

      // Get the piece identifier
      if (i >= rankStr.length || !/[a-zA-Z]/.test(rankStr[i])) {
        throw new Error(`Invalid piece placement: expected piece letter at position ${i}`);
      }

      pieceStr += rankStr[i];
      i++;

      // Check for suffix
      if (i < rankStr.length && rankStr[i] === "'") {
        pieceStr += rankStr[i];
        i++;
      }

      cells.push(pieceStr);
    }

    return cells;
  }
});
