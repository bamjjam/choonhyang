'use strict';
// 제6화 · 옹고집전 — 옹고집이 둘이오!
// 옹고집전의 "진짜와 가짜가 관아에서 다투는" 송사를 바탕으로 새로 꾸민 사건입니다.
// 자료 형식은 docs/episode-format.md, 사건 설계는 docs/episode6.md 를 보세요.
//
// 좌우는 모두 "마주 보았을 때"를 기준으로 적습니다. (R = 보는 사람의 오른쪽)
window.CASE = (() => {
  const L = (who, text, mood = 'normal', extra = {}) => ({who, text, mood, ...extra});
  const INK = '#3c332b', side = s => s === 'R' ? '오른쪽' : '왼쪽', flip = s => s === 'R' ? 'L' : 'R';
  const FEATURES = [['mole', '뺨의 점'], ['scar', '눈썹 위 흉터'], ['knot', '갓끈 매듭']];
  const REAL = {mole: 'R', scar: 'L', knot: 'L'};
  const FAKE = {mole: flip(REAL.mole), scar: flip(REAL.scar), knot: flip(REAL.knot)};
  const NAMES = ['쫓겨난 옹고집', '안방 옹고집'];

  // ---------- 얼굴 그림 ----------
  function bust(f, frame) {
    const x = (s, d) => 100 + (s === 'R' ? d : -d);
    return `<svg viewBox="0 0 200 236" role="img" aria-label="마주 본 얼굴. 점은 ${side(f.mole)} 뺨, 흉터는 ${side(f.scar)} 눈썹 위, 갓끈 매듭은 ${side(f.knot)}에 있다.">${frame ? `<rect x="3" y="3" width="194" height="230" rx="6" fill="#f3ead2" stroke="#8a6a4a" stroke-width="6"/>` : `<rect width="200" height="236" rx="10" fill="#e9dfc8"/>`}
      <path d="M34 236q4-58 66-62q62 4 66 62z" fill="#7a8f8a" stroke="${INK}" stroke-width="2.5"/><path d="M84 176l16 26l16-26" fill="none" stroke="#f4efe2" stroke-width="7"/>
      <ellipse cx="100" cy="116" rx="44" ry="52" fill="#f1d3b0" stroke="${INK}" stroke-width="2.5"/>
      <ellipse cx="100" cy="66" rx="86" ry="11" fill="#1f1b18" opacity=".9"/><path d="M70 66V28q30-8 60 0v38z" fill="#1f1b18" opacity=".9"/>
      <path d="M62 72q-6 52 20 92M138 72q6 52-20 92" fill="none" stroke="#7a4e2b" stroke-width="2.5" stroke-dasharray="1 6" stroke-linecap="round"/>
      <path d="M72 98q10-7 20 0M108 98q10-7 20 0" fill="none" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>
      <ellipse cx="82" cy="110" rx="4" ry="5" fill="${INK}"/><ellipse cx="118" cy="110" rx="4" ry="5" fill="${INK}"/>
      <path d="M98 114q-5 12 3 16" fill="none" stroke="${INK}" stroke-width="2" opacity=".6"/><path d="M86 142q14 8 28 0" fill="none" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M84 150q16 30 32 0q-16 12-32 0z" fill="${INK}" opacity=".8"/>
      <circle cx="${x(f.mole, 27)}" cy="130" r="5.5" fill="#2a1d14"/>
      <path d="M${x(f.scar, 30)} 80l${f.scar === 'R' ? -14 : 14} 9" stroke="#b8372c" stroke-width="4" stroke-linecap="round"/>
      <g transform="translate(${x(f.knot, 28)} 168)"><circle r="8" fill="#d29c22" stroke="${INK}" stroke-width="2"/><path d="M-3 7l-2 16M3 7l2 16" stroke="#b8372c" stroke-width="3" stroke-linecap="round"/></g></svg>`;
  }
  const card = (title, f, cls = '', frame = false) => `<figure class="bust-card ${cls}">${bust(f, frame)}<figcaption>${title}</figcaption></figure>`;
  const featureTable = rows => `<div class="tw"><table class="seat"><thead><tr><th scope="col">마주 보았을 때</th>${FEATURES.map(f => `<th scope="col">${f[1]}</th>`).join('')}</tr></thead><tbody>${rows.map(([name, f, mark]) => `<tr${mark ? ' class="soil-target"' : ''}><th scope="row">${name}</th>${FEATURES.map(([k]) => `<td>${side(f[k])}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;

  const footArt = () => {
    const print = (x, y, deep) => `<g transform="translate(${x} ${y})"><ellipse rx="13" ry="24" fill="${deep ? '#5a4634' : 'none'}" stroke="#5a4634" stroke-width="${deep ? 3 : 1.5}" ${deep ? '' : 'stroke-dasharray="3 5" opacity=".7"'}/></g>`;
    return `<svg class="sack-art" viewBox="0 0 640 250" role="img" aria-label="진흙 마당의 발자국 두 줄. 윗줄은 깊게 찍혔고, 아랫줄은 거의 찍히지 않았다."><rect width="640" height="250" rx="14" fill="#c9b08a"/><text x="24" y="40" font-size="18" font-weight="700" fill="${INK}">쫓겨난 옹고집이 걸은 자리</text>${[0, 1, 2, 3, 4, 5].map(i => print(70 + i * 100, 82 + (i % 2) * 22, true)).join('')}<text x="24" y="160" font-size="18" font-weight="700" fill="${INK}">안방 옹고집이 걸은 자리</text>${[0, 1, 2, 3, 4, 5].map(i => print(70 + i * 100, 198 + (i % 2) * 22, false)).join('')}</svg>`;
  };
  const roomArt = () => `<svg class="sack-art" viewBox="0 0 640 330" role="img" aria-label="위에서 본 사랑방. 아랫목에 앉으면 왼쪽에 문, 오른쪽에 창이 있다. 앞쪽 벽의 족자 속 호랑이는 문 쪽을 본다."><rect width="640" height="330" rx="14" fill="#eae1cc"/><rect x="90" y="40" width="460" height="230" fill="#e2cfa6" stroke="#8a6a4a" stroke-width="6"/>
    <rect x="84" y="150" width="12" height="70" fill="#6b4a2d"/><text x="70" y="190" text-anchor="end" font-size="19" font-weight="700" fill="${INK}">문</text>
    <rect x="544" y="110" width="12" height="80" fill="#9cc3d6" stroke="${INK}" stroke-width="2"/><text x="570" y="156" font-size="19" font-weight="700" fill="${INK}">창</text>
    <rect x="84" y="70" width="12" height="60" fill="#cfe1e6" stroke="${INK}" stroke-width="2"/><text x="70" y="106" text-anchor="end" font-size="17" font-weight="700" fill="${INK}">큰 거울</text>
    <rect x="260" y="34" width="120" height="18" fill="#f4efe2" stroke="${INK}" stroke-width="2"/><path d="M300 78h-34m0 0l10-7m-10 7l10 7" stroke="#b8372c" stroke-width="3" fill="none" stroke-linecap="round"/><text x="310" y="84" font-size="17" font-weight="700" fill="${INK}">호랑이 족자 (호랑이가 보는 쪽)</text>
    <rect x="270" y="150" width="100" height="44" rx="4" fill="#a5794a" stroke="${INK}" stroke-width="2"/><rect x="342" y="158" width="20" height="14" fill="#2f2a26"/><text x="320" y="142" text-anchor="middle" font-size="15" fill="${INK}">책상 (벼루와 붓은 오른쪽)</text>
    <circle cx="320" cy="232" r="16" fill="#b8372c" stroke="${INK}" stroke-width="2"/><path d="M320 212v-14m0 0l-6 8m6-8l6 8" stroke="${INK}" stroke-width="2.5" fill="none"/><text x="320" y="296" text-anchor="middle" font-size="17" font-weight="700" fill="${INK}">아랫목에 앉은 자리 (앞을 보고 앉음)</text></svg>`;

  // ---------- 두 옹고집의 답 ----------
  const QA = [
    ['논은 모두 몇 마지기인가?', '서른 마지기', '서른 마지기'],
    ['글씨는 어느 손으로 쓰는가?', '오른손', '왼손'],
    ['사랑방 아랫목에 앉으면 문은 어느 쪽인가?', '왼쪽', '오른쪽'],
    ['어릴 적 감나무에서 떨어져 다친 눈썹은 어느 쪽인가?', '오른쪽 눈썹', '왼쪽 눈썹'],
    ['베개 밑에 넣어 둔 것은 무엇인가?', '어머니가 물려주신 놋숟가락', '엽전 꾸러미']
  ];
  const qaTable = (pick, sel = []) => `<div class="tw"><table class="seat qa-table"><thead><tr><th scope="col">원님의 물음</th><th scope="col">${NAMES[0]}</th><th scope="col">${NAMES[1]}</th>${pick ? '<th scope="col">고르기</th>' : ''}</tr></thead><tbody>${QA.map((r, i) => `<tr${sel.includes(i) ? ' class="soil-target"' : ''}><th scope="row">${r[0]}</th><td>${r[1]}</td><td>${r[2]}</td>${pick ? `<td>${pick(i)}</td>` : ''}</tr>`).join('')}</tbody></table></div>`;

  // ---------- 증거 그림 ----------
  const VIEW = {
    portrait: () => `<div class="observation-heading"><span>안채 마루 · 삼 년 전 화공이 그림</span><b>옹고집의 초상화</b></div><div class="busts">${card('초상화', REAL, '', true)}</div><p class="gl">화공이 옹고집과 <b>마주 앉아</b> 본 모습 그대로 그렸어요.<br>마주 보았을 때 점은 <b>오른쪽 뺨</b>, 흉터는 <b>왼쪽 눈썹 위</b>, 갓끈 매듭은 <b>왼쪽</b>에 있어요.</p>`,
    room: () => `<div class="observation-heading"><span>사랑방 · 위에서 본 그림</span><b>사랑방 살핀 그림</b></div>${roomArt()}<p class="gl">아랫목에 앉으면 <b>왼쪽이 문, 오른쪽이 창</b>이에요.<br>족자 속 호랑이는 <b>문 쪽</b>을 보고 있어요.<br>책상의 벼루와 붓은 <b>오른손</b>으로 잡기 좋은 자리에 놓여 있어요.</p>`,
    window: () => `<article class="evidence-document note-doc"><span class="doc-overline">사랑방 뒤뜰 · 창밖을 살핀 기록</span><h3>창밖에서 보이는 것</h3><p class="doc-copy">창 안쪽에 병풍이 서 있어<br>방 안이 <b>바로 보이지 않음.</b><br>병풍 위로 맞은편 벽의 <b>큰 거울</b>만 보임.<br>거울에는 아랫목에 앉은 사람이 비침.<br>창 밑 흙에 <b>지팡이 자국</b>과 <b>볏짚 부스러기</b>.</p><p class="doc-signer">살핀 이 · 나바름과 먹실</p></article>`,
    foot: () => `<div class="observation-heading"><span>앞마당 · 오늘 아침, 비 온 뒤</span><b>진흙 마당의 발자국</b></div>${footArt()}<p class="gl">두 사람이 오늘 아침 나란히 마당을 걸어 관아로 갔어요.<br>쫓겨난 옹고집의 발자국은 <b>깊게</b> 찍혔고, 안방 옹고집의 발자국은 <b>거의 찍히지 않았어요.</b></p>`,
    granary: () => `<article class="evidence-document ledger-doc"><span class="doc-overline">옹고집네 곳간 장부</span><h3>쌀을 내어 준 기록</h3><div class="ledger-grid"><span>지난 삼 년</span><strong>남에게 내어 준 쌀 없음</strong><span>어제</span><strong>안방 옹고집의 말에 따라, 이웃 열 집에 쌀 한 섬씩 나눔</strong></div><p class="doc-signer">적은 이 · 옹고집의 아내</p></article>`,
    compare: () => `<div class="observation-heading"><span>법정에서 견주어 봄</span><b>초상화와 두 사람</b></div>${featureTable([['초상화', REAL, true], [NAMES[0], REAL], [NAMES[1], FAKE]])}<p class="gl">쫓겨난 옹고집은 세 군데가 모두 초상화와 같아요.<br>안방 옹고집은 세 군데가 모두 반대예요. <b>초상화를 거울에 비춘 모습</b>과 같아요.</p>`,
    answers: () => `<div class="observation-heading"><span>원님이 두 사람을 따로 불러 물음</span><b>두 옹고집의 답</b></div>${qaTable()}<p class="gl">안방 옹고집의 답 가운데 세 가지는 <b>오른쪽과 왼쪽만</b> 뒤바뀌어 있어요.</p>`
  };

  // ---------- 퍼즐 1: 초상화와 두 사람 ----------
  const MIRROR = {
    auto: () => [['mir-pick', '0|0'], ['mir-pick', '1|0'], ['mir-pick', '2|0'], ['mir-check', ''], ['mir-flip', ''], ['mir-match', '1'], ['mir-next', '']],
    draw(s, api) {
      const p = api.P(), a = api.action, pick = p.pick || (p.pick = [null, null, null]);
      if (p.step !== 2) {
        api.$('#view').innerHTML = `<section class="board puzzle-board"><div class="section-kicker">먹실의 초상화 견주기 · 1단계</div><h2>초상화와 같은 사람은 누구일까?</h2><p class="muted">초상화는 마주 앉아 본 모습 그대로예요. 세 군데를 하나씩 견주어, <b>초상화와 같은 쪽</b>에 있는 사람을 골라 주세요.</p>
          <div class="busts">${card('초상화', REAL, '', true)}${card(NAMES[0], REAL)}${card(NAMES[1], FAKE)}</div>
          <div class="feature-list">${FEATURES.map(([k, name], i) => `<div class="pick-row"><span>${name}</span>${NAMES.map((n, w) => a('mir-pick', n, i + '|' + w, 'seal sm' + (pick[i] === w ? ' fill' : ''))).join('')}</div>`).join('')}</div>
          ${p.msg ? `<p class="feedback" role="status">${api.esc(p.msg)}</p>` : ''}
          <div class="row end">${a('mir-check', '이렇게 견주었어요 →', '', 'seal fill', pick.includes(null))}</div></section>`;
        return;
      }
      api.$('#view').innerHTML = `<section class="board puzzle-board"><div class="section-kicker">먹실의 초상화 견주기 · 2단계</div><h2>초상화를 거울에 비추면?</h2><p class="muted">쫓겨난 옹고집은 세 군데가 모두 초상화와 같았어요. 그런데 안방 옹고집은 왜 세 군데가 <b>모두 반대</b>일까요? 초상화를 거울에 비추어 보세요.</p>
        <div class="busts">${p.flipped ? card('거울에 비춘 초상화', FAKE, 'target', true) : card('초상화', REAL, '', true)}${card(NAMES[0], REAL)}${card(NAMES[1], FAKE)}</div>
        ${!p.flipped ? `<div class="row end">${a('mir-flip', '초상화를 거울에 비추기')}</div>`
          : p.ok ? `<div class="lab-explanation" role="status"><span class="result-seal">견주기 성공</span><h3>안방 옹고집은 거울 속 모습과 같아요</h3><p>거울에 비친 모습은 오른쪽과 왼쪽이 바뀌어 보여요. 안방 옹고집은 점, 흉터, 갓끈 매듭이 모두 거울 속 초상화와 같은 자리에 있어요.</p><p class="muted">사람을 직접 마주 본 것이 아니라, 거울에 비친 모습을 본뜬 것처럼요.</p>${a('mir-next', '견주기 기록을 증거함에 넣기 →')}</div>`
          : `<p class="pick-question">거울에 비춘 초상화와 세 군데가 모두 같은 사람은 누구일까요?</p><div class="row">${NAMES.map((n, w) => a('mir-match', n, w, 'seal blue')).join('')}</div>${p.msg ? `<p class="feedback" role="status">${api.esc(p.msg)}</p>` : ''}`}</section>`;
    },
    act(a, v, s, api) {
      const p = api.P();
      if (a === 'mir-pick' && p.step !== 2) { const [i, w] = v.split('|').map(Number); if (i < 3 && w < 2) { p.pick[i] = w; p.msg = ''; } }
      if (a === 'mir-check' && p.step !== 2 && !p.pick.includes(null)) {
        const bad = p.pick.findIndex(w => w !== 0);
        if (bad < 0) { p.step = 2; p.msg = ''; }
        else p.msg = `${FEATURES[bad][1]}을(를) 다시 견주어 보세요. 초상화에서는 ${side(REAL[FEATURES[bad][0]])}에 있어요.`;
      }
      if (a === 'mir-flip' && p.step === 2) { p.flipped = true; p.msg = ''; }
      if (a === 'mir-match' && p.flipped) {
        if (+v === 1) p.ok = true;
        else p.msg = '쫓겨난 옹고집은 거울에 비추기 전의 초상화와 같았어요. 거울 속 초상화와 다시 견주어 보세요.';
      }
      if (a === 'mir-next' && p.ok) return api.done();
      api.save(); this.draw(s, api);
    }
  };

  // ---------- 퍼즐 2: 두 옹고집의 답 ----------
  const WHY = ['기억이 흐려서 아무렇게나 틀렸다.', '거울에 비친 모습으로 옹고집과 사랑방을 알았다.', '원님을 놀리려고 일부러 반대로 말했다.'];
  const ANSWERS = {
    auto: () => [['ans-row', '1'], ['ans-row', '2'], ['ans-row', '3'], ['ans-check', ''], ['ans-why', '1'], ['ans-next', '']],
    draw(s, api) {
      const p = api.P(), a = api.action, sel = p.sel || (p.sel = []);
      if (p.step !== 2) {
        api.$('#view').innerHTML = `<section class="board puzzle-board"><div class="section-kicker">두 사람의 답 · 1단계</div><h2>어긋난 답을 찾아라</h2><p class="muted">원님이 두 옹고집을 따로 불러 같은 것을 물었어요. 두 사람의 답이 <b>오른쪽과 왼쪽만 뒤바뀐</b> 줄을 모두 골라 주세요.</p>
          ${qaTable(i => a('ans-row', sel.includes(i) ? '고름 ✓' : '고르기', i, 'seal sm' + (sel.includes(i) ? ' fill' : '')), sel)}
          ${p.msg ? `<p class="feedback" role="status">${api.esc(p.msg)}</p>` : ''}
          <div class="row end">${a('ans-check', '이 줄들이에요 →', '', 'seal fill', !sel.length)}</div></section>`;
        return;
      }
      api.$('#view').innerHTML = `<section class="board puzzle-board"><div class="section-kicker">두 사람의 답 · 2단계</div><h2>왜 좌우만 뒤바뀌었을까?</h2><p class="muted">안방 옹고집은 세 가지를 틀렸는데, 아무렇게나 틀리지 않았어요. 세 가지 모두 <b>오른쪽과 왼쪽만</b> 반대예요.</p>
        ${qaTable(null, [1, 2, 3])}
        ${p.ok ? `<div class="lab-explanation" role="status"><span class="result-seal">추리 성공</span><h3>거울 속 세상을 알고 있어요</h3><p>거울에 비치면 오른손은 왼손처럼, 왼쪽 문은 오른쪽 문처럼 보여요. 안방 옹고집이 아는 옹고집과 사랑방은 <b>거울에 비친 모습</b>이에요.</p><p class="muted">베개 밑의 물건처럼 거울에 비치지 않는 것은 아예 알지 못했어요.</p>${a('ans-next', '두 사람의 답을 증거함에 넣기 →')}</div>`
          : `<p class="pick-question">가장 알맞은 까닭은 무엇일까요?</p><div class="cards">${WHY.map((w, i) => a('ans-why', w, i, 'seal blue')).join('')}</div>${p.msg ? `<p class="feedback" role="status">${api.esc(p.msg)}</p>` : ''}`}</section>`;
    },
    act(a, v, s, api) {
      const p = api.P();
      if (a === 'ans-row' && p.step !== 2) { const i = +v; p.sel = p.sel.includes(i) ? p.sel.filter(x => x !== i) : [...p.sel, i]; p.msg = ''; }
      if (a === 'ans-check' && p.step !== 2) {
        const sel = [...p.sel].sort().join();
        if (sel === '1,2,3') { p.step = 2; p.msg = ''; }
        else if (p.sel.includes(0)) p.msg = '첫째 줄은 두 사람의 답이 같아요. 답이 서로 다른 줄만 살펴보세요.';
        else if (p.sel.includes(4)) p.msg = '마지막 줄은 답이 다르지만, 오른쪽과 왼쪽이 뒤바뀐 것은 아니에요.';
        else p.msg = '아직 빠진 줄이 있어요. 오른쪽과 왼쪽이 서로 반대인 줄을 모두 찾아보세요.';
      }
      if (a === 'ans-why' && p.step === 2) {
        if (+v === 1) p.ok = true;
        else p.msg = ['아무렇게나 틀렸다면 세 가지가 모두 좌우만 반대일 수 있을까요? 틀린 답의 공통점을 생각해 보세요.', '', '놀리려 했다면 논의 넓이도 다르게 말했겠지요. 좌우만 반대인 까닭을 생각해 보세요.'][+v];
      }
      if (a === 'ans-next' && p.ok) return api.done();
      api.save(); this.draw(s, api);
    }
  };

  // ---------- 진짜 까닭 고르기 ----------
  const CAUSE = {
    kicker: '최종 추리',
    title: '옹고집이 둘이 된 까닭은?',
    intro: '지금까지 확인한 증거와 <b>모두 맞는</b> 설명을 하나 골라 주세요.',
    body: () => `<div class="lab-common"><span>안방 옹고집은 거울 속 초상화와 같다</span><span>답의 좌우가 뒤바뀌었다</span><span>도사가 창밖에서 거울을 보았다</span><span>발자국이 거의 찍히지 않았다</span></div>`,
    question: '원님께 어떻게 말씀드릴까요?',
    options: [
      '쫓겨난 옹고집이 진짜인 척하는 사기꾼이다.',
      '두 사람은 어릴 때 헤어진 쌍둥이 형제다.',
      '안방 옹고집은 누군가 초상화를 보고 만든 가짜다.',
      '안방 옹고집은 도사가 거울에 비친 옹고집을 보고 볏짚으로 빚은 가짜다.'
    ],
    check: i => i === 3 || [
      '쫓겨난 옹고집은 세 군데가 모두 초상화와 같고, 발자국도 깊게 찍혔어요.',
      '쌍둥이라면 좌우가 뒤바뀌지도, 볏짚처럼 가볍지도 않겠지요.',
      '초상화를 보고 만들었다면 초상화와 같았을 거예요. 안방 옹고집은 좌우가 모두 반대였어요.'
    ][i]
  };

  const VERDICT = {
    kicker: '사건 번호 006 · 최종 판결',
    stamp: '진짜',
    title: '쫓겨난 옹고집이 진짜였어요.',
    sub: '마음이 가는 쪽이 아니라, 증거가 가리키는 쪽을 따랐어요.',
    cards: [
      {title: '관아의 판결 · 원님', who: 'wonnim', text: '쫓겨난 옹고집이 진짜요. 집과 이름을 돌려주겠소. 도사는 깨우치려는 뜻이었다 해도, 사람을 속여 제 집에서 쫓겨나게 한 것은 옳지 않으니 옹고집에게 사과하시오. 옹고집은 재판에서 이겼으나, 식구들이 볏짚 사람을 더 반긴 까닭을 잊지 마시오.'},
      {modern: true, title: '오늘의 시선 · 한저울 판사', who: 'judge', text: '누가 더 좋은 사람인지와 누가 진짜인지는 다른 물음이에요. 마음에 들지 않는 사람이라도 사실은 사실대로 가려야 하고, 누구나 공정한 재판을 받을 권리가 있어요. 또 아무리 좋은 뜻이라도 남을 속여서 혼자 벌을 주어서는 안 돼요. 잘못을 가리는 일은 모두가 볼 수 있는 재판에서 해야 해요.'}
    ],
    strip: [['과학', '거울 속은 좌우가 반대'], ['과학', '볏짚은 사람보다 가볍다'], ['추리', '틀린 답의 공통점']],
    note: '거울에 비친 모습은 오른쪽과 왼쪽이 바뀌어 보여요. 오른손을 들고 거울을 보면, 거울 속의 나는 왼손을 든 것처럼 보이지요.',
    foot: '고전 인물을 활용해 만든 이야기 속 재판입니다.'
  };

  return {
    n: 6, classic: '옹고집전', title: '옹고집이 둘이오!',
    helper: 'meoksil',
    court: 'court',
    rules: {pair: true},
    portraits: ['baleum', 'wonnim', 'ong', 'ong2', 'buin', 'dosa', 'meoksil', 'judge'],
    art: {wonnim: 'wonnim-v3', ong2: 'ong'},
    flip: ['ong2'],
    chars: {
      baleum: '나바름',
      wonnim: '고을 원님',
      ong: '쫓겨난 옹고집',
      ong2: '안방 옹고집',
      buin: '옹고집의 아내',
      dosa: '삿갓 도사',
      meoksil: '먹실',
      judge: '한저울 판사',
      narr: ''
    },
    glossary: {
      '초상화': '사람의 얼굴이나 모습을 그린 그림이에요.',
      '증거': '어떤 일이 있었는지 확인하는 데 도움이 되는 물건이나 기록이에요.',
      '증언': '자기가 보고 들은 일을 법정에서 말하는 것이에요.',
      '모순': '앞에서 한 말과 뒤에서 한 말이 서로 맞지 않는 것이에요.',
      '시주': '절이나 스님에게 쌀이나 돈을 베푸는 일이에요.',
      '아랫목': '온돌방에서 아궁이와 가까워 따뜻한 쪽이에요. 주인이 주로 앉는 자리예요.',
      '마지기': '논밭의 넓이를 세는 단위예요.'
    },
    evidence: {
      portrait: {name: '옹고집의 초상화', short: '삼 년 전 화공이 마주 앉아 그린 그림', icon: 'book', view: VIEW.portrait},
      room: {name: '사랑방 살핀 그림', short: '사랑방을 위에서 본 그림', icon: 'map', view: VIEW.room},
      window: {name: '창밖을 살핀 기록', short: '사랑방 뒤뜰 창밖에서 보이는 것', icon: 'note', view: VIEW.window},
      foot: {name: '진흙 마당의 발자국', short: '오늘 아침 두 사람이 남긴 발자국', icon: 'map', view: VIEW.foot},
      granary: {name: '곳간 장부', short: '옹고집네 곳간에서 쌀을 내어 준 기록', icon: 'ledger', view: VIEW.granary},
      compare: {name: '견주기 기록', short: '초상화와 두 사람을 견준 기록', icon: 'table', view: VIEW.compare},
      answers: {name: '두 옹고집의 답', short: '같은 물음에 대한 두 사람의 답', icon: 'table', view: VIEW.answers}
    },
    places: [
      {id: 'anchae', name: '안채 마루', art: 'anchae', ev: 'portrait', who: 'meoksil', line: '삼 년 전에 아버지가 그리신 초상화예요. 옹고집 어른과 마주 앉아 본 모습 그대로 그리셨어요.'},
      {id: 'sarang', name: '사랑방', art: 'sarang', ev: 'room', who: 'baleum', line: '옹고집이 날마다 앉는 사랑방이야. 무엇이 어느 쪽에 있는지 그려 두자.'},
      {id: 'backyard', name: '사랑방 뒤뜰', art: 'backyard', ev: 'window', who: 'meoksil', line: '창밖에서 방 안을 들여다봤어요. 그런데 병풍에 가려서 거울만 보여요.'},
      {id: 'ongyard', name: '앞마당', art: 'ongyard', ev: 'foot', who: 'baleum', line: '비가 와서 마당이 질어. 오늘 아침 두 사람이 걸어간 자국이 남아 있군.'},
      {id: 'gotgan', name: '곳간', art: 'gotgan', ev: 'granary', who: 'buin', line: '곳간 장부이옵니다. 어제 안방 서방님께서 처음으로 쌀을 나누라 하셨지요.'}
    ],
    witnesses: {
      buin: {
        who: 'buin', title: '첫 심문 · 옹고집의 아내',
        statements: [
          {text: '저는 옹고집의 아내이옵니다. 서른 해를 함께 살았으니, 제 서방님을 몰라볼 리 없지요.', cards: [{q: '서방님은 어떤 분인가요?', a: '…인색하고 무뚝뚝한 분이지요. 서른 해 동안 따뜻한 말 한마디 못 들었사옵니다.'}]},
          {text: '안방에 계신 분이 진짜 서방님이옵니다. 어제는 웬일로 곳간을 열어 이웃에 쌀을 나누라 하셨지요.', cards: [{q: '전에도 쌀을 나눈 적이 있나요?', a: '없사옵니다. 그래서 놀랍고도 기뻤지요.'}]},
          {text: '얼굴도 똑같사옵니다. 서방님의 점은 마주 보면 오른쪽 뺨에 있는데, 안방에 계신 분의 점도 꼭 그 자리에 있사옵니다.', cards: [{q: '안방 옹고집의 얼굴을 찬찬히 보셨나요?', a: '그, 그야… 서방님 얼굴을 새삼 들여다볼 일이 있어야지요.', mood: 'sweat'}]},
          {text: '저 쫓겨난 사람은 낯빛부터 사납지 않사옵니까. 서방님 흉내를 내는 사기꾼이 틀림없사옵니다.', cards: [{q: '서방님도 평소에 낯빛이 사나웠나요?', a: '…그건 그렇사옵니다만.', mood: 'sweat'}]}
        ],
        solve: {evidence: 'compare', statements: [2], near: [
          {evidence: 'portrait', statements: [2], text: '초상화의 점은 오른쪽 뺨이 맞아요. 부인의 말과 같지요. 그럼 안방 옹고집의 점은 어느 쪽이었나요? 방금 견주어 본 기록을 떠올려 보세요.'},
          {evidence: 'granary', text: '안방 옹고집이 쌀을 나눈 것은 사실이에요. 하지만 마음씨가 좋다고 해서 진짜라는 증거가 될까요? 얼굴에 대한 말을 확인해 보세요.'}
        ]},
        hints: ['부인의 말 가운데 눈으로 확인할 수 있는 것이 있어요.', '얼굴의 어느 곳에 대해 말했나요? 방금 법정에서 견주어 보았지요.', '점의 자리를 말한 증언에, 법정에서 견주어 본 기록을 내밀어 보세요.'],
        wrong: '마음이 가는 쪽이 아니라 확인할 수 있는 말을 찾아보세요.',
        success: [
          L('baleum', '견주기 기록을 보십시오. 안방 옹고집의 점은 마주 보면 왼쪽 뺨에 있습니다. 부인께서 아시는 그 자리가 아닙니다!', 'stern', {shout: true}),
          L('buin', '어머… 서방님이 늘 무뚝뚝하셔서, 얼굴을 찬찬히 뵌 지가 오래되었사옵니다.', 'shock'),
          L('buin', '하오나 안방에 계신 분은 다정하셨사옵니다. 차라리 그분이 진짜였으면 하고…', 'sad'),
          L('ong', '뭐, 뭣이라!', 'shock'),
          L('wonnim', '마음이 가는 쪽이 아니라, 증거가 가리키는 쪽이 진짜요. 안방 옹고집의 말을 들어 보겠소.', 'stern')
        ]
      },
      ong2a: {
        who: 'ong2', title: '두 번째 심문 · 안방 옹고집',
        statements: [
          {text: '허허, 내가 바로 옹고집이오. 이 집 기둥 하나, 서까래 하나 모르는 것이 없소.', cards: [{q: '이 집에서 몇 해를 사셨나요?', a: '태어나서 줄곧 살았소. 쉰 해가 넘었지.'}]},
          {text: '날마다 사랑방 아랫목에 앉아 장부를 보지. 앉으면 오른쪽이 문이고, 왼쪽이 창이오.', cards: [{q: '틀림없나요?', a: '날마다 앉는 자리를 내가 모르겠소? 오른쪽이 문이오.'}]},
          {text: '벽에는 내가 아끼는 호랑이 족자가 걸려 있소. 호랑이는 창 쪽을 노려보고 있지.', cards: [{q: '족자는 어디에 걸려 있나요?', a: '앉은 자리에서 바로 앞쪽 벽이오.'}]},
          {text: '장부는 늘 왼손으로 붓을 잡고 적소. 어릴 적부터 그랬소.', cards: [{q: '벼루는 책상 어느 쪽에 두시나요?', a: '그야 왼쪽이지. 왼손으로 쓰니까.'}]},
          {text: '이만하면 내가 주인인 것이 분명하지 않소? 저 사람을 어서 내쫓으시오.', cards: [{q: '쫓겨난 옹고집은 누구라고 생각하시나요?', a: '내 재산을 노리는 사기꾼이겠지. 허허.'}]}
        ],
        solve: {evidence: 'room', statements: [1, 2, 3], near: [
          {evidence: 'compare', text: '얼굴이 초상화와 반대라는 것은 이미 밝혔어요. 이번에는 안방 옹고집이 집에 대해 한 말을 확인해 보세요.'},
          {evidence: 'portrait', text: '초상화는 얼굴을 견줄 때 썼어요. 이번에는 안방 옹고집이 집에 대해 한 말을 확인해 보세요.'}
        ]},
        hints: ['안방 옹고집은 사랑방에 대해 자세히 말했어요.', '사랑방을 직접 살펴보고 그려 둔 증거가 있어요.', '사랑방에 대해 말한 증언 가운데 하나에, 사랑방을 살핀 그림을 내밀어 보세요.'],
        wrong: '안방 옹고집이 집에 대해 한 말 가운데, 직접 가서 확인할 수 있는 것을 찾아보세요.',
        success: [
          L('baleum', '사랑방을 살핀 그림을 보십시오. 아랫목에 앉으면 문은 왼쪽, 창은 오른쪽입니다. 호랑이는 문 쪽을 보고, 붓과 벼루는 오른손 자리에 놓여 있습니다!', 'stern', {shout: true}),
          L('ong2', '그, 그건… 내가 잠시 헷갈렸소. 허허.', 'sweat'),
          L('meoksil', '이상해요. 틀리긴 틀렸는데, 아무렇게나 틀린 게 아니에요.'),
          L('wonnim', '나도 두 사람을 따로 불러 같은 것을 물었소. 받아 적은 답이 여기 있소.')
        ]
      },
      dosa: {
        who: 'dosa', title: '세 번째 심문 · 삿갓 쓴 도사',
        statements: [
          {text: '나는 구름처럼 떠도는 도사요. 사흘 전 저 댁 대문 앞에서 물벼락을 맞고 쫓겨났지.', cards: [{q: '무슨 일로 찾아가셨나요?', a: '굶는 이웃들에게 나눌 쌀을 시주해 달라 했소. 돌아온 것은 물 한 바가지였지.'}]},
          {text: '쫓겨난 뒤로는 곧장 산으로 돌아갔소. 그 댁 담 안은 들여다본 적도 없소.', cards: [{q: '뒤뜰 쪽으로 가지는 않으셨나요?', a: '허허, 내가 거길 왜 가겠소.', mood: 'sweat'}]},
          {text: '부자라더니 살림은 볼만하더이다. 사랑방 벽에 사람 키만 한 거울이 걸려 있더군.', cards: [{q: '거울에 무엇이 비치던가요?', a: '갓끈을 고쳐 매는 주인의… 어흠, 그냥 그렇다는 말이오.', mood: 'sweat'}]},
          {text: '아무튼 똑같이 생긴 사람이 나타난 것은 나와 상관없는 일이오. 허허.', cards: [{q: '도사님은 도술을 부리시나요?', a: '볏짚으로 허수아비쯤은 만들 줄 알지. 허허.'}]}
        ],
        solve: {pair: [1, 2], evidence: 'window', statements: [1], near: [
          {evidence: 'answers', text: '안방 옹고집이 거울 속 세상을 알고 있다는 것은 밝혔어요. 이번에는 도사가 그 거울을 보았는지를 따져 보세요.'},
          {evidence: 'room', text: '사랑방에 큰 거울이 있는 것은 맞아요. 그런데 도사는 그 거울을 어떻게 알았을까요? 도사의 말끼리 견주어 보세요.'}
        ]},
        hints: ['도사는 그 집에 대해 무엇을 알고 있나요?', '담 안을 본 적이 없다는 사람이 알 수 없는 것을 말했어요.', '담 안을 들여다본 적 없다는 증언과, 사랑방의 물건을 말한 증언을 맞대어 보세요.'],
        wrong: '도사가 한 말끼리 견주어 보세요. 보지 않았다면 알 수 없는 것을 말했어요.',
        success: [
          L('baleum', '담 안을 들여다본 적도 없다고 하셨습니다. 그런데 사랑방 벽의 거울은 어떻게 아십니까! 뒤뜰 창 밑에는 지팡이 자국과 볏짚 부스러기도 남아 있습니다.', 'stern', {shout: true}),
          L('dosa', '허허허. 눈이 밝구려. 그렇소, 창밖에서 거울에 비친 옹고집을 보았소.', 'happy'),
          L('dosa', '굶는 이웃에게 쌀 한 줌 주지 않는 이를 깨우치려고, 본 대로 무언가를 빚었지. 무엇으로 빚었는지는 그대들이 밝혀 보시게.'),
          L('ong2', '무, 무슨 소리! 나는 뼈와 살이 있는 사람이오!', 'shock')
        ]
      },
      ong2b: {
        who: 'ong2', title: '마지막 심문 · 뼈와 살',
        statements: [
          {text: '도사의 말은 터무니없소. 나는 빚어 만든 것이 아니라, 어머니가 낳아 주신 사람이오.', cards: [{q: '어머니께서 물려주신 것이 있나요?', a: '그, 그야… 많지. 하나하나 다 말할 수는 없소.', mood: 'sweat'}]},
          {text: '저 사람과 내가 다른 것은 점의 자리뿐이오. 그깟 점이야 화공이 잘못 그렸겠지.', cards: [{q: '흉터와 갓끈 매듭도 반대였는데요?', a: '화, 화공이 솜씨가 없었나 보오!', mood: 'sweat'}]},
          {text: '키도 같고 몸집도 같으니, 몸무게도 저 사람과 똑같을 것이오. 어디 달아 보시든가!', cards: [{q: '오늘 아침은 무엇을 드셨나요?', a: '아침? 나는… 배가 고프지 않아서 걸렀소.'}]},
          {text: '오늘 아침에도 내 두 발로 마당을 뚜벅뚜벅 걸어 관아로 왔소.', cards: [{q: '마당이 질지 않았나요?', a: '질긴 무슨. 신에 흙 한 점 안 묻었소.'}]}
        ],
        solve: {evidence: 'foot', statements: [2, 3], near: [
          {evidence: 'compare', text: '점만 다른 것이 아니었지요. 그런데 지금은 「빚어 만든 것」인지를 가려야 해요. 몸에 대한 말을 확인할 증거를 찾아보세요.'},
          {evidence: 'window', text: '볏짚 부스러기는 좋은 단서예요. 안방 옹고집이 볏짚처럼 가볍다는 것을 보여 줄 증거가 있을까요?'}
        ]},
        hints: ['안방 옹고집은 자기 몸에 대해 말했어요.', '몸이 무거운지 가벼운지 알 수 있는 흔적이 있어요.', '몸무게나 걸음에 대해 말한 증언에, 마당에서 찾은 증거를 내밀어 보세요.'],
        wrong: '안방 옹고집의 몸에 대한 말 가운데, 남은 흔적으로 확인할 수 있는 것을 찾아보세요.',
        success: [
          L('baleum', '오늘 아침 진흙 마당의 발자국입니다. 쫓겨난 옹고집의 발자국은 깊은데, 안방 옹고집의 발자국은 거의 찍히지 않았습니다. 몸집은 같은데 훨씬 가볍다는 뜻입니다!', 'stern', {shout: true}),
          L('wonnim', '여봐라, 저울을 가져오너라!', 'stern'),
          L('narr', '저울에 오른 안방 옹고집은 볏짚 한 단만큼밖에 나가지 않았습니다.'),
          L('ong2', '허, 허허… 들켰구먼.', 'sweat'),
          L('wonnim', '변호인. 그렇다면 옹고집이 둘이 된 까닭을, 증거에 맞게 말해 보시오.', 'stern')
        ]
      }
    },
    custom: {mirror: MIRROR, answers: ANSWERS},
    stages: [
      {type: 'talk', chapter: '여섯 번째 의뢰', lines: [
        L('narr', '옹진 고을의 부자 옹고집은 인색하기로 소문난 사람이었습니다. 그런데 어느 날, 그 집에 똑같이 생긴 옹고집이 하나 더 나타났습니다.', 'normal', {fx: 'drum'}),
        L('ong', '내가 진짜 옹고집이오! 저놈이 내 집과 내 식구를 다 차지하고 나를 내쫓았소!', 'stern'),
        L('ong2', '허허, 딱한 사람이로군. 내가 옹고집이오. 식구들도 다 나를 알아보지 않소?', 'happy'),
        L('buin', '안방에 계신 분이 진짜 서방님이옵니다. 저 사람은 내쫓아 주시옵소서.', 'stern'),
        L('meoksil', '저는 떠돌이 화공의 딸 먹실이에요. 삼 년 전에 아버지가 옹고집 어른의 초상화를 그리셨어요. 그 그림이 도움이 될 거예요.', 'normal', {words: ['초상화']}),
        L('baleum', '저는 나바름입니다. 쫓겨난 옹고집의 말을 대신 전하겠습니다. 누가 더 마음에 드는지가 아니라, 누가 진짜인지를 증거로 가리겠습니다.'),
        L('wonnim', '얼굴도 목소리도 똑같으니 참으로 난처하오. 증거를 모아 오시오.', 'sweat', {words: ['증거']}),
        L('meoksil', '집 안팎 다섯 곳을 둘러봐요. 그림은 제가 꼼꼼히 봐 드릴게요.', 'happy')
      ]},
      {type: 'investigate', chapter: '다섯 곳의 단서', title: '누가 진짜 옹고집일까요?'},
      {type: 'talk', chapter: '나란히 선 두 사람', lines: [
        L('narr', '두 옹고집이 법정에 나란히 섰습니다. 갓도, 수염도, 목소리도 똑같았습니다.'),
        L('wonnim', '허, 볼수록 모르겠구려.', 'sweat'),
        L('meoksil', '초상화는 마주 앉아서 본 모습 그대로 그려요. 두 분을 초상화와 하나씩 견주어 봐요.')
      ]},
      {type: 'mirror', chapter: '초상화와 두 사람', gain: 'compare', after: [
        L('baleum', '쫓겨난 옹고집은 세 군데가 모두 초상화와 같습니다. 안방 옹고집은 거울에 비춘 초상화와 같습니다.'),
        L('ong2', '그, 그깟 점 하나가 무슨 대수요! 내 식구가 나를 알아보는데!', 'sweat'),
        L('meoksil', '이제 증언을 들어 봐요. 증언을 넘겨 보고, 이상한 말에 맞는 증거를 내밀어 보세요.', 'normal', {words: ['증언']}),
        L('meoksil', '앞에서 한 말과 뒤에서 한 말이 서로 맞지 않으면 그것이 모순이에요. 그럴 땐 두 증언을 맞대 보세요.', 'normal', {words: ['모순']})
      ]},
      {type: 'cross', id: 'buin', chapter: '서른 해를 본 얼굴'},
      {type: 'cross', id: 'ong2a', chapter: '뒤바뀐 사랑방'},
      {type: 'answers', chapter: '두 사람의 답', gain: 'answers', after: [
        L('baleum', '안방 옹고집의 답은 오른쪽과 왼쪽만 뒤바뀌어 있습니다. 거울에 비친 모습처럼 말입니다.'),
        L('meoksil', '누군가 거울에 비친 옹고집 어른만 본 게 아닐까요?'),
        L('ong', '거울이라… 사흘 전, 시주를 청하던 도사를 내쫓은 일이 있소. 그자가 뒤뜰 쪽으로 돌아 나갔지.', 'sweat', {words: ['시주']}),
        L('narr', '그때 방청석 뒤에서, 삿갓 쓴 도사가 지팡이를 짚고 걸어 나왔습니다.'),
        L('dosa', '허허. 나를 찾으시는가? 나는 지나가던 길손일 뿐이오.')
      ]},
      {type: 'cross', id: 'dosa', chapter: '창밖의 길손'},
      {type: 'cross', id: 'ong2b', chapter: '뼈와 살'},
      {type: 'pick', chapter: '진짜 까닭', ...CAUSE, after: [
        L('baleum', '안방 옹고집은 도사가 거울에 비친 모습을 보고 볏짚으로 빚은 가짜입니다. 진짜는 쫓겨난 옹고집입니다.', 'stern'),
        L('narr', '도사가 지팡이를 한 번 구르자, 안방 옹고집은 스르르 볏짚 한 단으로 돌아갔습니다.'),
        L('buin', '아이고머니!', 'shock'),
        L('dosa', '옹고집. 식구들이 볏짚을 더 반긴 까닭을 생각해 보시게.'),
        L('ong', '…내가 모질게 굴어서, 볏짚만도 못한 주인이 되었구려.', 'sad'),
        L('ong', '도사 어른, 그날은 미안했소. 부인, 곳간의 쌀은 그대로 나누시오.', 'sad'),
        L('wonnim', '이제 판결을 내리겠소.', 'stern')
      ]},
      {type: 'verdict', chapter: '증거가 이끄는 판결', ...VERDICT},
      {type: 'diary', chapter: '나의 판관 일기'},
      {type: 'end', chapter: '열린 곳간 문'}
    ],
    landing: {
      intro: '똑같이 생긴 옹고집이 둘.<br>식구들마저 가짜의 편을 들 때,<br><strong>거울 속의 실마리로 진짜를 가려 주세요.</strong>',
      start: '옹고집의 사건 맡기',
      backdrop: 'ongyard',
      people: [['ong', 'stern'], ['ong2', 'happy'], ['baleum', 'normal']],
      bubble: '누가 진짜인지, 증거로 가립시다!',
      label: ['옹고집전에서 시작된 새로운 사건', '옹고집이 둘이 된 까닭'],
      steps: ['단서 수집', '거울에 비추기', '증거로 판결'],
      credit: '초등 4학년부터 · 읽는 속도에 따라 약 35–45분 · 진행 자동 저장'
    },
    diary: {
      title: '이 재판에서 무엇을 생각했나요?',
      intro: '가장 마음에 드는 생각을 골라 주세요. 여기에는 정답이 없어요.',
      choices: [
        '미운 사람이라도 사실은 사실대로 가려야 해요.',
        '좋은 뜻이라도 남을 속여서 벌을 주면 안 돼요.',
        '옹고집은 진짜로 밝혀졌지만, 식구들에게 먼저 사과해야 해요.'
      ],
      placeholder: '예: 싫어하는 친구의 말도 끝까지 들어 볼 거예요.'
    },
    end: {
      backdrop: 'ongyard',
      people: [['ong', 'happy'], ['meoksil', 'happy']],
      quote: '“거울 속의 나는 오른쪽과 왼쪽이 반대예요.”',
      kicker: '여섯 번째 사건 해결',
      title: '진짜는<br><em>증거가 알아요.</em>',
      text: '옹고집은 제 손으로 곳간 문을 열고, 이웃들에게 쌀을 나누었습니다.<br>먹실은 웃는 옹고집의 초상화를 새로 그렸습니다.',
      badges: ['거울 감정사', '초상화 수사관', '모순 사냥꾼']
    },
    guide: `<h3>제6화 · 교사·보호자 안내</h3><p><b>옹고집전 × 거울과 빛의 반사 × 미운 사람도 공정하게</b><br>초등 4학년부터, 약 35–45분을 예상한 이야기입니다. 옹고집전에는 진짜 옹고집과 가짜 옹고집이 관아에서 다투는 송사가 실제로 나옵니다. 이 게임은 그 장면을 바탕으로, 가짜가 “거울에 비친 모습을 본떠” 만들어졌다는 설정을 새로 더했습니다. 먹실은 이 게임을 위해 만든 인물입니다. 화면에서 안방 옹고집은 쫓겨난 옹고집의 그림을 좌우로 뒤집어 보여 줍니다.</p><p><b>함께 생각할 질문</b></p><ol><li>거울에 비친 모습은 실제와 무엇이 다를까요? 오른손을 들고 거울을 보면 어떻게 보일까요?</li><li>식구들은 왜 가짜 옹고집을 더 반겼을까요? 그렇다고 가짜를 진짜라고 해도 될까요?</li><li>도사는 좋은 뜻으로 한 일입니다. 그래도 잘못이라고 할 수 있을까요?</li></ol><details class="teacher-spoilers"><summary>교사용 진행·정답 보기</summary><p>초상화 견주기: 세 군데 모두 쫓겨난 옹고집. 거울에 비춘 초상화와 같은 사람은 안방 옹고집.<br>옹고집의 아내: 증언 3 + 견주기 기록.<br>안방 옹고집 첫 심문: 증언 2, 3, 4 가운데 하나 + 사랑방 살핀 그림.<br>두 사람의 답: 둘째, 셋째, 넷째 줄. 까닭은 “거울에 비친 모습으로 알았다”.<br>삿갓 도사: 증언 2와 3을 맞대기. 또는 증언 2 + 창밖을 살핀 기록.<br>안방 옹고집 마지막 심문: 증언 3 또는 4 + 진흙 마당의 발자국.<br>진짜 까닭: 네 번째 보기.<br>쓰이지 않는 증거: 곳간 장부.</p></details><p><b>과학 표현의 범위</b><br>거울에 비친 물체는 좌우가 바뀌어 보인다는 것을 다룹니다. 이 화에서는 좌우를 모두 “마주 보았을 때”를 기준으로 적어, 보는 사람과 본인의 좌우가 헷갈리지 않게 했습니다. 실제 거울과 글자 카드로 직접 비추어 보는 활동과 이어서 볼 수 있습니다. 볏짚 사람이 가볍다는 것은 같은 부피라도 물질에 따라 무게가 다르다는 점과 이어집니다.</p><p><b>주제를 다루는 방식</b><br>옹고집은 호감이 가지 않는 인물로 그렸습니다. 그래도 재판은 “누가 더 좋은 사람인가”가 아니라 “누가 진짜인가”만 가립니다. 판결 뒤에 옹고집의 인색함과 도사의 속임을 각각 따로 짚습니다.</p><p class="muted">로그인 없이 사용하며 진행과 일기는 브라우저 안에만 저장됩니다. 화마다 진행 기록은 별개입니다.</p>`
  };
})();
