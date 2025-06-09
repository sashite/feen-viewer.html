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
      const { piecePlacement, piecesInHand, gamesTurn } = parseFeen(feenString);

      // Analyze games turn to determine which player is active and the game variants
      const { activePlayer, firstPlayer, secondPlayer } = analyzeGamesTurn(gamesTurn);

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

    const [piecePlacement, piecesInHand, gamesTurn] = parts;

    return { piecePlacement, piecesInHand, gamesTurn };
  }

  /**
   * Analyzes the games turn field to determine active player and variants
   * @param {string} gamesTurn - The games turn field from FEEN
   * @returns {Object} Information about the game variants and active player
   */
  function analyzeGamesTurn(gamesTurn) {
    if (!gamesTurn || typeof gamesTurn !== 'string') {
      throw new Error('Invalid games turn: must be a non-empty string');
    }

    const parts = gamesTurn.split('/');

    if (parts.length !== 2) {
      throw new Error('Invalid games turn format: must contain two variants separated by "/"');
    }

    const [firstVariant, secondVariant] = parts;

    // Validate format: one must be uppercase, one must be lowercase
    const isFirstUppercase = /^[A-Z]+$/.test(firstVariant);
    const isSecondUppercase = /^[A-Z]+$/.test(secondVariant);
    const isFirstLowercase = /^[a-z]+$/.test(firstVariant);
    const isSecondLowercase = /^[a-z]+$/.test(secondVariant);

    if (
      (isFirstUppercase && isSecondUppercase) ||
      (isFirstLowercase && isSecondLowercase) ||
      (!isFirstUppercase && !isFirstLowercase) ||
      (!isSecondUppercase && !isSecondLowercase)
    ) {
      throw new Error('Invalid games turn format: one variant must be uppercase and one lowercase');
    }

    // The first variant is always the player to move
    const activePlayer = firstVariant;

    // Determine which player corresponds to uppercase/lowercase pieces
    const firstPlayer = isFirstUppercase ? firstVariant : secondVariant;  // uppercase game
    const secondPlayer = isFirstLowercase ? firstVariant : secondVariant; // lowercase game

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

      // Get the piece identifier
      if (i >= section.length) {
        throw new Error('Invalid pieces in hand: count without piece identifier');
      }

      const piece = section[i];

      // Validate piece identifier
      if (!/^[a-zA-Z]$/.test(piece)) {
        throw new Error(`Invalid piece identifier in pieces in hand: "${piece}"`);
      }

      // Validate casing matches expectation
      const isUppercase = piece === piece.toUpperCase();
      if (expectUppercase && !isUppercase) {
        throw new Error(`Lowercase piece "${piece}" found in uppercase section`);
      }
      if (!expectUppercase && isUppercase) {
        throw new Error(`Uppercase piece "${piece}" found in lowercase section`);
      }

      pieces.push({ piece, count });
      i++;
    }

    // Validate sorting: by count (descending) then alphabetically (ascending)
    for (let j = 1; j < pieces.length; j++) {
      const prev = pieces[j - 1];
      const curr = pieces[j];

      if (prev.count < curr.count) {
        throw new Error('Pieces in hand not sorted by count (descending)');
      }

      if (prev.count === curr.count && prev.piece > curr.piece) {
        throw new Error('Pieces in hand not sorted alphabetically within same count');
      }
    }

    return pieces;
  }

  /**
   * Creates a definition list for a player
   * @param {string} variant - The game variant name
   * @param {Array} pieces - The pieces in hand for this player
   * @returns {HTMLElement} The definition list
   */
  function createPlayerDL(variant, pieces) {
    const dl = document.createElement('dl');

    const variantDt = document.createElement('dt');
    variantDt.textContent = 'Game type';

    const variantDd = document.createElement('dd');
    variantDd.textContent = variant;

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

        // Add appropriate class based on case
        if (piece === piece.toUpperCase()) {
          pieceSpan.classList.add('uppercase');
        } else {
          pieceSpan.classList.add('lowercase');
        }

        li.appendChild(pieceSpan);
        ul.appendChild(li);
      }

      piecesDd.appendChild(ul);
    }

    dl.appendChild(variantDt);
    dl.appendChild(variantDd);
    dl.appendChild(piecesDt);
    dl.appendChild(piecesDd);

    return dl;
  }

  /**
   * Creates a chess board table from the piece placement field
   * @param {string} piecePlacement - The piece placement field from FEEN
   * @param {string} activePlayer - The active player's variant
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

    // Create the table
    const table = document.createElement('table');

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

        // Check for prefix
        let prefix = '';
        if (char === '+' || char === '-') {
          prefix = char;
          j++;

          if (j >= rows[i].length || !/[a-zA-Z]/.test(rows[i][j])) {
            throw new Error(`Invalid piece notation: prefix "${prefix}" without piece identifier`);
          }
        }

        // Get the piece identifier
        const piece = rows[i][j];
        j++;

        // Check for suffix
        let suffix = '';
        if (j < rows[i].length && rows[i][j] === "'") {
          suffix = rows[i][j];
          j++;
        }

        // Create the piece element
        const pieceElement = document.createElement('span');
        pieceElement.className = 'piece';

        // Add uppercase or lowercase class based on the piece's case
        if (piece === piece.toUpperCase()) {
          pieceElement.classList.add('uppercase');
        } else {
          pieceElement.classList.add('lowercase');
        }

        // Combine prefix + piece + suffix for display
        let displayText = '';
        if (prefix) displayText += prefix;
        displayText += piece;
        if (suffix) displayText += suffix;

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
