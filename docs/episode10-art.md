# 제10화 그림 프롬프트

10화는 1화의 인물과 지난 화의 장소를 많이 다시 씁니다. 새 그림은 **인물 2장, 장소 3장**뿐입니다. 지금 `assets/art/` 에 들어 있는 같은 이름의 파일은 임시 그림입니다.

다시 쓰는 그림: 나바름, 춘향, 향단, 이몽룡, 변학도(1화), 고을 원님(`wonnim-v3`), 한저울 판사, 흥부(2화), 콩쥐(3화), 바람이(7화), 법정(`court`), 관아 문서고(`office`), 관아 대청(`daecheong`, 8화), 역참(`stable`, 7화), 염색집(`dyeshop`, 8화).

만드는 순서는 [3화 그림 프롬프트](episode3-art.md)와 같습니다. 표정 순서: **윗줄 평소, 기쁨, 슬픔 / 아랫줄 놀람, 당황(땀), 단호.**

## 인물

**① 인물 설명** 뒤에 **② 공통 문장**을 붙여 넣습니다. 1화의 표정 시트(예: `bangja.webp`)를 참고용으로 함께 올리면 1화 인물들과 그림체가 잘 맞습니다.

### ② 공통 문장 (인물)

```text
Use the attached atlas solely for the refined watercolor/pencil storybook painting style, realistic-anime proportions and the exact sprite layout; give this character their own face and clothes. Joseon-era Korean setting. Produce ONE 1536x1024 transparent PNG sprite atlas with exactly 3 equal columns x 2 equal rows, each cell 512x512. Six separate waist-up cutouts of the SAME person aligned at identical scale, head fully within cell, torso reaching bottom, clear margins between cells. Keep clothes, hair and anatomy consistent in all six cells. Detailed fine pencil linework and warm watercolor rendering matching reference quality. Background completely transparent. No scenery, words, labels, captions, panel lines, border, watermark or background rectangles.
```

### ① ibang.webp — 이방

```text
Use case: illustration-story. Asset: character expression sprite atlas for a Korean children's courtroom visual-novel. Create a NEW original character IBANG (이방), the chief clerk of a county office, a thin careful man of about 50. Narrow face, small anxious eyes, wispy moustache and goatee, slightly hunched from years at a desk. A black horsehair cap, a plain dark grey-green official's coat with ink-stained cuffs, a writing brush tucked behind one ear, and a thick ledger hugged tightly to his chest. Fussy and timid, a man who does what he is told. Expressions row1 guarded neutral, relieved weak smile, ashamed with lowered head; row2 startled, very nervous with one sweat drop while clutching the ledger, stiff and defensive.
```

### ① saryeong.webp — 사령 번쇠

```text
Use case: illustration-story. Asset: character expression sprite atlas for a Korean children's courtroom visual-novel. Create a NEW original character BEONSOE (사령 번쇠), a county office runner of about 35. Broad honest face, thick eyebrows, sunburnt skin, a habit of glancing sideways at his superiors. A black felt beongeoji hat pulled low, a dark blue sleeveless runner's coat over a pale jeogori, a red cord belt and a small wooden message tube at his waist. Strong but timid in front of authority. Expressions row1 uneasy neutral, relieved grin, guilty and sorry; row2 startled, sweating with one sweat drop and eyes darting sideways, earnest and resolved to tell the truth.
```

## 장소

**① 장소 설명** 뒤에 **② 공통 문장**을 붙여 넣습니다. 1화의 장소 그림 한 장을 참고용으로 함께 올립니다. 사람 없이, 가로로 긴 그림(약 1672 × 941)입니다.

### ② 공통 문장 (장소)

```text
Use case: illustration-story. Asset: background painting for a Korean children's courtroom visual-novel game, Joseon-era Namwon in Korea. Match the attached reference for refined watercolor and pencil storybook rendering, soft natural colors and gentle depth. Wide landscape composition about 16:9, eye-level view, empty of people and animals, calm and readable at small size, open space in the lower middle where characters will be placed. No text, signs with letters, borders, watermark or modern objects.
```

### ① jail.webp — 남원 관아 옥

어둡고 무섭게 그리지 않습니다. 아이들이 보는 그림입니다.

```text
The jail yard of a county office in soft late-afternoon light. A low earthen building with thick wooden lattice doors, one door standing open, a jailer's small desk under the eaves with an open logbook and brush, a water jar and a straw mat. Quiet and plain rather than frightening: no chains, no weapons, no instruments of punishment.
```

### ① chunhome.webp — 춘향의 집

```text
A modest, well-kept tile-roofed house with a small courtyard. A wooden maru porch with a low writing desk, brush, inkstone and a sheet of paper, a flowering plum tree by the wall, jars along the fence, and a wooden gate standing ajar.
```

### ① gwanghallu.webp — 광한루

```text
Gwanghallu, an elegant two-story wooden pavilion beside a calm pond, with an arched stone bridge, willow trees trailing over the water and distant green hills under a clear spring sky. Bright, open and hopeful.
```

## 받아서 확인할 것

- 이방이 **장부를 끌어안고**, 귀에 **붓**을 꽂고 있는지.
- 사령 번쇠가 1화의 방자와 헷갈리지 않는지. 번쇠는 남색 조끼와 붉은 띠, 방자는 1화의 차림 그대로입니다.
- 옥 그림이 무섭지 않은지. 사슬이나 형벌 도구가 그려졌으면 다시 만듭니다.
