# 제9화 그림 프롬프트

9화는 하늘나라가 무대라 다시 쓰는 장소 그림이 없습니다. 새 그림은 **인물 6장, 장소 7장**입니다. 지금 `assets/art/` 에 들어 있는 같은 이름의 파일은 임시 그림입니다. 아래 프롬프트로 만든 그림을 **같은 파일 이름으로 덮어쓰면** 게임에 바로 반영됩니다.

다시 쓰는 그림: 나바름(`baleum`), 한저울 판사(`judge`).

만드는 순서는 [3화 그림 프롬프트](episode3-art.md)와 같습니다. 표정 순서: **윗줄 평소, 기쁨, 슬픔 / 아랫줄 놀람, 당황(땀), 단호.**

## 인물

**① 인물 설명** 뒤에 **② 공통 문장**을 붙여 넣습니다. 기존 표정 시트 한 장을 참고용으로 함께 올립니다.

### ② 공통 문장 (인물)

```text
Use the attached atlas solely for the refined watercolor/pencil storybook painting style, realistic-anime proportions and the exact sprite layout; give this character their own face and clothes. A Korean folktale heaven beside the Milky Way. Produce ONE 1536x1024 transparent PNG sprite atlas with exactly 3 equal columns x 2 equal rows, each cell 512x512. Six separate bust cutouts of the SAME character aligned at identical scale, head fully within cell, body reaching bottom, clear margins between cells. Keep clothes, feathers, colors and anatomy consistent in all six cells. Detailed fine pencil linework and warm watercolor rendering matching reference quality. Background completely transparent. No scenery, moon, words, labels, captions, panel lines, border, watermark or background rectangles.
```

### ① bukdu.webp — 북두 판관

```text
Use case: illustration-story. Asset: character expression sprite atlas for a Korean children's courtroom visual-novel. Create a NEW original character JUDGE BUKDU (북두 판관), the judge of the heavenly court, an old celestial official of about 70. Long white beard and eyebrows, calm deep eyes, upright posture. A tall black official's hat and a deep midnight-blue court robe embroidered with seven small silver stars arranged like the Big Dipper on the chest. He holds a flat wooden judge's tablet. Dignified and fair, a little stern but kind. Expressions row1 solemn neutral, gentle approving smile, sorrowful; row2 surprised with raised brows, troubled with one sweat drop, commanding stern look.
```

### ① kkachi.webp — 깍 대장

```text
Use case: illustration-story. Asset: character expression sprite atlas for a Korean children's courtroom visual-novel. Create a NEW original character CAPTAIN KKAK (깍 대장), the magpie who has led the building of the Magpie Bridge for thirty years. A real-looking Korean magpie painted like a classic picture-book animal: glossy black head, back and long tail, white belly and white shoulder patches, blue-green sheen on the wings, bright dark eyes. It is a bird, not a human in a costume, but wears one small item: a narrow red captain's sash across the chest. Perched upright so that it fills the cell like a bust portrait. Proud, hardworking and honest. Expressions row1 dignified neutral, happy with beak open, dejected with drooping head; row2 startled with feathers puffed, worried with one sweat drop, indignant and resolute.
```

### ① kkaak.webp — 까악 서기

```text
Use case: illustration-story. Asset: character expression sprite atlas for a Korean children's courtroom visual-novel. Create a NEW original character CLERK KKAAK (까악 서기), the crow who keeps the storehouse ledger of the heavenly court. A real-looking large-billed crow painted like a classic picture-book animal: all-black glossy feathers with a purple-blue sheen, clever narrow eyes, strong black beak. It is a bird, not a human in a costume, but wears small round wire spectacles and carries a tiny brush tucked under one wing; a single iron key hangs from a cord around its neck. Perched upright so that it fills the cell like a bust portrait. Neat, smooth-talking and envious, but not evil. Expressions row1 polite composed neutral, smug satisfied look, ashamed with lowered head; row2 shocked with beak wide open, sweating with one sweat drop and eyes darting, sharp accusing glare.
```

### ① gyeonu.webp — 견우

```text
Use case: illustration-story. Asset: character expression sprite atlas for a Korean children's courtroom visual-novel. Create GYEONU (견우), the herdsman of the Korean Chilseok legend, an earnest young man of about 22. Sun-browned kind face, thick straight brows, gentle eyes. Hair in a topknot tied with a blue cloth band. A simple sky-blue and cream herdsman's outfit with rolled sleeves, a coiled ox rope over one shoulder and a short bamboo flute at his belt. Sincere, a little slow to doubt others. Waist-up. Expressions row1 earnest neutral, joyful smile, heartbroken; row2 startled, embarrassed with one sweat drop, steady and determined.
```

### ① jiknyeo.webp — 직녀

```text
Use case: illustration-story. Asset: character expression sprite atlas for a Korean children's courtroom visual-novel. Create JIKNYEO (직녀), the weaver of the Korean Chilseok legend, a graceful young woman of about 20. Soft oval face, gentle sad eyes, long black hair in a neat braid coiled up with a silver hairpin shaped like a small star. A pale lavender jeogori with a long white-and-silver skirt, and a wooden weaving shuttle wound with silver thread held in her hands. Modest, careful and warm. Waist-up. Expressions row1 quiet neutral, radiant happy smile, tearful; row2 shocked with a hand near her mouth, flustered with one sweat drop, calm and resolved.
```

