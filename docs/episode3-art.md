# 제3화 그림 프롬프트

3화에 필요한 새 그림은 **인물 5장, 장소 3장**입니다. 지금 `assets/art/` 에 들어 있는 같은 이름의 파일은 "그림 준비 중"이라고 적힌 임시 그림입니다. 아래 프롬프트로 만든 그림을 **같은 파일 이름으로 덮어쓰면** 게임에 바로 반영됩니다.

다시 쓰는 그림: 나바름(`baleum`), 고을 원님(`wonnim-v3`), 한저울 판사(`judge`), 법정(`court`), 잔치 마당(`madang`), 잔치 부엌(`kitchen`), 관아 곳간(`office`), 콩쥐네 광(`gotgan`).

## 만드는 순서

1. GPT 이미지 도구에 **기존 표정 시트 한 장**(예: `heungbu.webp`)을 그림체 참고용으로 함께 올립니다.
2. 아래 프롬프트를 그대로 붙여 넣습니다.
3. 결과를 확인합니다. 인물은 1536 × 1024, 3열 × 2행, 투명 배경이어야 합니다. 여섯 칸의 얼굴과 옷이 같은 사람으로 보여야 합니다.
4. WebP(quality 88)로 바꿔 아래 파일 이름으로 `assets/art/` 에 넣습니다.
5. 여덟 장이 모두 들어오면 `assets/series.js` 에 3화를 한 줄 더합니다.

표정 순서는 모든 인물이 같습니다. **윗줄: 평소, 기쁨, 슬픔 / 아랫줄: 놀람, 당황(땀), 단호.**

## 인물

### kongjwi.webp — 콩쥐

```text
Use case: illustration-story. Asset: Korean children's courtroom visual-novel character expression sprite atlas. Create KONGJWI (콩쥐) from the Korean folktale Kongjwi Patjwi, a kind hardworking girl of about 13 in a Joseon village. Use the attached atlas solely for the refined watercolor/pencil storybook painting style, realistic-anime proportions and exact sprite layout; give Kongjwi her own face and clothes. Gentle oval face, calm warm brown eyes, slightly sun-touched cheeks, long black hair in a single neat braid down her back tied with a plain faded indigo ribbon. Clean but well-worn hanbok: pale ivory cotton jeogori with a faded indigo collar band and tie, simple muted grey-blue skirt, one small tidy patch on a sleeve. A little rice-bran dust on her sleeves. No jewelry, no flowers, no makeup. Modest upright posture, hands held together in front, a child who works carefully. Produce ONE 1536x1024 transparent PNG sprite atlas with exactly 3 equal columns x 2 equal rows, each cell 512x512. Six separate waist-up cutouts of the SAME girl aligned at identical scale, head fully within cell, torso reaching bottom, clear margins between cells. Expressions row1 calm neutral, warm relieved smile, sad with lowered eyes; row2 surprised, worried with one small sweat drop, quietly determined. Keep all clothes and anatomy consistent. Detailed fine pencil linework and warm watercolor rendering matching reference quality. Background completely transparent. No scenery, words, labels, captions, panel lines, border, watermark or background rectangles.
```

### patjwi.webp — 팥쥐

```text
Use case: illustration-story. Asset: Korean children's courtroom visual-novel character expression sprite atlas. Create PATJWI (팥쥐) from the Korean folktale Kongjwi Patjwi, Kongjwi's stepsister, a girl of about 12 in a Joseon village. Use the attached atlas solely for the refined watercolor/pencil storybook painting style, realistic-anime proportions and exact sprite layout; she must look clearly different from Kongjwi. Round face with full cheeks, small upturned nose, lively dark eyes, slightly pouting mouth. Black hair in a braid tied with a NEW bright red silk daenggi ribbon that she is proud of. Brand-new looking hanbok: soft peach-pink jeogori with a deep red collar band and tie, bright green skirt, crisp and unpatched. Chin lifted, a little bossy and spoiled but still a child, not a villain. Produce ONE 1536x1024 transparent PNG sprite atlas with exactly 3 equal columns x 2 equal rows, each cell 512x512. Six separate waist-up cutouts of the SAME girl aligned at identical scale, head fully within cell, torso reaching bottom, clear margins between cells. Expressions row1 neutral with chin up, smug pleased smile, guilty and sad looking down; row2 startled wide eyes, flustered with one sweat drop and eyes darting sideways, stubborn insisting frown. Keep all clothes and anatomy consistent. Detailed fine pencil linework and warm watercolor rendering matching reference quality. Background completely transparent. No scenery, words, labels, captions, panel lines, border, watermark or background rectangles.
```

