# 제6화 그림 프롬프트

6화에 필요한 새 그림은 **인물 4장, 장소 4장**입니다. 지금 `assets/art/` 에 들어 있는 같은 이름의 파일은 임시 그림입니다. 아래 프롬프트로 만든 그림을 **같은 파일 이름으로 덮어쓰면** 게임에 바로 반영됩니다.

다시 쓰는 그림: 나바름(`baleum`), 고을 원님(`wonnim-v3`), 한저울 판사(`judge`), 법정(`court`), 곳간(`gotgan`).

안방 옹고집(가짜)의 그림은 따로 만들지 않습니다. 게임이 `ong.webp` 를 좌우로 뒤집어 보여 줍니다.

만드는 순서는 [3화 그림 프롬프트](episode3-art.md)와 같습니다. 표정 순서: **윗줄 평소, 기쁨, 슬픔 / 아랫줄 놀람, 당황(땀), 단호.**

## 인물

**① 인물 설명** 뒤에 **② 공통 문장**을 붙여 넣습니다. 기존 표정 시트 한 장을 참고용으로 함께 올립니다.

### ② 공통 문장 (인물)

```text
Use the attached atlas solely for the refined watercolor/pencil storybook painting style, realistic-anime proportions and the exact sprite layout; give this character their own face and clothes. Joseon-era Korean setting. Produce ONE 1536x1024 transparent PNG sprite atlas with exactly 3 equal columns x 2 equal rows, each cell 512x512. Six separate waist-up cutouts of the SAME person aligned at identical scale, facing the viewer straight on, head fully within cell, torso reaching bottom, clear margins between cells. Keep clothes, hair and anatomy consistent in all six cells. Detailed fine pencil linework and warm watercolor rendering matching reference quality. Background completely transparent. No scenery, words, labels, captions, panel lines, border, watermark or background rectangles.
```

### ① ong.webp — 옹고집

이 그림은 **좌우가 뚜렷이 달라야** 합니다. 사건의 핵심 단서입니다. 아래의 왼쪽과 오른쪽은 모두 **그림을 보는 사람 기준**입니다.

```text
Use case: illustration-story. Asset: character expression sprite atlas for a Korean children's courtroom visual-novel. Create ONG GOJIP (옹고집) from the Korean folktale Onggojipjeon, a rich, stingy, stubborn landowner of about 55. Heavy-lidded suspicious eyes, thick brows, a long thin moustache and pointed beard, downturned mouth. Black horsehair gat hat and an expensive jade-green silk durumagi coat. He must face the viewer squarely in every cell so left and right are unmistakable. THREE asymmetric marks, all described from the VIEWER'S point of view, must be identical in every cell: (1) a clear dark mole on the cheek at the viewer's RIGHT side of the picture; (2) a short diagonal scar just above the eyebrow at the viewer's LEFT side of the picture; (3) the amber-bead hat string is tied in a knot with a small red tassel beside the chin at the viewer's LEFT side of the picture. Do not mirror these marks between cells and do not add any other moles or scars. No text or letters on clothing, since the image will also be shown flipped. Grumpy and proud, but a real person, not a monster. Expressions row1 sour neutral, rare genuine smile, humbled and sad; row2 shocked, flustered with one sweat drop, furious indignant glare.
```

### ① buin.webp — 옹고집의 아내

```text
Use case: illustration-story. Asset: character expression sprite atlas for a Korean children's courtroom visual-novel. Create ONG GOJIP'S WIFE (옹고집의 아내), a tired, gentle woman of about 50 who has lived thirty years with a cold, stingy husband. Soft worn face, kind eyes with faint shadows, hair in a neat low bun with a jade hairpin. Well-made but plain hanbok: grey-lilac jeogori with a white collar strip and a deep indigo skirt, a storehouse ledger held against her chest. Dutiful, hopeful, a little afraid to look closely. Expressions row1 polite reserved neutral, surprised soft smile, wistful sadness; row2 shocked with a hand over her mouth, uneasy with one sweat drop and eyes turned aside, earnest pleading.
```

### ① dosa.webp — 삿갓 도사

