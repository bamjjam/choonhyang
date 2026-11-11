# 제5화 그림 프롬프트

5화에 필요한 새 그림은 **인물 5장, 장소 4장**입니다. 지금 `assets/art/` 에 들어 있는 같은 이름의 파일은 임시 그림입니다. 아래 프롬프트로 만든 그림을 **같은 파일 이름으로 덮어쓰면** 게임에 바로 반영됩니다.

다시 쓰는 그림: 나바름(`baleum`), 고을 원님(`wonnim-v3`), 한저울 판사(`judge`), 법정(`court`), 곳간(`gotgan`).

만드는 순서는 [3화 그림 프롬프트](episode3-art.md)와 같습니다. 표정 순서: **윗줄 평소, 기쁨, 슬픔 / 아랫줄 놀람, 당황(땀), 단호.**

## 인물

**① 인물 설명** 뒤에 **② 공통 문장**을 붙여 넣습니다. 기존 표정 시트 한 장을 참고용으로 함께 올립니다.

### ② 공통 문장 (인물)

```text
Use the attached atlas solely for the refined watercolor/pencil storybook painting style, realistic-anime proportions and the exact sprite layout; give this character their own face and clothes. Joseon-era Korean village setting. Produce ONE 1536x1024 transparent PNG sprite atlas with exactly 3 equal columns x 2 equal rows, each cell 512x512. Six separate waist-up cutouts of the SAME person aligned at identical scale, head fully within cell, torso reaching bottom, clear margins between cells. Keep clothes, hair and anatomy consistent in all six cells. Detailed fine pencil linework and warm watercolor rendering matching reference quality. Background completely transparent. No scenery, words, labels, captions, panel lines, border, watermark or background rectangles.
```

### ① simcheong.webp — 심청

```text
Use case: illustration-story. Asset: character expression sprite atlas for a Korean children's courtroom visual-novel. Create SIM CHEONG (심청) from the Korean folktale Simcheongjeon, a devoted, clear-eyed girl of about 14 who guides the player. Gentle heart-shaped face, bright thoughtful eyes, long black hair in one braid tied with a deep red daenggi ribbon. Clean, mended hanbok: soft white jeogori with a pale blue collar band and tie, lotus-pink skirt. She carries a small folded paper map tucked in her sleeve. Warm, brave and observant. Expressions row1 calm attentive neutral, bright encouraging smile, worried sadness; row2 surprised, anxious with one sweat drop, quietly determined.
```

### ① gwideok.webp — 귀덕 어멈

```text
Use case: illustration-story. Asset: character expression sprite atlas for a Korean children's courtroom visual-novel. Create GWIDEOK EOMEOM (귀덕 어멈) from the Korean folktale Simcheongjeon, the kind neighbor woman of about 50 who nursed Sim Cheong as a baby. Round warm face with laugh lines, hair in a low bun with a plain wooden hairpin, work-roughened hands. Faded sage-green jeogori with a white collar strip, dark grey-brown skirt and a clean cotton apron; a thin account book tucked under one arm. Honest, motherly and deeply hurt at being accused. Expressions row1 gentle neutral, relieved warm smile, tearful and wronged; row2 shocked, flustered with one sweat drop and hands raised, firm and dignified.
```

### ① ppaeng.webp — 뺑덕 어멈

```text
Use case: illustration-story. Asset: character expression sprite atlas for a Korean children's courtroom visual-novel. Create PPAENGDEOK EOMEOM (뺑덕 어멈) from the Korean folktale Simcheongjeon, a talkative, showy woman of about 40 who loves snacks and spends more than she has. Sharp chin, lively darting eyes, rouged cheeks, hair in a bun with an oversized shiny hairpin. Bright magenta jeogori with a yellow-green collar band, purple skirt, a jingling ornament at the waist; a little rice-cake powder on her sleeve. Comical and sly rather than frightening. Expressions row1 smug neutral with one eyebrow raised, gloating grin, sorry and ashamed with lowered head; row2 shocked with mouth open, very nervous with one sweat drop and a forced smile, loud accusing glare while pointing.
```

### ① simbongsa.webp — 심 봉사

