'use strict';
// 제2화 · 흥부전 — 싹트지 않는 박의 비밀
// 흥부전의 인물을 빌려 새로 꾸민 사건입니다. 실험 결과 수치는 이야기 속 자료이며 실제 발아율이 아닙니다.
// 자료 형식은 docs/episode-format.md 를 보세요.
window.CASE = (() => {
  const L = (who, text, mood = 'normal', extra = {}) => ({who, text, mood, ...extra});

  // ---------- 달래의 실험 자료 ----------
  const TRIALS = [
    {id:'A', title:'촉촉한 천', water:'촉촉하게 유지', temp:'알맞게 따뜻함', air:'공기가 통함', seeds:4, sprouted:3, art:'sprout'},
    {id:'B', title:'마른 천', water:'물을 주지 않음', temp:'A와 같음', air:'A와 같음', seeds:4, sprouted:0, art:'dry'},
    {id:'C', title:'차가운 자리', water:'A와 같음', temp:'차가움', air:'A와 같음', seeds:4, sprouted:0, art:'cold'}
  ];

  // ---------- 증거 그림 ----------
  const seed = (i=0) => `<svg viewBox="0 0 40 55" aria-hidden="true"><path d="M20 3C7 13 5 32 12 44Q20 56 28 44C35 32 33 13 20 3Z" fill="${i?'#cfb77d':'#e9d7a3'}" stroke="#a6874e" stroke-width="1.5"/><path d="M20 8Q11 28 18 45" fill="none" stroke="#f9edc8" stroke-width="2"/></svg>`;
  function jarDiagram(interactive) {
  const spot=(id,label,x,y,w,h)=>interactive?`<g role="button" tabindex="0" data-action="spot" data-value="${id}" aria-label="${label}" class="jar-spot"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12"/><text x="${x+w/2}" y="${y+h-8}" text-anchor="middle">${label}</text></g>`:'';
  return `<svg class="jar-diagram" viewBox="0 0 640 430" role="img" aria-label="항아리 속 단면 그림. 물 높이보다 아래에 씨앗 세 알이 있고, 뚜껑은 옆으로 열어 놓았다."><defs><linearGradient id="jar-clay" x2="1" y2="1"><stop stop-color="#bf9266"/><stop offset="1" stop-color="#755640"/></linearGradient><linearGradient id="jar-water" x2="0" y2="1"><stop stop-color="#bcd9d6" stop-opacity=".8"/><stop offset="1" stop-color="#709d99" stop-opacity=".75"/></linearGradient></defs><rect width="640" height="430" rx="14" fill="#eae1cc"/><path d="M0 353Q320 320 640 355V430H0Z" fill="#d7c6a8"/><ellipse cx="299" cy="363" rx="151" ry="21" fill="#88735b" opacity=".18"/><path d="M191 80H407Q480 185 423 345Q301 391 175 345Q122 186 191 80Z" fill="url(#jar-clay)" stroke="#72543c" stroke-width="4"/><path d="M210 96H388Q445 202 404 329Q300 363 194 329Q152 203 210 96Z" fill="#e9d9b8" stroke="#997854" stroke-width="2"/><path d="M178 174Q290 161 421 174L403 329Q300 363 194 329Z" fill="url(#jar-water)"/><path d="M178 174Q290 161 421 174" fill="none" stroke="#5c918e" stroke-width="3"/><path d="M200 316Q280 301 402 317L399 331Q285 357 196 330Z" fill="#cfc7ad" stroke="#aea68f" stroke-width="2"/>${[245,300,355].map((x,i)=>`<g transform="translate(${x} 286) rotate(${i*12-12})"><path d="M0-20C-22-5-14 23 0 22C15 21 22-5 0-20Z" fill="#e5cf9c" stroke="#9b7d4e" stroke-width="2"/><path d="M0-14Q-8 5 0 16" fill="none" stroke="#fcf0c9" stroke-width="2"/></g>`).join('')}<path d="M446 64Q508 8 569 64Z" fill="#8e6c50" stroke="#634b38" stroke-width="3"/><ellipse cx="509" cy="64" rx="67" ry="10" fill="#9d7955" stroke="#634b38" stroke-width="3"/><ellipse cx="508" cy="29" rx="12" ry="7" fill="#674f3d"/><path d="M181 174H89M192 330H90" fill="none" stroke="#877c65" stroke-dasharray="4 4"/><text x="29" y="169" fill="#4c6f6b" font-size="19">물 높이</text><text x="29" y="327" fill="#79715c" font-size="19">젖은 천</text><text x="460" y="109" fill="#79715c" font-size="17">열어 놓은 뚜껑</text>${spot('water','씨앗',215,235,173,105)}${spot('lid','뚜껑',442,12,135,72)}${spot('wall','항아리 벽',133,191,60,103)}<text x="320" y="403" text-anchor="middle" fill="#776b53" font-size="15">이해를 돕기 위해 안쪽이 보이게 그린 그림</text></svg>`;
  }
  function dishArt(t) {
  const sprouted=t.sprouted;
  return `<svg viewBox="0 0 280 165" aria-hidden="true"><ellipse cx="140" cy="130" rx="105" ry="23" fill="#7c806c" opacity=".1"/><path d="M38 102Q140 74 242 102L228 130Q140 154 52 130Z" fill="${t.id==='B'?'#d8c39f':'#e7e4cf'}" stroke="#9a967e" stroke-width="2"/><ellipse cx="140" cy="102" rx="102" ry="24" fill="${t.id==='B'?'#eee0bf':'#d8e1cf'}" stroke="#9a967e" stroke-width="2"/>${[72,116,160,204].map((x,i)=>i<sprouted?`<g class="growing-sprout"><path d="M${x} 108Q${x-10} 74 ${x+2} 52" fill="none" stroke="#648253" stroke-width="4"/><path d="M${x} 73Q${x-33} 38 ${x-32} 67Q${x-20} 84 ${x} 73Z" fill="#8ca66a" stroke="#637d50"/><path d="M${x} 61Q${x+10} 23 ${x+29} 42Q${x+27} 62 ${x} 61Z" fill="#adc187" stroke="#7a935e"/></g>`:`<ellipse cx="${x}" cy="105" rx="10" ry="16" transform="rotate(25 ${x} 105)" fill="#dbc58e" stroke="#ad945e"/>`).join('')}${t.id==='C'?'<path d="M236 24V61M220 33L252 52M220 52L252 33" stroke="#83b3ba" stroke-width="2"/>':''}</svg>`;
  }
  const VIEW = {
    share: () => `<article class="evidence-document ledger-doc"><span class="doc-overline">흥부가 남긴 기록 · 3월 10일</span><h3>박씨 나눔 기록</h3><div class="ledger-grid"><span>같은 주머니에</span><strong>모두 20알</strong><span>달래에게</span><strong>12알</strong><span>형님 놀부에게</span><strong>남은 씨앗 전부</strong></div><p class="doc-copy">“지난해 거둔 박의 씨앗을<br>값 없이 나누어 드립니다.”</p><p class="doc-signer">적은 이 · 흥부</p></article>`,
    care: () => `<article class="evidence-document note-doc"><span class="doc-overline">박씨와 함께 건넨 쪽지</span><h3>형님께</h3><p class="doc-copy">씨앗이 <b>촉촉하게</b> 지내게 해 주세요.<br>오래 물에 잠기게 두지는 마세요.<br><b>공기가 통하고 알맞게 따뜻한 곳</b>에서<br>천천히 기다려 주세요.</p><p class="doc-signer">동생 흥부 올림</p><div class="paper-crease"></div></article>`,
    jar: () => `<div class="observation-heading"><span>현장 관찰 · 3월 18일</span><b>나바름이 뚜껑을 열고 살핀 항아리</b></div>${jarDiagram(false)}<p class="muted">수사 당시 모습을 그렸어요. 씨앗 세 알이 물속에 잠겨 있었고, 뚜껑이 덮여 있었어요.</p>`,
    order: () => `<article class="evidence-document order-doc"><span class="doc-overline">3월 10일부터 지킬 작업 지시</span><h3>돌쇠는 들으라!</h3><p class="order-copy">물을 <b>매일 한 바가지</b> 더 붓거라.<br>물이 차도 <b>따라내지 말거라.</b><br>뚜껑도 꼭 덮어 두거라.<br>많이 주면 빨리 자랄 게다!</p><div class="doc-signer"><span>놀부</span><span class="official-stamp">놀부<br>확인</span></div></article><p class="gl">이것은 놀부의 생각을 적은 지시서예요. 과학적으로 맞는 설명인지는 따져 보아야 해요.</p>`,
    journal: () => `<article class="journal"><header><span class="doc-overline">3월 10일 → 3월 18일 · 여드레 동안</span><h3>달래의 관찰 일지</h3></header><p>같은 주머니에서 꺼낸 박씨를 <b>4알씩</b> 세 그릇에 나누었어요.</p><div class="tw"><table class="seat experiment-table"><thead><tr><th scope="col">그릇</th><th scope="col">물</th><th scope="col">온도</th><th scope="col">싹튼 수</th></tr></thead><tbody>${TRIALS.map(t=>`<tr><th scope="row">${t.id}</th><td>${t.water}</td><td>${t.temp}</td><td><b>${t.sprouted} / 4알</b></td></tr>`).join('')}</tbody></table></div><p class="gl">모두 공기가 통했고, 씨앗 수·종류·관찰 기간·빛 등 나머지 조건은 같게 했어요.</p><p class="muted">이 사건에서 관찰한 결과예요. 실제 싹트는 시간과 수는 씨앗의 종류·상태·조건에 따라 달라요. 싹이 보이지 않았다고 곧바로 죽었다고 할 수는 없어요.</p></article>`
  };
  // 돌쇠 심문: 증거를 내민 뒤 그림에서 어긋나는 곳을 짚습니다.
  const POINT = {
    answer: 'water',
    title: '돌쇠의 말과 다른 부분은?',
    quote: '“천만 살짝 적셨소. 씨앗이 물에 잠긴 적은 없소!”',
    prompt: '그림에서 말과 어긋나는 부분을 짚어 주세요.',
    spots: [['water', '씨앗'], ['lid', '뚜껑'], ['wall', '항아리 벽']],
    diagram: jarDiagram,
    wrongTitle: '씨앗이 놓인 곳을 살펴보세요',
    wrong: '돌쇠는 씨앗이 물에 잠기지 않았다고 했어요. 뚜껑이나 벽보다는 씨앗과 물 높이를 비교해 보세요.'
  };

  // ---------- 씨앗 수 세기 ----------
  const COUNT = {
    kicker: '작은 수학 수사',
    title: '형님에게 간 씨앗은 몇 알?',
    intro: '같은 주머니의 20알을 달래와 놀부에게 나누었어요.',
    label: '놀부 몫 씨앗 수', unit: '알', max: 20, answer: 8,
    visual: control => `<div class="seed-ledger"><div class="seed-total"><span>처음 씨앗</span><b>20알</b></div><div class="seed-all" aria-label="씨앗 20알">${Array.from({length:20},()=>`<span class="seed-token">${seed()}</span>`).join('')}</div><div class="seed-destinations"><div class="seed-basket"><span class="basket-label">달래의 실험</span><b>4알씩 × 3그릇</b><div class="mini-dishes">${[0,1,2].map(i=>`<div><span>${'ABC'[i]}</span><div>${[1,2,3,4].map(()=>seed(1)).join('')}</div></div>`).join('')}</div><span class="basket-sum">모두 12알</span></div><div class="seed-basket nolbu-basket"><span class="basket-label">놀부의 몫</span><b>남은 씨앗 전부</b>${control}<span class="basket-sum">20 − 12 = ?</span></div></div></div>`,
    wrong: '달래 몫은 4알씩 세 그릇, 모두 12알이에요. 처음 20알에서 12알을 빼 보세요.',
    hint: ['한 걸음씩 계산해요', '20에서 먼저 10을 빼면 10, 거기서 2를 더 빼면 몇 알일까요?']
  };

  // ---------- 공정한 비교 ----------
  const LAB = {
    kicker: '달래의 작은 실험실',
    common: ['같은 씨앗 주머니', '각 4알', '공기 · 빛 · 기간 같음'],
    trials: TRIALS,
    dims: [['water', '물'], ['temp', '온도']],
    result: ['싹튼 수', t => `<strong>${t.sprouted}</strong> / 4알`],
    art: dishArt,
    checkLabel: '이 두 그릇 비교하기',
    caption: '그림은 3월 18일, 여드레 동안 관찰한 뒤의 모습이에요.',
    note: '실제 씨앗의 싹트는 시간과 수는 종류·상태·조건에 따라 달라요. 여기 나온 수는 이야기 속 관찰 결과예요.',
    hint: ['한 가지 조건만 다르게', '먼저 A와 비교해 보세요. 물을 알아볼 때에는 물만, 온도를 알아볼 때에는 온도만 달라야 해요.'],
    rounds: [
      {
        title: '물이 싹트기에 영향을 줄까요?',
        intro: '물만 다르고, 나머지 조건은 같은 <b>두 그릇</b>을 골라 주세요.',
        answer: ['A', 'B'],
        okTitle: 'A와 B를 비교해요',
        ok: '온도와 다른 조건은 같고, 물을 준 것이 달라요. 이 관찰에서는 촉촉하게 둔 A에서만 싹이 났어요.',
        okNote: '물과 온도를 동시에 바꾸면 어느 조건 때문인지 알기 어려워요.',
        wrong: 'A와 C는 온도가 달라요. B와 C는 물과 온도가 모두 달라요. 물만 다른 두 그릇을 찾아보세요.',
        next: '이번에는 온도 비교하기 →'
      },
      {
        title: '온도가 싹트기에 영향을 줄까요?',
        intro: '온도만 다르고, 나머지 조건은 같은 <b>두 그릇</b>을 골라 주세요.',
        answer: ['A', 'C'],
        okTitle: 'A와 C를 비교해요',
        ok: '물과 다른 조건은 같고, 온도가 달라요. 이 관찰에서는 알맞게 따뜻한 A에서만 싹이 났어요.',
        okNote: '싹이 안 난 C의 씨앗이 모두 죽었다고 단정할 수는 없어요. 조건을 바꾸거나 더 기다려 살펴볼 수 있어요.',
        wrong: 'A와 B는 물이 달라요. B와 C는 물과 온도가 모두 달라요. 온도만 다른 두 그릇을 찾아보세요.',
        next: '결과를 가지고 법정으로 →'
      }
    ]
  };

  // ---------- 사실과 추측 ----------
  const FACTS = {
    kicker: '최종 증거 점검',
    title: '본 것과 짐작한 것을 나누어요',
    intro: '기록이나 관찰로 확인했나요? 아니면 아직 더 확인해야 할 생각인가요?',
    facts: [
      {id:'water', text:'수사하던 날, 놀부의 씨앗은 물에 잠겨 있었다.', answer:'fact', why:'나바름이 항아리를 열어 직접 관찰하고 그림으로 남겼어요.'},
      {id:'harm', text:'흥부가 일부러 씨앗을 망가뜨렸다.', answer:'guess', why:'씨앗이 싹트지 않았다는 사실만으로 누군가의 행동이나 마음까지 알 수는 없어요.'},
      {id:'three', text:'A 그릇에서는 네 알 중 세 알이 싹텄다.', answer:'fact', why:'달래가 관찰한 결과가 일지에 기록되어 있어요.'},
      {id:'dead', text:'여드레 동안 싹트지 않은 씨앗은 모두 죽었다.', answer:'guess', why:'물이나 온도 때문에 아직 싹트지 않았을 수도 있어요. 더 확인해야 해요.'}
    ],
    hint: ['확인한 만큼만 말해요', '눈으로 본 모습이나 적힌 수는 확인할 수 있어요. 하지만 누군가의 마음, 모든 씨앗의 상태는 그것만으로 알 수 있을까요?']
  };

  const VERDICT = {
    kicker: '사건 번호 002 · 최종 판결',
    stamp: '무죄',
    title: '흥부의 누명을 벗겼어요.',
    sub: '“싹이 안 났다”가 “일부러 망쳤다”는 증거는 아니에요.',
    cards: [
      {title: '관아의 판결 · 원님', who: 'wonnim', text: '흥부가 일부러 씨앗을 망가뜨렸다는 증거가 없소. 놀부는 함부로 의심한 일을 사과하고, 돌쇠는 본 사실을 숨기지 마시오. 씨앗은 바른 조건에서 함께 다시 살펴보시오.'},
      {modern: true, title: '오늘의 시선 · 한저울 판사', who: 'judge', text: '일부 그릇의 결과만으로 모든 씨앗을 판단할 수 없어요. 사람을 탓하기 전에, 물·공기·온도 같은 다른 원인도 살펴야 해요. 모르는 것은 더 확인하는 태도가 공정한 판단의 시작입니다.'}
    ],
    strip: [['수학', '20 − 12 = 8'], ['과학', '물 · 공기 · 알맞은 온도'], ['추리', '사실과 추측 구별']],
    note: '씨앗이 싹트기 시작하는 것과, 싹이 자라는 것은 구별해요. 자란 식물에는 빛도 중요해요. 씨앗 종류에 따라 싹틀 때의 빛 조건도 다를 수 있어요.',
    foot: '고전 인물을 활용해 만든 이야기 속 재판입니다.'
  };

  return {
    n: 2, classic: '흥부전', title: '싹트지 않는 박의 비밀',
    helper: 'dalrae',            // 힌트와 낱말 풀이를 맡는 인물
    court: 'court',              // 법정 배경 그림
    portraits: ['baleum', 'wonnim', 'heungbu', 'nolbu', 'dolsoe', 'dalrae', 'judge'],
    art: {nolbu: 'nolbu-v3', wonnim: 'wonnim-v3'},   // 인물 이름과 그림 파일 이름이 다를 때
    chars: {
      baleum: '나바름',
      wonnim: '고을 원님',
      heungbu: '흥부',
      nolbu: '놀부',
      dolsoe: '돌쇠',
      dalrae: '달래',
      judge: '한저울 판사',
      narr: '',
      crowd: '구경꾼들'
    },
    glossary: {
      '고소': '어떤 사람이 잘못했다고 알리고, 조사와 판단을 부탁하는 일이에요.',
      '증거': '어떤 일이 있었는지 확인하는 데 도움이 되는 물건이나 기록이에요.',
      '증언': '자기가 보고 들은 일을 법정에서 말하는 것이에요.',
      '관찰': '어떤 일이 일어나는지 자세히 살펴보는 것이에요.',
      '조건': '어떤 일에 영향을 주는 주변 상황이에요. 씨앗에게는 물과 온도 등이 조건이에요.',
      '싹트기': '씨앗 속 어린 식물이 자라기 시작하는 것이에요. 뿌리가 먼저 나오기도 해요.',
      '공정한 비교': '알아보고 싶은 조건만 바꾸고, 나머지는 같게 해서 비교하는 것이에요.',
      '추측': '확인한 사실을 바탕으로 그럴 것이라고 생각하는 것이에요. 더 확인해야 할 수도 있어요.'
    },
    evidence: {
      share: {name:'박씨 나눔 기록', short:'모두 20알, 달래에게 12알. 나머지는?', icon:'seed', view:VIEW.share},
      care: {name:'씨앗 돌봄 쪽지', short:'흥부가 박씨와 함께 건넨 설명', icon:'note', view:VIEW.care},
      jar: {name:'항아리 관찰 그림', short:'수사하던 날 항아리 안을 그린 그림', icon:'jar', view:VIEW.jar},
      journal: {name:'달래의 관찰 일지', short:'같은 주머니의 씨앗, 다른 세 가지 조건', icon:'book', view:VIEW.journal},
      order: {name:'놀부의 작업 지시', short:'물이 많을수록 빨리 싹튼다?', icon:'order', view:VIEW.order}
    },
    places: [
      {id:'home', name:'흥부네 툇마루', art:'heungbu-home', ev:'share', who:'heungbu', line:'지난해 거둔 박에서 나온 씨앗이오. 달래와 형님께 같은 주머니에서 나누어 드렸지요. 나눈 수를 적어 두었소.'},
      {id:'gate', name:'놀부네 대문', art:'nolbu-yard', ev:'care', who:'dalrae', line:'대문 틈에 흥부의 쪽지가 끼어 있어요. 씨앗을 어떻게 돌보라고 했는지 읽어 봐요!'},
      {id:'store', name:'항아리 보관 자리', art:'gotgan', ev:'jar', who:'baleum', line:'뚜껑을 열어 보니 씨앗이 물에 잠겨 있어. 직접 본 모습을 그림으로 남겨 두자.'},
      {id:'notebook', name:'달래의 관찰 자리', art:'heungbu-home', ev:'journal', who:'dalrae', line:'세 그릇에 네 알씩 넣고 날마다 살폈어요. 달라진 조건과 싹튼 수를 적어 놓았어요!'},
      {id:'pail', name:'물동이 놓는 자리', art:'nolbu-yard', ev:'order', who:'dalrae', line:'물동이 밑에 지시서가 있어요. "물을 매일 더 붓고, 따라내지 말라." 누가 이렇게 시킨 걸까요?'}
    ],
    witnesses: {
      nolbu1: {
        who:'nolbu', title:'첫 심문 · 놀부의 계산',
        statements:[
          {text:'흥부가 박씨를 나누던 날, 주머니에는 스무 알이 있었소.', cards:[{q:'직접 세어 보셨나요?', a:'그럼! 내 눈앞에서 스무 알을 세었지.'}]},
          {text:'달래가 열두 알을 가져갔고, 나머지는 내가 전부 받았소.', cards:[{q:'다른 사람도 가져갔나요?', a:'아니오. 그 자리에는 우리 셋뿐이었소.'}]},
          {text:'그런데 내가 받은 건 겨우 세 알이오. 숫자부터 속인 게 틀림없소!', cards:[{q:'처음 받은 수와 지금 남은 수를 헷갈리신 건 아닌가요?', a:'에헴… 그, 그럴 리가! 숫자는 내가 잘 알지!', mood:'sweat'}]}
        ],
        solve:{evidence:'share', statements:[2]},
        hints:['스무 알을 둘이 나누었어요. 달래가 몇 알을 받았는지 떠올려 보세요.', '3번 증언의 씨앗 수를 나눈 기록과 비교해 보세요.', '3번 증언을 선택하고 「박씨 나눔 기록」을 내미세요.'],
        wrong:'이 증언의 어떤 부분을 확인할 수 있는 증거일까요? 씨앗을 나눈 수가 적힌 기록을 찾아보세요.'
      },
      dolsoe: {
        who:'dolsoe', title:'두 번째 심문 · 물을 준 돌쇠',
        statements:[
          {text:'놀부 나리 댁에서 일하는 돌쇠요. 나리의 지시를 받고 제가 씨앗에 물을 주었소.', cards:[{q:'씨앗은 어디에 두었나요?', a:'뒤주 옆, 따뜻한 자리에 놓인 항아리요.'}]},
          {text:'천만 살짝 적셨소. 씨앗이 물에 잠긴 적은 없소!', cards:[{q:'물은 얼마나 주었나요?', a:'한 바가… 아니, 조금이오! 살짝만!', mood:'sweat'}]},
          {text:'흥부가 준 쪽지는 읽지 못했소.', cards:[{q:'누구의 말대로 돌보았나요?', a:'놀부 나리의 지시대로 했지요. 방법을 따로 확인하지 않고 시키는 대로 했소.'}]}
        ],
        solve:{evidence:'jar', statements:[1], point:POINT},
        hints:['씨앗이 놓인 곳을 직접 관찰한 증거가 있어요.', '2번 증언의 「물에 잠긴 적은 없다」는 말이 맞을까요?', '2번 증언에 「항아리 관찰 그림」을 내민 뒤 물에 잠긴 씨앗을 짚어 보세요.'],
        wrong:'말로 들은 설명과 직접 본 항아리 안을 대조해 보세요. 다른 증언에 내밀어야 할 수도 있어요.'
      },
      nolbu2: {
        who:'nolbu', title:'마지막 심문 · 못 본 싹',
        statements:[
          {text:'물은 많이 줄수록 좋을 줄 알았소. 그래서 내가 돌쇠에게 더 부으라고 했지.', cards:[{q:'흥부의 쪽지는 확인하셨나요?', a:'글쎄… 급한 마음에 읽지 않았소.', mood:'sweat'}]},
          {text:'달래네 B와 C 그릇에서도 싹이 하나도 안 난 것을 봤소.', cards:[{q:'A 그릇도 보셨나요?', a:'A는… 툇마루 안쪽에 있어서 못 봤소.', mood:'sweat'}]},
          {text:'그러니 같은 주머니에서 나온 씨앗은 전부 못 쓰는 씨앗이오!', cards:[{q:'전부라고 말할 근거가 있나요?', a:'두 그릇이나 봤으면 충분한 것 아니오?'}]}
        ],
        solve:{evidence:'journal', statements:[2]},
        hints:['두 그릇만 보고 전체를 판단해도 될까요?', '관찰 일지에서 A 그릇의 결과를 보세요.', '3번 증언에 「달래의 관찰 일지」를 내미세요. A에서는 네 알 중 세 알이 싹텄어요.'],
        wrong:'확인한 일부와 전체가 같은지는 더 살펴야 해요. 세 그릇의 결과가 모두 적힌 증거를 찾아보세요.'
      }
    },
    stages: [
      {type:'talk', chapter:'새로운 의뢰', lines:[
        L('narr', '첫 사건을 마친 나바름에게 새 의뢰가 도착했습니다. 흥부와 놀부가 사는 마을에서, 어린 관찰가 달래가 길을 안내합니다.'),
        L('nolbu', '내 박은 왜 감감무소식이냐! 동생 놈이 못 쓰는 씨앗을 준 게 분명하오!', 'stern'),
        L('wonnim', '놀부가 동생 흥부를 고소했소. 박씨를 일부러 망가뜨려 주었다는 주장이오.', 'normal', {words:['고소']}),
        L('heungbu', '저는 지난해 거둔 박의 씨앗을 나누었을 뿐이오. 달래에게도 같은 주머니에서 주었소.', 'sad'),
        L('dalrae', '저는 이 마을의 달래예요. 흥부 아저씨에게 받은 씨앗을 기르며, 날마다 관찰한 것을 적고 있어요.'),
        L('baleum', '반가워, 달래. 씨앗이 싹트려면 어떤 조건이 필요한지 함께 알아보자. 짐작보다 직접 확인한 증거가 중요해.', 'normal', {words:['조건', '싹트기']}),
        L('wonnim', '누가 더 큰 소리를 내는지가 아니라 증거로 판단하겠소. 현장을 조사해 오시오.', 'stern', {words:['증거']}),
        L('dalrae', '마을 길은 제가 잘 알아요. 다섯 곳의 기록과 물건을 함께 살펴봐요!', 'happy')
      ]},
      {type:'investigate', chapter:'다섯 곳의 단서'},
      {type:'talk', chapter:'놀부의 증언', lines:[
        L('narr', '놀부가 배를 내밀며 증인석에 섰습니다.'),
        L('nolbu', '나는 큰 손해를 보았소! 게다가 씨앗 수도 속았다니까!', 'stern'),
        L('dalrae', '증언을 넘겨 보고, 이상한 말에 맞는 증거를 내밀어 보세요. 궁금한 말은 질문할 수 있어요.', 'normal', {words:['증언']})
      ]},
      {type:'cross', id:'nolbu1', chapter:'씨앗 수를 확인하라'},
      {type:'count', chapter:'스무 알의 행방', ...COUNT},
      {type:'talk', chapter:'여덟 알의 행방', lines:[
        L('baleum', '스무 알에서 달래 몫 열두 알을 빼면 여덟 알입니다. 형님이 전부 받았다고 하셨지요?', 'stern', {shout:true}),
        L('nolbu', '에헴… 맞소. 나중에 다섯 알을 따로 옮겨 놓고, 항아리에 남은 세 알만 센 것이오.', 'sweat'),
        L('wonnim', '처음 받은 수와 나중에 남은 수는 다르오. 정확히 구별해서 말하시오.'),
        L('dalrae', '그럼 처음에는 여덟 알이었네요. 이번에는 씨앗을 어떻게 돌보았는지 알아봐요.'),
        L('narr', '놀부네 일꾼 돌쇠가 어깨를 움츠리고 들어왔습니다. 항아리에 물을 준 사람입니다.'),
        L('dolsoe', '저, 저는 돌쇠입니다. 나리께서 시키는 대로 물을 주었을 뿐인데요…', 'sweat')
      ]},
      {type:'cross', id:'dolsoe', chapter:'항아리 속 단서'},
      {type:'talk', chapter:'좋다는 말을 믿었는데', lines:[
        L('baleum', '이 그림을 보세요. 씨앗은 천 위에 살짝 젖은 정도가 아니라, 물속에 잠겨 있습니다!', 'stern', {shout:true}),
        L('dolsoe', '맞아요… 매일 한 바가지씩 붓고 뚜껑도 덮었어요. 놀부 나리가 물을 많이 줄수록 빨리 자란다고 해서…', 'sad'),
        L('baleum', '씨앗도 싹트면서 공기 속 산소를 써. 물에 오래 잠겨 있으면 필요한 산소를 얻기 어려워질 수 있지.'),
        L('dolsoe', '도와드리려던 건데 일이 틀어져서 무서웠어요. 그래서 물에 안 잠겼다고 거짓말했어요. 죄송해요.', 'sad'),
        L('wonnim', '잘못 알았던 것과, 사실을 숨긴 것은 따로 살펴야겠소.'),
        L('dalrae', '저는 같은 주머니의 씨앗으로 세 가지 조건을 비교했어요. 제 관찰 일지도 봐 주세요!', 'normal', {words:['관찰']}),
        L('baleum', '좋아. 어떤 조건이 영향을 주었는지 알려면, 비교하는 방법도 공정해야 해.', 'normal', {words:['공정한 비교']})
      ]},
      {type:'compare', chapter:'달래의 작은 실험실', ...LAB},
      {type:'talk', chapter:'모든 씨앗이 나빴을까', lines:[
        L('baleum', '달래는 A와 B의 물 조건을 다르게 하고, A와 C의 온도를 다르게 했어. 관찰한 기간은 같았지.', 'happy'),
        L('dalrae', 'B와 C를 바로 비교하면 물과 온도가 둘 다 달라서, 어느 조건 때문인지 알기 어렵겠네요.'),
        L('baleum', '맞아. 알아보려는 조건 하나만 다르게 하고, 나머지는 같게 비교해야 해.'),
        L('dalrae', 'A에서는 네 알 중 세 알이 싹텄어요. B와 C에서는 여드레 동안 싹이 보이지 않았고요.'),
        L('wonnim', '아직 싹트지 않았다는 말과, 씨앗이 죽었다는 말도 같지는 않소. 계속 살펴야겠구려.'),
        L('nolbu', '잠깐! 나도 달래네 그릇을 봤소. 내 말도 끝까지 들어 보시오!', 'stern')
      ]},
      {type:'cross', id:'nolbu2', chapter:'일부만 보고 내린 결론'},
      {type:'talk', chapter:'놓친 쪽지 한 장', lines:[
        L('baleum', 'A에서는 세 알이 싹텄습니다. 두 그릇만 보고 모든 씨앗이 나쁘다고 할 수는 없소!', 'stern', {shout:true}),
        L('nolbu', '그… 그건 못 보았소. 내 박만 안 자라는 것 같아 속이 상했소.', 'shock'),
        L('heungbu', '형님, 씨앗과 함께 드린 쪽지를 읽으셨소? 촉촉하게 두되 물에 오래 잠기게 하지 말라고 썼소.', 'sad'),
        L('nolbu', '읽지 않았소. 빨리 박을 길러 동생보다 큰 부자가 되고 싶었지…', 'sad'),
        L('dalrae', '그래서 물을 자꾸 더 부으라고 하셨군요.'),
        L('baleum', '그렇다고 항아리만 보고 모든 원인이 확인된 것은 아니야. 씨앗의 상태와 조건을 더 살펴볼 수 있어.'),
        L('wonnim', '분명한 것은, 지금 증거로 흥부가 일부러 씨앗을 망가뜨렸다고 단정할 수 없다는 것이오.'),
        L('dalrae', '판결 전에, 확인한 사실과 아직 더 확인해야 할 생각을 나누어 볼까요?', 'normal', {words:['추측']})
      ]},
      {type:'facts', chapter:'사실과 추측의 경계', ...FACTS},
      {type:'verdict', chapter:'증거가 이끄는 판결', ...VERDICT},
      {type:'diary', chapter:'나의 판관 일기'},
      {type:'end', chapter:'다시 자라는 믿음'}
    ],
    landing: {
      intro: '같은 박씨인데, 왜 내 것만 안 자랄까?<br>욕심 많은 형의 고소장 뒤에 숨은<br><strong>작은 씨앗의 진실을 밝혀 주세요.</strong>',
      start: '흥부의 사건 맡기',
      backdrop: 'heungbu-home',
      people: [['heungbu', 'sad'], ['nolbu', 'stern'], ['baleum', 'normal']],   // 왼쪽, 오른쪽, 가운데
      bubble: '씨앗은 거짓말을 하지 않소!',
      label: ['흥부전에서 시작된 새로운 사건', '싹트지 않은 박씨의 진실'],
      steps: ['단서 수집', '관찰과 비교', '증거로 판결'],
      credit: '초등 3–4학년부터 · 읽는 속도에 따라 약 20–30분 · 진행 자동 저장'
    },
    diary: {
      title: '다시 이런 일이 생기지 않으려면?',
      intro: '가장 마음에 드는 생각을 골라 주세요. 여기에는 정답이 없어요.',
      choices: [
        '놀부가 흥부에게 공개적으로 사과하고, 지시하기 전에 방법을 확인해야 해요.',
        '돌쇠는 실수를 숨기지 말고 사실대로 말해야 해요.',
        '함께 조건을 맞춰 다시 길러 보고, 결과를 기록하면 좋겠어요.'
      ],
      placeholder: '예: 싹이 안 났다고 바로 누군가를 탓하지 않을 거예요.'
    },
    end: {
      backdrop: 'heungbu-home',
      people: [['heungbu', 'happy'], ['dalrae', 'happy']],
      quote: '“형님, 이번에는 함께 기다려 봅시다.”',
      kicker: '두 번째 사건 해결',
      title: '진실도, 씨앗도<br><em>살펴야 자라요.</em>',
      text: '놀부는 흥부에게 사과했습니다.<br>형제는 달래의 일지를 펼치고, 새 씨앗을 함께 돌보기 시작했습니다.',
      badges: ['씨앗 계산가', '공정한 실험가', '증거 탐정']
    },
    guide: `<h3>제2화 · 교사·보호자 안내</h3><p>증언과 증거를 비교하며 사건을 해결하는 어린이 법정 추리 게임입니다.</p><p>아이가 답을 고른 까닭을 묻고, 서로 다른 증거가 같은 결론을 가리키는지 함께 살펴보세요. 책임 저울과 판관 일기에서는 자신의 생각을 근거와 함께 표현하도록 도와주세요.</p><p>사건의 해설과 교사용 정답은 교사용 검수실에서 비밀번호를 입력한 뒤 확인할 수 있습니다.</p><p class="muted">로그인이나 개인정보 입력 없이 사용하며, 진행 상황과 판관 일기는 이 브라우저에 저장됩니다. 화마다 진행 기록은 별개입니다.</p>`
  };
})();
