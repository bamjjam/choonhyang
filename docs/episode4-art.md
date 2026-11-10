# 제4화 그림 프롬프트

4화에 필요한 새 그림은 **인물 5장, 장소 5장**입니다. 지금 `assets/art/` 에 들어 있는 같은 이름의 파일은 임시 그림입니다. 아래 프롬프트로 만든 그림을 **같은 파일 이름으로 덮어쓰면** 게임에 바로 반영됩니다.

다시 쓰는 그림: 나바름(`baleum`), 한저울 판사(`judge`).

만드는 순서와 확인할 점은 [3화 그림 프롬프트](episode3-art.md)와 같습니다. 표정 순서도 같습니다. **윗줄: 평소, 기쁨, 슬픔 / 아랫줄: 놀람, 당황(땀), 단호.**

## 인물

인물마다 **① 인물 설명**을 쓰고, 바로 뒤에 **② 공통 문장**을 붙여서 한 번에 넣습니다. 기존 표정 시트 한 장을 그림체 참고용으로 함께 올립니다.

### ② 공통 문장 (인물)

```text
Use the attached atlas solely for the refined watercolor/pencil storybook painting style and the exact sprite layout. The sea-palace characters are gentle picture-book animals who stand upright and wear simple Joseon-era Korean clothing; keep them charming and readable for children, never scary. Produce ONE 1536x1024 transparent PNG sprite atlas with exactly 3 equal columns x 2 equal rows, each cell 512x512. Six separate waist-up cutouts of the SAME character aligned at identical scale, head fully within cell, body reaching the bottom, clear margins between cells. Keep costume, colors and anatomy consistent in all six cells. Detailed fine pencil linework and warm watercolor rendering matching reference quality. Background completely transparent. No scenery, words, labels, captions, panel lines, border, watermark or background rectangles.
```

### ① yongwang.webp — 용왕

```text
Use case: illustration-story. Asset: character expression sprite atlas for a Korean children's courtroom visual-novel. Create the DRAGON KING (용왕) of the undersea palace from the Korean folktale Tokkijeon. A dignified elderly king in human form with gentle dragon features: two small coral-like antlers, a long white beard and whiskers, a few pale blue-green scales at the temples. Deep blue royal robe with gold wave embroidery and a jade belt, a small golden crown. He is unwell: slightly pale, with a soft cloth wrapped around his neck. Kind, fair and a little tired. Expressions row1 calm dignified neutral, relieved warm smile, weary and sad while coughing into his sleeve; row2 astonished, troubled with one sweat drop, stern judging look.
```

### ① tokki.webp — 토끼

```text
Use case: illustration-story. Asset: character expression sprite atlas for a Korean children's courtroom visual-novel. Create the RABBIT (토끼) from the Korean folktale Tokkijeon, a clever young hare from the land visiting the undersea palace as a guest. Light brown fur with a cream muzzle and belly, long upright ears, bright black eyes, pink nose. Wears a short sky-blue traveler's vest (baeja) over a white jeogori, with a small cloth bundle strap across the chest. Quick-witted, proud and a little cheeky, but clearly innocent. Expressions row1 alert neutral, triumphant happy grin, hurt and sad with drooping ears; row2 shocked with ears straight up, flustered with one sweat drop, indignant protest with arms crossed.
```

### ① jara.webp — 별주부 자라

```text
Use case: illustration-story. Asset: character expression sprite atlas for a Korean children's courtroom visual-novel. Create BYEOLJUBU the soft-shelled TURTLE (별주부 자라) from the Korean folktale Tokkijeon, a loyal but stubborn court official of the undersea palace. Olive-green turtle with a long wrinkled neck, small earnest eyes, a domed brown shell on his back. Wears a dark green Joseon official's robe with a round collar and a black official's hat (samo) that sits slightly too big on his head. Self-important, loyal, quick to jump to conclusions, not evil. Expressions row1 dutiful neutral, proud pleased smile, ashamed with neck half pulled into the shell; row2 startled with neck stretched long, very nervous with one sweat drop, accusing stern glare with one flipper raised.
```

### ① muneo.webp — 문어 의원

