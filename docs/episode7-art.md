# 제7화 그림 프롬프트

7화에 필요한 새 그림은 **인물 5장, 장소 3장**입니다. 지금 `assets/art/` 에 들어 있는 같은 이름의 파일은 임시 그림입니다. 아래 프롬프트로 만든 그림을 **같은 파일 이름으로 덮어쓰면** 게임에 바로 반영됩니다.

다시 쓰는 그림: 나바름(`baleum`), 고을 원님(`wonnim-v3`), 한저울 판사(`judge`), 법정(`court`), 버들골 곳간(`gotgan`), 관아 문서고(`office`).

만드는 순서는 [3화 그림 프롬프트](episode3-art.md)와 같습니다. 표정 순서: **윗줄 평소, 기쁨, 슬픔 / 아랫줄 놀람, 당황(땀), 단호.**

## 인물

**① 인물 설명** 뒤에 **② 공통 문장**을 붙여 넣습니다. 기존 표정 시트 한 장을 참고용으로 함께 올립니다.

### ② 공통 문장 (인물)

```text
Use the attached atlas solely for the refined watercolor/pencil storybook painting style, realistic-anime proportions and the exact sprite layout; give this character their own face and clothes. Joseon-era Korean setting. Produce ONE 1536x1024 transparent PNG sprite atlas with exactly 3 equal columns x 2 equal rows, each cell 512x512. Six separate waist-up cutouts of the SAME person aligned at identical scale, head fully within cell, torso reaching bottom, clear margins between cells. Keep clothes, hair and anatomy consistent in all six cells. Detailed fine pencil linework and warm watercolor rendering matching reference quality. Background completely transparent. No scenery, words, labels, captions, panel lines, border, watermark or background rectangles.
```

### ① gildong.webp — 홍길동

길동은 **복면을 쓰지 않습니다.** 맨얼굴로 제 발로 관아에 온 사람입니다. 키는 크지 않게 그립니다 (박 서방이 "저분은 그리 크지 않으시네요?" 하고 말합니다).

```text
Use case: illustration-story. Asset: character expression sprite atlas for a Korean children's courtroom visual-novel. Create HONG GILDONG (홍길동), the hero of the classic Korean novel, a calm sharp-eyed young man of about 20 with an average, not tall, build. Clear intelligent eyes, straight brows, a faint confident half-smile. Black hair in a topknot under a simple black gat hat. A plain deep-blue durumagi coat with a white collar, worn neatly. His face is completely uncovered: NO mask, no face cloth, no hood. No weapons. He stands straight with quiet dignity, a man who walked into the courthouse by himself to clear his name. Expressions row1 composed neutral, warm relieved smile, wronged and saddened; row2 surprised, uneasy with one small sweat drop, firm and resolute.
```

### ① bak.webp — 박 서방

```text
Use case: illustration-story. Asset: character expression sprite atlas for a Korean children's courtroom visual-novel. Create a NEW original character BAK SEOBANG (박 서방), a timid village storehouse keeper of about 50. Thin face, round worried eyes, sparse greying beard, slightly stooped shoulders. A worn straw-colored hemp jeogori, a faded headband, and a ring of wooden storehouse tally sticks at his belt. Honest and easily frightened, clutching his own hands. Expressions row1 nervous neutral, relieved shy smile, ashamed with lowered head; row2 startled with wide eyes, trembling with one sweat drop, earnest insisting look.
```

### ① pogyo.webp — 이 포교

```text
Use case: illustration-story. Asset: character expression sprite atlas for a Korean children's courtroom visual-novel. Create a NEW original character OFFICER YI (이 포교), a Joseon police constable of about 40 who is proud of his ten years of catching thieves. Square jaw, thick dark moustache, stern narrow eyes, chest pushed out. A black felt jeonrip hat with a red tassel and a dark red-and-navy constable's coat with a wide belt; a coiled red rope at his hip. No drawn weapon. Overconfident and hasty, but not cruel. Expressions row1 stern neutral, pleased proud grin, sheepish and apologetic; row2 shocked with mouth open, flustered with one sweat drop, pointing accusingly with a fierce frown.
```

