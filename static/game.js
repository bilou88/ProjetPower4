(() => {
  const COLS = 7, ROWS = 6;
  const boardEl = document.getElementById('board');
  const turnEl = document.getElementById('turn');
  const scoreP1El = document.getElementById('scoreP1');
  const scoreP2El = document.getElementById('scoreP2');
  const secretBadge = document.getElementById('secretBadge');
  const resetBtn = document.getElementById('resetBtn');
  const newGameBtn = document.getElementById('newGameBtn');
  const helpBtn = document.getElementById('helpBtn');
  const helpModal = document.getElementById('helpModal');
  const closeHelp = document.getElementById('closeHelp');

  let board = createBoard();
  let current = 1;
  let lock = false;
  let score = JSON.parse(localStorage.getItem('mapamobi-score')||'{"p1":0,"p2":0}');
  scoreP1El.textContent = score.p1;
  scoreP2El.textContent = score.p2;

  const secretWord = 'MAPAMOBI';
  let buffer = '';
  const rainbowKey = 'mapamobi-rainbow';
  if (localStorage.getItem(rainbowKey)==='1') {
    enableRainbow();
  }

  renderEmptyBoard();

  function createBoard(){
    return Array.from({length:ROWS}, () => Array(COLS).fill(0));
  }

  function renderEmptyBoard(){
    boardEl.innerHTML = '';
    boardEl.style.setProperty('--cols', COLS);
    boardEl.style.setProperty('--rows', ROWS);

    for (let r=ROWS-1; r>=0; r--) {
      for (let c=0; c<COLS; c++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.role = 'gridcell';
        cell.dataset.row = r;
        cell.dataset.col = c;
        cell.addEventListener('click', () => handleColumnClick(c));
        cell.addEventListener('mouseenter', () => maybePulseColumn(c));
        boardEl.appendChild(cell);
      }
    }
    updateTurnText();
  }

  function handleColumnClick(col){
    if (lock) return;
    const row = nextEmptyRow(col);
    if (row === -1) return;

    lock = true;
    const idx = domIndex(row, col);
    const cell = boardEl.children[idx];
    const token = document.createElement('div');
    token.className = `token ${current===1?'p1':'p2'} drop`;
    cell.appendChild(token);

    token.addEventListener('animationend', () => {
      board[row][col] = current;

      const winLine = checkWin(row,col,current);
      if (winLine) {
        highlightWin(winLine);
        confettiBurst();
        bumpScore(current);
        vibrate(60);
        setTimeout(()=> {
          alert(`Joueur ${current} gagne !`);
          newRound(true);
        }, 50);
      } else if (isDraw()) {
        vibrate(25);
        setTimeout(()=> {
          alert('Match nul !');
          newRound(false);
        }, 50);
      } else {
        current = 3 - current;
        updateTurnText();
        lock = false;
      }
    }, {once:true});
  }

  function nextEmptyRow(col){
    for (let r=0; r<ROWS; r++){
      if (board[r][col]===0) return r;
    }
    return -1;
  }

  function domIndex(row,col){
    const visualRow = (ROWS-1) - row;
    return visualRow*COLS + col;
  }

  function updateTurnText(){
    turnEl.innerHTML = `Au tour de <strong>${current===1?'J1':'J2'}</strong> ${current===1?'🔴':'🟡'}`;
  }

  function countDir(r,c,dr,dc,p){
    let n=0;
    for(let R=r+dr,C=c+dc; R>=0 && R<ROWS && C>=0 && C<COLS && board[R][C]===p; R+=dr, C+=dc) n++;
    return n;
  }

  function checkWin(r,c,p){
    const dirs = [[0,1],[1,0],[1,1],[1,-1]];
    for(const [dr,dc] of dirs){
      const a = countDir(r,c,dr,dc,p);
      const b = countDir(r,c,-dr,-dc,p);
      if (1+a+b >= 4){
        const line = [[r,c]];
        for(let i=1;i<=a;i++) line.push([r+i*dr,c+i*dc]);
        for(let i=1;i<=b;i++) line.unshift([r-i*dr,c-i*dc]);
        return line.slice(0,4);
      }
    }
    return null;
  }

  function isDraw(){
    for(let c=0;c<COLS;c++){
      if (board[ROWS-1][c]===0) return false;
    }
    return true;
  }

  function highlightWin(line){
    for (const [r,c] of line){
      const idx = domIndex(r,c);
      boardEl.children[idx].classList.add('win');
    }
  }

  function newRound(incrementScore){
    board = createBoard();
    current = 1;
    lock = false;
    Array.from(boardEl.children).forEach(cell => {
      cell.classList.remove('win');
      const t = cell.querySelector('.token');
      if (t) t.remove();
    });
    updateTurnText();
  }

  function bumpScore(player){
    if (player===1) score.p1++; else score.p2++;
    scoreP1El.textContent = score.p1;
    scoreP2El.textContent = score.p2;
    localStorage.setItem('mapamobi-score', JSON.stringify(score));
  }

  function confettiBurst(){
    const N = 80;
    const colors = ['#ff7ad9','#6ee7ff','#7dff9e','#ffd33d','#ff425a'];
    for(let i=0;i<N;i++){
      const piece = document.createElement('div');
      piece.className = 'confetti';
      piece.style.left = (Math.random()*100)+'%';
      piece.style.background = colors[(Math.random()*colors.length)|0];
      piece.style.transform = `translateY(-20vh) rotate(${Math.random()*360}deg)`;
      piece.style.animationDelay = (Math.random()*0.4)+'s';
      piece.style.opacity = (0.6 + Math.random()*0.4).toFixed(2);
      piece.style.width = (6+Math.random()*6)+'px';
      piece.style.height = (10+Math.random()*8)+'px';
      boardEl.appendChild(piece);
      piece.addEventListener('animationend', ()=> piece.remove());
    }
  }

  function maybePulseColumn(col){
    vibrate(4);
  }

  function vibrate(ms){
    if (navigator.vibrate) try{ navigator.vibrate(ms); }catch(e){}
  }

  resetBtn?.addEventListener('click', ()=>{
    score = {p1:0,p2:0};
    scoreP1El.textContent = '0';
    scoreP2El.textContent = '0';
    localStorage.setItem('mapamobi-score', JSON.stringify(score));
    newRound(false);
  });

  newGameBtn?.addEventListener('click', ()=> newRound(false));

  helpBtn?.addEventListener('click', ()=> helpModal.showModal());
  closeHelp?.addEventListener('click', ()=> helpModal.close());

  window.addEventListener('keydown', (e)=>{
    if (e.key.length === 1) {
      buffer += e.key.toUpperCase();
      if (buffer.length > secretWord.length) buffer = buffer.slice(-secretWord.length);
      if (buffer.endsWith(secretWord)) {
        enableRainbow();
        localStorage.setItem(rainbowKey,'1');
        secretBadge.hidden = false;
        setTimeout(()=> secretBadge.hidden = true, 3500);
        confettiBurst();
      }
    }
  });

  function enableRainbow(){
    boardEl.classList.add('rainbow');
    document.title = '🌈 MAPAMOBI — Rainbow Mode';
  }
})();