```text
Use case: illustration-story. Asset: character expression sprite atlas for a Korean children's courtroom visual-novel. Create a wandering TAOIST HERMIT (삿갓 도사) from the Korean folktale Onggojipjeon, an old trickster-sage of about 70. Twinkling eyes under bushy white brows, long wispy white beard, weathered smiling face. A wide conical bamboo hat (satgat) tilted back so the face is visible, a patched grey monk's robe, a gnarled wooden staff in one hand, and a few loose stalks of rice straw tucked in his sash. Mischievous, calm and wise, never sinister. Expressions row1 serene knowing neutral, hearty laugh, gentle sorrow; row2 mock surprise with raised brows, caught-out with one sweat drop and a sheepish grin, grave and stern.
```

### ① meoksil.webp — 먹실

```text
Use case: illustration-story. Asset: character expression sprite atlas for a Korean children's courtroom visual-novel. Create a NEW original character MEOKSIL (먹실), the sharp-eyed daughter of a traveling portrait painter, about 12 years old, who helps the player. Bright observant eyes, a small ink smudge on one cheek, black hair in a single braid tied with an indigo ribbon. Practical pale-blue jeogori with sleeves rolled, charcoal-grey skirt, a rolled portrait scroll under one arm and a small round bronze hand mirror tied at her waist. Curious, exact and cheerful. Expressions row1 attentive neutral, delighted grin, disappointed sadness; row2 surprised, puzzled with one sweat drop while holding up the mirror, confident determined look.
```

## 장소

**① 장소 설명** 뒤에 **② 공통 문장**을 붙입니다. 기존 장소 그림 한 장을 참고용으로 함께 올립니다.

### ② 공통 문장 (장소)

```text
Use case: illustration-story. Asset: background painting for a Korean children's courtroom visual-novel game, a wealthy Joseon-era Korean landowner's tile-roofed house. Match the attached reference for refined watercolor and pencil storybook rendering, soft natural colors and gentle depth. Wide landscape composition about 16:9, eye-level view, empty of people and animals, calm and readable at small size, open space in the lower middle where characters will be placed. No text, signs with letters, borders, watermark or modern objects.
```

### ① anchae.webp — 안채 마루

```text
The wide wooden-floored main hall (daecheong) of the inner quarters. Polished floorboards, open lattice doors to a courtyard, a lacquered chest, and on the back wall a single hanging portrait scroll of a man in a black hat, seen from too far to make out the face.
```

### ① sarang.webp — 사랑방

```text
The master's study (sarangbang) seen from the warm end of the room where the master sits. A low writing desk with an inkstone and brush placed on the right-hand side of the desk and an open ledger. The door is on the left wall, and beside it hangs a tall mirror. A paper-covered window is on the right wall, partly hidden by a folding screen. On the far wall hangs a tiger painting scroll in which the tiger looks toward the left, toward the door.
```

### ① backyard.webp — 사랑방 뒤뜰

```text
The narrow back garden behind the study. A paper-covered lattice window slightly ajar; through the gap a folding screen blocks the view, and above the screen a tall mirror on the opposite wall glints. Under the window the damp earth shows a few round holes from a walking staff and scattered stalks of rice straw. A low wall, a jar stand and bamboo behind.
```

### ① ongyard.webp — 옹고집네 앞마당

```text
The front courtyard of a rich landowner's house on a morning after rain. A grand tile-roofed gate, high walls, a large storehouse with a heavy lock to one side. The yard is wet mud with shallow puddles; one clear line of deep footprints crosses the yard toward the gate, and beside it a second line of very faint, barely visible footprints.
```

## 받아서 확인할 것

- 옹고집의 **점이 그림의 오른쪽 뺨, 흉터가 그림의 왼쪽 눈썹 위, 갓끈 매듭이 그림의 왼쪽**에 있는지. 여섯 칸 모두 같아야 합니다. 하나라도 반대면 다시 만듭니다.
- 옹고집 옷에 글자가 없는지. 뒤집어 보여 줄 때 글자가 거꾸로 보입니다.
- 사랑방 그림에서 **문과 거울이 왼쪽, 창이 오른쪽, 호랑이가 왼쪽을 보는지.** 게임 속 "사랑방 살핀 그림"과 맞아야 합니다.
- 앞마당 그림에 **깊은 발자국 한 줄과 흐린 발자국 한 줄**이 보이는지.
