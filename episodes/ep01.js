'use strict';
// 제1화 · 춘향전 — 잔칫상 배탈 사건
// 춘향전의 인물을 빌려 새로 꾸민 사건입니다. 자료 형식은 docs/episode-format.md 를 보세요.
window.CASE = (() => {
  const L = (who, text, mood = 'normal', extra = {}) => ({who, text, mood, ...extra});

  // ---------- 좌석표와 차림표 ----------
  const SEAT = {foods:['떡', '생선찜', '나물', '식혜'], rows:[['배불뚝 현감', [1, 1, 1, 0], 1], ['이웃 양반', [0, 1, 0, 1], 1], ['서당 훈장', [1, 0, 1, 1], 0], ['좌수 영감', [1, 1, 0, 1], 1], ['약방 의원', [0, 0, 1, 1], 0], ['포목 상인', [1, 0, 0, 0], 0]]};
  const seatTable = () => `<div class="tw"><table class="seat"><thead><tr><th>손님</th>${SEAT.foods.map(f => `<th>${f}</th>`).join('')}<th>배탈</th></tr></thead><tbody>${SEAT.rows.map(r => `<tr><td>${r[0]}</td>${r[1].map(v => `<td>${v ? '먹음' : '-'}</td>`).join('')}<td class="${r[2] ? 'sick' : ''}">${r[2] ? '아픔' : '멀쩡'}</td></tr>`).join('')}</tbody></table></div>`;

  // ---------- 부엌 배치도와 문서 그림 ----------
  let mapSerial = 0;
  function kitchenMap(interactive){
  const uid='kitchen'+(++mapSerial),u=n=>`url(#${uid+n})`;
  const labels={cup:'찬장',fire:'아궁이',jang:'장독대',well:'우물가'};
  const group=(id,body,box)=>`<g ${interactive?`class="map-spot" data-action="spot" data-value="${id}" role="button" tabindex="0" aria-label="${labels[id]} 선택"`:''}>${body}${interactive?`<rect class="spot-outline" x="${box[0]}" y="${box[1]}" width="${box[2]}" height="${box[3]}" rx="18"/>`:''}</g>`;
  const label=(x,y,t)=>`<g><rect x="${x-48}" y="${y-19}" width="96" height="32" rx="5" fill="#fff7e5" stroke="#c2aa80"/><text x="${x}" y="${y+3}" text-anchor="middle" font-size="19" fill="#4b4030" font-family="Court Sans, sans-serif">${t}</text></g>`;
  const jar=(x,y,scale=1,wine=false)=>`<g transform="translate(${x} ${y}) scale(${scale})"><ellipse cy="5" rx="24" ry="9" fill="#4b3525" opacity=".17"/><path d="M-16 -49 Q-31 -28 -22 -5 Q-18 5 0 5 Q18 5 22 -5 Q31 -28 16 -49Z" fill="${u('jar')}" stroke="#604733" stroke-width="2"/><path d="M-24 -28 Q0 -18 24 -28 M-23 -16 Q0 -6 23 -16" fill="none" stroke="#b28b61" stroke-width="2"/><ellipse cy="-48" rx="19" ry="6" fill="#65503a" stroke="#4c3d2e" stroke-width="2"/><ellipse cy="-50" rx="15" ry="3" fill="#9e7c52"/><path d="M-14 -39 Q-19 -27 -15 -20" fill="none" stroke="#d1ad74" stroke-width="3" opacity=".7"/>${wine?'<rect x="-11" y="-33" width="22" height="26" rx="2" fill="#ead8b2" transform="rotate(-5)"/><text x="0" y="-14" text-anchor="middle" font-size="16" fill="#5f3f2e" font-family="Gowun Dodum">술</text>':''}</g>`;
  const cup=`<ellipse cx="174" cy="210" rx="105" ry="18" fill="#48341e" opacity=".13"/><path d="M77 103 L251 103 L267 88 L94 88Z" fill="#bb9766" stroke="#6d5135" stroke-width="2"/><path d="M251 103 L267 88 V198 L251 214Z" fill="#795536" stroke="#6d5135" stroke-width="2"/><rect x="77" y="103" width="174" height="110" rx="3" fill="${u('wood')}" stroke="#6d5135" stroke-width="3"/><path d="M88 114 H239 V202 H88Z M164 114 V202" fill="none" stroke="#d2b17b" stroke-width="3"/><path d="M95 123 H155 M174 123 H232 M95 194 H155 M174 194 H232" stroke="#6f4c2c" fill="none"/><circle cx="153" cy="159" r="4" fill="#cbb478"/><circle cx="176" cy="159" r="4" fill="#cbb478"/>${[110,147,187,224].map(x=>`<ellipse cx="${x}" cy="86" rx="14" ry="5" fill="#f7eddb" stroke="#a79776"/><path d="M${x-14} 86 Q${x} 108 ${x+14} 86" fill="#e8ddc5" stroke="#a79776"/>`).join('')}${label(173,66,'찬장')}`;
  const fire=`<ellipse cx="180" cy="455" rx="120" ry="19" fill="#4c3524" opacity=".14"/><path d="M74 355 L257 355 L278 334 L95 334Z" fill="#d3bd95" stroke="#a38a67" stroke-width="2"/><path d="M257 355 L278 334 V430 L257 453Z" fill="#a38c6d"/><path d="M74 355 H257 V453 H74Z" fill="${u('clay')}" stroke="#8a7357" stroke-width="2"/><path d="M130 453 V409 Q165 375 200 409 V453Z" fill="#3d322a" stroke="#786048" stroke-width="4"/><path d="M139 448 Q127 423 153 426 Q160 397 173 426 Q192 411 191 448Z" fill="#d88443"/><path d="M151 448 Q148 430 165 419 Q163 437 181 448Z" fill="#f6d286"/><path d="M132 451 L186 433 M149 439 L198 451" stroke="#6e4930" stroke-width="7" stroke-linecap="round"/><ellipse cx="165" cy="343" rx="77" ry="20" fill="#454942" stroke="#383b34" stroke-width="3"/><path d="M91 340 Q164 291 239 340Z" fill="${u('iron')}" stroke="#40423b" stroke-width="2"/><ellipse cx="165" cy="313" rx="13" ry="6" fill="#363a35"/><path d="M110 331 Q162 308 221 332" fill="none" stroke="#82877b" stroke-width="2"/>${label(169,284,'아궁이')}`;
  const jang=`<path d="M526 148 L731 148 L750 174 L512 174Z" fill="#b6b19b" stroke="#918d79"/><path d="M512 174 H750 V189 H512Z" fill="#9c9885"/>${jar(559,163,1.05)}${jar(632,163,1.2)}${jar(707,163,1.05)}${label(632,66,'장독대')}`;
  const well=`<ellipse cx="637" cy="374" rx="70" ry="22" fill="#7f816a" opacity=".2"/><path d="M583 311 V358 Q636 396 689 358 V311Z" fill="${u('stone')}" stroke="#8b8c79" stroke-width="2"/><path d="M584 333 Q636 366 688 333 M609 327 V368 M659 325 V368" fill="none" stroke="#8e8f7e" stroke-width="2"/><ellipse cx="636" cy="311" rx="57" ry="29" fill="#c9c8b1" stroke="#949780" stroke-width="3"/><ellipse cx="636" cy="311" rx="40" ry="18" fill="#425b5c" stroke="#788a80" stroke-width="2"/><path d="M607 315 Q635 302 665 315" fill="none" stroke="#92b3aa" stroke-width="2"/><path d="M580 305 V244 H691 V305" fill="none" stroke="#8d6b44" stroke-width="8" stroke-linecap="round"/><path d="M637 244 V296" stroke="#b59d6e" stroke-width="3"/><path d="M629 291 H646 L644 306 H631Z" fill="#9e8056" stroke="#72583c"/>${jar(550,353,.72,true)}${jar(728,352,.72,true)}${[546,591,637,683,730].map(x=>jar(x,425,.8,true)).join('')}${jar(575,470,.82,true)}${jar(705,470,.82,true)}${label(637,228,'우물가')}`;
  return `<svg class="kitchen-plan" viewBox="0 0 800 530" role="img" aria-label="잔칫날 부엌 배치도: 왼쪽 위 찬장, 왼쪽 아래 아궁이, 오른쪽 위 장독대, 오른쪽 아래 술독이 둘러싼 우물가"><defs><linearGradient id="${uid}wood"><stop stop-color="#ba9560"/><stop offset="1" stop-color="#8d623d"/></linearGradient><linearGradient id="${uid}jar"><stop stop-color="#6d4e36"/><stop offset=".35" stop-color="#ae8050"/><stop offset="1" stop-color="#594330"/></linearGradient><linearGradient id="${uid}clay" x2="0" y2="1"><stop stop-color="#c7b18b"/><stop offset="1" stop-color="#ac916b"/></linearGradient><linearGradient id="${uid}iron" x2="0" y2="1"><stop stop-color="#777d70"/><stop offset="1" stop-color="#3e433b"/></linearGradient><linearGradient id="${uid}stone" x2="0" y2="1"><stop stop-color="#c8c8b4"/><stop offset="1" stop-color="#9c9f8c"/></linearGradient></defs><rect width="800" height="530" rx="16" fill="#eee5cd"/><rect x="26" y="32" width="442" height="456" rx="6" fill="#d8c29e"/>${Array.from({length:12},(_,i)=>`<path d="M30 ${47+i*38} H464" stroke="#b69b70" opacity=".45"/><path d="M${70+(i%3)*136} ${47+i*38} v38" stroke="#b69b70" opacity=".3"/>`).join('')}<path d="M26 488 V32 H468 V195 M468 348 V488" fill="none" stroke="#bbaa89" stroke-width="13"/><path d="M26 484 V32 H468 V195 M468 348 V484" fill="none" stroke="#f7efd9" stroke-width="7"/><path d="M475 268 Q520 256 563 288" fill="none" stroke="#c5bca0" stroke-width="19" stroke-dasharray="20 8"/>${group('cup',cup,[58,42,225,187])}${group('fire',fire,[55,256,236,221])}${group('jang',jang,[500,42,260,155])}${group('well',well,[508,204,258,281])}<g transform="translate(339 254)"><ellipse cy="48" rx="53" ry="12" fill="#7d6645" opacity=".12"/><path d="M-48 -14 V43 M48 -14 V43" stroke="#8f714a" stroke-width="7"/><path d="M-57 -36 H57 V-3 H-57Z" fill="#b59765" stroke="#846842" stroke-width="2"/><path d="M-45 -29 H40 M-45 -20 H40 M-45 -11 H40" stroke="#d7bd8b" stroke-width="2"/><path d="M13 -25 L42 -18 L38 -10 L10 -19Z" fill="#b4b7a5" stroke="#7b8272"/><path d="M10 -22 L-8 -27" stroke="#725538" stroke-width="6" stroke-linecap="round"/><text y="78" text-anchor="middle" font-size="16" fill="#7a6649" font-family="Gowun Dodum">도마</text></g><text x="43" y="516" font-size="14" font-family="Gowun Dodum" fill="#857355">부엌 안</text><text x="719" y="516" text-anchor="end" font-size="14" font-family="Gowun Dodum" fill="#857355">바깥마당</text></svg>`;
  }
  function evidenceDocument(id){
  if(id==='ledger')return `<article class="evidence-document ledger-doc" aria-label="곳간 출납 장부 내용"><span class="doc-overline">관아 곳간 기록</span><h3>곳간 출납 장부</h3><div class="ledger-grid"><span>들어온 때</span><strong>잔치 사흘 전</strong><span>들어온 물건</span><strong>생선 한 상자</strong></div><p class="doc-copy">“생선 한 상자,<br>잔치 사흘 전 들어옴.”</p><span class="doc-fold" aria-hidden="true"></span></article>`;
  if(id==='note')return `<article class="evidence-document note-doc" aria-label="어멈의 쪽지 내용"><span class="doc-overline">생선 바구니 속에서 찾은 쪽지</span><div class="handwritten">겨울 잘 나시오.</div><div class="paper-crease" aria-hidden="true"></div></article>`;
  if(id==='order')return `<article class="evidence-document order-doc" aria-label="변학도의 명령서 내용"><span class="doc-overline">관아 문서함에서 찾은 문서</span><h3>명령서</h3><p class="order-copy">고을 생선을 남김없이 바치고,<br>우물가에 술독을 가득 채우라.</p><div class="doc-signer"><span>사또 변학도</span><span class="official-stamp" aria-label="사또의 도장">변학도<br>관인</span></div></article>`;
  return '';
  }
  const VIEW = {
    seat: seatTable,
    map: () => `<div class="mapwrap">${kitchenMap(false)}</div>`,
    ledger: () => evidenceDocument('ledger'),
    note: () => evidenceDocument('note'),
    order: () => evidenceDocument('order')
  };
  // 방자 심문: 증거를 내민 뒤 그림에서 어긋나는 곳을 짚습니다.
  const POINT = {
    answer: 'well',
    title: '배치도의 어디가 이상할까요?',
    quote: '“그래서 생선은 시원한 우물가에 두었소!”',
    prompt: '그림에서 방자의 말과 어긋나는 곳을 짚어 주세요.',
    spots: [['fire', '아궁이'], ['cup', '찬장'], ['jang', '장독대'], ['well', '우물가']],
    diagram: interactive => `<div class="mapwrap">${kitchenMap(interactive)}</div>`,
    wrong: '그곳에는 이상한 점이 없어요. 방자가 생선을 두었다고 말한 곳을 다시 찾아보세요.'
  };

  // ---------- 공통 원인 찾기 ----------
  const SEAT_PUZZLE = {
    kicker: '작은 과학 수사',
    title: '좌석표와 차림표',
    intro: '손님들이 먹은 음식과 배탈 여부예요. 빨간 글씨가 아픈 손님이에요.',
    body: seatTable,
    question: '아픈 손님들이 <u>모두</u> 먹은 음식은 무엇일까요?',
    options: SEAT.foods,
    check(i) {
      const miss = SEAT.rows.filter(r => r[2]).find(r => !r[1][i]);
      return miss ? `음... ${miss[0]}은(는) ${SEAT.foods[i]}을(를) 안 먹었는데도 아팠어요. 아픈 사람 모두에게 공통인 음식을 찾아봐요!` : true;
    },
    after: [
      L('hyangdan', '맞아요! 아픈 사람은 모두 생선찜을 먹었어요.', 'happy'),
      L('hyangdan', '모두에게 공통인 걸 찾으면 원인이 보여요!'),
      L('baleum', '떡만 먹은 포목 상인과 서당 훈장님은 멀쩡하고. 범인은 떡이 아니라 생선찜이야!'),
      L('mongryong', '흠... 그렇다면 생선찜을 다룬 사람을 불러야겠소. 생선을 나른 자를 들이시오!')
    ]
  };

  // ---------- 책임 저울과 판결 ----------
  const SCALE = {
    title: '책임 저울',
    intro: '증거 카드를 골라 접시에 올려 보세요. 많이 올릴수록 그 사람의 책임이 무겁다는 뜻이에요. 정답은 없어요.',
    pans: [{id:'eomeom', name:'누룽지 어멈'}, {id:'bangja', name:'방자'}, {id:'byeon', name:'사또 변학도'}],
    help: '여기엔 정답이 없어요. 나바름 나리가 생각하는 대로 올려 보세요!'
  };
  const VERDICT = {
    kicker: '사건 번호 001 · 최종 판결',
    stamp: '무죄',
    title: '춘향은 무죄!',
    sub: '떡은 배탈의 원인이 아니었어요.',
    cards: [
      {title: '조선 관아 · 판관 이몽룡', who: 'mongryong', byKey: {
        eomeom: '어멈이 묵은 생선을 쓴 것이 탈의 시작이오. 허나 어부들을 살핀 마음은 갸륵하니, 손님들께 정중히 사죄하고 앞으로 음식을 더 살피라.',
        bangja: '생선을 더운 아궁이 옆에 두고 거짓말까지 한 방자의 잘못이 크오. 손님들께 사죄하고, 한 달 동안 부엌 일을 도우며 음식 다루는 법을 배우라.',
        byeon: '백성의 생선을 남김없이 빼앗고 우물가를 술독으로 채운 사또의 욕심이 이 일의 뿌리요. 사또는 어부들에게 생선 값을 돌려주고 손님들께 사죄하라.',
        even: '누구 한 사람만의 잘못이 아니오. 사또와 어멈과 방자가 함께 손님들께 사죄하고, 어부들의 생선 값은 사또가 돌려주라.'
      }},
      {modern: true, title: '현대 법정 · 한저울 판사', who: 'judge', byKey: {
        eomeom: '남은 생선찜을 검사했더니 세균이 아주 많이 나왔습니다. 어멈은 일부러 한 게 아니라 실수였고, 이유도 있었어요. 그래도 음식을 만드는 사람으로서 더 살폈어야 합니다. 손님들의 치료비를 함께 갚도록 하세요.',
        bangja: '검사해 보니 생선은 따뜻한 곳에 오래 있어서 상했습니다. 방자가 일부러 그런 건 아니에요. 하지만 거짓말로 재판을 어지럽힌 건 잘못입니다. 사과하고, 음식 보관하는 법을 배우세요.',
        byeon: '검사해 보니 상한 생선이 원인이었습니다. 그런데 그 시작은 높은 자리의 힘으로 무리한 명령을 내린 사또였어요. 사또는 어부들에게 생선 값을 돌려주고 손님들의 치료비를 책임지세요.',
        even: '검사해 보니 상한 생선이 원인이었고, 여러 사람의 실수와 무리한 명령이 겹쳤습니다. 각자 한 일만큼 나누어 책임지고, 함께 손님들께 사과하세요.'
      }}
    ],
    question: ['같은 사건인데 왜 판결이 다를까요?', '조선 판관은 사람들의 말과 마음을 살폈고, 현대 판사는 남은 음식 검사 같은 과학 증거와 "일부러 했는지, 실수였는지"를 따졌어요.'],
    strip: [['국어', '춘향전의 인물들'], ['과학', '음식이 상하는 까닭'], ['추리', '공통 원인 찾기']],
    foot: '춘향전의 인물을 활용해 만든 이야기 속 재판입니다.'
  };

  return {
    n: 1, classic: '춘향전', title: '잔칫상 배탈 사건',
    helper: 'hyangdan',          // 힌트와 낱말 풀이를 맡는 인물
    wrongSpeaker: 'mongryong',   // 틀린 증거를 냈을 때 말하는 인물
    court: 'court',              // 법정 배경 그림
    rules: {pair: true},         // "두 증언 맞대기" 사용
    portraits: ['baleum', 'chunhyang', 'hyangdan', 'mongryong', 'hyeongam', 'bangja', 'eomeom', 'ingeo', 'byeon', 'judge'],
    text: {
      wrongEvidence: '그 증거가 지금 증언과 무슨 상관이오?',
      wrongPair: '두 증언이 서로 어긋나지 않소. 다시 살펴보시오.'
    },
    chars: {
      baleum: '나바름',
      hyangdan: '향단',
      mongryong: '판관 이몽룡',
      chunhyang: '춘향',
      hyeongam: '배불뚝 현감',
      bangja: '방자',
      eomeom: '누룽지 어멈',
      ingeo: '잉어 아재',
      byeon: '사또 변학도',
      judge: '한저울 판사',
      crowd: '구경꾼들',
      narr: ''
    },
    glossary: {
      '판관': '재판을 맡아서 판결을 내리는 사람이에요.',
      '피고': '잘못했다는 의심을 받아서 재판을 받는 사람이에요.',
      '혐의': '"이 사람이 했을지도 몰라" 하는 의심이에요.',
      '증거': '무슨 일이 있었는지 보여주는 물건이나 기록이에요.',
      '증인': '자기가 보고 들은 걸 법정에서 말해주는 사람이에요.',
      '증언': '증인이 법정에서 하는 말이에요.',
      '심문': '증인한테 질문해서 그 말이 맞는지 하나하나 따져보는 거예요.',
      '판결': '재판에서 누구에게 잘못이 있는지 마지막으로 정하는 거예요.'
    },
    evidence: {
      seat: {name:'좌석표와 차림표', short:'손님 여섯 명이 무엇을 먹었고 누가 아팠는지 적은 표. 현감 자리에는 빈 생선찜 그릇이 세 개 놓여 있었다.', icon:'table', view:VIEW.seat},
      map: {name:'부엌 배치도', short:'잔칫날 부엌을 그린 그림. 아궁이, 찬장, 장독대, 우물가가 보인다. 우물가에는 술독이 빼곡하다.', icon:'map', view:VIEW.map},
      ledger: {name:'곳간 출납 장부', short:'곳간에 물건이 들고 난 기록. "생선 한 상자, 잔치 사흘 전 들어옴."', icon:'ledger', view:VIEW.ledger},
      note: {name:'어멈의 쪽지', short:'어부 집 생선 바구니 속에서 나온 쪽지. 삐뚤빼뚤한 글씨로 "겨울 잘 나시오."', icon:'note', view:VIEW.note},
      order: {name:'변학도의 명령서', short:'"고을 생선을 남김없이 바치고, 우물가에 술독을 가득 채우라." 사또의 도장이 쾅 찍혀 있다.', icon:'order', view:VIEW.order}
    },
    places: [
      {id:'madang', name:'잔치 마당', art:'madang', ev:'seat', who:'hyangdan', line:'손님들 자리가 적힌 좌석표랑 차림표예요! 누가 뭘 먹었는지 다 적혀 있어요.'},
      {id:'kitchen', name:'부엌', art:'kitchen', ev:'map', who:'baleum', line:'부엌 배치도를 그려 두자. 그런데 우물가에 술독이 잔뜩이네?'},
      {id:'gotgan', name:'곳간', art:'gotgan', ev:'ledger', who:'baleum', line:'곳간 출납 장부야. 물건이 들어온 날짜가 꼼꼼히 적혀 있어.'},
      {id:'fisher', name:'어부 집', art:'fisher', ev:'note', who:'hyangdan', line:'생선 바구니 속에 쪽지가 있어요. "겨울 잘 나시오"? 누가 쓴 걸까요?'},
      {id:'office', name:'관아 문서함', art:'office', ev:'order', who:'baleum', line:'사또의 명령서다. 도장이 쾅 찍혀 있어.'}
    ],
    witnesses: {
      hyeongam: {
        who:'hyeongam', title:'배불뚝 현감의 증언',
        statements:[
          {text:'잔치는 아주 성대했소. 상다리가 휘어질 정도였지!', cards:[{q:'어떤 음식들이 나왔나요?', a:'떡, 생선찜, 나물, 식혜... 없는 게 없었소!'}, {q:'손님은 몇 명이었나요?', a:'나까지 여섯이었소. 에헴.'}]},
          {text:'음식이 하나같이 맛났소. 특히 생선찜 국물이 짭짤한 게 일품이었소.', cards:[{q:'생선찜이 어떤 맛이었나요?', a:'짭짤하고 진했지! 어흠, 그, 그렇다고 들었소.', mood:'sweat'}, {q:'생선찜을 몇 그릇 드셨나요?', a:'에, 그, 그건... 기억이 잘 안 나오! 아무튼 맛있었다는 거지!', mood:'sweat'}]},
          {text:'그런데 춘향이 보낸 떡을 먹자마자 배가 꾸르륵거리기 시작했소!', cards:[{q:'떡은 언제 드셨나요?', a:'잔치 끝 무렵에 후식으로 먹었소.'}, {q:'떡 말고 또 뭘 드셨나요?', a:'에헴! 그건 중요하지 않소!', mood:'sweat'}]},
          {text:'분명히 말하지만, 나는 생선은 입에도 안 댔소. 범인은 그 떡이오!', cards:[{q:'정말 생선은 한 입도 안 드셨나요?', a:'그렇다니까! 입에도 안 댔소! 꾸르륵...', mood:'sweat'}]}
        ],
        solve:{pair:[1, 3]},
        hints:['현감 나리의 말을 처음부터 끝까지 다시 들어 보세요. 같은 음식 이야기가 두 번 나와요.', '2번 증언과 4번 증언에 같은 음식이 나와요. 그 음식에 대해 각각 뭐라고 했나요?', '2번 증언(생선찜 국물이 짭짤했다)과 4번 증언(생선은 입에도 안 댔다)을 골라 "두 증언 맞대기"를 누르세요.'],
        success:[
          L('baleum', '잠깐, 그 말씀 이상하오!', 'normal', {shout:true}),
          L('baleum', '현감 나리, 방금 생선찜 국물이 짭짤한 게 일품이었다고 하셨지요?'),
          L('baleum', '그런데 생선은 입에도 안 대셨다고요? 입에도 안 댄 음식의 맛을 어떻게 아십니까!'),
          L('hyeongam', '꾸, 꾸르르륵...! (부채가 툭 떨어진다)', 'shock'),
          L('crowd', '어? 생선을 먹었다는 거잖아?'),
          L('hyeongam', '그, 그게... 사실... 생선찜을... 세 그릇 먹었소. 체면이 있어서 차마...', 'sad'),
          L('mongryong', '증인! 법정에서 거짓을 말하면 아니 되오!', 'shock'),
          L('hyangdan', '나리, 해냈어요!', 'happy'),
          L('baleum', '떡만 먹은 사람은 어땠을까? 좌석표와 차림표를 펼쳐 보자.')
        ]
      },
      bangja: {
        who:'bangja', title:'방자의 증언',
        statements:[
          {text:'생선 상자는 제가 직접 부엌으로 날랐소.', cards:[{q:'상자는 몇 개였나요?', a:'큰 상자 하나였소. 꽤 무거웠지요.'}]},
          {text:'어멈께서 생선은 시원한 데 두라 하셨지요.', cards:[{q:'어멈이 정확히 뭐라고 하셨나요?', a:'우물가 그늘에 두라고... 하셨소.'}]},
          {text:'그래서 생선은 시원한 우물가에 두었소!', cards:[{q:'우물가 어디쯤에 두었나요?', a:'그, 그냥 우물 옆에요! 자리가 넉넉했소!', mood:'sweat'}, {q:'그날 우물가에 다른 물건은 없었나요?', a:'없, 없었소! 텅 비어 있었소!', mood:'sweat'}]},
          {text:'그 뒤로는 마당을 쓸러 나가서 아무것도 모르오.', cards:[{q:'생선을 다시 보러 가지 않았나요?', a:'바빠서 못 갔소... 정말이오.'}]}
        ],
        solve:{evidence:'map', statements:[2], point:POINT},
        hints:['방자가 생선을 어디에 뒀다고 했는지 잘 보세요. 그곳을 그린 증거가 있어요.', '3번 증언에 "부엌 배치도"를 내밀어 보세요.', '3번 증언에서 부엌 배치도를 내밀고, 그림에서 우물가를 가리키세요.'],
        success:[
          L('baleum', '잠깐, 그 말씀 이상하오!', 'normal', {shout:true}),
          L('baleum', '이 배치도를 보세요! 그날 우물가는 사또가 시킨 술독으로 꽉 차 있었습니다.'),
          L('baleum', '생선 상자를 둘 자리가 없었을 텐데요!'),
          L('bangja', '으아아! 들켰다!', 'shock'),
          L('bangja', '사, 사실은... 자리가 없어서 아궁이 옆에 뒀어요. 어멈께 혼날까 봐... 그리고 제 탓에 손님들이 아픈 것 같아서 무서웠어요...', 'sad'),
          L('hyangdan', '나리, 아궁이 옆은 하루 종일 뜨끈했을 거예요.'),
          L('hyangdan', '음식을 따뜻한 곳에 오래 두면 세균이 빨리 늘어나서 상해요!'),
          L('baleum', '그런데 하루 만에 그렇게 상했을까? 생선이 처음부터 싱싱했는지도 알아봐야겠어.'),
          L('mongryong', '부엌을 맡은 어멈을 부르시오!')
        ]
      },
      eomeom: {
        who:'eomeom', title:'누룽지 어멈의 증언',
        statements:[
          {text:'생선찜은 내가 정성껏 만들었소.', cards:[{q:'어떻게 만드셨나요?', a:'양념을 넉넉히 해서 푹 쪘지. 내 솜씨는 고을이 다 아오.'}]},
          {text:'생선은 오늘 아침 갓 잡은 것이었소.', cards:[{q:'누가 잡아 온 생선인가요?', a:'어, 어부들이지! 당연한 걸 묻는구려.', mood:'sweat'}]},
          {text:'어부들이 새벽같이 가져다주었지.', cards:[{q:'직접 받으셨나요?', a:'그, 그렇소... 아마도.', mood:'sweat'}]},
          {text:'내 음식 때문에 탈이 났다니, 믿을 수가 없소.', cards:[{q:'방자가 생선을 아궁이 옆에 둔 건 아셨나요?', a:'그건 몰랐소. 우물가에 두라 일렀는데... 아이고.'}]}
        ],
        solve:{evidence:'ledger', statements:[1, 2]},
        hints:['어멈은 생선이 언제 들어왔다고 했나요?', '생선이 들어온 날짜가 적힌 증거가 있어요.', '2번 증언(갓 잡은 생선)에 "곳간 출납 장부"를 내밀어 보세요.'],
        success:[
          L('baleum', '잠깐, 그 말씀 이상하오!', 'normal', {shout:true}),
          L('baleum', '곳간 출납 장부를 보세요. 생선은 잔치 사흘 전에 곳간에 들어왔다고 적혀 있습니다!'),
          L('baleum', '갓 잡은 생선이 아니라, 며칠 묵은 생선이었던 거예요.'),
          L('eomeom', '...!', 'shock'),
          L('eomeom', '그래, 맞소. 묵은 생선을 썼소. 하지만 왜 그랬는지는... 말하지 않겠소.', 'sad'),
          L('hyangdan', '어멈이 뭔가 감추고 있어요. 생선을 바친 어부한테 물어보면 알 수 있지 않을까요?'),
          L('mongryong', '생선을 바친 어부를 부르시오!')
        ]
      },
      ingeo: {
        who:'ingeo', title:'잉어 아재의 증언',
        statements:[
          {text:'사또 명령서를 받고 생선을 잡았소.', cards:[{q:'명령서에는 뭐라고 쓰여 있었나요?', a:'고을 생선을 남김없이 바치라 했소.'}]},
          {text:'명령대로 다 바쳤소.', cards:[{q:'바친 생선은 어떻게 됐나요?', a:'...모르오.', mood:'sweat'}]},
          {text:'부엌 어멈은... 잘 모르는 사람이오.', cards:[{q:'정말 모르는 사이인가요?', a:'......', mood:'sweat'}]},
          {text:'더 할 말은 없소.', cards:[{q:'겨울 준비는 잘 되어 가나요?', a:'...올겨울은 넘길 수 있을 것 같소.'}]}
        ],
        solve:{evidence:'note', statements:[1, 2]},
        hints:['어부는 생선을 다 바쳤다고 해요. 정말일까요?', '어부 집에서 찾은 증거를 떠올려 보세요.', '2번 증언(다 바쳤소)에 "어멈의 쪽지"를 내밀어 보세요.'],
        success:[
          L('baleum', '잠깐, 그 말씀 이상하오!', 'normal', {shout:true}),
          L('baleum', '아재, 이 쪽지는 아재 집 생선 바구니에서 나온 겁니다. "겨울 잘 나시오."'),
          L('baleum', '바친 생선이 바구니째 돌아왔던 거지요?'),
          L('ingeo', '...그렇소. 어멈이 생선을 몰래 돌려보내 줬소.', 'sad'),
          L('ingeo', '생선을 다 바치면 우리 식구들은 겨울을 못 나오. 어멈은 그걸 알고...', 'sad'),
          L('eomeom', '아재, 말하지 말랬잖소...', 'sad'),
          L('eomeom', '어부들 몫을 빼앗을 수가 없었소. 그래서 곳간에 있던 생선을 썼지. 묵은 줄은 알았지만, 이렇게 될 줄은 몰랐소.', 'sad'),
          L('narr', '법정이 조용해졌습니다.'),
          L('hyangdan', '나리... 어멈은 나쁜 사람이 아니었네요.', 'sad'),
          L('baleum', '응. 그런데 처음에 생선을 남김없이 바치라고 한 건 누구였지? 우물가를 술독으로 채우라고 한 것도...'),
          L('mongryong', '진실이 드러났소. 판결을 내리기 전에 변호인의 생각을 듣겠소. 누구에게 얼마만큼 책임이 있다고 보오?', 'normal', {words:['판결']})
        ]
      }
    },
    stages: [
      {type:'talk', chapter:'재판이 열리다', lines:[
        L('narr', '둥! 둥! 둥! 남원 관아 마당에 북소리가 울려 퍼집니다.', 'normal', {fx:'drum'}),
        L('mongryong', '지금부터 잔칫상 배탈 사건의 재판을 시작하겠소! 나는 이 재판을 맡은 판관이오.', 'normal', {words:['판관']}),
        L('mongryong', '피고 춘향은 사또의 생일잔치에 떡을 보냈고, 그 떡을 먹은 손님들이 배탈이 났다는 혐의를 받고 있소.', 'normal', {words:['피고', '혐의']}),
        L('crowd', '역시 떡이 문제였구먼! 쯧쯧...'),
        L('chunhyang', '저는 이웃 잔치에 인사로 떡을 보냈을 뿐이에요...', 'sad'),
        L('hyangdan', '바름 나리, 저희 아씨 좀 꼭 도와주세요! 아씨는 그런 분이 아니에요.', 'sad'),
        L('baleum', '걱정 마, 향단. 진짜 원인이 따로 있다면 증언 속에 반드시 틈이 있을 거야.'),
        L('mongryong', '재판에 앞서, 변호인은 증거를 모아 오시오!', 'normal', {words:['증거']}),
        L('hyangdan', '나리, 잔치와 관련된 곳을 한 바퀴 둘러봐요!', 'happy')
      ]},
      {type:'investigate', chapter:'다섯 곳의 증거'},
      {type:'talk', chapter:'첫 번째 증인', lines:[
        L('mongryong', '증거는 다 모았소? 그럼 첫 증인을 부르겠소.'),
        L('narr', '쿵, 쿵, 쿵. 배가 불룩한 현감이 부채를 부치며 들어옵니다. 꾸르륵...', 'normal', {fx:'drum'}),
        L('hyeongam', '에헴! 나는 옆 고을 현감이오. 어제 잔치에 갔다가 아주 혼쭐이 났소이다!'),
        L('mongryong', '증인, 그날 있었던 일을 증언하시오.', 'normal', {words:['증인', '증언']}),
        L('hyangdan', '나리, 이제 심문이에요! 증언을 하나씩 넘겨 보면서 질문하거나 증거를 내밀 수 있어요.', 'normal', {words:['심문']}),
        L('hyangdan', '앞에서 한 말과 뒤에서 한 말이 서로 안 맞으면 "두 증언 맞대기"를 눌러 보세요!', 'happy')
      ]},
      {type:'cross', id:'hyeongam', chapter:'현감의 증언'},
      {type:'pick', chapter:'공통 원인을 찾아라', ...SEAT_PUZZLE},
      {type:'talk', chapter:'생선을 나른 사람', lines:[
        L('narr', '어깨를 잔뜩 움츠린 방자가 쭈뼛쭈뼛 들어옵니다.'),
        L('bangja', '에헤헤... 저는 관아 심부름꾼 방자요. 그날 생선을 나른 게 바로 저요.', 'sweat'),
        L('mongryong', '생선을 어떻게 다뤘는지 증언하시오.'),
        L('hyangdan', '이번엔 이상한 말에 맞는 증거를 내밀어 봐요!')
      ]},
      {type:'cross', id:'bangja', chapter:'방자의 증언'},
      {type:'talk', chapter:'부엌의 주인', lines:[
        L('narr', '행주치마를 두른 어멈이 꼿꼿하게 걸어 들어옵니다.'),
        L('eomeom', '내가 이 관아 부엌을 맡은 누룽지 어멈이오. 우리 부엌 음식에 탈이 났다니, 기가 막혀서 원.'),
        L('mongryong', '생선찜에 대해 증언하시오.')
      ]},
      {type:'cross', id:'eomeom', chapter:'어멈의 증언'},
      {type:'talk', chapter:'말 없는 어부', lines:[
        L('narr', '젖은 짚신을 신은 어부가 삿갓을 쓴 채 조용히 섭니다.'),
        L('ingeo', '...잉어 아재라 하오. 강에서 고기 잡는 사람이오.'),
        L('mongryong', '사또에게 생선을 바친 일에 대해 증언하시오.')
      ]},
      {type:'cross', id:'ingeo', chapter:'아재의 증언'},
      {type:'scale', chapter:'책임 저울', ...SCALE},
      {type:'verdict', chapter:'두 시대의 판결', ...VERDICT},
      {type:'diary', chapter:'나의 판관 일기'},
      {type:'end', chapter:'사건 해결'}
    ],
    landing: {
      intro: '떡을 먹고 탈이 났다는데…<br>잠깐, 정말 떡 때문일까요?<br><strong>작은 단서로 커다란 진실을 찾아보세요.</strong>',
      start: '사건 수첩 펼치기',
      backdrop: 'court',
      people: [['chunhyang', 'normal'], ['hyangdan', 'happy'], ['baleum', 'happy']],   // 왼쪽, 오른쪽, 가운데
      bubble: '이 사건, 제가 맡겠소!',
      label: ['사건 번호 001', '춘향의 억울함을 밝혀라'],
      steps: ['현장 조사', '증언 추리', '나만의 판결'],
      credit: '춘향전을 새롭게 각색한 어린이 추리 이야기 · 진행 자동 저장'
    },
    diary: {
      title: '내가 판관이라면 어떻게 판결할까요?',
      intro: '가장 마음에 드는 생각을 골라 주세요. 여기에는 정답이 없어요.',
      choices: [
        '어멈은 용서받아야 해요. 어부들을 도우려 했으니까요.',
        '사또가 가장 큰 책임을 져야 해요. 무리한 명령이 시작이었으니까요.',
        '모두 조금씩 잘못했으니 함께 사과해야 해요.'
      ],
      placeholder: '예: 어멈이 처음부터 사실대로 말했으면 좋았을 것 같아요.'
    },
    end: {
      backdrop: 'court',
      people: [['chunhyang', 'happy'], ['hyangdan', 'happy']],
      quote: '“나리, 해냈어요!”',
      kicker: '첫 번째 사건 해결',
      title: '춘향의 억울함을<br><em>풀었어요.</em>',
      text: '증언의 모순을 찾는 네 가지 방법을 모두 써 봤어요.',
      badges: ['자기모순', '현장 배치', '문서 날짜', '증거품']
    },
    guide: `<h3>제1화 · 교사·보호자 안내</h3><p>증언과 증거를 비교하며 사건을 해결하는 어린이 법정 추리 게임입니다.</p><p>아이가 답을 고른 까닭을 묻고, 서로 다른 증거가 같은 결론을 가리키는지 함께 살펴보세요. 책임 저울과 판관 일기에서는 자신의 생각을 근거와 함께 표현하도록 도와주세요.</p><p>사건의 해설과 교사용 정답은 교사용 검수실에서 비밀번호를 입력한 뒤 확인할 수 있습니다.</p><p class="muted">로그인이나 개인정보 입력 없이 사용하며, 진행 상황과 판관 일기는 이 브라우저에 저장됩니다. 화마다 진행 기록은 별개입니다.</p>`
  };
})();
