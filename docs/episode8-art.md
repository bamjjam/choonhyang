# 제8화 그림 프롬프트

8화에 필요한 새 그림은 **인물 5장, 장소 4장**입니다. 지금 `assets/art/` 에 들어 있는 같은 이름의 파일은 임시 그림입니다. 아래 프롬프트로 만든 그림을 **같은 파일 이름으로 덮어쓰면** 게임에 바로 반영됩니다.

다시 쓰는 그림: 나바름(`baleum`), 고을 원님(`wonnim-v3`), 한저울 판사(`judge`), 법정(`court`), 장터(`market`, 5화), 장터 주막(`jumak`, 7화), 관아 옥 앞(`office`).

만드는 순서는 [3화 그림 프롬프트](episode3-art.md)와 같습니다. 표정 순서: **윗줄 평소, 기쁨, 슬픔 / 아랫줄 놀람, 당황(땀), 단호.**

## 인물

**① 인물 설명** 뒤에 **② 공통 문장**을 붙여 넣습니다. 기존 표정 시트 한 장을 참고용으로 함께 올립니다.

### ② 공통 문장 (인물)

```text
Use the attached atlas solely for the refined watercolor/pencil storybook painting style, realistic-anime proportions and the exact sprite layout; give this character their own face and clothes. Joseon-era Korean setting. Produce ONE 1536x1024 transparent PNG sprite atlas with exactly 3 equal columns x 2 equal rows, each cell 512x512. Six separate waist-up cutouts of the SAME person aligned at identical scale, head fully within cell, torso reaching bottom, clear margins between cells. Keep clothes, hair and anatomy consistent in all six cells. Detailed fine pencil linework and warm watercolor rendering matching reference quality. Background completely transparent. No scenery, words, labels, captions, panel lines, border, watermark or background rectangles.
```

### ① wuchi.webp — 전우치

```text
Use case: illustration-story. Asset: character expression sprite atlas for a Korean children's courtroom visual-novel. Create JEON WUCHI (전우치), the playful trickster wizard of the classic Korean novel, a handsome man of about 30 with a mischievous half-smile and one raised eyebrow. Black hair in a topknot under a wide gat hat tilted slightly, a flowing white dopo robe with a sky-blue sash, and a folded paper fan held in one hand. No magic effects, sparkles, glowing or talismans. Relaxed, amused and a little proud, as if the whole trial is entertaining to him. Expressions row1 amused neutral, bright delighted laugh, mildly hurt and sulky; row2 genuinely surprised, awkward with one sweat drop, serious and dignified.
```

### ① heo.webp — 허허 도인

도인은 **방울 달린 지팡이**를 꼭 들고 있어야 합니다. 방울 소리가 단서입니다.

```text
Use case: illustration-story. Asset: character expression sprite atlas for a Korean children's courtroom visual-novel. Create a NEW original character HEOHEO DOIN (허허 도인), a wandering fake holy man of about 60 who sells paper charms. Long wispy white beard, bushy white eyebrows, twinkling narrow eyes and a wide showman's smile. A tall peaked grey hat, a patched ash-grey robe with very wide sleeves, a string of large wooden beads, and a wooden staff with a small brass BELL tied near the top held in one hand, visible in every cell. Theatrical and friendly on the surface, not frightening. Expressions row1 serene knowing smile, big hearty laugh, deflated and sorry; row2 startled with eyes popping, sweating with a stiff smile and one sweat drop, stern prophetic glare with a raised finger.
```

### ① halmeom.webp — 떡 할멈

```text
Use case: illustration-story. Asset: character expression sprite atlas for a Korean children's courtroom visual-novel. Create a NEW original character TTEOK HALMEOM (떡 할멈), a market rice-cake seller of about 65. Small round wrinkled face, kind worried eyes, grey hair in a tight low bun with a wooden hairpin. A faded brown jeogori, an apron dusted with rice flour, and a round bamboo tray of white rice cakes held against her hip. She clutches three paper charms in her free hand. Warm-hearted, superstitious and easily frightened. Expressions row1 worried neutral, relieved toothy smile, sad and teary; row2 very frightened, flustered with one sweat drop, angry and scolding.
```