```text
Use case: illustration-story. Asset: character expression sprite atlas for a Korean children's courtroom visual-novel. Create a NEW original character DOCTOR OCTOPUS (문어 의원), the busy physician of the undersea palace pharmacy. A soft coral-red octopus with a large round head, small round spectacles, and a scholar's black horsehair hat (tanggeon) perched on top. Several long arms are visible in every cell, each doing something different: holding a writing brush with wet black ink, a small paper medicine packet, a ledger. One arm tip is stained with black ink. Wears a pale grey physician's vest. Hardworking, absent-minded and honest. Expressions row1 busy neutral, relieved happy smile, guilty and sorry with drooping arms; row2 shocked with arms flung up, flustered with one sweat drop and tangled arms, earnest insisting look.
```

### ① ppok.webp — 뽁이

```text
Use case: illustration-story. Asset: character expression sprite atlas for a Korean children's courtroom visual-novel. Create a NEW original character PPOK (뽁이), a tiny young PUFFERFISH who works as the errand child of the undersea palace pharmacy and helps the player. A small round yellow pufferfish with a cream belly, a few soft short spines, big bright round eyes and tiny fins used like hands. Wears a little indigo apprentice's headband and carries a small brass balance scale or a tiny notebook. Cheerful, curious and careful. The fish floats upright and fills the cell like a bust portrait. Expressions row1 attentive neutral, joyful with cheeks slightly puffed, sad and deflated; row2 surprised and fully puffed up round, worried with one sweat drop, serious determined look.
```

## 장소

장소마다 **① 장소 설명** 뒤에 **② 공통 문장**을 붙입니다. 기존 장소 그림 한 장을 그림체 참고용으로 함께 올립니다.

### ② 공통 문장 (장소)

```text
Use case: illustration-story. Asset: background painting for a Korean children's courtroom visual-novel game. The setting is the Dragon King's undersea palace from Korean folktales, built in Joseon palace architecture and sitting inside a huge air bubble, so the rooms are dry and lit by soft blue-green light filtering through water above. Match the attached reference for refined watercolor and pencil storybook rendering, soft natural colors and gentle depth. Wide landscape composition about 16:9, eye-level view, empty of characters, calm and readable at small size, open space in the lower middle where characters will be placed. No text, signs with letters, borders, watermark or modern objects.
```

### ① yonggung.webp — 용궁 대전 (법정)

```text
The great throne hall of the undersea palace used as a courtroom. A raised dais with an empty dragon throne under a canopy, tall red pillars wrapped with carved waves, coral and pearl lanterns, a polished shell-inlaid floor. Through the high latticed windows, fish and swaying kelp are visible beyond the air bubble.
```

### ① yakjang.webp — 약방 약장

```text
The medicine cabinet wall of the palace pharmacy. A tall wooden apothecary cabinet with many small drawers, bundles of dried seaweed and herbs hanging above, paper medicine packets, an open ledger and a brass balance scale with a row of small seashell weights on the counter.
```

### ① yakbang.webp — 약방 탁자

```text
The work table of the palace pharmacy seen from slightly above. On a high wooden table: three identical white bowls of clear water in a row, a black inkstone with a wet brush, and a small shallow white medicine dish lying tipped on its side next to the inkstone. A small charcoal brazier stands beside the table. The apothecary cabinet is a few steps away in the background.
```

### ① corridor.webp — 약방 앞 복도

```text
A quiet palace corridor leading to the pharmacy. At the end stands a thick closed door made of one large pale seashell panel in a wooden frame, with no window and no gap. Red pillars, a shell-tiled floor, a single coral lantern.
```

### ① gate.webp — 용궁 수문

```text
The main water gate of the undersea palace seen from inside. A grand Joseon-style gatehouse with a tiled roof, where the edge of the air bubble shimmers like a wall of water. A small guard desk with an open register book, and a coral garden path leading away to one side.
```

## 받아서 확인할 것

- 문어 의원의 다리 끝에 **먹물**이 묻어 있는지. 마지막 심문의 단서입니다.
- 약방 탁자 그림에 **맑은 물 사발 셋, 벼루, 엎어진 약접시**가 보이는지.
- 약방 문이 **창도 틈도 없이 닫힌 문**으로 그려졌는지. 첫 심문의 단서입니다.
- 동물 인물이 무섭지 않고, 여섯 칸이 같은 인물로 보이는지.
