'use strict';
// 제8화 · 전우치전 — 도술인가, 과학인가
// 전우치전의 주인공을 빌려 새로 꾸민 사건입니다. 실험 결과는 이야기 속 관찰입니다.
// 자료 형식은 docs/episode-format.md, 사건 설계는 docs/episode8.md 를 보세요.
window.CASE = (() => {
  const L = (who, text, mood = 'normal', extra = {}) => ({who, text, mood, ...extra});
  const INK = '#3c332b';

  // ---------- 촛불과 덮개 그림 ----------
  /** size: 0 없음, 1 작은 덮개, 2 큰 덮개 / open: 위에 구멍과 아래에 틈 / lit: 불이 켜져 있는지 / left: 남은 초의 길이(0~1) */
  function candleArt({size = 1, open = false, lit = true, left = .7, w = 220, h = 190, label = ''} = {}) {
    const cx = w / 2, base = h - 26, ch = 30 + 52 * left, top = base - ch;
    const cw = size === 2 ? 150 : 96, chh = size === 2 ? 138 : 112, y0 = base - chh - (open ? 10 : 0);
    const cover = size ? `<path d="M${cx - cw / 2} ${base - (open ? 10 : 0)}V${y0 + 34}Q${cx - cw / 2} ${y0} ${cx - (open ? 9 : 0)} ${y0}${open ? `M${cx + 9} ${y0}` : ''}Q${cx + cw / 2} ${y0} ${cx + cw / 2} ${y0 + 34}V${base - (open ? 10 : 0)}" fill="#bfe0e6" fill-opacity=".28" stroke="#6f9aa6" stroke-width="3" stroke-linecap="round"/>${open ? `<path d="M${cx - cw / 2 + 4} ${base - 10}v10M${cx + cw / 2 - 4} ${base - 10}v10M${cx} ${base - 10}v10" stroke="#8a6a4a" stroke-width="5" stroke-linecap="round"/><path d="M${cx - 5} ${y0 - 16}q5-8 0-14M${cx + 5} ${y0 - 12}q5-8 0-14" fill="none" stroke="#9aa9a6" stroke-width="2" stroke-linecap="round"/>` : ''}` : '';
    const flame = lit ? `<path d="M${cx} ${top - 30}q11 14 0 24q-11-10 0-24z" fill="#f0a030" stroke="#c9631f" stroke-width="1.5"/><path d="M${cx} ${top - 20}q5 7 0 12q-5-5 0-12z" fill="#fff2b0"/>` : `<path d="M${cx} ${top - 8}q-7-9 0-17q7-8 0-16" fill="none" stroke="#9a9a94" stroke-width="2.5" stroke-linecap="round"/>`;
    return `<svg class="candle-art" viewBox="0 0 ${w} ${h}" aria-hidden="true"><rect width="${w}" height="${h}" rx="12" fill="#efe6cf"/><rect x="${cx - 92}" y="${base}" width="184" height="10" rx="4" fill="#8a6a4a"/><rect x="${cx - 11}" y="${top}" width="22" height="${ch}" rx="4" fill="#f7f0de" stroke="#b9ab8a" stroke-width="2"/><path d="M${cx} ${top}v-8" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/>${flame}${cover}${label ? `<text x="${cx}" y="${h - 4}" text-anchor="middle" font-size="13" fill="#6a5a49">${label}</text>` : ''}</svg>`;
  }

  // ---------- 꽃물 종이 ----------
  const HUE = {purple: ['#7d55a6', '보라색 그대로'], red: ['#c8475f', '붉은색으로 변함'], blue: ['#2f8f8f', '푸른색으로 변함']};
  const LIQ = {
    vinegar: {name: '식초', feel: '시큼한 냄새가 나요', to: 'red'},
    maesil: {name: '매실즙', feel: '시큼한 냄새가 나요', to: 'red'},
    water: {name: '맹물', feel: '아무 냄새도 없어요', to: 'purple'},
    lye: {name: '잿물', feel: '미끈미끈해요', to: 'blue'},
    lime: {name: '석회물', feel: '미끈미끈해요', to: 'blue'}
  };
  const strip = (to, name) => `<span class="ind-strip"><i style="background:${HUE[to][0]}"></i><b>${name}</b><small>${HUE[to][1]}</small></span>`;

  // ---------- 증거 그림 ----------
  const noticeArt = () => `<svg class="sack-art" viewBox="0 0 640 250" role="img" aria-label="관아 대문에 붙은 액막이 글. 글자가 붉게 변했는데, 왼쪽 아래 귀퉁이의 한 글자만 보라색으로 남아 있다. 붉은 글자 둘레에는 종이가 젖었다 마른 자국이 있다."><rect width="640" height="250" rx="14" fill="#d9c9a6"/><rect x="60" y="24" width="520" height="190" fill="#f6efdc" stroke="#9a875f" stroke-width="3"/>
    ${[0, 1, 2, 3, 4, 5, 6].map(i => `<g transform="translate(${118 + i * 68} 0)"><ellipse cx="0" cy="${i % 2 ? 126 : 92}" rx="34" ry="46" fill="#e7dcbc" opacity=".8"/><path d="M-14 ${i % 2 ? 98 : 64}h28m-14 0v56m-16-30h32m-28 30h24" fill="none" stroke="#c8475f" stroke-width="7" stroke-linecap="round"/></g>`).join('')}
    <g transform="translate(112 180)"><path d="M-12-14h24m-12 0v28m-12-14h24" fill="none" stroke="#7d55a6" stroke-width="6" stroke-linecap="round"/></g>
    <path d="M150 196q-20 14-34-2" fill="none" stroke="${INK}" stroke-width="2"/><text x="156" y="202" font-size="15" fill="${INK}">이 글자만 보라색 그대로</text><text x="320" y="240" text-anchor="middle" fill="#776b53" font-size="14">관아 대문에 붙은 액막이 글을 본 대로 그린 그림</text></svg>`;
  const VIEW = {
    candle: () => `<div class="observation-heading"><span>오늘 아침 · 관아 대청</span><b>꺼진 초와 덮개</b></div><div class="busts">${candleArt({size: 1, lit: false, left: .7})}</div><p class="gl"><b>초</b><br>불은 꺼졌지만 초는 <b>절반 넘게 남아</b> 있어요. 심지도 멀쩡해요.</p><p class="gl"><b>덮개</b><br>종 모양의 유리 덮개예요. 위가 막혀 있고, 아래는 받침에 <b>딱 붙어</b> 있어요.</p>`,
    covers: () => `<div class="observation-heading"><span>장터와 대청 · 두 덮개를 견준 그림</span><b>도인의 두 덮개</b></div><div class="busts">${candleArt({size: 1, open: true, lit: false, left: .5, label: '어제 장터에서 쓴 덮개'})}${candleArt({size: 1, lit: false, left: .7, label: '오늘 대청에서 쓴 덮개'})}</div><p class="gl"><b>어제 장터의 덮개</b><br>꼭대기에 손가락만 한 <b>구멍</b>이 있고, 세 발 받침 위에 놓여 아래에 <b>틈</b>이 있어요.</p><p class="gl"><b>오늘 대청의 덮개</b><br>위가 막혀 있고, 아래도 받침에 딱 붙어 있어요.</p>`,
    notice: () => `<div class="observation-heading"><span>오늘 아침 · 관아 대문</span><b>색이 변한 액막이 글</b></div>${noticeArt()}<p class="gl">어제 낮에는 모두 <b>보라색</b>이었던 글씨가 <b>붉은색</b>으로 변했어요. 그런데 귀퉁이의 <b>한 글자는 보라색 그대로</b>예요.</p><p class="gl">붉게 변한 글자 둘레에는 종이가 <b>젖었다 마른 자국</b>이 있고, <b>시큼한 냄새</b>가 나요.</p>`,
    dye: () => `<article class="evidence-document ledger-doc"><span class="doc-overline">염색집 장부 · 어제 아침</span><h3>꽃물 판 기록</h3><div class="ledger-grid"><span>판 것</span><strong>나팔꽃 꽃물 한 병 (보라색)</strong><span>사 간 이</span><strong>방울 달린 지팡이를 짚은 도인</strong><span>쓸 곳</span><strong>“붓글씨에 쓴다” 함</strong></div><p class="doc-copy">“이 꽃물은 닿는 것에 따라<br>색이 변하니 조심해서 쓰시오.”</p><p class="doc-signer">적은 이 · 염색집 주인</p></article>`,
    inn: () => `<article class="evidence-document ledger-doc"><span class="doc-overline">장터 주막 장부</span><h3>허허 도인이 묵은 기록</h3><div class="ledger-grid"><span>그제 저녁</span><strong>방을 잡음</strong><span>어제 저녁</span><strong>엽전 3꿰미를 맡김</strong><span>어젯밤</span><strong>밤 10시 종이 친 뒤 나갔다가, 자정이 넘어 돌아옴</strong><span>오늘 낮</span><strong>엽전 30꿰미를 맡김</strong></div><p class="doc-signer">적은 이 · 주막 주모</p></article>`,
    gate: () => `<article class="evidence-document note-doc"><span class="doc-overline">대문 옆 초소 · 문지기 일지</span><h3>어젯밤의 기록</h3><p class="doc-copy">“밤 11시쯤, 대문 쪽에서<br><b>딸랑딸랑 방울 소리</b>가 남.<br>나가 보니 아무도 없고<br><b>시큼한 냄새</b>만 남아 있었음.”</p><p class="doc-signer">적은 이 · 문지기 덕쇠</p></article>`,
    pack: () => `<article class="evidence-document note-doc"><span class="doc-overline">관아 옥 앞 · 전우치의 짐</span><h3>전우치의 봇짐에서 나온 것</h3><p class="doc-copy">낡은 책 세 권, 붓 한 자루, 먹과 벼루,<br>마른 떡 두 덩이, 부채 하나.<br><b>유리 덮개도, 꽃물도, 병도 없음.</b></p><p class="doc-signer">살핀 이 · 관아 포졸</p></article>`,
    lab1: () => `<div class="observation-heading"><span>법정에서 해 본 실험</span><b>촛불 실험 기록</b></div><div class="tw"><table class="seat"><thead><tr><th scope="col">초</th><th scope="col">덮개</th><th scope="col">구멍과 틈</th><th scope="col">불</th></tr></thead><tbody>${TRIALS.map(t => `<tr><th scope="row">${t.id}</th><td>${t.cover}</td><td>${t.gap}</td><td${t.out ? ' class="sick"' : ''}>${t.burn}</td></tr>`).join('')}</tbody></table></div><p class="gl">덮개 안의 <b>공기가 많을수록 오래</b> 타요. 새 공기가 <b>드나들면 꺼지지 않아요.</b><br>초가 타려면 공기 속의 산소가 필요해요.</p>`,
    lab2: () => `<div class="observation-heading"><span>법정에서 해 본 실험</span><b>꽃물 실험 기록</b></div><div class="ind-strips">${Object.values(LIQ).map(l => strip(l.to, l.name)).join('')}</div><p class="gl">보라색 나팔꽃 꽃물은 <b>신 것</b>(식초, 매실즙)이 닿으면 <b>붉은색</b>으로, <b>미끈미끈한 것</b>(잿물, 석회물)이 닿으면 <b>푸른색</b>으로 변해요. 맹물이 닿으면 변하지 않아요.</p>`,
    bag: () => `<article class="evidence-document note-doc"><span class="doc-overline">주막 · 허허 도인의 봇짐</span><h3>봇짐에서 나온 것</h3><p class="doc-copy">‘신령수’라고 적힌 병. <b>시큼한 냄새</b>가 남.<br>꽃물 종이에 한 방울 떨어뜨리니 <b>붉은색</b>으로 변함.<br>끝이 <b>보랏빛으로 물든 붓</b>과 넓은 솔.<br>나팔꽃 꽃물이 조금 남은 병.<br>부적 한 꾸러미.</p><p class="doc-signer">살핀 이 · 관아 포졸</p></article>`
  };

  // ---------- 퍼즐 1: 촛불 실험 (공정한 비교) ----------
  const TRIALS = [
    {id: 'A', title: '덮개 없음', cover: '없음', gap: '—', burn: '계속 탐', art: {size: 0}},
    {id: 'B', title: '작은 덮개', cover: '작은 덮개', gap: '없음', burn: '열을 셀 동안 타다 꺼짐', out: true, art: {size: 1, lit: false}},
    {id: 'C', title: '큰 덮개', cover: '큰 덮개', gap: '없음', burn: '서른을 셀 동안 타다 꺼짐', out: true, art: {size: 2, lit: false}},
    {id: 'D', title: '구멍 난 작은 덮개', cover: '작은 덮개', gap: '위에 구멍, 아래에 틈', burn: '계속 탐', art: {size: 1, open: true}}
  ];
  const CANDLES = {
    kicker: '초롱이의 촛불 실험',
    common: ['같은 굵기와 길이의 초', '같은 방, 바람 없음', '불을 붙인 뒤 지켜봄'],
    trials: TRIALS,
    dims: [['cover', '덮개'], ['gap', '구멍과 틈']],
    result: ['불', t => `<strong>${t.burn}</strong>`],
    art: t => candleArt({...t.art, left: .7, w: 200, h: 170}),
    checkLabel: '이 두 초 비교하기',
    caption: '그림은 한참 지켜본 뒤의 모습이에요.',
    note: '실제로 초가 타는 시간은 덮개의 크기와 초의 굵기에 따라 달라요. 여기 나온 결과는 이야기 속 관찰이에요. 불을 쓰는 실험은 꼭 어른과 함께 해요.',
    hint: ['한 가지 조건만 다르게', '덮개의 크기를 알아볼 때에는 크기만, 구멍과 틈을 알아볼 때에는 구멍과 틈만 달라야 해요. 나머지는 같아야 해요.'],
    rounds: [
      {
        title: '덮개 안의 공기가 많으면 어떻게 될까요?',
        intro: '덮개의 <b>크기만</b> 다르고, 나머지 조건은 같은 <b>두 초</b>를 골라 주세요.',
        answer: ['B', 'C'],
        okTitle: 'B와 C를 비교해요',
        ok: '둘 다 구멍과 틈이 없고, 덮개의 크기만 달라요. 큰 덮개 안의 초가 더 오래 탔어요. 덮개 안에 든 공기가 더 많기 때문이에요.',
        okNote: '덮개가 없는 A와 견주면, 덮개가 있는지와 크기가 한꺼번에 달라져서 알기 어려워요.',
        wrong: '덮개의 크기만 다른 두 초를 찾아보세요. 구멍과 틈은 둘 다 같아야 해요.',
        next: '이번에는 구멍과 틈 비교하기 →'
      },
      {
        title: '새 공기가 드나들면 어떻게 될까요?',
        intro: '<b>구멍과 틈만</b> 다르고, 덮개의 크기는 같은 <b>두 초</b>를 골라 주세요.',
        answer: ['B', 'D'],
        okTitle: 'B와 D를 비교해요',
        ok: '둘 다 작은 덮개이고, 구멍과 틈만 달라요. 구멍과 틈이 있는 D는 꺼지지 않았어요. 새 공기가 아래 틈으로 들어오고 위 구멍으로 나가기 때문이에요.',
        okNote: '초가 타려면 탈 것(초), 공기 속의 산소, 불이 붙을 만큼 높은 온도가 모두 있어야 해요. 하나라도 없으면 불이 꺼져요.',
        wrong: '구멍과 틈만 다른 두 초를 찾아보세요. 덮개의 크기는 둘 다 같아야 해요.',
        next: '실험 기록을 증거함에 넣기 →'
      }
    ]
  };

  // ---------- 퍼즐 2: 꽃물 실험 ----------
  const IQ = [
    {q: '보라색 꽃물을 <b>붉은색</b>으로 바꾼 것끼리 묶으면?', opts: ['식초와 매실즙', '식초와 잿물', '잿물과 석회물'], a: 0, no: '붉은색으로 변한 종이를 다시 살펴보세요. 그 두 가지는 냄새가 어땠나요?'},
    {q: '대문의 글씨는 보라색에서 붉은색으로 변했고, 시큼한 냄새가 났어요. 글씨에 닿은 것은 무엇과 <b>성질이 같을까요?</b>', opts: ['식초', '맹물', '잿물'], a: 0, no: '붉은색으로 변하게 하고, 시큼한 냄새가 나는 것을 찾아보세요.'}
  ];
  const FLOWER = {
    auto: () => [...Object.keys(LIQ).map(k => ['ind-drop', k]), ['ind-q', '1'], ['ind-q', '0'], ['ind-q', '0'], ['ind-next', '']],
    draw(s, api) {
      const p = api.P(), a = api.action, tested = Array.isArray(p.t) ? p.t : (p.t = []), all = tested.length === Object.keys(LIQ).length, n = p.n || 0, done = n >= IQ.length;
      api.$('#view').innerHTML = `<section class="board puzzle-board"><div class="section-kicker">초롱이의 꽃물 실험${all && !done ? ` · 물음 ${n + 1} / ${IQ.length}` : ''}</div><h2>닿으면 색이 변하는 꽃물</h2><p class="muted">염색집에서 얻어 온 보라색 나팔꽃 꽃물을 종이에 발라 말렸어요. 다섯 가지 물을 <b>한 방울씩</b> 떨어뜨려 보세요.</p>
        <div class="ind-grid">${Object.entries(LIQ).map(([k, l]) => `<div class="ind-cell ${tested.includes(k) ? 'done' : ''}"><i class="ind-paper" style="background:${HUE[tested.includes(k) ? l.to : 'purple'][0]}"></i><b>${l.name}</b><small>${l.feel}</small>${tested.includes(k) ? `<span class="ind-result">${HUE[l.to][1]}</span>` : a('ind-drop', '한 방울 떨어뜨리기', k, 'seal blue sm')}</div>`).join('')}</div>
        ${p.msg ? `<p class="feedback" role="status">${api.esc(p.msg)}</p>` : ''}
        ${!all ? `<p class="muted">${tested.length} / 5 실험함</p>`
          : done ? `<div class="lab-explanation" role="status"><span class="result-seal">실험 성공</span><h3>글씨에 닿은 것은 신 물이에요</h3><p>나팔꽃 꽃물은 신 것이 닿으면 붉게, 미끈미끈한 것이 닿으면 푸르게 변해요. 이렇게 닿는 것의 성질에 따라 색이 변해서 그 성질을 알려 주는 것을 <b>지시약</b>이라고 해요.</p><p class="muted">식초처럼 신 것은 산성, 잿물처럼 미끈미끈한 것은 염기성이에요.</p>${a('ind-next', '꽃물 실험 기록을 증거함에 넣기 →')}</div>`
          : `<p class="pick-question">${IQ[n].q}</p><div class="row">${IQ[n].opts.map((o, i) => a('ind-q', o, i, 'seal blue')).join('')}</div>`}
        <p class="science-note">모르는 물은 맛보지 않아요. 잿물과 석회물은 살갗에 닿지 않게 조심해요.</p></section>`;
    },
    act(a, v, s, api) {
      const p = api.P(), n = p.n || 0;
      if (a === 'ind-drop' && LIQ[v] && !p.t.includes(v)) { p.t.push(v); p.msg = `${LIQ[v].name}: ${HUE[LIQ[v].to][1]}.`; }
      if (a === 'ind-q' && p.t.length === 5 && n < IQ.length) {
        if (+v === IQ[n].a) { p.n = n + 1; p.msg = ''; } else p.msg = IQ[n].no;
      }
      if (a === 'ind-next' && n >= IQ.length) return api.done();
      api.save(); this.draw(s, api);
    }
  };

  // ---------- 진범 지목 ----------
  const ACCUSE = {
    kicker: '진범 지목',
    title: '촛불과 글씨로 사람들을 속인 이는 누구일까요?',
    intro: '지금까지의 증거가 가리키는 <b>한 사람</b>을 짚어 주세요.',
    suspects: ['wuchi', 'heo', 'deoksoe', 'halmeom'],
    culprit: 'heo',
    wrong: {
      wuchi: '전우치의 짐에는 덮개도, 꽃물도, 병도 없었어요. 전우치가 했다는 증거는 도인의 말뿐이에요.',
      deoksoe: '덕쇠는 초소에서 졸았을 뿐이에요. 방울 소리를 들은 사람이지, 낸 사람이 아니에요.',
      halmeom: '할멈은 겁이 나서 부적을 산 사람이에요. 속은 쪽이지요.'
    },
    need: 3,
    proofTitle: '허허 도인이 했다는 근거는?',
    proofIntro: '도인과 이 일을 <b>이어 주는</b> 증거를 세 개 골라 주세요. “어떻게 된 일인지”를 알려 주는 증거와 “누가 했는지”를 알려 주는 증거는 달라요.',
    proof: ['covers', 'dye', 'inn', 'bag'],
    why: {
      candle: '꺼진 초는 초가 다 타서 꺼진 것이 아니라는 것만 알려 줘요. 누가 했는지는 알려 주지 않아요.',
      notice: '색이 변한 글은 무슨 일이 있었는지 보여 줘요. 누가 그랬는지 알려면 도인과 이어 주는 증거가 필요해요.',
      gate: '방울 소리와 시큼한 냄새는 좋은 단서예요. 하지만 일지만으로는 그 사람이 도인이라고 말하기 어려워요. 더 분명한 증거를 골라 보세요.',
      pack: '전우치의 짐은 전우치가 하지 않았다는 것을 뒷받침해요. 도인이 했다는 근거는 아니에요.',
      lab1: '촛불 실험은 불이 왜 꺼졌는지 알려 줘요. 누가 했는지는 알려 주지 않아요.',
      lab2: '꽃물 실험은 글씨가 왜 변했는지 알려 줘요. 누가 했는지는 알려 주지 않아요.'
    }
  };

  const VERDICT = {
    kicker: '사건 번호 008 · 최종 판결',
    stamp: '무죄',
    title: '전우치의 누명을 벗겼어요.',
    sub: '도술처럼 보이던 일에도 까닭이 있었어요. 실험이 그 까닭을 밝혀냈어요.',
    cards: [
      {title: '관아의 판결 · 원님', who: 'wonnim', text: '이 일은 전우치의 도술이 아니라 허허 도인의 속임수였소. 도인은 부적 값으로 받은 엽전을 한 닢도 남김없이 돌려주시오. 그리고 내일 장터에서, 촛불이 꺼진 까닭과 글씨 색이 변한 까닭을 제 손으로 다시 보여 주며 사과하시오. 덕쇠는 졸았던 것을 숨겼으나 스스로 바로 말했으니 참작하겠소.'},
      {modern: true, title: '오늘의 시선 · 한저울 판사', who: 'judge', text: '사람들을 겁주어 물건을 사게 하는 것은 오늘날에도 잘못이에요. 그리고 까닭을 모르는 일을 누군가의 탓으로 돌려 벌해서는 안 돼요. 신기하고 무서운 일을 만나면 조건을 하나씩 바꾸어 실험해 보세요. 까닭을 알면 속지 않아요.'}
    ],
    strip: [['과학', '타려면 산소가 필요해요'], ['과학', '닿으면 색이 변하는 지시약'], ['추리', '어떻게와 누가를 따로']],
    note: '불을 쓰는 실험은 꼭 어른과 함께 해요. 모르는 물은 맛보거나 만지지 않아요. 여기 나온 실험 결과는 이야기 속 관찰이에요.',
    foot: '고전 인물을 활용해 만든 이야기 속 재판입니다.'
  };

  return {
    n: 8, classic: '전우치전', title: '도술인가, 과학인가',
    helper: 'chorong',
    court: 'court',
    rules: {pair: true, combo: true, coins: 3},
    portraits: ['baleum', 'wonnim', 'wuchi', 'heo', 'halmeom', 'deoksoe', 'chorong', 'judge'],
    art: {wonnim: 'wonnim-v3'},
    chars: {
      baleum: '나바름',
      wonnim: '고을 원님',
      wuchi: '전우치',
      heo: '허허 도인',
      halmeom: '떡 할멈',
      deoksoe: '문지기 덕쇠',
      chorong: '초롱이',
      judge: '한저울 판사',
      narr: ''
    },
    glossary: {
      '도술': '옛이야기에서 도사가 부린다는 신기한 재주예요.',
      '부적': '나쁜 일을 막아 준다고 믿고 지니던, 글씨나 그림을 그린 종이예요.',
      '증거': '어떤 일이 있었는지 확인하는 데 도움이 되는 물건이나 기록이에요.',
      '증언': '자기가 보고 들은 일을 법정에서 말하는 것이에요.',
      '모순': '앞에서 한 말과 뒤에서 한 말이 서로 맞지 않는 것이에요.',
      '산소': '공기 속에 들어 있는 기체예요. 물질이 탈 때 꼭 필요해요.',
      '액막이': '나쁜 일을 미리 막으려고 하던 옛 풍습이에요.',
      '잿물': '나무를 태운 재를 물에 우려낸 미끈미끈한 물이에요. 옛날에는 빨래할 때 썼어요.',
      '지시약': '닿는 것의 성질에 따라 색이 변해서, 그 성질을 알려 주는 물질이에요.'
    },
    evidence: {
      candle: {name: '꺼진 초와 덮개', short: '대청에서 꺼진 초와 유리 덮개를 살핀 그림', icon: 'jar', view: VIEW.candle},
      notice: {name: '색이 변한 액막이 글', short: '관아 대문에 붙은 글을 본 대로 그린 그림', icon: 'note', view: VIEW.notice},
      covers: {name: '도인의 두 덮개', short: '어제 장터의 덮개와 오늘 대청의 덮개', icon: 'jar', view: VIEW.covers},
      dye: {name: '염색집 장부', short: '어제 아침 나팔꽃 꽃물을 판 기록', icon: 'ledger', view: VIEW.dye},
      inn: {name: '주막 장부', short: '허허 도인이 드나든 때와 맡긴 엽전', icon: 'ledger', view: VIEW.inn},
      gate: {name: '문지기 일지', short: '어젯밤 대문 앞에서 들은 소리', icon: 'note', view: VIEW.gate},
      pack: {name: '전우치의 짐', short: '전우치의 봇짐에서 나온 것', icon: 'book', view: VIEW.pack},
      lab1: {name: '촛불 실험 기록', short: '덮개의 크기와 틈을 바꾸어 본 실험', icon: 'table', view: VIEW.lab1},
      lab2: {name: '꽃물 실험 기록', short: '꽃물에 다섯 가지 물을 떨어뜨린 실험', icon: 'table', view: VIEW.lab2},
      bag: {name: '도인의 봇짐', short: '허허 도인의 봇짐에서 나온 것', icon: 'jar', view: VIEW.bag}
    },
    places: [
      {id: 'daecheong', name: '관아 대청', art: 'daecheong', ev: 'candle', who: 'chorong', line: '불이 꺼진 초예요. 어? 초가 아직 많이 남아 있어요!'},
      {id: 'daemun', name: '관아 대문', art: 'daemun', ev: 'notice', who: 'baleum', line: '색이 변했다는 액막이 글이야. 글자를 하나하나 살펴보자.'},
      {id: 'market', name: '장터', art: 'market', ev: 'covers', who: 'chorong', line: '어제 도인이 장터에서 쓴 덮개가 그대로 있어요. 오늘 것과 나란히 그려 볼게요.'},
      {id: 'dyeshop', name: '염색집', art: 'dyeshop', ev: 'dye', who: 'baleum', line: '옷감에 물을 들이는 염색집이야. 어제 아침에 꽃물을 사 간 사람이 있대.'},
      {id: 'jumak', name: '장터 주막', art: 'jumak', ev: 'inn', who: 'baleum', line: '허허 도인이 묵고 있는 주막이야. 주모가 장부를 보여 주었어.'},
      {id: 'post', name: '대문 옆 초소', art: 'guardpost', ev: 'gate', who: 'deoksoe', line: '어젯밤에 적어 둔 일지요. 별일은 없었소… 방울 소리 말고는.'},
      {id: 'office', name: '관아 옥 앞', art: 'office', ev: 'pack', who: 'wuchi', line: '내 짐이오. 숨길 것이 없으니 마음껏 살펴보시오.'}
    ],
    witnesses: {
      halmeom: {
        who: 'halmeom', title: '첫 심문 · 부적을 산 떡 할멈',
        statements: [
          {text: '나는 장터에서 떡 파는 할멈이오. 어제 장터에서도, 오늘 아침 대청에서도 도인의 촛불을 다 보았소.', cards: [{q: '어제 장터의 촛불은 어땠나요?', a: '덮개를 씌워도 꺼지지 않고 잘만 탔소.'}]},
          {text: '오늘 아침, 도인이 초에 불을 붙이고 유리 덮개를 씌웠소. 바람 한 점 들어갈 틈이 없었지.', cards: [{q: '도인이 덮개를 씌운 뒤에 초를 만졌나요?', a: '아니오. 손끝 하나 대지 않았소. 내 두 눈으로 보았소.'}]},
          {text: '그런데 조금 있으니 불이 스르르 꺼졌소. 얼마나 무섭던지!', cards: [{q: '불이 꺼질 때 바람이 불었나요?', a: '바람은 없었소. 덮개까지 씌웠는데 무슨 바람이오.'}]},
          {text: '전우치가 도술로 초를 몽땅 태워 없앤 게요. 초가 다 타 버렸으니 불이 꺼진 것 아니겠소!', cards: [{q: '꺼진 초를 가까이에서 보셨나요?', a: '무, 무서워서 가까이 가지는 못했소…', mood: 'sweat'}]},
          {text: '도인 말이, 전우치가 노해서 그렇다 하더이다. 그래서 부적을 석 장이나 샀소.', cards: [{q: '부적은 한 장에 얼마였나요?', a: '엽전 한 꿰미요. 떡을 사흘은 팔아야 버는 돈이오.', mood: 'sad'}]}
        ],
        solve: {evidence: 'candle', statements: [3], near: [
          {evidence: 'covers', text: '어제와 오늘의 덮개가 다르다는 것은 좋은 눈이에요. 그런데 할멈은 초가 어떻게 되었다고 했나요? 그 말부터 확인해 보세요.'},
          {evidence: 'pack', text: '전우치의 짐에 아무것도 없다는 것은 맞아요. 하지만 할멈의 말 가운데 직접 확인할 수 있는 것은 초에 대한 말이에요.'}
        ]},
        hints: ['할멈은 무서워서 초를 가까이에서 보지 못했대요.', '불이 꺼진 까닭을 할멈은 무엇이라고 했나요? 대청에서 살핀 것과 견주어 보세요.'],
        wrong: '할멈이 직접 본 것과, 보지 않고 짐작한 것을 나누어 보세요.',
        success: [
          L('baleum', '초는 절반 넘게 남아 있었습니다. 다 타서 꺼진 것이 아닙니다!', 'stern', {shout: true}),
          L('halmeom', '에구머니, 초가 남았다고? 그럼 불은 왜 꺼졌단 말이오?', 'shock'),
          L('heo', '허허허. 탈 것이 남았는데 불이 꺼졌다. 그것이야말로 도술이라는 증거 아니겠소?', 'happy'),
          L('chorong', '잠깐만요! 초는 우리 집에서 날마다 만들어요. 초가 왜 꺼지는지, 실험으로 알아볼 수 있어요.', 'happy'),
          L('wonnim', '좋소. 법정에서 직접 해 보시오.')
        ]
      },
      deoksoe: {
        who: 'deoksoe', title: '두 번째 심문 · 대문을 지킨 덕쇠',
        statements: [
          {text: '관아 대문을 지키는 덕쇠요. 어제 낮에 도인이 액막이 글을 써서 대문에 붙였소. 고운 보라색 글씨였지.', cards: [{q: '도인이 글을 붙이며 뭐라고 했나요?', a: '“이 글씨가 붉게 변하면 전우치가 노한 것이오” 했소.'}]},
          {text: '나는 밤새 대문 앞에 꼿꼿이 서서 한 발짝도 떠나지 않았소. 쥐 한 마리 얼씬하지 못했지.', cards: [{q: '밤새 한 번도 앉지 않았나요?', a: '그, 그럼! 문지기가 앉으면 쓰나.', mood: 'sweat'}]},
          {text: '밤 11시쯤 방울 소리가 나기에, 초소에서 뛰쳐나와 대문 앞을 살폈소. 아무도 없더이다.', cards: [{q: '그때 무슨 냄새가 났나요?', a: '냄새? 그, 글쎄… 시큼했던가…', mood: 'sweat'}]},
          {text: '아침에 보니 글씨가 핏빛으로 변해 있었소. 한 글자도 빠짐없이 전부!', cards: [{q: '글자를 하나하나 세어 보았나요?', a: '세어 보지는 않았소. 온통 붉으니 다 변한 줄 알았지.'}]},
          {text: '종이는 보송보송했고 아무 냄새도 없었소. 사람 손이 닿았을 리 없지. 도술이오!', cards: [{q: '종이를 만져 보았나요?', a: '무서워서 손은 못 댔소. 멀찍이서 보았지.', mood: 'sweat'}]}
        ],
        solve: {pair: [1, 2], evidence: 'notice', statements: [3, 4], alt: [{evidence: 'gate', statements: [4]}], near: [
          {evidence: 'gate', statements: [1, 2], text: '일지에도 방울 소리가 적혀 있어요. 그런데 덕쇠는 그때 어디에 있었다고 했나요? 덕쇠의 말끼리 맞대어 보세요.'},
          {evidence: 'inn', text: '주막 장부의 시각은 눈여겨볼 만해요. 하지만 지금은 덕쇠가 본 것부터 따져 보세요.'}
        ]},
        hints: ['덕쇠는 무서워서 글을 멀찍이서만 보았대요.', '덕쇠는 밤새 어디에 있었다고 했나요? 또, 대문의 글을 가까이에서 살핀 그림과 덕쇠의 말을 견주어 보세요.'],
        wrong: '덕쇠의 말 가운데, 대문에서 살핀 것과 다른 말을 찾아보세요. 덕쇠의 말끼리 어긋나는 곳도 있어요.',
        success: [
          L('baleum', '덕쇠의 말에는 맞지 않는 곳이 여럿입니다. 대문 앞에 서 있었다면서 초소에서 뛰쳐나왔고, 글씨가 전부 변했다지만 한 글자는 보라색 그대로이고, 종이에서는 시큼한 냄새가 납니다!', 'stern', {shout: true}),
          L('deoksoe', '아이고… 사실은 초소 안에서 깜빡 졸았소. 방울 소리에 깨서 나가 보니 시큼한 냄새만 났지. 혼날까 봐 숨겼소.', 'sad'),
          L('wonnim', '졸았던 것은 따로 따지겠소. 그렇다면 그 사이에 누군가 대문 앞에 왔을 수도 있겠구려.'),
          L('baleum', '붉게 변한 글자 둘레에만 젖었다 마른 자국이 있습니다. 무언가가 닿은 글자만 변한 것입니다.'),
          L('chorong', '염색집 아주머니가 그랬어요. 꽃물은 닿는 것에 따라 색이 변한다고요. 그것도 실험해 봐요!', 'happy')
        ]
      },
      heo1: {
        who: 'heo', title: '도인의 첫 번째 말 · 덮개와 촛불',
        statements: [
          {text: '나는 노한 전우치를 달랠 수 있는 단 한 사람, 허허 도인이오. 허허허.', cards: [{q: '전우치를 만난 적이 있나요?', a: '만나다니. 그런 무서운 도사를 어찌 만나겠소.'}]},
          {text: '오늘 아침 대청에서 초에 불을 붙이고 유리 덮개를 씌웠소. 그 뒤로는 손끝 하나 대지 않았소.', cards: [{q: '덮개는 왜 씌우셨나요?', a: '바람에 꺼졌다는 말이 나올까 봐 그랬지.'}]},
          {text: '덮개는 바람을 막아 줄 뿐이오. 덮개 안의 초는 바깥의 초보다 오히려 더 오래 타야 맞소.', cards: [{q: '덮개 안의 초가 더 오래 탄다고요?', a: '그렇소. 바람이 없으니 당연하지 않소?'}]},
          {text: '그런데도 불이 꺼졌소. 이는 사람의 힘으로는 할 수 없는 일. 전우치의 도술이오!', cards: [{q: '도술이 아니라면 어떻게 설명할 수 있을까요?', a: '설명할 수 없으니 도술이지. 허허허.'}]},
          {text: '전우치의 노여움을 달래려면 내 부적을 지녀야 하오. 한 장에 엽전 한 꿰미, 싸게 드리는 것이오.', cards: [{q: '오늘 부적을 몇 장이나 파셨나요?', a: '그, 그런 것을 세고 있겠소. 사람 살리는 일에.', mood: 'sweat'}]}
        ],
        solve: {evidence: 'lab1', statements: [2, 3], near: [
          {evidence: 'candle', text: '초가 남아 있었다는 것은 이미 밝혔어요. 이번에는 불이 왜 꺼졌는지 알려 주는 증거를 내밀어 보세요.'},
          {evidence: 'covers', text: '두 덮개가 다르다는 것은 곧 중요해져요. 그런데 지금 도인은 덮개가 초에 아무 영향도 주지 않는다고 말해요. 그 말부터 깨뜨려 보세요.'}
        ]},
        hints: ['도인은 덮개가 초에 어떤 영향을 준다고 말했나요?', '덮개를 씌운 초가 어떻게 되는지, 방금 법정에서 직접 확인했어요.'],
        wrong: '도인의 말 가운데 실험으로 확인해 본 것이 있어요.',
        success: [
          L('baleum', '덮개를 씌운 초는 더 오래 타는 것이 아니라, 덮개 안의 산소를 다 쓰면 꺼집니다. 방금 실험으로 확인했습니다. 도술이 아닙니다!', 'stern', {shout: true, words: ['산소']}),
          L('heo', '허, 허허… 덮개 탓이라? 재미있는 말이오.', 'sweat'),
          L('heo', '그렇다면 어제 장터에서는 어찌 되었소? 그때도 덮개를 씌웠지만 불은 꺼지지 않았소!', 'stern'),
          L('halmeom', '그건 그렇소. 어제는 잘만 탔소.'),
          L('chorong', '어제 덮개와 오늘 덮개… 나바름 나리, 이번에는 증거 하나로는 모자랄 것 같아요. 두 개를 함께 내밀 수도 있어요!')
        ]
      },
      heo2: {
        who: 'heo', title: '도인의 두 번째 말 · 어제는 타고 오늘은 꺼졌다',
        statements: [
          {text: '어제 장터에서도 나는 초에 덮개를 씌웠소.', cards: [{q: '어제도 유리 덮개였나요?', a: '그렇소. 같은 장인에게서 산 유리 덮개요.'}]},
          {text: '그 초는 내가 주문을 다 외도록 꺼지지 않았소. 떡 할멈도 똑똑히 보았지.', cards: [{q: '주문은 얼마나 길었나요?', a: '서른을 세고도 남을 만큼 길었소.'}]},
          {text: '어제 덮개와 오늘 덮개가 조금 다르게 생겼다 한들, 그게 무슨 상관이오. 덮개는 다 같은 덮개요.', cards: [{q: '두 덮개가 다르게 생긴 것은 맞나요?', a: '구, 구멍이 하나 있고 없고… 그깟 것이 무슨 대수요.', mood: 'sweat'}]},
          {text: '초도 같고 불도 같았소. 어제와 오늘 달라진 것은 전우치의 마음뿐이오.', cards: [{q: '정말 달라진 것이 그것뿐인가요?', a: '그럼! 그것뿐이오.'}]},
          {text: '그러니 오늘 불이 꺼진 것은 전우치가 노한 탓이오!', cards: [{q: '어제는 부적이 잘 팔렸나요?', a: '어제는… 아무도 겁을 내지 않아서 석 장밖에… 아니, 그건 왜 묻소!', mood: 'sweat'}]}
        ],
        solve: {combo: ['covers', 'lab1'], statements: [2, 3], near: [
          {combo: ['covers', 'candle'], text: '두 덮개가 다르다는 것은 맞아요. 그런데 구멍과 틈이 있으면 초가 어떻게 되는지 보여 주는 증거가 함께 있어야 해요.'},
          {combo: ['candle', 'lab1'], text: '실험 기록은 꼭 필요해요. 여기에, 어제와 오늘의 덮개가 어떻게 달랐는지 보여 주는 증거를 함께 놓아 보세요.'}
        ]},
        hints: ['도인은 어제와 오늘 달라진 것이 없다고 해요. 정말 그럴까요?', '덮개가 어떻게 달랐는지 보여 주는 증거와, 그 차이가 왜 중요한지 보여 주는 증거를 함께 내밀어 보세요.'],
        wrong: '어제와 오늘 달라진 것이 무엇인지, 그리고 그것이 왜 중요한지를 함께 보여 주어야 해요.',
        success: [
          L('baleum', '어제 장터의 덮개에는 꼭대기에 구멍이 있고 아래에 틈이 있습니다. 실험에서 구멍과 틈이 있는 덮개 안의 초는 꺼지지 않았습니다. 달라진 것은 전우치의 마음이 아니라 덮개입니다!', 'stern', {shout: true}),
          L('heo', '으음…', 'shock'),
          L('halmeom', '아니, 그럼 불이 꺼질 덮개를 일부러 골라 온 게요?', 'stern'),
          L('heo', '초, 촛불은 그렇다 칩시다! 허나 글씨는 어찌할 것이오. 하룻밤에 핏빛으로 변한 글씨는!', 'stern'),
          L('baleum', '원님, 글씨에 대해서도 따져 보겠습니다. 도인의 봇짐을 살펴 주십시오.'),
          L('narr', '포졸이 주막에서 도인의 봇짐을 가져와 풀어 놓았습니다. 병과 붓, 부적 꾸러미가 나왔습니다.')
        ]
      },
      heo3: {
        who: 'heo', title: '도인의 세 번째 말 · 핏빛 글씨',
        statements: [
          {text: '그 액막이 글은 내가 썼소. 허나 붓에 먹을 찍어 쓴 평범한 글씨요.', cards: [{q: '먹으로 쓴 글씨가 보라색인가요?', a: '그, 그건… 좋은 먹은 빛이 오묘한 법이오.', mood: 'sweat'}]},
          {text: '글을 대문에 붙인 뒤로 나는 주막에서 한 발짝도 나가지 않았소. 밤새 곤히 잤소.', cards: [{q: '주모가 그것을 아나요?', a: '주, 주모는 일찍 자서 모를 것이오.', mood: 'sweat'}]},
          {text: '봇짐의 병은 깊은 산에서 떠 온 ‘신령수’요. 맑은 샘물이라 아무 맛도 냄새도 없소.', cards: [{q: '신령수는 어디에 쓰나요?', a: '부, 부적에 뿌리는 귀한 물이오.', mood: 'sweat'}]},
          {text: '글씨의 색을 바꾸는 물 따위는 세상에 없소. 그러니 글씨가 변한 것은 도술이오!', cards: [{q: '염색집에 가 본 적이 있나요?', a: '염색집? 내가 그런 데를 왜 가겠소!', mood: 'sweat'}]},
          {text: '나는 그저 전우치를 달래 사람들을 도우려 했을 뿐이오.', cards: [{q: '부적 값은 어디에 쓰시나요?', a: '허, 허허… 좋은 데 쓰지요.', mood: 'sweat'}]}
        ],
        solve: {evidence: ['dye', 'bag'], statements: [0], alt: [
          {evidence: 'inn', statements: [1]},
          {evidence: 'bag', statements: [2]},
          {evidence: ['lab2', 'bag'], statements: [3]}
        ], near: [
          {evidence: 'gate', statements: [1], text: '방울 소리는 좋은 단서예요. 하지만 일지만으로는 그 사람이 도인이라고 말하기 어려워요. 도인이 밤에 나갔는지 알려 주는 다른 기록이 있어요.'},
          {evidence: 'notice', text: '글씨가 변한 것은 모두가 알아요. 이번에는 도인의 말 하나하나를 깨뜨릴 증거를 찾아보세요.'}
        ]},
        hints: ['도인의 말은 하나하나가 다 수상해요. 어느 것이든 하나를 골라 보세요.', '먹으로 썼다는 말, 밤새 잤다는 말, 맑은 샘물이라는 말, 색을 바꾸는 물은 없다는 말. 저마다 맞서는 증거가 있어요.'],
        wrong: '도인의 말 하나를 고르고, 그 말과 꼭 맞서는 증거를 내밀어 보세요.',
        success: [
          L('baleum', '도인께서는 어제 아침 염색집에서 나팔꽃 꽃물을 사셨습니다. 붓끝도 보랏빛으로 물들어 있지요. 글씨는 먹이 아니라 꽃물로 쓴 것입니다!', 'stern', {shout: true}),
          L('baleum', '주막 장부에는 어젯밤 10시 종이 친 뒤에 나가 자정이 넘어 돌아왔다고 적혀 있습니다. 밤 11시, 대문 앞에서는 방울 소리가 났습니다.'),
          L('baleum', '그리고 이 ‘신령수’는 시큼한 냄새가 나고, 꽃물 종이를 붉게 바꿉니다. 식초와 같은 신 물입니다.'),
          L('heo', '허… 허허…', 'shock'),
          L('wonnim', '변호인. 이제 누가 이 일을 꾸몄는지 짚고, 그 근거를 대 보시오.', 'stern')
        ]
      }
    },
    custom: {flower: FLOWER},
    stages: [
      {type: 'talk', chapter: '여덟 번째 의뢰', lines: [
        L('narr', '오늘 아침, 관아 대문에 붙은 글씨가 하룻밤 사이에 핏빛으로 변했습니다. 대청에서는 덮개를 씌운 촛불이 저절로 꺼졌습니다.', 'normal', {fx: 'drum'}),
        L('heo', '허허허. 이는 모두 도사 전우치가 노하여 부린 도술이오! 내 부적만이 재앙을 막을 수 있소.', 'happy', {words: ['도술', '부적']}),
        L('narr', '겁이 난 사람들은 앞다투어 부적을 샀습니다. 마침 고을을 지나던 전우치는 그 자리에서 붙잡혔습니다.'),
        L('wuchi', '내가 한 일이라고? 내 도술이라면 그런 시시한 재주는 부리지 않소.', 'stern'),
        L('chorong', '저는 초 만드는 집 딸 초롱이예요. 초가 저절로 꺼졌다는 말이 이상해서 왔어요. 돕게 해 주세요!', 'happy'),
        L('baleum', '저는 나바름입니다. 전우치의 말을 대신 전하겠습니다. 도술인지 아닌지, 하나씩 따져 보겠습니다.'),
        L('wonnim', '좋소. 이번 일은 쉽지 않을 것이오. 말이 아니라 증거로 판단하겠소.', 'stern', {words: ['증거']}),
        L('chorong', '일곱 곳을 둘러봐요. 이번에는 기력 엽전이 세 닢뿐이니, 증거를 내밀기 전에 꼼꼼히 살펴봐요!')
      ]},
      {type: 'investigate', chapter: '일곱 곳의 단서', title: '도술일까요, 까닭이 있을까요?'},
      {type: 'talk', chapter: '떡 할멈의 증언', lines: [
        L('narr', '떡 광주리를 낀 할멈이 부적 석 장을 꼭 쥐고 증인석에 섰습니다.'),
        L('halmeom', '아이고, 무서워라. 내 눈으로 본 대로 말하리다.', 'sad'),
        L('chorong', '증언을 넘겨 보고, 이상한 말에 맞는 증거를 내밀어 보세요. 말끼리 어긋나면 두 증언을 맞대 보세요.', 'normal', {words: ['증언', '모순']}),
        L('chorong', '이번 재판에서는 증거 두 개를 함께 내밀어야 드러나는 것도 있어요. 「증거 내밀기」를 누르면 고를 수 있어요.')
      ]},
      {type: 'cross', id: 'halmeom', chapter: '다 타 버린 초'},
      {type: 'compare', chapter: '초롱이의 촛불 실험', ...CANDLES, gain: 'lab1', after: [
        L('chorong', '초가 타려면 공기 속의 산소가 있어야 해요. 덮개 안의 산소를 다 쓰면 초가 남아 있어도 불이 꺼져요!', 'happy', {words: ['산소']}),
        L('baleum', '촛불 실험 기록을 증거로 남기겠습니다.'),
        L('heo', '허허. 아이의 장난으로 도술을 어찌 알겠소. 내가 대문에 붙인 액막이 글은 또 어떻고. 대문지기에게 물어보시오.', 'normal', {words: ['액막이']}),
        L('narr', '관아 대문을 지키는 덕쇠가 창을 짚고 증인석에 섰습니다.')
      ]},
      {type: 'cross', id: 'deoksoe', chapter: '밤새 지킨 대문'},
      {type: 'flower', chapter: '초롱이의 꽃물 실험', gain: 'lab2', after: [
        L('chorong', '꽃물처럼 닿는 것에 따라 색이 변하는 것을 지시약이라고 해요. 옛날에 빨래할 때 쓰던 잿물은 꽃물을 푸르게 바꿔요.', 'happy', {words: ['지시약', '잿물']}),
        L('baleum', '대문의 글씨에는 식초 같은 신 물이 닿았습니다. 닿지 않은 한 글자만 보라색으로 남은 것입니다.'),
        L('wuchi', '도술이 닿지 않는 글자가 따로 있겠소. 사람 손이 빠뜨린 게지.'),
        L('heo', '허허허. 말은 그럴듯하오만, 내 말을 끝까지 들어 보시오.', 'stern')
      ]},
      {type: 'cross', id: 'heo1', chapter: '도인의 첫 번째 말'},
      {type: 'cross', id: 'heo2', chapter: '도인의 두 번째 말', gain: 'bag'},
      {type: 'cross', id: 'heo3', chapter: '도인의 세 번째 말'},
      {type: 'accuse', chapter: '진범 지목', ...ACCUSE, after: [
        L('baleum', '허허 도인은 구멍 없는 덮개로 촛불을 끄고, 꽃물로 쓴 글씨에 신 물을 발라 색을 바꾸었습니다. 그리고 전우치의 도술이라며 사람들을 겁주어 부적을 팔았습니다.', 'stern'),
        L('heo', '…어제는 아무도 겁을 내지 않아 부적이 석 장밖에 안 팔렸소. 그래서 밤에 글씨를 바꾸고, 오늘은 꺼지는 덮개를 가져왔지.', 'sad'),
        L('heo', '무서운 이름 하나만 대면 다들 믿을 줄 알았소. 미안하오.', 'sad'),
        L('halmeom', '내 떡값 석 꿰미! 당장 내놓으시오!', 'stern'),
        L('wuchi', '까닭을 모르면 무섭고, 까닭을 알면 우스운 법이오. 덕분에 누명을 벗었소.', 'happy'),
        L('wonnim', '이제 판결을 내리겠소.', 'stern')
      ]},
      {type: 'verdict', chapter: '증거가 이끄는 판결', ...VERDICT},
      {type: 'diary', chapter: '나의 판관 일기'},
      {type: 'end', chapter: '까닭을 아는 사람들'}
    ],
    landing: {
      intro: '글씨는 하룻밤에 핏빛이 되고,<br>덮개 안의 촛불은 저절로 꺼졌다.<br><strong>도술인지 과학인지, 실험으로 밝혀 주세요.</strong>',
      start: '전우치의 사건 맡기',
      backdrop: 'daecheong',
      people: [['wuchi', 'stern'], ['heo', 'happy'], ['baleum', 'normal']],
      bubble: '설명할 수 없다고 도술인 것은 아니오!',
      label: ['전우치전에서 시작된 새로운 사건', '도술인가, 과학인가'],
      steps: ['단서 수집', '실험으로 확인', '진범 지목'],
      credit: '초등 5학년부터 · 어려움 · 읽는 속도에 따라 약 40–50분 · 진행 자동 저장'
    },
    diary: {
      title: '이 재판에서 무엇을 생각했나요?',
      intro: '가장 마음에 드는 생각을 골라 주세요. 여기에는 정답이 없어요.',
      choices: [
        '신기하고 무서운 일을 보면, 겁먹기 전에 까닭부터 찾아볼 거예요.',
        '사람들을 겁주어 물건을 파는 것은 나쁜 일이에요.',
        '설명하지 못한다고 해서 누군가의 탓이라고 말하면 안 돼요.'
      ],
      placeholder: '예: 마술을 보면 어떻게 한 건지 궁금해할 거예요.'
    },
    end: {
      backdrop: 'market',
      people: [['wuchi', 'happy'], ['chorong', 'happy']],
      quote: '“까닭을 모르면 무섭고, 까닭을 알면 우스운 법이오.”',
      kicker: '여덟 번째 사건 해결',
      title: '도술이 아니라<br><em>까닭이 있었어요.</em>',
      text: '다음 날 장터에서 허허 도인은 촛불과 꽃물의 까닭을 제 손으로 보여 주었습니다.<br>전우치는 빙긋 웃더니, 부채를 한 번 부치고는 온데간데없이 사라졌습니다. 그건… 다음에 따져 보기로 해요.',
      badges: ['촛불 실험가', '꽃물 감정사', '진범 지목']
    },
    guide: `<h3>제8화 · 교사·보호자 안내</h3><p><b>전우치전 × 연소와 지시약 × 다른 설명 지워 나가기</b><br>초등 5학년부터, 약 40–50분을 예상한 이야기입니다. 여기부터는 <b>어려운 단계</b>입니다. 기력 엽전이 세 닢이고, 힌트는 두 단계뿐이며, 같은 증인이 변명을 바꿀 때마다 세 번 이어서 깨뜨려야 합니다. 증거 두 개를 함께 내밀어야 풀리는 심문이 한 번 있고, 마지막에는 범인을 직접 짚고 근거를 골라야 합니다. 전우치는 고전 소설 전우치전의 주인공이고, 허허 도인, 떡 할멈, 덕쇠, 초롱이는 이 게임을 위해 만든 인물입니다.</p><p><b>함께 생각할 질문</b></p><ol><li>덮개를 씌운 초는 왜 꺼졌을까요? 어떻게 하면 꺼지지 않을까요?</li><li>“설명할 수 없으니 도술이다”라는 말은 왜 옳지 않을까요?</li><li>“어떻게 된 일인지” 알려 주는 증거와 “누가 했는지” 알려 주는 증거는 어떻게 다를까요?</li></ol><details class="teacher-spoilers"><summary>교사용 진행·정답 보기</summary><p>떡 할멈: 증언 4 + 꺼진 초와 덮개 (초가 절반 넘게 남음).<br>촛불 실험: B와 C (덮개 크기), B와 D (구멍과 틈).<br>덕쇠: 증언 2와 3 맞대기, 또는 증언 4나 5 + 색이 변한 액막이 글, 또는 증언 5 + 문지기 일지.<br>꽃물 실험: 식초와 매실즙 / 식초.<br>도인 첫 번째: 증언 3 또는 4 + 촛불 실험 기록.<br>도인 두 번째: 증언 3 또는 4 + <b>도인의 두 덮개와 촛불 실험 기록을 함께</b>.<br>도인 세 번째: 증언 1 + 염색집 장부나 도인의 봇짐 / 증언 2 + 주막 장부 / 증언 3 + 도인의 봇짐 / 증언 4 + 꽃물 실험 기록이나 도인의 봇짐. 어느 것이든 하나면 됩니다.<br>진범: 허허 도인. 근거는 도인의 두 덮개, 염색집 장부, 주막 장부, 도인의 봇짐 가운데 셋.</p></details><p><b>과학 표현의 범위</b><br>물질이 타려면 탈 물질, 산소, 발화점 이상의 온도가 필요하다는 것과, 지시약이 산성과 염기성에서 다른 색을 띤다는 것을 다룹니다. 덮개 안의 초가 타는 시간은 덮개의 크기, 초의 굵기에 따라 크게 달라지며, 여기 나온 “열을 셀 동안”, “서른을 셀 동안”은 이야기 속 관찰입니다. 나팔꽃 꽃물은 실제로 산성에서 붉은빛, 염기성에서 푸른빛을 띠지만 색의 정도는 꽃과 농도에 따라 다릅니다. 교실에서는 자주색 양배추 물로 같은 실험을 할 수 있습니다. 잿물과 석회물은 피부에 닿으면 좋지 않으니 실제 실험에서는 식초와 베이킹 소다 물 정도를 쓰는 것이 안전합니다.</p><p><b>도술을 다루는 방식</b><br>이 화는 “전우치의 도술이 진짜인가”를 가리지 않습니다. 재판이 가리는 것은 “이번 일이 도술로만 설명되는가”입니다. 결말에서 전우치가 사라지는 장면은 원작에 대한 농담으로 남겨 두었습니다.</p><p class="muted">로그인 없이 사용하며 진행과 일기는 브라우저 안에만 저장됩니다. 화마다 진행 기록은 별개입니다.</p>`
  };
})();
