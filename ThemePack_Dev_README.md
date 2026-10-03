# GuguTown ThemePack Manager 4.x — Custom Theme Pack Developer Guide

Applies to: **GuguTown ThemePack Manager 4.0.1**
Reference theme: **`PCR_v0.1.0.GuThemePack`** (Princess Connect! Re:Dive — passes every validation check)

---

## Contents

1. [What a theme pack is](#1-what-a-theme-pack-is)
2. [File format and naming](#2-file-format-and-naming)
3. [Minimal working skeleton](#3-minimal-working-skeleton)
4. [`INF`: basic information](#4-inf-basic-information)
5. [Component overview](#5-component-overview)
6. [Component field reference](#6-component-field-reference)
7. [Styling and night mode](#7-styling-and-night-mode)
8. [Naming and path rules](#8-naming-and-path-rules)
9. [Full example walkthrough (PCR)](#9-full-example-walkthrough-pcr)
10. [Validation checklist and common errors](#10-validation-checklist-and-common-errors)
11. [Suggested workflow](#11-suggested-workflow)
12. [Known non-functional fields](#12-known-non-functional-fields)

---

## 1. What a theme pack is

A theme pack is a **JSON file** that replaces the following in the game *GuguTown*:

| Category | What you can replace |
|---|---|
| **Images** | Character art, CG, portraits, mob art, equipment/item/dessert icons, the Kanban musume |
| **Audio** | Character voices (click, level-up, win, lose, …) |
| **Text** | Character names, equipment names, item names, dessert names |
| **Styling** | Page colours, night-mode colours, icon background sizing, Kanban appearance |

The manager reads the pack and **dynamically swaps** these assets per page. Nothing in the game itself is modified.

---

## 2. File format and naming

### 2.1 Encoding (**the single most important rule**)

- Must be **UTF-8**
- **No BOM**
- The file must **not contain** `�` (U+FFFD, the replacement character)

> The manager scans the whole file first. If it finds `�`, it **refuses to install** and reports an encoding error.
> This exists to catch the classic "saved Chinese text as GBK" mistake, which corrupts the entire file.
> In your editor, choose **"UTF-8 (without BOM)"**.

### 2.2 Extension

`.GuThemePack` is recommended. The install dialog also accepts `.guthemepack` and `.json`.

### 2.3 Suggested file naming

```
<theme-id>_v<major>.<minor>.<patch>.GuThemePack
```

For example `PCR_v0.1.0.GuThemePack`.

> The filename is cosmetic — **the manager only reads `INF.UID` and `INF.Ver` inside the file**.
> `INF.Ver` is used to compare versions, so be sure to bump it on every release.

---

## 3. Minimal working skeleton

This is enough to be recognised and installed:

```json
{
	"INF": {
		"UID": "mytheme",
		"Name": {
			"sc": "我的主题",
			"tc": "我的主題",
			"ja": "マイテーマ",
			"en": "My Theme"
		},
		"Ver": [0, 1, 0],
		"Build": 20250101001,
		"COMP": {
			"CharTachie": false,
			"MobsTachie": false,
			"ImageKanban": false,
			"SpineKanban": false,
			"CharSounds": false,
			"EquipIcons": false,
			"ItemIcons": false,
			"DessertIcons": false,
			"EquipThemeName": false,
			"ItemThemeName": false,
			"DessertThemeName": false,
			"CharThemeName": false,
			"MobsThemeName": false,
			"Style": false
		}
	}
}
```

**Only four things are required**, all under `INF`: `UID`, `Name`, `Ver`, `COMP`.

Add other components as needed. **Write out all 14 `COMP` keys explicitly** (`true`/`false`)
so it is obvious at a glance which features the pack enables.

> Component flags are coerced to booleans (`t.INF.COMP[k] = !!t.INF.COMP[k]`),
> so `1`, `"true"` or `"checked"` all work — but **use `true` / `false`** for clarity.

---

## 4. `INF`: basic information

| Field | Type | Required | Notes |
|---|---|---|---|
| `UID` | string | ✅ | Unique pack identifier. **Must not collide with a built-in theme**; lowercase ASCII recommended |
| `Name` | object | ✅ | Display name with `sc`/`tc`/`ja`/`en` |
| `Ver` | array | ✅ | Version, **exactly 3 numbers**: `[major, minor, patch]` |
| `Build` | number | Recommended | Build number; a date style like `261003001` works well |
| `COMP` | object | ✅ | Component switches, see below |

### Language fallback for `Name`

Provide **all four languages**. A missing language falls back to `sc`; if even `sc` is
absent, it falls back to `UID`.

### What `Ver` does

The manager **sorts the theme list by it**. Bump it on every release or a newer pack may
be treated as older.

> ⚠️ `Ver` must be a 3-element array. `[1, 0]` or `"1.0.0"` is reset to `[0, 0, 0]`.

### What `UID` does (**do not change it casually**)

- The player's **current selection** is stored as a `UID`; changing it invalidates that selection.
- Install records and the uninstall list are keyed by `UID`.
- Use a **new `UID`** only for a genuinely new theme. For a version update, **keep the same `UID`**.

---

## 5. Component overview

The 14 `COMP` keys and what they do:

| Key | Effect | Data block |
|---|---|---|
| `CharTachie` | Character art / CG / portraits | `CharTachie` |
| `MobsTachie` | Mob art | `MobsTachie` |
| `ImageKanban` | Image Kanban musume | `ImageKanban` |
| `SpineKanban` | Spine (skeletal animation) Kanban musume | `SpineKanban` |
| `CharSounds` | Character voices | `CharSounds` |
| `EquipIcons` | Equipment icons | `EquipIcons` |
| `ItemIcons` | Item icons | `ItemIcons` |
| `DessertIcons` | Dessert (charm) icons | `DessertIcons` |
| `EquipThemeName` | Equipment name replacement | `EquipThemeName` |
| `ItemThemeName` | Item name replacement | `ItemThemeName` |
| `DessertThemeName` | Dessert name replacement | `DessertThemeName` |
| `CharThemeName` | Character name replacement | `CharName` ⚠️ note the different key |
| `MobsThemeName` | — (see [§12](#12-known-non-functional-fields)) | — |
| `Style` | Colours and appearance | `Style` |

> **Note**: the data block for `CharThemeName` is called **`CharName`**, not `CharThemeName`.
> This is a historical naming quirk; get it wrong and character names will not change.

### Install-time availability warnings

Three checks run after install. Failing one shows an alert (**it does not block installation**):

| Condition | Warning |
|---|---|
| `CharTachie`, `ImageKanban`, `SpineKanban` **all false** | no art / Kanban available |
| `SpineKanban` is false | this pack's Spine Kanban is unavailable |
| `CharSounds` is false | this pack's theme voice is unavailable |

---

## 6. Component field reference

### 6.1 `CharTachie` — character art

```json
"CharTachie": {
	"common": "https://example.com/cg/",
	"ext": ".png",
	"uri":      { "默": "mo/", "琳": "lin/" },
	"HeadFG":   { "默": "1",  "琳": "1"  },
	"LeftFG":   { "默": "2",  "琳": "2"  },
	"CG":       { "默": "3",  "琳": "3"  },
	"LeftPKFG": { "默": "4",  "琳": "4"  },
	"RightPKFG":{ "默": "5",  "琳": "5"  }
}
```

| Field | Notes |
|---|---|
| `common` | URL prefix (**must end with `/`**) |
| `ext` | Extension, defaults to `.png` |
| `uri` | **Character key → subdirectory**. Character keys are the game's internal names (`默`, `琳`, …) |
| `HeadFG` | Portrait file (character list, card list) |
| `LeftFG` | Left-side art (character detail page) |
| `CG` | Character CG (large image on the detail page) |
| `LeftPKFG` | Battle page **left** side (player) art |
| `RightPKFG` | Battle page **right** side (enemy) art |

**Final URL formula**:

```
common + uri[character] + table[character] + ext
```

For PCR's `默`:

```
https://p.inari.site/guguicons/test/cg/  +  mo/  +  3  +  .png
= https://p.inari.site/guguicons/test/cg/mo/3.png     ← CG
= https://p.inari.site/guguicons/test/cg/mo/1.png     ← portrait
= https://p.inari.site/guguicons/test/cg/mo/2.png     ← left-side art
```

> The six tables are **independent** — use `1/2/3` or `head/cg/left`, whatever you like.
> If you provide `uri` but omit a table, that usage simply is not replaced (the game's original is kept).

### 6.2 `MobsTachie` — mob art

```json
"MobsTachie": {
	"common": "https://example.com/mob/",
	"ext": ".png",
	"uri": {
		"魔灯之灵（野怪": "deng",
		"六眼飞鱼（野怪": "fish"
	}
}
```

The simplest structure: only `common` / `ext` / `uri`.

> For the `uri` keys, **copy the game's internal name verbatim**. In the reference pack these
> carry a `（野怪` suffix, which comes from the game itself — keeping it as-is is safest.

### 6.3 `ImageKanban` — image Kanban musume

```json
"ImageKanban": {
	"bg": "https://example.com/bg.jpg",
	"asset": {
		"common": "https://example.com/cg/",
		"ext": ".png",
		"resize": "64"
	},
	"uri":  { "默": "mo/", "琳": "lin/" },
	"idle": { "默": "0",  "琳": "0"  },
	"win":  { "默": "0",  "琳": "0"  },
	"lose": { "默": "0",  "琳": "0"  }
}
```

| Field | Notes |
|---|---|
| `bg` | Background image shown on hover; falls back to `Style.kanbanbg` or the built-in image |
| `asset.common` / `asset.ext` | Same URL-prefix/extension structure as `CharTachie` |
| `asset.resize` | **Art size as a percentage of the canvas** (e.g. `"64"` = 64%). 40–70 works well |
| `uri` | Character key → subdirectory |
| `idle` / `win` / `lose` | File names for the idle / win / lose states |

`idle`/`win`/`lose` **must all cover every character present in `uri`**,
otherwise that character fails to resolve in some states (nothing shown, or a 404).

> `resize` may be a string or a number; it is interpolated directly into the CSS
> `width`/`height` percentage. The art is scaled with `object-fit: contain`, so it
> **never overflows the canvas**.

### 6.4 `SpineKanban` — Spine Kanban musume (the most complex)

```json
"SpineKanban": {
	"bg": {
		"url": "https://example.com/bg.jpg",
		"config": { "alpha": true, "backgroundColor": "#000000" }
	},
	"assest": {
		"common": "https://example.com/common/",
		"unit": "https://example.com/unit/",
		"ext": ".cysp",
		"type": "_COMMON_BATTLE.cysp",
		"skeleton": "_CHARA_BASE.cysp",
		"skill": "BATTLE.cysp",
		"default": "default",
		"baseId": "000000",
		"substr": "1",
		"sep": "_",
		"texture": { "pos": "texture.atlas", "img": "texture.png" },
		"addAnimations": ["DEAR", "NO_WEAPON", "POSING"],
		"optionList": [["闲置", "idle"], ["攻击", "attack"]],
		"idleCheck": ["idle", "walk", "run"],
		"anim": {
			"click": "000000_dear_smile",
			"multi_standBy": "multi_standBy",
			"_idle": "_idle",
			"stop": "stop",
			"hold": "hold",
			"win": "option[value*=joyResult]",
			"lose": ["damage", "die", "landing"]
		}
	},
	"conf": {
		"fallback": { "uri": "wuu/", "type": "6", "hasRarity6": true, "wi": -330, "hi": -42, "re": 0.8 },
		"默":       { "uri": "mo/",  "type": "7", "hasRarity6": true, "wi": -350, "hi": -42, "re": 0.8 }
	}
}
```

> ⚠️ The field is spelled **`assest`** (a historical typo), **not** `asset`.
> `ImageKanban` uses the correct `asset`. The two differ — an easy mistake.

#### `assest` fields

| Field | Notes |
|---|---|
| `common` | Shared skeleton prefix |
| `unit` | Unit-resource prefix (textures, skills) |
| `ext` | Skeleton extension, normally `.cysp` |
| `type` | Class battle skeleton file name |
| `skeleton` | Character base skeleton file name |
| `skill` | Skill skeleton file name |
| `default` | Default skin name |
| `baseId` | Base unit ID (usually `000000`) |
| `substr` / `sep` | Animation-name concatenation controls (rarely changed) |
| `texture.pos` / `texture.img` | Texture atlas and image file names |
| `addAnimations` | Extra animation names (concatenated into the options) |
| `optionList` | `[display name, animation name]` pairs for the animation dropdown |
| `idleCheck` | Animation names that count as "idle" |
| `anim` | **Special action mapping**, see below |

#### `anim` special actions

| Key | Meaning |
|---|---|
| `click` | Played when the Kanban musume is clicked |
| `multi_standBy` | Co-op (multi) standby |
| `_idle` | Idle suffix |
| `stop` / `hold` | Stop / hold |
| `win` | Selector run at victory; the matched `<option>`'s `value` supplies the animation name |
| `lose` | Animation **array** played on defeat |

#### `conf` per-character entries

| Field | Notes |
|---|---|
| `uri` | Resource subdirectory for that character |
| `type` | **Class type** (`1` = sword, `7` = staff, …) |
| `hasRarity6` | Whether a 6-star skeleton exists |
| `wi` / `hi` | Horizontal / vertical **position offset** (negative moves left/down) |
| `re` | Scale factor (`0.8`–`1.0` is typical) |

> **`conf.fallback` is required**: it is used when a character has no dedicated entry.
> `wi`/`hi`/`re` are **tuned per character** against the actual game screen — expect iteration.

### 6.5 `CharSounds` — character voices

```json
"CharSounds": {
	"common": "https://example.com/vo/",
	"ext": ".mp3",
	"uri": {
		"on": "on",
		"off": "off",
		"默": "mo/",
		"琳": "lin/"
	},
	"conf": {
		"默": {
			"click": ["0", "1", "2", "3"],
			"levelup": "levelup",
			"colle": "colle",
			"change": "change",
			"power": "power",
			"win": "win",
			"lose": "lose",
			"reset": "reset",
			"exp": "exp",
			"battle": "battle"
		}
	}
}
```

- Besides characters, `uri` must contain **`on` / `off`** (the audio on/off cues).
- `conf[character]` maps events to audio file names.
- **`click` is an array** (several clips played in turn/at random); the rest are single strings.
- A character missing from `conf` simply keeps the original voice.

#### Event reference

| Key | Trigger |
|---|---|
| `click` | Kanban musume clicked (array) |
| `levelup` | Level up |
| `colle` | Collect / obtain |
| `change` | Switch |
| `power` | Enhance |
| `win` / `lose` | Battle won / lost |
| `reset` | Reset |
| `exp` | Experience |
| `battle` | Entering battle |

### 6.6 `EquipIcons` — equipment icons

```json
"EquipIcons": {
	"common": "https://example.com/eq/",
	"ext": ".gif",
	"style": {
		"one": false,
		"mix": "background-blend-mode:normal;background-color:",
		"t1": "#C0C0C0;",
		"t2": "#03B7CD;",
		"t3": "#38B03F;",
		"t4": "#F1A325;",
		"t5": "#EA644A;"
	},
	"defuri": {
		"探险者之剑": "探险者之剑/",
		"饮血魔剑": "饮血魔剑/"
	},
	"olduri": {
		"饮血魔剑": "饮血长枪/"
	}
}
```

| Field | Notes |
|---|---|
| `defuri` | Equipment name → subdirectory (**current** names) |
| `olduri` | Equipment name → subdirectory (**legacy** names, used by the "use old equipment names" toggle) |
| `style.one` | `false` = **one image per quality** (file names carry `_1`–`_5`)<br>`true` = one image, tinted by quality via the background colour |
| `style.mix` | Blend-mode prefix; normally left as-is |
| `style.t1`–`t5` | Background colours for the five qualities (**must end with `;`**) |

> **The trailing semicolon in colour values is mandatory.** It is concatenated into
> `background-color:#EA644A;background-image:url(...)`; without it the whole CSS
> declaration is discarded by the browser.
> (The `background-blend-mode` part also doubles as the "already replaced" marker.)

### 6.7 `DessertIcons` — dessert (charm) icons

```json
"DessertIcons": {
	"common": "https://example.com/eq/",
	"ext": ".gif",
	"style": {
		"one": true,
		"mix": "background-blend-mode:normal;background-color:",
		"t3": "#38B03F;",
		"t4": "#F1A325;",
		"t5": "#EA644A;"
	},
	"uri": {
		"星铜苹果护身符": "apple",
		"蓝银葡萄护身符": "grape",
		"紫晶樱桃护身符": "melon"
	}
}
```

Similar to `EquipIcons`, except:

- Desserts have **three quality tiers**: `稀有` → `t3`, `史诗` → `t4`, `传奇` → `t5`.
- Quality is derived from the **quality prefix in the item name**, so **all three of
  `t3`/`t4`/`t5` must be present**, otherwise that tier gets no colour.
- With `one: true`, only the background colour changes by quality; `uri` points at
  the image of the item itself.

### 6.8 `ItemIcons` — item icons

```json
"ItemIcons": {
	"common": "https://example.com/items/",
	"ext": ".gif",
	"uri": {
		"体能刺激药水": "powerdrug",
		"苹果核": "fruitcore"
	}
}
```

The simplest of all: `common` + `ext` + `uri`.

### 6.9 Name-replacement components

All three share one structure; `intl` selects whether languages are split:

```json
"EquipThemeName": {
	"intl": true,
	"sc": { "def": { "探险者之剑": "旅人剑" }, "old": { "饮血魔剑": "毁灭之伤冥神枪" } },
	"tc": { "def": { ... }, "old": { ... } },
	"ja": { "def": { ... }, "old": { ... } },
	"en": { "def": { ... }, "old": { ... } }
}
```

- `intl: true` → pick the branch matching the current UI language.
- `intl: false` → only the **`sl`** branch is read (single language):
  ```json
  "ItemThemeName": { "intl": false, "sl": { "苹果核": "玛娜" } }
  ```
- `EquipThemeName` has **`def` (current names) and `old` (legacy names)**;
  `ItemThemeName` / `DessertThemeName` are a flat "original → new" map.

`DessertThemeName` is special: it has two levels, `lv` (quality words) and `name` (item names):

```json
"DessertThemeName": {
	"intl": true,
	"sc": {
		"lv":   { "稀有": "普通的", "史诗": "成熟的", "传奇": "优质的" },
		"name": { "星铜苹果护身符": "苹果", "蓝银葡萄护身符": "葡萄" }
	}
}
```

### 6.10 `CharName` — character name replacement

> Gated by **`COMP.CharThemeName`**, but the data block is named **`CharName`**.

```json
"CharName": {
	"intl": true,
	"sc": { "舞": "可可萝", "默": "镜华" },
	"tc": { "舞": "可可蘿", "默": "鏡華" },
	"ja": { "舞": "コッコロ", "默": "キョウカ" },
	"en": { "舞": "Kokkoro", "默": "Kyouka" }
}
```

---

## 7. Styling and night mode

```json
"Style": {
	"old": "0",
	"dfbacksize": "background-size:100% 100%;",
	"eqbacksize": "background-size:100% 100%;",
	"day":   { "bgcr": "", "textcr": "" },
	"night": {
		"bgcr": "#141414",
		"textcr": "#b8b8b8",
		"panelcr": "#1d1d1d",
		"bordercr": "#333333",
		"linkcr": "#4a9eff"
	}
}
```

| Field | Notes |
|---|---|
| `dfbacksize` / `eqbacksize` | The card background `background-size` declaration. **Must be a complete CSS declaration** (property name, value and `;`), e.g. `"background-size:100% 100%;"` |
| `old` | Legacy style marker (string) |
| `day` | Day colours; an empty `""` means "do not override" |
| `night.*` | Night colours: page background, text, panel, border, link |

> **`dfbacksize` / `eqbacksize` are whole declarations, not values.**
> Writing `"100% 100%"` produces a broken `background-size:100% 100%` concatenation,
> which breaks icon backgrounds and quality borders. **Copy the reference pack's form.**

The five night colours: `bgcr` (page background), `textcr` (text), `panelcr` (panel),
`bordercr` (border), `linkcr` (link).

---

## 8. Naming and path rules

### URL formula

```
full URL  =  common  +  uri[key]  +  file name  +  ext
```

### Three hard requirements

1. **`common` must end with `/`**
2. **Each `uri[key]` subdirectory should also end with `/`** (or be empty to place files directly under `common`)
3. The file name **has no extension** (the extension comes from `ext`)

### Examples

| Purpose | common | uri | file | ext | Result |
|---|---|---|---|---|---|
| Character CG | `https://a.com/cg/` | `mo/` | `3` | `.png` | `https://a.com/cg/mo/3.png` |
| Equipment icon | `https://a.com/eq/` | `饮血魔剑/` | `1` | `.gif` | `https://a.com/eq/饮血魔剑/1.gif` |
| Kanban musume | `https://a.com/cg/` | `mo/` | `2` | `.png` | `https://a.com/cg/mo/2.png` |

### About keys

The keys of `uri` / `defuri` / `conf` **must be the game's internal names**
(a theme pack performs no reverse matching):

- Character keys: `舞`, `默`, `琳`, `艾`, `梦`, `薇`, `伊`, `冥`, `命`, `希`, `霞`, `雅`, `绮`
- Equipment/item/dessert keys: the **full original Chinese name**, e.g. `探险者之剑`, `星铜苹果护身符`

> These keys are **language-independent** — the game indexes by its internal Chinese
> names; UI translation is a display-layer concern.

---

## 9. Full example walkthrough (PCR)

`PCR_v0.1.0.GuThemePack` enables **all 14 components** and works as an "everything on" reference.

### Key metadata

```json
"INF": {
	"UID": "pcrtheme",
	"Name": { "sc": "公主连结R", "tc": "公主連結R", "ja": "プリコネR", "en": "PCReDive" },
	"Ver": [0, 1, 0],
	"Build": 261003001
}
```

### Scale of each component

| Component | Scale |
|---|---|
| `CharTachie` | 13 characters × 6 uses (uri/HeadFG/LeftFG/CG/LeftPKFG/RightPKFG) |
| `MobsTachie` | 8 mobs |
| `ImageKanban` | 13 characters × 3 states, `resize: "64"` |
| `SpineKanban` | 14 `conf` entries (including `fallback`), 15 animation options |
| `CharSounds` | 2 system cues (`on`/`off`) + 13 characters × 10 event types |
| `EquipIcons` | 30 equipment pieces, `defuri` + `olduri` (6 with legacy names) |
| `ItemIcons` | 10 items |
| `DessertIcons` | 3 desserts, `one: true` with three quality colours |
| Name replacement | Equipment / item / dessert / **character** — all four, all four languages |
| `Style` | day left empty; 5 night colours |

### Patterns worth copying

**① One character key reused across every component** — consistency saves effort:

```
CharTachie.uri["默"]   = "mo/"     → cg/mo/3.png  (CG)
ImageKanban.uri["默"]  = "mo/"     → cg/mo/2.png  (Kanban idle)
SpineKanban.conf["默"] = { uri: "mo/", type: "7", ... }
CharSounds.uri["默"]   = "mo/"     → vo/mo/win.mp3
CharSounds.conf["默"]  = { click: ["0","1","2","3"], ... }
CharName["默"]         = { sc: "镜华", ja: "キョウカ", ... }
```

**② All three quality colours present** (desserts):

```json
"style": { "one": true, "mix": "background-blend-mode:normal;background-color:",
           "t3": "#38B03F;", "t4": "#F1A325;", "t5": "#EA644A;" }
```

**③ Per-character Spine placement values**:

```json
"默": { "uri": "mo/", "type": "7", "hasRarity6": true, "wi": -350, "hi": -42, "re": 0.8 }
```

---

## 10. Validation checklist and common errors

### Pre-flight checklist

- [ ] File is **UTF-8 without BOM** and contains no `�` anywhere
- [ ] JSON **is syntactically valid** (validate it in your editor / a linter; **no comments**)
- [ ] `INF.UID`, `INF.Name`, `INF.Ver` (3 numbers) and `INF.COMP` are present
- [ ] All 14 `COMP` keys are written out explicitly
- [ ] Every `common` **ends with `/`**
- [ ] Every `style.t*` colour **ends with `;`**
- [ ] `dfbacksize` / `eqbacksize` are **complete CSS declarations**
- [ ] If using `CharThemeName`, the data block is named **`CharName`**
- [ ] The `SpineKanban` field is **`assest`** (not `asset`)
- [ ] `SpineKanban.conf.fallback` exists
- [ ] `ImageKanban`'s `idle`/`win`/`lose` cover **every** character in `uri`
- [ ] `Ver` is **greater** than the previous release
- [ ] Image extensions match the real files (don't mix up `.png` / `.gif`)

### Symptom → cause

| Symptom | Cause |
|---|---|
| Encoding error on install | Not UTF-8, or contains `�` |
| Nothing happens / "not a theme pack" | JSON syntax error, or missing `INF.UID` / `INF.COMP` |
| Version shows as `0.0.0` | `INF.Ver` is not a 3-element array |
| All icons the same colour | `style.t3/t4/t5` missing, or colours **lack the trailing `;`** |
| Icon background/border broken | `dfbacksize` / `eqbacksize` written as a *value* instead of a *declaration* |
| Character names not replaced | `COMP` says `CharName` (should be `CharThemeName`), or the block is named `CharThemeName` |
| One Spine character missing | `conf` lacks that character and `fallback`; or `type` class is wrong |
| Spine Kanban entirely broken | Field written as `asset` (should be `assest`) |
| Some Image-Kanban states blank | `idle`/`win`/`lose` do not cover all characters |
| Images 404 | `common` missing its trailing `/`, or a `uri` subdirectory missing `/` |
| No voice | `conf` lacks that character, or `click` is not an array |
| Adding `//` comments breaks the file | JSON **does not support comments** (the reference pack has none) |

---

## 11. Suggested workflow

1. **Start with the skeleton**: write only `INF`, confirm it installs and appears in the theme list.
2. **Enable one component at a time**: add, install, observe — avoid debugging many things at once.
3. **Few images first**: get 1–2 characters working to prove your path rules, then fill in the rest.
4. **Keep keys consistent**: reuse the same character keys across components to reduce typos.
5. **Tune Spine `wi`/`hi`/`re` against the screen**: copy the `fallback` values first, then adjust per character.
6. **Bump the version** on every change so you can compare and roll back.
7. **Keep a known-good backup** so you can switch back instantly when something breaks.

### Debugging tips

- When an image does not show, **open the assembled URL directly in a browser** — that
  immediately separates "wrong path" from "component not active".
- Theme features are toggled **individually** in the settings panel ("use theme
  equipment/item names", "use theme character names", "character art", …). If an effect
  is missing, first check that its toggle is on.
- Equipment icon tinting also depends on the "use old equipment names" toggle (`olduri`).

---

## 12. Known non-functional fields

So you don't write something that silently does nothing:

| Field | Status |
|---|---|
| `COMP.MobsThemeName` | **Not implemented in the current version.** The key is accepted (no error), but the manager **never reads any data for it**. For mob art, use `COMP.MobsTachie` with `MobsTachie`. |

> Background: `MobsThemeName` appears only in the component whitelist; no code consumes
> it, so setting it to `true` has no effect.

---

## Appendix: field-name quick reference

| What you want | Correct field | Easy to write by mistake |
|---|---|---|
| Image Kanban assets | `asset` | ~~assest~~ |
| Spine Kanban assets | **`assest`** | ~~asset~~ |
| Character-name data block | **`CharName`** | ~~CharThemeName~~ |
| Character-name switch | **`COMP.CharThemeName`** | ~~COMP.CharName~~ |
| Equipment legacy names | `olduri` | ~~old~~ |
| Dessert quality colours | `style.t3/t4/t5` | ~~style.t1/t2~~ |
