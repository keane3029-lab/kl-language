const CIPHER = {
  A:'ab', B:'bc', C:'cd', D:'de', E:'ef', F:'fg', G:'gh', H:'hi', I:'ij',
  J:'jk', K:'km', L:'lz', M:'mn', N:'no', O:'op', P:'pq', Q:'qr', R:'rs',
  S:'st', T:'tu', U:'uv', V:'vw', W:'wx', X:'xy', Y:'yz', Z:'zz'
};
const EXCEPTIONS = new Set(['K','L','Z']);
const REVERSE = {};
Object.entries(CIPHER).forEach(([letter, code]) => REVERSE[code] = letter);

function klEncode(text){
  let result = '';
  const chips = [];
  for (const ch of text){
    if (ch === ' '){
      result += ' ';
      chips.push({type:'space'});
      continue;
    }
    const upper = ch.toUpperCase();
    if (CIPHER[upper]){
      const code = CIPHER[upper];
      result += code;
      chips.push({type:'letter', letter: upper, code});
    } else {
      result += ch;
      chips.push({type:'raw', letter: ch});
    }
  }
  return { result, chips };
}

function klDecode(text){
  const words = text.split(/(\s+)/);
  let result = '';
  const chips = [];
  for (const w of words){
    if (/^\s+$/.test(w)){
      result += w;
      if (w.includes(' ')) chips.push({type:'space'});
      continue;
    }
    if (w.length === 0) continue;
    let i = 0;
    const letters = w.toLowerCase();
    let wordOut = '';
    while (i < letters.length){
      const pair = letters.slice(i, i+2);
      if (pair.length === 2 && REVERSE[pair]){
        const letter = REVERSE[pair];
        wordOut += letter;
        chips.push({type:'letter', letter, code: pair});
        i += 2;
      } else {
        wordOut += letters[i];
        chips.push({type:'flag', letter: letters[i]});
        i += 1;
      }
    }
    result += wordOut;
  }
  return { result, chips };
}

function buildCipherGrid(container){
  Object.entries(CIPHER).forEach(([letter, code]) => {
    const cell = document.createElement('div');
    cell.className = 'cell' + (EXCEPTIONS.has(letter) ? ' exception' : '');
    cell.innerHTML = `<div class="letter">${letter}</div><div class="code">${code}</div>`;
    container.appendChild(cell);
  });
}

function buildWheel(outerG, innerG){
  const letters = Object.keys(CIPHER);
  const rOuter = 188, rInner = 132;
  letters.forEach((letter, i) => {
    const angle = (i / letters.length) * Math.PI * 2 - Math.PI/2;
    const ox = 200 + rOuter * Math.cos(angle);
    const oy = 200 + rOuter * Math.sin(angle);
    const t1 = document.createElementNS('http://www.w3.org/2000/svg','text');
    t1.setAttribute('x', ox); t1.setAttribute('y', oy);
    t1.setAttribute('font-size','11');
    t1.setAttribute('text-anchor','middle');
    t1.textContent = letter;
    outerG.appendChild(t1);

    const ix = 200 + rInner * Math.cos(angle);
    const iy = 200 + rInner * Math.sin(angle);
    const t2 = document.createElementNS('http://www.w3.org/2000/svg','text');
    t2.setAttribute('x', ix); t2.setAttribute('y', iy);
    t2.setAttribute('font-size','9');
    t2.setAttribute('class','code-text');
    t2.setAttribute('text-anchor','middle');
    t2.textContent = CIPHER[letter];
    innerG.appendChild(t2);
  });
}

function renderChips(chipsBox, chips){
  chipsBox.innerHTML = '';
  chips.forEach(c => {
    const el = document.createElement('div');
    if (c.type === 'space'){
      el.className = 'chip space';
    } else if (c.type === 'flag'){
      el.className = 'chip flag';
      el.innerHTML = `<div class="l">?</div><div class="c">${c.letter}</div>`;
    } else if (c.type === 'raw'){
      el.className = 'chip';
      el.innerHTML = `<div class="l">${c.letter}</div><div class="c">=</div>`;
    } else {
      el.className = 'chip';
      el.innerHTML = `<div class="l">${c.letter}</div><div class="c">${c.code}</div>`;
    }
    chipsBox.appendChild(el);
  });
}
