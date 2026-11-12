'use strict';
// 제9화 · 견우직녀 — 오작교가 끊어진 밤
// 견우와 직녀, 오작교 이야기를 바탕으로 새로 꾸민 사건입니다.
// 달의 모양과 뜨고 지는 때는 초등 과학의 내용을 따랐고, 정확한 시각은 날짜와 계절에 따라 조금씩 다릅니다.
// 자료 형식은 docs/episode-format.md, 사건 설계는 docs/episode9.md 를 보세요.
window.CASE = (() => {
  const L = (who, text, mood = 'normal', extra = {}) => ({who, text, mood, ...extra});
  const NIGHT = '#232b47', GLOW = '#f5ecc0', SHADE = '#3d4668';

  // ---------- 달 그림 ----------
  // f: 밝은 부분의 비율(0~1), wax: 차오르는 달이면 true (오른쪽이 밝음)
  const PHASE = {
    cres: {name: '초승달', f: .2, wax: true},
    first: {name: '오른쪽이 밝은 반달', f: .5, wax: true},
    gib: {name: '차오르는 달', f: .8, wax: true},
    full: {name: '보름달', f: 1, wax: true},
    gibw: {name: '기우는 달', f: .8, wax: false},
    last: {name: '왼쪽이 밝은 반달', f: .5, wax: false},
    old: {name: '그믐달', f: .2, wax: false}
  };
  function moonShape(key, cx, cy, r) {
    const {f, wax} = PHASE[key], rx = (r * Math.abs(1 - 2 * f)).toFixed(1);
    const lit = f >= 1 ? `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${GLOW}"/>`
      : `<path d="M${cx} ${cy - r}A${r} ${r} 0 0 1 ${cx} ${cy + r}A${rx} ${r} 0 0 ${f < .5 ? 0 : 1} ${cx} ${cy - r}z" fill="${GLOW}"${wax ? '' : ` transform="translate(${2 * cx} 0) scale(-1 1)"`}/>`;
    return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${SHADE}"/>${lit}`;
  }
  const moon = (key, size = 64) => `<svg class="moon" viewBox="0 0 64 64" width="${size}" height="${size}" aria-hidden="true"><rect width="64" height="64" rx="10" fill="${NIGHT}"/>${key ? moonShape(key, 32, 32, 22) : `<text x="32" y="43" text-anchor="middle" font-size="30" font-weight="700" fill="${GLOW}">?</text>`}</svg>`;
  const stars = (n, w, h, seed = 1) => Array.from({length: n}, (_, i) => `<circle cx="${((i * 97 + seed * 53) % w)}" cy="${((i * 61 + seed * 29) % h)}" r="${i % 5 ? 1.2 : 2}" fill="#fff" opacity="${i % 3 ? .55 : .9}"/>`).join('');

  // ---------- 퍼즐 1: 샛별이의 달 기록 ----------
  const DAYS = [[3, 'cres'], [7, 'first'], [11, 'gib'], [15, 'full'], [19, 'gibw'], [22, 'last'], [26, 'old']];
  const BLANK = [7, 15, 22];
  const MOON_NO = {
    7: '3일의 가는 달에서 11일의 통통한 달로 가는 사이예요. 앞뒤의 달은 어느 쪽이 밝은가요?',
    15: '한 달의 한가운데예요. 11일의 달보다 더 차오른 달을 골라 보세요.',
    22: '보름이 지나면 달은 오른쪽부터 어두워져요. 19일과 26일 사이의 달을 떠올려 보세요.'
  };
  const moonStrip = filled => `<div class="moon-strip">${DAYS.map(([d, k]) => `<span class="moon-day ${BLANK.includes(d) && !filled.includes(d) ? 'blank' : ''} ${d === 7 ? 'today' : ''}">${moon(BLANK.includes(d) && !filled.includes(d) ? null : k, 58)}<b>${d}일</b></span>`).join('')}</div>`;
  const MOON = {
    auto: () => [['moon-pick', 'full'], ['moon-pick', 'first'], ['moon-pick', 'full'], ['moon-pick', 'last'], ['moon-next', '']],
    draw(s, api) {
      const p = api.P(), a = api.action, got = Array.isArray(p.got) ? p.got : (p.got = []), day = BLANK[got.length], done = got.length === BLANK.length;
      api.$('#view').innerHTML = `<section class="board puzzle-board"><div class="section-kicker">샛별이의 달 기록${done ? '' : ` · ${got.length + 1} / ${BLANK.length}`}</div><h2>날마다 달라지는 달</h2><p class="muted">샛별이가 음력 날짜마다 달을 그려 두었어요. 그런데 세 칸이 비어 있네요. 앞뒤의 달을 보고 <b>빈칸의 달</b>을 채워 주세요.</p>
        ${moonStrip(got)}
        ${p.msg ? `<p class="feedback" role="status">${api.esc(p.msg)}</p>` : ''}
        ${done ? `<div class="lab-explanation" role="status"><span class="result-seal">기록 완성</span><h3>칠석의 달은 오른쪽이 밝은 반달</h3><p>달은 음력 3일쯤 가는 초승달로 보이기 시작해서, 7~8일쯤 오른쪽이 밝은 반달(상현달), 15일쯤 보름달이 돼요. 그 뒤로는 오른쪽부터 어두워져서 22~23일쯤 왼쪽이 밝은 반달(하현달)이 돼요.</p><p class="muted">칠석은 음력 7월 7일이에요. 그러니 칠석날 밤의 달은 언제나 상현달 무렵이에요.</p>${a('moon-next', '달 모양 기록을 증거함에 넣기 →')}</div>`
          : `<p class="pick-question">음력 ${day}일의 달은 어떤 모양일까요?</p><div class="moon-opts">${['cres', 'first', 'full', 'last'].map(k => a('moon-pick', `${moon(k, 54)}<span>${PHASE[k].name}</span>`, k, 'seal moon-opt')).join('')}</div>`}
        <p class="science-note">달의 모양은 약 한 달을 주기로 되풀이돼요. 음력 날짜를 알면 달의 모양을 알 수 있어요.</p></section>`;
    },
    act(a, v, s, api) {
      const p = api.P(), day = BLANK[p.got.length];
      if (a === 'moon-pick' && day) {
        if (DAYS.find(d => d[0] === day)[1] === v) { p.got.push(day); p.msg = ''; } else p.msg = MOON_NO[day];
      }
      if (a === 'moon-next' && p.got.length === BLANK.length) return api.done();
      api.save(); this.draw(s, api);
    }
  };

  // ---------- 퍼즐 2: 별로 방향 찾기, 달이 지나는 길 ----------
  const DIPPER = [[150, 62], [190, 84], [214, 118], [222, 158], [188, 170], [200, 210], [236, 196]]; // 손잡이 끝부터, 마지막 두 별이 국자 끝
  function northSky(pick) {
    const [a, b] = [DIPPER[5], DIPPER[6]], dx = b[0] - a[0], dy = b[1] - a[1];
    const pole = [b[0] + dx * 5, b[1] + dy * 5]; // 국자 끝 두 별 사이의 다섯 배
    const cand = {a: [520, 214], b: pole.map(Math.round), c: [336, 58]};
    return `<svg class="sky-art" viewBox="0 0 640 300" role="img" aria-label="북쪽 밤하늘. 국자 모양의 북두칠성이 있고, 국자 끝의 두 별을 이은 선을 길게 늘인 곳에 별 나, 다른 곳에 별 가와 별 다가 있다."><rect width="640" height="300" rx="14" fill="${NIGHT}"/>${stars(46, 640, 250, 3)}
      <path d="M${DIPPER.slice(0, 4).map(p => p.join(' ')).join('L')}L${DIPPER[4].join(' ')}L${DIPPER[5].join(' ')}L${DIPPER[6].join(' ')}L${DIPPER[3].join(' ')}" fill="none" stroke="#9fb0e0" stroke-width="2" opacity=".8"/>
      ${DIPPER.map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="5" fill="${GLOW}"/>`).join('')}
      <path d="M${a.join(' ')}L${b.join(' ')}" stroke="#ffd66b" stroke-width="3"/><path d="M${b.join(' ')}L${(b[0] + dx * 6.2).toFixed(0)} ${(b[1] + dy * 6.2).toFixed(0)}" stroke="#ffd66b" stroke-width="2" stroke-dasharray="6 7" opacity=".85"/>
      <text x="112" y="44" text-anchor="middle" font-size="16" fill="#cfd8f5">북두칠성</text><text x="176" y="238" font-size="13" fill="#ffd66b">국자 끝의 두 별</text>
      ${Object.entries(cand).map(([k, [x, y]]) => `<circle cx="${x}" cy="${y}" r="${pick === k ? 9 : 6}" fill="${pick === k ? '#ffd66b' : '#fff'}"/><text x="${x + 14}" y="${y + 6}" font-size="18" font-weight="700" fill="#fff">${{a: '가', b: '나', c: '다'}[k]}</text>`).join('')}
      <rect y="268" width="640" height="32" fill="#141a2e"/><text x="320" y="290" text-anchor="middle" font-size="15" fill="#cfd8f5">북쪽 하늘을 바라본 모습</text></svg>`;
  }
  const TIMES = {
    dusk: {name: '해 질 녘', note: '오른쪽이 밝은 반달이 <b>남쪽 하늘 높이</b> 떠 있어요.', pos: [320, 78]},
    mid: {name: '한밤중', note: '달이 <b>서쪽</b> 땅끝에 걸려 있어요. 곧 져요.', pos: [566, 236]},
    dawn: {name: '새벽', note: '달은 <b>보이지 않아요.</b> 별빛뿐이에요.', pos: null}
  };
  function southSky(t) {
    const pos = t && TIMES[t].pos;
    return `<svg class="sky-art" viewBox="0 0 640 300" role="img" aria-label="남쪽 밤하늘. 왼쪽이 동쪽, 가운데가 남쪽, 오른쪽이 서쪽이다."><rect width="640" height="300" rx="14" fill="${t === 'dusk' ? '#3a3f66' : NIGHT}"/>${stars(t === 'dusk' ? 16 : 50, 640, 230, 7)}
      <path d="M70 244Q320 -90 570 244" fill="none" stroke="#9fb0e0" stroke-width="2" stroke-dasharray="5 8" opacity=".6"/>
      ${pos ? `<g>${moonShape('first', pos[0], pos[1], 24)}</g>` : ''}
      <rect y="244" width="640" height="56" fill="#141a2e"/><path d="M0 244h640" stroke="#4a557d" stroke-width="2"/>
      ${[['동', 70], ['남', 320], ['서', 570]].map(([d, x]) => `<text x="${x}" y="280" text-anchor="middle" font-size="22" font-weight="700" fill="#e6ecff">${d}</text>`).join('')}
      <text x="320" y="30" text-anchor="middle" font-size="14" fill="#cfd8f5">남쪽 하늘을 바라본 모습 · 점선은 달이 지나는 길</text></svg>`;
  }
  const SKYQ = [
    {q: '북극성을 바라보고 서면 그쪽이 북쪽이에요. 이때 <b>오른쪽</b>은 어느 쪽일까요?', opts: ['동쪽', '서쪽', '남쪽'], a: 0, ok: '북쪽을 보고 서면 오른쪽이 동쪽, 왼쪽이 서쪽, 등 뒤가 남쪽이에요.', no: '해는 동쪽에서 떠요. 북쪽을 보고 섰을 때 해가 뜨는 쪽은 오른손 쪽이에요.'},
    {q: '오른쪽이 밝은 반달(상현달)은 <b>언제</b> 지나요?', opts: ['해 질 녘', '한밤중', '새벽'], a: 1, ok: '상현달은 해 질 녘에 남쪽 하늘에 있다가, 한밤중에 서쪽으로 져요.', no: '세 때의 하늘을 다시 눌러 보세요. 달이 서쪽 땅끝에 걸린 때는 언제였나요?'},
    {q: '다리는 한밤중이 한참 지나서 끊어졌어요. 그때 은하수 강가는 어땠을까요?', opts: ['달빛으로 환했다', '달이 져서 캄캄했다'], a: 1, ok: '', no: '상현달은 한밤중에 져요. 그 뒤의 하늘에는 무엇이 남아 있었나요?'}
  ];
  const PATH = [['초승달', '해 질 녘 서쪽 하늘에 잠깐', '초저녁'], ['상현달 (오른쪽 반달)', '해 질 녘 남쪽 하늘', '한밤중'], ['보름달', '해 질 녘 동쪽에서 떠오름', '해 뜰 무렵'], ['하현달 (왼쪽 반달)', '한밤중에야 동쪽에서 떠오름', '한낮']];
  const pathTable = () => `<div class="tw"><table class="seat"><thead><tr><th scope="col">달</th><th scope="col">저녁 하늘에서</th><th scope="col">지는 때</th></tr></thead><tbody>${PATH.map((r, i) => `<tr${i === 1 ? ' class="soil-target"' : ''}><th scope="row">${r[0]}</th><td>${r[1]}</td><td>${r[2]}</td></tr>`).join('')}</tbody></table></div>`;
  const SKY = {
    auto: () => [['sky-star', 'a'], ['sky-star', 'b'], ['sky-q', '0'], ['sky-time', 'dusk'], ['sky-time', 'mid'], ['sky-time', 'dawn'], ['sky-q', '0'], ['sky-q', '1'], ['sky-q', '1'], ['sky-next', '']],
    draw(s, api) {
      const p = api.P(), a = api.action, step = p.step || 0, seen = Array.isArray(p.seen) ? p.seen : (p.seen = []);
      const fb = p.msg ? `<p class="feedback" role="status">${api.esc(p.msg)}</p>` : '';
      const ask = i => `<p class="pick-question">${SKYQ[i].q}</p><div class="row">${SKYQ[i].opts.map((o, k) => a('sky-q', o, k, 'seal blue')).join('')}</div>`;
      let body;
      if (step === 0) body = `<h2>별로 방향 찾기</h2><p class="muted">하늘에서는 별이 길잡이예요. <b>북두칠성의 국자 끝 두 별</b>을 이은 다음, 그 길이의 다섯 배만큼 더 가면 언제나 북쪽에 있는 <b>북극성</b>이 있어요. 북극성은 어느 별일까요?</p>${northSky(p.pick)}${fb}<div class="row">${['a', 'b', 'c'].map(k => a('sky-star', '별 ' + {a: '가', b: '나', c: '다'}[k], k, 'seal blue')).join('')}</div>`;
      else if (step === 1) body = `<h2>별로 방향 찾기</h2><p class="muted">북극성을 찾았어요. 북극성이 있는 쪽이 북쪽이에요.</p>${northSky('b')}${fb}${ask(0)}`;
      else if (step < 5) body = `<h2>칠석날 달이 지나는 길</h2><p class="muted">이번에는 돌아서서 <b>남쪽 하늘</b>을 봐요. 남쪽을 보고 서면 왼쪽이 동쪽, 오른쪽이 서쪽이에요. 세 때를 모두 눌러 칠석날 달이 어디에 있는지 살펴보세요.</p>${southSky(p.t)}<div class="row sky-times">${Object.entries(TIMES).map(([k, t]) => a('sky-time', t.name + (seen.includes(k) ? ' ✓' : ''), k, 'seal sm' + (p.t === k ? ' fill' : ''))).join('')}</div>${p.t ? `<p class="gl">${TIMES[p.t].name}: ${TIMES[p.t].note}</p>` : ''}${fb}${step >= 3 ? ask(step - 2) : `<p class="muted">${seen.length} / 3 살펴봄</p>`}`;
      else body = `<h2>칠석날 달이 지나는 길</h2>${southSky('dawn')}<div class="lab-explanation" role="status"><span class="result-seal">관측 성공</span><h3>달은 모양에 따라 뜨고 지는 때가 달라요</h3>${pathTable()}<p>같은 반달이어도 상현달은 한밤중에 지고, 하현달은 한밤중에야 떠올라요. 어느 반달인지 알아야 그 밤이 밝았는지 알 수 있어요.</p>${a('sky-next', '달이 지나는 길을 증거함에 넣기 →')}</div>`;
      api.$('#view').innerHTML = `<section class="board puzzle-board"><div class="section-kicker">샛별이의 하늘 읽기</div>${body}<p class="science-note">달이 뜨고 지는 때는 날짜와 계절에 따라 조금씩 달라요. 여기서는 초저녁, 한밤중, 새벽으로 크게 나누었어요.</p></section>`;
    },
    act(a, v, s, api) {
      const p = api.P(), step = p.step || 0;
      const answer = i => { if (+v === SKYQ[i].a) { p.step = step + 1; p.msg = SKYQ[i].ok; } else p.msg = SKYQ[i].no; };
      if (a === 'sky-star' && step === 0) {
        p.pick = v;
        if (v === 'b') { p.step = 1; p.msg = '맞아요! 국자 끝 두 별을 이은 선을 다섯 배 늘인 곳에 있는 별 나가 북극성이에요.'; }
        else p.msg = '그 별은 국자 끝 두 별을 이은 선 위에 있지 않아요. 노란 점선을 따라가 보세요.';
      }
      if (a === 'sky-q' && step === 1) answer(0);
      if (a === 'sky-time' && step >= 2 && step < 5 && TIMES[v]) {
        p.t = v; if (!p.seen.includes(v)) p.seen.push(v);
        if (step === 2) { p.msg = ''; if (p.seen.length === 3) p.step = 3; }
      }
      if (a === 'sky-q' && (step === 3 || step === 4)) answer(step - 2);
      if (a === 'sky-next' && step >= 5) return api.done();
      api.save(); this.draw(s, api);
    }
  };

  // ---------- 증거 그림 ----------
  const ropeArt = (n, total = 7) => `<svg class="sack-art" viewBox="0 0 640 ${40 + total * 20}" aria-hidden="true"><rect width="640" height="${40 + total * 20}" rx="14" fill="${NIGHT}"/>${Array.from({length: total}, (_, i) => i < n
    ? `<path d="M40 ${30 + i * 20}q70-10 140 0t140 0t140 0t140 0" fill="none" stroke="#dfe6f2" stroke-width="5" stroke-linecap="round"/><circle cx="600" cy="${30 + i * 20}" r="6" fill="#ffd66b"/>`
    : `<path d="M40 ${30 + i * 20}h560" stroke="#6f7aa0" stroke-width="2" stroke-dasharray="4 10" opacity=".6"/>`).join('')}</svg>`;
  const viewArt = () => `<svg class="sky-art" viewBox="0 0 640 300" role="img" aria-label="서쪽 강가 계수나무에서 다리 쪽을 바라본 모습. 다리는 정면에 있고, 북극성과 북두칠성은 왼쪽 하늘에 있다."><rect width="640" height="300" rx="14" fill="${NIGHT}"/>${stars(40, 640, 190, 5)}
    <g transform="translate(40 16) scale(.42)"><path d="M${DIPPER.slice(0, 4).map(p => p.join(' ')).join('L')}L${DIPPER[4].join(' ')}L${DIPPER[5].join(' ')}L${DIPPER[6].join(' ')}L${DIPPER[3].join(' ')}" fill="none" stroke="#9fb0e0" stroke-width="4"/>${DIPPER.map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="8" fill="${GLOW}"/>`).join('')}</g>
    <circle cx="215" cy="69" r="8" fill="#ffd66b"/><text x="230" y="75" font-size="16" font-weight="700" fill="#ffd66b">북극성</text>
    <path d="M0 214h640v86H0z" fill="#1b2a52"/><path d="M0 226q80-10 160 0t160 0t160 0t160 0" fill="none" stroke="#5f76b5" stroke-width="2" opacity=".7"/>
    <path d="M230 214q90-46 180 0" fill="none" stroke="#dfe6f2" stroke-width="5"/><path d="M250 205v9M290 192v22M320 188v26M350 192v22M390 205v9" stroke="#dfe6f2" stroke-width="3"/>
    <text x="320" y="262" text-anchor="middle" font-size="17" font-weight="700" fill="#e6ecff">정면 · 다리가 놓이는 쪽 (동쪽)</text><text x="70" y="286" text-anchor="middle" font-size="15" fill="#cfd8f5">← 왼쪽 (북쪽)</text><text x="570" y="286" text-anchor="middle" font-size="15" fill="#cfd8f5">오른쪽 (남쪽) →</text></svg>`;
  const VIEW = {
    rope: () => `<div class="observation-heading"><span>은하수 나루 · 강물에서 건진 것</span><b>끊어진 밧줄</b></div>${ropeArt(3, 3)}<p class="gl">다리에 걸려 있던 은실 밧줄이에요. 세어 보니 <b>세 가닥</b>뿐이에요.</p><p class="gl">끊어진 끝은 올이 길게 풀려 늘어나 있어요. 가닥 끝마다 작은 <b>별 매듭</b>이 지어져 있어요.</p>`,
    loom: () => `<article class="evidence-document ledger-doc"><span class="doc-overline">직녀의 베틀방 · 칠월 초엿새(6일)</span><h3>칠석 밧줄을 꼰 기록</h3><div class="ledger-grid"><span>만든 것</span><strong>칠석 밧줄 한 타래</strong><span>꼰 실</span><strong>은실 일곱 가닥</strong><span>표시</span><strong>가닥마다 끝에 별 매듭을 지음</strong><span>건넨 곳</span><strong>밧줄 창고 (받은 이: 까악 서기)</strong></div><p class="doc-copy">“일곱 가닥이어야<br>두 사람의 무게를 견딘다.”</p><p class="doc-signer">적은 이 · 직녀</p></article>`,
    store: () => `<article class="evidence-document ledger-doc"><span class="doc-overline">하늘 관아 · 밧줄 창고 장부</span><h3>밧줄이 들고 난 기록</h3><div class="ledger-grid"><span>6일 저녁</span><strong>은실 밧줄 한 타래 들어옴 (받은 이: 까악 서기)</strong><span>7일 해 질 녘</span><strong>밧줄 내줌 (내준 이: 까악 서기, 받은 이: 깍 대장)</strong><span>창고 열쇠</span><strong>까악 서기 혼자 맡음</strong><span>그사이 드나든 이</span><strong>없음</strong></div><p class="doc-signer">적은 이 · 서기 까악</p></article>`,
    calendar: () => `<article class="evidence-document note-doc"><span class="doc-overline">별지기 관측대 · 하늘 달력</span><h3>어젯밤은 며칠이었나</h3><p class="doc-copy">다리가 끊어진 어젯밤은<br><b>음력 7월 7일, 칠석.</b><br>오늘은 음력 7월 8일.</p><p class="doc-signer">별지기는 날마다 달과 별을 그려 둠</p></article>`,
    stake: () => `<article class="evidence-document note-doc"><span class="doc-overline">동쪽 강가 · 밧줄을 묶는 말뚝</span><h3>말뚝과 깃털</h3><p class="doc-copy">말뚝에 묶인 밧줄 매듭은 <b>풀리지 않고 그대로</b>임.<br>둘레에 까치 깃털과 까마귀 깃털이<br>뒤섞여 떨어져 있음.<br>다리를 놓던 새들의 것.</p><p class="doc-signer">살핀 이 · 나바름</p></article>`,
    view: () => `<div class="observation-heading"><span>서쪽 강가 계수나무 · 가지에 앉아 본 모습</span><b>계수나무에서 본 하늘</b></div>${viewArt()}<p class="gl">서쪽 강가에서 다리를 바라보면 <b>동쪽</b>을 보게 돼요. 이때 북극성은 <b>왼쪽</b> 하늘에 있어요.</p>`,
    moonlog: () => `<div class="observation-heading"><span>법정에서 완성한 기록</span><b>달 모양 기록</b></div>${moonStrip(BLANK)}<p class="gl">음력 <b>7일</b>의 달은 <b>오른쪽이 밝은 반달, 상현달</b>이에요. 보름달은 15일쯤에 떠요.</p><p class="gl">왼쪽이 밝은 반달(하현달)은 22일쯤의 달이에요.</p>`,
    moonpath: () => `<div class="observation-heading"><span>법정에서 살펴본 기록</span><b>달이 지나는 길</b></div>${pathTable()}<p class="gl">달은 모양에 따라 뜨고 지는 때가 달라요. <b>상현달은 한밤중에 지고, 하현달은 한밤중에야 떠올라요.</b></p><p class="gl">어느 반달인지는 이 표만으로는 알 수 없어요. 날짜를 알아야 해요.</p>`,
    heard: () => `<article class="evidence-document note-doc"><span class="doc-overline">법정 기록 · 견우의 말</span><h3>견우가 들은 소리</h3><p class="doc-copy">“다리에 오를 때 ‘딱, 딱’ 소리가 났소.<br><b>바로 옆, 동쪽 강가 말뚝 곁</b>에서<br>까악 서기가 ‘깍 대장이 밧줄을 쫀다!’ 하고 외쳤소.<br>캄캄해서 <b>눈으로 본 것은 없소.</b>”</p><p class="doc-signer">말한 이 · 견우</p></article>`,
    nest: () => `<article class="evidence-document note-doc"><span class="doc-overline">계수나무 꼭대기 · 까악 서기의 둥지</span><h3>둥지에서 나온 것</h3><p class="doc-copy"><b>은실 네 가닥.</b><br>가닥마다 끝에 <b>별 매듭</b>이 지어져 있음.<br>반짝이는 조약돌, 유리구슬, 놋단추.</p><p class="doc-signer">살핀 이 · 하늘 포졸 기러기</p></article>`
  };

  // ---------- 사라진 가닥 ----------
  const STRANDS = {
    kicker: '작은 수학 수사',
    title: '사라진 은실은 몇 가닥?',
    intro: '직녀가 꼰 밧줄과 강물에서 건진 밧줄의 가닥 수를 견주어 보세요.',
    label: '사라진 가닥', unit: '가닥', max: 7, answer: 4,
    visual: control => `<div class="weigh"><div class="weigh-card"><span>직녀의 베틀 기록</span><b>7가닥</b><small>두 사람의 무게를 견디는 밧줄</small></div><div class="weigh-card"><span>강물에서 건진 밧줄</span><b>3가닥</b><small>다리에 걸려 있던 밧줄</small></div><div class="weigh-card ask"><span>사라진 가닥</span>${control}<small>7 − 3 = ?</small></div></div>${ropeArt(3, 7)}`,
    wrong: '직녀가 꼰 가닥 수에서, 다리에 걸려 있던 가닥 수를 빼 보세요.',
    hint: ['두 수의 차이', '일곱 가닥 가운데 세 가닥만 남았어요. 7 − 3 은 얼마일까요?']
  };

  // ---------- 진범 지목 ----------
  const ACCUSE = {
    kicker: '진범 지목',
    title: '오작교를 끊어지게 한 이는 누구일까요?',
    intro: '지금까지의 증거가 가리키는 <b>한 사람</b>을 짚어 주세요.',
    suspects: ['kkachi', 'kkaak', 'gyeonu', 'jiknyeo'],
    culprit: 'kkaak',
    wrong: {
      kkachi: '깍 대장은 창고에서 받은 밧줄을 그대로 걸었어요. 밧줄을 쪼는 것을 눈으로 본 사람은 아무도 없었지요.',
      gyeonu: '견우는 한 해 동안 이 밤을 기다린 사람이에요. 스스로 다리를 끊을 까닭이 없어요.',
      jiknyeo: '직녀는 일곱 가닥으로 밧줄을 꼬아 건넸어요. 가닥이 사라진 것은 그 뒤의 일이에요.'
    },
    need: 3,
    proofTitle: '까악 서기가 했다는 근거는?',
    proofIntro: '서기와 이 일을 <b>이어 주는</b> 증거를 세 개 골라 주세요. 그날 밤 하늘이 어땠는지 알려 주는 증거와, 밧줄에 누가 손을 댔는지 알려 주는 증거는 달라요.',
    proof: ['store', 'nest', 'loom', 'heard', 'view'],
    why: {
      rope: '끊어진 밧줄은 가닥이 모자랐다는 것을 알려 줘요. 누가 가닥을 뺐는지는 알려 주지 않아요.',
      calendar: '달력은 그날이 며칠인지 알려 줄 뿐이에요.',
      stake: '말뚝의 매듭과 깃털은 다리를 놓던 새들 모두의 것이에요. 서기 한 사람을 가리키지 않아요.',
      moonlog: '달 모양 기록은 서기의 말이 사실과 다르다는 것을 보여 줘요. 하지만 밧줄에 누가 손을 댔는지는 알려 주지 않아요.',
      moonpath: '달이 지나는 길은 그 밤이 캄캄했다는 것을 알려 줘요. 밧줄에 누가 손을 댔는지는 알려 주지 않아요.'
    }
  };

  const VERDICT = {
    kicker: '사건 번호 009 · 최종 판결',
    stamp: '무죄',
    title: '깍 대장의 누명을 벗겼어요.',
    sub: '“달이 밝아 똑똑히 보았다”는 말은, 그날 밤의 달이 깨뜨렸어요.',
    cards: [
      {title: '하늘의 판결 · 북두 판관', who: 'bukdu', text: '깍 대장에게는 죄가 없노라. 까악 서기는 은실 네 가닥을 모두 돌려주고, 직녀를 도와 밧줄을 다시 꼬아라. 그리고 깍 대장과 까치들에게 사과하라. 견우와 직녀는 들은 것을 본 것처럼 말하였으나 스스로 바로잡았다. 다리가 다시 놓이는 내일 밤, 하루를 더 만나도록 허락하노라.'},
      {modern: true, title: '오늘의 시선 · 한저울 판사', who: 'judge', text: '“달이 밝아서 똑똑히 봤다”는 말은 그날의 달이 어떤 모양이었고 언제 졌는지 알면 확인할 수 있어요. 오늘날의 재판에서도 그날 달이 뜨고 진 때, 날씨, 해가 진 때를 살펴서 본 사람의 말이 맞는지 따져 봅니다. 본 사람의 말도 확인이 필요한 증거예요.'}
    ],
    strip: [['수학', '7 − 3 = 4가닥'], ['과학', '달의 모양과 지는 때'], ['과학', '북극성으로 방향 찾기']],
    note: '음력 7일 무렵의 달은 상현달이에요. 상현달은 한낮에 떠서 해 질 무렵 남쪽 하늘에 보이고, 한밤중에 서쪽으로 져요. 정확한 때는 날짜와 계절에 따라 조금씩 달라요.',
    foot: '옛이야기의 인물을 활용해 만든 이야기 속 재판입니다.'
  };

  return {
    n: 9, classic: '견우직녀', title: '오작교가 끊어진 밤',
    helper: 'saetbyeol',
    court: 'skycourt',
    rules: {pair: true, combo: true, coins: 3},
    portraits: ['baleum', 'bukdu', 'kkachi', 'kkaak', 'gyeonu', 'jiknyeo', 'saetbyeol', 'judge'],
    chars: {
      baleum: '나바름',
      bukdu: '북두 판관',
      kkachi: '깍 대장',
      kkaak: '까악 서기',
      gyeonu: '견우',
      jiknyeo: '직녀',
      saetbyeol: '샛별이',
      judge: '한저울 판사',
      narr: ''
    },
    glossary: {
      '칠석': '음력 7월 7일이에요. 옛이야기에서 견우와 직녀가 한 해에 한 번 만나는 날이에요.',
      '오작교': '칠석날 까마귀와 까치가 은하수에 놓는다는 다리예요.',
      '은하수': '밤하늘에 강처럼 길게 보이는 별의 무리예요.',
      '증거': '어떤 일이 있었는지 확인하는 데 도움이 되는 물건이나 기록이에요.',
      '증언': '자기가 보고 들은 일을 법정에서 말하는 것이에요.',
      '모순': '앞에서 한 말과 뒤에서 한 말이 서로 맞지 않는 것이에요.',
      '음력': '달의 모양이 변하는 것을 기준으로 날짜를 세는 달력이에요.',
      '상현달': '음력 7~8일쯤에 보이는, 오른쪽이 밝은 반달이에요.',
      '하현달': '음력 22~23일쯤에 보이는, 왼쪽이 밝은 반달이에요.',
      '북극성': '언제나 북쪽 하늘에 있는 별이에요. 방향을 찾는 길잡이가 돼요.'
    },
    evidence: {
      rope: {name: '끊어진 밧줄', short: '강물에서 건진 은실 밧줄', icon: 'note', view: VIEW.rope},
      loom: {name: '직녀의 베틀 기록', short: '칠석 밧줄을 꼰 기록', icon: 'ledger', view: VIEW.loom},
      store: {name: '밧줄 창고 장부', short: '밧줄이 창고에 들고 난 기록', icon: 'ledger', view: VIEW.store},
      calendar: {name: '하늘 달력', short: '다리가 끊어진 밤의 날짜', icon: 'order', view: VIEW.calendar},
      stake: {name: '말뚝과 깃털', short: '동쪽 강가의 말뚝을 살핀 기록', icon: 'note', view: VIEW.stake},
      view: {name: '계수나무에서 본 하늘', short: '서쪽 강가에서 다리를 바라본 모습', icon: 'map', view: VIEW.view},
      heard: {name: '견우가 들은 소리', short: '다리에 오를 때 견우가 들은 것', icon: 'note', view: VIEW.heard},
      moonlog: {name: '달 모양 기록', short: '음력 날짜마다 달라지는 달의 모양', icon: 'table', view: VIEW.moonlog},
      moonpath: {name: '달이 지나는 길', short: '달의 모양에 따라 뜨고 지는 때', icon: 'table', view: VIEW.moonpath},
      nest: {name: '둥지에서 나온 것', short: '까악 서기의 둥지를 살핀 기록', icon: 'jar', view: VIEW.nest}
    },
    places: [
      {id: 'eunha', name: '은하수 나루', art: 'eunha', ev: 'rope', who: 'kkachi', line: '강물에서 건져 낸 밧줄이오. 내가 창고에서 받아 다리에 건 바로 그 밧줄이오.'},
      {id: 'loomroom', name: '직녀의 베틀방', art: 'loomroom', ev: 'loom', who: 'jiknyeo', line: '밧줄을 꼰 날 적어 둔 기록이에요. 해마다 똑같이 만들어요.'},
      {id: 'ropestore', name: '밧줄 창고', art: 'ropestore', ev: 'store', who: 'kkaak', line: '창고 장부입니다. 제가 빈틈없이 적어 두었지요.'},
      {id: 'obs', name: '별지기 관측대', art: 'obs', ev: 'calendar', who: 'saetbyeol', line: '제가 일하는 관측대예요. 달력을 보면 어젯밤이 며칠인지 알 수 있어요.'},
      {id: 'eastbank', name: '동쪽 강가', art: 'eastbank', ev: 'stake', who: 'baleum', line: '밧줄의 한쪽 끝을 묶어 두는 말뚝이야. 매듭과 둘레를 살펴보자.'},
      {id: 'westbank', name: '서쪽 강가 계수나무', art: 'westbank', ev: 'view', who: 'saetbyeol', line: '까악 서기가 밤새 앉아 있었다는 나무예요. 여기서 다리를 보면 하늘이 이렇게 보여요.'}
    ],
    witnesses: {
      jiknyeo: {
        who: 'jiknyeo', title: '첫 심문 · 밧줄을 꼰 직녀',
        statements: [
          {text: '저는 은하수 서쪽에서 베를 짜는 직녀예요. 한 해에 단 하루, 칠석에만 견우 님을 만날 수 있어요.', cards: [{q: '오작교는 어떻게 놓나요?', a: '까치와 까마귀들이 제가 꼰 은실 밧줄을 물고 강 위에 늘어서요. 그 등을 밟고 건너지요.'}]},
          {text: '올해 밧줄도 제가 은실 일곱 가닥을 꼬아 만들었어요. 두 사람이 올라서도 끄떡없는 밧줄이에요.', cards: [{q: '가닥 수가 왜 중요한가요?', a: '가닥이 많을수록 튼튼해요. 일곱 가닥이어야 두 사람의 무게를 견뎌요.'}]},
          {text: '어젯밤 다리에 걸린 밧줄은 제가 꼰 일곱 가닥 그대로였어요. 제 손으로 만든 것을 제가 모를까요.', cards: [{q: '다리에 걸린 밧줄을 가까이에서 살펴보셨나요?', a: '아니요… 캄캄해서 보지는 못했어요. 당연히 그대로일 거라 생각했지요.', mood: 'sweat'}]},
          {text: '그렇게 튼튼한 밧줄이 저절로 끊어질 리 없어요. 누가 일부러 끊은 거예요.', cards: [{q: '누가 끊었다고 생각하세요?', a: '까악 서기가 그랬어요. 깍 대장이 부리로 쪼는 것을 보았다고요.'}]},
          {text: '다리를 맡은 깍 대장이 끊었다니… 믿고 싶지 않지만, 본 이가 있다니 어쩌겠어요.', cards: [{q: '깍 대장과는 사이가 어땠나요?', a: '해마다 다리를 놓아 준 고마운 벗이에요. 그래서 더 슬퍼요.', mood: 'sad'}]}
        ],
        solve: {evidence: 'rope', statements: [2], near: [
          {evidence: 'loom', text: '베틀 기록에는 일곱 가닥이 맞아요. 그런데 다리에 걸렸던 밧줄도 정말 그대로였을까요? 건져 낸 밧줄을 살펴본 증거가 있어요.'},
          {evidence: 'rope', statements: [1, 3], text: '밧줄을 살펴본 것은 좋은 눈이에요. 직녀가 「다리에 걸린 밧줄」에 대해 말한 증언에 내밀어 보세요.'}
        ]},
        hints: ['직녀는 다리에 걸린 밧줄을 직접 보지는 못했대요.', '직녀가 꼰 밧줄의 가닥 수와, 강물에서 건진 밧줄의 가닥 수를 견주어 보세요.'],
        wrong: '직녀가 직접 본 것과, 그럴 거라고 짐작한 것을 나누어 보세요.',
        success: [
          L('baleum', '강물에서 건진 밧줄은 세 가닥뿐입니다. 직녀 님이 꼰 일곱 가닥 그대로가 아닙니다!', 'stern', {shout: true}),
          L('jiknyeo', '세 가닥이라니요? 그럴 리가… 분명 일곱 가닥을 꼬았어요.', 'shock'),
          L('saetbyeol', '없어진 가닥이 몇 가닥인지부터 세어 봐요!')
        ]
      },
      gyeonu: {
        who: 'gyeonu', title: '두 번째 심문 · 동쪽 강가의 견우',
        statements: [
          {text: '나는 은하수 동쪽에서 소를 치는 견우요. 어젯밤 동쪽 강가에서 다리가 놓이기를 기다렸소.', cards: [{q: '다리가 놓이는 데 얼마나 걸렸나요?', a: '해 질 녘에 시작해서, 한밤중이 한참 지나서야 다 놓였소.'}]},
          {text: '초저녁에는 반달이 남쪽 하늘에 떠서 강물이 반짝였소.', cards: [{q: '어느 쪽이 밝은 반달이었나요?', a: '오른쪽이 밝았소. 직녀를 기다리며 내내 올려다보았으니 틀림없소.'}]},
          {text: '다리가 다 놓였을 때는 달이 서쪽 산 너머로 진 뒤였소. 어찌나 캄캄한지 내 소의 뿔도 보이지 않았지.', cards: [{q: '달이 진 것이 확실한가요?', a: '확실하오. 달이 지는 것을 보며 “이제 곧 만나겠구나” 했으니.'}]},
          {text: '다리에 오르는데 “딱, 딱” 소리가 났소. 그때 까악 서기가 “깍 대장이 밧줄을 쫀다!” 하고 외쳤지.', cards: [{q: '까악 서기는 그때 어디에 있었나요?', a: '내 바로 옆, 동쪽 강가 말뚝 곁이었소. 목소리가 귓전에서 났으니.'}]},
          {text: '돌아보니 다리 한가운데에서, 달빛에 번쩍이는 깍 대장의 부리가 똑똑히 보였소.', cards: [{q: '정말 눈으로 보셨나요?', a: '그, 그야… 서기가 그리 외치니, 본 것만 같았소.', mood: 'sweat'}]}
        ],
        solve: {pair: [2, 4], near: [
          {pair: [1, 4], text: '초저녁에 달이 떠 있었던 것은 맞아요. 하지만 다리에 오른 것은 그보다 한참 뒤예요. 그때의 하늘을 말한 증언을 찾아보세요.'},
          {pair: [3, 4], text: '소리를 들은 것과 눈으로 본 것은 달라요. 좋은 눈이에요. 그런데 그때는 무엇을 볼 수 있을 만큼 밝았을까요?'}
        ]},
        hints: ['견우는 다리에 오를 때 하늘이 어땠다고 했나요?', '캄캄했다는 증언과, 똑똑히 보았다는 증언을 맞대어 보세요.'],
        wrong: '견우의 말끼리 견주어 보세요. 서로 어긋나는 두 증언을 찾아 「두 증언 맞대기」를 눌러 보세요.',
        success: [
          L('baleum', '소의 뿔도 보이지 않을 만큼 캄캄했는데, 달빛에 번쩍이는 부리를 어떻게 보셨습니까!', 'stern', {shout: true}),
          L('gyeonu', '…그렇구려. 나는 소리를 듣고, 서기의 외침을 들었을 뿐이오. 눈으로 본 것은 아니오.', 'sad'),
          L('baleum', '견우 님이 들은 것을 그대로 기록해 두겠습니다.'),
          L('kkaak', '견우 님은 못 보셨어도 저는 보았습니다! 달이 휘영청 밝았으니까요.', 'stern'),
          L('saetbyeol', '달이요? 달이라면 제가 날마다 그려 두었어요. 관측 기록을 같이 봐요!', 'happy')
        ]
      },
      kkaak1: {
        who: 'kkaak', title: '서기의 첫 번째 말 · 휘영청 밝은 달',
        statements: [
          {text: '저는 하늘 관아의 서기 까악입니다. 밧줄 창고와 장부를 맡고 있지요.', cards: [{q: '창고 열쇠는 누가 가지고 있나요?', a: '저 혼자 맡고 있습니다. 그만큼 믿음직하다는 뜻이지요.'}]},
          {text: '어젯밤 한밤중이 지나, 저는 강가 계수나무에 앉아 다리를 지켜보고 있었습니다.', cards: [{q: '왜 다리를 지켜보셨나요?', a: '서기로서 다리가 잘 놓이는지 살피는 것이 일이니까요.'}]},
          {text: '그때 깍 대장이 다리 한가운데에서 부리로 밧줄을 딱딱 쪼는 것을 보았습니다.', cards: [{q: '강 한가운데까지는 꽤 멀지 않나요?', a: '멀지요. 하지만 밝아서 잘 보였습니다.'}]},
          {text: '하늘에는 둥근 보름달이 휘영청 밝아서, 깃털 하나하나까지 똑똑히 보였지요.', cards: [{q: '달이 정말 둥글었나요?', a: '그럼요. 쟁반같이 둥근 달이었습니다.'}]},
          {text: '그러니 다리를 끊은 것은 깍 대장입니다. 틀림없습니다.', cards: [{q: '깍 대장과 사이가 나빴나요?', a: '나쁘다니요. 그저… 칭찬은 늘 까치들 몫이더군요.', mood: 'sweat'}]}
        ],
        solve: {evidence: 'moonlog', statements: [3], near: [
          {evidence: 'calendar', text: '어젯밤이 음력 7일이라는 것은 맞아요. 그날의 달이 어떤 모양인지 보여 주는 기록을 내밀어 보세요.'},
          {evidence: 'rope', text: '밧줄이 약했다는 것은 이미 밝혔어요. 하지만 약한 밧줄도 쪼면 끊어지지요. 이번에는 서기가 정말 볼 수 있었는지를 따져 보세요.'},
          {evidence: 'heard', text: '견우는 눈으로 보지 못했어요. 그런데 서기는 자기는 보았다고 해요. 서기가 무엇 덕분에 보았다고 했는지 살펴보세요.'}
        ]},
        hints: ['서기는 무엇 덕분에 멀리까지 똑똑히 보았다고 했나요?', '어젯밤의 달이 어떤 모양이었는지, 방금 완성한 기록과 견주어 보세요.'],
        wrong: '서기의 말 가운데, 하늘의 기록으로 확인할 수 있는 것을 찾아보세요.',
        success: [
          L('baleum', '어젯밤은 음력 7일, 칠석입니다. 7일의 달은 보름달이 아니라 오른쪽이 밝은 반달입니다!', 'stern', {shout: true}),
          L('kkaak', '아, 그, 그렇지요. 반달이었습니다. 말이 헛나왔습니다.', 'sweat'),
          L('kkaak', '허나 반달이라도 달은 달! 밝기는 매한가지였습니다.', 'stern'),
          L('bukdu', '달이 떠 있기는 하였느냐. 별지기는 달이 뜨고 지는 때를 아느냐?'),
          L('saetbyeol', '그럼요! 먼저 방향부터 찾아야 해요. 하늘에서는 별이 길잡이예요.', 'happy', {words: ['북극성']})
        ]
      },
      kkaak2: {
        who: 'kkaak', title: '서기의 두 번째 말 · 반달도 달',
        statements: [
          {text: '보름달이라 한 것은 말이 헛나왔습니다. 반달이었지요. 반달이라도 은하수에 비쳐 제법 밝았습니다.', cards: [{q: '어느 쪽이 밝은 반달이었나요?', a: '그, 그런 것까지 누가 봅니까. 반달이면 다 같은 반달이지요.', mood: 'sweat'}]},
          {text: '다리는 한밤중이 한참 지나서 끊어졌습니다. 견우 님도 그리 말씀하셨지요.', cards: [{q: '그때까지 줄곧 깨어 계셨나요?', a: '물론입니다. 눈 한 번 붙이지 않았습니다.'}]},
          {text: '저는 그때까지 줄곧 달빛 아래에서 깍 대장을 지켜보았습니다.', cards: [{q: '달은 하늘 어디쯤에 있었나요?', a: '어디긴요. 하, 하늘 한가운데 높이 떠 있었지요.', mood: 'sweat'}]},
          {text: '다리가 끊어지는 바로 그 순간에도, 달빛에 깍 대장의 부리가 번쩍였습니다.', cards: [{q: '견우는 그때 캄캄했다고 했는데요?', a: '견우 님은 눈이 어두우신가 보지요.'}]},
          {text: '달 모양을 잠깐 헷갈렸다고 제 눈까지 의심하시면 섭섭합니다.', cards: [{q: '달 모양을 헷갈릴 수도 있나요?', a: '바쁜 서기가 달이나 올려다볼 틈이 있겠습니까.'}]}
        ],
        solve: {combo: ['moonlog', 'moonpath'], statements: [2, 3], near: [
          {combo: ['calendar', 'moonpath'], text: '날짜와 달이 지는 때를 함께 본 것은 좋아요. 그런데 7일의 달이 어느 반달인지 알려 주는 기록이 있어야 표에서 맞는 줄을 고를 수 있어요.'},
          {combo: ['moonlog', 'heard'], text: '견우의 말은 그 밤이 캄캄했다고 알려 줘요. 하지만 서기는 견우의 눈을 탓하지요. 사람의 말이 아니라 하늘의 기록 두 개로 맞서 보세요.'},
          {combo: ['moonpath', 'heard'], text: '견우의 말은 그 밤이 캄캄했다고 알려 줘요. 하지만 서기는 견우의 눈을 탓하지요. 사람의 말이 아니라 하늘의 기록 두 개로 맞서 보세요.'}
        ]},
        hints: ['반달에는 두 가지가 있어요. 뜨고 지는 때가 서로 달라요.', '어젯밤의 달이 어느 반달이었는지 알려 주는 기록과, 그 달이 언제 지는지 알려 주는 기록을 함께 내밀어 보세요.'],
        wrong: '서기가 말하는 「그때」 하늘에 정말 달이 있었을까요? 달의 모양과 달이 지는 때를 함께 따져 보세요.',
        success: [
          L('baleum', '7일의 달은 상현달이고, 상현달은 한밤중에 서쪽으로 집니다. 다리가 끊어진 것은 한밤중이 한참 지난 뒤, 달이 진 뒤입니다. 달빛은 없었습니다!', 'stern', {shout: true, words: ['상현달']}),
          L('kkaak', '그, 그럼… 별빛! 별빛에 보았습니다!', 'shock'),
          L('kkachi', '깃털 색도 가리기 어려운 별빛에, 강 한가운데의 부리를 보았단 말이오?', 'stern'),
          L('bukdu', '서기의 말이 세 번째 바뀌었도다. 밧줄은 창고에서 서기의 손을 거쳤다 하였지. 서기의 둥지를 살펴보아라.', 'stern'),
          L('narr', '하늘 포졸 기러기들이 까악 서기의 둥지를 살피고 돌아왔습니다.')
        ]
      },
      kkaak3: {
        who: 'kkaak', title: '서기의 세 번째 말 · 둥지와 계수나무',
        statements: [
          {text: '밧줄은 직녀 님께 받은 그대로 창고에 두었다가, 그대로 깍 대장에게 내주었습니다. 한 가닥도 건드리지 않았지요.', cards: [{q: '창고에 드나든 이가 또 있나요?', a: '없습니다. 열쇠는 저 혼자 맡으니까요. …아, 아니, 그게 무슨 뜻입니까.', mood: 'sweat'}]},
          {text: '제 둥지의 은실은 오래전에 강가에서 주운 것입니다. 이번 일과는 상관없습니다.', cards: [{q: '은실 끝의 매듭은 무엇인가요?', a: '매, 매듭이요? 주울 때부터 있었습니다.', mood: 'sweat'}]},
          {text: '저는 어젯밤 내내 서쪽 강가 계수나무에 앉아 다리를 바라보았습니다. 북극성이 오른쪽 어깨 위에서 빛났지요.', cards: [{q: '북극성이 오른쪽에 있었던 것이 확실한가요?', a: '확실합니다. 서기는 별자리쯤은 훤히 압니다.'}]},
          {text: '밧줄을 묶는 말뚝이 있는 동쪽 강가에는 얼씬도 하지 않았습니다.', cards: [{q: '견우를 만난 적도 없나요?', a: '없습니다. 강 건너편인데 어찌 만납니까.'}]},
          {text: '저는 그저 다리가 걱정되어 본 대로 말했을 뿐입니다.', cards: [{q: '반짝이는 것을 좋아하시나요?', a: '까, 까마귀가 반짝이는 걸 좋아하는 게 죄입니까!', mood: 'sweat'}]}
        ],
        solve: {evidence: 'nest', statements: [0], alt: [
          {evidence: ['nest', 'loom'], statements: [1]},
          {evidence: ['view', 'heard'], statements: [2]},
          {evidence: 'heard', statements: [3]}
        ], near: [
          {evidence: 'store', statements: [0], text: '장부를 보면 밧줄이 서기의 손을 거친 것은 맞아요. 하지만 건드렸는지는 장부만으로 알 수 없어요. 방금 둥지에서 나온 것을 살펴보세요.'},
          {evidence: 'rope', statements: [0, 1], text: '밧줄의 가닥이 모자란 것은 이미 밝혔어요. 사라진 가닥이 어디에서 나왔는지 알려 주는 증거를 내밀어 보세요.'},
          {evidence: 'stake', text: '말뚝 둘레의 깃털은 다리를 놓던 새들 모두의 것이에요. 서기 한 사람을 가리키는 증거를 찾아보세요.'}
        ]},
        hints: ['서기의 말은 하나하나가 다 수상해요. 어느 것이든 하나를 골라 보세요.', '건드리지 않았다는 말, 주운 것이라는 말, 서쪽 강가에 있었다는 말, 동쪽에는 가지 않았다는 말. 저마다 맞서는 증거가 있어요.'],
        wrong: '서기의 말 하나를 고르고, 그 말과 꼭 맞서는 증거를 내밀어 보세요.',
        success: [
          L('baleum', '서기의 둥지에서 은실 네 가닥이 나왔습니다. 가닥마다 직녀 님이 짓는 별 매듭이 달려 있습니다. 사라진 가닥도 꼭 네 가닥입니다!', 'stern', {shout: true}),
          L('baleum', '서쪽 강가에서 다리를 바라보면 북극성은 왼쪽에 있습니다. 오른쪽에 있었다면 동쪽 강가에 있었던 것입니다. 견우 님도 바로 옆에서 서기의 목소리를 들었습니다.'),
          L('kkaak', '까, 까악…', 'shock'),
          L('bukdu', '변호인. 다리를 끊어지게 한 이를 짚고, 그 근거를 대 보아라.', 'stern')
        ]
      }
    },
    custom: {moon: MOON, sky: SKY},
    stages: [
      {type: 'talk', chapter: '아홉 번째 의뢰', lines: [
        L('narr', '칠석날 밤, 나바름은 창가에서 별을 보다 깜빡 잠이 들었습니다.'),
        L('narr', '“변호인 나리! 일어나세요!” 눈을 떠 보니 은하수 강가, 하늘 관아였습니다.', 'normal', {fx: 'drum'}),
        L('bukdu', '나는 하늘의 재판을 맡은 북두 판관이니라. 어젯밤 칠석에 오작교가 끊어져, 견우와 직녀가 만나지 못하였다.', 'stern', {words: ['칠석', '오작교']}),
        L('kkaak', '다리를 끊은 것은 다리를 맡은 깍 대장입니다. 제가 이 두 눈으로 보았습니다.', 'stern'),
        L('kkachi', '억울하오! 나는 서른 해째 다리를 놓았소. 내 부리로 다리를 끊다니 당치 않소.', 'sad'),
        L('saetbyeol', '저는 별지기 샛별이예요. 밤마다 달과 별을 그려 둬요. 땅에서 소문난 변호인을 제가 불렀어요!', 'happy'),
        L('baleum', '나바름입니다. 깍 대장의 말을 대신 전하겠습니다. 어젯밤 은하수에서 무슨 일이 있었는지 따져 보겠습니다.', 'normal', {words: ['은하수']}),
        L('bukdu', '좋다. 하늘의 재판은 땅의 재판보다 까다로우니라. 증거로 말하라.', 'stern', {words: ['증거']}),
        L('saetbyeol', '여섯 곳을 둘러봐요. 기력 엽전은 세 닢뿐이에요. 증거 두 개를 함께 내밀어야 할 때도 있으니 꼼꼼히 봐요!')
      ]},
      {type: 'investigate', chapter: '여섯 곳의 단서', title: '칠석날 밤, 은하수에서 무슨 일이?'},
      {type: 'talk', chapter: '직녀의 증언', lines: [
        L('narr', '베틀 북을 손에 쥔 직녀가 눈물 자국이 남은 얼굴로 증인석에 섰습니다.'),
        L('jiknyeo', '한 해를 기다린 밤이었어요…', 'sad'),
        L('saetbyeol', '증언을 넘겨 보고, 이상한 말에 맞는 증거를 내밀어 보세요. 말끼리 어긋나면 두 증언을 맞대 보세요.', 'normal', {words: ['증언', '모순']})
      ]},
      {type: 'cross', id: 'jiknyeo', chapter: '일곱 가닥의 밧줄'},
      {type: 'count', chapter: '사라진 가닥', ...STRANDS, after: [
        L('baleum', '일곱 가닥 가운데 네 가닥이 사라졌습니다. 세 가닥 밧줄로는 두 사람의 무게를 견딜 수 없습니다.'),
        L('kkachi', '그렇다면 밧줄은 처음부터 약했던 것이오! 나는 받은 밧줄을 그대로 걸었을 뿐이오.'),
        L('kkaak', '어허, 약한 밧줄이라도 쪼지 않으면 끊어지지 않습니다. 견우 님께 여쭤보시지요. 견우 님도 보셨습니다.', 'stern'),
        L('narr', '소고삐를 쥔 견우가 증인석에 섰습니다.')
      ]},
      {type: 'cross', id: 'gyeonu', chapter: '캄캄한 강가', gain: 'heard'},
      {type: 'moon', chapter: '샛별이의 달 기록', gain: 'moonlog', after: [
        L('saetbyeol', '달은 날마다 조금씩 모양이 바뀌어요. 음력 7일의 달은 오른쪽이 밝은 반달, 상현달이에요.', 'happy', {words: ['음력', '상현달']}),
        L('baleum', '달 모양 기록을 증거로 남기겠습니다.'),
        L('bukdu', '서기 까악은 본 것을 말해 보아라.')
      ]},
      {type: 'cross', id: 'kkaak1', chapter: '휘영청 밝은 달'},
      {type: 'sky', chapter: '샛별이의 하늘 읽기', gain: 'moonpath', after: [
        L('saetbyeol', '달은 모양에 따라 뜨고 지는 때가 달라요. 상현달은 한밤중에 서쪽으로 지고, 하현달은 한밤중에야 떠올라요.', 'happy', {words: ['하현달']}),
        L('baleum', '달이 지나는 길도 증거로 남기겠습니다.'),
        L('kkaak', '흥, 반달이면 다 같은 반달이지요. 제 말을 마저 들어 보십시오.', 'stern')
      ]},
      {type: 'cross', id: 'kkaak2', chapter: '반달도 달', gain: 'nest'},
      {type: 'cross', id: 'kkaak3', chapter: '둥지와 계수나무'},
      {type: 'accuse', chapter: '진범 지목', ...ACCUSE, after: [
        L('baleum', '까악 서기는 창고에서 은실 네 가닥을 뽑아 둥지에 숨기고, 세 가닥뿐인 약한 밧줄을 내주었습니다. 다리가 끊어지자 깍 대장이 쪼았다고 외쳐 죄를 덮어씌웠습니다.', 'stern'),
        L('kkaak', '…은실이 어찌나 반짝이던지. 네 가닥쯤 빼도 모를 줄 알았습니다. 다리가 끊어질 줄은 몰랐어요.', 'sad'),
        L('kkaak', '해마다 칭찬은 까치들만 받는 것도 샘이 났습니다. 깍 대장, 미안합니다.', 'sad'),
        L('kkachi', '다리는 까치와 까마귀가 함께 놓는 것이오. 내년에는 그대들의 이름도 함께 불리도록 하겠소.'),
        L('jiknyeo', '밧줄은 제가 다시 꼴게요. 이번에는 서기님도 함께 꼬아요.', 'happy'),
        L('bukdu', '이제 판결을 내리겠노라.', 'stern')
      ]},
      {type: 'verdict', chapter: '증거가 이끄는 판결', ...VERDICT},
      {type: 'diary', chapter: '나의 판관 일기'},
      {type: 'end', chapter: '다시 놓인 다리'}
    ],
    landing: {
      intro: '칠석날 밤, 오작교가 끊어졌다.<br>“보름달 아래에서 똑똑히 보았다”는데,<br><strong>그날 밤의 달과 별로 진실을 밝혀 주세요.</strong>',
      start: '깍 대장의 사건 맡기',
      backdrop: 'eunha',
      people: [['kkachi', 'sad'], ['kkaak', 'stern'], ['baleum', 'normal']],
      bubble: '그날 밤의 달부터 따져 봅시다!',
      label: ['견우직녀 이야기에서 시작된 새로운 사건', '오작교가 끊어진 밤의 진실'],
      steps: ['단서 수집', '달과 별 읽기', '진범 지목'],
      credit: '초등 6학년부터 · 어려움 · 읽는 속도에 따라 약 45–55분 · 진행 자동 저장'
    },
    diary: {
      title: '이 재판에서 무엇을 생각했나요?',
      intro: '가장 마음에 드는 생각을 골라 주세요. 여기에는 정답이 없어요.',
      choices: [
        '“똑똑히 봤다”는 말도 그날의 달과 시간을 따져 확인해야 해요.',
        '탐나는 것이 있어도, 모두가 함께 쓰는 것을 몰래 빼면 안 돼요.',
        '들은 것과 본 것을 가려서 말해야 해요.'
      ],
      placeholder: '예: 오늘 밤 달이 어떤 모양인지 올려다볼 거예요.'
    },
    end: {
      backdrop: 'eunha',
      people: [['jiknyeo', 'happy'], ['gyeonu', 'happy']],
      quote: '“달이 진 밤에도, 별은 길을 알려 준답니다.”',
      kicker: '아홉 번째 사건 해결',
      title: '달이 진 밤의<br><em>진실을 밝혔어요.</em>',
      text: '다음 날 밤, 까치와 까마귀가 일곱 가닥 밧줄로 다리를 다시 놓았습니다.<br>나바름이 눈을 떠 보니 창밖에는 반달이 떠 있고, 머리맡에는 까치 깃털 하나가 놓여 있었습니다.',
      badges: ['달 관측가', '별 길잡이', '진범 지목']
    },
    guide: `<h3>제9화 · 교사·보호자 안내</h3><p>증언과 증거를 비교하며 사건을 해결하는 어린이 법정 추리 게임입니다.</p><p>아이가 답을 고른 까닭을 묻고, 서로 다른 증거가 같은 결론을 가리키는지 함께 살펴보세요. 책임 저울과 판관 일기에서는 자신의 생각을 근거와 함께 표현하도록 도와주세요.</p><p>사건의 해설과 교사용 정답은 교사용 검수실에서 비밀번호를 입력한 뒤 확인할 수 있습니다.</p><p class="muted">로그인이나 개인정보 입력 없이 사용하며, 진행 상황과 판관 일기는 이 브라우저에 저장됩니다. 화마다 진행 기록은 별개입니다.</p>`
  };
})();
