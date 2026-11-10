'use strict';
/*
 * 떡잎부터 무죄 — 공용 게임 엔진
 *
 * 한 화(에피소드)의 내용은 전부 episodes/epNN.js 가 window.CASE 에 담아 줍니다.
 * 이 파일에는 특정 화의 대사나 정답이 들어 있지 않습니다. 새 화를 만들 때는
 * 시나리오 파일과 그림만 추가하면 됩니다. 자료 형식은 docs/episode-format.md 참고.
 */
(() => {
  const C = window.CASE, SERIES = window.SERIES || [];
  const $ = s => document.querySelector(s);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const SAVE = `ddeokip-ep${C.n}-save`, DIARY = 'ddeokip-diaries';
  const OLD_DIARY = {1: 'ddeokip-diary', 2: 'ddeokip-ep2-diary'}; // 엔진 통합 전의 일기 보관 위치
  const MOODS = {normal:0, happy:1, sad:2, shock:3, sweat:4, stern:5};
  const T = Object.assign({
    shout: '잠깐, 그 말씀 이상하오!',
    wrongTitle: '한 번 더 살펴볼까요?',
    wrongEvidence: '이 증언의 어떤 부분을 확인할 수 있는 증거일까요? 다른 증언에 내밀어야 할 수도 있어요.',
    wrongPair: '두 증언이 서로 어긋나지 않아요. 같은 것을 다르게 말한 두 증언을 찾아보세요.',
    crossHelp: '이상한 말이 있는 번호를 고르고, 그 말을 확인할 증거를 내미세요.',
    crossHelpPair: '증언 번호를 눌러 넘겨 보세요. 이상한 말을 찾으면 증거를 내밀거나 두 증언을 맞대 보세요.'
  }, C.text);
  const fresh = () => ({version:2, screen:'title', stage:0, line:0, after:false, ev:[], coins:5, cross:{}, p:{}, scale:{}, vkey:null, seen:[], choice:null, diaryText:'', diarySaved:false, complete:false});

  let S = fresh(), hasSave = false, focusBeforeModal = null, afterClose = null, fxTimer;
  let X = {}; // 저장하지 않는 화면 상태 (질문 카드 펼침, 고른 증언 등)
  const st = () => C.stages[S.stage];
  const read = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } };
  const afterLines = (s = st()) => (s.type === 'cross' ? C.witnesses[s.id].success : s.after) || [];
  const curLines = () => S.after ? afterLines() : st().lines;

  // ---------- 저장 불러오기 (예전 형식도 이어서 쓸 수 있게 옮겨 줌) ----------
  function restore(raw) {
    if (!raw || typeof raw !== 'object') return null;
    let d = raw;
    if (raw.version !== 2) d = {
      stage: Number.isInteger(raw.stage) ? raw.stage : raw.step,
      line: Number.isInteger(raw.line) ? raw.line : raw.ti,
      ev: raw.ev, coins: raw.coins, cross: raw.cross || raw.w, scale: raw.scale, vkey: raw.vkey,
      seen: Array.isArray(raw.seen) ? raw.seen : Object.keys(raw.seen || {}),
      choice: raw.choice ?? raw.dpick, diaryText: raw.diaryText, diarySaved: raw.diarySaved, complete: raw.complete
    };
    if (!Number.isInteger(d.stage) || d.stage < 0 || d.stage >= C.stages.length) return null;
    const s = {...fresh(), ...d, version: 2, screen: 'title'};
    const obj = v => v && typeof v === 'object' && !Array.isArray(v) ? v : {};
    s.ev = Array.isArray(s.ev) ? s.ev.filter(k => C.evidence[k]) : [];
    s.seen = Array.isArray(s.seen) ? s.seen.filter(k => C.glossary[k]) : [];
    s.cross = obj(s.cross); s.p = obj(s.p); s.scale = obj(s.scale);
    s.coins = Number.isFinite(s.coins) ? Math.max(1, Math.min(5, s.coins)) : 5;
    s.after = s.after === true && afterLines(C.stages[s.stage]).length > 0;
    const lines = s.after ? afterLines(C.stages[s.stage]) : C.stages[s.stage].lines;
    s.line = Number.isInteger(s.line) ? Math.max(0, Math.min(s.line, (lines?.length || 1) - 1)) : 0;
    s.choice = Number.isInteger(s.choice) && C.diary.choices[s.choice] ? s.choice : null;
    s.diaryText = typeof s.diaryText === 'string' ? s.diaryText.slice(0, 160) : '';
    s.complete = s.complete === true || s.stage === C.stages.length - 1;
    return s;
  }
  function save() {
    try { localStorage.setItem(SAVE, JSON.stringify(S)); hasSave = true; }
    catch { $('#save-status').hidden = false; $('#save-status').textContent = '이 브라우저에서는 진행 상황을 저장할 수 없어요. 게임은 계속할 수 있어요.'; }
  }

  // ---------- 그림과 작은 부품 ----------
  function face(id, mood = 'normal') {
    if (!C.portraits.includes(id)) return '';
    const n = MOODS[mood] ?? 0;
    return `<svg class="character painted-character" viewBox="0 0 512 512" role="img" aria-label="${esc(C.chars[id])}" data-character="${id}" data-expression="${mood}"><image href="assets/art/${C.art?.[id] || id}.webp" x="${-(n % 3) * 512}" y="${-Math.floor(n / 3) * 512}" width="1536" height="1024" preserveAspectRatio="none"/></svg>`;
  }
  const backdrop = (id = C.court || 'court') => `<img class="bd painted-backdrop" src="assets/art/${id}.webp" alt="" draggable="false">`;
  const who = (id, html, mood = 'normal') => `<div class="who"><div class="mini">${face(id, mood)}</div><div><span class="wn">${esc(C.chars[id])}</span><p>${html}</p></div></div>`;
  const action = (a, text, value = '', cls = 'seal fill', disabled = false) => `<button class="${cls}" data-action="${a}"${value !== '' ? ` data-value="${esc(value)}"` : ''}${disabled ? ' disabled' : ''}>${text}</button>`;
  const ICONS = {
    seed: '<path d="M27 9C10 17 10 37 23 42C37 40 42 22 27 9Z" fill="#d8bc7c" stroke="#87633b" stroke-width="2"/><path d="M26 13Q20 25 23 37" fill="none" stroke="#fff2c9" stroke-width="2"/>',
    note: '<path d="M12 11H39V41H12Z" fill="#fff5d9" stroke="#8e7952" stroke-width="2"/><path d="M18 20H33M18 27H33M18 34H29" stroke="#8e7952" stroke-width="2"/>',
    jar: '<path d="M15 15H37Q48 37 35 43H17Q4 37 15 15Z" fill="#987250" stroke="#684b35" stroke-width="2"/><ellipse cx="26" cy="15" rx="13" ry="4" fill="#c3a27c"/>',
    book: '<rect x="12" y="10" width="29" height="34" rx="3" fill="#6c8875" stroke="#465d4d" stroke-width="2"/><path d="M18 10V44" stroke="#e9dbb4" stroke-width="2"/><path d="M24 20H35M24 27H35" stroke="#f4eddb" stroke-width="2"/>',
    order: '<path d="M11 13H41V40H11Z" fill="#fff1cd" stroke="#9a7754" stroke-width="2"/><path d="M17 21H35M17 27H28" stroke="#8e7952" stroke-width="2"/><rect x="30" y="30" width="7" height="7" fill="#aa5945"/>',
    table: '<rect x="10" y="10" width="32" height="32" fill="#fff5d9" stroke="#8e7952" stroke-width="2"/><path d="M10 18H42M10 26H42M10 34H42M22 10V42M32 10V42" stroke="#8e7952" stroke-width="1.2"/><circle cx="37" cy="30" r="2.5" fill="#aa5945"/>',
    map: '<rect x="9" y="11" width="34" height="30" fill="#fff5d9" stroke="#8e7952" stroke-width="2"/><rect x="12" y="14" width="10" height="8" fill="#efe3c7" stroke="#8e7952"/><rect x="28" y="28" width="12" height="10" fill="#cfe1e6" stroke="#8e7952"/><path d="M14 36q3-6 5 0q2-5 4 0" fill="#d88443"/>',
    ledger: '<rect x="12" y="9" width="28" height="34" fill="#c9a27a" stroke="#684b35" stroke-width="2"/><path d="M16 9V43" stroke="#684b35" stroke-width="1.5"/><rect x="20" y="14" width="14" height="18" fill="#fff5d9" stroke="#8e7952"/><path d="M27 16V30" stroke="#8e7952" stroke-width="1.2"/>'
  };
  const icon = key => `<svg viewBox="0 0 52 52" aria-hidden="true"><rect x="1" y="1" width="50" height="50" rx="9" fill="#eee1c4" stroke="#c2ab80"/>${C.evidence[key].iconSvg || ICONS[C.evidence[key].icon] || ICONS.note}</svg>`;
  const evidenceView = key => { const e = C.evidence[key]; return e.view ? e.view() : `<p class="gl">${esc(e.short)}</p>`; };

  function openModal(html, title, onClose = null) {
    if ($('#modal').hidden) focusBeforeModal = document.activeElement;
    afterClose = onClose;
    $('#sheet').innerHTML = html;
    $('#sheet').setAttribute('aria-label', title || '안내');
    $('#modal').hidden = false;
    $('#sheet').scrollTop = 0;
    ($('#sheet').querySelector('button,[href]') || $('#sheet')).focus({preventScroll: true});
  }
  function closeModal() {
    $('#modal').hidden = true;
    if (focusBeforeModal?.isConnected) focusBeforeModal.focus({preventScroll: true});
    focusBeforeModal = null;
    const cb = afterClose; afterClose = null;
    if (cb) cb();
  }
  const notice = (title, html, id = C.helper, mood = 'normal', onClose = null) =>
    openModal(`<h3>${title}</h3>${who(id, html, mood)}<div class="row end">${action('close', '알겠어요')}</div>`, title, onClose);
  function shout() {
    $('#fx').innerHTML = `<div class="shout">${esc(T.shout)}</div>`;
    clearTimeout(fxTimer); fxTimer = setTimeout(() => $('#fx').innerHTML = '', 1400);
  }
  function drum() { const sc = $('.scene'); if (sc) { sc.classList.remove('shake'); void sc.offsetWidth; sc.classList.add('shake'); } }

  // ---------- 진행 ----------
  function go(n) { afterClose = null; closeModal(); S.stage = n; S.line = 0; S.after = false; S.screen = 'game'; X = {}; save(); render(true); }
  /** 지금 단계를 마칩니다. 마무리 대사(after/success)가 있으면 먼저 보여 줍니다. */
  function done() {
    afterClose = null; closeModal();
    if (!S.after && afterLines().length) { S.after = true; S.line = 0; X = {}; save(); render(true); }
    else go(S.stage + 1);
  }
  const P = () => S.p[S.stage] || (S.p[S.stage] = {});
  const inStage = type => S.screen === 'game' && !S.after && st().type === type;

  function topbar() {
    if (S.screen === 'title') { $('#top').innerHTML = ''; return; }
    const cross = inStage('cross');
    $('#top').innerHTML = `<div class="case-progress"><span class="logo"><em>떡잎</em>부터 무죄 <small>제${C.n}화</small></span><span class="chapter">${esc(st().chapter || '')}</span><div class="progress-track"><i style="width:${Math.round(S.stage / (C.stages.length - 1) * 100)}%"></i></div></div>
      ${cross ? `<span class="coins" aria-label="기력 엽전 ${S.coins}개">${Array.from({length: 5}, (_, i) => `<span class="coin ${i < S.coins ? '' : 'off'}"></span>`).join('')}</span>` : ''}
      ${action('evidence', '증거함 ' + S.ev.length, '', 'seal sm')}${action('words', '낱말 주머니', '', 'seal sm')}
      ${cross ? action('hint', '힌트', '', 'seal sm') : ''}${action('home', '처음 화면', '', 'seal sm')}`;
  }
  function render(moveFocus = false) {
    topbar();
    if (S.screen === 'title') drawTitle();
    else if (S.after || st().type === 'talk') drawTalk();
    else STAGES[st().type].draw(st());
    if (moveFocus) { $('#view').scrollTop = 0; const h = $('#view').querySelector('h2,h1'); if (h) { h.tabIndex = -1; h.focus({preventScroll: true}); } }
  }

  function drawTitle() {
    const L = C.landing, going = hasSave && !S.complete && (S.stage > 0 || S.line > 0);
    const nav = SERIES.map(e => `<a href="${e.href}"${e.n === C.n ? ' aria-current="page"' : ''}><small>제${e.n}화</small> ${esc(e.classic)}</a>`).join('');
    $('#view').innerHTML = `<section class="landing">
      <div class="landing-top"><span class="brand-mark">떡<span>잎</span></span><span>이야기 속에서 만나는<br><b>우리들의 작은 법정</b></span><span class="edition">사건 수첩<br>${String(C.n).padStart(3, '0')}</span></div>
      <nav class="episode-nav" aria-label="이야기 선택">${nav}</nav>
      <div class="landing-main"><div class="titlewrap"><div class="eyebrow"><i></i> 조선 추리 법정극</div><h1><em>떡잎</em>부터<br>무죄<span class="title-dot">.</span></h1><div class="ep">${esc(C.title)}</div>
        <p class="intro-copy">${L.intro}</p>
        <div class="title-actions">${going ? action('continue', '이어서 수사하기 <span>↗</span>', '', 'seal fill start') : ''}${action('start', (S.complete ? '사건 다시 맡기' : going ? '새로 시작하기' : esc(L.start)) + ' <span>→</span>', '', 'seal start ' + (going ? '' : 'fill'))}</div>
        <div class="row secondary">${action('diaries', '내 판관 일기', '', 'seal sm')}${action('guide', '교사·보호자 안내', '', 'seal sm')}</div>
      </div><div class="hero">${backdrop(L.backdrop)}<div class="hero-glow"></div>${L.people.map(([id, mood], i) => `<div class="p p${[1, 3, 2][i]}">${face(id, mood)}</div>`).join('')}<span class="hero-bubble">${esc(L.bubble)}</span><div class="case-label"><span>${esc(L.label[0])}</span><b>${esc(L.label[1])}</b><span class="case-seal">수사<br>개시</span></div></div></div>
      <div class="landing-bottom">${L.steps.map((t, i) => `<span><b>0${i + 1}</b> ${esc(t)}</span>`).join('<i></i>')}</div><p class="credit">${esc(L.credit)}</p>
    </section>`;
  }

  function drawTalk() {
    const lines = curLines(), line = lines[S.line];
    let speaker = line.who;
    if (!C.portraits.includes(speaker)) speaker = lines.slice(0, S.line).reverse().find(l => C.portraits.includes(l.who))?.who;
    const mood = speaker === line.who ? line.mood : 'normal';
    const newWords = (line.words || []).filter(w => !S.seen.includes(w));
    if (newWords.length) { S.seen.push(...newWords); save(); }
    $('#view').innerHTML = `<div class="scene">${backdrop(st().bg)}<span class="tagline">제${C.n}화 · ${esc(st().chapter || '')}</span><div class="por">${speaker ? face(speaker, mood) : ''}</div></div>
      <button class="dlg" data-action="next" aria-label="다음 대사">${C.chars[line.who] ? `<span class="nm ${line.who === 'baleum' || line.who === C.helper ? 'blue' : ''}">${esc(C.chars[line.who])}</span>` : ''}<span class="tx ${line.who === 'narr' ? 'narr' : ''}">${esc(line.text)}</span><span class="more">눌러서 계속 ▶</span></button>
      ${(line.words || []).length ? `<div class="word-inline">새 낱말 ${line.words.map(w => action('word', esc(w), w, 'word-chip')).join('')}<span>눌러서 뜻 보기</span></div>` : ''}`;
    if (line.shout) shout();
    if (line.fx === 'drum') drum();
  }

  function evidenceBox(picking = false) {
    const c = picking ? curCross() : null;
    openModal(`<h3>${picking ? `증언 ${c.si + 1}에 내밀 증거` : '사건 증거함'}</h3><div class="evlist">${S.ev.map(id => `<button class="ev" data-action="${picking ? 'submit-evidence' : 'show-evidence'}" data-value="${id}"><span class="ic">${icon(id)}</span><span class="ev-body"><b>${esc(C.evidence[id].name)}</b><span class="muted">${esc(C.evidence[id].short)}</span></span></button>`).join('') || '<p>현장을 조사하면 증거가 모여요.</p>'}</div><div class="row end">${action('close', '닫기', '', 'seal')}</div>`, picking ? '증거 내밀기' : '증거함');
  }

  // ---------- 심문 ----------
  function curCross() {
    const id = st().id, n = C.witnesses[id].statements.length;
    const c = S.cross[id] && typeof S.cross[id] === 'object' ? S.cross[id] : (S.cross[id] = {});
    c.si = Number.isInteger(c.si) ? Math.max(0, Math.min(c.si, n - 1)) : 0;
    c.wrong = c.wrong || 0; c.hint = Math.max(0, Math.min(3, c.hint || 0));
    return c;
  }
  function showHint() {
    const w = C.witnesses[st().id], c = curCross();
    if (c.hint < 1) { c.hint = 1; save(); }
    const title = `${C.chars[C.helper]}의 힌트`;
    openModal(`<h3>${title}</h3>${who(C.helper, w.hints.slice(0, c.hint).map(h => `<span class="hint-line">${esc(h)}</span>`).join(''), 'happy')}<div class="row end">${c.hint < 3 ? action('more-hint', '더 자세한 힌트', '', 'seal blue') : ''}${action('close', '생각해 볼게요')}</div>`, title);
  }
  function wrong(message) {
    const c = curCross(); c.wrong++; S.coins--; X = {};
    let extra = '';
    if (S.coins <= 0) { S.coins = 5; extra = '<br><br>기력 엽전을 다시 채웠어요. 모은 증거는 그대로예요. 천천히 다시 생각해 봐요.'; }
    // 두 번 틀릴 때마다 다음 단계 힌트를 먼저 보여 줍니다.
    const auto = c.wrong % 2 === 0 && c.hint < 3;
    if (auto) c.hint++;
    save(); topbar(); STAGES.cross.draw(st());
    notice(T.wrongTitle, esc(message) + extra, C.wrongSpeaker || C.helper, 'normal', auto ? showHint : null);
  }
  function solved() {
    afterClose = null; closeModal();
    if (!afterLines().length) shout();
    done();
  }

  const STAGES = {
    talk: {},

    investigate: {
      draw(s) {
        const n = C.places.length;
        $('#view').innerHTML = `<section class="board"><div class="section-kicker">INVESTIGATION · 현장 조사</div><h2>${esc(s.title || '작은 단서부터 모아 볼까요?')}</h2><p class="muted">${n}곳을 둘러보고 증거를 살펴보세요. <b>${S.ev.length} / ${n}</b></p><div class="places">${C.places.map(p => `<button class="place ${S.ev.includes(p.ev) ? 'done' : ''}" data-action="place" data-value="${p.id}"><img class="location-art" src="assets/art/${p.art}.webp" alt=""><b>${esc(p.name)}</b><small>${S.ev.includes(p.ev) ? '수집 완료 · 다시 살펴보기' : esc(C.evidence[p.ev].name)}</small></button>`).join('')}</div><div class="row end investigation-bottom">${action('court', '증거를 들고 법정으로 →', '', 'seal fill', S.ev.length !== n)}</div></section>`;
      },
      act(a, v, s) {
        if (a === 'place') {
          const p = C.places.find(p => p.id === v); if (!p) return;
          if (!S.ev.includes(p.ev)) { S.ev.push(p.ev); save(); }
          topbar(); this.draw(s);
          openModal(`<div class="location-banner"><img src="assets/art/${p.art}.webp" alt=""></div><h3>${esc(C.evidence[p.ev].name)}</h3>${who(p.who, esc(p.line))}${evidenceView(p.ev)}<div class="row end">${action('close', '증거함에 넣기')}</div>`, C.evidence[p.ev].name);
        }
        if (a === 'court' && S.ev.length === C.places.length) done();
      }
    },

    cross: {
      draw(s) {
        const w = C.witnesses[s.id], c = curCross(), line = w.statements[c.si];
        const reply = Number.isInteger(X.reply) ? line.cards[X.reply] : null;
        const pair = !!X.pair, sel = X.sel || [];
        $('#view').innerHTML = `<div class="scene">${backdrop(s.bg)}<span class="tagline">${esc(w.title)}</span><div class="por">${face(w.who, reply ? (reply.mood || 'normal') : 'normal')}</div></div>
          <div class="stmt ${reply ? 'reply' : ''}"><span class="nm">${reply ? esc(C.chars[w.who]) : `증언 ${c.si + 1} / ${w.statements.length}`}</span><div class="tx">${reply ? esc(reply.a) : '“' + esc(line.text) + '”'}</div></div>
          <div class="cross-controls"><div class="chips" role="group" aria-label="증언 고르기">${w.statements.map((_, i) => action('statement', i + 1, i, 'chip ' + (pair ? (sel.includes(i) ? 'pick' : '') : (c.si === i ? 'on' : '')))).join('')}</div>
          ${pair ? `<div class="row">${action('pair-go', '이 두 증언 맞대기', '', 'seal fill', sel.length !== 2)}${action('pair-cancel', '그만두기', '', 'seal')}</div>`
            : `<div class="row">${action('question', reply ? '증언으로 돌아가기' : '질문하기', '', 'seal blue')}${action('present', '이 증언에 증거 내밀기')}${C.rules?.pair ? action('pair', '두 증언 맞대기', '', 'seal') : ''}</div>`}</div>
          ${X.asking ? `<div class="cards">${line.cards.map((q, i) => action('reply', esc(q.q), i, 'qcard')).join('')}</div>` : ''}
          <p class="muted cross-help">${pair ? `서로 어긋나는 증언 두 개를 고르세요. (${sel.length}/2)` : esc(C.rules?.pair ? T.crossHelpPair : T.crossHelp)}</p>`;
      },
      act(a, v, s) {
        const w = C.witnesses[s.id], c = curCross(), sol = w.solve;
        switch (a) {
          case 'statement': {
            const i = +v; if (!w.statements[i]) return;
            if (X.pair) { const sel = X.sel; if (sel.includes(i)) X.sel = sel.filter(x => x !== i); else if (sel.length < 2) sel.push(i); }
            else { c.si = i; X = {}; save(); }
            return this.draw(s);
          }
          case 'question': X = Number.isInteger(X.reply) ? {} : {asking: !X.asking}; return this.draw(s);
          case 'reply': if (w.statements[c.si].cards[+v]) { X = {reply: +v}; this.draw(s); } return;
          case 'present': X = {}; this.draw(s); return evidenceBox(true);
          case 'submit-evidence': {
            if (!S.ev.includes(v)) return;
            if (sol.pair || sol.evidence !== v || !sol.statements.includes(c.si)) return wrong(w.wrong || T.wrongEvidence);
            if (!sol.point) return solved();
            const p = sol.point;
            return openModal(`<h3>${esc(p.title)}</h3>${p.quote ? `<p class="gl">${esc(p.quote)}</p>` : ''}${p.diagram(true)}<p>${esc(p.prompt)}</p><div class="row">${p.spots.map(([id, label]) => action('spot', esc(label), id, 'seal blue')).join('')}</div><div class="row end">${action('close', '증언 다시 보기', '', 'seal')}</div>`, p.title);
          }
          case 'spot': {
            const p = sol.point; if (!p || $('#modal').hidden) return;
            return v === p.answer ? solved() : notice(p.wrongTitle || T.wrongTitle, esc(p.wrong));
          }
          case 'pair': X = {pair: true, sel: []}; return this.draw(s);
          case 'pair-cancel': X = {}; return this.draw(s);
          case 'pair-go': {
            const sel = [...(X.sel || [])].sort((a, b) => a - b);
            if (sel.length !== 2) return;
            return sol.pair && sel[0] === sol.pair[0] && sel[1] === sol.pair[1] ? solved() : wrong(T.wrongPair);
          }
          case 'hint': return showHint();
          case 'more-hint': if (c.hint < 3) { c.hint++; save(); } return showHint();
        }
      }
    },

    /** 보기 가운데 하나 고르기. check(i) 가 true 면 정답, 글자를 돌려주면 그 글을 도움말로 보여 줍니다. */
    pick: {
      draw(s, message = '') {
        $('#view').innerHTML = `<section class="board puzzle-board">${s.kicker ? `<div class="section-kicker">${esc(s.kicker)}</div>` : ''}<h2>${esc(s.title)}</h2><p class="muted">${s.intro}</p>${s.body()}<p class="pick-question">${s.question}</p><div class="row">${s.options.map((o, i) => action('pick', esc(o), i, 'seal blue')).join('')}</div>${message ? `<div class="pick-help">${who(C.helper, esc(message), 'sweat')}</div>` : ''}</section>`;
      },
      act(a, v, s) { if (a !== 'pick' || !s.options[+v]) return; const r = s.check(+v); if (r === true) done(); else this.draw(s, r); }
    },

    /** 수 맞추기. visual(조절 버튼 html, 지금 수) 가 화면 가운데 그림을 만듭니다. */
    count: {
      draw(s, message = '') {
        const n = P().n || 0;
        const control = `<div class="count-control">${action('count-minus', '−', '', 'count-button', n === 0)}<output aria-live="polite" aria-label="${esc(s.label)}">${n}<small>${esc(s.unit)}</small></output>${action('count-plus', '＋', '', 'count-button', n === s.max)}</div>`;
        $('#view').innerHTML = `<section class="board puzzle-board"><div class="section-kicker">${esc(s.kicker)}</div><h2>${esc(s.title)}</h2><p class="muted">${s.intro}</p>${s.visual(control, n)}
          ${message ? `<p class="feedback" role="status">${esc(message)}</p>` : ''}<div class="row end">${action('count-hint', '계산 도움말', '', 'seal')}${action('count-check', '이 수가 맞아요 →')}</div></section>`;
      },
      act(a, v, s) {
        const p = P(), n = p.n || 0;
        if (a === 'count-plus' || a === 'count-minus') { p.n = Math.max(0, Math.min(s.max, n + (a === 'count-plus' ? 1 : -1))); save(); this.draw(s); }
        if (a === 'count-check') { if (n === s.answer) done(); else this.draw(s, s.wrong); }
        if (a === 'count-hint') notice(s.hint[0], esc(s.hint[1]));
      }
    },

    /** 공정한 비교. 라운드마다 "알아보려는 조건 하나만 다른 두 가지"를 고릅니다. */
    compare: {
      draw(s, message = '') {
        const p = P(), r = s.rounds[p.round || 0], sel = p.sel || (p.sel = []);
        $('#view').innerHTML = `<section class="board puzzle-board"><div class="section-kicker">${esc(s.kicker)} · ${(p.round || 0) + 1} / ${s.rounds.length}</div><h2>${esc(r.title)}</h2><p class="muted">${r.intro}</p><div class="lab-common">${s.common.map(t => `<span>${esc(t)}</span>`).join('')}</div><div class="trial-grid">${s.trials.map(t => `<button class="trial-card ${sel.includes(t.id) ? 'selected' : ''}" data-action="trial" data-value="${t.id}" aria-pressed="${sel.includes(t.id)}"><span class="trial-top"><b>${t.id}</b><span>${esc(t.title)}</span><i aria-hidden="true">${sel.includes(t.id) ? '✓' : '＋'}</i></span>${s.art(t)}<dl>${s.dims.map(([k, label]) => `<div><dt>${esc(label)}</dt><dd>${esc(t[k])}</dd></div>`).join('')}<div><dt>${esc(s.result[0])}</dt><dd>${s.result[1](t)}</dd></div></dl></button>`).join('')}</div>
          <p class="observation-caption">${esc(s.caption)}</p>
          ${p.passed ? `<div class="lab-explanation" role="status"><span class="result-seal">비교 성공</span><h3>${esc(r.okTitle)}</h3><p>${esc(r.ok)}</p><p class="muted">${esc(r.okNote)}</p>${action('compare-next', esc(r.next))}</div>`
            : `${message ? `<p class="feedback" role="status">${esc(message)}</p>` : ''}<div class="row end"><span class="muted">${sel.length} / 2 선택</span>${action('compare-hint', '도움말', '', 'seal')}${action('compare-check', esc(s.checkLabel || '이 둘을 비교하기'), '', 'seal fill', sel.length !== 2)}</div>`}
          <p class="science-note">${esc(s.note)}</p></section>`;
      },
      act(a, v, s) {
        const p = P(), round = p.round || 0, r = s.rounds[round], sel = p.sel || (p.sel = []);
        if (a === 'trial' && !p.passed && s.trials.some(t => t.id === v)) {
          if (sel.includes(v)) p.sel = sel.filter(x => x !== v); else if (sel.length < 2) sel.push(v); else p.sel = [sel[1], v];
          save(); this.draw(s);
        }
        if (a === 'compare-check' && sel.length === 2) {
          if ([...sel].sort().join('') === [...r.answer].sort().join('')) { p.passed = true; save(); this.draw(s); $('.lab-explanation').scrollIntoView({block: 'nearest', behavior: 'smooth'}); }
          else this.draw(s, r.wrong);
        }
        if (a === 'compare-next' && p.passed) { if (round + 1 < s.rounds.length) { p.round = round + 1; p.sel = []; p.passed = false; save(); render(true); } else done(); }
        if (a === 'compare-hint') notice(s.hint[0], esc(s.hint[1]));
      }
    },

    /** 확인한 사실과 더 확인할 생각 나누기 */
    facts: {
      draw(s, message = '') {
        const p = P(), all = s.facts.every(f => ['fact', 'guess'].includes(p[f.id]));
        $('#view').innerHTML = `<section class="board puzzle-board"><div class="section-kicker">${esc(s.kicker)}</div><h2>${esc(s.title)}</h2><p class="muted">${esc(s.intro)}</p><div class="fact-list">${s.facts.map((f, i) => `<article class="fact-card"><div class="fact-number">0${i + 1}</div><div><p>${esc(f.text)}</p><div class="fact-buttons" role="group" aria-label="${esc(f.text)}">${action('classify', '확인한 사실', f.id + '|fact', 'fact-choice ' + (p[f.id] === 'fact' ? 'selected' : ''))}${action('classify', '더 확인할 생각', f.id + '|guess', 'fact-choice ' + (p[f.id] === 'guess' ? 'selected' : ''))}</div></div></article>`).join('')}</div>${message ? `<div class="feedback" role="status">${message}</div>` : ''}<div class="row end facts-bottom">${action('facts-hint', '판단 도움말', '', 'seal')}${action('facts-check', '증거 점검 마치기 →', '', 'seal fill', !all)}</div></section>`;
      },
      act(a, v, s) {
        const p = P();
        if (a === 'classify') { const [id, val] = v.split('|'); if (s.facts.some(f => f.id === id) && ['fact', 'guess'].includes(val)) { p[id] = val; save(); this.draw(s); } }
        if (a === 'facts-check') { const bad = s.facts.filter(f => p[f.id] !== f.answer); if (!bad.length) done(); else this.draw(s, bad.map(f => `<p><b>${esc(f.text)}</b><br>${esc(f.why)}</p>`).join('')); }
        if (a === 'facts-hint') notice(s.hint[0], esc(s.hint[1]));
      }
    },

    /** 책임 저울. 정답이 없고, 가장 무거운 접시가 판결 문구를 고릅니다. */
    scale: {
      draw(s) {
        s.pans.forEach(p => { if (!Array.isArray(S.scale[p.id])) S.scale[p.id] = []; });
        const placed = s.pans.flatMap(p => S.scale[p.id]), pool = S.ev.filter(e => !placed.includes(e)), tok = X.tok;
        $('#view').innerHTML = `<section class="board"><h2>${esc(s.title)}</h2><p class="muted">${esc(s.intro)}</p><div class="beam"></div>
          <div class="scale">${s.pans.map(p => `<div class="pan"><div class="str" style="height:${18 + S.scale[p.id].length * 18}px"></div><div class="dish ${tok ? 'target' : ''}" data-action="pan" data-value="${p.id}" role="button" tabindex="0" aria-label="${esc(p.name)} 접시에 올리기"><div class="face">${face(p.id)}</div><div class="pn">${esc(p.name)}</div>${S.scale[p.id].map(e => `<button class="tok" data-action="unplace" data-value="${p.id}|${e}" aria-label="${esc(C.evidence[e].name)} 내리기">${esc(C.evidence[e].name)} ✕</button>`).join('')}</div></div>`).join('')}</div>
          <p class="scale-prompt">${tok ? `"${esc(C.evidence[tok].name)}"을(를) 올릴 접시를 누르세요.` : '올릴 증거 카드를 고르세요.'}</p>
          <div class="pool">${pool.map(e => `<button class="tok ${tok === e ? 'sel' : ''}" data-action="tok" data-value="${e}">${esc(C.evidence[e].name)}</button>`).join('') || '<span class="muted">카드를 모두 올렸어요.</span>'}</div>
          <div class="scale-help">${who(C.helper, esc(s.help))}</div>
          <div class="row end">${action('scale-done', '판결 듣기', '', 'seal fill', !placed.length)}</div></section>`;
      },
      act(a, v, s) {
        if (a === 'tok' && S.ev.includes(v)) { X.tok = X.tok === v ? null : v; this.draw(s); }
        if (a === 'pan' && X.tok && S.scale[v]) { S.scale[v].push(X.tok); X.tok = null; save(); this.draw(s); }
        if (a === 'unplace') { const [p, e] = v.split('|'); if (S.scale[p]) { S.scale[p] = S.scale[p].filter(x => x !== e); save(); this.draw(s); } }
        if (a === 'scale-done') { S.vkey = null; done(); }
      }
    },

    verdict: {
      draw(s) {
        const sc = C.stages.find(x => x.type === 'scale');
        let k = null, lean = '';
        if (sc) {
          if (!S.vkey) { const w = sc.pans.map(p => [p.id, (S.scale[p.id] || []).length]).sort((a, b) => b[1] - a[1]); S.vkey = w[0][1] > w[1][1] ? w[0][0] : 'even'; save(); }
          k = S.vkey; lean = k === 'even' ? '저울이 고르게 기울었어요.' : `저울이 ${sc.pans.find(p => p.id === k).name} 쪽으로 기울었어요.`;
        }
        $('#view').innerHTML = `<section class="board verdict-page"><span class="section-kicker">${esc(s.kicker)}</span><div class="verdict-heading"><span class="verdict-stamp">${esc(s.stamp)}</span><div><h2>${esc(s.title)}</h2><p>${esc(s.sub)}</p></div></div>${lean ? `<p class="muted verdict-lean">${esc(lean)}</p>` : ''}<div class="verdicts">${s.cards.map(c => `<article class="vcard ${c.modern ? 'modern' : ''}"><h3>${esc(c.title)}</h3>${who(c.who, esc(c.byKey ? c.byKey[k] : c.text))}</article>`).join('')}</div>${s.question ? `<p class="verdict-question">${esc(s.question[0])}</p>${who(C.helper, esc(s.question[1]), 'happy')}` : ''}${s.strip ? `<div class="learning-strip">${s.strip.map(([b, t]) => `<span><b>${esc(b)}</b>${esc(t)}</span>`).join('')}</div>` : ''}${s.note ? `<div class="gl">${esc(s.note)}</div>` : ''}<div class="row end">${sc ? action('rescale', '저울 다시 기울이기', '', 'seal') : ''}${action('verdict-next', '내 판결을 일기에 남기기 →')}</div><p class="science-note">${esc(s.foot)}</p></section>`;
      },
      act(a) { if (a === 'verdict-next') done(); if (a === 'rescale') { S.vkey = null; go(S.stage - 1); } }
    },

    diary: {
      draw(s, message = '') {
        const D = C.diary;
        $('#view').innerHTML = `<section class="board"><div class="section-kicker">사건 수첩 · 마지막 장</div><h2>${esc(D.title)}</h2><p class="muted">${esc(D.intro)}</p><div class="cards" role="radiogroup" aria-label="나의 판결">${D.choices.map((t, i) => `<button class="opt ${S.choice === i ? 'on' : ''}" data-action="diary-choice" data-value="${i}" role="radio" aria-checked="${S.choice === i}">${S.choice === i ? '●' : '○'} ${esc(t)}</button>`).join('')}</div><label for="diary-text" class="diary-label">내 생각 한 줄 <small>안 써도 괜찮아요</small></label><textarea id="diary-text" maxlength="160" placeholder="${esc(D.placeholder)}">${esc(S.diaryText)}</textarea>${message ? `<p class="feedback">${esc(message)}</p>` : ''}<div class="row end diary-bottom">${action('finish', '일기를 남기고 결말 보기 →', '', 'seal fill', S.choice === null)}</div><p class="muted">일기와 진행 상황은 이 브라우저에만 저장돼요. 이름은 적지 않아도 돼요.</p></section>`;
      },
      act(a, v, s) {
        if (a === 'diary-choice' && C.diary.choices[+v]) { S.diaryText = $('#diary-text').value; S.choice = +v; save(); this.draw(s); }
        if (a === 'finish' && S.choice !== null) {
          S.diaryText = $('#diary-text').value.trim().slice(0, 160);
          if (!S.diarySaved) {
            try {
              const all = read(DIARY, []), d = new Date();
              localStorage.setItem(DIARY, JSON.stringify([{episode: C.n, date: `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()}`, choice: C.diary.choices[S.choice], text: S.diaryText}, ...(Array.isArray(all) ? all : [])].slice(0, 60)));
              S.diarySaved = true;
            } catch { /* 저장이 막혀 있어도 결말까지 갈 수 있어야 합니다. */ }
          }
          S.complete = true; done();
        }
      }
    },

    end: {
      draw() {
        const E = C.end, next = SERIES.find(e => e.n === C.n + 1);
        $('#view').innerHTML = `<section class="ending"><div class="ending-art">${backdrop(E.backdrop)}${E.people.map(([id, mood], i) => `<div class="ending-portrait ${i ? 'second' : ''}">${face(id, mood)}</div>`).join('')}<div class="ending-quote">${esc(E.quote)}</div></div><div class="ending-copy"><span class="section-kicker">${esc(E.kicker)}</span><h1>${E.title}</h1><p>${E.text}</p><div class="earned-badges">${E.badges.map(b => `<span>${esc(b)}</span>`).join('')}</div><div class="row">${action('diaries', '내 판관 일기', '', 'seal blue')}${action('home', '처음 화면으로', '', next ? 'seal' : 'seal fill')}${next ? `<a class="seal fill seal-link" href="${next.href}">제${next.n}화 · ${esc(next.classic)} 사건 맡기 →</a>` : C.n > 1 ? '<a class="seal seal-link" href="./">1화 다시 만나기</a>' : ''}</div></div></section>`;
      }
    }
  };
  // 화마다 필요한 특별한 퍼즐은 CASE.custom 에 {draw, act} 로 넣어 등록합니다.

  function diaryView() {
    const mine = read(DIARY, []);
    const old = Object.entries(OLD_DIARY).flatMap(([n, key]) => { const a = read(key, []); return Array.isArray(a) ? a.map(d => ({...d, episode: +n})) : []; });
    const all = [...(Array.isArray(mine) ? mine : []), ...old].slice(0, 80);
    openModal(`<h3>내 판관 일기</h3>${all.length ? all.map(d => `<article class="gl"><span class="muted">${esc(d.date || '')} · 제${esc(d.episode)}화</span><p><b>${esc(d.choice || '')}</b></p>${d.text ? `<p>${esc(d.text)}</p>` : ''}</article>`).join('') : '<p>사건을 끝까지 해결하면 나의 판결을 남길 수 있어요.</p>'}<div class="row end">${action('close', '닫기')}</div>`, '내 판관 일기');
  }

  /** 특별한 퍼즐(CASE.custom)이 쓰는 도구 모음 */
  const api = {C, get S() { return S; }, P, $, esc, action, who, face, backdrop, notice, openModal, closeModal, save, done, go, shout, render, icon, evidenceView};

  // 화마다 필요한 특별한 퍼즐은 CASE.custom 에 {draw(stage, api), act(a, v, stage, api)} 로 넣어 등록합니다.
  for (const [type, mod] of Object.entries(C.custom || {})) STAGES[type] = {draw: s => mod.draw(s, api), act: (a, v, s) => mod.act?.(a, v, s, api)};

  function act(a, v) {
    switch (a) {
      case 'start':
        if (hasSave && !S.complete && (S.stage > 0 || S.line > 0)) openModal(`<h3>${C.n}화를 처음부터 시작할까요?</h3><p>지금까지의 ${C.n}화 진행은 지워지고, 써 둔 판관 일기는 그대로 남아요.</p><div class="row end">${action('close', '그대로 두기', '', 'seal')}${action('reset', '새로 시작하기')}</div>`, '새로 시작');
        else act('reset');
        break;
      case 'reset': { const seen = S.seen; S = fresh(); S.seen = seen; go(0); break; }
      case 'continue': S.screen = 'game'; X = {}; render(true); break;
      case 'home': afterClose = null; closeModal(); S.screen = 'title'; save(); render(true); break;
      case 'close': closeModal(); break;
      case 'next':
        if (S.screen === 'game' && (S.after || st().type === 'talk')) {
          if (S.line + 1 < curLines().length) { S.line++; save(); drawTalk(); }
          else go(S.stage + 1);
        }
        break;
      case 'evidence': evidenceBox(); break;
      case 'show-evidence': if (S.ev.includes(v)) openModal(`<h3>${esc(C.evidence[v].name)}</h3>${evidenceView(v)}<div class="row end">${action('evidence', '증거함으로', '', 'seal')}${action('close', '닫기')}</div>`, C.evidence[v].name); break;
      case 'diaries': diaryView(); break;
      case 'guide': openModal(`${C.guide}<div class="row end">${action('close', '닫기')}</div>`, '교사·보호자 안내'); break;
      case 'words': openModal(`<h3>낱말 주머니</h3>${S.seen.length ? S.seen.map(w => `<p class="gl"><b>${esc(w)}</b><br>${esc(C.glossary[w])}</p>`).join('') : '<p>이야기 속에서 만난 낱말이 모여요.</p>'}<div class="row end">${action('close', '닫기')}</div>`, '낱말 주머니'); break;
      case 'word': if (C.glossary[v]) notice(esc(v), esc(C.glossary[v])); break;
      default:
        if (S.screen === 'game' && !S.after) STAGES[st().type]?.act?.(a, v, st());
    }
  }

  document.addEventListener('click', e => { const el = e.target.closest('[data-action]'); if (el && !el.disabled) act(el.dataset.action, el.dataset.value); });
  document.addEventListener('input', e => { if (e.target.id === 'diary-text') { S.diaryText = e.target.value.slice(0, 160); save(); } });
  document.addEventListener('keydown', e => {
    if (!$('#modal').hidden) {
      if (e.key === 'Escape') { e.preventDefault(); closeModal(); return; }
      if (e.key === 'Tab') {
        const els = [...$('#sheet').querySelectorAll('button:not(:disabled),a[href],[tabindex="0"],summary')];
        if (!els.length) { e.preventDefault(); return; }
        const first = els[0], last = els.at(-1);
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }
    const el = e.target.closest('[role="button"][data-action]');
    if (el && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); act(el.dataset.action, el.dataset.value); }
  });
  $('#modal').addEventListener('click', e => { if (e.target.id === 'modal') closeModal(); });
  window.addEventListener('pagehide', () => { if (hasSave || S.screen === 'game') save(); });

  const loaded = restore(read(SAVE, null));
  if (loaded) { S = loaded; hasSave = true; }
  render();
})();