### baessi.webp — 배씨 부인

```text
Use case: illustration-story. Asset: Korean children's courtroom visual-novel character expression sprite atlas. Create LADY BAE (배씨 부인), the stepmother in the Korean folktale Kongjwi Patjwi, a village woman of about 40 in Joseon Korea. Use the attached atlas solely for the refined watercolor/pencil storybook painting style, realistic-anime proportions and exact sprite layout. Sharp-eyed but ordinary middle-aged woman, not a monster or witch: slim face, thin arched brows, tight mouth, hair parted in the middle and pulled into a low married woman's bun (jjokjin meori) with a plain wooden binyeo hairpin. Dark plum jeogori with a white collar strip and a deep navy skirt, tidy and a little showy. IMPORTANT prop: a single iron key on a cord hanging at her waist, visible in every cell. Arms folded or one hand resting on the key. Produce ONE 1536x1024 transparent PNG sprite atlas with exactly 3 equal columns x 2 equal rows, each cell 512x512. Six separate waist-up cutouts of the SAME woman aligned at identical scale, head fully within cell, torso reaching bottom, clear margins between cells. Expressions row1 cool composed neutral, thin satisfied smile, ashamed and regretful with lowered head; row2 shocked, nervous with one sweat drop and a forced smile, indignant stern glare. Keep the key, clothes and anatomy consistent. Detailed fine pencil linework and warm watercolor rendering matching reference quality. Background completely transparent. No scenery, words, labels, captions, panel lines, border, watermark or background rectangles.
```

### musoe.webp — 무쇠 아재

```text
Use case: illustration-story. Asset: Korean children's courtroom visual-novel character expression sprite atlas. Create a NEW original character MUSOE AJAE (무쇠 아재), a village blacksmith of about 45 in Joseon Korea. Use the attached atlas solely for the refined watercolor/pencil storybook painting style, realistic-anime proportions and exact sprite layout. Broad square face, thick eyebrows, short stubbly beard, kind but gruff eyes, strong forearms. Black hair in a topknot with a rolled cotton headband darkened by sweat. Sleeves rolled up on a coarse grey-brown hemp jeogori, and a scorched dark leather work apron over it. Smudges of soot on his cheek and apron. No hat, no weapons, no hammer raised. A plain honest working man who is uncomfortable in a courtroom. Produce ONE 1536x1024 transparent PNG sprite atlas with exactly 3 equal columns x 2 equal rows, each cell 512x512. Six separate waist-up cutouts of the SAME man aligned at identical scale, head fully within cell, torso reaching bottom, clear margins between cells. Expressions row1 gruff neutral, hearty relieved grin, sorry and ashamed with lowered eyes; row2 startled, very nervous with one sweat drop while scratching the back of his head, firm honest expression. Keep clothes, apron and anatomy consistent. Detailed fine pencil linework and warm watercolor rendering matching reference quality. Background completely transparent. No scenery, words, labels, captions, panel lines, border, watermark or background rectangles.
```

### dukkeobi.webp — 두꺼비

```text
Use case: illustration-story. Asset: Korean children's courtroom visual-novel character expression sprite atlas. Create the helpful TOAD (두꺼비) from the Korean folktale Kongjwi Patjwi, the toad who once blocked the hole in Kongjwi's broken water jar. Use the attached atlas solely for the refined watercolor/pencil storybook painting technique and exact sprite layout. A real-looking but friendly Korean toad painted like a classic picture-book animal: plump round body, warm olive-brown bumpy skin with a pale cream belly, large gentle amber eyes with round pupils, wide soft mouth. It sits upright on a small flat grey stone so that it fills the cell like a bust portrait. It is an animal, not a human in a costume: no clothes, no hat, no glasses, but it may hold a tiny bamboo sieve in one front foot. Wise, calm and a little humorous. Produce ONE 1536x1024 transparent PNG sprite atlas with exactly 3 equal columns x 2 equal rows, each cell 512x512. Six separate cutouts of the SAME toad at identical scale and position, whole head inside the cell, the stone touching the bottom edge, clear margins between cells. Expressions row1 calm neutral, happy with eyes curved shut, sad droopy eyes; row2 surprised with wide round eyes, worried with one sweat drop, serious determined look with a slight frown. Keep skin pattern, colors and size consistent. Detailed fine pencil linework and warm watercolor rendering matching reference quality. Background completely transparent. No scenery, words, labels, captions, panel lines, border, watermark or background rectangles.
```