### ① saetbyeol.webp — 샛별이

```text
Use case: illustration-story. Asset: character expression sprite atlas for a Korean children's courtroom visual-novel. Create a NEW original character SAETBYEOL (샛별이), a bright 11-year-old star-keeper child of the heavenly observatory. Big sparkling eyes, a round cheerful face, short black hair in two small buns tied with yellow ribbons. A deep-blue short jeogori dotted with tiny white stars over a cream skirt, a rolled sky chart under one arm and a small brass sighting tube hanging from the neck. Curious, exact and proud of the nightly records. Waist-up. Expressions row1 bright neutral, delighted grin, worried pout; row2 astonished, thinking hard with one sweat drop, confident with a raised finger.
```

## 장소

**① 장소 설명** 뒤에 **② 공통 문장**을 붙여 넣습니다. 사람과 새 없이, 가로로 긴 그림(약 1672 × 941)입니다.

**달을 그리지 않습니다.** 달의 모양과 위치는 이 사건의 단서라서 게임 화면에서 따로 보여 줍니다. 배경에 달이 있으면 단서와 어긋날 수 있습니다.

### ② 공통 문장 (장소)

```text
Use case: illustration-story. Asset: background painting for a Korean children's courtroom visual-novel game, a Korean folktale heaven beside the Milky Way at night. Deep blue night sky full of stars, soft silver light, traditional Korean architecture resting on clouds. IMPORTANT: do NOT paint the moon anywhere. Match the attached reference for refined watercolor and pencil storybook rendering and gentle depth. Wide landscape composition about 16:9, eye-level view, empty of people and animals, calm and readable at small size, open space in the lower middle where characters will be placed. No text, signs with letters, borders, watermark or modern objects.
```

### ① skycourt.webp — 하늘 관아 (법정)

```text
The open courtroom hall of the heavenly court. A raised judge's seat under a tiled roof with star-patterned eaves, a folding screen painted with constellations behind it, two rows of low railings for witnesses, lanterns glowing softly, clouds drifting across the floor. Formal and symmetrical, with a clear empty space in the center.
```

### ① eunha.webp — 은하수 나루

```text
The bank of the Milky Way, painted as a wide river of softly glowing stars. A small wooden landing with two stone posts where a bridge begins, and the far bank faint in the distance. A broken length of thin silver rope trails from one post into the starry water. No bridge across the river.
```

### ① loomroom.webp — 직녀의 베틀방

```text
A weaver's room in heaven. A traditional Korean wooden loom with half-woven shimmering cloth, baskets of silver thread spools, a spinning wheel, a low table with an open record book and brush, and a round window showing the starry sky.
```

### ① ropestore.webp — 밧줄 창고

```text
A small storehouse of the heavenly court. Shelves of neatly coiled ropes and bundles, an empty peg where one special coil is missing, a heavy wooden door with a single large iron lock, and a clerk's low desk with a ledger, brush and inkstone.
```

### ① obs.webp — 별지기 관측대

```text
A small stone observatory platform in heaven, shaped like the old Korean Cheomseongdae tower but only waist-high, with a brass sighting tube on a stand, a wooden rack of rolled sky charts, a wall calendar made of hanging wooden tags (no readable letters) and a row of round paper discs pinned to a board for daily moon drawings (all discs left blank).
```

### ① eastbank.webp — 동쪽 강가

```text
The east bank of the starry river. A sturdy wooden stake driven into the bank with a thick rope knot still tied firmly around it, the rope end frayed. A few black-and-white magpie feathers and black crow feathers are scattered on the grass. An ox's empty tether post nearby.
```

### ① westbank.webp — 서쪽 강가 계수나무

```text
The west bank of the starry river. A tall old cinnamon tree (계수나무) with a wide branch reaching toward the river and an untidy bird's nest high in the crown with a few glints of something shiny. The river and the far bank lie ahead. In the sky to the LEFT side of the picture, the seven stars of the Big Dipper and one brighter star beside them are clearly visible.
```

## 받아서 확인할 것

- **어느 장소 그림에도 달이 없는지.** 달이 그려졌으면 다시 만듭니다.
- 깍 대장(까치)과 까악 서기(까마귀)가 한눈에 구별되는지. 까치는 흰 배와 흰 어깨, 까마귀는 온몸이 검고 안경과 열쇠.
- 까악 서기의 목에 **열쇠**가 보이는지. 창고 열쇠를 혼자 맡았다는 단서입니다.
- 서쪽 강가 그림에서 **북두칠성과 밝은 별이 그림의 왼쪽 하늘**에 있는지. 게임 속 "계수나무에서 본 하늘"과 맞아야 합니다.
- 동쪽 강가의 말뚝 매듭이 **풀리지 않고 묶여** 있는지.