```text
Use case: illustration-story. Asset: character expression sprite atlas for a Korean children's courtroom visual-novel. Create SIM BONGSA (심 봉사, Sim Hakgyu) from the Korean folktale Simcheongjeon, Sim Cheong's blind father, a gentle dignified man of about 55. His eyes are peacefully closed in every cell. Thin kind face, greying beard, hair in a topknot under a plain black horsehair headband. Worn but clean pale grey durumagi coat; one hand rests on a wooden walking staff. He listens carefully, head tilted slightly as if hearing a sound. Portray him with respect and warmth, wise and attentive, never pitiful. Expressions row1 calm listening neutral, gentle happy smile, sorrowful; row2 startled with raised brows, concerned with one sweat drop, firm and earnest.
```

### ① gawi.webp — 가위 아재

```text
Use case: illustration-story. Asset: character expression sprite atlas for a Korean children's courtroom visual-novel. Create a NEW original character GAWI AJAE (가위 아재), a traveling taffy seller (엿장수) of about 40 in Joseon Korea. Tanned cheerful face, big grin, a straw hat pushed back on his head. Patched tan hemp jeogori with rolled sleeves; a flat wooden tray of pale taffy sticks hangs from a strap around his neck. IMPORTANT prop: large blunt iron taffy scissors (엿가위) held in one hand in every cell. Jolly and talkative, a bit careless, not a villain. Expressions row1 friendly neutral, big salesman's laugh, ashamed with lowered eyes; row2 startled, sweating nervously with one sweat drop while hiding the scissors behind the tray, stubborn denial.
```

## 장소

**① 장소 설명** 뒤에 **② 공통 문장**을 붙입니다. 기존 장소 그림 한 장을 참고용으로 함께 올립니다.

### ② 공통 문장 (장소)

```text
Use case: illustration-story. Asset: background painting for a Korean children's courtroom visual-novel game, Joseon-era Korean village. Match the attached reference for refined watercolor and pencil storybook rendering, soft natural colors and gentle depth. Wide landscape composition about 16:9, eye-level view, empty of people and animals, calm and readable at small size, open space in the lower middle where characters will be placed. No text, signs with letters, borders, watermark or modern objects.
```

### ① simhome.webp — 심청네 마당

```text
The small yard of a poor but tidy thatched house at dusk. A wooden storehouse with a barred door at the back, a stone well with a bucket on the left side, a persimmon tree with orange fruit on the right side, a low earthen wall and a wooden gate in the foreground. The low sun is behind the well on the left, and long shadows of the tree and the wall stretch toward the right.
```

### ① simroom.webp — 심 봉사의 방

```text
The inside of a humble thatched-house room in late afternoon. A paper-covered lattice window on the left wall glows with warm low sunlight. A straw mat, a folded quilt, a wooden walking staff leaning by the door, a small low table with a water bowl. Through the half-open door, a glimpse of the back of a wooden storehouse.
```

### ① temple.webp — 몽은사

```text
A small mountain Buddhist temple (몽은사) in the evening. A modest main hall with dancheong-painted eaves, a bronze bell in an open pavilion, stone lanterns with small oil flames, a stone stairway and pine trees. Warm lamplight inside the open hall doors, with an offering table of oil lamps.
```

### ① market.webp — 장터 떡집

```text
A rice-cake stall at a Joseon village market around noon. A wooden stall under a straw awning with trays of injeolmi and honey rice cakes, a steaming wooden steamer, a low bench for customers, and a thin account book hanging from a nail on the post. Other market stalls blur into the background. Short midday shadows directly under the awning and bench.
```

## 받아서 확인할 것

- 심청네 마당 그림에서 **우물이 왼쪽, 감나무가 오른쪽, 곳간이 뒤쪽**인지. 게임 속 마당 그림(북쪽이 위)과 맞아야 합니다.
- 마당 그림의 그림자가 **해의 반대쪽**으로 뻗어 있는지. 그림자 방향이 사건의 핵심입니다.
- 가위 아재가 **엿가위**를 들고 있는지. 심 봉사가 들은 소리의 단서입니다.
- 심 봉사가 여섯 칸 모두 눈을 감고, 품위 있게 그려졌는지.