## 장소

장소 그림은 사람 없이, 가로로 긴 그림(약 1672 × 941)입니다. 기존 장소 그림 한 장(예: `madang.webp`)을 그림체 참고용으로 함께 올립니다.

### mill.webp — 방앗간

```text
Use case: illustration-story. Asset: background painting for a Korean children's courtroom visual-novel game. A small Joseon-era village rice mill (방앗간) seen from its open front in warm afternoon light. Inside the thatched, earthen-walled shed: a wooden foot-operated treadle pestle (디딜방아) over a stone mortar, a round woven winnowing basket (키), a hanging balance scale with a brass pan and stone weights, a few tied straw rice sacks, rice husks scattered on the packed-earth floor. Through the side opening, a glimpse of the neighboring blacksmith's yard with a thin line of smoke. Match the attached reference for refined watercolor and pencil storybook rendering, soft natural colors and gentle depth. Wide landscape composition about 16:9, eye-level view, empty of people and animals, calm and readable at small size, open space in the lower middle where characters will be placed. No text, signs with letters, borders, watermark or modern objects.
```

### forge.webp — 대장간 마당

```text
Use case: illustration-story. Asset: background painting for a Korean children's courtroom visual-novel game. The yard of a Joseon-era village blacksmith's workshop (대장간) in late afternoon. An open-fronted thatched forge with a glowing charcoal hearth, leather bellows, an iron anvil on a tree stump, tongs and hammers on a rack, a wooden water trough, finished sickles and a cauldron leg leaning on the wall. The packed-earth yard in the foreground is dark with soot, tiny black iron flakes and bits of charcoal, and a straw broom leans against a post. A low earthen wall separates the yard from a neighboring mill. Match the attached reference for refined watercolor and pencil storybook rendering, soft natural colors and gentle depth. Wide landscape composition about 16:9, eye-level view, empty of people and animals, calm and readable at small size, open space in the lower middle where characters will be placed. No text, signs with letters, borders, watermark or modern objects.
```

### stream.webp — 냇가

```text
Use case: illustration-story. Asset: background painting for a Korean children's courtroom visual-novel game. A quiet village stream (냇가) in Joseon-era Korea on a clear day. Shallow clear water running over pale rounded pebbles, a bank of light-colored smooth sand in the foreground, a row of flat stepping stones crossing the stream, a flat washing stone at the water's edge, reeds and a willow on the far bank, thatched roofs far in the distance. The sand is bright and clean, with no dark specks. Match the attached reference for refined watercolor and pencil storybook rendering, soft natural colors and gentle depth. Wide landscape composition about 16:9, eye-level view, empty of people and animals, calm and readable at small size, open space in the lower middle where characters will be placed. No text, signs with letters, borders, watermark or modern objects.
```

## 받아서 확인할 것

- 인물 여섯 칸이 **같은 사람**으로 보이는지 (머리 모양, 옷, 소품).
- 배씨 부인의 허리춤에 **열쇠**가 보이는지. 마지막 심문의 단서입니다.
- 콩쥐와 팥쥐가 한눈에 구별되는지 (콩쥐는 수수한 옷과 남색 댕기, 팥쥐는 새 옷과 빨간 댕기).
- 냇가 모래는 밝고 깨끗하게, 대장간 마당은 검은 가루와 숯이 보이게 그려졌는지. 두 곳의 흙이 다르다는 것이 사건의 핵심입니다.
- 인물 그림의 배경이 투명한지, 칸마다 머리가 잘리지 않았는지.
