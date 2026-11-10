'use strict';
// 제5화 · 심청전 — 공양미와 긴 그림자
// 심청전의 인물을 빌려 새로 꾸민 사건입니다. 인당수 이야기는 다루지 않습니다.
// 자료 형식은 docs/episode-format.md, 사건 설계는 docs/episode5.md 를 보세요.
window.CASE = (() => {
  const L = (who, text, mood = 'normal', extra = {}) => ({who, text, mood, ...extra});
  const INK = '#4b3f33';

  // ---------- 마당 그림 ----------
  // 위에서 내려다본 심청네 마당. 위쪽이 북쪽입니다.
  // 해의 자리: 0 이른 아침(동) · 1 오전(남동) · 2 한낮(남) · 3 오후(남서) · 4 해 질 녘(서)
  const TIMES = ['이른 아침', '오전', '한낮', '오후', '해 질 녘'];
  const SUN = [[486, 196], [430, 318], [260, 348], [90, 318], [34, 196]];
  const SHADOW = [[-178, 0], [-70, -58], [0, -34], [70, -58], [178, 0]];
  const HEIGHT = ['낮게', '중간쯤', '높이', '중간쯤', '낮게'];
  function yardArt(pos) {
    const has = pos != null, [sx, sy] = has ? SUN[pos] : [0, 0], [dx, dy] = has ? SHADOW[pos] : [0, 0];
    const label = has ? `${TIMES[pos]}. 해는 ${['동쪽', '남동쪽', '남쪽', '남서쪽', '서쪽'][pos]} 하늘에 ${HEIGHT[pos]} 떠 있고, 그림자는 ${['서쪽 우물까지 길게', '북서쪽으로', '북쪽으로 짧게', '북동쪽으로', '동쪽 감나무까지 길게'][pos]} 생겼다.` : '곳간은 북쪽, 우물은 서쪽, 감나무는 동쪽, 대문은 남쪽에 있다.';
    return `<svg class="yard-art" viewBox="0 0 520 380" role="img" aria-label="위에서 본 심청네 마당. ${label}"><rect width="520" height="380" rx="14" fill="#eae1cc"/><rect x="50" y="46" width="420" height="290" rx="10" fill="#dcc79c" stroke="#8a6a4a" stroke-width="4"/>
      <rect x="200" y="52" width="120" height="58" fill="#a5794a" stroke="${INK}" stroke-width="2"/><text x="260" y="88" text-anchor="middle" font-size="17" font-weight="700" fill="#fff8e6">곳간</text>
      <circle cx="82" cy="196" r="20" fill="#9cc3d6" stroke="${INK}" stroke-width="3"/><text x="82" y="240" text-anchor="middle" font-size="16" font-weight="700" fill="${INK}">우물</text>
      <circle cx="438" cy="196" r="22" fill="#5f8f5a" stroke="${INK}" stroke-width="2"/><circle cx="430" cy="190" r="5" fill="#e8742a"/><circle cx="446" cy="202" r="5" fill="#e8742a"/><text x="438" y="242" text-anchor="middle" font-size="16" font-weight="700" fill="${INK}">감나무</text>
      <rect x="232" y="328" width="56" height="12" fill="#6b4a2d"/><text x="260" y="322" text-anchor="middle" font-size="15" fill="${INK}">대문</text>
      <g font-size="15" font-weight="700" fill="#8a3a2c"><text x="260" y="30" text-anchor="middle">북</text><text x="260" y="372" text-anchor="middle">남</text><text x="22" y="150" text-anchor="middle">서</text><text x="498" y="150" text-anchor="middle">동</text></g>
      ${has ? `<path d="M260 196l${dx} ${dy}" stroke="#3a332c" stroke-width="13" stroke-linecap="round" opacity=".55"/><circle cx="${sx}" cy="${sy}" r="19" fill="#f2b73a" stroke="#c9801e" stroke-width="3"/>${[0, 45, 90, 135, 180, 225, 270, 315].map(a => `<path d="M${sx} ${sy - 25}v-8" stroke="#c9801e" stroke-width="3" stroke-linecap="round" transform="rotate(${a} ${sx} ${sy})"/>`).join('')}` : ''}
      <circle cx="260" cy="196" r="9" fill="#b8372c" stroke="${INK}" stroke-width="2"/>${has ? '' : `<text x="260" y="226" text-anchor="middle" font-size="14" fill="${INK}">마당 한가운데</text>`}</svg>`;
  }

  // ---------- 증거 그림 ----------
  const VIEW = {
    map: () => `<div class="observation-heading"><span>심청네 마당 · 심청이 그린 그림</span><b>마당 그림</b></div>${yardArt(null)}<p class="gl">위쪽이 북쪽이에요. <b>곳간은 북쪽, 우물은 서쪽, 감나무는 동쪽, 대문은 남쪽</b>에 있어요.</p>`,
    track: () => `<article class="evidence-document note-doc"><span class="doc-overline">곳간 뒤 · 흙바닥을 살핀 기록</span><h3>수레바퀴 자국</h3><p class="doc-copy">수레바퀴 자국 <b>두 줄</b>이<br>곳간 뒤에서 쪽문까지 이어짐.<br>자국 옆에 <b>연꽃 도장이 찍힌 볏짚 조각</b>.<br>연꽃 도장은 공양미 섬에만 찍는 표시.</p><p class="doc-signer">살핀 이 · 나바름</p></article>`,
    hear: () => `<article class="evidence-document note-doc"><span class="doc-overline">심 봉사의 방 · 들은 것을 받아 적음</span><h3>심 봉사가 들은 소리</h3><p class="doc-copy">“어제, <b>서쪽 창</b>으로 든 볕이 뺨에 따뜻할 무렵이었네.<br>곳간 뒤에서 수레 굴러가는 소리가 나고,<br><b>철컥철컥</b> 쇠 부딪는 소리가 들렸지.”</p><p class="doc-signer">말한 이 · 심 봉사</p></article>`,
    temple: () => `<article class="evidence-document ledger-doc"><span class="doc-overline">몽은사 · 스님의 장부</span><h3>공양미와 시주 기록</h3><div class="ledger-grid"><span>어제 한낮</span><strong>심 봉사 댁 곳간의 공양미를 귀덕 어멈과 함께 셈. 열 섬</strong><span>어제 해 질 녘</span><strong>귀덕 어멈이 등불 기름을 시주하고, 저녁 종을 칠 때까지 법당에 머묾</strong><span>오늘 아침</span><strong>공양미를 가지러 가니 일곱 섬뿐</strong></div><p class="doc-signer">적은 이 · 몽은사 스님</p></article>`,
    tteok: () => `<article class="evidence-document ledger-doc"><span class="doc-overline">장터 떡집 · 외상 장부</span><h3>뺑덕 어멈 앞</h3><div class="ledger-grid"><span>어제 한낮</span><strong>인절미 한 접시. 외상. 밀린 외상 모두 닷 냥</strong><span>어제 해 진 뒤</span><strong>밀린 외상 닷 냥을 모두 갚음. 꿀떡 한 접시를 더 사 감</strong></div><p class="doc-signer">적은 이 · 떡집 주인</p></article>`,
    shadow: () => `<div class="observation-heading"><span>심청네 마당 · 법정에서 확인함</span><b>그림자 기록</b></div><div class="tw"><table class="seat"><thead><tr><th scope="col">때</th><th scope="col">해가 있는 쪽</th><th scope="col">그림자가 생기는 쪽</th><th scope="col">그림자 길이</th></tr></thead><tbody><tr><th scope="row">이른 아침</th><td>동쪽, 낮게</td><td>서쪽 (우물 쪽)</td><td class="sick">길다</td></tr><tr><th scope="row">한낮</th><td>남쪽, 높이</td><td>북쪽 (곳간 쪽)</td><td>가장 짧다</td></tr><tr><th scope="row">해 질 녘</th><td>서쪽, 낮게</td><td>동쪽 (감나무 쪽)</td><td class="sick">길다</td></tr></tbody></table></div><p class="gl">그림자는 언제나 <b>해의 반대쪽</b>에 생겨요. 해가 낮을수록 그림자가 길어요.</p>`
  };

  // ---------- 퍼즐 1: 심청의 그림자 실험 ----------
  const ASK = [
    {q: '그림자가 <b>가장 짧은</b> 때를 찾아 주세요.', a: 2, ok: '한낮에는 해가 높이 떠서 그림자가 가장 짧아요.'},
    {q: '그림자가 <b>우물까지 길게</b> 닿는 때를 찾아 주세요.', a: 0, ok: '이른 아침에는 해가 동쪽에 낮게 떠서, 그림자가 서쪽 우물까지 길게 뻗어요.'},
    {q: '그림자가 <b>감나무까지 길게</b> 닿는 때를 찾아 주세요.', a: 4, ok: '해 질 녘에는 해가 서쪽에 낮게 떠서, 그림자가 동쪽 감나무까지 길게 뻗어요.'}
  ];
  const SUNLAB = {
    auto: () => [['sun-set', '2'], ['sun-ok', ''], ['sun-set', '0'], ['sun-ok', ''], ['sun-set', '4'], ['sun-ok', ''], ['sun-next', '']],
    draw(s, api) {
      const p = api.P(), a = api.action, q = p.q || 0, pos = p.pos == null ? 1 : p.pos, done = q >= ASK.length;
      api.$('#view').innerHTML = `<section class="board puzzle-board"><div class="section-kicker">심청의 그림자 실험${done ? '' : ` · ${q + 1} / ${ASK.length}`}</div><h2>해를 움직여 그림자를 살펴라</h2><p class="muted">마당 한가운데에 사람이 서 있어요. 때를 골라 해를 움직이면 그림자가 달라져요. 위쪽이 북쪽이에요.</p>
        <div class="yard-wrap">${yardArt(pos)}</div>
        <div class="row time-row">${TIMES.map((t, i) => a('sun-set', t, i, 'seal sm' + (pos === i ? ' fill' : ''), done)).join('')}</div>
        <p class="sun-status">지금은 <b>${TIMES[pos]}</b>. 해가 ${HEIGHT[pos]} 떠 있어요.</p>
        ${done ? `<div class="lab-explanation" role="status"><span class="result-seal">그림자 실험 성공</span><h3>그림자는 해의 반대쪽에 생겨요</h3><p>아침에는 서쪽으로 길게, 한낮에는 북쪽으로 짧게, 해 질 녘에는 동쪽으로 길게 생겨요.</p><p class="muted">해가 낮게 떠 있을수록 그림자가 길어져요.</p>${a('sun-next', '그림자 기록을 증거함에 넣기 →')}</div>`
          : `<p class="pick-question">${ASK[q].q}</p>${p.msg ? `<p class="feedback" role="status">${api.esc(p.msg)}</p>` : ''}<div class="row end">${a('sun-ok', '이때예요 →')}</div>`}</section>`;
    },
    act(a, v, s, api) {
      const p = api.P(), q = p.q || 0;
      if (a === 'sun-set' && q < ASK.length) { p.pos = +v; if (!p.good) p.msg = ''; p.good = false; }
      if (a === 'sun-ok' && q < ASK.length) {
        const pos = p.pos == null ? 1 : p.pos;
        if (pos === ASK[q].a) { p.q = q + 1; p.msg = ASK[q].ok; p.good = true; }
        else { p.msg = '아직 아니에요. 다른 때를 눌러 그림자의 길이와 방향을 살펴보세요.'; p.good = false; }
      }
      if (a === 'sun-next' && q >= ASK.length) return api.done();
      api.save(); this.draw(s, api);
    }
  };

  // ---------- 퍼즐 2: 누가 언제 어디에 ----------
  const WHO = ['귀덕 어멈', '뺑덕 어멈'], WHEN = ['어제 한낮', '어제 해 질 녘'], WHERE = ['심청네 집', '몽은사', '장터'];
  const ANSWER = [[0, 1], [2, 0]];
  const CLUE = [['몽은사 스님의 장부에서 한낮의 기록을 다시 보세요.', '몽은사 스님의 장부에서 해 질 녘의 기록을 다시 보세요.'], ['장터 떡집의 장부에서 한낮의 기록을 다시 보세요.', '뺑덕 어멈은 방금, 해 질 녘에 어디에서 무엇을 보았다고 말을 바꾸었나요?']];
  const TIMELINE = {
    auto: () => [['tl-set', '0|0|0'], ['tl-set', '0|1|1'], ['tl-set', '1|0|2'], ['tl-set', '1|1|0'], ['tl-check', ''], ['tl-next', '']],
    draw(s, api) {
      const p = api.P(), a = api.action, g = p.g || (p.g = [[null, null], [null, null]]);
      const full = g.every(r => r.every(c => c != null));
      api.$('#view').innerHTML = `<section class="board puzzle-board"><div class="section-kicker">누가 언제 어디에</div><h2>두 사람이 있던 곳을 정리하라</h2><p class="muted">증거함의 기록과 방금 들은 증언을 보고, 두 사람이 그때 어디에 있었는지 골라 주세요. 위쪽의 <b>증거함</b>을 눌러 기록을 다시 볼 수 있어요.</p>
        <div class="timeline">${WHO.map((w, r) => `<div class="tl-row"><b class="tl-who">${w}</b>${WHEN.map((t, c) => `<div class="tl-cell ${p.bad && p.bad.includes(r + '|' + c) ? 'bad' : ''}"><span>${t}</span><div class="tl-opts">${WHERE.map((x, o) => a('tl-set', x, `${r}|${c}|${o}`, 'seal sm' + (g[r][c] === o ? ' fill' : ''), p.ok)).join('')}</div></div>`).join('')}</div>`).join('')}</div>
        ${p.msg ? `<p class="feedback" role="status">${api.esc(p.msg)}</p>` : ''}
        ${p.ok ? `<div class="lab-explanation" role="status"><span class="result-seal">정리 성공</span><h3>해 질 녘, 곳간 가까이에 있던 사람은?</h3><p>귀덕 어멈은 해 질 녘에 몽은사 법당에 있었어요. 그러니 그때 곳간에서 쌀섬을 지고 나올 수 없어요.</p><p class="muted">뺑덕 어멈은 스스로 그때 담 너머에 있었다고 말했어요.</p>${a('tl-next', '정리한 것을 들고 법정으로 →')}</div>` : `<div class="row end">${a('tl-check', '이렇게 정리했어요 →', '', 'seal fill', !full)}</div>`}</section>`;
    },
    act(a, v, s, api) {
      const p = api.P();
      if (a === 'tl-set' && !p.ok) { const [r, c, o] = v.split('|').map(Number); if (p.g[r] && o < WHERE.length) { p.g[r][c] = o; p.bad = null; p.msg = ''; } }
      if (a === 'tl-check' && !p.ok) {
        const bad = [];
        p.g.forEach((row, r) => row.forEach((x, c) => { if (x !== ANSWER[r][c]) bad.push(r + '|' + c); }));
        if (!bad.length) { p.ok = true; p.msg = ''; p.bad = null; }
        else { const [r, c] = bad[0].split('|').map(Number); p.bad = bad; p.msg = `${WHO[r]}의 ${WHEN[c]} 칸을 다시 살펴보세요. ${CLUE[r][c]}`; }
      }
      if (a === 'tl-next' && p.ok) return api.done();
      api.save(); this.draw(s, api);
    }
  };

  // ---------- 진짜 까닭 고르기 ----------
  const CAUSE = {
    kicker: '최종 추리',
    title: '공양미 세 섬이 사라진 진짜 까닭은?',
    intro: '지금까지 확인한 증거와 <b>모두 맞는</b> 설명을 하나 골라 주세요.',
    body: () => `<div class="lab-common"><span>한낮에는 열 섬 그대로</span><span>해 질 녘, 귀덕 어멈은 몽은사에</span><span>엿장수가 곳간 뒤로 수레를 댐</span><span>해 진 뒤, 뺑덕 어멈이 외상을 갚음</span></div>`,
    question: '원님께 어떻게 말씀드릴까요?',
    options: [
      '귀덕 어멈이 한낮에 쌀 세 섬을 지고 나갔다.',
      '귀덕 어멈이 해 질 녘에 쌀 세 섬을 빼돌렸다.',
      '엿장수가 혼자 몰래 곳간을 털었다.',
      '뺑덕 어멈이 해 질 녘에 쌀 세 섬을 엿장수에게 넘기고, 귀덕 어멈에게 뒤집어씌웠다.'
    ],
    check: i => i === 3 || [
      '한낮에는 스님과 함께 세어 보았고, 열 섬이 그대로였어요.',
      '해 질 녘에 귀덕 어멈은 몽은사 법당에 있었어요.',
      '엿장수는 누가 불러서 갔다고 했어요. 그리고 쌀을 판 돈으로 외상을 갚은 사람은 따로 있지요.'
    ][i]
  };

  const VERDICT = {
    kicker: '사건 번호 005 · 최종 판결',
    stamp: '무죄',
    title: '귀덕 어멈의 누명을 벗겼어요.',
    sub: '그림자의 길이와 방향이, 보지 않은 것을 보았다는 말을 가려냈어요.',
    cards: [
      {title: '관아의 판결 · 원님', who: 'wonnim', text: '귀덕 어멈에게는 잘못이 없소. 뺑덕 어멈은 공양미 세 섬을 되돌려 놓고, 귀덕 어멈과 마을 사람들에게 사과하시오. 남에게 죄를 뒤집어씌운 것은 쌀을 빼돌린 것만큼 큰 잘못이오. 가위 아재는 받은 쌀을 돌려주고, 앞으로 어디서 난 것인지 모를 물건은 받지 마시오.'},
      {modern: true, title: '오늘의 시선 · 한저울 판사', who: 'judge', text: '죄 없는 사람이 벌을 받도록 거짓으로 말하는 것은 오늘날에도 큰 잘못이에요. 보았다는 말은 “언제, 어디에서, 어떻게” 보았는지가 서로 맞아야 믿을 수 있어요. 눈으로 보지 못해도 소리와 볕으로 때를 기억한 심 봉사의 말은, 다른 증거와 꼭 맞았지요.'}
    ],
    strip: [['과학', '한낮의 그림자는 짧다'], ['과학', '그림자는 해의 반대쪽'], ['추리', '언제, 어디에 있었나']],
    note: '그림자의 길이와 방향은 계절과 장소에 따라 조금씩 달라요. 우리나라에서 한낮의 해는 남쪽 하늘에 있어서, 그림자가 북쪽으로 짧게 생겨요.',
    foot: '고전 인물을 활용해 만든 이야기 속 재판입니다.'
  };

  return {
    n: 5, classic: '심청전', title: '공양미와 긴 그림자',
    helper: 'simcheong',
    court: 'court',
    rules: {pair: true},
    portraits: ['baleum', 'wonnim', 'simcheong', 'gwideok', 'ppaeng', 'simbongsa', 'gawi', 'judge'],
    art: {wonnim: 'wonnim-v3'},
    chars: {
      baleum: '나바름',
      wonnim: '고을 원님',
      simcheong: '심청',
      gwideok: '귀덕 어멈',
      ppaeng: '뺑덕 어멈',
      simbongsa: '심 봉사',
      gawi: '가위 아재',
      judge: '한저울 판사',
      narr: ''
    },
    glossary: {
      '공양미': '절에 바치는 쌀이에요. 심청전에서는 심 봉사의 눈을 뜨게 해 달라고 빌며 바치는 쌀이에요.',
      '섬': '곡식을 담는 짚 자루예요. 쌀을 세는 단위로도 써요.',
      '증거': '어떤 일이 있었는지 확인하는 데 도움이 되는 물건이나 기록이에요.',
      '그림자': '빛이 물체에 가려서 생기는 어두운 부분이에요. 빛이 오는 쪽의 반대쪽에 생겨요.',
      '증언': '자기가 보고 들은 일을 법정에서 말하는 것이에요.',
      '모순': '앞에서 한 말과 뒤에서 한 말이 서로 맞지 않는 것이에요.',
      '외상': '물건값을 나중에 내기로 하고 먼저 물건을 받는 일이에요.'
    },
    evidence: {
      map: {name: '마당 그림', short: '심청네 마당의 방위를 그린 그림', icon: 'map', view: VIEW.map},
      track: {name: '수레바퀴 자국', short: '곳간 뒤 흙바닥을 살핀 기록', icon: 'note', view: VIEW.track},
      hear: {name: '심 봉사가 들은 소리', short: '어제 해 질 녘, 곳간 뒤에서 난 소리', icon: 'note', view: VIEW.hear},
      temple: {name: '스님의 장부', short: '몽은사 스님이 적은 공양미와 시주 기록', icon: 'ledger', view: VIEW.temple},
      tteok: {name: '떡집 외상 장부', short: '장터 떡집의 뺑덕 어멈 외상 기록', icon: 'ledger', view: VIEW.tteok},
      shadow: {name: '그림자 기록', short: '때에 따른 그림자의 길이와 방향', icon: 'table', view: VIEW.shadow}
    },
    places: [
      {id: 'yard', name: '심청네 마당', art: 'simhome', ev: 'map', who: 'simcheong', line: '우리 집 마당이에요. 방위를 알 수 있게 그림으로 그려 둘게요.'},
      {id: 'gotgan', name: '곳간 뒤', art: 'gotgan', ev: 'track', who: 'baleum', line: '곳간 뒤 흙바닥에 수레바퀴 자국이 있어. 볏짚 조각도 떨어져 있군.'},
      {id: 'room', name: '심 봉사의 방', art: 'simroom', ev: 'hear', who: 'simbongsa', line: '나는 앞은 못 보아도 귀는 밝다네. 볕이 어느 창으로 드는지로 때도 알지. 어제 들은 것을 말해 주겠네.'},
      {id: 'temple', name: '몽은사', art: 'temple', ev: 'temple', who: 'simcheong', line: '몽은사 스님이 적어 두신 장부예요. 어제 한낮과 해 질 녘의 일이 적혀 있어요.'},
      {id: 'market', name: '장터 떡집', art: 'market', ev: 'tteok', who: 'baleum', line: '떡집 주인이 외상 장부를 보여 주었어. 어제 날짜를 살펴보자.'}
    ],
    witnesses: {
      ppaeng1: {
        who: 'ppaeng', title: '첫 심문 · 다 보았다는 뺑덕 어멈',
        statements: [
          {text: '나는 심 봉사 댁 살림을 돌보는 뺑덕 어멈이오. 어제 일을 본 대로 말하리다.', cards: [{q: '귀덕 어멈과는 어떤 사이인가요?', a: '그 댁에 드나드는 이웃이지. 곳간 장부도 그이가 쥐고 있고.'}]},
          {text: '어제 한낮, 해가 머리 꼭대기에 떠 있을 때였소. 나는 남쪽 담 너머에서 그 댁 마당을 보고 있었지.', cards: [{q: '한낮이 틀림없나요?', a: '틀림없소. 해가 머리 꼭대기에 있었다니까.'}]},
          {text: '귀덕 어멈이 곳간에서 쌀섬을 지고 나오는데, 그림자가 마당을 가로질러 우물까지 길게 늘어져 있었소.', cards: [{q: '그림자가 얼마나 길었나요?', a: '귀덕 어멈 키의 세 곱은 되었소. 우물 두레박에 닿을 만큼!'}]},
          {text: '얼굴까지 똑똑히 보았소. 틀림없는 귀덕 어멈이었소!', cards: [{q: '담 너머에서 얼굴이 보였나요?', a: '보, 보이다마다! 내 눈이 얼마나 밝은데.', mood: 'sweat'}]},
          {text: '곳간 장부를 쥔 사람도 귀덕 어멈이니, 세 섬쯤 빼돌리기는 쉬운 일이지.', cards: [{q: '곳간에 자물쇠가 있나요?', a: '없소. 빗장만 걸어 두는 곳간이라 누구든 열 수 있지.'}]}
        ],
        solve: {pair: [1, 2], evidence: 'shadow', statements: [2], alt: [{evidence: 'tteok', statements: [1]}], near: [
          {evidence: 'temple', text: '한낮에 열 섬이 그대로였다는 것은 중요한 단서예요. 그런데 뺑덕 어멈의 말 속에 이미 이상한 곳이 있어요. 한낮의 그림자를 떠올려 보세요.'},
          {evidence: 'map', text: '우물이 어디에 있는지는 알 수 있어요. 그런데 한낮에 그림자가 그렇게 길 수 있을까요? 그림자의 길이를 따져 보세요.'}
        ]},
        hints: ['뺑덕 어멈이 말한 때와, 그때의 그림자를 떠올려 보세요.', '방금 마당에서 그림자 실험을 했지요. 한낮의 그림자는 어땠나요?', '때를 말한 증언과 그림자를 말한 증언을 맞대어 보세요. 그림자 기록을 내밀어도 좋아요.'],
        wrong: '뺑덕 어멈이 본 때와 본 모습이 서로 맞는지 생각해 보세요.',
        success: [
          L('baleum', '해가 머리 꼭대기에 있는 한낮에는 그림자가 가장 짧습니다. 우물까지 길게 늘어질 수 없습니다!', 'stern', {shout: true}),
          L('baleum', '게다가 장터 떡집 장부에는, 어제 한낮에 증인이 떡집에서 인절미를 먹었다고 적혀 있습니다.'),
          L('ppaeng', '아, 아이고. 내가 때를 헷갈렸나 보오. 한낮이 아니라 해 질 녘이었소! 그래, 해 질 녘!', 'sweat'),
          L('wonnim', '증인은 때를 바꾸어 말하는구려. 그렇다면 해 질 녘의 일을 따져 보겠소.', 'stern'),
          L('simcheong', '어제 한낮과 해 질 녘에 누가 어디에 있었는지, 증거를 보고 정리해 봐요.')
        ]
      },
      ppaeng2: {
        who: 'ppaeng', title: '두 번째 심문 · 해 질 녘이라는 뺑덕 어멈',
        statements: [
          {text: '절에 있었다고? 흥, 스님이 잘못 보셨겠지. 나는 해 질 녘에 분명히 보았소.', cards: [{q: '스님이 잘못 보았다고 생각하는 까닭은요?', a: '그야… 저녁이라 어두웠을 테니!'}]},
          {text: '해가 우물 너머 서산에 걸려 온 마당이 붉었소. 나는 남쪽 담 너머에 서 있었지.', cards: [{q: '해는 어느 쪽에 있었나요?', a: '우물 너머 서쪽이라니까. 눈이 부셔서 손으로 가렸소.'}]},
          {text: '곳간에서 나온 사람의 그림자가 우물 쪽으로 길게 뻗어 있었소. 두레박에 그림자 머리가 닿을 만큼!', cards: [{q: '그림자가 우물 쪽이 틀림없나요?', a: '틀림없소. 우물 쪽으로 쭉 뻗었소.'}]},
          {text: '그 그림자의 임자가 귀덕 어멈이었소. 치마 모양이 딱 그랬다니까.', cards: [{q: '얼굴을 보았나요, 그림자를 보았나요?', a: '그, 그림자를… 아니, 둘 다 보았소!', mood: 'sweat'}]}
        ],
        solve: {pair: [1, 2], evidence: ['map', 'shadow'], statements: [2], near: [
          {evidence: 'temple', text: '귀덕 어멈이 절에 있었다는 것은 이미 밝혔어요. 뺑덕 어멈은 그래도 보았다고 해요. 이번에는 해와 그림자의 방향을 따져 보세요.'}
        ]},
        hints: ['이번에는 그림자의 길이가 아니라 방향을 살펴보세요.', '해 질 녘의 해는 어느 쪽에 있고, 그림자는 어느 쪽에 생길까요?', '해가 있던 쪽을 말한 증언과 그림자가 뻗은 쪽을 말한 증언을 맞대어 보세요. 마당 그림을 내밀어도 좋아요.'],
        wrong: '해가 있는 쪽과 그림자가 생기는 쪽을 떠올려 보세요.',
        success: [
          L('baleum', '해가 우물 너머 서쪽에 있었다면, 그림자는 반대쪽인 동쪽 감나무 쪽으로 생깁니다. 해가 있는 쪽으로 뻗는 그림자는 없습니다!', 'stern', {shout: true}),
          L('ppaeng', '그, 그림자야 아무려면 어떻소! 쌀이 없어진 게 중요하지!', 'sweat'),
          L('wonnim', '한낮이라 했다가 저녁이라 하고, 그림자의 방향도 맞지 않소. 증인은 정말 본 것이오?', 'stern'),
          L('simcheong', '나리, 곳간 뒤에 수레바퀴 자국이 있었어요. 우리 마을에서 수레를 끄는 장사꾼은 엿장수 아재뿐이에요.'),
          L('narr', '엿판을 실은 수레를 끌고, 가위 아재가 엿가위를 철컥거리며 들어왔습니다.'),
          L('gawi', '아이고, 엿이나 팔던 사람을 법정에는 왜 부르셨소?')
        ]
      },
      gawi: {
        who: 'gawi', title: '세 번째 심문 · 엿장수 가위 아재',
        statements: [
          {text: '나는 엿장수 가위 아재요. 엿가위 소리 한번 들어 보시려오? 철컥철컥!', cards: [{q: '엿가위 소리는 멀리서도 들리나요?', a: '들리다마다. 온 마을 아이들이 이 소리에 달려 나오지!'}]},
          {text: '어제는 한낮에 장터에서 엿을 팔고, 일찌감치 서쪽 고개를 넘어 집으로 갔소.', cards: [{q: '엿은 다 팔렸나요?', a: '그, 그럼! 한 판 남김없이 다 팔았소.', mood: 'sweat'}]},
          {text: '해 질 녘에는 벌써 고갯길을 오르고 있었지. 지는 해를 바라보며 서쪽으로 걸었소.', cards: [{q: '고개는 마을의 어느 쪽인가요?', a: '서쪽이오. 해가 넘어가는 쪽이지.'}]},
          {text: '내 그림자가 앞으로 길게 드리워서, 그림자를 밟으며 걸었던 게 기억나오.', cards: [{q: '그림자가 정말 앞에 있었나요?', a: '그렇소. 길쭉한 내 그림자를 밟으며 걸었지.'}]},
          {text: '그러니 심 봉사 댁 근처에는 얼씬도 안 했소. 쌀섬 같은 건 본 적도 없소.', cards: [{q: '수레는 어디에 두었나요?', a: '수, 수레는 늘 끌고 다니오.', mood: 'sweat'}]}
        ],
        solve: {pair: [2, 3], evidence: 'shadow', statements: [3], alt: [{evidence: 'hear', statements: [4]}], near: [
          {evidence: 'track', text: '수레바퀴 자국은 누군가 수레를 끌고 왔다는 뜻이에요. 하지만 아재는 그때 고갯길에 있었다고 해요. 그 말이 맞는지부터 따져 봐요.'}
        ]},
        hints: ['아재가 걸어간 방향과 해가 있던 쪽을 떠올려 보세요.', '해를 바라보며 걸으면 그림자는 어디에 생길까요?', '해를 바라보며 걸었다는 증언과, 그림자가 있던 곳을 말한 증언을 맞대어 보세요.'],
        wrong: '아재의 말끼리 견주어 보세요. 해와 그림자가 있던 곳이 서로 맞나요?',
        success: [
          L('baleum', '지는 해를 바라보며 걸으면 그림자는 등 뒤에 생깁니다. 그림자가 앞에 있었다면, 해를 등지고 동쪽 마을로 걸은 것입니다!', 'stern', {shout: true}),
          L('baleum', '심 봉사께서는 그 무렵 곳간 뒤에서 수레 소리와, 철컥철컥 쇠 부딪는 소리를 들으셨습니다.'),
          L('gawi', '끄응… 귀가 그리 밝으실 줄이야. 사실은 뺑덕 어멈이 불러서 곳간 뒤로 수레를 댔소.', 'sweat'),
          L('gawi', '쌀 세 섬을 엿 한 판과 돈 닷 냥에 바꿔 주었지. 섬에 찍힌 연꽃 도장을 보고도 모른 척했소. 내 잘못이오.', 'sad'),
          L('ppaeng', '거, 거짓말이오! 엿장수가 나를 모함하는 것이오!', 'shock')
        ]
      },
      ppaeng3: {
        who: 'ppaeng', title: '마지막 심문 · 빈털터리라는 뺑덕 어멈',
        statements: [
          {text: '엿장수가 제 죄를 덮으려고 나를 끌어들이는 것이오!', cards: [{q: '엿장수와는 아는 사이인가요?', a: '엿 몇 가락 사 먹은 게 전부요!'}]},
          {text: '나는 쌀섬에 손끝 하나 대지 않았소.', cards: [{q: '어제 해 질 녘에는 어디 계셨나요?', a: '그, 그야 담 너머에서… 귀덕 어멈을 보고 있었다니까.', mood: 'sweat'}]},
          {text: '쌀을 팔았다면 내게 돈이 생겼을 것 아니오? 나는 어제도 오늘도 엽전 한 닢 없는 빈털터리요.', cards: [{q: '정말 돈이 한 닢도 없나요?', a: '없소! 주머니를 뒤집어 보여 주리까?'}]},
          {text: '장터 떡집에 외상이 잔뜩 밀려 있는 것만 봐도 알 것이오. 갚을 돈이 어디 있겠소!', cards: [{q: '외상은 얼마나 밀렸나요?', a: '닷 냥이나 되오. 떡집 주인이 날 보면 눈을 흘기지.'}]}
        ],
        solve: {evidence: 'tteok', statements: [2, 3], near: [
          {evidence: 'hear', text: '심 봉사가 들은 소리는 엿장수가 곳간 뒤에 왔다는 것을 알려 줘요. 이번에는 뺑덕 어멈의 돈 이야기를 확인할 증거를 찾아보세요.'},
          {evidence: 'track', text: '수레바퀴 자국은 쌀이 수레에 실려 나갔다는 것을 알려 줘요. 이번에는 뺑덕 어멈의 돈 이야기를 확인할 증거를 찾아보세요.'}
        ]},
        hints: ['뺑덕 어멈은 돈이 한 닢도 없다고 말해요.', '뺑덕 어멈의 돈 사정을 알 수 있는 기록이 있어요.', '돈이 없다는 증언에, 장터에서 받은 기록을 내밀어 보세요.'],
        wrong: '뺑덕 어멈의 말 가운데 기록으로 확인할 수 있는 것을 찾아보세요.',
        success: [
          L('baleum', '떡집 장부를 보십시오. 어제 해 진 뒤, 밀린 외상 닷 냥을 모두 갚고 꿀떡까지 사 가셨습니다. 빈털터리가 아니었습니다!', 'stern', {shout: true, words: ['외상']}),
          L('ppaeng', '그, 그건…', 'shock'),
          L('wonnim', '변호인. 그렇다면 공양미 세 섬이 사라진 까닭을, 증거에 맞게 말해 보시오.', 'stern')
        ]
      }
    },
    custom: {sun: SUNLAB, timeline: TIMELINE},
    stages: [
      {type: 'talk', chapter: '다섯 번째 의뢰', lines: [
        L('narr', '도화동 심청네 곳간에는, 심 봉사의 눈을 위해 마을 사람들이 한 섬 두 섬 모은 공양미가 쌓여 있었습니다.', 'normal', {fx: 'drum', words: ['공양미', '섬']}),
        L('narr', '그런데 오늘 아침, 절에서 쌀을 가지러 와 보니 열 섬 가운데 세 섬이 사라지고 없었습니다.'),
        L('ppaeng', '도둑은 귀덕 어멈이오! 곳간에서 쌀섬을 지고 나오는 것을 내 눈으로 보았소!', 'stern'),
        L('gwideok', '아이고, 무슨 말씀이오. 청이를 젖 먹여 키운 내가 그 쌀에 손을 대겠소…', 'sad'),
        L('simcheong', '나리, 귀덕 어멈은 그럴 분이 아니에요. 부디 도와주세요.', 'sad'),
        L('baleum', '저는 나바름입니다. 귀덕 어멈의 말을 대신 전하겠습니다. 보았다는 말이 맞는지, 하나씩 따져 보겠습니다.'),
        L('wonnim', '좋소. 말이 아니라 증거로 판단하겠소. 현장을 조사해 오시오.', 'stern', {words: ['증거']}),
        L('simcheong', '집과 절, 장터까지 다섯 곳을 둘러봐요. 제가 길을 안내할게요.')
      ]},
      {type: 'investigate', chapter: '다섯 곳의 단서', title: '어제 무슨 일이 있었을까요?'},
      {type: 'talk', chapter: '뺑덕 어멈의 증언', lines: [
        L('narr', '뺑덕 어멈이 치맛자락을 휘날리며 증인석에 올랐습니다.'),
        L('ppaeng', '내가 본 그대로요. 귀덕 어멈의 그림자가 마당에 길게 늘어진 것까지 똑똑히 기억하오!', 'happy'),
        L('simcheong', '그림자요? 나리, 그림자는 때에 따라 길이도 방향도 달라져요. 우리 마당에서 먼저 알아봐요.', 'normal', {words: ['그림자']})
      ]},
      {type: 'sun', chapter: '심청의 그림자 실험', gain: 'shadow', after: [
        L('baleum', '아침에는 서쪽으로 길게, 한낮에는 북쪽으로 짧게, 저녁에는 동쪽으로 길게. 그림자 기록을 증거로 남기겠습니다.'),
        L('simcheong', '이제 뺑덕 어멈의 말을 들어 봐요. 증언을 넘겨 보고, 이상한 말에 맞는 증거를 내밀어 보세요.', 'normal', {words: ['증언']}),
        L('simcheong', '앞에서 한 말과 뒤에서 한 말이 서로 맞지 않으면 그것이 모순이에요. 그럴 땐 두 증언을 맞대 보세요.', 'normal', {words: ['모순']})
      ]},
      {type: 'cross', id: 'ppaeng1', chapter: '한낮의 긴 그림자'},
      {type: 'timeline', chapter: '누가 언제 어디에', after: [
        L('baleum', '해 질 녘, 귀덕 어멈은 몽은사 법당에 있었습니다. 스님이 저녁 종을 칠 때까지 함께 있었지요.', 'stern'),
        L('gwideok', '그렇소. 청이 아버지 눈 뜨시라고 등불 기름을 올리고 왔소.'),
        L('ppaeng', '스, 스님이 잘못 보셨겠지! 나는 분명히 보았소. 다시 말해 주리다!', 'stern')
      ]},
      {type: 'cross', id: 'ppaeng2', chapter: '해를 향한 그림자'},
      {type: 'cross', id: 'gawi', chapter: '그림자를 밟고 걸은 길'},
      {type: 'cross', id: 'ppaeng3', chapter: '갚아진 외상'},
      {type: 'pick', chapter: '진짜 까닭', ...CAUSE, after: [
        L('baleum', '뺑덕 어멈이 해 질 녘에 쌀 세 섬을 엿장수에게 넘기고, 장부를 맡은 귀덕 어멈에게 뒤집어씌웠습니다.', 'stern'),
        L('ppaeng', '…그래, 내가 그랬소. 떡집 외상에 쫓기다 그만 눈이 뒤집혔소.', 'sad'),
        L('ppaeng', '귀덕 어멈, 미안하오. 장부를 쥔 사람이니 의심받기 쉬우리라 여겼소.', 'sad'),
        L('simbongsa', '뺑덕 어멈. 모자란 것이 있으면 말을 하지 그랬나. 마을 사람들의 정성에 손을 대서야 되겠는가.', 'sad'),
        L('gwideok', '쌀이 돌아온다니 되었소. 청아, 이제 걱정 말거라.', 'happy'),
        L('wonnim', '이제 판결을 내리겠소.', 'stern')
      ]},
      {type: 'verdict', chapter: '증거가 이끄는 판결', ...VERDICT},
      {type: 'diary', chapter: '나의 판관 일기'},
      {type: 'end', chapter: '다시 채워진 곳간'}
    ],
    landing: {
      intro: '마을 사람들이 모은 공양미가 사라졌다.<br>“한낮에 긴 그림자를 보았다”는 말 한마디에,<br><strong>해와 그림자로 진실을 밝혀 주세요.</strong>',
      start: '귀덕 어멈의 사건 맡기',
      backdrop: 'simhome',
      people: [['gwideok', 'sad'], ['ppaeng', 'stern'], ['baleum', 'normal']],
      bubble: '한낮의 그림자가 그리 길 수 있겠소?',
      label: ['심청전에서 시작된 새로운 사건', '공양미와 긴 그림자의 진실'],
      steps: ['단서 수집', '해와 그림자', '증거로 판결'],
      credit: '초등 4학년부터 · 읽는 속도에 따라 약 35–45분 · 진행 자동 저장'
    },
    diary: {
      title: '다시 이런 일이 생기지 않으려면?',
      intro: '가장 마음에 드는 생각을 골라 주세요. 여기에는 정답이 없어요.',
      choices: [
        '남에게 죄를 뒤집어씌우는 것은 훔치는 것만큼 나쁜 일이에요.',
        '어려운 일이 있으면 숨기지 말고 둘레 사람들에게 말해야 해요.',
        '보았다는 말은 언제, 어디에서 보았는지가 맞아야 믿을 수 있어요.'
      ],
      placeholder: '예: 친구가 의심받을 때 먼저 사실을 확인할 거예요.'
    },
    end: {
      backdrop: 'simhome',
      people: [['simcheong', 'happy'], ['gwideok', 'happy']],
      quote: '“그림자는 언제나 해의 반대쪽에 생겨요.”',
      kicker: '다섯 번째 사건 해결',
      title: '그림자는<br><em>거짓말을 못 해요.</em>',
      text: '공양미 세 섬이 곳간으로 돌아왔습니다.<br>해 질 녘, 심청네 마당에는 감나무 쪽으로 긴 그림자가 드리웠습니다.',
      badges: ['그림자 관측가', '시간표 수사관', '모순 사냥꾼']
    },
    guide: `<h3>제5화 · 교사·보호자 안내</h3><p><b>심청전 × 그림자와 해의 위치 × 언제, 어디에 있었나</b><br>초등 4학년부터, 약 35–45분을 예상한 이야기입니다. 심청전의 심청, 심 봉사, 귀덕 어멈, 뺑덕 어멈을 바탕으로 새로 꾸민 사건입니다. 가위 아재는 이 게임을 위해 만든 인물입니다. 인당수 이야기는 다루지 않고, 공양미는 마을 사람들이 함께 모은 것으로 바꾸었습니다. 뺑덕 어멈은 원작에서도 심 봉사의 살림을 축내는 인물입니다.</p><p><b>함께 생각할 질문</b></p><ol><li>한낮의 그림자는 왜 짧을까요? 해 질 녘의 그림자는 어느 쪽으로 생길까요?</li><li>뺑덕 어멈은 왜 귀덕 어멈을 골라 뒤집어씌웠을까요?</li><li>심 봉사는 앞을 보지 못하지만 중요한 증언을 했습니다. 무엇으로 때와 일을 알았을까요?</li></ol><details class="teacher-spoilers"><summary>교사용 진행·정답 보기</summary><p>그림자 실험: 한낮 → 이른 아침 → 해 질 녘.<br>뺑덕 어멈 첫 심문: 증언 2와 3을 맞대기. 또는 증언 3 + 그림자 기록, 증언 2 + 떡집 외상 장부.<br>누가 언제 어디에: 귀덕 어멈 한낮 심청네 집, 해 질 녘 몽은사. 뺑덕 어멈 한낮 장터, 해 질 녘 심청네 집.<br>뺑덕 어멈 두 번째 심문: 증언 2와 3을 맞대기. 또는 증언 3 + 마당 그림이나 그림자 기록.<br>가위 아재: 증언 3과 4를 맞대기. 또는 증언 4 + 그림자 기록, 증언 5 + 심 봉사가 들은 소리.<br>뺑덕 어멈 마지막 심문: 증언 3 또는 4 + 떡집 외상 장부.<br>진짜 까닭: 네 번째 보기.<br>심문에서 쓰이지 않는 증거: 수레바퀴 자국.</p></details><p><b>과학 표현의 범위</b><br>그림자는 해의 반대쪽에 생기고, 해가 높이 뜬 한낮에 가장 짧으며 아침과 저녁에 길다는 것을 다룹니다. 그림자의 정확한 길이와 방향은 계절과 위도에 따라 달라집니다. 이야기에서는 “아침에는 서쪽, 한낮에는 북쪽, 저녁에는 동쪽”으로 단순하게 나타냈습니다. 운동장에서 막대의 그림자를 시간마다 표시해 보는 활동과 이어서 볼 수 있습니다.</p><p><b>인물을 다루는 방식</b><br>심 봉사는 도움을 받기만 하는 인물이 아니라, 소리와 볕으로 때를 기억하는 믿을 만한 증인으로 그렸습니다. 그의 증언은 다른 증거와 맞아떨어져 사건을 푸는 열쇠가 됩니다.</p><p class="muted">로그인 없이 사용하며 진행과 일기는 브라우저 안에만 저장됩니다. 화마다 진행 기록은 별개입니다.</p>`
  };
})();