### ① deoksoe.webp — 문지기 덕쇠

```text
Use case: illustration-story. Asset: character expression sprite atlas for a Korean children's courtroom visual-novel. Create a NEW original character DEOKSOE (덕쇠), a sleepy good-natured gatekeeper of about 30 at a county office. Big sturdy build, round face, droopy sleepy eyes, a small yawn-ready mouth. A simple dark-blue guard's coat with a wide cloth belt and a black felt beongeoji hat slightly askew. He leans on a plain wooden staff (not a spear). Honest but afraid of being scolded. Expressions row1 drowsy neutral, sheepish grin, guilty with lowered head; row2 jolted awake with wide eyes, nervous with one sweat drop, trying to look brave and upright.
```

### ① chorong.webp — 초롱이

```text
Use case: illustration-story. Asset: character expression sprite atlas for a Korean children's courtroom visual-novel. Create a NEW original character CHORONG (초롱이), a curious 12-year-old daughter of a candle-making family. Bright round eyes, a small beauty spot under one eye, black hair in a short braid tied with a yellow ribbon. A warm yellow jeogori with a rust-red skirt, sleeves protected by plain cloth cuffs, and a little soot on one cheek. She holds one unlit white candle. Confident, quick and eager to test things for herself. Expressions row1 bright curious neutral, proud happy grin, worried pout; row2 astonished, thinking hard with one sweat drop, determined with a raised finger.
```

## 장소

**① 장소 설명** 뒤에 **② 공통 문장**을 붙여 넣습니다. 기존 장소 그림 한 장을 참고용으로 함께 올립니다. 사람 없이, 가로로 긴 그림(약 1672 × 941)입니다.

### ② 공통 문장 (장소)

```text
Use case: illustration-story. Asset: background painting for a Korean children's courtroom visual-novel game, a Joseon-era Korean county office and market town. Match the attached reference for refined watercolor and pencil storybook rendering, soft natural colors and gentle depth. Wide landscape composition about 16:9, eye-level view, empty of people and animals, calm and readable at small size, open space in the lower middle where characters will be placed. No text, signs with letters, borders, watermark or modern objects.
```

### ① daecheong.webp — 관아 대청

```text
The open wooden main hall (대청) of a county office in the morning. Polished plank floor, red pillars, a low table in the center. On the table stands one white candle, unlit, more than half of it remaining, covered by a clear bell-shaped glass cover that sits flat on a wooden base with no gap. A thin wisp of smoke is trapped under the glass.
```

### ① daemun.webp — 관아 대문

```text
The big wooden front gate (대문) of a county office in early morning light. Heavy double doors with iron studs under a tiled roof. A large sheet of paper is pasted on one door with several rows of brush strokes that are abstract marks, not readable letters: almost all the marks are blood red, but one small mark in the lower left corner is still purple. The paper around the red marks looks slightly wrinkled, as if it had been wet and dried.
```

### ① dyeshop.webp — 염색집

```text
A dyer's workshop (염색집) with an open front. Large earthenware vats of dye in indigo, purple and red, lengths of dyed cloth hanging to dry on bamboo poles, bundles of dried flowers and roots, and a shelf of small stoppered bottles of purple flower dye. Purple morning-glory flowers climb the fence beside the shop.
```

### ① guardpost.webp — 대문 옆 초소

```text
A tiny wooden guard hut (초소) beside the wall of a county office gate at night turning to dawn. A small door, a narrow window, a stool and a blanket inside, an unlit lantern hanging by the door, and a plain staff leaning against the wall. The big gate is visible a few steps away.
```

## 받아서 확인할 것

- 허허 도인이 **방울 달린 지팡이**를 들고 있는지. 처음부터 악당처럼 보이지 않고 넉살 좋은 구경거리 장사꾼처럼 보이는지.
- 전우치 그림에 빛이나 불꽃 같은 도술 효과가 없는지.
- 대청 그림의 초가 **절반 넘게 남아** 있고, 덮개가 받침에 **틈 없이** 붙어 있는지.
- 대문 그림의 글씨가 읽을 수 없는 붓 자국이고, **한 글자만 보라색**인지.
