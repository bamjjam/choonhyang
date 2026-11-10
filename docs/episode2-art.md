# 제2화 그림 제작 기록

제작 방식: 내장 이미지 생성 도구. 각 표정 시트는 1536 × 1024, 3열 × 2행이며 투명 배경입니다. 게임에는 WebP로 변환하여 사용합니다.

## nolbu-v2

게임 파일: [nolbu-v2.webp](../assets/art/nolbu-v2.webp)

최종 프롬프트:

```text
Use case: illustration-story. Asset: Korean children's courtroom visual-novel game character expression sprite atlas. Redesign NOLBU (놀부) from Heungbujeon. Image 1 is the PRIMARY character design reference: familiar Korean folktale Nolbu, round plump face, pinched tiny eyes, sharply angled brows, rosy broad cheeks, small curled black moustache, comically greedy and sulky expression, a compact tall folded black cloth cap with angular peaks, ochre/yellow Korean hanbok. Image 2 specifies ONLY the refined watercolor/pencil storybook rendering and 3-by-2 sprite layout used in this game. Image 3 is the old rejected design: replace its handsome warrior appearance completely. Make the new Nolbu visibly middle-aged, portly, round cheeked and a little ridiculous, matching the silhouette and character feel of image 1 while painted at image 2's detailed quality. Small split curled moustache ONLY, clean shaven chin. No long beard, no goatee, no broad cylindrical brimmed gat, no armor, no intimidating Three-Kingdoms warrior physique. Ocher silk hanbok and plain deep burnt-orange sleeveless over-vest, subtle cloth texture, no ornate military or imperial motifs. Slight double chin, stocky soft body, belly implied in upper torso; full cheeks and hat must be clear at small game size. Produce ONE 1536x1024 transparent PNG atlas: exactly 3 equal columns x 2 equal rows of 512x512 cells. Each cell a waist-up front/very slight 3-quarter cutout of the SAME Nolbu at identical scale, hat entirely inside cell, chest reaches bottom cell edge, generous clear side gutters. Six expressions reading left-to-right: row1 neutral smug, sly satisfied grin, embarrassed/sad; row2 startled, nervous sweating, petulant angry sulk. Preserve same cap, clothing, age, moustache and body across all six. Upper shoulders slightly rounded, hands at belly or clasped rather than muscular folded arms. Fine ink outlines, nuanced warm watercolor shading, beautiful Korean illustrated folktale art. Background fully transparent, no captions, letters, grid, borders, scenery, shadow rectangles or white matte.
```

## dolsoe

게임 파일: [dolsoe.webp](../assets/art/dolsoe.webp)

최종 프롬프트:

```text
Use case: illustration-story. Asset: Korean children's courtroom visual-novel character expression sprite atlas. Create a NEW original character DOLSOE (돌쇠), a male household worker employed by Nolbu, age about 35, Korean Joseon village. Use the attached atlas solely for the refined watercolor/pencil storybook painting style, realistic-anime proportions, and exact sprite layout; give Dolsoe his own clearly different face and clothes. Dolsoe has a broad friendly round face, sun-tanned warm skin, short straight black eyebrows, a broad rounded nose, small gentle eyes, clean-shaven face, black hair in a small topknot with a plain dark brown tied headband. He wears a faded navy simple sleeveless work vest over loose cream hemp hanbok sleeves and a rough brown cloth waist tie. No hat, no jewelry, no apron symbols, no modern objects. A humble, worried adult worker: head slightly lowered, shoulders drawn inward and sloping, hands held together low near his waist. He must look distinctly different from the handsome slim Heungbu reference and from a young nobleman; no heroic wide chest or swaggering posture. Produce ONE 1536x1024 transparent PNG sprite atlas with exactly 3 equal columns x 2 equal rows, each cell 512x512. Six separate waist-up cutouts of the SAME person aligned at identical scale, head fully within cell, torso reaching bottom, clear margins between cells. Expressions row1 neutral hesitant, relieved small smile, remorseful sad; row2 surprised, very nervous with one sweat drop and visibly hunched shoulders, sincere determined expression with modest posture. His worried/sad sprites especially must have raised inward shoulders and lowered gaze. Keep all clothes and anatomy consistent. Detailed fine pencil linework and warm watercolor rendering matching reference quality. Background completely transparent. No scenery, words, labels, captions, panel lines, border, watermark or background rectangles.
```

## wonnim

게임 파일: [wonnim.webp](../assets/art/wonnim.webp)

최종 프롬프트:

```text
Use case: illustration-story. Asset: Korean children's courtroom visual-novel character expression sprite atlas. Create a NEW original local village magistrate called THE VILLAGE WONNIM (고을 원님), age about 60, for an imagined Korean Joseon local court in Heungbujeon. He is neither Yi Mongryong nor Byeon Hakdo. Reference atlas specifies ONLY watercolor/pencil painting style and 3x2 layout, not identity. A restrained fair older Korean man: long calm face, gently weathered cheeks, narrow thoughtful eyes, gray eyebrows, neat short gray moustache and a small neat gray chin beard, no big warrior beard. Simple traditional black round jeollip-style magistrate hat with modest brim and a small red side tassel; no pearls, bead strings or straps crossing cheeks, no imperial crown or Chinese Three-Kingdoms hat. Plain deep indigo sleeveless Korean robe over muted pale-blue/ivory hanbok, a narrow restrained red trim and brown waist belt, no armor, dragon embroidery or imperial regalia. Dignified yet approachable posture, hands loosely together low down holding a small closed paper case book without writing. Produce ONE transparent 1536x1024 PNG atlas, exactly 3 equal columns and 2 equal rows of 512x512 cells. Each cell is a separate waist-up front/slight 3-quarter portrait of the same magistrate at identical scale, full hat visible with margin inside each cell; torso touches bottom cell edge, clear side gaps, no overlaps. Six expressions left-right row1 calm neutral listening, gently pleased, concerned/sad; row2 surprised, puzzled with one small sweat bead, firm serious judgment. Preserve identity and outfit throughout. Fine pencil outlines, realistic storybook facial anatomy, richly shaded but soft watercolor texture consistent with reference. Fully transparent background with no scenery, text, labels, borders, grid, modern objects or watermark.
```


## 2026-11-10 추가 수정

현재 사용: nolbu-v3.webp, wonnim-v2.webp. 기존 버전은 기록으로 보존.
놀부: 흥부의 수채화·연필화 질감에 맞춰 자연스러운 성인 비율, 절제한 눈썹과 콧수염으로 재생성.
원님: 40대 중후반의 별도 인물, 검은 정돈된 수염, 사모·단령·단학 흉배·품대로 재생성.
관복 참고: https://www.kculture.or.kr/clothes/code/944/menu/1078/idx/90/currentPage/1
사모 참고: https://www.gugak.go.kr/ency/topic/view/533
내장 이미지 생성 도구로 제작, 1536×1024 투명 3×2 표정 시트, WebP quality 88 변환.

## 원님 사용자 레퍼런스 반영

현재 원님: wonnim-v3.webp. 사용자가 제시한 사진의 넓은 챙 전립, 붉은 술, 구슬 끈, 붉은 동다리 소매와 검은 전복을 기준으로 복식 교체. 꽃중년 얼굴과 수채화 그림체 유지.
참고: 국립민속박물관 사또 복식 설명 https://folkency.nfm.go.kr/api/file/download/dictionary/422
