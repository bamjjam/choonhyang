'use strict';
// 제3화 · 콩쥐팥쥐전 — 모래 섞인 잔치 쌀
// 콩쥐팥쥐전의 인물을 빌려 새로 꾸민 사건입니다. 무게와 견본의 관찰 결과는 이야기 속 자료입니다.
// 자료 형식은 docs/episode-format.md, 사건 설계는 docs/episode3.md 를 보세요.
window.CASE = (() => {
  const L = (who, text, mood = 'normal', extra = {}) => ({who, text, mood, ...extra});

  // ---------- 알갱이 그림 ----------
  // 섞여 있을 때는 본 대로("검은 가루"), 따로 나뉜 뒤에는 밝혀진 이름("쇳가루")으로 부릅니다.
  const PARTS = {
    rice: {seen: '쌀알', name: '쌀', why: '알갱이가 커서 체 위에 남았어요.'},
    sand: {seen: '모래 알갱이', name: '모래', why: '체를 빠져나오고, 지남철에 붙지 않고, 물에 가라앉아요.'},
    iron: {seen: '검은 가루', name: '쇳가루', why: '지남철에 붙었어요. 쇠붙이예요.'},
    char: {seen: '까만 부스러기', name: '숯 부스러기', why: '가벼워서 물에 떴어요.'}
  };
  const dots = (n, fn) => Array.from({length: n}, (_, i) => fn(i)).join('');
  const at = (i, n, r) => [30 + r * Math.cos(i * 2.4 + n), 31 + r * Math.sin(i * 2.4 + n) * .8];
  function grain(k) {
    const body = {
      rice: dots(9, i => { const [x, y] = at(i, 1, 6 + i * 2.1); return `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="6.5" ry="3" transform="rotate(${i * 47} ${x.toFixed(1)} ${y.toFixed(1)})" fill="#fbf7ea" stroke="#b9ab8a" stroke-width="1"/>`; }),
      sand: dots(16, i => { const [x, y] = at(i, 2, 4 + i * 1.3); return `<path d="M${(x - 2.4).toFixed(1)} ${y.toFixed(1)}l2.2-2.6l2.8 1.4l-.8 3.2l-3 .6z" fill="${i % 3 ? '#c9a66b' : '#a98652'}" stroke="#8a6d43" stroke-width=".6"/>`; }),
      iron: dots(22, i => { const [x, y] = at(i, 3, 3 + i * .95); return `<path d="M${(x - 1.6).toFixed(1)} ${y.toFixed(1)}l1.4-1.8l2 .8l-.6 2.2l-2 .2z" fill="${i % 4 ? '#2f3134' : '#6f7780'}"/>`; }),
      char: dots(8, i => { const [x, y] = at(i, 4, 6 + i * 2.2); return `<path d="M${(x - 4).toFixed(1)} ${(y - 1).toFixed(1)}l3-3.4l4.6 1.2l1 4l-4.2 2.6l-3.6-1.6z" fill="#27231f" stroke="#57504a" stroke-width=".8"/>`; })
    }[k];
    return `<svg viewBox="0 0 60 60" aria-hidden="true"><circle cx="30" cy="31" r="27" fill="#efe4c8" stroke="#cdb98f"/>${body}</svg>`;
  }
  /** 자루 속을 본 대로 그린 그림 */
  function sackArt() {
    // 해바라기 씨처럼 고르게 흩어 놓습니다. (i 번째 알갱이의 자리)
    const P = i => { const r = Math.sqrt((i + .5) / 141), t = i * 2.39996; return [(320 + 250 * r * Math.cos(t)).toFixed(1), (154 + 92 * r * Math.sin(t)).toFixed(1)]; };
    const kind = i => i % 16 === 7 ? 'char' : i % 7 === 3 ? 'sand' : i % 4 === 1 ? 'iron' : 'rice';
    const draw = {
      rice: (x, y, i) => `<ellipse cx="${x}" cy="${y}" rx="11" ry="5" transform="rotate(${i * 37} ${x} ${y})" fill="#fbf7ea" stroke="#b9ab8a"/>`,
      sand: (x, y, i) => `<path d="M${x} ${y}l4-5l5 3l-1 6l-6 1z" fill="${i % 2 ? '#c9a66b' : '#a98652'}" stroke="#8a6d43" stroke-width=".8"/>`,
      iron: (x, y, i) => `<path d="M${x} ${y}l2-3l3 1l-1 4l-3 0zm7 5l2-2l2 1l-1 3z" fill="${i % 8 === 1 ? '#70787f' : '#2f3134'}"/>`,
      char: (x, y) => `<path d="M${x} ${y}l5-6l8 2l2 7l-7 5l-7-3z" fill="#27231f" stroke="#57504a"/>`
    };
    return `<svg class="sack-art" viewBox="0 0 640 300" role="img" aria-label="자루에서 덜어 낸 쌀. 흰 쌀알 사이에 모래 알갱이, 검은 가루, 까만 부스러기가 섞여 있다."><rect width="640" height="300" rx="14" fill="#eae1cc"/><ellipse cx="320" cy="158" rx="292" ry="120" fill="#d9c7a0" stroke="#b39c6f" stroke-width="3"/><ellipse cx="320" cy="154" rx="272" ry="106" fill="#e9dcba"/>${dots(141, i => { const [x, y] = P(i); return draw[kind(i)](x, y, i); })}<text x="320" y="292" text-anchor="middle" fill="#776b53" font-size="14">자루에서 한 줌 덜어 낸 모습을 본 대로 그린 그림</text></svg>`;
  }

  // ---------- 증거 그림 ----------
  const VIEW = {
    bowl: () => `<div class="observation-heading"><span>잔칫날 낮 · 잔치 마당</span><b>원님 밥그릇에서 나온 것</b></div><div class="sep-parts sep-parts-wide"><span class="sep-part">${grain('sand')}<small>모래 알갱이</small></span><span class="sep-part">${grain('iron')}<small>검은 가루</small></span></div><p class="gl">밥에 무엇이 들어 있었는지는 알 수 있어요. 하지만 언제, 어디에서 들어갔는지는 이것만으로 알 수 없어요.</p>`,
    sack: () => `<div class="observation-heading"><span>잔칫날 낮 · 잔치 부엌</span><b>콩쥐네 자루 속을 살핀 그림</b></div>${sackArt()}<p class="gl"><b>쌀알</b><br>단단하고 보송보송해요. 물에 불은 쌀알이 없고, 자루 천에도 물 얼룩이 없어요.</p><p class="gl"><b>섞인 것</b><br>모가 난 모래 알갱이, 검고 반짝이는 가루, 까만 부스러기가 보여요.</p>`,
    ledger: () => `<article class="evidence-document ledger-doc"><span class="doc-overline">방앗간 장부 · 잔치 전날 낮</span><h3>방아 찧은 기록</h3><div class="ledger-grid"><span>맡긴 이</span><strong>콩쥐</strong><span>찧은 쌀 무게</span><strong>20근</strong><span>단 저울</span><strong>방앗간 저울</strong></div><p class="doc-copy">“키질을 마친 쌀을 달아 보니<br>꼭 스무 근.”</p><p class="doc-signer">적은 이 · 방앗간지기</p></article>`,
    receipt: () => `<article class="evidence-document ledger-doc"><span class="doc-overline">관아 곳간 · 잔칫날 아침</span><h3>잔치 쌀 받은 기록</h3><div class="ledger-grid"><span>가져온 이</span><strong>오씨 부인</strong><span>자루 무게</span><strong>23근</strong><span>쌀값</span><strong>한 근에 엽전 2닢</strong><span>내준 돈</span><strong>46닢</strong></div><p class="doc-copy">“쌀값은 단 무게대로 치른다.”</p><p class="doc-signer">관아 저울과 방앗간 저울은 같은 추로 맞추어 씀</p></article>`,
    key: () => `<article class="evidence-document note-doc"><span class="doc-overline">콩쥐네 광 · 문을 살핀 기록</span><h3>광 자물쇠와 열쇠</h3><p class="doc-copy">자물쇠는 <b>하나</b>, 열쇠도 <b>하나</b>.<br>열쇠는 오씨 부인이 허리춤에 차고 다님.<br>자물쇠와 문에 <b>억지로 연 흔적이 없음.</b><br>광에는 창이 없음.</p><p class="doc-signer">살핀 이 · 나바름</p></article>`,
    river: () => `<div class="observation-heading"><span>냇가 · 두꺼비가 떠 온 견본</span><b>냇가 모래</b></div><div class="sep-parts sep-parts-wide"><span class="sep-part">${grain('sand')}<small>둥글둥글한 모래</small></span></div><p class="gl">밝은 빛깔이고 물에 젖어 있어요. 알갱이가 물살에 닳아 둥글둥글해요.<br>지남철을 대어도 붙는 것이 없고, 까만 부스러기도 없어요.</p>`,
    forge: () => `<div class="observation-heading"><span>대장간 마당 · 두꺼비가 떠 온 견본</span><b>대장간 마당 흙</b></div><div class="sep-parts sep-parts-wide"><span class="sep-part">${grain('sand')}<small>모가 난 모래</small></span><span class="sep-part">${grain('iron')}<small>검은 가루</small></span><span class="sep-part">${grain('char')}<small>까만 부스러기</small></span></div><p class="gl">모가 난 모래에 검은 가루와 까만 부스러기가 섞여 있어요.<br>지남철을 대면 검은 가루가 붙어요.</p>`
  };

  // ---------- 분리 실험 (이 화만의 퍼즐) ----------
  const TOOLS = {sieve: '체로 거르기', magnet: '지남철 대기', water: '물에 넣기'};
  const rest = (pile, k) => pile.filter(x => x !== k);
  function useTool(pile, tool) {
    if (tool === 'sieve') {
      if (!pile.includes('rice')) return {msg: '남은 알갱이는 모두 체의 구멍보다 작아서 함께 빠져나왔어요. 다른 성질을 써 볼까요?'};
      return {out: [['rice'], rest(pile, 'rice')], msg: '쌀알은 체의 구멍보다 커서 위에 남고, 작은 알갱이들은 아래로 빠졌어요. 알갱이의 크기가 달라서 나눌 수 있었어요.'};
    }
    if (tool === 'magnet') {
      if (!pile.includes('iron')) return {msg: '지남철에 붙는 것이 없어요. 다른 방법을 써 볼까요?'};
      return {out: [['iron'], rest(pile, 'iron')], msg: '검은 가루만 지남철에 붙어 올라왔어요. 쇠붙이, 곧 쇳가루예요!'};
    }
    if (pile.includes('rice')) return {msg: '잔치에 낼 쌀이 젖으면 안 돼요. 쌀부터 따로 골라낼 방법을 찾아봐요.'};
    if (!pile.includes('char')) return {msg: '모두 물에 가라앉았어요. 물로는 더 나눌 수 없어요.'};
    return {out: [['char'], rest(pile, 'char')], msg: '까만 부스러기만 물에 둥둥 떴어요. 가벼운 숯 부스러기예요! 나머지는 가라앉았어요.'};
  }
  const SEPARATE = {
    auto: () => [['sep-tool', '0|sieve'], ['sep-tool', '1|magnet'], ['sep-tool', '2|water'], ['sep-next', '']],
    draw(s, api) {
      const p = api.P();
      if (!Array.isArray(p.piles)) { p.piles = [['rice', 'sand', 'iron', 'char']]; p.used = 0; }
      const done = p.piles.every(x => x.length === 1);
      api.$('#view').innerHTML = `<section class="board puzzle-board"><div class="section-kicker">두꺼비의 분리 실험 · 도구 ${p.used}번 사용</div><h2>자루 속에 섞인 것을 나누어라</h2><p class="muted">쌀자루에서 한 줌을 덜어 냈어요. 도구를 골라, 섞인 것을 <b>한 가지씩 따로</b> 나누어 보세요. 틀려도 괜찮아요. 여러 번 해 볼 수 있어요.</p>
        <div class="sep-piles">${p.piles.map((pile, i) => pile.length === 1
          ? `<article class="sep-pile pure"><header><b>${PARTS[pile[0]].name}</b><i>✓ 나누기 끝</i></header><div class="sep-parts"><span class="sep-part">${grain(pile[0])}</span><p class="sep-why">${PARTS[pile[0]].why}</p></div></article>`
          : `<article class="sep-pile"><header><b>섞인 더미</b><span>${pile.length}가지가 섞여 있어요</span></header><div class="sep-parts">${pile.map(k => `<span class="sep-part">${grain(k)}<small>${PARTS[k].seen}</small></span>`).join('')}</div><div class="sep-tools">${Object.entries(TOOLS).map(([t, name]) => api.action('sep-tool', name, i + '|' + t, 'seal blue sm')).join('')}</div></article>`).join('')}</div>
        ${p.msg ? `<p class="feedback" role="status">${api.esc(p.msg)}</p>` : ''}
        ${done ? `<div class="lab-explanation" role="status"><span class="result-seal">분리 성공</span><h3>네 가지로 나누었어요</h3><p>쌀은 알갱이가 커서 체 위에 남았고, 쇳가루는 지남철에 붙었고, 숯 부스러기는 물에 떴어요. 끝까지 남은 것이 모래예요.</p><p class="muted">섞여 있어도 저마다의 성질은 변하지 않아요. 그래서 성질의 차이를 이용하면 다시 나눌 수 있어요.</p>${api.action('sep-next', '나눈 것을 들고 법정으로 →')}</div>`
          : `<div class="row end">${api.action('sep-hint', '도움말', '', 'seal')}${api.action('sep-reset', '처음부터 다시', '', 'seal', !p.used)}</div>`}
        <p class="science-note">체는 알갱이의 크기, 지남철은 쇠붙이를 끌어당기는 성질, 물은 뜨고 가라앉는 성질을 이용해요.</p></section>`;
    },
    act(a, v, s, api) {
      const p = api.P();
      if (a === 'sep-tool') {
        const [i, tool] = v.split('|'), pile = p.piles[+i];
        if (!pile || pile.length < 2 || !TOOLS[tool]) return;
        const r = useTool(pile, tool);
        p.used++; p.msg = r.msg;
        if (r.out) p.piles.splice(+i, 1, ...r.out);
        api.save(); this.draw(s, api);
      }
      if (a === 'sep-reset') { p.piles = null; p.msg = ''; api.save(); this.draw(s, api); }
      if (a === 'sep-hint') api.notice('성질이 다른 것부터', '가장 큰 알갱이는 무엇일까요? 크기가 다르면 체로 나눌 수 있어요. 쇠붙이는 지남철에 붙고, 가벼운 것은 물에 떠요.');
      if (a === 'sep-next' && p.piles.every(x => x.length === 1)) api.done();
    }
  };

  // ---------- 흙의 고향 찾기 ----------
  const SOILS = [
    ['자루 속에 섞인 것', '모가 남', '있음', '있음', '없음'],
    ['냇가 모래', '둥글둥글함', '없음', '없음', '없음'],
    ['방앗간 바닥 흙', '고운 흙먼지', '없음', '없음', '많음'],
    ['대장간 마당 흙', '모가 남', '있음', '있음', '없음']
  ];
  const SOURCE = {
    kicker: '견본 견주기',
    title: '이 흙은 어디에서 왔을까?',
    intro: '두꺼비가 세 곳의 흙을 한 줌씩 떠 왔어요. 자루 속에 섞인 것과 <b>같은 성질</b>을 가진 흙을 찾아보세요.',
    body: () => `<div class="tw"><table class="seat"><thead><tr><th scope="col">견본</th><th scope="col">알갱이 모양</th><th scope="col">지남철에 붙는 가루</th><th scope="col">물에 뜨는 숯</th><th scope="col">왕겨</th></tr></thead><tbody>${SOILS.map((r, i) => `<tr${i ? '' : ' class="soil-target"'}><th scope="row">${r[0]}</th>${r.slice(1).map(c => `<td${c === '있음' || c === '많음' ? ' class="sick"' : ''}>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div><p class="gl">왕겨는 벼의 겉껍질이에요. 방아를 찧는 방앗간 바닥에는 왕겨가 많이 떨어져 있어요.</p>`,
    question: '자루 속에 섞인 것은 어느 곳의 흙과 같을까요?',
    options: ['냇가', '방앗간 바닥', '대장간 마당'],
    check: i => i === 2 || ['냇가 모래는 알갱이가 둥글고, 지남철에 붙는 가루와 숯이 없어요. 네 가지 성질을 하나씩 견주어 보세요.', '방앗간 바닥에는 왕겨가 많은데, 자루 속에 섞인 것에는 왕겨가 없어요. 쇳가루와 숯도 살펴보세요.'][i]
  };

  // ---------- 늘어난 무게 ----------
  const WEIGHT = {
    kicker: '작은 수학 수사',
    title: '밤사이 늘어난 무게는?',
    intro: '같은 자루를 두 번 달았어요. 두 저울은 같은 추로 맞춘 저울이에요.',
    label: '늘어난 무게', unit: '근', max: 10, answer: 3,
    visual: control => `<div class="weigh"><div class="weigh-card"><span>방앗간 저울 · 잔치 전날 낮</span><b>20근</b><small>콩쥐가 찧은 쌀</small></div><div class="weigh-card"><span>관아 저울 · 잔칫날 아침</span><b>23근</b><small>오씨 부인이 가져온 자루</small></div><div class="weigh-card ask"><span>밤사이 늘어난 무게</span>${control}<small>23 − 20 = ?</small></div></div>`,
    wrong: '관아에서 단 무게에서 방앗간에서 단 무게를 빼 보세요. 23 − 20 은 얼마일까요?',
    hint: ['두 무게의 차이', '스물셋에서 스물을 빼면 얼마가 남을까요? 그만큼이 밤사이 자루에 더해진 무게예요.']
  };

  // ---------- 진짜 까닭 고르기 ----------
  const CAUSE = {
    kicker: '최종 추리',
    title: '쌀에 흙이 섞인 진짜 까닭은?',
    intro: '지금까지 확인한 증거와 <b>모두 맞는</b> 설명을 하나 골라 주세요.',
    body: () => `<div class="lab-common"><span>쌀알은 보송보송했다</span><span>방앗간 20근 → 관아 23근</span><span>섞인 것은 대장간 마당 흙</span><span>오씨 부인이 마당 흙을 담아 갔다</span><span>광 열쇠는 하나뿐</span></div>`,
    question: '원님께 어떻게 말씀드릴까요?',
    options: [
      '콩쥐가 냇가에서 쌀을 씻다가 모래가 들어갔다.',
      '방앗간에서 쌀을 찧을 때 바닥의 흙이 튀어 들어갔다.',
      '밤사이 도둑이 광에 들어와 자루에 흙을 넣었다.',
      '광 열쇠를 가진 사람이 대장간 마당 흙을 자루에 섞어 무게를 늘렸다.'
    ],
    check: i => i === 3 || [
      '쌀알은 보송보송했고, 섞인 것은 냇가 모래와 달랐어요. 다른 설명을 찾아보세요.',
      '방앗간에서 달았을 때는 스무 근이었어요. 무게는 그 뒤에 늘었지요. 방앗간 바닥 흙에는 쇳가루도 없었어요.',
      '열쇠는 하나뿐이고, 자물쇠에는 억지로 연 흔적이 없었어요. 도둑이 들어올 수 있었을까요?'
    ][i]
  };

  const VERDICT = {
    kicker: '사건 번호 003 · 최종 판결',
    stamp: '무죄',
    title: '콩쥐의 누명을 벗겼어요.',
    sub: '섞인 것을 나누어 보니, 흙이 온 곳과 섞은 사람이 보였어요.',
    cards: [
      {title: '관아의 판결 · 원님', who: 'wonnim', text: '콩쥐에게는 잘못이 없소. 오씨 부인은 더 받은 여섯 닢을 돌려주고, 콩쥐와 잔치 손님들에게 사과하시오. 그리고 관아 곳간의 쌀을 체로 쳐서 다시 고르는 일을 도우시오. 팥쥐와 무쇠 아재는 사실을 바로 말했으니, 이제라도 바로잡은 것을 참작하겠소.'},
      {modern: true, title: '오늘의 시선 · 한저울 판사', who: 'judge', text: '무게나 양을 속여 파는 일은 오늘날에도 잘못이에요. 그리고 “누가 그랬다더라”는 말만으로 사람을 벌해서는 안 돼요. 섞인 것을 나누고, 무게를 달고, 견본과 견주어 확인한 것이 콩쥐를 지켰습니다.'}
    ],
    strip: [['수학', '23 − 20 = 3근'], ['과학', '크기 · 지남철 · 물에 뜨기'], ['추리', '말과 말 맞대기']],
    note: '이야기 속 냇가 모래에는 지남철에 붙는 것이 없었어요. 실제 강모래에는 자석에 붙는 까만 모래(사철)가 조금 섞여 있기도 해요. 그래서 한 가지 성질만 보지 않고 여러 성질을 함께 견주었어요.',
    foot: '고전 인물을 활용해 만든 이야기 속 재판입니다.'
  };

  return {
    n: 3, classic: '콩쥐팥쥐전', title: '모래 섞인 잔치 쌀',
    helper: 'dukkeobi',
    court: 'court',
    rules: {pair: true},
    portraits: ['baleum', 'wonnim', 'kongjwi', 'patjwi', 'ossi', 'musoe', 'dukkeobi', 'judge'],
    art: {wonnim: 'wonnim-v3'},
    chars: {
      baleum: '나바름',
      wonnim: '고을 원님',
      kongjwi: '콩쥐',
      patjwi: '팥쥐',
      ossi: '오씨 부인',
      musoe: '무쇠 아재',
      dukkeobi: '두꺼비',
      judge: '한저울 판사',
      narr: ''
    },
    glossary: {
      '혼합물': '두 가지가 넘는 물질이 성질이 변하지 않은 채 섞여 있는 것이에요. 쌀에 모래가 섞인 것도 혼합물이에요.',
      '분리': '섞여 있는 것을 따로따로 나누는 일이에요.',
      '성질': '그 물질이 가진 특징이에요. 알갱이의 크기, 자석에 붙는지, 물에 뜨는지 등이 있어요.',
      '키질': '키라는 도구에 곡식을 담아 위아래로 흔들어서, 가벼운 껍질과 먼지를 날려 보내는 일이에요.',
      '증거': '어떤 일이 있었는지 확인하는 데 도움이 되는 물건이나 기록이에요.',
      '증언': '자기가 보고 들은 일을 법정에서 말하는 것이에요.',
      '모순': '앞에서 한 말과 뒤에서 한 말이 서로 맞지 않는 것이에요.',
      '지남철': '자석의 옛 이름이에요. 쇠붙이를 끌어당겨요.',
      '견본': '전체가 어떤지 알아보려고 조금 떼어 낸 것이에요.',
      '근': '옛날에 무게를 재던 단위예요. 이 이야기에서는 쌀 무게를 근으로 달아요.'
    },
    evidence: {
      bowl: {name: '밥그릇에서 나온 것', short: '원님 밥에서 나온 모래알과 검은 알갱이', icon: 'jar', view: VIEW.bowl},
      sack: {name: '자루 속 관찰 그림', short: '콩쥐네 쌀자루 속을 본 대로 그린 그림', icon: 'seed', view: VIEW.sack},
      ledger: {name: '방앗간 장부', short: '잔치 전날 낮, 찧은 쌀의 무게', icon: 'ledger', view: VIEW.ledger},
      receipt: {name: '관아 접수 기록', short: '잔칫날 아침, 관아에서 단 자루 무게', icon: 'order', view: VIEW.receipt},
      key: {name: '광 자물쇠와 열쇠', short: '콩쥐네 광의 문을 살핀 기록', icon: 'note', view: VIEW.key},
      river: {name: '냇가 모래 견본', short: '냇가에서 떠 온 모래 한 줌', icon: 'map', view: VIEW.river},
      forge: {name: '대장간 마당 흙 견본', short: '대장간 마당에서 떠 온 흙 한 줌', icon: 'map', view: VIEW.forge}
    },
    places: [
      {id: 'madang', name: '잔치 마당', art: 'madang', ev: 'bowl', who: 'dukkeobi', line: '꾸륵. 원님 밥그릇에서 나온 것들이에요. 모래알과 검은 알갱이가 보여요.'},
      {id: 'kitchen', name: '잔치 부엌', art: 'kitchen', ev: 'sack', who: 'baleum', line: '콩쥐네 자루를 열어 보았어. 쌀알과 섞인 것들을 본 대로 그려 두자.'},
      {id: 'mill', name: '방앗간', art: 'mill', ev: 'ledger', who: 'kongjwi', line: '잔치 전날 낮에 여기서 방아를 찧었어요. 방앗간지기 아저씨가 쌀 무게를 달아 적어 주셨어요.'},
      {id: 'office', name: '관아 곳간', art: 'office', ev: 'receipt', who: 'wonnim', line: '잔칫날 아침에 쌀을 받은 기록이오. 쌀값은 단 무게대로 치렀소.'},
      {id: 'home', name: '콩쥐네 광', art: 'gotgan', ev: 'key', who: 'kongjwi', line: '찧어 온 쌀자루는 저녁에 이 광에 넣었어요. 열쇠는 어머니만 가지고 계세요.'},
      {id: 'stream', name: '냇가', art: 'stream', ev: 'river', who: 'dukkeobi', line: '제가 사는 냇가예요. 모래를 한 줌 떠서 살펴봐요.'},
      {id: 'forge', name: '대장간 마당', art: 'forge', ev: 'forge', who: 'dukkeobi', line: '방앗간 바로 옆 대장간이에요. 마당 흙도 한 줌 떠 가요.'}
    ],
    witnesses: {
      patjwi: {
        who: 'patjwi', title: '첫 심문 · 다 봤다는 팥쥐',
        statements: [
          {text: '언니가 방앗간에서 쌀을 찧어 온 건 맞아요. 저는 옆에서 구경했고요.', cards: [{q: '쌀 찧는 일을 도왔나요?', a: '제가 왜요? 그런 건 언니가 하는 일이에요.'}]},
          {text: '그런데 언니는 그 쌀을 냇가로 가져가서 박박 씻었어요. 제가 똑똑히 봤다니까요!', cards: [{q: '냇가 어디에서 봤나요?', a: '어… 빨래터… 아니, 징검다리 쪽이었나? 아무튼 봤어요!', mood: 'sweat'}, {q: '잔치에 낼 쌀을 왜 씻었을까요?', a: '그, 그야 언니 마음이죠! 제가 어떻게 알아요.', mood: 'sweat'}]},
          {text: '물에 씻은 쌀을 그대로 자루에 퍼 담았어요. 물이 뚝뚝 떨어지는데도요.', cards: [{q: '그럼 자루도 젖었겠네요?', a: '그럼요! 흠뻑 젖었죠.'}]},
          {text: '그 자루를 묶어서 광에 넣었으니, 모래가 든 건 언니 탓이에요!', cards: [{q: '광에 넣는 것도 봤나요?', a: '그건… 어머니가 문을 잠그시는 걸 봤어요.'}]}
        ],
        solve: {evidence: 'sack', statements: [1, 2], near: [
          {evidence: 'river', text: '냇가 모래가 어떻게 생겼는지는 알 수 있어요. 하지만 쌀을 정말 씻었는지 알려면, 쌀을 직접 살펴본 증거가 필요해요.'},
          {evidence: 'bowl', text: '밥에 모래가 들어 있었던 것은 맞아요. 하지만 쌀을 씻었는지는 알 수 없어요. 쌀을 직접 살펴본 증거를 찾아보세요.'}
        ]},
        hints: ['팥쥐는 쌀이 물에 닿았다고 말해요. 물에 닿은 쌀은 어떻게 될까요?', '쌀을 직접 들여다본 증거가 있어요. 쌀알이 어떤 모습이었는지 떠올려 보세요.', '쌀을 씻었다는 증언 가운데 하나를 고르고, 자루 속을 살핀 증거를 내밀어 보세요.'],
        wrong: '팥쥐의 말 가운데 확인할 수 있는 것은 무엇일까요? 쌀이 물에 닿았는지 알 수 있는 증거를 찾아보세요.',
        success: [
          L('baleum', '자루 속 쌀알은 단단하고 보송보송했습니다. 물에 씻어 그대로 담았다면 쌀알이 불고, 자루에 물 얼룩이 남았겠지요!', 'stern', {shout: true}),
          L('patjwi', '어… 그, 그게… 씻는 걸 본 건 아닌 것 같기도 하고…', 'sweat'),
          L('patjwi', '그래도 언니는 냇가 옆길로 집에 왔어요! 그때 냇가 모래가 들어간 거예요!', 'stern'),
          L('dukkeobi', '꾸륵. 정말 냇가 모래인지는, 섞인 것을 나누어 보면 알 수 있어요.'),
          L('baleum', '원님, 자루 속에 섞인 것을 이 자리에서 나누어 보겠습니다.'),
          L('wonnim', '허락하오. 체와 지남철, 물그릇을 가져오너라.', 'normal', {words: ['지남철']})
        ]
      },
      ossi1: {
        who: 'ossi', title: '두 번째 심문 · 자루를 맡은 오씨 부인',
        statements: [
          {text: '콩쥐가 찧어 온 쌀자루를 저녁에 광에 넣고, 내가 자물쇠를 채웠소.', cards: [{q: '자루를 열어 보셨나요?', a: '열어 보긴! 묶인 그대로 넣었소.'}]},
          {text: '광 열쇠는 나만 가지고 있소. 밤사이 아무도 광에 못 들어가오.', cards: [{q: '열쇠를 빌려준 적은 없나요?', a: '없소. 늘 내 허리춤에 차고 다니오.'}]},
          {text: '아침에 그 자루를 묶인 그대로 관아에 가져갔소. 나는 손도 안 댔지.', cards: [{q: '가는 길에 들른 곳이 있나요?', a: '없소! 곧장 관아로 갔소.'}]},
          {text: '관아 저울에 달았을 때도 방앗간에서 단 무게 그대로였소. 스무 근!', cards: [{q: '관아에서 쌀값은 얼마나 받으셨나요?', a: '그, 그건 왜 묻소! 받을 만큼 받았소.', mood: 'sweat'}]}
        ],
        solve: {evidence: 'receipt', statements: [3], near: [
          {evidence: 'ledger', statements: [3], text: '방앗간 장부에는 스무 근이 맞아요. 부인은 관아에서도 같았다고 했지요. 관아에서 단 무게가 적힌 기록을 찾아보세요.'}
        ]},
        hints: ['부인의 말 가운데 숫자가 나오는 증언이 있어요.', '무게를 단 곳은 두 군데예요. 두 곳의 기록을 모두 떠올려 보세요.', '관아에서 단 무게를 말한 증언에, 관아에서 적은 기록을 내밀어 보세요.'],
        wrong: '확인할 수 있는 것은 숫자예요. 언제, 어디에서 단 무게인지 잘 살펴보세요.',
        success: [
          L('baleum', '관아 기록에는 스물세 근이라고 적혀 있습니다. 스무 근 그대로가 아닙니다!', 'stern', {shout: true}),
          L('ossi', '그, 그럴 리가… 관아 저울이 후한가 보오.', 'sweat'),
          L('wonnim', '방앗간 저울과 관아 저울은 같은 추로 맞춘 것이오. 저울 탓은 할 수 없소.', 'stern'),
          L('dukkeobi', '밤사이 무게가 얼마나 늘었는지 셈해 봐요. 쌀 무게는 근으로 달아요.', 'normal', {words: ['근']})
        ]
      },
      musoe: {
        who: 'musoe', title: '세 번째 심문 · 대장간의 무쇠 아재',
        statements: [
          {text: '나는 방앗간 옆 대장간의 무쇠 아재요. 쇠를 두드리면 마당에 쇳가루와 숯 부스러기가 떨어지오.', cards: [{q: '쇳가루는 지남철에 붙나요?', a: '붙다마다. 쇠붙이니까.'}]},
          {text: '잔치 전날에는 해 질 때까지 망치질을 했소. 마당에 쇳가루가 수북했지.', cards: [{q: '무엇을 만드셨나요?', a: '잔치에 쓸 솥 다리를 고쳤소. 일이 많았지.'}]},
          {text: '그날 밤 마당을 쓴 사람은 아무도 없소. 나는 고단해서 곧장 잤고, 찾아온 사람도 없었으니.', cards: [{q: '정말 아무도 오지 않았나요?', a: '어, 없었다니까! 왜 자꾸 묻소…', mood: 'sweat'}]},
          {text: '잔칫날 새벽닭이 울 때 일어나 보니, 마당이 말끔해서 기분이 좋았소.', cards: [{q: '쓸어 낸 흙은 어디에 있었나요?', a: '그, 그건… 보이지 않았소.', mood: 'sweat'}]},
          {text: '쇳가루가 쌀에 들어갔다고 내 탓을 하면 억울하오. 나는 쌀자루 근처에도 안 갔소.', cards: [{q: '콩쥐네 쌀자루를 본 적 있나요?', a: '없소. 그건 참말이오.'}]}
        ],
        solve: {pair: [2, 3], near: [
          {pair: [1, 3], text: '저녁에 수북하던 쇳가루가 새벽에는 말끔해졌어요. 그사이에 누군가 쓸었다는 뜻이지요. 아재는 그 일을 뭐라고 말했나요?'},
          {evidence: 'forge', text: '대장간 마당 흙이 자루 속 것과 같다는 것은 이미 알아냈어요. 이번에는 아재의 말끼리 맞대어 보세요.'}
        ]},
        hints: ['이번에는 물건 증거보다 아재의 말끼리 견주어 보세요.', '마당이 언제 어떤 모습이었는지 말한 증언들을 살펴보세요.', '「두 증언 맞대기」를 누르고, 밤에 있었던 일과 새벽에 본 모습을 말한 두 증언을 골라 보세요.'],
        wrong: '이 말을 깨뜨릴 물건 증거는 없어요. 아재의 말 가운데 서로 어긋나는 두 가지를 찾아 「두 증언 맞대기」를 눌러 보세요.',
        success: [
          L('baleum', '쓴 사람이 아무도 없는데 마당이 말끔해졌다니요. 누군가 쓸었다는 뜻입니다!', 'stern', {shout: true}),
          L('musoe', '끄응… 사실은 전날 해 질 무렵에 오씨 부인이 찾아왔소.', 'sweat'),
          L('musoe', '마당을 거저 쓸어 주겠다기에 좋다고 했지. 쓸어 낸 흙은 자루에 담아 가더이다.', 'sad'),
          L('musoe', '그 흙이 쌀에 들어갔다는 말을 듣고, 내 탓이 될까 겁이 나서 숨겼소. 미안하오.', 'sad'),
          L('wonnim', '숨긴 것은 잘못이오. 그러나 이제라도 바로 말했으니 참작하겠소.'),
          L('ossi', '마, 마당 좀 쓸어 준 게 무슨 죄란 말이오! 내 말도 끝까지 들어 보시오!', 'stern')
        ]
      },
      ossi2: {
        who: 'ossi', title: '마지막 심문 · 흙은 어디로 갔나',
        statements: [
          {text: '대장간 마당을 쓸어 준 건 맞소. 이웃끼리 돕는 게 죄요?', cards: [{q: '왜 하필 그날이었나요?', a: '그, 그냥 지나가다 보니 지저분하길래…', mood: 'sweat'}]},
          {text: '쓸어 낸 흙은 우리 텃밭에 거름 삼아 뿌렸소. 쌀과는 상관없소.', cards: [{q: '쇳가루 섞인 흙이 거름이 되나요?', a: '되, 될 수도 있지! 내 밭은 내가 아오.', mood: 'sweat'}]},
          {text: '쌀자루는 내가 풀지 않았소. 무게가 늘었다면, 밤사이 누가 광에 몰래 들어와 흙을 넣은 게지!', cards: [{q: '누가 들어왔다고 생각하시나요?', a: '그야 모르지! 도둑이든 누구든!'}]},
          {text: '어쨌든 쌀을 찧은 건 콩쥐요. 콩쥐가 책임져야 하오!', cards: [{q: '콩쥐가 흙을 넣는 것을 보셨나요?', a: '보, 보지는 못했지만…', mood: 'sweat'}]}
        ],
        solve: {evidence: 'key', statements: [2], near: [
          {evidence: 'receipt', statements: [2], text: '무게가 늘어난 것은 이미 확인했어요. 이번에는 「누가 몰래 들어왔다」는 말이 맞는지 확인할 증거를 찾아보세요.'},
          {evidence: 'ledger', statements: [2], text: '무게가 늘어난 것은 이미 확인했어요. 이번에는 「누가 몰래 들어왔다」는 말이 맞는지 확인할 증거를 찾아보세요.'},
          {evidence: 'forge', statements: [1], text: '자루 속 흙이 대장간 마당 흙과 같다는 것은 이미 알아냈어요. 부인은 이제 다른 사람이 넣었다고 말해요. 그 말부터 확인해 볼까요?'}
        ]},
        hints: ['부인은 흙을 넣은 사람이 따로 있다고 해요. 그 사람은 광에 어떻게 들어갔을까요?', '광에 드나들 수 있는 사람이 누구인지 알려 주는 증거가 있어요.', '「누가 몰래 들어왔다」는 증언에, 광의 문을 살펴본 증거를 내밀어 보세요.'],
        wrong: '부인의 말 가운데 확인할 수 있는 것을 찾아보세요. 누가 광에 들어갈 수 있었을까요?',
        success: [
          L('baleum', '광 열쇠는 하나뿐이고, 부인의 허리춤에 있었습니다. 자물쇠에는 억지로 연 흔적도 없습니다!', 'stern', {shout: true}),
          L('ossi', '그, 그건…', 'shock'),
          L('wonnim', '변호인. 그렇다면 쌀에 흙이 섞인 까닭을, 증거에 맞게 말해 보시오.', 'stern')
        ]
      }
    },
    custom: {separate: SEPARATE},
    stages: [
      {type: 'talk', chapter: '세 번째 의뢰', lines: [
        L('narr', '고을 잔칫날, 원님의 밥그릇에서 “으드득!” 소리가 났습니다. 밥에 모래가 섞여 있었습니다.', 'normal', {fx: 'drum'}),
        L('wonnim', '잔치 밥에 모래라니! 쌀자루를 살펴보니, 콩쥐네 자루에서 모래와 검은 가루가 나왔소.', 'stern'),
        L('ossi', '아이고, 원님. 그 쌀은 콩쥐가 찧은 것이옵니다. 게으름을 피우다 일을 그르친 게지요.', 'stern'),
        L('kongjwi', '아니에요… 저는 키질까지 깨끗이 해서 자루에 담았어요.', 'sad', {words: ['키질']}),
        L('narr', '그때, 콩쥐의 치맛자락 뒤에서 두꺼비 한 마리가 폴짝 뛰어나왔습니다.'),
        L('dukkeobi', '꾸륵. 밑 빠진 독을 막아 준 그 두꺼비예요. 콩쥐는 일을 허투루 하는 아이가 아니에요.'),
        L('baleum', '저는 나바름입니다. 콩쥐의 말을 대신 전하겠습니다. 쌀에 모래가 섞인 것처럼, 여러 가지가 섞여 있는 것을 혼합물이라고 하지요.', 'normal', {words: ['혼합물']}),
        L('baleum', '섞인 것을 성질에 따라 나누어 보면, 무엇이 어디에서 왔는지 알 수 있습니다.', 'normal', {words: ['분리', '성질']}),
        L('wonnim', '좋소. 말이 아니라 증거로 판단하겠소. 현장을 조사해 오시오.', 'stern', {words: ['증거']}),
        L('dukkeobi', '일곱 곳을 둘러봐요. 눈에 보이는 것은 그려 두고, 무게는 적어 둬요.', 'happy')
      ]},
      {type: 'investigate', chapter: '일곱 곳의 단서', title: '어디에서 무엇이 섞였을까요?'},
      {type: 'talk', chapter: '팥쥐의 증언', lines: [
        L('narr', '새 댕기를 맨 팥쥐가 고개를 빳빳이 들고 증인석에 섰습니다.'),
        L('patjwi', '제가 다 봤어요! 콩쥐 언니가 어떻게 했는지 똑똑히 말씀드릴게요.', 'happy'),
        L('dukkeobi', '증언을 넘겨 보고, 이상한 말에 맞는 증거를 내밀어 보세요. 궁금한 말은 질문해도 좋아요.', 'normal', {words: ['증언']}),
        L('dukkeobi', '앞에서 한 말과 뒤에서 한 말이 서로 맞지 않으면 그것이 모순이에요. 그럴 땐 두 증언을 맞대 보세요.', 'normal', {words: ['모순']})
      ]},
      {type: 'cross', id: 'patjwi', chapter: '씻은 쌀, 마른 쌀'},
      {type: 'separate', chapter: '두꺼비의 분리 실험', after: [
        L('baleum', '쌀, 모래, 쇳가루, 숯 부스러기. 섞여 있던 네 가지가 모두 나뉘었습니다.', 'happy'),
        L('dukkeobi', '알갱이의 크기, 지남철에 붙는 성질, 물에 뜨는 성질. 성질이 다르니 나눌 수 있었어요.'),
        L('patjwi', '쇳가루랑 숯이요? 냇가에 그런 게 있었나…?', 'shock'),
        L('baleum', '이 흙이 어디에서 왔는지, 떠 온 견본과 견주어 보자.', 'normal', {words: ['견본']})
      ]},
      {type: 'pick', chapter: '흙의 고향 찾기', ...SOURCE, after: [
        L('baleum', '자루 속에 섞인 것은 냇가 모래가 아니라, 대장간 마당의 흙입니다!', 'stern', {shout: true}),
        L('wonnim', '콩쥐야, 대장간 마당에 간 일이 있느냐?'),
        L('kongjwi', '없어요. 방앗간에서 쌀을 받아 곧장 집으로 왔고, 자루는 어머니께 드렸어요.', 'sad'),
        L('wonnim', '그렇다면 자루를 맡았던 오씨 부인의 말을 들어 보겠소.'),
        L('ossi', '흥, 저야 숨길 것이 없지요.', 'stern')
      ]},
      {type: 'cross', id: 'ossi1', chapter: '스무 근의 자루'},
      {type: 'count', chapter: '늘어난 무게', ...WEIGHT, after: [
        L('baleum', '방앗간에서 스무 근, 관아에서 스물세 근. 하룻밤 사이에 세 근이 늘었습니다.'),
        L('narr', '원님은 아까 걸러 낸 모래와 쇳가루, 숯 부스러기를 저울에 올리게 했습니다.'),
        L('wonnim', '꼭 세 근이오! 늘어난 무게는 쌀이 아니라 섞인 흙의 무게였구려.', 'shock'),
        L('dukkeobi', '쌀값은 한 근에 두 닢. 세 근이 늘었으니 여섯 닢을 더 받은 셈이에요.'),
        L('ossi', '나, 나는 모르는 일이오! 대장간 흙이라면 대장장이에게 물어보시오!', 'sweat'),
        L('narr', '방앗간 옆 대장간의 무쇠 아재가 그을린 앞치마를 두른 채 들어왔습니다.'),
        L('musoe', '어험. 쇠 두드리는 것밖에 모르는 사람을 왜 부르셨소?')
      ]},
      {type: 'cross', id: 'musoe', chapter: '말끔해진 마당'},
      {type: 'cross', id: 'ossi2', chapter: '하나뿐인 열쇠'},
      {type: 'pick', chapter: '진짜 까닭', ...CAUSE, after: [
        L('baleum', '열쇠를 가진 사람이 밤사이 대장간 마당 흙 세 근을 자루에 섞었습니다. 쌀값 여섯 닢을 더 받으려고요.', 'stern'),
        L('patjwi', '어머니, 이제 그만해요! 저… 언니가 쌀 씻는 걸 본 적 없어요. 어머니가 그렇게 말하라고 하셨잖아요.', 'sad'),
        L('ossi', '…그래, 내가 그랬소. 무게만 늘리면 될 줄 알았지, 잔치 밥에서 모래가 씹힐 줄은 몰랐소.', 'sad'),
        L('ossi', '들킬까 겁이 나서 콩쥐에게 떠넘겼소. 콩쥐야, 미안하다.', 'sad'),
        L('kongjwi', '…사실대로 말씀해 주셔서 고맙습니다.'),
        L('dukkeobi', '꾸륵. 섞인 것도, 엉킨 말도 하나씩 나누어 보니 다 드러났네요.', 'happy'),
        L('wonnim', '이제 판결을 내리겠소.', 'stern')
      ]},
      {type: 'verdict', chapter: '증거가 이끄는 판결', ...VERDICT},
      {type: 'diary', chapter: '나의 판관 일기'},
      {type: 'end', chapter: '다시 고른 잔치 쌀'}
    ],
    landing: {
      intro: '깨끗이 고른 쌀에서 모래가 나왔다.<br>모두가 콩쥐 탓이라 말할 때,<br><strong>섞인 것을 나누어 진실을 밝혀 주세요.</strong>',
      start: '콩쥐의 사건 맡기',
      backdrop: 'mill',
      people: [['kongjwi', 'sad'], ['ossi', 'stern'], ['baleum', 'normal']],
      bubble: '섞인 것은 나누어 보면 알 수 있소!',
      label: ['콩쥐팥쥐전에서 시작된 새로운 사건', '모래 섞인 잔치 쌀의 진실'],
      steps: ['단서 수집', '나누고 견주기', '증거로 판결'],
      credit: '초등 4학년부터 · 읽는 속도에 따라 약 30–40분 · 진행 자동 저장'
    },
    diary: {
      title: '다시 이런 일이 생기지 않으려면?',
      intro: '가장 마음에 드는 생각을 골라 주세요. 여기에는 정답이 없어요.',
      choices: [
        '오씨 부인은 더 받은 돈을 돌려주고, 콩쥐와 잔치 손님들에게 사과해야 해요.',
        '누가 시켜서 한 거짓말이라도, 바로잡는 용기가 필요해요.',
        '누가 그랬다는 말만 믿지 말고, 직접 나누고 견주어 본 뒤에 판단해야 해요.'
      ],
      placeholder: '예: 소문만 듣고 친구를 탓하지 않을 거예요.'
    },
    end: {
      backdrop: 'mill',
      people: [['kongjwi', 'happy'], ['dukkeobi', 'happy']],
      quote: '“섞인 것도, 엉킨 말도 하나씩 나누면 보여요.”',
      kicker: '세 번째 사건 해결',
      title: '섞인 것은<br><em>나누면 보여요.</em>',
      text: '오씨 부인은 콩쥐에게 사과하고, 팥쥐와 함께 곳간의 쌀을 체로 쳤습니다.<br>다시 지은 잔치 밥에서는 고소한 냄새만 났습니다.',
      badges: ['분리 실험가', '무게 수사관', '모순 사냥꾼']
    },
    guide: `<h3>제3화 · 교사·보호자 안내</h3><p><b>콩쥐팥쥐전 × 혼합물의 분리 × 말과 증거 견주기</b><br>초등 4학년부터, 약 30–40분을 예상한 이야기입니다. 콩쥐팥쥐전의 콩쥐, 팥쥐, 새어머니, 콩쥐를 돕는 두꺼비를 바탕으로 새로 꾸민 사건입니다. 새어머니의 성은 이 게임에서 새로 붙였습니다. 무쇠 아재와 고을 원님은 이 게임을 위해 만든 인물입니다. 1·2화보다 한 단계 어렵습니다. 쓰이지 않는 증거가 섞여 있고, 증거 없이 두 증언을 맞대어야 풀리는 심문이 있습니다.</p><p><b>함께 생각할 질문</b></p><ol><li>쌀, 모래, 쇳가루, 숯을 나눌 때 어떤 성질을 이용했나요? 순서를 바꾸어도 될까요?</li><li>팥쥐는 시켜서 거짓말을 했습니다. 팥쥐에게도 책임이 있을까요?</li><li>무쇠 아재는 왜 사실을 숨겼을까요? 나라면 어떻게 했을까요?</li></ol><details class="teacher-spoilers"><summary>교사용 진행·정답 보기</summary><p>팥쥐: 증언 2 또는 3 + 자루 속 관찰 그림 (쌀알이 보송보송함).<br>분리 실험: 체(쌀) → 지남철(쇳가루) → 물(숯). 쌀을 먼저 고른 뒤라면 순서는 바꾸어도 됩니다.<br>흙의 고향: 대장간 마당.<br>오씨 부인 첫 심문: 증언 4 + 관아 접수 기록 (23근).<br>늘어난 무게: 23 − 20 = 3근.<br>무쇠 아재: 증언 3과 4를 맞대기.<br>오씨 부인 마지막 심문: 증언 3 + 광 자물쇠와 열쇠.<br>진짜 까닭: 네 번째 보기.<br>쓰이지 않는 증거: 밥그릇에서 나온 것.</p></details><p><b>과학 표현의 범위</b><br>알갱이의 크기(체), 자석에 붙는 성질(지남철), 물에 뜨고 가라앉는 성질을 이용한 혼합물의 분리를 다룹니다. 이야기 속 냇가 모래에는 자석에 붙는 것이 없다고 설정했지만, 실제 강모래에는 자석에 붙는 사철이 섞여 있기도 합니다. 숯도 물을 오래 머금으면 가라앉을 수 있습니다. 그래서 이야기에서는 한 가지 성질이 아니라 알갱이 모양, 쇳가루, 숯, 왕겨를 함께 견주어 판단합니다. 무게와 쌀값은 이야기 속 수치입니다.</p><p><b>인물을 다루는 방식</b><br>원작의 설정을 따라 새어머니가 잘못을 저지르지만, 이야기의 초점은 가족 관계가 아니라 “무게를 속이고 남에게 떠넘긴 행동”에 있습니다. 오씨 부인은 스스로 사실을 말하고 사과하며, 벌도 바로잡는 일로 한정했습니다.</p><p class="muted">로그인 없이 사용하며 진행과 일기는 브라우저 안에만 저장됩니다. 화마다 진행 기록은 별개입니다.</p>`
  };
})();
