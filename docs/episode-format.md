# 새 화 만드는 법

게임 엔진은 `assets/engine.js` 하나입니다. 화마다 다른 것은 시나리오 파일(`episodes/epNN.js`)과 그림뿐입니다.

## 파일 구성

| 파일 | 하는 일 |
| --- | --- |
| `assets/engine.js` | 모든 화가 함께 쓰는 게임 엔진. 특정 화의 대사나 정답이 없습니다. |
| `assets/series.js` | 공개된 화 목록. 첫 화면의 이야기 선택과 "다음 화" 버튼이 이 목록을 봅니다. |
| `episodes/epNN.js` | 한 화의 시나리오. `window.CASE` 에 담습니다. |
| `episodeN.html` | 화마다 하나씩 두는 껍데기. `episodes/epNN.js` 만 바꿔 불러옵니다. (1화는 `index.html`) |
| `assets/art/*.webp` | 인물 표정 시트와 장소 그림 |
| `assets/game.css`, `assets/stages.css` | 모양 |

## 새 화 추가 순서

1. `episodes/ep02.js` 를 복사해 `episodes/ep03.js` 를 만들고 내용을 바꿉니다.
2. `episode2.html` 을 복사해 `episode3.html` 을 만들고, 제목과 `episodes/ep03.js` 경로를 고칩니다.
3. 그림을 `assets/art/` 에 넣습니다.
4. 끝까지 플레이해 본 뒤 `assets/series.js` 에 한 줄을 더합니다. 이때부터 첫 화면에 보입니다.

## `window.CASE` 의 모양

```js
window.CASE = {
  n: 3, classic: '콩쥐팥쥐전', title: '모래 섞인 잔치 쌀',
  helper: 'dukkeobi',          // 힌트와 낱말 풀이를 맡는 인물
  wrongSpeaker: 'wonnim',      // (선택) 틀렸을 때 말하는 인물. 없으면 helper
  court: 'court',              // 법정 배경 그림 (assets/art/court.webp)
  rules: {pair: true},         // (선택) "두 증언 맞대기" 버튼 사용
  portraits: ['baleum', ...],  // 표정 시트가 있는 인물
  art: {nolbu: 'nolbu-v3'},    // (선택) 인물 이름과 그림 파일 이름이 다를 때
  text: {...},                 // (선택) 엔진 기본 문구 바꾸기 (wrongEvidence, wrongPair 등)
  chars: {baleum: '나바름', narr: '', ...},
  glossary: {'증거': '뜻풀이', ...},
  evidence: {key: {name, short, icon, view}},
  places: [{id, name, art, ev, who, line}],
  witnesses: {id: {...}},
  stages: [...],
  landing: {...}, diary: {...}, end: {...}, guide: '<h3>…</h3>…'
};
```

### 대사

```js
const L = (who, text, mood = 'normal', extra = {}) => ({who, text, mood, ...extra});
L('nolbu', '내 박은 왜 감감무소식이냐!', 'stern')
L('wonnim', '놀부가 흥부를 고소했소.', 'normal', {words: ['고소']})   // 새 낱말 소개
L('baleum', '잠깐!', 'stern', {shout: true})                          // 외침 연출
L('narr', '둥! 둥! 둥!', 'normal', {fx: 'drum'})                      // 화면 흔들림
```

표정은 `normal, happy, sad, shock, sweat, stern` 여섯 가지이고, 표정 시트의 왼쪽 위부터 차례입니다.

### 증거

- `icon`: `seed, note, jar, book, order, table, map, ledger` 가운데 하나. 직접 그리려면 `iconSvg` 에 SVG 조각을 넣습니다.
- `view`: 증거를 펼쳤을 때 보일 HTML을 돌려주는 함수. 없으면 `short` 글만 보입니다.

### 증인 (심문)

```js
dolsoe: {
  who: 'dolsoe', title: '두 번째 심문 · 물을 준 돌쇠',
  statements: [
    {text: '증언 문장', cards: [{q: '질문 카드', a: '대답', mood: 'sweat'}]}
  ],
  solve: {evidence: 'jar', statements: [1]},   // 2번 증언(0부터 셈)에 jar 를 내밀면 정답
  // solve: {pair: [1, 3]}                     // 두 증언 맞대기가 정답일 때
  // solve: {evidence, statements, point: {…}} // 증거를 낸 뒤 그림에서 한 곳을 짚게 할 때
  hints: ['방향', '범위', '거의 정답'],
  wrong: '틀렸을 때 도와주는 말',              // (선택)
  success: [L(...), ...]                       // (선택) 맞힌 직후 이어지는 대사
}
```

`point` 는 `{answer, title, quote, prompt, spots: [[id, 이름], …], diagram(interactive), wrong}` 입니다. `diagram(true)` 가 그리는 그림 안의 누를 곳에는 `data-action="spot" data-value="id"` 를 답니다.

### 단계 (`stages`)

위에서 아래로 차례로 진행합니다. 모든 단계에 `chapter`(위쪽에 보이는 장 이름)를 적습니다. `after: [대사…]` 를 넣으면 그 단계를 마친 직후 대사가 이어집니다.

| type | 하는 일 | 꼭 넣을 것 |
| --- | --- | --- |
| `talk` | 대사 | `lines` |
| `investigate` | 현장 조사. `places` 를 모두 돌면 넘어갑니다. | |
| `cross` | 심문 | `id` (witnesses 의 이름) |
| `pick` | 보기 가운데 하나 고르기 | `title, intro, body(), question, options, check(i)` |
| `count` | 수 맞추기 | `kicker, title, intro, label, unit, max, answer, visual(control), wrong, hint` |
| `compare` | 공정한 비교 (조건 하나만 다른 둘 고르기) | `kicker, common, trials, dims, result, art(t), rounds, caption, note, hint` |
| `facts` | 확인한 사실과 더 확인할 생각 나누기 | `kicker, title, intro, facts, hint` |
| `scale` | 책임 저울 (정답 없음) | `title, intro, pans, help` |
| `verdict` | 판결 | `kicker, stamp, title, sub, cards, foot` |
| `diary` | 판관 일기 (`CASE.diary` 사용) | |
| `end` | 결말 (`CASE.end` 사용) | |

`check(i)` 는 정답이면 `true`, 아니면 도와주는 말을 글자로 돌려줍니다.

### 그 화만의 특별한 퍼즐

표에 없는 퍼즐은 `CASE.custom` 에 넣습니다.

```js
custom: {
  sieve: {
    draw(stage, api) { api.$('#view').innerHTML = `…${api.action('sieve-go', '거르기')}…`; },
    act(a, v, stage, api) { if (a === 'sieve-go') api.done(); }
  }
}
// stages 에는 {type: 'sieve', chapter: '…'} 로 씁니다.
```

`api` 에는 `S`(진행 상태), `P()`(이 단계의 저장되는 상태), `save, done, go, render, action, who, face, notice, openModal, closeModal, shout, esc` 가 있습니다. 여러 화에서 쓰게 된 퍼즐은 엔진으로 옮깁니다.

## 저장

진행은 화마다 `ddeokip-epN-save`, 판관 일기는 `ddeokip-diaries` 에 브라우저 안에만 저장됩니다. 엔진 통합 전의 저장과 일기도 그대로 이어집니다.
