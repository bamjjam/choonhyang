'use strict';
// 제4화 · 토끼전 — 용궁에서 사라진 약
// 토끼전의 인물을 빌려 새로 꾸민 사건입니다. 무게와 진하기는 이야기 속 수치입니다.
// 자료 형식은 docs/episode-format.md, 사건 설계는 docs/episode4.md 를 보세요.
window.CASE = (() => {
  const L = (who, text, mood = 'normal', extra = {}) => ({who, text, mood, ...extra});
  const BOWLS = ['첫째 사발', '둘째 사발', '셋째 사발'], WEIGHT = [10, 13, 10], POWDER = 3;

  // ---------- 그림 ----------
  const WOOD = '#8a6a4a', INK = '#4b3f33';
  const bowl = (x, y) => `<g transform="translate(${x} ${y})"><path d="M-32 0h64q-3 28-32 28t-32-28z" fill="#eef4f3" stroke="${INK}" stroke-width="2"/><ellipse cx="0" cy="0" rx="32" ry="6" fill="#bfdfe6" stroke="${INK}" stroke-width="2"/></g>`;
  const shells = (x, y, n) => Array.from({length: n}, (_, i) => `<g transform="translate(${x + (i % 3) * 20 - 20} ${y - Math.floor(i / 3) * 16})"><path d="M-8 4q0-12 8-12t8 12z" fill="#f3d9c2" stroke="${INK}" stroke-width="1.5"/><path d="M0-8v12M-4-6l2 10M4-6l-2 10" stroke="#c9a488" stroke-width="1"/></g>`).join('');
  /** 양팔저울. tilt: -1 왼쪽이 내려감, 0 수평, 1 오른쪽이 내려감 */
  function scaleArt(tilt, left, right, extra = 0) {
    const d = tilt * 20, ly = 62 - d, ry = 62 + d;
    const pan = (x, y, label, n) => `<path d="M${x} ${y}L${x - 46} ${y + 92}M${x} ${y}L${x + 46} ${y + 92}" stroke="${INK}" stroke-width="1.5" fill="none"/><path d="M${x - 56} ${y + 92}h112q-8 16-56 16t-56-16z" fill="#d9c7a0" stroke="${INK}" stroke-width="2"/>${label ? bowl(x - (n ? 18 : 0), y + 64) : ''}${n ? shells(x + 36, y + 84, n) : ''}<text x="${x}" y="${y + 130}" text-anchor="middle" font-size="16" font-weight="700" fill="${label ? INK : '#9a8a6f'}">${label ? label + (n ? ' + 추 ' + n + '개' : '') : '비어 있음'}</text>`;
    const say = tilt < 0 ? '왼쪽 접시가 내려갔다' : tilt > 0 ? '오른쪽 접시가 내려갔다' : '수평이다';
    return `<svg class="scale-art" viewBox="0 0 520 260" role="img" aria-label="양팔저울. ${left || '빈 접시'} 대 ${right || '빈 접시'}${extra ? '와 조개 추 ' + extra + '개' : ''}. ${say}."><rect x="200" y="236" width="120" height="14" rx="6" fill="${WOOD}"/><rect x="254" y="58" width="12" height="182" fill="${WOOD}"/><path d="M100 ${ly}L420 ${ry}" stroke="${WOOD}" stroke-width="10" stroke-linecap="round"/><circle cx="260" cy="62" r="9" fill="#d29c22" stroke="${INK}" stroke-width="2"/>${pan(100, ly, left, 0)}${pan(420, ry, right, extra)}</svg>`;
  }
  /** 구슬을 띄운 잔. level: 0 바닥, 1 중간, 2 높이 뜸 */
  function cupArt(label, level) {
    const y = [118, 86, 48][level];
    return `<svg viewBox="0 0 110 160" aria-hidden="true"><path d="M22 20v112q0 10 10 10h46q10 0 10-10V20" fill="#f7fbfb" stroke="${INK}" stroke-width="2.5"/><path d="M24 36h62v96q0 8-8 8H32q-8 0-8-8z" fill="#bfdfe6" opacity=".75"/><path d="M24 36h62" stroke="#7fb2bf" stroke-width="2"/><circle cx="55" cy="${y}" r="12" fill="#e8765a" stroke="${INK}" stroke-width="2"/><circle cx="51" cy="${y - 4}" r="3" fill="#fff" opacity=".7"/></svg><b>${label}</b>`;
  }
  function tableArt() {
    const ring = (x, y) => `<circle cx="${x}" cy="${y}" r="8" fill="none" stroke="#2f2a26" stroke-width="3.5" opacity=".75"/><circle cx="${x}" cy="${y}" r="2.5" fill="#2f2a26" opacity=".6"/>`;
    return `<svg class="sack-art" viewBox="0 0 640 340" role="img" aria-label="탁자를 위에서 본 그림. 벼루 옆에 약접시가 둘째 사발 쪽으로 엎어져 있고, 동그란 먹물 자국이 탁자 가장자리에서 벼루까지 줄지어 있다."><rect width="640" height="340" rx="14" fill="#eae1cc"/><rect x="24" y="20" width="592" height="280" rx="16" fill="#c9a77a" stroke="#8a6a4a" stroke-width="4"/>
      ${[0, 1, 2].map(i => `<g transform="translate(${150 + i * 170} 118)"><circle r="50" fill="#eef4f3" stroke="${INK}" stroke-width="2.5"/><circle r="39" fill="#bfdfe6"/><text y="-60" text-anchor="middle" font-size="19" font-weight="700" fill="${INK}">${BOWLS[i]}</text></g>`).join('')}
      <g transform="translate(250 246)"><rect x="-48" y="-28" width="96" height="56" rx="6" fill="#3a3531" stroke="#1f1b18" stroke-width="2"/><ellipse cx="6" cy="0" rx="28" ry="16" fill="#15120f"/><text x="-60" y="7" text-anchor="end" font-size="19" font-weight="700" fill="${INK}">벼루</text></g>
      <path d="M338 204q0-22-10-38" stroke="#fff" stroke-width="11" stroke-linecap="round" stroke-dasharray="2 10" fill="none"/>
      <g transform="translate(346 222) rotate(-58)"><ellipse rx="32" ry="13" fill="#f4efe2" stroke="${INK}" stroke-width="2.5"/><path d="M-32 0q32 24 64 0" fill="#d9d2c0" stroke="${INK}" stroke-width="2"/></g>
      <text x="386" y="216" font-size="19" font-weight="700" fill="${INK}">엎어진 약접시</text>
      ${[[604, 278], [560, 274], [516, 270], [472, 266], [428, 262], [384, 258], [340, 254]].map(p => ring(p[0], p[1])).join('')}
      <text x="320" y="326" text-anchor="middle" fill="#776b53" font-size="15">탁자 위를 본 대로 그린 그림</text></svg>`;
  }

  // ---------- 증거 그림 ----------
  const VIEW = {
    ledger: () => `<article class="evidence-document ledger-doc"><span class="doc-overline">용궁 약방 장부 · 오늘 아침</span><h3>용왕님 약 준비</h3><div class="ledger-grid"><span>가루약 무게</span><strong>조개 추 3개</strong><span>담은 곳</span><strong>약접시</strong><span>약 달일 물</span><strong>세 사발</strong><span>한 사발의 무게</span><strong>조개 추 10개</strong></div><p class="doc-copy">“가루약은 약접시에 담아<br>탁자 위 벼루 옆에 둠.”</p><p class="doc-signer">적은 이 · 문어 의원</p></article>`,
    table: () => `<div class="observation-heading"><span>약방 · 뽁이가 그린 그림</span><b>탁자 위를 살핀 그림</b></div>${tableArt()}<p class="gl"><b>약접시</b><br>옆으로 엎어져 있어요. 흰 가루 자국이 둘째 사발 가장자리까지 이어져 있어요.</p><p class="gl"><b>자국</b><br>먹물이 묻은 동그란 자국이 탁자 가장자리에서 벼루까지 줄지어 있어요. 발바닥처럼 생긴 자국은 없어요.</p>`,
    door: () => `<article class="evidence-document note-doc"><span class="doc-overline">약방 앞 복도 · 문을 살핀 기록</span><h3>약방의 문</h3><p class="doc-copy">두꺼운 <b>조개껍데기 문</b>.<br>창이 없고, 틈도 없음.<br>닫으면 <b>안이 전혀 보이지 않음.</b><br>문어 의원은 약방 문을 늘 닫아 둠.</p><p class="doc-signer">살핀 이 · 나바름</p></article>`,
    gate: () => `<article class="evidence-document ledger-doc"><span class="doc-overline">용궁 수문 장부 · 오늘</span><h3>드나든 기록</h3><div class="ledger-grid"><span>아침</span><strong>별주부가 토끼를 데리고 들어옴</strong><span>토끼의 봇짐</span><strong>말린 당근, 풀피리</strong><span>낮</span><strong>토끼가 약방 앞 복도를 지나 산호 뜰로 감</strong></div><p class="doc-copy">“길을 묻기에 산호 뜰을 알려 줌.”</p><p class="doc-signer">적은 이 · 수문장 꽃게</p></article>`,
    weigh: () => `<article class="evidence-document ledger-doc"><span class="doc-overline">약방 저울 기록 · 법정에서 닮</span><h3>세 사발의 무게</h3><div class="ledger-grid">${BOWLS.map((b, i) => `<span>${b}</span><strong>조개 추 ${WEIGHT[i]}개</strong>`).join('')}</div><p class="doc-copy">“둘째 사발이<br>추 3개만큼 무겁다.”</p><p class="doc-signer">단 이 · 나바름과 뽁이</p></article>`,
    dried: () => `<div class="observation-heading"><span>약방 화로 · 법정에서 확인함</span><b>되찾은 가루약</b></div><p class="gl">둘째 사발의 물을 화로에 올려 모두 날려 보냈어요. 바닥에 <b>흰 가루</b>가 남았어요.</p><p class="gl">남은 가루의 무게는 <b>조개 추 3개</b>. 아침에 단 가루약의 무게와 같아요.</p>`
  };

  // ---------- 퍼즐 1: 세 사발의 무게 ----------
  const tilt = (a, b) => a > b ? -1 : a < b ? 1 : 0;
  const BALANCE = {
    auto: () => [['bal-l', '0'], ['bal-r', '1'], ['bal-pick', '1'], ['bal-inc', ''], ['bal-inc', ''], ['bal-inc', ''], ['bal-check', ''], ['bal-next', '']],
    draw(s, api) {
      const p = api.P(), a = api.action;
      if (p.step !== 2) {
        const both = p.l != null && p.r != null && p.l !== p.r;
        const t = both ? tilt(WEIGHT[p.l], WEIGHT[p.r]) : 0;
        const pickRow = side => `<div class="pick-row"><span>${side === 'l' ? '왼쪽 접시' : '오른쪽 접시'}</span>${BOWLS.map((b, i) => a('bal-' + side, b, i, 'seal sm' + (p[side] === i ? ' fill' : ''), p[side === 'l' ? 'r' : 'l'] === i)).join('')}</div>`;
        api.$('#view').innerHTML = `<section class="board puzzle-board"><div class="section-kicker">뽁이의 저울 수사 · 1단계</div><h2>무게가 다른 사발을 찾아라</h2><p class="muted">세 사발은 눈으로 보면 똑같이 맑아요. 두 사발을 골라 양팔저울의 양쪽 접시에 올려 보세요. <b>무거운 쪽이 아래로 내려가요.</b></p>
          ${pickRow('l')}${pickRow('r')}
          <div class="scale-wrap">${scaleArt(t, p.l != null ? BOWLS[p.l] : '', p.r != null ? BOWLS[p.r] : '')}</div>
          <p class="feedback" role="status">${both ? (t ? `${BOWLS[t < 0 ? p.l : p.r]} 쪽이 내려갔어요. 더 무거워요.` : '저울이 수평이에요. 두 사발의 무게가 같아요.') : '양쪽 접시에 올릴 사발을 하나씩 골라 주세요.'}</p>
          <p class="pick-question">무게가 다른 사발은 어느 것일까요?</p><div class="row">${BOWLS.map((b, i) => a('bal-pick', b, i, 'seal blue', !p.tries)).join('')}</div>
          ${p.msg ? `<p class="feedback" role="status">${api.esc(p.msg)}</p>` : ''}</section>`;
        return;
      }
      const n = p.n || 0, t = tilt(WEIGHT[1], WEIGHT[0] + n);
      api.$('#view').innerHTML = `<section class="board puzzle-board"><div class="section-kicker">뽁이의 저울 수사 · 2단계</div><h2>얼마나 더 무거울까?</h2><p class="muted">둘째 사발과 첫째 사발을 양쪽에 올렸어요. 첫째 사발 쪽에 <b>조개 추</b>를 올려 저울을 수평으로 만들어 보세요. 조개 추는 모두 무게가 같아요.</p>
        <div class="scale-wrap">${scaleArt(t, BOWLS[1], BOWLS[0], n)}</div>
        <div class="count-control">${a('bal-dec', '−', '', 'count-button', n <= 0 || p.ok)}<output aria-live="polite" aria-label="올린 조개 추">${n}<small>개</small></output>${a('bal-inc', '＋', '', 'count-button', n >= 6 || p.ok)}</div>
        <p class="feedback" role="status">${p.ok ? '저울이 수평이 됐어요!' : p.msg ? api.esc(p.msg) : t < 0 ? '아직 둘째 사발 쪽이 내려가 있어요.' : t > 0 ? '이번에는 추를 올린 쪽이 내려갔어요.' : '저울이 수평으로 보여요. 확인해 볼까요?'}</p>
        ${p.ok ? `<div class="lab-explanation" role="status"><span class="result-seal">저울 수사 성공</span><h3>둘째 사발은 추 3개만큼 무거워요</h3><p>맹물 한 사발은 추 10개, 둘째 사발은 추 13개 무게예요. 눈에는 똑같이 맑은 물인데, 둘째 사발에는 무언가 더 들어 있어요.</p><p class="muted">장부에 적힌 가루약의 무게도 조개 추 3개였어요.</p>${a('bal-next', '저울 기록을 증거함에 넣기 →')}</div>` : `<div class="row end">${a('bal-check', '수평이 됐어요 →')}</div>`}</section>`;
    },
    act(a, v, s, api) {
      const p = api.P();
      if (a === 'bal-l' || a === 'bal-r') {
        p[a === 'bal-l' ? 'l' : 'r'] = +v; p.msg = '';
        if (p.l != null && p.r != null && p.l !== p.r) p.tries = (p.tries || 0) + 1;
      }
      if (a === 'bal-pick' && p.tries) {
        if (+v === 1) { p.step = 2; p.n = 0; p.msg = ''; }
        else p.msg = `${BOWLS[+v]}은 다른 사발과 무게가 같았을 거예요. 저울에 올려 다시 견주어 보세요.`;
      }
      if (a === 'bal-inc' && !p.ok) { p.n = Math.min(6, (p.n || 0) + 1); p.msg = ''; }
      if (a === 'bal-dec' && !p.ok) { p.n = Math.max(0, (p.n || 0) - 1); p.msg = ''; }
      if (a === 'bal-check') {
        if (p.n === POWDER) p.ok = true;
        else p.msg = '아직 수평이 아니에요. 저울의 기울기를 보며 추를 더하거나 빼 보세요.';
      }
      if (a === 'bal-next' && p.ok) return api.done();
      api.save(); this.draw(s, api);
    }
  };

  // ---------- 퍼즐 2: 구슬이 뜨는 높이 ----------
  // 이름표가 떨어진 세 잔. ㄱ = 세 숟갈, ㄴ = 맹물, ㄷ = 한 숟갈.
  const CUPS = {g: {tag: 'ㄱ', level: 2, name: '세 숟갈 녹인 물'}, n: {tag: 'ㄴ', level: 0, name: '맹물'}, d: {tag: 'ㄷ', level: 1, name: '한 숟갈 녹인 물'}};
  const ORDER = ['n', 'd', 'g'], MATCH = ['맹물', '한 숟갈 녹인 물', '세 숟갈 녹인 물'];
  const DENSE = {
    auto: () => [['den-cup', 'n'], ['den-cup', 'd'], ['den-cup', 'g'], ['den-match', '2'], ['den-next', '']],
    draw(s, api) {
      const p = api.P(), a = api.action, seq = Array.isArray(p.seq) ? p.seq : (p.seq = []);
      const cup = (k, named) => `<span class="cup">${cupArt(named ? CUPS[k].name : CUPS[k].tag + ' 잔', CUPS[k].level)}</span>`;
      if (p.step !== 2) {
        api.$('#view').innerHTML = `<section class="board puzzle-board"><div class="section-kicker">뽁이의 진하기 실험 · 1단계</div><h2>묽은 것부터 진한 것까지</h2><p class="muted">뽁이가 같은 양의 물에 가루약을 <b>넣지 않은 잔, 한 숟갈 녹인 잔, 세 숟갈 녹인 잔</b>을 만들었어요. 그런데 이름표가 떨어져 버렸어요! 잔마다 구슬을 하나씩 띄웠어요. <b>진한 용액일수록 구슬이 높이 떠요.</b></p>
          <div class="cups">${['g', 'n', 'd'].map(k => `<button class="cup-button ${seq.includes(k) ? 'picked' : ''}" data-action="den-cup" data-value="${k}" ${seq.includes(k) ? 'disabled' : ''}>${cupArt(CUPS[k].tag + ' 잔', CUPS[k].level)}${seq.includes(k) ? `<i>${seq.indexOf(k) + 1}번째</i>` : ''}</button>`).join('')}</div>
          <p class="pick-question">가장 묽은 잔부터 차례로 눌러 주세요. (${seq.length} / 3)</p>
          ${p.msg ? `<p class="feedback" role="status">${api.esc(p.msg)}</p>` : ''}
          <div class="row end">${a('den-reset', '다시 고르기', '', 'seal', !seq.length)}</div></section>`;
        return;
      }
      api.$('#view').innerHTML = `<section class="board puzzle-board"><div class="section-kicker">뽁이의 진하기 실험 · 2단계</div><h2>둘째 사발의 물은 얼마나 진할까?</h2><p class="muted">이름표를 다시 붙였어요. 이번에는 <b>둘째 사발의 물</b>을 같은 잔에 떠서 구슬을 띄웠어요. 구슬이 뜬 높이를 견주어 보세요.</p>
        <div class="cups">${ORDER.map(k => cup(k, true)).join('')}<span class="cup target">${cupArt('둘째 사발의 물', 2)}</span></div>
        <p class="pick-question">둘째 사발의 물은 어느 잔과 진하기가 같을까요?</p>
        ${p.ok ? `<div class="lab-explanation" role="status"><span class="result-seal">진하기 실험 성공</span><h3>세 숟갈 녹인 물과 같아요</h3><p>가루약 한 숟갈은 조개 추 1개 무게예요. 세 숟갈이면 추 3개. 아침에 단 가루약이 <b>모두</b> 둘째 사발에 녹아 있다는 뜻이에요.</p><p class="muted">저울로 알아낸 것을 다른 방법으로 한 번 더 확인했어요.</p>${a('den-next', '화로에 올려 확인하기 →')}</div>` : `<div class="row">${MATCH.map((m, i) => a('den-match', m, i, 'seal blue')).join('')}</div>${p.msg ? `<p class="feedback" role="status">${api.esc(p.msg)}</p>` : ''}`}</section>`;
    },
    act(a, v, s, api) {
      const p = api.P();
      if (a === 'den-cup' && CUPS[v] && p.step !== 2 && !p.seq.includes(v)) {
        p.seq.push(v); p.msg = '';
        if (p.seq.length === 3) {
          if (p.seq.join() === ORDER.join()) { p.step = 2; p.msg = ''; }
          else { p.seq = []; p.msg = '순서가 맞지 않아요. 구슬이 바닥에 가라앉은 잔이 가장 묽고, 높이 뜬 잔이 가장 진해요. 다시 골라 보세요.'; }
        }
      }
      if (a === 'den-reset') { p.seq = []; p.msg = ''; }
      if (a === 'den-match' && p.step === 2) {
        if (+v === 2) p.ok = true;
        else p.msg = '구슬이 뜬 높이를 다시 견주어 보세요. 둘째 사발의 물에서는 구슬이 아주 높이 떴어요.';
      }
      if (a === 'den-next' && p.ok) return api.done();
      api.save(); this.draw(s, api);
    }
  };

  // ---------- 진짜 까닭 고르기 ----------
  const CAUSE = {
    kicker: '최종 추리',
    title: '약이 사라진 진짜 까닭은?',
    intro: '지금까지 확인한 증거와 <b>모두 맞는</b> 설명을 하나 골라 주세요.',
    body: () => `<div class="lab-common"><span>둘째 사발이 추 3개만큼 무겁다</span><span>되찾은 가루약은 추 3개 그대로</span><span>탁자에는 동그란 먹물 자국뿐</span><span>의원의 다리가 벼루에 닿았다</span></div>`,
    question: '용왕님께 어떻게 아뢸까요?',
    options: [
      '토끼가 가루약을 핥아 먹었다.',
      '토끼가 탁자에 올라가 약을 물에 타 놓았다.',
      '문어 의원이 약을 숨기려고 일부러 물에 넣었다.',
      '먹을 찍던 문어 의원의 다리에 접시가 엎어져 가루약이 물에 쏟아졌고, 녹아서 보이지 않았다.'
    ],
    check: i => i === 3 || [
      '되찾은 가루약은 추 3개 그대로였어요. 한 톨도 줄지 않았지요.',
      '탁자 위에는 토끼의 발자국이 없었어요. 접시도 들어서 부은 것이 아니라 엎어져 있었어요.',
      '의원은 약이 없어졌다고 스스로 알렸고, 물에 든 줄도 몰랐어요. 일부러 했다는 증거는 없어요.'
    ][i]
  };

  const VERDICT = {
    kicker: '사건 번호 004 · 최종 판결',
    stamp: '무죄',
    title: '토끼의 누명을 벗겼어요.',
    sub: '약은 사라진 것이 아니라, 녹아서 보이지 않았을 뿐이에요.',
    cards: [
      {title: '용궁의 판결 · 용왕', who: 'yongwang', text: '토끼에게는 죄가 없노라. 약은 사라진 것이 아니라 물에 녹아 있었고, 한 톨도 줄지 않고 돌아왔다. 별주부는 보지 않은 것을 보았다고 아뢰었으니, 토끼에게 사과하고 뭍까지 고이 바래다주어라. 문어 의원은 일부러 한 일이 아니니 벌하지 않겠다. 다만 앞으로 약접시에는 뚜껑을 덮어라.'},
      {modern: true, title: '오늘의 시선 · 한저울 판사', who: 'judge', text: '보지 않은 것을 본 것처럼 말하면 죄 없는 사람이 억울해져요. 또 눈에 보이지 않는다고 없는 것은 아니에요. 무게를 달고, 진하기를 견주고, 물을 날려 보내 확인했지요. 실수로 한 일과 일부러 한 일을 가려내는 것도 재판이 하는 중요한 일이에요.'}
    ],
    strip: [['수학', '10 + 3 = 13'], ['과학', '녹아도 무게는 그대로'], ['추리', '볼 수 있었을까?']],
    note: '이야기 속 가루약은 물에 잘 녹는 것으로 꾸몄어요. 실제로는 약이나 모르는 가루를 함부로 맛보거나 섞으면 안 돼요.',
    foot: '고전 인물을 활용해 만든 이야기 속 재판입니다.'
  };

  return {
    n: 4, classic: '토끼전', title: '용궁에서 사라진 약',
    helper: 'ppok',
    court: 'yonggung',
    rules: {pair: true},
    portraits: ['baleum', 'yongwang', 'tokki', 'jara', 'muneo', 'ppok', 'judge'],
    chars: {
      baleum: '나바름',
      yongwang: '용왕',
      tokki: '토끼',
      jara: '별주부 자라',
      muneo: '문어 의원',
      ppok: '뽁이',
      judge: '한저울 판사',
      narr: ''
    },
    glossary: {
      '별주부': '토끼전에서 토끼를 용궁으로 데려온 자라예요. 별주부는 자라의 벼슬 이름이에요.',
      '증거': '어떤 일이 있었는지 확인하는 데 도움이 되는 물건이나 기록이에요.',
      '증언': '자기가 보고 들은 일을 법정에서 말하는 것이에요.',
      '모순': '앞에서 한 말과 뒤에서 한 말이 서로 맞지 않는 것이에요.',
      '양팔저울': '양쪽 접시에 물건을 올려 무게를 견주는 저울이에요. 무거운 쪽이 아래로 내려가요.',
      '용해': '어떤 물질이 물에 녹아 골고루 섞이는 일이에요.',
      '용액': '물질이 녹아 골고루 섞여 있는 물이에요. 소금물과 설탕물이 용액이에요.',
      '진하기': '같은 양의 물에 녹아 있는 물질이 많을수록 진한 용액이에요.',
      '증발': '물이 수증기가 되어 공기 속으로 날아가는 일이에요.'
    },
    evidence: {
      ledger: {name: '약방 장부', short: '아침에 단 가루약과 물의 무게', icon: 'ledger', view: VIEW.ledger},
      table: {name: '탁자 관찰 그림', short: '약방 탁자 위를 본 대로 그린 그림', icon: 'table', view: VIEW.table},
      door: {name: '약방 문 기록', short: '약방 문을 살핀 기록', icon: 'note', view: VIEW.door},
      gate: {name: '수문 장부', short: '용궁 수문을 드나든 기록', icon: 'order', view: VIEW.gate},
      weigh: {name: '저울 기록', short: '법정에서 단 세 사발의 무게', icon: 'ledger', view: VIEW.weigh},
      dried: {name: '되찾은 가루약', short: '물을 날려 보내고 남은 흰 가루', icon: 'jar', view: VIEW.dried}
    },
    places: [
      {id: 'yakjang', name: '약방 약장', art: 'yakjang', ev: 'ledger', who: 'muneo', line: '아침에 내가 적은 약 장부요. 가루약과 물의 무게를 달아 두었소.'},
      {id: 'yakbang', name: '약방 탁자', art: 'yakbang', ev: 'table', who: 'ppok', line: '탁자 위를 본 대로 그렸어요. 약접시가 엎어져 있고, 동그란 자국이 줄지어 있어요. 뽁!'},
      {id: 'corridor', name: '약방 앞 복도', art: 'corridor', ev: 'door', who: 'baleum', line: '약방 문을 살펴보자. 두꺼운 조개껍데기 문이야.'},
      {id: 'gate', name: '용궁 수문', art: 'gate', ev: 'gate', who: 'jara', line: '수문을 드나든 기록이오. 토끼의 봇짐도 여기서 살폈소.'}
    ],
    witnesses: {
      jara1: {
        who: 'jara', title: '첫 심문 · 다 보았다는 별주부',
        statements: [
          {text: '소신은 용왕님을 모시는 별주부 자라이옵니다. 토끼를 뭍에서 데려온 것도 소신이옵니다.', cards: [{q: '토끼를 왜 데려왔나요?', a: '뭍 이야기를 들으시면 용왕님 기분이 나아지실까 하여 손님으로 모셨소.'}]},
          {text: '낮에 약방 앞 복도를 지났사온데, 약방 문은 꼭 닫혀 있었고 소신은 문에 손도 대지 않았나이다.', cards: [{q: '문에 창이나 틈이 있나요?', a: '없소. 두꺼운 조개껍데기 문이오.'}]},
          {text: '그때 토끼가 탁자 앞에서 약접시의 가루를 낼름낼름 핥아 먹는 것을, 이 두 눈으로 똑똑히 보았나이다!', cards: [{q: '토끼는 접시를 어떻게 들고 있었나요?', a: '그, 그건… 워낙 순식간이라…', mood: 'sweat'}]},
          {text: '토끼는 뭍에서 온 짐승이옵니다. 용궁의 귀한 약이 탐났던 게지요.', cards: [{q: '토끼가 약을 탐낸다는 말을 들었나요?', a: '듣지는 못했으나, 그럴 것이 뻔하오!'}]},
          {text: '잠시 뒤 문어 의원이 “약이 없어졌다!” 하고 외쳤나이다. 범인은 토끼가 틀림없사옵니다.', cards: [{q: '그때 토끼는 어디에 있었나요?', a: '복도 끝으로 걸어가고 있었소.'}]}
        ],
        solve: {pair: [1, 2], evidence: 'door', statements: [2], near: [
          {evidence: 'table', text: '접시가 엎어져 있는 것은 눈여겨볼 만해요. 하지만 지금은 자라가 정말 보았는지부터 따져 봐요. 닫힌 문과 관련된 말을 찾아보세요.'},
          {evidence: 'gate', text: '토끼가 복도를 지나간 것은 자라의 말과 같아요. 자라가 방 안을 볼 수 있었는지를 따져 보세요.'}
        ]},
        hints: ['자라가 서 있던 곳과, 자라가 보았다는 것을 견주어 보세요.', '약방 문이 어떤 상태였는지 말한 증언이 있어요.', '문에 대해 말한 증언과 방 안을 보았다는 증언을 맞대어 보세요. 문을 살핀 증거를 내밀어도 좋아요.'],
        wrong: '자라는 어디에서 무엇을 보았다고 했나요? 그 자리에서 정말 볼 수 있었을지 생각해 보세요.',
        success: [
          L('baleum', '문은 꼭 닫혀 있었고, 창도 틈도 없는 조개껍데기 문입니다. 그런데 방 안의 토끼를 어떻게 보셨습니까!', 'stern', {shout: true}),
          L('jara', '끄응… 사, 사실은 보지 못했소.', 'sweat'),
          L('jara', '복도에서 토끼와 마주쳤고, 곧이어 약이 없어졌다는 소리를 들었을 뿐이오. 그러니 토끼밖에 더 있겠소!', 'stern'),
          L('tokki', '마주친 것만으로 도둑이라니, 너무해!', 'sad'),
          L('muneo', '하지만 약이 사라진 것은 사실이오. 탁자에는 맹물 세 사발만 남아 있소.', 'sad'),
          L('ppok', '뽁! 정말 맹물일까요? 눈으로는 알 수 없으니 양팔저울에 달아 봐요.', 'normal', {words: ['양팔저울']})
        ]
      },
      muneo1: {
        who: 'muneo', title: '두 번째 심문 · 약방의 문어 의원',
        statements: [
          {text: '나는 용궁 약방의 문어 의원이오. 아침에 가루약을 조개 추 세 개 무게만큼 달아 약접시에 담았소.', cards: [{q: '어떤 약인가요?', a: '물에 타서 달여 드리는 흰 가루약이오. 한 숟갈이 조개 추 하나 무게지.'}]},
          {text: '탁자에는 약접시와, 약 달일 물 세 사발을 나란히 두었소.', cards: [{q: '약접시는 어디에 두었나요?', a: '벼루 옆이오. 둘째 사발 바로 곁이지.'}]},
          {text: '세 사발은 모두 아침에 떠 온 맹물 그대로요. 한 사발에 추 열 개 무게씩, 똑같이 맞춰 떴지.', cards: [{q: '물에 무언가 넣은 적은 없나요?', a: '없소. 약은 달이기 직전에 타는 법이오.'}]},
          {text: '낮에 보니 약접시가 엎어져 비어 있었소. 가루는 방 안 어디에도 보이지 않았소.', cards: [{q: '바닥도 살펴보셨나요?', a: '여덟 다리로 구석구석 더듬어 보았소. 없었소.'}]},
          {text: '보이지 않으니 누가 가져간 것이오. 약이 저절로 사라질 리는 없잖소.', cards: [{q: '사발 속은 들여다보셨나요?', a: '보았소. 세 사발 모두 맑기만 했소.'}]}
        ],
        solve: {evidence: 'weigh', statements: [2], near: [
          {evidence: 'table', text: '가루 자국이 사발 쪽으로 이어진 것은 좋은 단서예요. 그런데 물에 들어갔다는 것을 숫자로 보여 주는 증거가 있어요. 의원의 말 가운데 숫자가 나오는 증언을 찾아보세요.'},
          {evidence: 'ledger', statements: [2], text: '장부에는 한 사발에 추 열 개라고 적혀 있어요. 의원의 말과 같지요. 방금 법정에서 직접 달아 본 기록은 어땠나요?'},
          {evidence: 'weigh', statements: [3, 4], text: '가루가 어디로 갔는지 짐작이 가지요? 먼저 의원의 말 가운데 저울 기록과 숫자가 다른 증언을 찾아보세요.'}
        ]},
        hints: ['의원의 말 가운데 숫자가 나오는 증언이 있어요.', '방금 법정에서 세 사발을 직접 달아 보았지요.', '세 사발의 무게를 말한 증언에, 법정에서 단 기록을 내밀어 보세요.'],
        wrong: '확인할 수 있는 것은 숫자예요. 의원이 말한 무게와 직접 단 무게를 견주어 보세요.',
        success: [
          L('baleum', '저울 기록을 보십시오. 둘째 사발은 추 열세 개 무게입니다. 세 사발이 똑같지 않습니다!', 'stern', {shout: true}),
          L('muneo', '추 세 개가 더 무겁다고? 추 세 개라면… 가루약의 무게와 똑같잖소!', 'shock'),
          L('baleum', '가루약은 사라진 것이 아니라 물에 녹은 것입니다. 물질이 물에 녹아 골고루 섞이는 것을 용해라고 하지요.', 'normal', {words: ['용해', '용액']}),
          L('ppok', '녹아서 안 보여도 없어진 건 아니에요. 그래서 무게가 그대로 더해졌어요. 뽁!', 'happy'),
          L('jara', '허나 사발의 물은 맑기만 하오! 약이 들었다는 것을 눈으로 보여 주시오!', 'stern'),
          L('ppok', '그럼 진하기를 견주어 봐요. 진한 용액일수록 구슬이 높이 떠요.', 'normal', {words: ['진하기']})
        ]
      },
      jara2: {
        who: 'jara', title: '세 번째 심문 · 누가 물에 넣었나',
        statements: [
          {text: '가루약이 물에 녹아 있었다는 것은 소신도 인정하옵니다.', cards: [{q: '약이 줄지 않았다는 것도 인정하시나요?', a: '추 세 개 그대로였으니… 인정하오.'}]},
          {text: '허나 약이 제 발로 물에 들어갔겠나이까? 토끼가 넣은 것이옵니다. 나중에 몰래 마시려고!', cards: [{q: '토끼가 넣는 것을 보셨나요?', a: '보, 보지는 못했으나 달리 누가 있겠소!', mood: 'sweat'}]},
          {text: '토끼는 탁자 위로 깡충 뛰어올라, 접시를 들어 사발에 부었을 것이옵니다.', cards: [{q: '탁자는 얼마나 높은가요?', a: '토끼 키의 두 배는 되오. 뛰어오르지 않고는 닿지 못하지.'}]},
          {text: '탁자 위를 살펴보시옵소서. 토끼가 올라간 자국이 틀림없이 남아 있을 것이옵니다!', cards: [{q: '어떤 자국이 남았을까요?', a: '그야 토끼 발자국이지! 길쭉한 발바닥 자국 말이오.'}]}
        ],
        solve: {evidence: 'table', statements: [2, 3], near: [
          {evidence: 'gate', text: '토끼가 복도를 지나간 것은 맞아요. 하지만 약방 안에 들어갔는지는 이 기록으로 알 수 없어요. 탁자 위를 살핀 증거를 찾아보세요.'},
          {evidence: 'door', text: '문이 닫혀 있었다고 해서 아무도 열지 못한 것은 아니에요. 탁자 위에 무엇이 남아 있었는지 살펴보세요.'}
        ]},
        hints: ['자라는 탁자 위에 무언가 남아 있을 거라고 말해요.', '탁자 위를 본 대로 그려 둔 증거가 있어요.', '토끼가 탁자에 올라갔다는 증언에, 탁자 위를 그린 증거를 내밀어 보세요.'],
        wrong: '자라의 말대로라면 탁자 위에 무엇이 남아 있어야 할까요? 그것을 확인할 증거를 찾아보세요.',
        success: [
          L('baleum', '탁자 위에는 동그란 먹물 자국뿐입니다. 토끼의 발자국은 하나도 없습니다!', 'stern', {shout: true}),
          L('jara', '도, 동그란 자국이라니… 그건 누구의 것이오?', 'shock'),
          L('baleum', '접시도 들어서 부은 것이 아닙니다. 옆으로 엎어졌고, 가루가 사발 쪽으로 쏟아졌습니다.'),
          L('ppok', '동그랗고, 줄지어 있고, 먹물이 묻었어요. 약방에서 먹을 쓰는 분은…', 'sweat'),
          L('muneo', '나, 나를 보는 것이오? 나는 그런 적이 없소!', 'shock')
        ]
      },
      muneo2: {
        who: 'muneo', title: '마지막 심문 · 여덟 개의 다리',
        statements: [
          {text: '나, 나는 약을 물에 넣은 적이 없소! 그런 기억이 전혀 없소.', cards: [{q: '낮에는 무엇을 하셨나요?', a: '약재를 정리하고 약 이름을 적었소. 눈코 뜰 새 없었지.'}]},
          {text: '나는 탁자에서 세 걸음 떨어진 약장 앞에 있었소.', cards: [{q: '거기서 탁자까지 다리가 닿나요?', a: '내 다리는 길어서 닿기야 닿소. 하지만…'}]},
          {text: '탁자에는 다리 하나 뻗지 않았소. 맹세하오.', cards: [{q: '정말 한 번도 뻗지 않으셨나요?', a: '그, 그렇소. 그럴 일이 없었소.', mood: 'sweat'}]},
          {text: '약재 정리는 바쁜 일이오. 다리 둘은 서랍을 열고, 둘은 약봉지를 묶고, 둘은 장부를 넘기고, 하나는 몸을 받쳤소.', cards: [{q: '다리는 모두 몇 개인가요?', a: '여덟이오. 방금 일곱까지 말했군.'}]},
          {text: '남은 다리 하나로는 붓을 쥐고, 탁자 위 벼루에서 먹을 찍어 가며 약 이름을 적었소.', cards: [{q: '벼루 옆에는 무엇이 있었나요?', a: '약접시가 있었소. 그게 어쨌다는 거요?'}]}
        ],
        solve: {pair: [2, 4], evidence: 'table', statements: [2], near: [
          {pair: [1, 4], text: '의원의 다리는 길어서 세 걸음 떨어진 곳에서도 탁자에 닿아요. 그러니 두 말은 함께 참일 수 있어요. 그렇다면 「뻗지 않았다」고 한 말은 어떨까요?'},
          {pair: [3, 4], text: '일곱에 하나를 더하면 여덟. 다리의 수는 맞아요. 여덟째 다리가 한 일과 어긋나는 말을 찾아보세요.'}
        ]},
        hints: ['의원은 여덟 다리가 한 일을 하나씩 말했어요.', '여덟째 다리가 닿은 곳은 어디였나요?', '탁자에 다리를 뻗지 않았다는 증언과, 여덟째 다리가 한 일을 말한 증언을 맞대어 보세요.'],
        wrong: '의원의 말끼리 견주어 보세요. 다리가 닿은 곳을 서로 다르게 말한 두 증언이 있어요.',
        success: [
          L('baleum', '탁자에 다리 하나 뻗지 않았다고 하셨지만, 탁자 위 벼루에서 먹을 찍으셨습니다. 동그란 먹물 자국은 의원의 빨판 자국입니다!', 'stern', {shout: true}),
          L('muneo', '아…! 벼루 바로 옆이 약접시였소. 먹을 찍다가 내 다리가 접시를 친 게로구나.', 'shock'),
          L('muneo', '여덟 다리를 한꺼번에 쓰느라 전혀 몰랐소. 살펴보지도 않고 도둑이 들었다고 알렸으니, 내 잘못이오.', 'sad'),
          L('yongwang', '변호인. 그렇다면 약이 사라진 까닭을, 증거에 맞게 말해 보아라.', 'stern')
        ]
      }
    },
    custom: {balance: BALANCE, dense: DENSE},
    stages: [
      {type: 'talk', chapter: '네 번째 의뢰', lines: [
        L('narr', '나바름은 자라의 등에 업혀 바닷속 용궁에 닿았습니다. 커다란 공기 방울 지붕 아래라, 뭍에서처럼 숨을 쉴 수 있었습니다.', 'normal', {fx: 'drum'}),
        L('yongwang', '콜록, 콜록… 내 병을 고칠 가루약이 약접시에서 감쪽같이 사라졌도다.', 'sad'),
        L('jara', '용왕님! 범인은 뭍에서 온 토끼이옵니다. 약방 앞을 서성이는 것을 소신이 보았나이다!', 'stern', {words: ['별주부']}),
        L('tokki', '아니야! 난 길을 잃어서 복도를 지나갔을 뿐이라고!', 'shock'),
        L('ppok', '뽁! 저는 약방 심부름꾼 뽁이예요. 토끼님 입가에는 가루 한 톨 없었어요.'),
        L('baleum', '저는 나바름입니다. 토끼의 말을 대신 전하겠습니다. 사라졌다고 하셨지만, 정말 없어진 것인지부터 확인해야 합니다.'),
        L('yongwang', '좋다. 말이 아니라 증거로 가리자. 용궁을 조사하여라.', 'stern', {words: ['증거']}),
        L('ppok', '약방과 복도, 수문까지 네 곳을 둘러봐요. 뽁!', 'happy')
      ]},
      {type: 'investigate', chapter: '네 곳의 단서', title: '약은 정말 사라졌을까요?'},
      {type: 'talk', chapter: '별주부의 증언', lines: [
        L('narr', '별주부 자라가 목을 길게 빼고 증인석에 올랐습니다.'),
        L('jara', '소신이 본 대로만 아뢰겠나이다.', 'stern'),
        L('ppok', '증언을 넘겨 보고, 이상한 말에 맞는 증거를 내밀어 보세요. 궁금한 말은 질문해도 좋아요.', 'normal', {words: ['증언']}),
        L('ppok', '앞에서 한 말과 뒤에서 한 말이 서로 맞지 않으면 그것이 모순이에요. 그럴 땐 두 증언을 맞대 보세요. 뽁!', 'normal', {words: ['모순']})
      ]},
      {type: 'cross', id: 'jara1', chapter: '닫힌 문 너머'},
      {type: 'balance', chapter: '세 사발의 무게', gain: 'weigh', after: [
        L('baleum', '둘째 사발만 조개 추 세 개만큼 무겁습니다. 저울 기록을 증거로 남기겠습니다.'),
        L('muneo', '그럴 리가 없소. 내 말을 들어 보시오.', 'shock')
      ]},
      {type: 'cross', id: 'muneo1', chapter: '맹물이라던 사발'},
      {type: 'dense', chapter: '구슬이 뜨는 높이', gain: 'dried', after: [
        L('baleum', '둘째 사발의 물은 가루약 세 숟갈을 녹인 물과 진하기가 같습니다.'),
        L('narr', '뽁이가 둘째 사발을 화로에 올렸습니다. 물이 모두 날아가자, 바닥에 흰 가루가 남았습니다.'),
        L('ppok', '달아 보니 추 세 개! 가루약이 하나도 줄지 않고 돌아왔어요. 물이 날아가는 건 증발이라고 해요.', 'happy', {words: ['증발']}),
        L('yongwang', '오오, 약이 그대로 있었구나! 콜록.', 'happy'),
        L('tokki', '거봐! 난 한 톨도 안 먹었다고!', 'happy'),
        L('jara', '그, 그렇다면 누가 약을 물에 넣었단 말이오? 소신의 생각을 아뢰겠나이다!', 'sweat')
      ]},
      {type: 'cross', id: 'jara2', chapter: '탁자 위의 자국'},
      {type: 'cross', id: 'muneo2', chapter: '여덟 개의 다리'},
      {type: 'pick', chapter: '진짜 까닭', ...CAUSE, after: [
        L('baleum', '훔친 이는 없습니다. 엎어진 접시의 가루약이 물에 녹아, 사라진 것처럼 보였을 뿐입니다.'),
        L('muneo', '토끼 선생, 미안하오. 내가 살펴보지도 않고 소란을 피웠소.', 'sad'),
        L('jara', '…소신도 보지 않은 것을 보았다고 아뢰었나이다. 토끼, 미안하오.', 'sad'),
        L('tokki', '흥. …알았어. 대신 뭍까지는 흔들리지 않게 태워 줘.'),
        L('ppok', '안 보인다고 없는 건 아니에요. 뽁!', 'happy'),
        L('yongwang', '이제 판결을 내리겠노라.', 'stern')
      ]},
      {type: 'verdict', chapter: '증거가 이끄는 판결', ...VERDICT},
      {type: 'diary', chapter: '나의 판관 일기'},
      {type: 'end', chapter: '뭍으로 돌아가는 길'}
    ],
    landing: {
      intro: '용왕의 약이 감쪽같이 사라졌다.<br>뭍에서 온 토끼가 도둑으로 몰릴 때,<br><strong>보이지 않는 것을 찾아 진실을 밝혀 주세요.</strong>',
      start: '토끼의 사건 맡기',
      backdrop: 'yonggung',
      people: [['tokki', 'shock'], ['jara', 'stern'], ['baleum', 'normal']],
      bubble: '없어진 것인지, 안 보이는 것인지부터 가립시다!',
      label: ['토끼전에서 시작된 새로운 사건', '용궁에서 사라진 약의 진실'],
      steps: ['단서 수집', '달고 견주기', '증거로 판결'],
      credit: '초등 5학년부터 · 읽는 속도에 따라 약 35–45분 · 진행 자동 저장'
    },
    diary: {
      title: '다시 이런 일이 생기지 않으려면?',
      intro: '가장 마음에 드는 생각을 골라 주세요. 여기에는 정답이 없어요.',
      choices: [
        '보지 않은 것을 본 것처럼 말하면 안 돼요. 자라는 토끼에게 사과해야 해요.',
        '실수는 누구나 할 수 있어요. 알게 되면 바로 인정하는 것이 중요해요.',
        '눈에 안 보인다고 없어진 것은 아니에요. 확인해 보고 말해야 해요.'
      ],
      placeholder: '예: 물건이 없어지면 먼저 잘 찾아보고 말할 거예요.'
    },
    end: {
      backdrop: 'yonggung',
      people: [['tokki', 'happy'], ['ppok', 'happy']],
      quote: '“안 보인다고 없는 건 아니에요. 뽁!”',
      kicker: '네 번째 사건 해결',
      title: '녹아도<br><em>사라지지 않아요.</em>',
      text: '되찾은 가루약으로 달인 약을 마신 용왕은 기침이 멎었습니다.<br>토끼는 자라의 등에 올라, 흔들리지 않게 뭍으로 돌아갔습니다.',
      badges: ['저울 수사관', '진하기 감정사', '모순 사냥꾼']
    },
    guide: `<h3>제4화 · 교사·보호자 안내</h3><p><b>토끼전 × 용해와 용액 × 볼 수 있었는지 따지기</b><br>초등 5학년부터, 약 35–45분을 예상한 이야기입니다. 토끼전의 토끼, 별주부 자라, 용왕을 바탕으로 새로 꾸민 사건입니다. 문어 의원과 뽁이는 이 게임을 위해 만든 인물입니다. 원작의 “토끼의 간” 이야기는 다루지 않고, 토끼가 손님으로 용궁에 온 것으로 바꾸었습니다. 이 사건에는 훔친 사람이 없습니다. 실수와 섣부른 짐작이 겹쳐 누명이 생깁니다.</p><p><b>함께 생각할 질문</b></p><ol><li>가루약이 물에 녹은 뒤에도 무게가 그대로인 까닭은 무엇일까요?</li><li>자라는 왜 보지 않은 것을 보았다고 말했을까요?</li><li>문어 의원의 실수와, 일부러 한 잘못은 어떻게 다를까요?</li></ol><details class="teacher-spoilers"><summary>교사용 진행·정답 보기</summary><p>별주부 첫 심문: 증언 2와 3을 맞대기. 또는 증언 3 + 약방 문 기록.<br>세 사발의 무게: 둘째 사발, 조개 추 3개.<br>문어 의원 첫 심문: 증언 3 + 저울 기록.<br>구슬이 뜨는 높이: ㄴ → ㄷ → ㄱ 순서, 둘째 사발은 세 숟갈 녹인 물과 같음.<br>별주부 두 번째 심문: 증언 3 또는 4 + 탁자 관찰 그림.<br>문어 의원 마지막 심문: 증언 3과 5를 맞대기. 또는 증언 3 + 탁자 관찰 그림.<br>진짜 까닭: 네 번째 보기.<br>쓰이지 않는 증거: 수문 장부.</p></details><p><b>과학 표현의 범위</b><br>물질이 물에 녹아도 없어지지 않는다는 것(녹기 전과 후의 무게가 같음), 용액의 진하기를 물체가 뜨는 정도로 견주는 방법, 물을 증발시켜 녹아 있던 물질을 되찾는 방법을 다룹니다. 이야기 속 수치(물 추 10개에 가루약 추 3개)는 계산하기 쉽게 꾸민 것입니다. 실제 실험에서는 설탕이나 소금, 방울토마토나 메추리알을 씁니다. 약이나 모르는 가루를 맛보거나 섞지 않도록 지도해 주세요.</p><p class="muted">로그인 없이 사용하며 진행과 일기는 브라우저 안에만 저장됩니다. 화마다 진행 기록은 별개입니다.</p>`
  };
})();
