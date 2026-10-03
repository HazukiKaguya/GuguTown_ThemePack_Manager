# 咕咕镇主题包管理器 4.x 自定义主题包开发说明

适用版本：**GuguTown ThemePack Manager 4.0.1**
参照范例：**`PCR_v0.1.0.GuThemePack`**（公主连结R，已验证通过全部校验）

---

## 目录

1. [主题包是什么](#1-主题包是什么)
2. [文件格式与命名](#2-文件格式与命名)
3. [最小可用骨架](#3-最小可用骨架)
4. [`INF` 基本信息](#4-inf-基本信息)
5. [组件总览](#5-组件总览)
6. [各组件字段详解](#6-各组件字段详解)
7. [样式与夜间模式](#7-样式与夜间模式)
8. [命名与路径规则](#8-命名与路径规则)
9. [完整范例解析（PCR）](#9-完整范例解析pcr)
10. [校验清单与常见错误](#10-校验清单与常见错误)
11. [开发流程建议](#11-开发流程建议)
12. [已知不生效字段](#12-已知不生效字段)

---

## 1. 主题包是什么

主题包是一个 **JSON 文件**，用来替换游戏《咕咕镇》的以下内容：

| 类别 | 能替换什么 |
|---|---|
| **图片** | 角色立绘、CG、头像、怪物立绘、装备/物品/护符图标、看板娘 |
| **音频** | 角色语音（点击、升级、胜利、失败…） |
| **文字** | 角色名、装备名、物品名、护符名 |
| **样式** | 网页配色、夜间模式配色、图标背景尺寸、看板娘外观 |

管理器读取主题包后，按当前页面**动态替换**这些资源，不需要修改游戏本体的任何文件。

---

## 2. 文件格式与命名

### 2.1 编码（**最重要的一条**）

- 必须是 **UTF-8**
- **不要带 BOM**
- 文件内**不能出现** `�`（U+FFFD 替换字符）

> 管理器会先扫描整个文件，一旦发现 `�` 就**直接拒绝安装**并提示编码错误。
> 这是为了拦住"用 GBK 保存了中文"这类导致全篇乱码的情况。
> 编辑器里请选择「UTF-8（无 BOM）」。

### 2.2 扩展名

推荐 `.GuThemePack`。管理器安装对话框同时接受 `.guthemepack` 与 `.json`。

### 2.3 文件命名建议

```
<主题标识>_v<主>.<次>.<修订>.GuThemePack
```

例如 `PCR_v0.1.0.GuThemePack`。

> 文件名只是给人看的，**管理器只认文件内部的 `INF.UID` 与 `INF.Ver`**。
> `INF.Ver` 用来判断版本新旧，请务必随每次发布递增。

---

## 3. 最小可用骨架

只要满足下面这些，就是一个能被识别、能安装的主题包：

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

**必填只有 `INF` 下的四项**：`UID`、`Name`、`Ver`、`COMP`。

其余组件按需增加。**建议把 `COMP` 里全部 14 个键都显式写出**（用 `true`/`false`），
这样一眼就能看出这个主题包启用了哪些功能。

> 组件开关的判定规则：`COMP` 里的键会被强制转成布尔值
> （`t.INF.COMP[k] = !!t.INF.COMP[k]`），所以写 `1`、`"true"`、`"checked"`
> 之类都能生效，但**建议统一写 `true` / `false`**。

---

## 4. `INF` 基本信息

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `UID` | 字符串 | ✅ | 主题包唯一标识。**不可与内置主题重复**，建议全小写英文 |
| `Name` | 对象 | ✅ | 显示名，含 `sc`/`tc`/`ja`/`en` 四种语言 |
| `Ver` | 数组 | ✅ | 版本号，**必须是 3 个数字**：`[主, 次, 修订]` |
| `Build` | 数字 | 建议 | 构建号，建议用日期式 `261003001`（26年10月03日 第001次） |
| `COMP` | 对象 | ✅ | 组件开关表，见下 |

### `Name` 的语言回退

四种语言**建议全部提供**。若缺某种语言，会回退到 `sc`；若连 `sc` 都没有，则回退到 `UID`。

### `Ver` 的作用

管理器的**主题包列表用它排序**。请随版本递增，否则新版可能被识别为旧版。

> ⚠️ `Ver` 必须是长度 3 的数组。写成 `[1, 0]` 或 `"1.0.0"` 会被重置为 `[0, 0, 0]`。

### `UID` 的作用（**不要随意改**）

- 玩家的**当前选择**记录的是 `UID`，改掉会导致"当前主题"失效；
- 安装记录、卸载列表也以 `UID` 为准；
- 若要发布一个"全新"主题，才使用新 `UID`；仅是版本更新请**保持 `UID` 不变**。

---

## 5. 组件总览

`COMP` 的 14 个键及其作用：

| 键 | 作用 | 依赖的数据块 |
|---|---|---|
| `CharTachie` | 角色立绘/CG/头像 | `CharTachie` |
| `MobsTachie` | 怪物立绘 | `MobsTachie` |
| `ImageKanban` | 图片看板娘 | `ImageKanban` |
| `SpineKanban` | Spine（骨骼动画）看板娘 | `SpineKanban` |
| `CharSounds` | 角色语音 | `CharSounds` |
| `EquipIcons` | 装备图标 | `EquipIcons` |
| `ItemIcons` | 物品图标 | `ItemIcons` |
| `DessertIcons` | 护符图标 | `DessertIcons` |
| `EquipThemeName` | 装备名称替换 | `EquipThemeName` |
| `ItemThemeName` | 物品名称替换 | `ItemThemeName` |
| `DessertThemeName` | 护符名称替换 | `DessertThemeName` |
| `CharThemeName` | 角色名称替换 | `CharName` ⚠️ 注意键名不同 |
| `MobsThemeName` | —（见 [§12](#12-已知不生效字段)） | — |
| `Style` | 配色与外观 | `Style` |

> **注意**：`CharThemeName` 的数据块叫 **`CharName`**，不是 `CharThemeName`。
> 这是历史命名，写错了角色名不会生效。

### 安装时的组件可用性提示

安装后会检查三项，不满足会弹提示（**但不会阻止安装**）：

| 条件 | 提示 |
|---|---|
| `CharTachie`、`ImageKanban`、`SpineKanban` **全为 false** | 无立绘/看板可用 |
| `SpineKanban` 为 false | 该主题 Spine 看板娘不可用 |
| `CharSounds` 为 false | 该主题主题语音不可用 |

---

## 6. 各组件字段详解

### 6.1 `CharTachie` 角色立绘

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

| 字段 | 说明 |
|---|---|
| `common` | URL 前缀（**必须以 `/` 结尾**） |
| `ext` | 扩展名，默认 `.png` |
| `uri` | **角色键 → 子目录**。角色键即游戏内部名（`默`、`琳`…） |
| `HeadFG` | 头像图文件名（角色列表、卡片列表） |
| `LeftFG` | 左侧立绘（角色详情页） |
| `CG` | 角色 CG（详情页大图） |
| `LeftPKFG` | 战斗页**左侧**（我方）立绘 |
| `RightPKFG` | 战斗页**右侧**（敌方）立绘 |

**最终 URL 拼法**：

```
common + uri[角色] + 对应表[角色] + ext
```

以 PCR 的 `默` 为例：

```
https://p.inari.site/guguicons/test/cg/  +  mo/  +  3  +  .png
= https://p.inari.site/guguicons/test/cg/mo/3.png     ← CG
= https://p.inari.site/guguicons/test/cg/mo/1.png     ← 头像
= https://p.inari.site/guguicons/test/cg/mo/2.png     ← 左侧立绘
```

> 六个表**互相独立**，可以自由决定用 `1/2/3` 还是 `head/cg/left` 之类的名字。
> 只填 `uri` 不填某个表，该用途就不替换（保持游戏原样）。

### 6.2 `MobsTachie` 怪物立绘

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

结构最简单：只有 `common` / `ext` / `uri`。

> `uri` 的键**照抄游戏内部名**即可（范例里带 `（野怪` 后缀，是游戏自身的命名，保留原样最稳）。

### 6.3 `ImageKanban` 图片看板娘

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

| 字段 | 说明 |
|---|---|
| `bg` | 鼠标悬停时显示的背景图；缺省会回退到 `Style.kanbanbg` 或内置图 |
| `asset.common` / `asset.ext` | 与 `CharTachie` 同构的 URL 前缀/扩展名 |
| `asset.resize` | **立绘占画布的百分比**（如 `"64"` 表示 64%）。建议 40–70 |
| `uri` | 角色键 → 子目录 |
| `idle` / `win` / `lose` | 待机 / 胜利 / 失败 三种状态的图文件名 |

`idle`/`win`/`lose` **三张表必须都覆盖 `uri` 里出现的每一个角色**，
否则该角色在某些状态下会解析失败（不显示或 404）。

> `resize` 是字符串或数字都可以，直接内插进 CSS 的 `width/height` 百分比。
> 立绘用 `object-fit: contain` 等比缩放，**不会溢出画布**。

### 6.4 `SpineKanban` Spine 看板娘（最复杂）

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

> ⚠️ 注意字段名是 **`assest`**（历史拼写错误），**不是** `asset`。
> `ImageKanban` 用的是正确的 `asset`，两者不同，容易写错。

#### `assest` 各字段

| 字段 | 说明 |
|---|---|
| `common` | 通用骨架前缀 |
| `unit` | 单位资源前缀（贴图、技能） |
| `ext` | 骨架扩展名，一般 `.cysp` |
| `type` | 职介战斗骨架文件名 |
| `skeleton` | 角色基础骨架文件名 |
| `skill` | 技能骨架文件名 |
| `default` | 默认皮肤名 |
| `baseId` | 基础单位 ID（通常 `000000`） |
| `substr` / `sep` | 动画名拼接控制（一般不用改） |
| `texture.pos` / `texture.img` | 贴图图集与图片文件名 |
| `addAnimations` | 额外动画名列表（拼接成选项） |
| `optionList` | 动画下拉框的 `[显示名, 动画名]` 列表 |
| `idleCheck` | 判定"是否闲置"的动画名集合 |
| `anim` | **特殊动作映射**，见下 |

#### `anim` 特殊动作

| 键 | 说明 |
|---|---|
| `click` | 点击看板娘时播放 |
| `multi_standBy` | 合作（multi）待机 |
| `_idle` | 闲置后缀 |
| `stop` / `hold` | 停止 / 停留 |
| `win` | 胜利时的动作查询（选择器字符串） |
| `lose` | 失败时播放的动画**数组** |

#### `conf` 每角色配置

| 字段 | 说明 |
|---|---|
| `uri` | 该角色的资源子目录 |
| `type` | **职介类型**（对应 `ys/icon` 的职介编号，如 `1`=剑、`7`=杖…） |
| `hasRarity6` | 是否有 6 星（影响加载的骨架） |
| `wi` / `hi` | 水平 / 垂直**位置微调**（负数往左/下） |
| `re` | 缩放系数（`0.8`~`1.0` 常用） |

> **`conf.fallback` 必须提供**：当某角色没有单独配置时作为兜底。
> `wi`/`hi`/`re` 是**逐个角色调出来的**，需要对着游戏画面慢慢试。

### 6.5 `CharSounds` 角色语音

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

- `uri` 里除了各角色，还要有 **`on` / `off`**（音效开关提示音）；
- `conf[角色]` 描述各事件的音频文件名；
- **`click` 是数组**，点击时在多个音频中随机/顺序播放；其余是单个字符串；
- `conf` 里的角色若缺项，该角色语音不替换。

#### 事件一览

| 键 | 触发时机 |
|---|---|
| `click` | 点击看板娘（数组） |
| `levelup` | 升级 |
| `colle` | 收集/获得 |
| `change` | 切换 |
| `power` | 强化 |
| `win` / `lose` | 战斗胜利 / 失败 |
| `reset` | 重置 |
| `exp` | 经验 |
| `battle` | 进入战斗 |

### 6.6 `EquipIcons` 装备图标

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

| 字段 | 说明 |
|---|---|
| `defuri` | 装备名 → 子目录（**当前名称**） |
| `olduri` | 装备名 → 子目录（**旧版名称**，供「使用旧版装备名」开关使用） |
| `style.one` | `false` = **每个品质一张图**（文件名带 `_1`~`_5`）<br>`true` = 一张图 + 按品质改背景色 |
| `style.mix` | 混合模式前缀，一般不用改 |
| `style.t1`~`t5` | 五个品质的背景色（**必须以 `;` 结尾**） |

> **颜色值末尾的分号不能省**：它会被拼进 `background-color:#EA644A;background-image:url(...)`，
> 少了分号整条 CSS 声明会被浏览器丢弃。
> （`background-blend-mode` 那部分同时也是"防止重复替换"的标记。）

### 6.7 `DessertIcons` 护符图标

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

与 `EquipIcons` 类似，但：

- 护符只有**三档品质**：`稀有` → `t3`、`史诗` → `t4`、`传奇` → `t5`；
- 品质取自**角色名/道具名的品质前缀**，因此 `t3`/`t4`/`t5` **三者都要给**，
  否则对应品质会没有颜色；
- `one: true` 时只按品质改背景色，`uri` 对应的是"道具本身的图"。

### 6.8 `ItemIcons` 物品图标

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

最简单：`common` + `ext` + `uri`。

### 6.9 名称替换组件

三个结构相同，`intl` 控制是否分语言：

```json
"EquipThemeName": {
	"intl": true,
	"sc": { "def": { "探险者之剑": "旅人剑" }, "old": { "饮血魔剑": "毁灭之伤冥神枪" } },
	"tc": { "def": { ... }, "old": { ... } },
	"ja": { "def": { ... }, "old": { ... } },
	"en": { "def": { ... }, "old": { ... } }
}
```

- `intl: true` → 按当前界面语言取对应分支；
- `intl: false` → 只读 **`sl`** 分支（单一语言）：
  ```json
  "ItemThemeName": { "intl": false, "sl": { "苹果核": "玛娜" } }
  ```
- `EquipThemeName` 有 **`def`（当前名）与 `old`（旧名称）** 两组；
  `ItemThemeName` / `DessertThemeName` 只有一层「原名 → 新名」。

`DessertThemeName` 特殊，分 `lv`（品质词）与 `name`（道具名）两层：

```json
"DessertThemeName": {
	"intl": true,
	"sc": {
		"lv":   { "稀有": "普通的", "史诗": "成熟的", "传奇": "优质的" },
		"name": { "星铜苹果护身符": "苹果", "蓝银葡萄护身符": "葡萄" }
	}
}
```

### 6.10 `CharName` 角色名替换

> 由 **`COMP.CharThemeName`** 控制，但数据块名是 **`CharName`**。

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

## 7. 样式与夜间模式

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

| 字段 | 说明 |
|---|---|
| `dfbacksize` / `eqbacksize` | 卡片背景的 `background-size` 声明。**必须写成完整的 CSS 声明**（含属性名与 `;`），如 `"background-size:100% 100%;"` |
| `old` | 旧版样式标记（字符串） |
| `day` | 日间配色；留空 `""` 表示不覆盖 |
| `night.*` | 夜间配色：页面背景、文字、面板、边框、链接 |

> **`dfbacksize` / `eqbacksize` 是"整条声明"而不是值**。
> 写成 `"100% 100%"` 会产生 `background-size:100% 100%` 这种错误拼接，
> 导致图标背景/品质边框失效。**照抄范例的写法最稳。**

夜间配色五项：`bgcr`（页面背景）、`textcr`（文字）、`panelcr`（面板）、
`bordercr`（边框）、`linkcr`（链接）。

---

## 8. 命名与路径规则

### URL 拼接公式

```
完整 URL  =  common  +  uri[键]  +  文件名  +  ext
```

### 三条硬性要求

1. **`common` 必须以 `/` 结尾**
2. **`uri[键]` 内部的子目录也建议以 `/` 结尾**（或留空表示直接放在 `common` 下）
3. 文件名**不带扩展名**（扩展名由 `ext` 统一给出）

### 示例

| 目的 | common | uri | 文件名 | ext | 结果 |
|---|---|---|---|---|---|
| 角色 CG | `https://a.com/cg/` | `mo/` | `3` | `.png` | `https://a.com/cg/mo/3.png` |
| 装备图标 | `https://a.com/eq/` | `饮血魔剑/` | `1` | `.gif` | `https://a.com/eq/饮血魔剑/1.gif` |
| 看板娘 | `https://a.com/cg/` | `mo/` | `2` | `.png` | `https://a.com/cg/mo/2.png` |

### 关于键名

`uri` / `defuri` / `conf` 等映射表的**键必须是游戏内部名**（主题包不做反向匹配）：

- 角色键：`舞`、`默`、`琳`、`艾`、`梦`、`薇`、`伊`、`冥`、`命`、`希`、`霞`、`雅`、`绮`
- 装备/物品/护符键：**中文原名的完整名称**，如 `探险者之剑`、`星铜苹果护身符`

> 这些键**不受语言影响** —— 游戏用内部中文名做索引，界面上的翻译是显示层的事。

---

## 9. 完整范例解析（PCR）

`PCR_v0.1.0.GuThemePack` 启用了**全部 14 个组件**，可作为"全功能"参考。

### 关键信息

```json
"INF": {
	"UID": "pcrtheme",
	"Name": { "sc": "公主连结R", "tc": "公主連結R", "ja": "プリコネR", "en": "PCReDive" },
	"Ver": [0, 1, 0],
	"Build": 261003001
}
```

### 各组件规模一览

| 组件 | 规模 |
|---|---|
| `CharTachie` | 13 角色 × 6 种用途（uri/HeadFG/LeftFG/CG/LeftPKFG/RightPKFG） |
| `MobsTachie` | 8 种怪物 |
| `ImageKanban` | 13 角色 × 3 状态，`resize: "64"` |
| `SpineKanban` | 14 条 `conf`（含 `fallback`），15 项动画选项 |
| `CharSounds` | 2 个系统音（`on`/`off`）+ 13 角色 × 10 类事件 |
| `EquipIcons` | 30 件装备，`defuri` + `olduri`（6 件有旧名） |
| `ItemIcons` | 10 种物品 |
| `DessertIcons` | 3 种护符，`one: true` + 三档品质色 |
| 名称替换 | 装备/物品/护符/**角色名** 四套，全部四语言 |
| `Style` | 日间留空、夜间 5 项配色 |

### 可以直接借鉴的写法

**① 同一角色键贯穿所有组件** —— 保持一致最省事：

```
CharTachie.uri["默"]   = "mo/"     → cg/mo/3.png  (CG)
ImageKanban.uri["默"]  = "mo/"     → cg/mo/2.png  (看板娘 idle)
SpineKanban.conf["默"] = { uri: "mo/", type: "7", ... }
CharSounds.uri["默"]   = "mo/"     → vo/mo/win.mp3
CharSounds.conf["默"]  = { click: ["0","1","2","3"], ... }
CharName["默"]         = { sc: "镜华", ja: "キョウカ", ... }
```

**② 品质色三档齐全**（护符）：

```json
"style": { "one": true, "mix": "background-blend-mode:normal;background-color:",
           "t3": "#38B03F;", "t4": "#F1A325;", "t5": "#EA644A;" }
```

**③ 每个角色都调过的 Spine 位置参数**：

```json
"默": { "uri": "mo/", "type": "7", "hasRarity6": true, "wi": -350, "hi": -42, "re": 0.8 }
```

---

## 10. 校验清单与常见错误

### 提交前自检

- [ ] 文件是 **UTF-8 无 BOM**，全文搜索不到 `�`
- [ ] JSON **语法合法**（用编辑器/在线工具校验一遍；**不要写注释**）
- [ ] `INF.UID`、`INF.Name`、`INF.Ver`（3 个数字）、`INF.COMP` 都在
- [ ] `COMP` 里 14 个键建议全部显式写出
- [ ] 所有 `common` **以 `/` 结尾**
- [ ] `style.t*` 颜色**以 `;` 结尾**
- [ ] `dfbacksize` / `eqbacksize` 是**完整 CSS 声明**
- [ ] 用了 `CharThemeName` 时，数据块名写的是 **`CharName`**
- [ ] `SpineKanban` 的字段名是 **`assest`**（不是 `asset`）
- [ ] `SpineKanban.conf.fallback` 存在
- [ ] `ImageKanban` 的 `idle`/`win`/`lose` 覆盖了 `uri` 里**全部**角色
- [ ] `ver` 比上一版**递增**
- [ ] 图片扩展名与实际文件一致（`.png` / `.gif` 别写错）

### 常见错误对照

| 现象 | 原因 |
|---|---|
| 安装时提示编码错误 | 文件不是 UTF-8，或含 `�` |
| 安装无反应 / 报不是主题包 | JSON 语法错误，或缺 `INF.UID` / `INF.COMP` |
| 版本显示为 `0.0.0` | `INF.Ver` 不是 3 元素数组 |
| 图标全部变成同一颜色 | `style.t3/t4/t5` 缺项，或颜色值**漏了结尾分号** |
| 图标背景/边框错乱 | `dfbacksize` / `eqbacksize` 写成了"值"而不是"完整声明" |
| 角色名没被替换 | `COMP` 写的是 `CharName`（应为 `CharThemeName`），或数据块名写成了 `CharThemeName` |
| Spine 看板娘某角色不显示 | `conf` 缺该角色且 `fallback` 也缺；或 `type` 职介填错 |
| Spine 看板娘整体异常 | 字段名写成了 `asset`（应为 `assest`） |
| 图片看板娘某些状态空白 | `idle`/`win`/`lose` 未覆盖全部角色 |
| 图片 404 | `common` 末尾漏 `/`，或 `uri` 子目录漏 `/` |
| 语音不播放 | `conf` 缺该角色，或 `click` 未写成数组 |
| JSON 里加了 `//` 注释导致失败 | JSON **不支持注释**（范例里也没有） |

---

## 11. 开发流程建议

1. **先搭骨架**：只写 `INF`，确认能安装、能出现在主题选择列表里；
2. **逐个组件开**：一次只加一个组件，装上去看效果，避免一次排错太多；
3. **图片先少后多**：先做 1~2 个角色跑通路径规则，再批量补全；
4. **命名统一**：角色键在各组件间保持一致，减少手误；
5. **Spine 的 `wi`/`hi`/`re` 要对画面调**：建议先复制 `fallback` 的值，再逐个微调；
6. **版本递增**：每次改动都递增 `INF.Ver`，方便回退对比；
7. **保留一份"已知可用"的备份**：出问题时能立刻切回去。

### 调试小技巧

- 图片不显示时，**直接在浏览器里打开拼出来的 URL**，能立刻区分是"路径错"还是"组件没生效"；
- 主题的启用开关是**逐项**的（设置面板里「使用主题装备/物品名称」「使用主题角色名」「角色立绘」等），
  某个效果没出来时，先确认**对应的开关是否已打开**；
- 装备图标是否改色，还受「使用旧版装备名」开关影响（`olduri`）。

---

## 12. 已知不生效字段

为避免你按文档写了却没反应，这里明确列出：

| 字段 | 状态 |
|---|---|
| `COMP.MobsThemeName` | **当前版本未实现**：该键被接受（不会报错），但管理器**不会读取任何数据**。怪物立绘请用 `COMP.MobsTachie` + `MobsTachie`。 |

> 保留说明：`MobsThemeName` 只出现在组件白名单里，代码中没有任何消费它的逻辑，
> 因此即使设为 `true` 也没有效果。

---

## 附：字段命名速查

| 你想写的 | 正确字段 | 容易写错成 |
|---|---|---|
| 图片看板娘资源 | `asset` | ~~assest~~ |
| Spine 看板娘资源 | **`assest`** | ~~asset~~ |
| 角色名数据块 | **`CharName`** | ~~CharThemeName~~ |
| 角色名开关 | **`COMP.CharThemeName`** | ~~COMP.CharName~~ |
| 装备名（旧名） | `olduri` | ~~old~~ |
| 护符品质色 | `style.t3/t4/t5` | ~~style.t1/t2~~ |
