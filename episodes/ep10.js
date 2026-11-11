'use strict';
// 제10화 · 춘향전 — 지워지지 않는 이름 (마지막 화)
// 춘향전의 본 사건(사또의 명을 거절한 춘향이 옥에 갇힘)을 어린이 눈높이에 맞게 각색했습니다.
// 날짜, 거리, 실험 결과는 이야기 속 자료이고, 법과 절차는 이야기에 맞게 쉽게 풀어 썼습니다.
// 자료 형식은 docs/episode-format.md, 사건 설계는 docs/episode10.md 를 보세요.
window.CASE = (() => {
  const L = (who, text, mood = 'normal', extra = {}) => ({who, text, mood, ...extra});
  const INK = '#3c332b';

  // ---------- 번짐 실험 ----------
  const BANDS = [['#2f6fa8', '푸른색'], ['#c8475f', '붉은색'], ['#d9a82e', '노란색']];
  const STRIPS = {
    meok: {name: '관아의 먹', from: '벼루에 갈아 둔 먹', runs: false},
    dye: {name: '염색집의 검정 물', from: '염색집에서 얻어 온 것', runs: true},
    old: {name: '명부의 다른 이름', from: '3년 전 줄의 ‘매향’', runs: false},
    chun: {name: '명부의 춘향 이름', from: '3년 전 줄에 끼어 있는 ‘춘향’', runs: true}
  };
  /** 종이 띠 그림. wet: 물에 담갔는지, runs: 색이 갈라지는지 */
  function stripArt(wet, runs) {
    const dot = !wet ? `<circle cx="40" cy="150" r="9" fill="#1d1b1a"/>`
      : runs ? `${BANDS.map(([c], i) => `<ellipse cx="40" cy="${118 - i * 30}" rx="15" ry="13" fill="${c}" opacity=".78"/>`).join('')}<circle cx="40" cy="150" r="5" fill="#d8d0c0" opacity=".5"/>`
        : `<circle cx="40" cy="150" r="9" fill="#1d1b1a"/>`;
    return `<svg class="strip-art" viewBox="0 0 80 210" aria-hidden="true"><rect x="16" y="6" width="48" height="176" rx="3" fill="${wet ? '#e9eef0' : '#fbf8ee'}" stroke="#b9ab8a" stroke-width="2"/>${dot}<path d="M4 182h72v22a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z" fill="${wet ? '#9cc7da' : '#dfe6e8'}" stroke="#7a9aa8" stroke-width="2"/></svg>`;
  }
  const stripRow = wetKeys => `<div class="ind-grid">${Object.entries(STRIPS).map(([k, s]) => `<div class="ind-cell ${wetKeys.includes(k) ? 'done' : ''}">${stripArt(wetKeys.includes(k), s.runs)}<b>${s.name}</b><small>${s.from}</small>${wetKeys.includes(k) ? `<span class="ind-result">${s.runs ? '세 가지 색으로 갈라짐' : '번지지 않고 그대로'}</span>` : `<span class="ind-result ind-wait" data-k="${k}"></span>`}</div>`).join('')}</div>`;
  const CQ = [
    {q: '명부의 <b>춘향 이름</b>과 같은 결과가 나온 것은 무엇일까요?', opts: ['관아의 먹', '염색집의 검정 물'], a: 1, no: '춘향 이름은 세 가지 색으로 갈라졌어요. 똑같이 갈라진 것을 찾아보세요.'},
    {q: '이 실험만으로 <b>알 수 있는 것</b>은 무엇일까요?', opts: ['춘향의 이름은 다른 이름들과 다른 것으로 썼다', '춘향의 이름을 써넣은 사람은 변학도다', '춘향의 이름은 3년 전에 썼다'], a: 0, no: '실험이 알려 주는 것은 “무엇으로 썼는가”예요. 누가, 언제 썼는지는 다른 증거가 있어야 알 수 있어요.'}
  ];
  const CHROMA = {
    auto: () => [...Object.keys(STRIPS).map(k => ['chr-dip', k]), ['chr-q', '0'], ['chr-q', '1'], ['chr-q', '1'], ['chr-q', '0'], ['chr-next', '']],
    draw(s, api) {
      const p = api.P(), a = api.action, wet = Array.isArray(p.wet) ? p.wet : (p.wet = []), all = wet.length === 4, n = p.n || 0, done = n >= CQ.length;
      api.$('#view').innerHTML = `<section class="board puzzle-board"><div class="section-kicker">향단이의 번짐 실험${all && !done ? ` · 물음 ${n + 1} / ${CQ.length}` : ''}</div><h2>검은 글씨 속에 숨은 색</h2><p class="muted">검은색은 한 가지 색처럼 보여도, 여러 색이 섞여 있을 수 있어요. 종이 띠 아래쪽에 점을 찍고 끝을 물에 담그면, 물이 종이를 타고 올라가며 섞인 색을 나누어 줘요. 네 개의 띠를 <b>모두 물에 담가</b> 보세요.</p>
        <div class="lab-common"><span>같은 종이 띠</span><span>같은 물</span><span>같은 시간</span></div>
        ${stripRow(wet)}
        ${p.msg ? `<p class="feedback" role="status">${api.esc(p.msg)}</p>` : ''}
        ${!all ? `<div class="row">${Object.entries(STRIPS).filter(([k]) => !wet.includes(k)).map(([k, st]) => a('chr-dip', `${st.name} 담그기`, k, 'seal blue sm')).join('')}</div><p class="muted">${wet.length} / 4 담금</p>`
          : done ? `<div class="lab-explanation" role="status"><span class="result-seal">실험 성공</span><h3>춘향의 이름만 다른 것으로 썼어요</h3><p>먹은 물에 녹지 않는 그을음 알갱이라, 물이 지나가도 번지지 않고 그 자리에 남아요. 여러 색 물감을 섞어 만든 검정 물은 물을 따라 올라가며 색이 갈라져요.</p><p class="muted">춘향 이름의 색이 다 올라간 뒤, 글씨가 있던 자리에는 <b>남은 먹이 없었어요.</b> 먹으로 쓴 글씨 위에 덧쓴 것이 아니에요.</p>${a('chr-next', '번짐 실험 기록을 증거함에 넣기 →')}</div>`
          : `<p class="pick-question">${CQ[n].q}</p><div class="row">${CQ[n].opts.map((o, i) => a('chr-q', o, i, 'seal blue')).join('')}</div>`}
        <p class="science-note">섞여 있는 색을 종이와 물로 나누는 방법이에요. 3화에서 섞인 알갱이를 나누었던 것처럼, 섞인 색도 성질의 차이로 나눌 수 있어요.</p></section>`;
    },
    act(a, v, s, api) {
      const p = api.P(), n = p.n || 0;
      if (a === 'chr-dip' && STRIPS[v] && !p.wet.includes(v)) { p.wet.push(v); p.msg = `${STRIPS[v].name}: ${STRIPS[v].runs ? '세 가지 색으로 갈라졌어요.' : '번지지 않고 그대로예요.'}`; }
      if (a === 'chr-q' && p.wet.length === 4 && n < CQ.length) { if (+v === CQ[n].a) { p.n = n + 1; p.msg = ''; } else p.msg = CQ[n].no; }
      if (a === 'chr-next' && n >= CQ.length) return api.done();
      api.save(); this.draw(s, api);
    }
  };

  // ---------- 길 셈 ----------
  const NEED = 50, GO = [['걸어서', 10], ['관아의 말을 타고', 30]];
  const bars = () => `<div class="speed-bars">${[...GO, ['낮 3시까지 돌아오려면', NEED]].map(([name, v], i) => `<div class="speed-bar ${i === 2 ? 'need' : ''}"><span>${name}</span><i style="width:${v * 1.6}%"></i><b>한 시간에 ${v}리</b></div>`).join('')}</div>`;
  const roadArt = () => `<svg class="sack-art" viewBox="0 0 640 170" role="img" aria-label="감영에서 남원 관아까지 150리 길."><rect width="640" height="170" rx="14" fill="#e6dcbf"/><path d="M96 86H544" stroke="#8a6a4a" stroke-width="7" stroke-linecap="round" stroke-dasharray="2 12"/>
    ${[[96, '감영', '낮 12시, 형방이 도장을 받음'], [544, '남원 관아', '낮 3시, 판결문을 썼다?']].map(([x, n, t]) => `<g transform="translate(${x} 86)"><circle r="16" fill="#f4efe2" stroke="${INK}" stroke-width="3"/><path d="M-9 3l9-10l9 10v7h-18z" fill="#8a5a3a"/><text y="-28" text-anchor="middle" font-size="19" font-weight="700" fill="${INK}">${n}</text><text y="46" text-anchor="middle" font-size="14" fill="#7a3a2c">${t}</text></g>`).join('')}
    <g transform="translate(320 86)"><rect x="-44" y="-18" width="88" height="32" rx="8" fill="#fff8e6" stroke="#8a6a4a" stroke-width="2"/><text y="6" text-anchor="middle" font-size="19" font-weight="700" fill="#7a3a2c">150리</text></g></svg>`;
  const RQ = [
    {q: '낮 12시에서 낮 3시까지는 몇 시간일까요?', opts: ['2시간', '3시간', '4시간'], a: 1, tag: '3시간', ok: '낮 12시에서 낮 3시까지는 3시간이에요.', no: '12시에서 1시, 2시, 3시. 시계가 몇 시간을 가는지 세어 보세요.'},
    {q: '150리를 3시간에 가려면 한 시간에 몇 리를 가야 할까요?', opts: ['30리', '50리', '450리'], a: 1, tag: '한 시간에 50리', ok: '150 ÷ 3 = 50. 한 시간에 50리를 가야 해요.', no: '속력은 간 거리를 걸린 시간으로 나눈 값이에요. 150 ÷ 3 을 계산해 보세요.'},
    {q: '형방은 낮 3시까지 남원 관아에 돌아올 수 있었을까요?', opts: ['걸어서 올 수 있었다', '관아의 말을 타면 올 수 있었다', '말을 타도 올 수 없었다'], a: 2, tag: '올 수 없음', ok: '', no: '필요한 속력과, 걷는 속력과 말의 속력을 견주어 보세요.'}
  ];
  const ROAD = {
    auto: () => [['road-q', '1'], ['road-q', '0'], ['road-q', '1'], ['road-q', '2'], ['road-next', '']],
    draw(s, api) {
      const p = api.P(), a = api.action, n = p.n || 0, done = n >= RQ.length;
      api.$('#view').innerHTML = `<section class="board puzzle-board"><div class="section-kicker">바람이와 다시 하는 길 셈${done ? '' : ` · ${n + 1} / ${RQ.length}`}</div><h2>형방은 그때 남원에 있을 수 있었을까?</h2><p class="muted">감영 기록에 따르면 형방은 5일 <b>낮 12시</b>에 감영에 있었어요. 판결문에는 같은 날 <b>낮 3시</b>에 남원 관아에서 썼다고 적혀 있어요. <b>속력 = 간 거리 ÷ 걸린 시간</b></p>
        ${roadArt()}
        <div class="lab-common"><span>간 거리: <b>150리</b></span>${RQ.map((q, i) => `<span>${['걸린 시간', '필요한 속력', '판단'][i]}: ${i < n ? `<b>${q.tag}</b>` : '?'}</span>`).join('')}</div>
        ${n >= 2 ? bars() : ''}
        ${p.msg ? `<p class="feedback" role="status">${api.esc(p.msg)}</p>` : ''}
        ${done ? `<div class="lab-explanation" role="status"><span class="result-seal">길 셈 성공</span><h3>말을 타도 닿을 수 없는 길</h3><p>낮 3시까지 돌아오려면 한 시간에 50리를 가야 해요. 관아의 말은 한 시간에 30리, 걸으면 10리를 가요. 형방은 그때 남원 관아에 있을 수 없었어요.</p><p class="muted">7화에서 홍길동의 누명을 벗긴 바로 그 셈이에요.</p>${a('road-next', '길 셈 기록을 증거함에 넣기 →')}</div>`
          : `<p class="pick-question">${RQ[n].q}</p><div class="row">${RQ[n].opts.map((o, i) => a('road-q', o, i, 'seal blue')).join('')}</div>`}</section>`;
    },
    act(a, v, s, api) {
      const p = api.P(), n = p.n || 0;
      if (a === 'road-q' && n < RQ.length) { if (+v === RQ[n].a) { p.n = n + 1; p.msg = RQ[n].ok; } else p.msg = RQ[n].no; }
      if (a === 'road-next' && n >= RQ.length) return api.done();
      api.save(); this.draw(s, api);
    }
  };

  // ---------- 증거 그림 ----------
  const rosterArt = () => `<svg class="sack-art" viewBox="0 0 640 230" role="img" aria-label="기생 명부의 한 쪽. 3년 전 줄에 이름 넷이 있는데, 셋째 이름 춘향은 줄 사이에 작게 끼어 있고 빛깔이 조금 다르다."><rect width="640" height="230" rx="14" fill="#d9c9a6"/><rect x="50" y="18" width="540" height="180" fill="#f6efdc" stroke="#9a875f" stroke-width="3"/>
    <text x="70" y="50" font-size="16" fill="#7a6a4f">3년 전 봄에 올린 이름</text>
    ${[['매향', 86, 22, '#1d1b1a'], ['난초', 122, 22, '#1d1b1a'], ['춘향', 144, 17, '#24283c'], ['월선', 172, 22, '#1d1b1a']].map(([n, y, fs, c]) => `<text x="${fs < 20 ? 196 : 110}" y="${y}" font-size="${fs}" font-weight="700" fill="${c}" letter-spacing="6">${n}</text>`).join('')}
    <path d="M250 140h70" stroke="${INK}" stroke-width="2"/><text x="328" y="145" font-size="15" fill="${INK}">줄과 줄 사이에 작게 끼어 있음</text>
    <text x="320" y="220" text-anchor="middle" fill="#776b53" font-size="14">기생 명부의 한 쪽을 본 대로 옮긴 그림</text></svg>`;
  const VIEW = {
    roster: () => `<div class="observation-heading"><span>관아 문서고 · 이방이 지키는 장부</span><b>기생 명부</b></div>${rosterArt()}<p class="gl">이름은 올린 때의 차례대로 한 줄에 하나씩 적혀 있어요. 그런데 <b>춘향</b>의 이름만 줄과 줄 사이에 작게 끼어 있어요.</p><p class="gl">눈으로 보기에는 모두 검은 글씨예요. 춘향의 이름이 조금 더 검푸르게 보이지만, 눈으로만 보아서는 분명하지 않아요.</p>`,
    jail: () => `<article class="evidence-document ledger-doc"><span class="doc-overline">남원 관아 옥 · 옥 일지</span><h3>춘향이 들어온 날의 기록</h3><div class="ledger-grid"><span>들어온 때</span><strong>5일 해 질 녘</strong><span>데려온 이</span><strong>사령 번쇠. 춘향의 집에서 곧장 옴</strong><span>재판</span><strong>열리지 않음</strong><span>판결문</span><strong>받지 못함. 사또께서 말로 이르심</strong></div><p class="doc-signer">적은 이 · 옥사장</p></article>`,
    writ: () => `<article class="evidence-document ledger-doc"><span class="doc-overline">남원 관아 · 형방의 책상</span><h3>춘향을 가두라는 판결문</h3><div class="ledger-grid"><span>쓴 때</span><strong>5일 낮 3시</strong><span>쓴 곳</span><strong>남원 관아</strong><span>쓴 이</span><strong>형방</strong><span>죄목</span><strong>관의 명을 거역함</strong></div><p class="doc-copy">“춘향을 옥에 가둔다.”</p><p class="doc-signer">부사 변학도의 도장이 찍혀 있음</p></article>`,
    gamyeong: () => `<article class="evidence-document ledger-doc"><span class="doc-overline">역참 · 감영을 오간 기록</span><h3>형방이 다녀온 길</h3><div class="ledger-grid"><span>5일 낮 12시</span><strong>남원 형방이 감영에서 문서에 도장을 받음</strong><span>남원까지</span><strong>150리</strong><span>걸으면</span><strong>한 시간에 10리</strong><span>관아의 말</span><strong>한 시간에 30리</strong></div><p class="doc-copy">“형방은 걸어서 떠났다.”</p><p class="doc-signer">적은 이 · 감영의 서리</p></article>`,
    reply: () => `<article class="evidence-document note-doc"><span class="doc-overline">춘향의 집 · 5일 낮에 써 보낸 글</span><h3>춘향의 답글</h3><p class="doc-copy">“사또의 명은 잘 받았사옵니다.<br>그러나 소녀에게는 굳게 <b>약속한 사람</b>이 있어<br>명을 받들 수 없사오니,<br>부디 너그러이 <b>헤아려 주시옵소서.</b>”</p><p class="doc-signer">쓴 이 · 춘향 (사령 번쇠가 받아 감)</p></article>`,
    dye: () => `<article class="evidence-document ledger-doc"><span class="doc-overline">염색집 장부</span><h3>검정 물을 판 기록</h3><div class="ledger-grid"><span>판 날</span><strong>6일 아침</strong><span>판 것</span><strong>검정 물 한 병 (여러 색 물감을 섞어 만든 것)</strong><span>사 간 이</span><strong>관아의 이방</strong><span>한 말</span><strong>“관아에 먹이 떨어졌소.”</strong></div><p class="doc-copy">“관아에 검정 물을 판 것은<br>이번이 처음.”</p><p class="doc-signer">적은 이 · 염색집 주인</p></article>`,
    vow: () => `<article class="evidence-document note-doc"><span class="doc-overline">광한루 · 약속의 증표</span><h3>옥가락지 한 짝</h3><p class="doc-copy">이몽룡이 한양으로 떠나며<br>춘향과 나누어 가진 옥가락지.<br>춘향이 말한 <b>“약속한 사람”</b>이<br>있다는 것을 알려 줌.</p><p class="doc-signer">맡아 둔 이 · 향단</p></article>`,
    sasay: () => `<article class="evidence-document note-doc"><span class="doc-overline">법정 기록 · 사령 번쇠의 말</span><h3>사령이 바로잡은 말</h3><p class="doc-copy">“춘향은 소리를 지르지 않았소.<br><b>공손한 글</b>로 거절했소.<br>사또께서 <b>‘춘향이 무례했다고 말하라’</b><br>하고 시키셨소.”</p><p class="doc-signer">말한 이 · 사령 번쇠</p></article>`,
    chroma: () => `<div class="observation-heading"><span>법정에서 해 본 실험</span><b>번짐 실험 기록</b></div>${stripRow(Object.keys(STRIPS))}<p class="gl">명부의 다른 이름은 <b>관아의 먹</b>처럼 번지지 않았어요. <b>춘향의 이름</b>만 <b>염색집의 검정 물</b>처럼 세 가지 색으로 갈라졌어요.</p><p class="gl">색이 다 올라간 뒤, 춘향의 이름이 있던 자리에는 <b>남은 먹이 없었어요.</b></p>`,
    speed: () => `<div class="observation-heading"><span>법정에서 셈함</span><b>길 셈 기록</b></div><div class="tw"><table class="seat"><tbody><tr><th scope="row">감영에서 남원 관아까지</th><td><b>150리</b></td></tr><tr><th scope="row">낮 12시에서 낮 3시까지</th><td><b>3시간</b></td></tr><tr><th scope="row">필요한 속력</th><td class="sick">150 ÷ 3 = 한 시간에 50리</td></tr></tbody></table></div>${bars()}<p class="gl">형방은 5일 낮 3시에 남원 관아에 있을 수 없었어요.</p>`,
    confess: () => `<article class="evidence-document note-doc"><span class="doc-overline">법정 기록 · 이방의 말</span><h3>이방이 털어놓은 말</h3><p class="doc-copy">“<b>6일 아침</b>에 사또께서 저를 부르셨습니다.<br><b>‘춘향을 가둔 까닭을 만들어라’</b> 하셨지요.<br>먹이 떨어져 검정 물로<br>명부에 춘향의 이름을 써넣었습니다.”</p><p class="doc-signer">말한 이 · 이방</p></article>`
  };

  // ---------- 진범 지목 ----------
  const ACCUSE = {
    kicker: '진범 지목',
    title: '이름을 써넣게 하고, 재판도 없이 가두게 한 사람은?',
    intro: '붓을 든 사람, 말을 전한 사람, 그리고 <b>시킨 사람</b>이 있어요. 이 일을 시킨 한 사람을 짚어 주세요.',
    suspects: ['byeon', 'ibang', 'saryeong'],
    culprit: 'byeon',
    wrong: {
      ibang: '이방은 붓을 든 사람이에요. 하지만 누가 시켰는지 이방이 스스로 말했지요. 「시킨 사람」을 짚어 주세요.',
      saryeong: '사령은 시키는 대로 거짓으로 아뢴 사람이에요. 그렇게 말하라고 시킨 사람은 따로 있어요.'
    },
    need: 3,
    proofTitle: '변학도가 시켰다는 근거는?',
    proofIntro: '사또와 이 일을 <b>이어 주는</b> 증거를 세 개 골라 주세요. “무슨 일이 있었는지” 알려 주는 증거와 “누가 시켰는지” 알려 주는 증거는 달라요.',
    proof: ['confess', 'sasay', 'jail', 'writ'],
    why: {
      roster: '명부는 이름이 끼어 있다는 것을 보여 줘요. 누가 시켰는지는 알려 주지 않아요.',
      chroma: '번짐 실험은 춘향의 이름을 무엇으로 썼는지 알려 줘요. 누가 시켰는지는 알려 주지 않아요.',
      dye: '염색집 장부는 검정 물을 이방이 샀다는 것을 알려 줘요. 이방에게 시킨 사람이 누구인지는 다른 증거에 있어요.',
      gamyeong: '감영 기록은 형방이 어디에 있었는지 알려 줘요. 사또와 이어 주는 증거는 아니에요.',
      speed: '길 셈은 판결문을 그때 쓸 수 없었다는 것을 알려 줘요. 그 판결문에 누구의 도장이 찍혀 있는지를 보여 주는 증거를 골라 보세요.',
      reply: '춘향의 답글은 춘향이 공손했다는 것을 알려 줘요. 사또가 무엇을 시켰는지는 알려 주지 않아요.',
      vow: '옥가락지는 춘향이 거절한 까닭을 알려 줄 뿐이에요.'
    }
  };

  const VERDICT = {
    kicker: '사건 번호 010 · 최종 판결',
    stamp: '무죄',
    title: '춘향이 이름을 되찾았어요.',
    sub: '뒤늦게 써넣은 이름도, 뒤늦게 꾸민 판결문도 증거 앞에서 드러났어요.',
    cards: [
      {title: '관아의 판결 · 원님', who: 'wonnim', text: '춘향에게는 죄가 없소. 춘향의 이름은 가둔 뒤에 써넣은 것이고, 판결문은 뒤에 꾸민 것이며, 재판도 없이 사람을 가두었소. 변학도는 수령의 자리에서 물러나 나라의 벌을 기다리시오. 이방과 사령은 시켜서 한 일이나 거짓 문서와 거짓말에 손을 보탰으니 책임이 있소. 다만 스스로 사실을 말한 것을 참작하겠소.'},
      {modern: true, title: '오늘의 시선 · 한저울 판사', who: 'judge', text: '오늘날에는 누구도 재판 없이 벌을 받지 않아요. 사람을 가두려면 까닭을 밝힌 문서가 먼저 있어야 하고, 갇힌 사람은 도와줄 변호인을 부를 수 있어요. 사건과 얽힌 사람은 판사를 맡지 않아요. 이몽룡이 스스로 물러난 것처럼요. 높은 자리의 힘은 정해진 법과 절차 안에서만 쓸 수 있어요.'}
    ],
    strip: [['과학', '섞인 색을 나누는 번짐 실험'], ['수학', '150 ÷ 3 = 50'], ['법', '재판 없이 가둘 수 없어요']],
    note: '먹은 물에 녹지 않는 그을음 알갱이라 물이 지나가도 잘 번지지 않아요. 여러 색을 섞어 만든 검정은 물을 따라 올라가며 색이 갈라져요. 검정 수성 사인펜과 거름종이로 같은 실험을 해 볼 수 있어요.',
    foot: '춘향전을 활용하여 각색한 이야기입니다. 법과 절차는 이야기에 맞게 쉽게 풀어 썼습니다.'
  };

  return {
    n: 10, classic: '춘향전', title: '지워지지 않는 이름',
    helper: 'hyangdan',
    court: 'court',
    rules: {pair: true, combo: true, coins: 3},
    portraits: ['baleum', 'wonnim', 'mongryong', 'chunhyang', 'hyangdan', 'byeon', 'ibang', 'saryeong', 'baram', 'heungbu', 'kongjwi', 'judge'],
    art: {wonnim: 'wonnim-v3'},
    chars: {
      baleum: '나바름',
      wonnim: '이웃 고을 원님',
      mongryong: '어사 이몽룡',
      chunhyang: '춘향',
      hyangdan: '향단',
      byeon: '사또 변학도',
      ibang: '이방',
      saryeong: '사령 번쇠',
      baram: '바람이',
      heungbu: '흥부',
      kongjwi: '콩쥐',
      judge: '한저울 판사',
      narr: ''
    },
    glossary: {
      '암행어사': '임금의 명을 받아 몰래 고을을 살피고, 잘못한 관리를 바로잡던 사람이에요.',
      '명부': '이름을 적어 둔 장부예요. 이 이야기의 기생 명부는 관아의 잔치에서 노래와 춤을 맡던 사람들의 이름을 적은 장부예요.',
      '증거': '어떤 일이 있었는지 확인하는 데 도움이 되는 물건이나 기록이에요.',
      '증언': '자기가 보고 들은 일을 법정에서 말하는 것이에요.',
      '모순': '앞에서 한 말과 뒤에서 한 말이 서로 맞지 않는 것이에요.',
      '판결문': '재판에서 내린 결정을 적은 문서예요.',
      '형방': '옛날 관아에서 재판과 벌에 관한 문서를 맡던 사람이에요.',
      '감영': '여러 고을을 살피던 큰 관아예요.',
      '속력': '얼마나 빠른지를 나타내는 값이에요. 간 거리를 걸린 시간으로 나누어 구해요.'
    },
    evidence: {
      roster: {name: '기생 명부', short: '춘향의 이름이 끼어 있는 장부', icon: 'ledger', view: VIEW.roster},
      jail: {name: '옥 일지', short: '춘향이 옥에 들어온 날의 기록', icon: 'ledger', view: VIEW.jail},
      writ: {name: '판결문', short: '춘향을 가두라는 문서', icon: 'order', view: VIEW.writ},
      gamyeong: {name: '감영 기록', short: '형방이 감영을 다녀온 기록', icon: 'map', view: VIEW.gamyeong},
      reply: {name: '춘향의 답글', short: '춘향이 사또에게 써 보낸 글', icon: 'note', view: VIEW.reply},
      dye: {name: '염색집 장부', short: '관아에 검정 물을 판 기록', icon: 'ledger', view: VIEW.dye},
      vow: {name: '옥가락지', short: '이몽룡과 나눈 약속의 증표', icon: 'jar', view: VIEW.vow},
      sasay: {name: '사령의 말', short: '사령 번쇠가 바로잡은 말', icon: 'note', view: VIEW.sasay},
      chroma: {name: '번짐 실험 기록', short: '네 가지 검은 글씨를 물에 번지게 한 실험', icon: 'table', view: VIEW.chroma},
      speed: {name: '길 셈 기록', short: '형방이 돌아오는 데 필요한 속력', icon: 'table', view: VIEW.speed},
      confess: {name: '이방의 말', short: '이방이 털어놓은 말', icon: 'note', view: VIEW.confess}
    },
    places: [
      {id: 'office', name: '관아 문서고', art: 'office', ev: 'roster', who: 'baleum', line: '사또가 내세우는 기생 명부야. 춘향의 이름이 적힌 쪽을 그대로 옮겨 그려 두자.'},
      {id: 'jail', name: '남원 관아 옥', art: 'jail', ev: 'jail', who: 'chunhyang', line: '5일 해 질 녘에 집에서 곧장 이곳으로 끌려왔어요. 누구도 제 말을 묻지 않았습니다.', mood: 'sad'},
      {id: 'desk', name: '형방의 책상', art: 'daecheong', ev: 'writ', who: 'baleum', line: '사또가 내세우는 판결문이야. 쓴 때와 쓴 곳을 잘 봐 두자.'},
      {id: 'stable', name: '역참', art: 'stable', ev: 'gamyeong', who: 'baram', line: '안녕하세요, 나리! 감영을 오간 사람은 여기 다 적혀 있어요. 형방 아저씨도요.'},
      {id: 'home', name: '춘향의 집', art: 'chunhome', ev: 'reply', who: 'hyangdan', line: '아씨가 그날 써 보낸 글을 제가 한 벌 베껴 두었어요. 얼마나 공손한지 보세요.'},
      {id: 'dyeshop', name: '염색집', art: 'dyeshop', ev: 'dye', who: 'hyangdan', line: '염색집 아주머니가 그러는데, 며칠 전에 관아에서 검정 물을 사 갔대요.'},
      {id: 'gwanghallu', name: '광한루', art: 'gwanghallu', ev: 'vow', who: 'mongryong', line: '한양으로 떠나던 날, 이곳에서 춘향과 가락지를 나누어 가졌소.'}
    ],
    witnesses: {
      saryeong: {
        who: 'saryeong', title: '첫 심문 · 명을 전한 사령 번쇠',
        statements: [
          {text: '소인은 관아의 사령 번쇠요. 5일 낮에 사또의 명을 전하러 춘향의 집에 갔소.', cards: [{q: '어떤 명이었나요?', a: '관아에 들어와 사또의 시중을 들라는 명이었소.'}]},
          {text: '춘향은 명을 듣더니 얼굴을 붉히며 버럭 소리를 질렀소. “사또가 뭔데!” 하면서.', cards: [{q: '그 소리를 들은 사람이 또 있나요?', a: '그, 그야… 소인만 들었소.', mood: 'sweat'}]},
          {text: '소인은 그 말을 그대로 사또께 아뢰었고, 사또께서 크게 노하셨소.', cards: [{q: '사또는 뭐라고 하셨나요?', a: '“당장 옥에 가두어라” 하셨소.'}]},
          {text: '춘향이 손수 써 준 글도 사또께 전했소. 글씨가 어찌나 곱고 말이 공손하던지.', cards: [{q: '그 글에는 뭐라고 쓰여 있었나요?', a: '약속한 사람이 있어 명을 받들 수 없으니 헤아려 달라고… 어?', mood: 'sweat'}]},
          {text: '그러니 춘향이 벌을 받은 것은 무례했기 때문이오.', cards: [{q: '춘향을 옥으로 데려간 것도 사령님인가요?', a: '그렇소. 해 질 녘에 집에서 곧장 옥으로 데려갔소.'}]}
        ],
        solve: {pair: [1, 3], evidence: 'reply', statements: [1, 4], near: [
          {pair: [3, 4], text: '공손한 글과 「무례했다」는 말이 맞지 않는다는 것은 좋은 눈이에요. 사령이 춘향의 태도를 직접 말한 증언을 골라 맞대어 보세요.'},
          {evidence: 'vow', text: '옥가락지는 춘향에게 약속한 사람이 있다는 것을 알려 줘요. 하지만 춘향이 어떤 태도로 거절했는지는 알려 주지 않아요.'}
        ]},
        hints: ['사령은 춘향이 어떻게 거절했다고 했나요? 한 번만 말하지 않았어요.', '소리를 질렀다는 증언과, 공손한 글을 받았다는 증언을 맞대어 보세요.'],
        wrong: '사령의 말끼리 견주어 보세요. 춘향의 태도를 서로 다르게 말한 곳이 있어요.',
        success: [
          L('baleum', '버럭 소리를 질렀다면서, 손수 써 준 글은 공손했다고요. 춘향은 공손한 글로 거절한 것입니다!', 'stern', {shout: true}),
          L('saryeong', '아이고… 사실은 그렇소. 춘향은 소리 한 번 높이지 않았소.', 'sad'),
          L('saryeong', '사또께서 “춘향이 무례했다고 말하라” 하고 시키셨소. 거스르면 소인이 옥에 갈 판이라…', 'sad'),
          L('baleum', '사령의 말을 그대로 기록해 두겠습니다.'),
          L('byeon', '흥, 말투가 어땠든 상관없소! 춘향은 명부에 오른 몸이오. 명부를 보시오!', 'stern'),
          L('hyangdan', '나리, 명부의 글씨가 조금 이상했잖아요. 검은 글씨 속에 무엇이 숨었는지, 번지게 해서 알아봐요!', 'happy')
        ]
      },
      ibang: {
        who: 'ibang', title: '두 번째 심문 · 명부를 지키는 이방',
        statements: [
          {text: '관아의 문서를 맡은 이방이오. 기생 명부는 내가 지키오.', cards: [{q: '명부에 이름은 누가 써넣나요?', a: '이방인 내가 쓰오. 다른 사람은 손대지 못하오.'}]},
          {text: '춘향은 퇴기 월매의 딸이니 당연히 명부에 올라 있소. 3년 전에 올린 이름이오.', cards: [{q: '춘향이 스스로 이름을 올렸나요?', a: '그, 그건… 어미가 그랬으니 딸도 그런 것이지.', mood: 'sweat'}]},
          {text: '명부의 이름은 모두 관아의 먹으로 쓴 것이오. 춘향의 이름도 3년 전 그날, 같은 먹으로 썼소.', cards: [{q: '왜 춘향의 이름만 줄 사이에 끼어 있나요?', a: '자, 자리가 모자라서 그리 쓴 것이오.', mood: 'sweat'}]},
          {text: '관아에서는 먹 말고 다른 것으로 글씨를 쓰지 않소. 검정 물 따위는 본 적도 없소.', cards: [{q: '요즘 관아에 먹이 넉넉한가요?', a: '넉넉하고말고. 떨어진 적이 없소.', mood: 'sweat'}]},
          {text: '그러니 명부에 손댄 사람은 아무도 없소.', cards: [{q: '사또께서 명부를 보자고 하신 적이 있나요?', a: '그, 그런 것까지 말해야 하오?', mood: 'sweat'}]}
        ],
        solve: {evidence: 'chroma', statements: [2], alt: [{evidence: 'dye', statements: [3]}], near: [
          {evidence: 'roster', text: '춘향의 이름이 끼어 있고 빛깔이 달라 보이는 것은 좋은 눈이에요. 하지만 눈으로 본 것만으로는 이방이 “같은 먹이오” 하고 맞설 거예요. 실험으로 확인한 기록을 내밀어 보세요.'},
          {evidence: 'dye', statements: [2], text: '이방이 검정 물을 산 것은 맞아요. 그 증거는 「검정 물은 본 적도 없다」는 말에 꼭 맞아요.'},
          {evidence: 'chroma', statements: [3, 4], text: '실험 기록은 꼭 필요해요. 이방이 춘향의 이름을 「무엇으로 썼다」고 말한 증언에 내밀어 보세요.'}
        ]},
        hints: ['이방은 춘향의 이름을 무엇으로 썼다고 했나요?', '방금 한 실험에서, 춘향의 이름은 관아의 먹과 같은 결과가 나왔나요?'],
        wrong: '이방의 말 가운데 실험이나 기록으로 확인할 수 있는 것을 찾아보세요.',
        success: [
          L('baleum', '번짐 실험에서 다른 이름들은 그대로였지만, 춘향의 이름만 세 가지 색으로 갈라졌습니다. 관아의 먹으로 쓴 것이 아닙니다!', 'stern', {shout: true}),
          L('ibang', '그, 그건… 이름이 흐려져서 검정 물로 덧썼을 뿐이오. 이름은 3년 전부터 있었소!', 'sweat'),
          L('byeon', '그렇지! 그리고 무엇보다, 춘향을 가둔 것은 판결문에 따른 일이오.', 'stern'),
          L('wonnim', '판결문이라. 형방이 언제, 어디에서 쓴 것이오?', 'normal', {words: ['판결문', '형방']}),
          L('narr', '그때 방청석에서 낯익은 아이가 손을 번쩍 들었습니다.'),
          L('baram', '원님! 역참의 바람이예요. 감영까지의 길이라면 제가 잘 알아요. 간 거리 나누기 걸린 시간!', 'happy', {words: ['감영', '속력']})
        ]
      },
      byeon1: {
        who: 'byeon', title: '사또의 첫 번째 말 · 판결문이 있다',
        statements: [
          {text: '나는 남원 부사 변학도요. 이 고을의 일은 내가 정하오.', cards: [{q: '남원에 온 지 얼마나 되셨나요?', a: '닷새 되었소. 오자마자 고을의 기강부터 잡았지.'}]},
          {text: '춘향을 가둔 것은 제멋대로 한 일이 아니오. 여기 판결문이 있소.', cards: [{q: '판결문은 누가 썼나요?', a: '형방이 썼소. 내 도장도 찍었지.'}]},
          {text: '판결문은 5일 낮 3시에, 형방이 이 남원 관아에서 제 손으로 쓴 것이오.', cards: [{q: '형방은 지금 어디에 있나요?', a: '모, 몸이 아파 나오지 못했소.', mood: 'sweat'}]},
          {text: '형방은 그날 하루 종일 관아에 있었소. 내가 옆에서 지켜보았으니 틀림없소.', cards: [{q: '형방이 감영에 간 일은 없나요?', a: '감영? 그, 그런 일은 없었소.', mood: 'sweat'}]},
          {text: '문서가 갖추어졌으니 정당한 일이오.', cards: [{q: '재판은 언제 열었나요?', a: '그건… 차차 말하리다.', mood: 'sweat'}]}
        ],
        solve: {evidence: ['speed', 'gamyeong'], statements: [2, 3], near: [
          {evidence: 'jail', text: '옥 일지에 판결문을 받지 못했다고 적힌 것은 중요해요. 하지만 사또는 “쓰기는 낮에 썼다”고 맞설 거예요. 형방이 그때 정말 그곳에서 쓸 수 있었는지 따져 보세요.'},
          {evidence: 'writ', text: '판결문에 적힌 때와 곳을 잘 봤어요. 그때 형방이 정말 그곳에 있을 수 있었는지 알려 주는 증거를 내밀어 보세요.'}
        ]},
        hints: ['판결문은 언제, 어디에서 썼다고 했나요?', '형방이 그날 낮에 어디에 있었는지, 그리고 방금 한 셈을 떠올려 보세요.'],
        wrong: '사또의 말 가운데 때와 곳을 따져 볼 수 있는 것을 찾아보세요.',
        success: [
          L('baleum', '형방은 5일 낮 12시에 150리 떨어진 감영에 있었습니다. 낮 3시에 남원에서 판결문을 쓰려면 한 시간에 50리를 가야 합니다. 관아의 말도 한 시간에 30리를 갑니다. 그 판결문은 그때 쓸 수 없었습니다!', 'stern', {shout: true}),
          L('byeon', '그, 그 문서는… 뒤에 날짜를 맞추어 갖춘 것뿐이오!', 'sweat'),
          L('byeon', '문서가 늦었다 한들 무슨 상관이오. 춘향은 본디 명부에 오른 몸, 내 명을 따라야 하는 사람이었소!', 'stern'),
          L('ibang', '그, 그렇습니다. 이름은 3년 전부터 있었고, 흐려져서 덧썼을 뿐입니다.', 'sweat'),
          L('hyangdan', '덧쓴 것이라고요? 나리, 그 검정 물이 언제 관아에 들어왔는지 떠올려 보세요. 증거 두 개를 함께 내밀 수 있어요!')
        ]
      },
      byeon2: {
        who: 'byeon', title: '사또의 두 번째 말 · 이름은 본디 있었다',
        statements: [
          {text: '명부를 보시오. 춘향의 이름이 3년 전 줄에 또렷이 있소.', cards: [{q: '3년 전에는 사또께서 남원에 계셨나요?', a: '아니오. 닷새 전에 왔다 하지 않았소.'}]},
          {text: '이방이 흐려진 글씨 위에 검정 물로 덧썼다 해도, 이름은 본디 그 자리에 있었소.', cards: [{q: '덧쓰기 전의 글씨를 보셨나요?', a: '보, 보지는 못했소. 이방이 그리 말했소.', mood: 'sweat'}]},
          {text: '춘향의 이름은 춘향이 옥에 들어가기 훨씬 전부터 명부에 있었소.', cards: [{q: '춘향은 언제 옥에 들어갔나요?', a: '5일 해 질 녘이오. 그건 누구나 아는 일이오.'}]},
          {text: '그러니 춘향은 내 명을 따라야 했고, 거역했으니 가둔 것이오.', cards: [{q: '명부에 이름이 없었다면요?', a: '그, 그런 일은 생각해 본 적 없소.', mood: 'sweat'}]},
          {text: '앞뒤가 이렇게 분명한데 무엇을 더 따지겠소.', cards: [{q: '명부를 처음 보신 것은 언제인가요?', a: '6일… 아, 아니, 오자마자 보았소!', mood: 'sweat'}]}
        ],
        solve: {combo: ['chroma', 'dye'], statements: [1, 2], near: [
          {combo: ['roster', 'dye'], text: '명부를 눈으로 본 것만으로는 그 이름을 무엇으로 썼는지 말하기 어려워요. 실험으로 확인한 기록을 염색집 장부와 함께 놓아 보세요.'},
          {combo: ['chroma', 'jail'], text: '춘향이 갇힌 날을 따진 것은 좋아요. 그런데 그 검정 물이 언제 관아에 들어왔는지 알려 주는 기록이 함께 있어야 해요.'},
          {combo: ['roster', 'chroma'], text: '춘향의 이름을 검정 물로 썼다는 것은 알 수 있어요. 그 검정 물이 언제 관아에 들어왔는지 알려 주는 기록을 함께 놓아 보세요.'}
        ]},
        hints: ['사또는 이름이 「언제부터」 있었다고 하나요?', '그 이름을 무엇으로 썼는지 알려 주는 기록과, 그것이 언제 관아에 들어왔는지 알려 주는 기록을 함께 내밀어 보세요.'],
        wrong: '이름을 무엇으로 썼는지, 그리고 그것이 언제부터 관아에 있었는지를 함께 보여 주어야 해요.',
        success: [
          L('baleum', '춘향의 이름은 염색집의 검정 물로 쓰였고, 그 밑에 먹 글씨는 없었습니다. 덧쓴 것이 아닙니다. 그리고 그 검정 물은 6일 아침에야 처음 관아에 들어왔습니다. 춘향이 갇힌 것은 5일입니다. 이름은 춘향을 가둔 뒤에 써넣은 것입니다!', 'stern', {shout: true}),
          L('ibang', '…사또께서 6일 아침에 저를 부르셨습니다. “춘향을 가둔 까닭을 만들어라” 하셨지요. 마침 먹이 떨어져 검정 물로 썼습니다. 죄송합니다.', 'sad'),
          L('baleum', '이방의 말을 그대로 기록해 두겠습니다.'),
          L('byeon', '이, 이방이 제 살길 찾으려 꾸며 대는 말이오! 내 말을 마저 들으시오!', 'stern')
        ]
      },
      byeon3: {
        who: 'byeon', title: '사또의 세 번째 말 · 내 명이 곧 법이다',
        statements: [
          {text: '춘향은 내 명을 전해 듣고 무례하게 굴었소. 그것만으로도 죄요.', cards: [{q: '무례했다는 것은 누구에게 들으셨나요?', a: '사령에게… 아니, 누구에게 들었든 그렇소!', mood: 'sweat'}]},
          {text: '판결문이 늦었을 뿐, 가두기 전에 대청에서 재판은 열었소. 춘향을 불러 묻고 따졌소.', cards: [{q: '그 재판을 본 사람이 있나요?', a: '그, 그야… 다들 바빠서.', mood: 'sweat'}]},
          {text: '명부의 일은 이방이 제멋대로 한 짓이오. 나는 시킨 적도 없고 모르는 일이오.', cards: [{q: '이방은 사또께서 시켰다고 하는데요?', a: '아랫것의 말을 믿으시오, 부사의 말을 믿으시오!'}]},
          {text: '고을의 수령이 명하면 백성은 따르는 것이 도리요. 까닭을 댈 것도 없소.', cards: [{q: '수령의 명이면 무엇이든 따라야 하나요?', a: '그렇소! 내 명이 곧 법이오.'}]},
          {text: '그러니 나는 잘못이 없소.', cards: [{q: '춘향에게 하실 말씀은 없나요?', a: '……', mood: 'sweat'}]}
        ],
        solve: {evidence: ['reply', 'sasay'], statements: [0], alt: [
          {evidence: 'jail', statements: [1]},
          {evidence: 'confess', statements: [2]}
        ], near: [
          {evidence: 'speed', statements: [1], text: '판결문을 그때 쓸 수 없었다는 것은 이미 밝혔어요. 이번에 사또는 「재판은 열었다」고 해요. 춘향이 옥에 들어온 날의 기록을 살펴보세요.'},
          {evidence: 'writ', statements: [1], text: '판결문은 뒤에 꾸민 것임을 이미 밝혔어요. 이번에 사또는 「재판은 열었다」고 해요. 춘향이 옥에 들어온 날의 기록을 살펴보세요.'},
          {evidence: 'dye', statements: [2], text: '검정 물을 산 사람은 이방이에요. 사또는 그래서 「이방이 제멋대로 했다」고 하지요. 누가 시켰는지 알려 주는 증거를 내밀어 보세요.'}
        ]},
        hints: ['사또의 말은 하나하나가 이미 밝힌 사실과 어긋나요. 어느 것이든 하나를 골라 보세요.', '무례했다는 말, 재판을 열었다는 말, 시킨 적 없다는 말. 저마다 맞서는 기록과 말이 있어요.'],
        wrong: '사또의 말 하나를 고르고, 그 말과 꼭 맞서는 증거를 내밀어 보세요.',
        success: [
          L('baleum', '춘향은 공손한 글로 거절했고, 사령은 “무례했다고 말하라”는 명을 받았습니다. 옥 일지에는 재판이 열리지 않았고 사또께서 말로 이르셨다고 적혀 있습니다. 이방은 사또께서 시키셨다고 말했습니다!', 'stern', {shout: true}),
          L('byeon', '으으… 수, 수령의 명이면 따르는 것이 도리라 하지 않았소!', 'shock'),
          L('wonnim', '수령의 명이라도 법과 절차를 벗어나면 따를 까닭이 없소. 사람을 가두려면 죄목을 밝히고, 불러서 묻고, 문서를 갖추어야 하오.', 'stern'),
          L('wonnim', '변호인. 이 일을 시킨 이를 짚고, 그 근거를 대 보시오.', 'stern')
        ]
      }
    },
    custom: {chroma: CHROMA, road: ROAD},
    stages: [
      {type: 'talk', chapter: '마지막 의뢰', lines: [
        L('narr', '암행어사가 출두한 남원 관아. 옥에 갇혀 있던 춘향이 마침내 재판을 받게 되었습니다.', 'normal', {fx: 'drum'}),
        L('mongryong', '나는 어사 이몽룡이오. 허나 나는 춘향과 약속한 사이요. 얽힌 사람이 재판을 맡으면 공정하다 할 수 없으니, 이웃 고을 원님께 재판을 부탁드렸소.', 'normal', {words: ['암행어사']}),
        L('wonnim', '맡겠소. 누구의 편도 아닌 눈으로 듣겠소.'),
        L('byeon', '흥! 춘향은 기생 명부에 오른 몸으로 관의 명을 거역했소. 가둔 것은 마땅한 일이오.', 'stern', {words: ['명부']}),
        L('chunhyang', '저는 명부에 이름을 올린 적이 없습니다. 약속한 사람이 있어 공손히 거절했을 뿐입니다.', 'sad'),
        L('hyangdan', '바름 나리! 잔칫상 사건 때처럼, 이번에도 아씨를 꼭 도와주세요!', 'sad'),
        L('baleum', '나바름입니다. 춘향의 말을 대신 전하겠습니다. 지금까지 배운 것을 모두 써서 따져 보겠습니다.'),
        L('wonnim', '이번 재판은 가장 까다로울 것이오. 증거로 말하시오.', 'stern', {words: ['증거']}),
        L('hyangdan', '일곱 곳을 둘러봐요. 기력 엽전은 세 닢이에요. 증거 두 개를 함께 내밀어야 할 때도 있어요!')
      ]},
      {type: 'investigate', chapter: '일곱 곳의 단서', title: '춘향은 왜 갇혔을까요?'},
      {type: 'talk', chapter: '사령의 증언', lines: [
        L('narr', '벙거지를 눌러쓴 사령 번쇠가 사또의 눈치를 살피며 증인석에 섰습니다.'),
        L('saryeong', '소, 소인은 본 대로만 말하겠소.', 'sweat'),
        L('hyangdan', '증언을 넘겨 보고, 이상한 말에 맞는 증거를 내밀어 보세요. 말끼리 어긋나면 두 증언을 맞대 보세요.', 'normal', {words: ['증언', '모순']})
      ]},
      {type: 'cross', id: 'saryeong', chapter: '공손한 글', gain: 'sasay'},
      {type: 'chroma', chapter: '향단이의 번짐 실험', gain: 'chroma', after: [
        L('hyangdan', '검은 글씨도 다 같은 검정이 아니었어요! 춘향 아씨의 이름만 다른 것으로 썼어요.', 'happy'),
        L('baleum', '번짐 실험 기록을 증거로 남기겠습니다. 명부를 지키는 이방의 말을 들어 보겠습니다.'),
        L('narr', '붓을 귀에 꽂은 이방이 명부를 끌어안고 증인석에 섰습니다.')
      ]},
      {type: 'cross', id: 'ibang', chapter: '같은 먹, 다른 먹'},
      {type: 'road', chapter: '감영에서 남원까지', gain: 'speed', after: [
        L('baram', '한 시간에 50리! 관아의 말로도 못 가는 길이에요.', 'happy'),
        L('baleum', '길 셈 기록을 증거로 남기겠습니다.'),
        L('byeon', '아이들 셈으로 부사를 몰아세우다니. 내 말부터 들으시오!', 'stern')
      ]},
      {type: 'cross', id: 'byeon1', chapter: '사또의 첫 번째 말'},
      {type: 'cross', id: 'byeon2', chapter: '사또의 두 번째 말', gain: 'confess'},
      {type: 'cross', id: 'byeon3', chapter: '사또의 세 번째 말'},
      {type: 'accuse', chapter: '진범 지목', ...ACCUSE, after: [
        L('baleum', '변학도는 재판도 없이 춘향을 가두었습니다. 그리고 가둔 까닭을 만들려고 명부에 이름을 써넣게 하고, 판결문을 뒤에 꾸미고, 사령에게 거짓을 말하게 했습니다.', 'stern'),
        L('byeon', '…내 명이면 무엇이든 되는 줄 알았소.', 'sad'),
        L('chunhyang', '저는 그저, 제 이름이 제 것이기를 바랐을 뿐입니다.'),
        L('narr', '방청석에서 손뼉 소리가 터졌습니다. 낯익은 얼굴들이었습니다.'),
        L('heungbu', '바름 나리 덕에 누명을 벗은 사람들이 여기 다 모였소!', 'happy'),
        L('kongjwi', '섞인 것도, 엉킨 말도 나누면 보인다는 걸 저도 배웠어요.', 'happy'),
        L('wonnim', '이제 판결을 내리겠소.', 'stern')
      ]},
      {type: 'verdict', chapter: '증거가 이끄는 판결', ...VERDICT},
      {type: 'diary', chapter: '나의 판관 일기'},
      {type: 'end', chapter: '열린 옥문'}
    ],
    landing: {
      intro: '명부에 이름이 있으니 명을 따르라 한다.<br>춘향은 그 이름을 올린 적이 없다는데,<br><strong>배운 것을 모두 써서 이름을 되찾아 주세요.</strong>',
      start: '춘향의 사건 맡기',
      backdrop: 'court',
      people: [['chunhyang', 'sad'], ['byeon', 'stern'], ['baleum', 'normal']],
      bubble: '이름 두 글자에 담긴 진실을 밝히겠소!',
      label: ['춘향전의 본 사건', '지워지지 않는 이름'],
      steps: ['단서 수집', '번짐 실험과 길 셈', '진범 지목'],
      credit: '초등 6학년부터 · 어려움 · 읽는 속도에 따라 약 50–60분 · 진행 자동 저장'
    },
    diary: {
      title: '열 번의 재판을 마치며',
      intro: '가장 마음에 드는 생각을 골라 주세요. 여기에는 정답이 없어요.',
      choices: [
        '높은 자리에 있어도 법과 절차를 지켜야 해요.',
        '시켜서 하는 일이라도, 잘못된 일이면 “안 됩니다” 하고 말할 용기가 필요해요.',
        '억울한 사람을 돕는 길은 큰 목소리가 아니라 증거를 찾는 것이에요.'
      ],
      placeholder: '예: 열 번의 재판에서 가장 기억에 남는 것은…'
    },
    end: {
      backdrop: 'gwanghallu',
      people: [['chunhyang', 'happy'], ['mongryong', 'happy'], ['hyangdan', 'happy']],
      quote: '“될성부른 나무는 떡잎부터 알아본다지요. 나리는 떡잎부터 변호인이었어요.”',
      kicker: '마지막 사건 해결',
      title: '이름을 되찾고<br><em>옥문이 열렸어요.</em>',
      text: '열 번의 재판, 열 번의 무죄.<br>섞인 것은 나누고, 먼 길은 셈하고, 달과 그림자에게 물었습니다. 나바름의 다음 의뢰는 어디에서 올까요?',
      badges: ['번짐 실험가', '길 셈 고수', '열 사건 해결']
    },
    guide: `<h3>제10화 · 교사·보호자 안내</h3><p><b>춘향전 × 색을 나누는 번짐 실험 × 법과 절차</b><br>초등 6학년부터, 약 50–60분을 예상한 마지막 이야기입니다. <b>어려운 단계</b>입니다. 1화가 춘향전의 인물로 꾸민 새 사건이었다면, 10화는 춘향전의 본 사건을 다룹니다. 원작의 “수청” 요구는 “관아에 들어와 사또의 시중을 들라는 명”으로 바꾸었고, 옥에서의 고초는 그리지 않았습니다. 초점은 “높은 자리의 힘을 법과 절차 밖에서 쓴 것”에 있습니다.</p><p><b>원작과 다른 점</b><br>춘향의 신분은 판본마다 다르게 그려집니다. 이 게임은 어느 쪽이 옳다고 정하지 않고, “명부의 이름이 언제, 무엇으로 쓰였는가”를 따집니다. 명부에 이름을 뒤늦게 써넣었다는 것, 판결문을 뒤에 꾸몄다는 것, 이몽룡이 재판에서 물러나 이웃 고을 원님이 맡는다는 것은 이 게임에서 새로 꾸민 것입니다. 사령 번쇠와 지난 화의 인물들도 원작에는 없습니다.</p><p><b>함께 생각할 질문</b></p><ol><li>이몽룡은 왜 스스로 재판에서 물러났을까요?</li><li>이방과 사령은 시켜서 한 일인데도 책임이 있을까요? 3화의 팥쥐, 7화의 일꾼들과 견주어 보세요.</li><li>“내 명이 곧 법이다”라는 말은 왜 옳지 않을까요?</li></ol><details class="teacher-spoilers"><summary>교사용 진행·정답 보기</summary><p>사령: 증언 2와 4 맞대기, 또는 증언 2나 5 + 춘향의 답글.<br>번짐 실험: 염색집의 검정 물 / 다른 이름들과 다른 것으로 썼다.<br>이방: 증언 3 + 번짐 실험 기록, 또는 증언 4 + 염색집 장부.<br>길 셈: 3시간, 한 시간에 50리, 말을 타도 올 수 없었다.<br>사또 첫 번째: 증언 3 또는 4 + 길 셈 기록이나 감영 기록.<br>사또 두 번째: 증언 2 또는 3 + <b>번짐 실험 기록과 염색집 장부를 함께</b>.<br>사또 세 번째: 증언 1 + 춘향의 답글이나 사령의 말 / 증언 2 + 옥 일지 / 증언 3 + 이방의 말. 어느 것이든 하나면 됩니다.<br>진범: 변학도. 근거는 이방의 말, 사령의 말, 옥 일지, 판결문 가운데 셋.<br>쓰이지 않는 증거: 옥가락지.</p></details><p><b>과학 표현의 범위</b><br>섞여 있는 색소가 물을 따라 이동하는 빠르기가 달라 나뉘는 현상(크로마토그래피)을 “번짐 실험”으로 다룹니다. 먹은 물에 녹지 않는 그을음 알갱이라 잘 번지지 않고, 수용성 색소를 섞은 검정은 색이 갈라집니다. 교실에서는 검정 수성 사인펜과 거름종이로 해 볼 수 있습니다. 조선 시대 염색집에서 이런 검정 물을 팔았다는 것은 이야기 속 설정입니다. 길 셈은 7화의 속력 계산을 다시 쓴 것입니다.</p><p><b>법과 역사 표현의 범위</b><br>조선 시대에도 수령이 함부로 벌을 주는 것을 막으려는 법이 있었지만, 이 게임의 재판 절차는 아이들이 이해하기 쉽게 꾸민 것입니다. 수업에 쓰실 때는 “옛날에는 꼭 이랬다”가 아니라 “이야기 속 재판”이라고 알려 주세요.</p><p class="muted">로그인 없이 사용하며 진행과 일기는 브라우저 안에만 저장됩니다. 화마다 진행 기록은 별개입니다.</p>`
  };
})();
