'use strict';
// 제7화 · 홍길동전 — 한날한시 여덟 길동
// 홍길동전의 "팔도에 한꺼번에 나타난 길동" 이야기를 바탕으로 새로 꾸민 사건입니다.
// 거리, 시각, 속력은 계산하기 쉽게 꾸민 수입니다.
// 자료 형식은 docs/episode-format.md, 사건 설계는 docs/episode7.md 를 보세요.
window.CASE = (() => {
  const L = (who, text, mood = 'normal', extra = {}) => ({who, text, mood, ...extra});
  const INK = '#3c332b';
  const NEED = 90, SPEEDS = [['걷는 사람', 10], ['달리는 사람', 20], ['가장 빠른 파발마', 60]];

  // ---------- 길 지도 ----------
  function mapArt() {
    const town = (x, y, name, sub) => `<g transform="translate(${x} ${y})"><circle r="15" fill="#f4efe2" stroke="${INK}" stroke-width="3"/><path d="M-9 2l9-9l9 9v7h-18z" fill="#8a5a3a"/><text y="40" text-anchor="middle" font-size="19" font-weight="700" fill="${INK}">${name}</text>${sub ? `<text y="60" text-anchor="middle" font-size="14" fill="#7a3a2c">${sub}</text>` : ''}</g>`;
    const road = (d, x, y, n) => `<path d="${d}" fill="none" stroke="#8a6a4a" stroke-width="7" stroke-linecap="round" stroke-dasharray="2 12"/><g transform="translate(${x} ${y})"><rect x="-34" y="-17" width="68" height="30" rx="8" fill="#fff8e6" stroke="#8a6a4a" stroke-width="2"/><text y="5" text-anchor="middle" font-size="18" font-weight="700" fill="#7a3a2c">${n}리</text></g>`;
    return `<svg class="sack-art" viewBox="0 0 640 356" role="img" aria-label="세 고을의 길 지도. 버들골에서 삼거리까지 70리, 삼거리에서 솔재까지 110리, 삼거리에서 강나루까지 80리."><rect width="640" height="356" rx="14" fill="#e6dcbf"/><path d="M0 250q160-40 320-10t320-30v146H0z" fill="#d6caa6"/>
      ${road('M92 150L300 130', 196, 118, 70)}${road('M300 130L548 92', 426, 88, 110)}${road('M300 130L372 252', 366, 196, 80)}
      ${town(92, 150, '버들골', '곳간이 털림')}${town(548, 92, '솔재', '곳간이 털림')}${town(372, 252, '강나루', '곳간이 털림')}
      <g transform="translate(300 130)"><circle r="9" fill="#b8372c" stroke="${INK}" stroke-width="2"/><text x="-6" y="-18" text-anchor="middle" font-size="16" font-weight="700" fill="${INK}">삼거리</text></g>
      <text x="320" y="344" text-anchor="middle" fill="#776b53" font-size="14">고을 사이의 길과 거리</text></svg>`;
  }
  const bars = () => `<div class="speed-bars">${[...SPEEDS, ['한 사람이 두 곳에 나타나려면', NEED]].map(([name, v], i) => `<div class="speed-bar ${i === 3 ? 'need' : ''}"><span>${name}</span><i style="width:${v}%"></i><b>한 시간에 ${v}리</b></div>`).join('')}</div>`;

  // ---------- 목격담 ----------
  const SIGHT = [
    ['버들골', '밤 8시', '크다', '오른손', '굵다', '푸른 도포와 복면'],
    ['솔재', '밤 10시', '보통이다', '왼손', '쉬었다', '푸른 도포와 복면'],
    ['강나루', '밤 8시', '작다', '오른손', '가늘다', '푸른 도포와 복면']
  ];
  const COLS = ['키', '횃불을 든 손', '목소리', '옷차림'];
  const sightTable = (rowPick, colPick, selR = [], selC = []) => `<div class="tw"><table class="seat"><thead><tr><th scope="col">고을</th><th scope="col">본 때</th>${COLS.map((c, i) => `<th scope="col" class="${selC.includes(i) ? 'picked-col' : ''}">${c}${colPick ? '<br>' + colPick(i) : ''}</th>`).join('')}${rowPick ? '<th scope="col">고르기</th>' : ''}</tr></thead><tbody>${SIGHT.map((r, i) => `<tr${selR.includes(i) ? ' class="soil-target"' : ''}><th scope="row">${r[0]}</th><td>${r[1]}</td>${r.slice(2).map(c => `<td>${c}</td>`).join('')}${rowPick ? `<td>${rowPick(i)}</td>` : ''}</tr>`).join('')}</tbody></table></div>`;

  // ---------- 증거 그림 ----------
  const VIEW = {
    beodeul: () => `<article class="evidence-document ledger-doc"><span class="doc-overline">버들골 곳간 · 조사 기록</span><h3>어젯밤 곳간에서 생긴 일</h3><div class="ledger-grid"><span>털린 때</span><strong>밤 8시 종이 칠 때</strong><span>없어진 것</span><strong>구휼미 스무 섬</strong><span>곳간지기가 본 것</span><strong>푸른 도포와 복면. 키가 크고, 오른손에 횃불, 굵은 목소리</strong><span>남은 것</span><strong>수레바퀴 자국 여러 줄</strong></div><p class="doc-copy">“쌀섬마다 ‘구휼’ 도장이 찍혀 있었음.”</p><p class="doc-signer">본 이 · 곳간지기 박 서방</p></article>`,
    map: () => `<div class="observation-heading"><span>삼거리 주막 · 벽에 붙은 지도</span><b>세 고을의 길 지도</b></div>${mapArt()}<p class="gl">버들골에서 솔재로 가려면 <b>삼거리를 지나야</b> 해요. 길마다 거리가 적혀 있어요.</p>`,
    horse: () => `<article class="evidence-document ledger-doc"><span class="doc-overline">역참 마구간 · 파발 기록</span><h3>얼마나 빨리 갈 수 있나</h3><div class="ledger-grid">${SPEEDS.map(([n, v]) => `<span>${n}</span><strong>한 시간에 ${v}리</strong>`).join('')}<span>어젯밤</span><strong>말이 한 마리도 나가지 않음</strong></div><p class="doc-copy">“파발마보다 빠른 것은<br>이 고을에 없다.”</p><p class="doc-signer">적은 이 · 역참 마부</p></article>`,
    ferry: () => `<article class="evidence-document note-doc"><span class="doc-overline">강나루 나루터 · 뱃사공의 말</span><h3>뱃사공이 본 것</h3><p class="doc-copy">“밤 8시 종이 칠 때였소.<br>푸른 도포에 복면을 쓴 <b>작달막한</b> 사내가<br>곳간에서 뛰쳐나왔지. <b>오른손</b>에 횃불을 들고,<br><b>가느다란</b> 목소리로 ‘나는 홍길동이다!’ 했소.<br>밤새 쌀섬 실은 수레가 여러 대<br>나루 쪽으로 들어왔소.”</p><p class="doc-signer">말한 이 · 강나루 뱃사공</p></article>`,
    reports: () => `<article class="evidence-document ledger-doc"><span class="doc-overline">관아 문서고 · 오늘 아침까지</span><h3>들어온 보고 세 통</h3><div class="ledger-grid"><span>버들골</span><strong>밤 8시 종이 칠 때 털림</strong><span>솔재</span><strong>밤 10시 종이 칠 때 털림. 푸른 도포와 복면. 키는 보통, 왼손에 횃불, 쉰 목소리</strong><span>강나루</span><strong>밤 8시 종이 칠 때 털림</strong><span>그 밖의 고을</span><strong>아직 들어온 보고 없음</strong></div><p class="doc-signer">적은 이 · 관아 서리</p></article>`,
    speed: () => `<div class="observation-heading"><span>법정에서 셈함</span><b>속력 계산 기록</b></div><div class="tw"><table class="seat"><tbody><tr><th scope="row">버들골에서 솔재까지</th><td>70 + 110 = <b>180리</b></td></tr><tr><th scope="row">밤 8시에서 밤 10시까지</th><td><b>2시간</b></td></tr><tr><th scope="row">필요한 속력</th><td class="sick">180 ÷ 2 = 한 시간에 90리</td></tr></tbody></table></div>${bars()}<p class="gl">한 사람이 두 곳에 모두 나타나려면, 가장 빠른 파발마보다도 빨라야 해요.</p>`,
    sightings: () => `<div class="observation-heading"><span>법정에서 견주어 봄</span><b>세 고을의 목격담</b></div>${sightTable()}<p class="gl">버들골과 강나루에는 <b>같은 때</b>에 나타났어요. 옷차림은 같지만 <b>키, 횃불을 든 손, 목소리</b>가 서로 달라요.</p>`,
    search: () => `<article class="evidence-document note-doc"><span class="doc-overline">강나루 객주 창고 · 살핀 기록</span><h3>창고에서 나온 것</h3><p class="doc-copy">쌀섬마다 <b>‘구휼’ 도장</b>이 찍혀 있음.<br>구휼미는 사고팔 수 없는 쌀.<br><b>푸른 도포 여덟 벌</b>에 흙과 횃불 검댕이 묻어 있음.<br>일꾼 여덟의 짚신이 <b>젖은 진흙투성이.</b></p><p class="doc-signer">살핀 이 · 관아 사령</p></article>`
  };

  // ---------- 퍼즐 1: 거리, 시간, 속력 ----------
  const STEPS = [
    {q: '버들골에서 삼거리를 지나 솔재까지는 모두 몇 리일까요?', opts: [150, 170, 180, 190], a: 180, unit: '리', ok: '70리와 110리를 더하면 180리예요.', no: '지도에서 버들골과 삼거리 사이, 삼거리와 솔재 사이의 거리를 더해 보세요.'},
    {q: '버들골 곳간은 밤 8시 종, 솔재 곳간은 밤 10시 종이 칠 때 털렸어요. 그 사이는 몇 시간일까요?', opts: [1, 2, 3], a: 2, unit: '시간', ok: '밤 8시에서 밤 10시까지는 2시간이에요.', no: '8시에서 10시까지 시계가 몇 시간을 가는지 세어 보세요.'},
    {q: '180리를 2시간에 가려면 한 시간에 몇 리를 가야 할까요?', opts: [60, 80, 90, 360], a: 90, unit: '리', ok: '180 ÷ 2 = 90. 한 시간에 90리를 가야 해요.', no: '속력은 간 거리를 걸린 시간으로 나눈 값이에요. 180 ÷ 2 를 계산해 보세요.'}
  ];
  const SPEED = {
    auto: () => [['spd-ans', '180'], ['spd-ans', '2'], ['spd-ans', '90'], ['spd-next', '']],
    draw(s, api) {
      const p = api.P(), a = api.action, n = p.n || 0, done = n >= STEPS.length;
      api.$('#view').innerHTML = `<section class="board puzzle-board"><div class="section-kicker">바람이의 길 셈${done ? '' : ` · ${n + 1} / ${STEPS.length}`}</div><h2>한 사람이 갈 수 있는 길일까?</h2><p class="muted">버들골과 솔재에 나타난 사람이 정말 같은 사람이라면, 얼마나 빨리 달려야 할까요? <b>속력 = 간 거리 ÷ 걸린 시간</b></p>
        ${mapArt()}
        <div class="lab-common">${STEPS.map((st, i) => `<span>${['간 거리', '걸린 시간', '속력'][i]}: ${i < n ? `<b>${st.a}${st.unit}</b>` : '?'}</span>`).join('')}</div>
        ${p.msg ? `<p class="feedback" role="status">${api.esc(p.msg)}</p>` : ''}
        ${done ? `${bars()}<div class="lab-explanation" role="status"><span class="result-seal">길 셈 성공</span><h3>파발마보다 빨라야 해요</h3><p>한 사람이 버들골과 솔재에 모두 나타나려면 한 시간에 90리를 가야 해요. 가장 빠른 파발마도 한 시간에 60리를 가요.</p><p class="muted">말로도 닿을 수 없는 길이에요.</p>${a('spd-next', '속력 계산 기록을 증거함에 넣기 →')}</div>`
          : `<p class="pick-question">${STEPS[n].q}</p><div class="row">${STEPS[n].opts.map(o => a('spd-ans', o + STEPS[n].unit, o, 'seal blue')).join('')}</div>`}</section>`;
    },
    act(a, v, s, api) {
      const p = api.P(), n = p.n || 0;
      if (a === 'spd-ans' && n < STEPS.length) {
        if (+v === STEPS[n].a) { p.n = n + 1; p.msg = STEPS[n].ok; }
        else p.msg = STEPS[n].no;
      }
      if (a === 'spd-next' && n >= STEPS.length) return api.done();
      api.save(); this.draw(s, api);
    }
  };

  // ---------- 퍼즐 2: 세 고을의 길동 ----------
  const SIGHTINGS = {
    auto: () => [['sig-row', '0'], ['sig-row', '2'], ['sig-check', ''], ['sig-col', '0'], ['sig-col', '1'], ['sig-col', '2'], ['sig-check2', ''], ['sig-next', '']],
    draw(s, api) {
      const p = api.P(), a = api.action, rows = p.rows || (p.rows = []), cols = p.cols || (p.cols = []);
      if (p.step !== 2) {
        api.$('#view').innerHTML = `<section class="board puzzle-board"><div class="section-kicker">세 고을의 목격담 · 1단계</div><h2>같은 때에 나타난 길동</h2><p class="muted">세 고을에서 본 “길동”을 한 표에 모았어요. <b>같은 때</b>에 길동이 나타난 두 고을을 골라 주세요.</p>
          ${sightTable(i => a('sig-row', rows.includes(i) ? '고름 ✓' : '고르기', i, 'seal sm' + (rows.includes(i) ? ' fill' : '')), null, rows)}
          ${p.msg ? `<p class="feedback" role="status">${api.esc(p.msg)}</p>` : ''}
          <div class="row end">${a('sig-check', '이 두 고을이에요 →', '', 'seal fill', rows.length !== 2)}</div></section>`;
        return;
      }
      api.$('#view').innerHTML = `<section class="board puzzle-board"><div class="section-kicker">세 고을의 목격담 · 2단계</div><h2>정말 같은 사람일까?</h2><p class="muted">버들골과 강나루는 삼거리를 지나 150리나 떨어져 있어요. 한 사람이 같은 때에 두 곳에 있을 수는 없지요. 이번에는 세 사람의 모습에서 <b>서로 다른 것</b>을 모두 골라 주세요.</p>
        ${sightTable(null, p.ok ? null : i => a('sig-col', cols.includes(i) ? '고름 ✓' : '고르기', i, 'seal sm' + (cols.includes(i) ? ' fill' : '')), [], cols)}
        ${p.msg ? `<p class="feedback" role="status">${api.esc(p.msg)}</p>` : ''}
        ${p.ok ? `<div class="lab-explanation" role="status"><span class="result-seal">견주기 성공</span><h3>같은 옷을 입은, 서로 다른 사람들</h3><p>옷차림은 모두 푸른 도포와 복면으로 같았어요. 하지만 키도, 횃불을 든 손도, 목소리도 달랐어요.</p><p class="muted">한 사람이 여러 몸이 된 것이 아니라, 여러 사람이 같은 옷을 입은 것이에요.</p>${a('sig-next', '목격담을 증거함에 넣기 →')}</div>` : `<div class="row end">${a('sig-check2', '이것들이 달라요 →', '', 'seal fill', !cols.length)}</div>`}</section>`;
    },
    act(a, v, s, api) {
      const p = api.P(), toggle = (arr, i) => arr.includes(i) ? arr.filter(x => x !== i) : [...arr, i];
      if (a === 'sig-row' && p.step !== 2) { p.rows = toggle(p.rows, +v); p.msg = ''; }
      if (a === 'sig-check' && p.step !== 2 && p.rows.length === 2) {
        if ([...p.rows].sort().join() === '0,2') { p.step = 2; p.msg = ''; }
        else p.msg = '“본 때”를 다시 살펴보세요. 같은 종이 칠 때 나타난 두 고을이 있어요.';
      }
      if (a === 'sig-col' && p.step === 2 && !p.ok) { p.cols = toggle(p.cols, +v); p.msg = ''; }
      if (a === 'sig-check2' && p.step === 2) {
        const sel = [...p.cols].sort().join();
        if (sel === '0,1,2') { p.ok = true; p.msg = ''; }
        else if (p.cols.includes(3)) p.msg = '옷차림은 세 고을이 모두 같아요. 서로 다른 것만 골라 주세요.';
        else p.msg = '아직 빠진 것이 있어요. 세 줄을 하나씩 견주어 보세요.';
      }
      if (a === 'sig-next' && p.ok) return api.done();
      api.save(); this.draw(s, api);
    }
  };

  // ---------- 진짜 까닭 고르기 ----------
  const CAUSE = {
    kicker: '최종 추리',
    title: '여덟 고을 곳간이 한날한시에 털린 까닭은?',
    intro: '지금까지 확인한 증거와 <b>모두 맞는</b> 설명을 하나 골라 주세요.',
    body: () => `<div class="lab-common"><span>말로도 닿을 수 없는 거리</span><span>같은 때 두 고을에 나타남</span><span>키도 목소리도 서로 다름</span><span>창고에서 구휼미와 푸른 도포 여덟 벌</span></div>`,
    question: '원님께 어떻게 말씀드릴까요?',
    options: [
      '길동이 가장 빠른 말을 타고 여덟 고을을 돌았다.',
      '길동이 도술로 몸을 여덟으로 나누었다.',
      '여덟 고을의 곳간지기들이 짜고 쌀을 빼돌렸다.',
      '마 객주가 일꾼 여덟에게 푸른 도포를 입혀 길동 행세를 시키고, 구휼미를 빼돌렸다.'
    ],
    check: i => i === 3 || [
      '가장 빠른 말로도 닿을 수 없는 거리였어요. 같은 때에 두 곳에 나타나기도 했지요.',
      '몸을 나눈 것이라면 여덟 길동이 모두 같았겠지요. 목격담 속 사람들은 키도 목소리도 달랐어요.',
      '그렇다는 증거는 없어요. 쌀과 푸른 도포가 나온 곳은 어디였나요?'
    ][i]
  };

  const VERDICT = {
    kicker: '사건 번호 007 · 최종 판결',
    stamp: '무죄',
    title: '홍길동의 누명을 벗겼어요.',
    sub: '이름을 외쳤다고 그 사람인 것은 아니에요. 셈과 견주기가 가짜를 가려냈어요.',
    cards: [
      {title: '관아의 판결 · 원님', who: 'wonnim', text: '이 일은 홍길동이 한 짓이 아니오. 마 객주는 구휼미를 한 톨도 남김없이 여덟 고을에 돌려놓고 벌을 받으시오. 일꾼 여덟은 시켜서 한 일이라 해도 책임이 있으니, 쌀섬을 제 손으로 날라 돌려놓으시오. 이 포교는 셈도 해 보지 않고 사람을 몰아세운 것을 사과하시오.'},
      {modern: true, title: '오늘의 시선 · 한저울 판사', who: 'judge', text: '“그 사람이라면 그랬을 거야”라는 소문만으로 범인이라고 할 수는 없어요. 남의 이름을 대고 나쁜 일을 하는 것은 그 사람에게도 큰 해를 끼치는 잘못이에요. 설명하기 어려운 일을 만나면 “도술이겠지” 하고 넘기지 말고, 거리와 시간을 재고 하나씩 견주어 보아야 해요.'}
    ],
    strip: [['수학', '180 ÷ 2 = 90'], ['과학', '속력 = 간 거리 ÷ 걸린 시간'], ['추리', '한 사람이 갈 수 있었나']],
    note: '1리는 약 400미터예요. 사람이 걷는 속력은 한 시간에 10리, 곧 4킬로미터쯤이에요. 이야기 속 말의 속력과 고을 사이의 거리는 계산하기 쉽게 꾸민 수예요.',
    foot: '고전 인물을 활용해 만든 이야기 속 재판입니다.'
  };

  return {
    n: 7, classic: '홍길동전', title: '한날한시 여덟 길동',
    helper: 'baram',
    court: 'court',
    rules: {pair: true},
    portraits: ['baleum', 'wonnim', 'gildong', 'bak', 'pogyo', 'ma', 'baram', 'judge'],
    art: {wonnim: 'wonnim-v3'},
    chars: {
      baleum: '나바름',
      wonnim: '고을 원님',
      gildong: '홍길동',
      bak: '박 서방',
      pogyo: '이 포교',
      ma: '마 객주',
      baram: '바람이',
      judge: '한저울 판사',
      narr: ''
    },
    glossary: {
      '구휼미': '흉년처럼 어려운 때에, 나라가 굶는 백성에게 나누어 주려고 모아 둔 쌀이에요.',
      '파발꾼': '옛날에 급한 소식을 말을 타고 달려 전하던 사람이에요. 파발꾼이 타는 말이 파발마예요.',
      '증거': '어떤 일이 있었는지 확인하는 데 도움이 되는 물건이나 기록이에요.',
      '증언': '자기가 보고 들은 일을 법정에서 말하는 것이에요.',
      '모순': '앞에서 한 말과 뒤에서 한 말이 서로 맞지 않는 것이에요.',
      '리': '옛날에 거리를 재던 단위예요. 1리는 약 400미터예요.',
      '속력': '얼마나 빠른지를 나타내는 값이에요. 간 거리를 걸린 시간으로 나누어 구해요.',
      '객주': '옛날에 물건을 맡아 팔거나 사고파는 일을 이어 주던 큰 장사꾼이에요.'
    },
    evidence: {
      beodeul: {name: '버들골 곳간 기록', short: '어젯밤 버들골 곳간에서 생긴 일', icon: 'ledger', view: VIEW.beodeul},
      map: {name: '길 지도', short: '세 고을 사이의 길과 거리', icon: 'map', view: VIEW.map},
      horse: {name: '파발 기록', short: '사람과 말이 한 시간에 가는 거리', icon: 'ledger', view: VIEW.horse},
      ferry: {name: '뱃사공의 말', short: '어젯밤 강나루에서 본 것', icon: 'note', view: VIEW.ferry},
      reports: {name: '들어온 보고', short: '오늘 아침까지 관아에 들어온 보고 세 통', icon: 'order', view: VIEW.reports},
      speed: {name: '속력 계산 기록', short: '버들골에서 솔재까지 가는 데 필요한 속력', icon: 'table', view: VIEW.speed},
      sightings: {name: '세 고을의 목격담', short: '세 고을에서 본 “길동”을 견준 표', icon: 'table', view: VIEW.sightings},
      search: {name: '창고에서 나온 것', short: '마 객주의 창고를 살핀 기록', icon: 'note', view: VIEW.search}
    },
    places: [
      {id: 'gotgan', name: '버들골 곳간', art: 'gotgan', ev: 'beodeul', who: 'baleum', line: '버들골 곳간이야. 어젯밤 일을 적어 둔 기록이 있어.'},
      {id: 'jumak', name: '삼거리 주막', art: 'jumak', ev: 'map', who: 'baram', line: '주막 벽에 길 지도가 붙어 있어요. 고을 사이가 몇 리인지 적혀 있어요!'},
      {id: 'stable', name: '역참 마구간', art: 'stable', ev: 'horse', who: 'baram', line: '제가 일하는 역참이에요. 말이 얼마나 빨리 달리는지, 어젯밤에 말이 나갔는지 적혀 있어요.'},
      {id: 'naru', name: '강나루 나루터', art: 'naru', ev: 'ferry', who: 'baleum', line: '나루터 뱃사공이 어젯밤에 본 것을 말해 주었어.'},
      {id: 'office', name: '관아 문서고', art: 'office', ev: 'reports', who: 'wonnim', line: '오늘 아침까지 들어온 보고요. 세 고을에서 왔소.'}
    ],
    witnesses: {
      bak: {
        who: 'bak', title: '첫 심문 · 버들골 곳간지기 박 서방',
        statements: [
          {text: '저는 버들골 곳간을 지키는 박 서방입니다요. 어젯밤 8시 종이 칠 때였습죠.', cards: [{q: '곳간에는 무엇이 있었나요?', a: '굶는 사람들에게 나눠 줄 구휼미가 스무 섬 있었습죠.'}]},
          {text: '푸른 도포를 입은 사내가 곳간에서 뛰쳐나왔는데, 눈만 내놓고 복면을 쓰고 있었습니다요.', cards: [{q: '복면이 얼굴을 얼마나 가렸나요?', a: '눈만 빼고 다 가렸습죠. 코도 입도 안 보였습니다요.'}]},
          {text: '사내는 오른손에 횃불을 치켜들고 “나는 홍길동이다!” 하고 외쳤습죠. 목소리가 굵직했습니다요.', cards: [{q: '전에 홍길동을 만난 적이 있나요?', a: '아닙니다요. 이름만 들었습죠.'}]},
          {text: '저는 그 얼굴을 똑똑히 보았습니다요. 저기 앉은 홍길동이 틀림없습니다요!', cards: [{q: '어떻게 길동인 줄 알았나요?', a: '그야… 제 입으로 홍길동이라 했으니까요.', mood: 'sweat'}]},
          {text: '키가 어찌나 큰지, 곳간 문틀에 머리가 닿을 듯했습니다요.', cards: [{q: '저기 앉은 길동의 키는 어떤가요?', a: '어… 저분은 그리 크지 않으시네요?', mood: 'sweat'}]}
        ],
        solve: {pair: [1, 3], evidence: 'beodeul', statements: [3], near: [
          {pair: [2, 3], text: '이름을 외쳤다고 해서 그 사람이라는 증거가 될까요? 박 서방이 얼굴을 볼 수 있었는지부터 따져 보세요.'},
          {pair: [3, 4], text: '키가 다르다는 것은 좋은 눈이에요. 그런데 그보다 먼저, 박 서방이 얼굴을 볼 수 있었는지를 따져 보세요.'}
        ]},
        hints: ['박 서방은 무엇을 보았고, 무엇을 들었나요?', '그 사내의 얼굴은 어떤 모습이었다고 했나요?', '사내의 차림을 말한 증언과, 얼굴을 보았다는 증언을 맞대어 보세요.'],
        wrong: '박 서방의 말끼리 견주어 보세요. 서로 어긋나는 두 증언을 찾아 「두 증언 맞대기」를 눌러 보세요.',
        success: [
          L('baleum', '눈만 내놓은 복면을 쓰고 있었는데, 얼굴을 어떻게 똑똑히 보셨습니까!', 'stern', {shout: true}),
          L('bak', '아이고, 그러고 보니… 얼굴은 못 봤습니다요. 이름을 외치기에 그런 줄만 알았습죠.', 'sweat'),
          L('gildong', '내 이름을 외친다고 다 나라면, 온 나라가 홍길동이겠소.'),
          L('pogyo', '흥! 얼굴을 못 봤어도 상관없소. 버들골과 솔재에 나타난 자는 틀림없는 길동이오!', 'stern'),
          L('baram', '잠깐만요! 버들골에서 솔재까지 얼마나 먼지부터 따져 봐요. 얼마나 빠른지를 속력이라고 해요.', 'normal', {words: ['속력', '리']})
        ]
      },
      pogyo: {
        who: 'pogyo', title: '두 번째 심문 · 길동을 쫓는 이 포교',
        statements: [
          {text: '나는 열 해째 도적을 잡아 온 이 포교요. 길동의 짓이 틀림없소.', cards: [{q: '길동을 직접 본 적이 있나요?', a: '오늘 처음 보오. 허나 소문은 귀가 닳도록 들었지.'}]},
          {text: '길동은 밤 8시에 버들골 곳간을 털고, 밤 10시에 솔재 곳간을 털었소. 둘 다 “홍길동이다!” 외쳤으니 같은 놈이오.', cards: [{q: '두 고을은 얼마나 떨어져 있나요?', a: '그, 그야… 좀 멀기는 하지.', mood: 'sweat'}]},
          {text: '버들골에서 솔재까지 멀다고? 길동은 가장 빠른 파발마를 훔쳐 탔을 것이오.', cards: [{q: '말을 타는 것을 본 사람이 있나요?', a: '본 사람은 없소만, 달리 방법이 있겠소?'}]},
          {text: '가장 빠른 파발마라면 두 시간 안에 넉넉히 닿고도 남소!', cards: [{q: '파발마는 한 시간에 몇 리를 가나요?', a: '그런 건 마부한테나 물어보시오. 아무튼 빠르오!'}]},
          {text: '그러니 길동 한 놈이 말을 타고 고을을 돌며 턴 것이오. 어서 옥에 가두시오!', cards: [{q: '강나루 곳간은 언제 털렸나요?', a: '강나루? 그건… 아직 살펴보지 못했소.', mood: 'sweat'}]}
        ],
        solve: {evidence: ['speed', 'horse'], statements: [2, 3], near: [
          {evidence: 'map', text: '거리는 지도로 알 수 있어요. 그 거리를 두 시간에 가려면 얼마나 빨라야 하는지 셈한 기록이 있지요.'},
          {evidence: 'reports', text: '두 고을이 털린 때는 포교의 말과 같아요. 포교는 길동이 무엇을 타고 갔다고 했나요? 그 말을 따져 보세요.'}
        ]},
        hints: ['포교는 길동이 어떻게 두 고을에 갔다고 했나요?', '가장 빠른 파발마는 한 시간에 몇 리를 갈까요? 방금 셈한 것과 견주어 보세요.', '파발마에 대해 말한 증언에, 법정에서 셈한 기록을 내밀어 보세요.'],
        wrong: '포교의 말 가운데 숫자로 따져 볼 수 있는 것을 찾아보세요.',
        success: [
          L('baleum', '가장 빠른 파발마도 한 시간에 60리를 갑니다. 버들골에서 솔재까지 두 시간에 가려면 한 시간에 90리를 달려야 합니다. 말로도 닿을 수 없습니다!', 'stern', {shout: true}),
          L('baleum', '게다가 어젯밤 역참의 말은 한 마리도 나가지 않았습니다.'),
          L('pogyo', '끄응… 그, 그렇다면 도술이오! 길동은 몸을 여럿으로 나눈다 하지 않소!', 'shock'),
          L('wonnim', '도술이라 하면 더 따질 것이 없어지오. 변호인의 생각은 어떻소?'),
          L('baleum', '도술 탓으로 돌리기 전에, 세 고을의 목격담을 하나씩 견주어 보겠습니다.'),
          L('baram', '세 고을에서 본 “길동”이 정말 같은 사람인지 살펴봐요!', 'happy')
        ]
      },
      ma1: {
        who: 'ma', title: '세 번째 심문 · 강나루의 마 객주',
        statements: [
          {text: '소인은 강나루에서 쌀 장사를 하는 마 객주입니다. 길동 때문에 밤잠을 못 잡니다.', cards: [{q: '쌀은 어디에서 사 오시나요?', a: '그, 그야 여기저기서 사 오지요. 장사꾼의 비밀입니다.', mood: 'sweat'}]},
          {text: '어젯밤 8시 종이 칠 때, 푸른 도포의 사내가 강나루 곳간에서 뛰쳐나오는 것을 보았지요.', cards: [{q: '그 사내는 어떻게 생겼나요?', a: '작달막하고 목소리가 가늘더이다. 뱃사공도 보았을 겁니다.'}]},
          {text: '여러 사람이라니요. 길동은 도술로 몸을 여덟으로 나눈답니다. 하룻밤에 여덟 고을 곳간이 털렸으니 틀림없지요.', cards: [{q: '여덟 고을이라고요?', a: '그럼요. 여덟 고을입니다. 틀림없습니다.'}]},
          {text: '버들골, 솔재, 강나루에 이어 밤골, 돌머리, 새터, 느티울, 달내까지. 참으로 무서운 도적입니다.', cards: [{q: '그 이름들은 어디에서 들으셨나요?', a: '소, 소문이지요. 장사꾼은 귀가 밝습니다.', mood: 'sweat'}]},
          {text: '이런 도적은 얼른 가두어야, 소인 같은 장사꾼이 마음 놓고 쌀을 팝니다.', cards: [{q: '요즘 쌀이 잘 팔리나요?', a: '오늘 아침에는 창고가 가득 차서… 아, 아닙니다.', mood: 'sweat'}]}
        ],
        solve: {evidence: 'reports', statements: [2, 3], near: [
          {evidence: 'sightings', text: '여러 사람이라는 것은 이미 밝혔어요. 그런데 객주는 곳간이 털린 고을이 몇 곳이라고 했나요? 관아가 아는 것과 견주어 보세요.'},
          {evidence: 'ferry', text: '뱃사공도 같은 때에 같은 모습을 보았어요. 객주의 말과 어긋나지 않지요. 이번에는 객주가 「알고 있는 것」을 살펴보세요.'}
        ]},
        hints: ['객주는 아는 것이 참 많아요.', '오늘 아침까지 관아에 들어온 보고는 모두 몇 통이었나요?', '곳간이 털린 고을의 수나 이름을 말한 증언에, 관아에 들어온 보고를 내밀어 보세요.'],
        wrong: '객주가 본 것보다, 객주가 「알고 있는 것」에 귀를 기울여 보세요.',
        success: [
          L('baleum', '관아에 들어온 보고는 버들골, 솔재, 강나루 세 통뿐입니다. 나머지 다섯 고을의 일은 관아도 아직 모릅니다. 객주께서는 어떻게 아십니까!', 'stern', {shout: true}),
          L('ma', '그, 그야… 장사꾼들 사이에 도는 소문이지요!', 'sweat'),
          L('narr', '바로 그때, 파발꾼들이 줄지어 들어와 다섯 통의 보고를 올렸습니다. 밤골, 돌머리, 새터, 느티울, 달내.', 'normal', {fx: 'drum'}),
          L('wonnim', '소문이 파발보다 빠르단 말이오? 여봐라, 객주의 창고를 살펴보아라!', 'stern'),
          L('narr', '객주의 창고에서는 도장이 찍힌 쌀섬과, 흙 묻은 푸른 도포가 나왔습니다.'),
          L('ma', '오, 오해입니다! 소인의 말을 들어 보십시오!', 'shock')
        ]
      },
      ma2: {
        who: 'ma', title: '마지막 심문 · 창고에서 나온 것',
        statements: [
          {text: '창고의 쌀은 모두 소인이 값을 치르고 산 쌀입니다. 장사꾼 창고에 쌀이 있는 것이 죄입니까?', cards: [{q: '누구에게서 사셨나요?', a: '그, 그건… 지나가던 장사치라 이름을 모릅니다.', mood: 'sweat'}]},
          {text: '푸른 도포는 팔려고 들여놓은 새 옷입니다. 여덟 벌이면 많지도 않지요.', cards: [{q: '새 옷이 틀림없나요?', a: '그럼요. 한 번도 입지 않은 옷입니다.'}]},
          {text: '소인의 일꾼 여덟은 어젯밤 내내 창고에서 잠을 잤습니다. 한 발짝도 나가지 않았지요.', cards: [{q: '일꾼이 꼭 여덟인가요?', a: '예, 여덟입니다. 그게 어쨌다는 겁니까?', mood: 'sweat'}]},
          {text: '그러니 소인은 곳간이 털린 일과 아무 상관이 없습니다.', cards: [{q: '길동을 미워하시나요?', a: '미워하다니요. 그저… 이름이 널리 알려져 쓸모가 많더이다.', mood: 'sweat'}]}
        ],
        solve: {evidence: 'search', statements: [0, 1, 2], near: [
          {evidence: 'ferry', text: '쌀섬 실은 수레가 나루 쪽으로 들어왔다는 것은 좋은 단서예요. 이제 창고 안에서 직접 나온 것으로 객주의 말을 확인해 보세요.'},
          {evidence: 'beodeul', text: '구휼미 섬에 도장이 찍혀 있었다는 것은 중요해요. 그럼 객주의 창고에서 나온 쌀섬은 어땠나요?'}
        ]},
        hints: ['객주는 창고에 있던 것들을 하나씩 변명하고 있어요.', '창고를 직접 살핀 기록이 방금 증거함에 들어왔어요.', '쌀, 도포, 일꾼에 대해 말한 증언 가운데 하나에, 창고를 살핀 기록을 내밀어 보세요.'],
        wrong: '창고에서 나온 것과 객주의 말을 하나씩 견주어 보세요.',
        success: [
          L('baleum', '창고의 쌀섬에는 “구휼” 도장이 찍혀 있습니다. 굶는 백성에게 나누어 주려고 모아 둔 쌀이라, 사고팔 수 없습니다. 푸른 도포 여덟 벌에는 흙과 횃불 검댕이 묻어 있고, 일꾼 여덟의 짚신은 진흙투성이입니다!', 'stern', {shout: true}),
          L('ma', '으으…', 'shock'),
          L('wonnim', '변호인. 그렇다면 여덟 고을 곳간이 한날한시에 털린 까닭을, 증거에 맞게 말해 보시오.', 'stern')
        ]
      }
    },
    custom: {speed: SPEED, sightings: SIGHTINGS},
    stages: [
      {type: 'talk', chapter: '일곱 번째 의뢰', lines: [
        L('narr', '어젯밤, 여러 고을의 곳간이 한꺼번에 털렸습니다. 곳간마다 푸른 도포의 사내가 “나는 홍길동이다!” 하고 외쳤다고 합니다.', 'normal', {fx: 'drum'}),
        L('narr', '다음 날 아침, 홍길동이 제 발로 관아에 걸어 들어왔습니다.'),
        L('gildong', '굶는 백성에게 나눠 줄 구휼미를 내가 훔쳤다니, 당치 않소. 내 이름을 판 자를 찾아 주시오.', 'stern', {words: ['구휼미']}),
        L('pogyo', '제 발로 왔으니 잘되었소! 도술로 여기저기 나타나 곳간을 턴 것이 네놈 아니냐!', 'stern'),
        L('baram', '저는 역참의 파발꾼 바람이예요. 고을과 고을 사이의 길이라면 제가 가장 잘 알아요. 돕게 해 주세요!', 'happy', {words: ['파발꾼']}),
        L('baleum', '저는 나바름입니다. 홍길동의 말을 대신 전하겠습니다. 한 사람이 정말 그 일을 할 수 있었는지, 따져 보겠습니다.'),
        L('wonnim', '좋소. 소문이 아니라 증거로 판단하겠소. 조사해 오시오.', 'stern', {words: ['증거']}),
        L('baram', '곳간과 주막, 역참, 나루터, 관아 문서고까지 다섯 곳이에요. 제가 길을 안내할게요!', 'happy')
      ]},
      {type: 'investigate', chapter: '다섯 곳의 단서', title: '한 사람이 할 수 있는 일일까요?'},
      {type: 'talk', chapter: '곳간지기의 증언', lines: [
        L('narr', '버들골 곳간지기 박 서방이 벌벌 떨며 증인석에 섰습니다.'),
        L('bak', '제, 제가 본 대로 말씀드립니다요.', 'sweat'),
        L('baram', '증언을 넘겨 보고, 이상한 말에 맞는 증거를 내밀어 보세요. 궁금한 말은 질문해도 좋아요.', 'normal', {words: ['증언']}),
        L('baram', '앞에서 한 말과 뒤에서 한 말이 서로 맞지 않으면 그것이 모순이에요. 그럴 땐 두 증언을 맞대 보세요!', 'normal', {words: ['모순']})
      ]},
      {type: 'cross', id: 'bak', chapter: '복면 속의 얼굴'},
      {type: 'speed', chapter: '버들골에서 솔재까지', gain: 'speed', after: [
        L('baleum', '한 사람이 두 곳에 나타나려면 한 시간에 90리를 가야 합니다. 속력 계산 기록을 증거로 남기겠습니다.'),
        L('pogyo', '그깟 셈이 무슨 소용이오. 내 말을 들어 보시오!', 'stern')
      ]},
      {type: 'cross', id: 'pogyo', chapter: '가장 빠른 말'},
      {type: 'sightings', chapter: '세 고을의 길동', gain: 'sightings', after: [
        L('baleum', '같은 옷을 입었을 뿐, 키도 목소리도 횃불을 든 손도 다릅니다. 길동 한 사람이 아니라 여러 사람입니다.'),
        L('gildong', '누군가 내 이름과 푸른 도포를 빌려, 백성의 구휼미를 훔친 것이오.', 'stern'),
        L('narr', '그때 방청석에서 비단옷을 입은 객주가 손을 들었습니다.'),
        L('ma', '원님, 소인도 어젯밤 길동을 보았습니다. 한 말씀 올리겠습니다.', 'normal', {words: ['객주']})
      ]},
      {type: 'cross', id: 'ma1', chapter: '너무 많이 아는 사람', gain: 'search'},
      {type: 'cross', id: 'ma2', chapter: '창고에서 나온 것'},
      {type: 'pick', chapter: '진짜 까닭', ...CAUSE, after: [
        L('baleum', '마 객주가 일꾼 여덟에게 푸른 도포를 입혀 길동 행세를 시키고, 여덟 고을의 구휼미를 창고로 빼돌렸습니다.', 'stern'),
        L('ma', '…길동의 이름을 대면 아무도 뒤를 캐지 않을 줄 알았소. 도술 탓을 하면 그만이니.', 'sad'),
        L('pogyo', '내가 서둘러 길동으로 몰았구려. 길동, 미안하오. 셈부터 해 볼 것을.', 'sad'),
        L('gildong', '내 이름은 돌려받았으니 되었소. 쌀은 굶는 이들에게 돌려주시오.'),
        L('baram', '간 거리 나누기 걸린 시간! 속력만 알면 거짓말이 안 통해요.', 'happy'),
        L('wonnim', '이제 판결을 내리겠소.', 'stern')
      ]},
      {type: 'verdict', chapter: '증거가 이끄는 판결', ...VERDICT},
      {type: 'diary', chapter: '나의 판관 일기'},
      {type: 'end', chapter: '돌아가는 쌀 수레'}
    ],
    landing: {
      intro: '같은 밤, 여덟 고을 곳간이 털렸다.<br>곳마다 “나는 홍길동이다!” 외침이 들렸다는데,<br><strong>거리와 시간으로 진실을 밝혀 주세요.</strong>',
      start: '홍길동의 사건 맡기',
      backdrop: 'jumak',
      people: [['gildong', 'stern'], ['pogyo', 'stern'], ['baleum', 'normal']],
      bubble: '한 사람이 갈 수 있는 길인지 셈해 봅시다!',
      label: ['홍길동전에서 시작된 새로운 사건', '한날한시 여덟 길동의 진실'],
      steps: ['단서 수집', '거리와 속력', '증거로 판결'],
      credit: '초등 5학년부터 · 읽는 속도에 따라 약 35–45분 · 진행 자동 저장'
    },
    diary: {
      title: '이 재판에서 무엇을 생각했나요?',
      intro: '가장 마음에 드는 생각을 골라 주세요. 여기에는 정답이 없어요.',
      choices: [
        '소문만 듣고 “그 사람이 했을 거야” 하고 말하면 안 돼요.',
        '남의 이름을 대고 나쁜 일을 하면, 그 사람까지 억울해져요.',
        '설명하기 어려운 일도 재고 셈해 보면 까닭을 찾을 수 있어요.'
      ],
      placeholder: '예: 이상한 소문을 들으면 먼저 따져 볼 거예요.'
    },
    end: {
      backdrop: 'jumak',
      people: [['gildong', 'happy'], ['baram', 'happy']],
      quote: '“간 거리 나누기 걸린 시간! 속력만 알면 거짓말이 안 통해요.”',
      kicker: '일곱 번째 사건 해결',
      title: '여덟 길동은<br><em>여덟 사람이었어요.</em>',
      text: '구휼미를 실은 수레가 여덟 고을로 되돌아갔습니다.<br>바람이는 가장 빠른 파발마를 타고, 그 소식을 고을마다 전했습니다.',
      badges: ['속력 계산가', '목격담 감정사', '모순 사냥꾼']
    },
    guide: `<h3>제7화 · 교사·보호자 안내</h3><p>증언과 증거를 비교하며 사건을 해결하는 어린이 법정 추리 게임입니다.</p><p>아이가 답을 고른 까닭을 묻고, 서로 다른 증거가 같은 결론을 가리키는지 함께 살펴보세요. 책임 저울과 판관 일기에서는 자신의 생각을 근거와 함께 표현하도록 도와주세요.</p><p>사건의 해설과 교사용 정답은 교사용 검수실에서 비밀번호를 입력한 뒤 확인할 수 있습니다.</p><p class="muted">로그인이나 개인정보 입력 없이 사용하며, 진행 상황과 판관 일기는 이 브라우저에 저장됩니다. 화마다 진행 기록은 별개입니다.</p>`
  };
})();
