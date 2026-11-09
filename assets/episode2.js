'use strict';
(() => {
  const C = window.CASE2;
  const $ = s => document.querySelector(s);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const SAVE = 'ddeokip-ep2-save', DIARY = 'ddeokip-ep2-diary';
  const moods = {normal:0,happy:1,sad:2,shock:3,sweat:4,stern:5};
  const portraits = ['baleum','hyangdan','mongryong','heungbu','nolbu','bangja','dalrae','judge'];
  const fresh = () => ({version:1, screen:'title', stage:0, line:0, ev:[], coins:5, cross:{}, count:0, labRound:0, labSelected:[], labPassed:false, facts:{}, seen:[], choice:null, diaryText:'', diarySaved:false, complete:false});
  let S = fresh(), hasSave = false, focusBeforeModal = null, hintLevel = 1, toastTimer;
  const st = () => C.stages[S.stage];
  const read = (key, fallback) => {try {return JSON.parse(localStorage.getItem(key)) ?? fallback;} catch {return fallback;}};
  const loaded = read(SAVE, null);
  if (loaded && loaded.version === 1 && Number.isInteger(loaded.stage) && loaded.stage >= 0 && loaded.stage < C.stages.length) {
    S = {...fresh(), ...loaded, screen:'title'};
    S.ev = Array.isArray(S.ev) ? S.ev.filter(k => C.evidence[k]) : [];
    S.seen = Array.isArray(S.seen) ? S.seen.filter(k => C.glossary[k]) : [];
    S.cross = S.cross && typeof S.cross === 'object' ? S.cross : {};
    S.facts = S.facts && typeof S.facts === 'object' ? S.facts : {};
    S.coins = Number.isFinite(S.coins) ? Math.max(1,Math.min(5,S.coins)) : 5;
    S.line = Number.isInteger(S.line) ? Math.max(0,Math.min(S.line,(st().lines?.length || 1)-1)) : 0;
    S.count = Number.isInteger(S.count) ? Math.max(0,Math.min(20,S.count)) : 0;
    S.labRound = S.labRound === 1 ? 1 : 0;
    S.labSelected = Array.isArray(S.labSelected) ? [...new Set(S.labSelected.filter(k => ['A','B','C'].includes(k)))].slice(0,2) : [];
    S.choice = Number.isInteger(S.choice) && C.diaryChoices[S.choice] ? S.choice : null;
    S.diaryText = typeof S.diaryText === 'string' ? S.diaryText.slice(0,160) : '';
    hasSave = true;
  }
  function save() {
    try {localStorage.setItem(SAVE,JSON.stringify(S)); hasSave=true;}
    catch {$('#save-status').hidden=false; $('#save-status').textContent='이 브라우저에서는 진행 상황을 저장할 수 없어요. 게임은 계속할 수 있어요.';}
  }
  function face(id, mood='normal') {
    if (!portraits.includes(id)) return '';
    const n=moods[mood] ?? 0;
    return `<svg class="character painted-character" viewBox="0 0 512 512" role="img" aria-label="${C.chars[id]}" data-character="${id}"><image href="assets/art/${id}.webp" x="${-(n%3)*512}" y="${-Math.floor(n/3)*512}" width="1536" height="1024" preserveAspectRatio="none"/></svg>`;
  }
  const backdrop = (id='court') => `<img class="painted-backdrop" src="assets/art/${id}.webp" alt="" draggable="false">`;
  const who = (id,text,mood='normal') => `<div class="who"><div class="mini">${face(id,mood)}</div><div><span class="wn">${C.chars[id]}</span><p>${text}</p></div></div>`;
  const action = (a,text,value='',cls='seal fill',disabled=false) => `<button class="${cls}" data-action="${a}"${value!==''?` data-value="${esc(value)}"`:''}${disabled?' disabled':''}>${text}</button>`;
  const seed = (i=0) => `<svg viewBox="0 0 40 55" aria-hidden="true"><path d="M20 3C7 13 5 32 12 44Q20 56 28 44C35 32 33 13 20 3Z" fill="${i?'#cfb77d':'#e9d7a3'}" stroke="#a6874e" stroke-width="1.5"/><path d="M20 8Q11 28 18 45" fill="none" stroke="#f9edc8" stroke-width="2"/></svg>`;
  function icon(key) {
    const type=C.evidence[key].icon;
    const drawings={seed:'<path d="M27 9C10 17 10 37 23 42C37 40 42 22 27 9Z" fill="#d8bc7c" stroke="#87633b" stroke-width="2"/><path d="M26 13Q20 25 23 37" fill="none" stroke="#fff2c9" stroke-width="2"/>',note:'<path d="M12 11H39V41H12Z" fill="#fff5d9" stroke="#8e7952" stroke-width="2"/><path d="M18 20H33M18 27H33M18 34H29" stroke="#8e7952" stroke-width="2"/>',jar:'<path d="M15 15H37Q48 37 35 43H17Q4 37 15 15Z" fill="#987250" stroke="#684b35" stroke-width="2"/><ellipse cx="26" cy="15" rx="13" ry="4" fill="#c3a27c"/>',book:'<rect x="12" y="10" width="29" height="34" rx="3" fill="#6c8875" stroke="#465d4d" stroke-width="2"/><path d="M18 10V44" stroke="#e9dbb4" stroke-width="2"/><path d="M24 20H35M24 27H35" stroke="#f4eddb" stroke-width="2"/>',order:'<path d="M11 13H41V40H11Z" fill="#fff1cd" stroke="#9a7754" stroke-width="2"/><path d="M17 21H35M17 27H28" stroke="#8e7952" stroke-width="2"/><rect x="30" y="30" width="7" height="7" fill="#aa5945"/>'};
    return `<svg viewBox="0 0 52 52" aria-hidden="true"><rect x="1" y="1" width="50" height="50" rx="9" fill="#eee1c4" stroke="#c2ab80"/>${drawings[type]}</svg>`;
  }
  function openModal(html,title) {
    if ($('#modal').hidden) focusBeforeModal=document.activeElement;
    $('#sheet').innerHTML=html;
    $('#sheet').setAttribute('aria-label',title || '안내');
    $('#modal').hidden=false;
    $('#sheet').scrollTop=0;
    const target=$('#sheet').querySelector('button,[href]');
    (target || $('#sheet')).focus({preventScroll:true});
  }
  function closeModal() {
    $('#modal').hidden=true;
    if (focusBeforeModal?.isConnected) focusBeforeModal.focus({preventScroll:true});
    focusBeforeModal=null;
  }
  function notice(title,text,id='hyangdan',mood='normal') {
    openModal(`<h3>${title}</h3>${who(id,text,mood)}<div class="row end">${action('close','알겠어요')}</div>`,title);
  }
  function shout() {
    $('#fx').innerHTML='<div class="shout">잠깐, 그 말씀 이상하오!</div>';
    clearTimeout(toastTimer); toastTimer=setTimeout(()=>$('#fx').innerHTML='',1400);
  }
  function go(n) {
    closeModal(); S.stage=n; S.line=0; S.screen='game'; save(); render(true);
  }
  function currentCross() {
    const id=st().id;
    if (!S.cross[id] || !Number.isInteger(S.cross[id].si)) S.cross[id]={si:0,wrong:0};
    S.cross[id].si=Math.max(0,Math.min(S.cross[id].si,C.witnesses[id].statements.length-1));
    return S.cross[id];
  }
  function topbar() {
    if(S.screen==='title') {$('#top').innerHTML='';return;}
    const cross=st().type==='cross';
    $('#top').innerHTML=`<div class="case-progress"><span class="logo"><em>떡잎</em>부터 무죄 <small>제2화</small></span><span class="chapter">${st().chapter}</span><div class="progress-track"><i style="width:${Math.round(S.stage/(C.stages.length-1)*100)}%"></i></div></div>
      ${cross?`<span class="coins" aria-label="기력 엽전 ${S.coins}개">${Array.from({length:5},(_,i)=>`<span class="coin ${i<S.coins?'':'off'}"></span>`).join('')}</span>`:''}
      ${action('evidence','증거함 '+S.ev.length,'','seal sm')}${action('words','낱말 주머니','','seal sm')}
      ${cross? action('hint','힌트','','seal sm'):''}${action('home','처음 화면','','seal sm')}`;
  }
  function render(moveFocus=false) {
    topbar();
    if(S.screen==='title') drawTitle();
    else ({talk:drawTalk,investigate:drawInvestigate,cross:drawCross,count:drawCount,lab:drawLab,facts:drawFacts,verdict:drawVerdict,diary:drawDiary,end:drawEnd}[st().type])();
    if(moveFocus) {$('#view').scrollTop=0; const h=$('#view').querySelector('h2,h1');if(h){h.tabIndex=-1;h.focus({preventScroll:true});}}
  }
  function drawTitle() {
    $('#view').innerHTML=`<section class="landing">
      <div class="landing-top"><span class="brand-mark">떡<span>잎</span></span><span>이야기 속에서 만나는<br><b>우리들의 작은 법정</b></span><span class="edition">사건 수첩<br>002</span></div>
      <nav class="episode-nav" aria-label="이야기 선택"><a href="./"><small>제1화</small> 춘향전</a><a href="episode2.html" aria-current="page"><small>제2화</small> 흥부전</a></nav>
      <div class="landing-main"><div class="titlewrap"><div class="eyebrow"><i></i> 조선 추리 법정극</div><h1><em>떡잎</em>부터<br>무죄<span class="title-dot">.</span></h1><div class="ep">${C.title}</div>
        <p class="intro-copy">같은 박씨인데, 왜 내 것만 안 자랄까?<br>욕심 많은 형의 고소장 뒤에 숨은<br><strong>작은 씨앗의 진실을 밝혀 주세요.</strong></p>
        <div class="title-actions">${hasSave&&!S.complete?action('continue','이어서 수사하기 <span>↗</span>','','seal fill start'):''}${action('start',S.complete?'사건 다시 맡기 <span>→</span>':'흥부의 사건 맡기 <span>→</span>','','seal start '+(hasSave&&!S.complete?'':'fill'))}</div>
        <div class="row secondary">${action('diaries','내 판관 일기','','seal sm')}${action('guide','교사·보호자 안내','','seal sm')}</div>
      </div><div class="hero">${backdrop('heungbu-home')}<div class="hero-glow"></div><div class="p p1">${face('heungbu','sad')}</div><div class="p p3">${face('nolbu','stern')}</div><div class="p p2">${face('baleum','normal')}</div><span class="hero-bubble">씨앗은 거짓말을 하지 않소!</span><div class="case-label"><span>흥부전에서 시작된 새로운 사건</span><b>싹트지 않은 박씨의 진실</b><span class="case-seal">수사<br>개시</span></div></div></div>
      <div class="landing-bottom"><span><b>01</b> 단서 수집</span><i></i><span><b>02</b> 관찰과 비교</span><i></i><span><b>03</b> 증거로 판결</span></div><p class="credit">초등 3–4학년부터 · 읽는 속도에 따라 약 20–30분 · 진행 자동 저장</p>
    </section>`;
  }
  function drawTalk() {
    const lines=st().lines, line=lines[S.line];
    let speaker=line.who;
    if (!portraits.includes(speaker)) {
      speaker=lines.slice(0,S.line).reverse().find(l=>portraits.includes(l.who))?.who;
    }
    const words=(line.words||[]).filter(w=>!S.seen.includes(w));
    if(words.length) {S.seen.push(...words);save();}
    $('#view').innerHTML=`<div class="scene">${backdrop()}<span class="tagline">제2화 · ${st().chapter}</span><div class="por">${face(speaker,line.mood)}</div></div>
      <button class="dlg" data-action="next" aria-label="다음 대사">${C.chars[line.who]?`<span class="nm ${['baleum','hyangdan'].includes(line.who)?'blue':''}">${C.chars[line.who]}</span>`:''}<span class="tx ${line.who==='narr'?'narr':''}">${esc(line.text)}</span><span class="more">눌러서 계속 ▶</span></button>
      ${(line.words||[]).length?`<div class="word-inline">새 낱말 ${line.words.map(w=>action('word',w,w,'word-chip')).join('')}<span>눌러서 뜻 보기</span></div>`:''}`;
    if(line.shout) shout();
  }
  function drawInvestigate() {
    $('#view').innerHTML=`<section class="board"><div class="section-kicker">INVESTIGATION · 현장 조사</div><h2>작은 단서부터 모아 볼까요?</h2><p class="muted">다섯 곳을 둘러보고 문서를 펼쳐 보세요. <b>${S.ev.length} / 5</b></p><div class="places">${C.places.map(p=>`<button class="place ${S.ev.includes(p.ev)?'done':''}" data-action="place" data-value="${p.id}"><img class="location-art" src="assets/art/${p.art}.webp" alt=""><b>${p.name}</b><small>${S.ev.includes(p.ev)?'수집 완료 · 다시 살펴보기':C.evidence[p.ev].name}</small></button>`).join('')}</div><div class="row end investigation-bottom">${action('court','증거를 들고 법정으로 →','','seal fill',S.ev.length!==5)}</div></section>`;
  }
  function visit(id) {
    const p=C.places.find(p=>p.id===id);if(!p)return;
    if(!S.ev.includes(p.ev)){S.ev.push(p.ev);save();}
    topbar();drawInvestigate();
    openModal(`<div class="location-banner"><img src="assets/art/${p.art}.webp" alt=""></div><h3>${C.evidence[p.ev].name}</h3>${who(p.who,esc(p.line))}${evidenceView(p.ev)}<div class="row end">${action('close','증거함에 넣기')}</div>`,C.evidence[p.ev].name);
  }
  function evidenceView(key) {
    if(key==='share')return `<article class="evidence-document ledger-doc"><span class="doc-overline">흥부가 남긴 기록 · 3월 10일</span><h3>박씨 나눔 기록</h3><div class="ledger-grid"><span>같은 주머니에</span><strong>모두 20알</strong><span>달래에게</span><strong>12알</strong><span>형님 놀부에게</span><strong>남은 씨앗 전부</strong></div><p class="doc-copy">“지난해 거둔 박의 씨앗을<br>값 없이 나누어 드립니다.”</p><p class="doc-signer">적은 이 · 흥부</p></article>`;
    if(key==='care')return `<article class="evidence-document note-doc"><span class="doc-overline">박씨와 함께 건넨 쪽지</span><h3>형님께</h3><p class="doc-copy">씨앗이 <b>촉촉하게</b> 지내게 해 주세요.<br>오래 물에 잠기게 두지는 마세요.<br><b>공기가 통하고 알맞게 따뜻한 곳</b>에서<br>천천히 기다려 주세요.</p><p class="doc-signer">동생 흥부 올림</p><div class="paper-crease"></div></article>`;
    if(key==='jar')return `<div class="observation-heading"><span>현장 관찰 · 3월 18일</span><b>나바름이 뚜껑을 열고 살핀 항아리</b></div>${jarDiagram(false)}<p class="muted">수사 당시 모습을 그렸어요. 씨앗 세 알이 물속에 잠겨 있었고, 뚜껑이 덮여 있었어요.</p>`;
    if(key==='order')return `<article class="evidence-document order-doc"><span class="doc-overline">3월 10일부터 지킬 작업 지시</span><h3>방자는 들으라!</h3><p class="order-copy">물을 <b>매일 한 바가지</b> 더 붓거라.<br>물이 차도 <b>따라내지 말거라.</b><br>뚜껑도 꼭 덮어 두거라.<br>많이 주면 빨리 자랄 게다!</p><div class="doc-signer"><span>놀부</span><span class="official-stamp">놀부<br>확인</span></div></article><p class="gl">이것은 놀부의 생각을 적은 지시서예요. 과학적으로 맞는 설명인지는 따져 보아야 해요.</p>`;
    if(key==='journal')return `<article class="journal"><header><span class="doc-overline">3월 10일 → 3월 18일 · 여드레 동안</span><h3>달래의 관찰 일지</h3></header><p>같은 주머니에서 꺼낸 박씨를 <b>4알씩</b> 세 그릇에 나누었어요.</p><div class="tw"><table class="seat experiment-table"><thead><tr><th scope="col">그릇</th><th scope="col">물</th><th scope="col">온도</th><th scope="col">싹튼 수</th></tr></thead><tbody>${C.trials.map(t=>`<tr><th scope="row">${t.id}</th><td>${t.water}</td><td>${t.temp}</td><td><b>${t.sprouted} / 4알</b></td></tr>`).join('')}</tbody></table></div><p class="gl">모두 공기가 통했고, 씨앗 수·종류·관찰 기간·빛 등 나머지 조건은 같게 했어요.</p><p class="muted">이 사건에서 관찰한 결과예요. 실제 싹트는 시간과 수는 씨앗의 종류·상태·조건에 따라 달라요. 싹이 보이지 않았다고 곧바로 죽었다고 할 수는 없어요.</p></article>`;
    return '';
  }
  function jarDiagram(interactive) {
    const spot=(id,label,x,y,w,h)=>interactive?`<g role="button" tabindex="0" data-action="spot" data-value="${id}" aria-label="${label}" class="jar-spot"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12"/><text x="${x+w/2}" y="${y+h-8}" text-anchor="middle">${label}</text></g>`:'';
    return `<svg class="jar-diagram" viewBox="0 0 640 430" role="img" aria-label="항아리 속 단면 그림. 물 높이보다 아래에 씨앗 세 알이 있고, 뚜껑은 옆으로 열어 놓았다."><defs><linearGradient id="jar-clay" x2="1" y2="1"><stop stop-color="#bf9266"/><stop offset="1" stop-color="#755640"/></linearGradient><linearGradient id="jar-water" x2="0" y2="1"><stop stop-color="#bcd9d6" stop-opacity=".8"/><stop offset="1" stop-color="#709d99" stop-opacity=".75"/></linearGradient></defs><rect width="640" height="430" rx="14" fill="#eae1cc"/><path d="M0 353Q320 320 640 355V430H0Z" fill="#d7c6a8"/><ellipse cx="299" cy="363" rx="151" ry="21" fill="#88735b" opacity=".18"/><path d="M191 80H407Q480 185 423 345Q301 391 175 345Q122 186 191 80Z" fill="url(#jar-clay)" stroke="#72543c" stroke-width="4"/><path d="M210 96H388Q445 202 404 329Q300 363 194 329Q152 203 210 96Z" fill="#e9d9b8" stroke="#997854" stroke-width="2"/><path d="M178 174Q290 161 421 174L403 329Q300 363 194 329Z" fill="url(#jar-water)"/><path d="M178 174Q290 161 421 174" fill="none" stroke="#5c918e" stroke-width="3"/><path d="M200 316Q280 301 402 317L399 331Q285 357 196 330Z" fill="#cfc7ad" stroke="#aea68f" stroke-width="2"/>${[245,300,355].map((x,i)=>`<g transform="translate(${x} 286) rotate(${i*12-12})"><path d="M0-20C-22-5-14 23 0 22C15 21 22-5 0-20Z" fill="#e5cf9c" stroke="#9b7d4e" stroke-width="2"/><path d="M0-14Q-8 5 0 16" fill="none" stroke="#fcf0c9" stroke-width="2"/></g>`).join('')}<path d="M446 64Q508 8 569 64Z" fill="#8e6c50" stroke="#634b38" stroke-width="3"/><ellipse cx="509" cy="64" rx="67" ry="10" fill="#9d7955" stroke="#634b38" stroke-width="3"/><ellipse cx="508" cy="29" rx="12" ry="7" fill="#674f3d"/><path d="M181 174H89M192 330H90" fill="none" stroke="#877c65" stroke-dasharray="4 4"/><text x="29" y="169" fill="#4c6f6b" font-size="19">물 높이</text><text x="29" y="327" fill="#79715c" font-size="19">젖은 천</text><text x="460" y="109" fill="#79715c" font-size="17">열어 놓은 뚜껑</text>${spot('water','씨앗',215,235,173,105)}${spot('lid','뚜껑',442,12,135,72)}${spot('wall','항아리 벽',133,191,60,103)}<text x="320" y="403" text-anchor="middle" fill="#776b53" font-size="15">이해를 돕기 위해 안쪽이 보이게 그린 그림</text></svg>`;
  }
  function evidenceBox(picking=false) {
    const c=picking?currentCross():null;
    openModal(`<h3>${picking?`증언 ${c.si+1}에 내밀 증거`:'사건 증거함'}</h3><div class="evlist">${S.ev.map(id=>`<button class="ev" data-action="${picking?'submit-evidence':'show-evidence'}" data-value="${id}"><span class="ic">${icon(id)}</span><span class="ev-body"><b>${C.evidence[id].name}</b><span class="muted">${C.evidence[id].short}</span></span></button>`).join('') || '<p>현장을 조사하면 증거가 모여요.</p>'}</div><div class="row end">${action('close','닫기','','seal')}</div>`,picking?'증거 내밀기':'증거함');
  }
  function drawCross() {
    const w=C.witnesses[st().id],c=currentCross(),line=w.statements[c.si];
    $('#view').innerHTML=`<div class="scene">${backdrop()}<span class="tagline">${w.title}</span><div class="por">${face(w.who,c.reply?(line.mood||'normal'):'normal')}</div></div>
      <div class="stmt ${c.reply?'reply':''}"><span class="nm">${c.reply?C.chars[w.who]:`증언 ${c.si+1} / ${w.statements.length}`}</span><div class="tx">${c.reply?esc(line.a):'“'+esc(line.text)+'”'}</div></div>
      <div class="cross-controls"><div class="chips" role="group" aria-label="증언 고르기">${w.statements.map((_,i)=>action('statement',i+1,i,'chip '+(c.si===i?'on':''))).join('')}</div><div class="row">${action('question',c.reply?'증언으로 돌아가기':'질문하기','','seal blue')}${action('present','이 증언에 증거 내밀기')}</div></div>
      ${c.asking?`<div class="cards">${action('reply',esc(line.q),'','qcard')}</div>`:''}<p class="muted cross-help">이상한 말이 있는 번호를 고르고, 그 말을 확인할 증거를 내미세요.</p>`;
  }
  function wrong(message) {
    const c=currentCross();c.wrong=(c.wrong||0)+1;S.coins--;
    let extra='';if(S.coins<=0){S.coins=5;extra='<br><br>기력 엽전을 다시 채웠어요. 모은 증거는 그대로예요. 천천히 다시 생각해 봐요.';}
    save();topbar();
    notice('한 번 더 살펴볼까요?',esc(message)+extra,'hyangdan');
  }
  function submitEvidence(id) {
    if(st().type!=='cross'||!S.ev.includes(id))return;
    const w=C.witnesses[st().id],c=currentCross();
    if(w.solve.evidence!==id||!w.solve.statements.includes(c.si)){wrong(w.wrong);return;}
    if(w.solve.point){openModal(`<h3>방자의 말과 다른 부분은?</h3><p class="gl">“천만 살짝 적셨소. 씨앗이 물에 잠긴 적은 없소!”</p>${jarDiagram(true)}<p>그림에서 말과 어긋나는 부분을 짚어 주세요.</p><div class="row">${action('spot','씨앗','water','seal blue')}${action('spot','뚜껑','lid','seal blue')}${action('spot','항아리 벽','wall','seal blue')}</div><div class="row end">${action('close','증언 다시 보기','','seal')}</div>`,'현장 그림 짚기');return;}
    shout();go(S.stage+1);
  }
  function drawCount(message='') {
    $('#view').innerHTML=`<section class="board puzzle-board"><div class="section-kicker">작은 수학 수사</div><h2>형님에게 간 씨앗은 몇 알?</h2><p class="muted">같은 주머니의 20알을 달래와 놀부에게 나누었어요.</p><div class="seed-ledger"><div class="seed-total"><span>처음 씨앗</span><b>20알</b></div><div class="seed-all" aria-label="씨앗 20알">${Array.from({length:20},()=>`<span class="seed-token">${seed()}</span>`).join('')}</div><div class="seed-destinations"><div class="seed-basket"><span class="basket-label">달래의 실험</span><b>4알씩 × 3그릇</b><div class="mini-dishes">${[0,1,2].map(i=>`<div><span>${'ABC'[i]}</span><div>${[1,2,3,4].map(()=>seed(1)).join('')}</div></div>`).join('')}</div><span class="basket-sum">모두 12알</span></div><div class="seed-basket nolbu-basket"><span class="basket-label">놀부의 몫</span><b>남은 씨앗 전부</b><div class="count-control">${action('count-minus','−','','count-button',S.count===0)}<output aria-live="polite" aria-label="놀부 몫 씨앗 수">${S.count}<small>알</small></output>${action('count-plus','＋','','count-button',S.count===20)}</div><span class="basket-sum">20 − 12 = ?</span></div></div></div>
      ${message?`<p class="feedback" role="status">${message}</p>`:''}<div class="row end">${action('count-hint','계산 도움말','','seal')}${action('count-check','이 수가 맞아요 →')}</div></section>`;
  }
  function dishArt(t) {
    const sprouted=t.sprouted;
    return `<svg viewBox="0 0 280 165" aria-hidden="true"><ellipse cx="140" cy="130" rx="105" ry="23" fill="#7c806c" opacity=".1"/><path d="M38 102Q140 74 242 102L228 130Q140 154 52 130Z" fill="${t.id==='B'?'#d8c39f':'#e7e4cf'}" stroke="#9a967e" stroke-width="2"/><ellipse cx="140" cy="102" rx="102" ry="24" fill="${t.id==='B'?'#eee0bf':'#d8e1cf'}" stroke="#9a967e" stroke-width="2"/>${[72,116,160,204].map((x,i)=>i<sprouted?`<g class="growing-sprout"><path d="M${x} 108Q${x-10} 74 ${x+2} 52" fill="none" stroke="#648253" stroke-width="4"/><path d="M${x} 73Q${x-33} 38 ${x-32} 67Q${x-20} 84 ${x} 73Z" fill="#8ca66a" stroke="#637d50"/><path d="M${x} 61Q${x+10} 23 ${x+29} 42Q${x+27} 62 ${x} 61Z" fill="#adc187" stroke="#7a935e"/></g>`:`<ellipse cx="${x}" cy="105" rx="10" ry="16" transform="rotate(25 ${x} 105)" fill="#dbc58e" stroke="#ad945e"/>`).join('')}${t.id==='C'?'<path d="M236 24V61M220 33L252 52M220 52L252 33" stroke="#83b3ba" stroke-width="2"/>':''}</svg>`;
  }
  function drawLab(message='') {
    const water=S.labRound===0,chosen=S.labSelected;
    $('#view').innerHTML=`<section class="board puzzle-board"><div class="section-kicker">달래의 작은 실험실 · ${S.labRound+1} / 2</div><h2>${water?'물이 싹트기에 영향을 줄까요?':'온도가 싹트기에 영향을 줄까요?'}</h2><p class="muted">${water?'물':'온도'}만 다르고, 나머지 조건은 같은 <b>두 그릇</b>을 골라 주세요.</p><div class="lab-common"><span>같은 씨앗 주머니</span><span>각 4알</span><span>공기 · 빛 · 기간 같음</span></div><div class="trial-grid">${C.trials.map(t=>`<button class="trial-card ${chosen.includes(t.id)?'selected':''}" data-action="trial" data-value="${t.id}" aria-pressed="${chosen.includes(t.id)}"><span class="trial-top"><b>${t.id}</b><span>${t.title}</span><i aria-hidden="true">${chosen.includes(t.id)?'✓':'＋'}</i></span>${dishArt(t)}<dl><div><dt>물</dt><dd>${t.water}</dd></div><div><dt>온도</dt><dd>${t.temp}</dd></div><div><dt>싹튼 수</dt><dd><strong>${t.sprouted}</strong> / 4알</dd></div></dl></button>`).join('')}</div>
      <p class="observation-caption">그림은 3월 18일, 여드레 동안 관찰한 뒤의 모습이에요.</p>
      ${S.labPassed?`<div class="lab-explanation" role="status"><span class="result-seal">비교 성공</span><h3>A와 ${water?'B':'C'}를 비교해요</h3><p>${water?'온도와 다른 조건은 같고, 물을 준 것이 달라요. 이 관찰에서는 촉촉하게 둔 A에서만 싹이 났어요.':'물과 다른 조건은 같고, 온도가 달라요. 이 관찰에서는 알맞게 따뜻한 A에서만 싹이 났어요.'}</p><p class="muted">${water?'물과 온도를 동시에 바꾸면 어느 조건 때문인지 알기 어려워요.':'싹이 안 난 C의 씨앗이 모두 죽었다고 단정할 수는 없어요. 조건을 바꾸거나 더 기다려 살펴볼 수 있어요.'}</p>${action('lab-next',water?'이번에는 온도 비교하기 →':'결과를 가지고 법정으로 →')}</div>`:`${message?`<p class="feedback" role="status">${message}</p>`:''}<div class="row end"><span class="muted">${chosen.length} / 2 선택</span>${action('lab-hint','도움말','','seal')}${action('lab-check','이 두 그릇 비교하기','','seal fill',chosen.length!==2)}</div>`}
      <p class="science-note">실제 씨앗의 싹트는 시간과 수는 종류·상태·조건에 따라 달라요. 여기 나온 수는 이야기 속 관찰 결과예요.</p></section>`;
  }
  function drawFacts(message='') {
    const done=C.facts.every(f=>['fact','guess'].includes(S.facts[f.id]));
    $('#view').innerHTML=`<section class="board puzzle-board"><div class="section-kicker">최종 증거 점검</div><h2>본 것과 짐작한 것을 나누어요</h2><p class="muted">기록이나 관찰로 확인했나요? 아니면 아직 더 확인해야 할 생각인가요?</p><div class="fact-list">${C.facts.map((f,i)=>`<article class="fact-card"><div class="fact-number">0${i+1}</div><div><p>${f.text}</p><div class="fact-buttons" role="group" aria-label="${f.text}">${action('classify','확인한 사실',f.id+'|fact','fact-choice '+(S.facts[f.id]==='fact'?'selected':''))}${action('classify','더 확인할 생각',f.id+'|guess','fact-choice '+(S.facts[f.id]==='guess'?'selected':''))}</div></div></article>`).join('')}</div>${message?`<div class="feedback" role="status">${message}</div>`:''}<div class="row end facts-bottom">${action('facts-hint','판단 도움말','','seal')}${action('facts-check','증거 점검 마치기 →','','seal fill',!done)}</div></section>`;
  }
  function drawVerdict() {
    $('#view').innerHTML=`<section class="board verdict-page"><span class="section-kicker">사건 번호 002 · 최종 판결</span><div class="verdict-heading"><span class="verdict-stamp">무죄</span><div><h2>흥부의 누명을 벗겼어요.</h2><p>“싹이 안 났다”가 “일부러 망쳤다”는 증거는 아니에요.</p></div></div><div class="verdicts"><article class="vcard"><h3>관아의 판결 · 이몽룡</h3>${who('mongryong','흥부가 일부러 씨앗을 망가뜨렸다는 증거가 없소. 놀부는 함부로 의심한 일을 사과하고, 방자는 본 사실을 숨기지 마시오. 씨앗은 바른 조건에서 함께 다시 살펴보시오.')}</article><article class="vcard modern"><h3>한저울 판사의 증거 점검</h3>${who('judge','일부 그릇의 결과만으로 모든 씨앗을 판단할 수 없어요. 사람을 탓하기 전에, 물·공기·온도 같은 다른 원인도 살펴야 해요. 모르는 것은 더 확인하는 태도가 공정한 판단의 시작입니다.')}</article></div><div class="learning-strip"><span><b>수학</b>20 − 12 = 8</span><span><b>과학</b>물 · 공기 · 알맞은 온도</span><span><b>추리</b>사실과 추측 구별</span></div><div class="gl">씨앗이 싹트기 시작하는 것과, 싹이 자라는 것은 구별해요. 자란 식물에는 빛도 중요해요. 씨앗 종류에 따라 싹틀 때의 빛 조건도 다를 수 있어요.</div><div class="row end">${action('next-stage','내 판결을 일기에 남기기 →')}</div><p class="science-note">고전 인물을 활용해 만든 이야기 속 재판입니다.</p></section>`;
  }
  function drawDiary(message='') {
    $('#view').innerHTML=`<section class="board"><div class="section-kicker">사건 수첩 · 마지막 장</div><h2>다시 이런 일이 생기지 않으려면?</h2><p class="muted">가장 마음에 드는 생각을 골라 주세요. 여기에는 정답이 없어요.</p><div class="cards" role="radiogroup" aria-label="나의 판결">${C.diaryChoices.map((t,i)=>`<button class="opt ${S.choice===i?'on':''}" data-action="diary-choice" data-value="${i}" role="radio" aria-checked="${S.choice===i}">${S.choice===i?'●':'○'} ${t}</button>`).join('')}</div><label for="diary-text" class="diary-label">내 생각 한 줄 <small>안 써도 괜찮아요</small></label><textarea id="diary-text" maxlength="160" placeholder="예: 싹이 안 났다고 바로 누군가를 탓하지 않을 거예요.">${esc(S.diaryText)}</textarea>${message?`<p class="feedback">${message}</p>`:''}<div class="row end diary-bottom">${action('finish','일기를 남기고 결말 보기 →','','seal fill',S.choice===null)}</div><p class="muted">일기와 진행 상황은 이 브라우저에만 저장돼요. 이름은 적지 않아도 돼요.</p></section>`;
  }
  function drawEnd() {
    $('#view').innerHTML=`<section class="ending"><div class="ending-art">${backdrop('heungbu-home')}<div class="ending-portrait">${face('heungbu','happy')}</div><div class="ending-portrait second">${face('dalrae','happy')}</div><div class="ending-quote">“형님, 이번에는 함께 기다려 봅시다.”</div></div><div class="ending-copy"><span class="section-kicker">두 번째 사건 해결</span><h1>진실도, 씨앗도<br><em>살펴야 자라요.</em></h1><p>놀부는 흥부에게 사과했습니다.<br>형제는 달래의 일지를 펼치고, 새 씨앗을 함께 돌보기 시작했습니다.</p><div class="earned-badges"><span>씨앗 계산가</span><span>공정한 실험가</span><span>증거 탐정</span></div><div class="row">${action('diaries','내 판관 일기','','seal blue')}${action('home','사건 선택으로','','seal fill')}<a class="seal seal-link" href="./">1화 다시 만나기</a></div></div></section>`;
  }
  function diaryView() {
    const own=read(DIARY,[]),legacy=read('ddeokip-diary',[]);
    const all=[...(Array.isArray(own)?own:[]),...(Array.isArray(legacy)?legacy.map(d=>({...d,episode:1})):[])].slice(0,50);
    openModal(`<h3>내 판관 일기</h3>${all.length?all.map(d=>`<article class="gl"><span class="muted">${esc(d.date||'')} · 제${d.episode===1?'1':'2'}화</span><p><b>${esc(d.choice||'')}</b></p>${d.text?`<p>${esc(d.text)}</p>`:''}</article>`).join(''):'<p>사건을 끝까지 해결하면 나의 판결을 남길 수 있어요.</p>'}<div class="row end">${action('close','닫기')}</div>`,'내 판관 일기');
  }
  function guide() {
    openModal(`<h3>제2화 · 교사·보호자 안내</h3><p><b>흥부전 × 식물의 한살이 × 증거로 판단하기</b><br>초등 3–4학년부터, 약 20–30분을 예상한 이야기입니다. 읽기와 토론 시간에 따라 달라집니다. 흥부전 인물로 새로 꾸민 사건이며, 달래는 새로 만든 인물입니다.</p><p><b>함께 생각할 질문</b></p><ol><li>식물이 잘 자라지 않았다는 이유만으로 씨앗을 준 사람을 탓해도 될까요?</li><li>물의 영향을 알아보려면 온도도 바꾸어야 할까요?</li><li>남의 지시를 따른 방자는 거짓말한 책임도 없을까요?</li></ol><details class="teacher-spoilers"><summary>교사용 진행·정답 보기</summary><p>놀부 첫 심문: 증언 3 + 나눔 기록 → 20 − 12 = 8알.<br>방자: 증언 2 + 항아리 그림 → 물속 씨앗.<br>물 비교: A·B / 온도 비교: A·C.<br>놀부 마지막 심문: 증언 3 + 관찰 일지.<br>사실 구분: 사실·더 확인할 생각·사실·더 확인할 생각.</p></details><p><b>과학 표현의 범위</b><br>싹트기에 필요한 물, 산소, 알맞은 온도를 다룹니다. 물에 오래 잠기면 산소를 얻기 어려울 수 있지만, 항아리 그림만으로 모든 원인을 확정하지 않습니다. 그릇별 수치는 이야기 속 관찰 자료이며 실제 발아율이나 기간을 보장하지 않습니다. 종에 따라 싹틀 때 빛 조건도 다릅니다.</p><p class="muted">과학 내용 참고: <a href="https://content.ces.ncsu.edu/extension-gardener-handbook/13-propagation" target="_blank" rel="noopener">NC State Extension · 씨앗 번식</a>, <a href="https://open.lib.umn.edu/horticulture/chapter/9-2-seed-physiology/" target="_blank" rel="noopener">University of Minnesota · 씨앗의 생리</a>.</p><p class="muted">로그인 없이 사용하며 진행과 일기는 브라우저 안에만 저장됩니다. 1화와 2화의 진행 기록은 별개입니다.</p><div class="row end">${action('close','닫기')}</div>`,'교사·보호자 안내');
  }
  function act(a,v) {
    const cross=st().type==='cross'&&S.screen==='game';
    switch(a) {
      case 'start': if(hasSave&&!S.complete&&(S.stage>0||S.line>0)) {openModal('<h3>2화를 처음부터 시작할까요?</h3><p>현재 2화 진행은 새로 시작하고, 작성한 판관 일기는 보관해요.</p><div class="row end">'+action('close','계속 보관하기','','seal')+action('reset','2화 새로 시작하기')+'</div>','새로 시작');} else act('reset'); break;
      case 'reset': {const seen=S.seen;S=fresh();S.seen=seen;go(0);break;}
      case 'continue': S.screen='game';render(true);break;
      case 'home': closeModal();S.screen='title';save();render(true);break;
      case 'close': closeModal();break;
      case 'next': if(st().type==='talk'){if(S.line+1<st().lines.length){S.line++;save();drawTalk();}else go(S.stage+1);}break;
      case 'next-stage': if(st().type==='verdict')go(S.stage+1);break;
      case 'place': if(st().type==='investigate')visit(v);break;
      case 'court': if(st().type==='investigate'&&S.ev.length===5)go(S.stage+1);break;
      case 'evidence': evidenceBox();break;
      case 'show-evidence': if(S.ev.includes(v))openModal(`<h3>${C.evidence[v].name}</h3>${evidenceView(v)}<div class="row end">${action('evidence','증거함으로','','seal')}${action('close','닫기')}</div>`,C.evidence[v].name);break;
      case 'statement': if(cross){const c=currentCross();c.si=+v;c.reply=false;c.asking=false;save();drawCross();}break;
      case 'question': if(cross){const c=currentCross();if(c.reply){c.reply=false;c.asking=false;}else c.asking=!c.asking;drawCross();}break;
      case 'reply': if(cross){currentCross().reply=true;currentCross().asking=false;drawCross();}break;
      case 'present': if(cross)evidenceBox(true);break;
      case 'submit-evidence': if(cross)submitEvidence(v);break;
      case 'spot': if(cross&&st().id==='bangja'){if(v==='water')go(S.stage+1);else notice('씨앗이 놓인 곳을 살펴보세요','방자는 씨앗이 물에 잠기지 않았다고 했어요. 뚜껑이나 벽보다는 씨앗과 물 높이를 비교해 보세요.');}break;
      case 'hint': case 'more-hint': if(cross){hintLevel=a==='hint'?1:Math.min(3,hintLevel+1);const w=C.witnesses[st().id];openModal(`<h3>향단의 힌트</h3>${who('hyangdan',w.hints.slice(0,hintLevel).map(h=>`<span class="hint-line">${h}</span>`).join(''),'happy')}<div class="row end">${hintLevel<3?action('more-hint','더 자세한 힌트','','seal blue'):''}${action('close','생각해 볼게요')}</div>`,'심문 힌트');}break;
      case 'count-plus': case 'count-minus': if(st().type==='count'){S.count=Math.max(0,Math.min(20,S.count+(a==='count-plus'?1:-1)));save();drawCount();}break;
      case 'count-check': if(st().type==='count'){if(S.count===8)go(S.stage+1);else drawCount('달래 몫은 4알씩 세 그릇, 모두 12알이에요. 처음 20알에서 12알을 빼 보세요.');}break;
      case 'count-hint': notice('한 걸음씩 계산해요','20에서 먼저 10을 빼면 10, 거기서 2를 더 빼면 몇 알일까요?');break;
      case 'trial': if(st().type==='lab'&&!S.labPassed){const a=S.labSelected;if(a.includes(v))S.labSelected=a.filter(x=>x!==v);else if(a.length<2)a.push(v);else S.labSelected=[a[1],v];save();drawLab();}break;
      case 'lab-check': if(st().type==='lab'&&S.labSelected.length===2){const expect=S.labRound===0?'AB':'AC';if([...S.labSelected].sort().join('')===expect){S.labPassed=true;save();drawLab();$('.lab-explanation').scrollIntoView({block:'nearest',behavior:'smooth'});}else drawLab(S.labRound===0?'A와 C는 온도가 달라요. B와 C는 물과 온도가 모두 달라요. 물만 다른 두 그릇을 찾아보세요.':'A와 B는 물이 달라요. B와 C는 물과 온도가 모두 달라요. 온도만 다른 두 그릇을 찾아보세요.');}break;
      case 'lab-next': if(st().type==='lab'&&S.labPassed){if(S.labRound===0){S.labRound=1;S.labSelected=[];S.labPassed=false;save();render(true);}else go(S.stage+1);}break;
      case 'lab-hint': notice('한 가지 조건만 다르게','먼저 A와 비교해 보세요. 물을 알아볼 때에는 물만, 온도를 알아볼 때에는 온도만 달라야 해요.');break;
      case 'classify': if(st().type==='facts'){const [id,val]=v.split('|');if(C.facts.some(f=>f.id===id)&&['fact','guess'].includes(val)){S.facts[id]=val;save();drawFacts();}}break;
      case 'facts-check': if(st().type==='facts'){const wrong=C.facts.filter(f=>S.facts[f.id]!==f.answer);if(!wrong.length)go(S.stage+1);else drawFacts(wrong.map(f=>`<p><b>${f.text}</b><br>${f.why}</p>`).join(''));}break;
      case 'facts-hint': notice('확인한 만큼만 말해요','눈으로 본 모습이나 적힌 수는 확인할 수 있어요. 하지만 누군가의 마음, 모든 씨앗의 상태는 그것만으로 알 수 있을까요?');break;
      case 'diary-choice': if(st().type==='diary'){S.diaryText=$('#diary-text').value;S.choice=+v;save();drawDiary();}break;
      case 'finish': if(st().type==='diary'&&S.choice!==null){S.diaryText=$('#diary-text').value.trim().slice(0,160);if(!S.diarySaved){try{const a=read(DIARY,[]),d=new Date();localStorage.setItem(DIARY,JSON.stringify([{episode:2,date:`${d.getFullYear()}.${d.getMonth()+1}.${d.getDate()}`,choice:C.diaryChoices[S.choice],text:S.diaryText},...(Array.isArray(a)?a:[])].slice(0,30)));S.diarySaved=true;}catch{ /* The player can still reach the ending without storage. */ }}S.complete=true;go(S.stage+1);}break;
      case 'diaries': diaryView();break;
      case 'guide': guide();break;
      case 'words': openModal(`<h3>낱말 주머니</h3>${S.seen.length?S.seen.map(w=>`<p class="gl"><b>${w}</b><br>${C.glossary[w]}</p>`).join(''):'<p>이야기 속에서 만난 낱말이 모여요.</p>'}<div class="row end">${action('close','닫기')}</div>`,'낱말 주머니');break;
      case 'word': if(C.glossary[v])notice(v,C.glossary[v]);break;
    }
  }
  document.addEventListener('click',e=>{const el=e.target.closest('[data-action]');if(el&&!el.disabled)act(el.dataset.action,el.dataset.value);});
  document.addEventListener('input',e=>{if(e.target.id==='diary-text'){S.diaryText=e.target.value.slice(0,160);save();}});
  document.addEventListener('keydown',e=>{
    if(!$('#modal').hidden){
      if(e.key==='Escape'){e.preventDefault();closeModal();return;}
      if(e.key==='Tab') {const els=[...$('#sheet').querySelectorAll('button:not(:disabled),a[href],[tabindex="0"],summary')];if(!els.length){e.preventDefault();return;}const first=els[0],last=els.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}
    }
    const el=e.target.closest('[role="button"][data-action]');if(el&&(e.key==='Enter'||e.key===' ')){e.preventDefault();act(el.dataset.action,el.dataset.value);}
  });
  $('#modal').addEventListener('click',e=>{if(e.target.id==='modal')closeModal();});
  window.addEventListener('pagehide',()=>{if(hasSave||S.screen==='game')save();});
  render();
})();