### ① ma.webp — 마 객주

```text
Use case: illustration-story. Asset: character expression sprite atlas for a Korean children's courtroom visual-novel. Create a NEW original character MERCHANT MA (마 객주), a wealthy rice broker of about 50 at a river port. Round smooth face, small calculating eyes that smile too easily, thin neat moustache, plump hands. A glossy plum-purple silk magoja jacket over a pale silk robe, a black gat hat with a jade-bead string, and a small abacus tucked under one arm. Smooth, polite and a little too friendly. Expressions row1 polite merchant's smile, smug satisfied smile, defeated and regretful; row2 shocked with eyes wide, sweating with a forced smile and one sweat drop, indignant protesting frown.
```

### ① baram.webp — 바람이

```text
Use case: illustration-story. Asset: character expression sprite atlas for a Korean children's courtroom visual-novel. Create a NEW original character BARAM (바람이), a cheerful 13-year-old relay-station messenger child who knows every road. Bright quick eyes, sun-browned cheeks, wind-tousled short black hair tied back with a sky-blue headband. A short sleeveless teal vest over a cream jeogori with sleeves rolled up, a rolled road map tied across the back and a small leather message pouch at the waist. Energetic, helpful and good at counting. Expressions row1 bright neutral, big happy grin, worried and downcast; row2 surprised, thinking hard with one sweat drop, determined with a raised fist.
```

## 장소

**① 장소 설명** 뒤에 **② 공통 문장**을 붙여 넣습니다. 기존 장소 그림 한 장을 참고용으로 함께 올립니다. 사람 없이, 가로로 긴 그림(약 1672 × 941)입니다.

### ② 공통 문장 (장소)

```text
Use case: illustration-story. Asset: background painting for a Korean children's courtroom visual-novel game, Joseon-era Korean countryside. Match the attached reference for refined watercolor and pencil storybook rendering, soft natural colors and gentle depth. Wide landscape composition about 16:9, eye-level view, empty of people and animals, calm and readable at small size, open space in the lower middle where characters will be placed. No text, signs with letters, borders, watermark or modern objects.
```

### ① jumak.webp — 삼거리 주막

```text
A thatched roadside tavern (주막) at a three-way crossroads in the early morning. A low wooden porch with a small table, a steaming iron pot by the door, straw mats, a paper lantern, and a hand-drawn road map on plain paper pinned to the earthen wall (lines and dots only, no letters). Three dirt roads split in front of the tavern and run toward distant hills in three directions.
```

### ① stable.webp — 역참 마구간

```text
The stable of a Joseon relay station (역참). A long thatched stable with wooden stalls, feed troughs, hay, saddles and bridles hanging neatly on pegs, a wooden water bucket and a row of empty hitching posts. Every stall door is closed and the yard is quiet and swept, showing that no horse went out last night. Morning light.
```

### ① naru.webp — 강나루 나루터

```text
A small river ferry landing (나루터) at dawn. A flat wooden ferry boat tied to a short pier, a wide calm river with mist, reeds along the bank. On the muddy bank in the foreground there are several fresh cart-wheel tracks leading from the road toward a large tile-roofed warehouse standing a little way back from the water.
```

## 받아서 확인할 것

- 홍길동이 **복면을 쓰지 않았는지**, 키가 유난히 크게 보이지 않는지.
- 마 객주가 겉보기에는 점잖고 친절해 보이는지. 처음부터 악당처럼 보이면 반전이 약해집니다.
- 역참 마구간에 **말이 한 마리도 나가지 않은** 느낌이 나는지 (빈 마당, 닫힌 칸).
- 나루터 그림에 **수레바퀴 자국**이 보이는지.
- 주막의 지도에 글자가 없는지. 지도의 글자와 거리는 게임 화면에서 따로 보여 줍니다.
