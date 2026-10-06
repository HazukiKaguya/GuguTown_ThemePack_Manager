// ==UserScript==
// @name        GuguTown ThemePack Manager
// @name:zh-CN  咕咕镇主题包管理器
// @name:zh-TW  咕咕鎮主題包管理器
// @name:ja     咕咕镇テーマパックマネージャー
// @namespace   https://github.com/HazukiKaguya/GuguTown_ThemePack
// @homepage    https://github.com/HazukiKaguya/GuguTown_ThemePack
// @version     4.0.3
// @description WebGame GuguTown ThemePack Mannager.
// @description:zh-CN 气人页游 咕咕镇 主题包管理器。
// @description:zh-TW 氣人頁遊 咕咕鎮 主題包管理器。
// @description:ja オンラインゲーム 咕咕镇 テーマパック マネージャー。
// @icon        https://sticker.inari.site/favicon.ico
// @author      Hazuki Kaguya
// @copyright   2022- Hazukikaguya
// @match       https://*.guguzhen.com/*
// @match       https://*.momozhen.com/*
// @run-at      document-end
// @require     https://update.greasyfork.org/scripts/450822/1098282/spine-webgl.js
// @require     https://update.greasyfork.org/scripts/598975/1953300/gt-spine-kanban.js
// @downloadURL https://github.com/HazukiKaguya/GuguTown_ThemePack_Manager/raw/main/GuguTown_ThemePack_Manager.user.js
// @updateURL   https://github.com/HazukiKaguya/GuguTown_ThemePack_Manager/raw/main/GuguTown_ThemePack_Manager.user.js
// @license     MIT License
// @grant       none
// ==/UserScript==
/* eslint-env jquery */
'use strict';
if (window.location.pathname.indexOf('php') == -1 && window.location.pathname != '/') {
    return;
};

/*
  插件基础资产
  Basic Assets
*/
let PluginVersion = '4.0.3-dev1', timeCheck = new Date().getTime(), LAConf, User;
const nullimg = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==',
    defConf = {
        "ThemePack": "testmain001",
        "IconSize": "50",
        "KanbanSize": "100",
        "OldName": "checked",
        "ThemeName": "checked",
        "CharName": "checked",
        "OriName": "checked",
        "AutoNight": "checked",
        "NightMode": "",
        "MobileLayout": "",
        "ForceEquippedKanban": "checked",
        "Kanban": "checked",
        "AIKanban": "",
        "CharFGCG": "checked",
        "DetailCG": "checked",
        "Voice": "checked",
        "Ver": "4.0.0",
        "NowCard": "舞",
        "NowEquip": 0
    },
    langConf = {
        "language": "sc",
        "sc": {
            "title": "语言设置",
            "name": "简体中文"
        },
        "tc": {
            "title": "語言設置",
            "name": "繁體中文"
        },
        "ja": {
            "title": "語言設置",
            "name": "日本語"
        },
        "en": {
            "title": "Languages",
            "name": "English"
        },
    },
    lang = {
        "sc": {
            "menu": {
                "Title": "主题包管理器设置",
                "Theme": "选择要使用的主题包",
                "Themes": {
                    "Classic": "经典",
                    "Original": "原生",
                    "testmain001": "测试"
                },
                "OldName": "使用旧版装备名",
                "ThemeName": "使用主题装备/物品名称",
                "CharName": "使用主题角色名",
                "OriName": "标注原始装备名(使用主题名称时)",
                "CharFGCG": "角色立绘",
                "DetailCG": "角色详情页显示CG",
                "Kanban": "看板娘",
                "ForceEquippedKanban": "强制上阵角色为看板娘",
                "AIKanban": "总使用图片看板娘",
                "Voice": "主题语音",
                "IconSize": "仓库装备图标大小设置",
                "KanbanSize": "看板娘大小设置",
                "AutoNight": "自动夜间模式",
                "NightMode": "夜间模式",
                "FollowBrowser": "跟随系统夜间模式",
                "MobileLayout": "移动视图样式",
                "UsrInstall": "上传自定义主题安装文件",
                "UsrUninstall": "卸载已安装的自定义主题",
                "MoreThemes": "下面是自定义主题",
                "NoCustom": "暂无已安装的自定义主题",
                "NotSelected": "未选择项目",
                "InstallBtn": "安装"
            },
            "msg": {
                "loadtime": "加载完成/中止，耗时：",
                "unlogin": "用户未登录游戏。",
                "initstop": "当前页面不存在或游戏服务器正在维护，咕咕镇主题包管理器已停止加载。",
                "now": "(当前)",
                "nofgimg": "此自定义主题包立绘功能不可用！",
                "nospine": "此自定义主题包Spine看板娘功能不可用！",
                "novoice": "此自定义主题包语音功能不可用！",
                "preloadTitle": "资源预加载",
                "preload": "预加载",
                "cacheClear": "清缓存",
                "cacheClearAll": "清全部",
                "cacheLoading": "本地缓存：读取中…",
                "cacheEmpty": "本地缓存为空",
                "cacheEntries": "本地缓存 {n} 项 / {size} MB（{themes}）",
                "cacheStorage": "　站点存储 {used}",
                "preloadProgress": "{n}/{total}",
                "preloadDone": "资源预加载完成 {ok}/{total}（可读取 {read}, 仅暖磁盘缓存 {warm}{fail}{miss}{skip}, {secs}s）",
                "preloadFailPart": ", 暖缓存失败 {n}",
                "preloadMissPart": ", 缺失 {n}",
                "preloadSkipPart": ", 跳过 {n}",
                "preloadWarmNote": "另有 {warm} 个资源只进了浏览器磁盘缓存（这类资源服务器不返回 CORS 头，脚本读不到内容，因此存不进本地库）。它们不显示在上面的「本地缓存」统计里，但在 Network 面板里会显示 (disk cache)。",
                "preloadWarmFail": "有 {fail} 个资源暖缓存失败（连接被重置）。下次预加载会自然重试。",
                "preloadErrors": "前几个有问题的资源：",
                "preloadCacheWrite": "本地缓存 写入 {stored}/{tried}（写失败 {putFailed}）",
                "preloadCacheOff": "  [!] 缓存已关闭：{reason}",
                "preloadCacheLastErr": "  最后错误：{err}",
                "preloadNoScope": "没有缓存作用域（主题缺 INF.UID？），只暖了 HTTP 缓存。",
                "preloadNoModule": "看板模块没加载，无法预加载。",
                "preloadNoTheme": "还没有主题，跳过预加载。",
                "preloadNoInventory": "缺少资源清单函数。",
                "preloadInventoryFail": "读取主题资源清单失败。",
                "preloadNothing": "这个主题没有可预加载的资源。",
                "preloadMissing": "有 {n} 个资源服务器上确实没有（主题包声明了但没上传）。",
                "preloadSkipped": "跳过 {n} 个主题未提供的可选资源（装备图标档位等）。",
                "preloadStorageLine": "站点存储用量 {used}（本地库只存能读到的资源；配额远未用满，进不去的原因是 CORS 不是空间）",
                "cacheCleared": "已清除本地资源缓存 {n} 项{which}",
                "cacheClearedTheme": "（主题 {uid}）",
                "cacheClearedAll": "（全部主题）",
                "preloadNote": "首次预加载会把当前主题的全部素材抓进浏览器缓存，JS能读到的素材同时存进本地库（清缓存按钮只清这部分）。"

            },
            "errors": {
                "code": "> Error Code\n    ",
                "info": "\n> Information\n    ",
                "K": {
                    "MA": {
                        "_001": "Theme Kanban Unavailable !"
                    },
                    "SP": {
                        "_001": "WebGL is Unavailable !"
                    }
                },
                "M": {
                    "FG": "此自定义主題包立绘功能不可用！",
                    "VO": "此自定义主题包语音功能不可用！",
                    "SP": "此自定义主题包Spine看板娘功能不可用！",
                    "UOT": "这个主题包数据不是 4.x 架构的 JSON，请更新主题包！",
                    "UNU": "未找到该主题包数据，主题包未启用！",
                    "UBN": "该主题包 UID 与内置主题包冲突，请修改主题包 UID！",
                    "UFG": "此自定义主题包立绘功能不可用！",
                    "UVO": "此自定义主题包语音功能不可用！",
                    "USP": "此自定义主题包Spine看板娘功能不可用！",
                    "DECF": "编码错误或文本包含�，请上传使用 UTF-8 编码的不含�的主题包文件！"
                }
            },
            "dessert": {
                "lv": {
                    "稀有": "稀有",
                    "史诗": "史诗",
                    "传奇": "传奇"
                },
                "name": {
                    "星铜苹果护身符": "星铜苹果护身符",
                    "蓝银葡萄护身符": "蓝银葡萄护身符",
                    "紫晶樱桃护身符": "紫晶樱桃护身符"
                },
            },
            "items": {
                "体能刺激药水": "体能刺激药水",
                "锻造材料箱": "锻造材料箱",
                "灵魂药水": "灵魂药水",
                "随机装备箱": "随机装备箱",
                "宝石原石": "宝石原石",
                "光环天赋石": "光环天赋石",
                "苹果核": "苹果核",
                "蓝锻造石": "蓝锻造石",
                "绿锻造石": "绿锻造石",
                "金锻造石": "金锻造石"
            },
            "equips": {
                "def": {
                    "探险者之剑": "探险者之剑",
                    "探险者短弓": "探险者短弓",
                    "探险者短杖": "探险者短杖",
                    "狂信者的荣誉之刃": "狂信者的荣誉之刃",
                    "反叛者的刺杀弓": "反叛者的刺杀弓",
                    "幽梦匕首": "幽梦匕首",
                    "光辉法杖": "光辉法杖",
                    "荆棘盾剑": "荆棘盾剑",
                    "陨铁重剑": "陨铁重剑",
                    "饮血魔剑": "饮血魔剑",
                    "彩金长剑": "彩金长剑",
                    "清澄长杖": "清澄长杖",

                    "探险者手环": "探险者手环",
                    "命师的传承手环": "命师的传承手环",
                    "秃鹫手环": "秃鹫手环",
                    "海星戒指": "海星戒指",
                    "噬魔戒指": "噬魔戒指",
					"折光戒指": "折光戒指",

                    "探险者铁甲": "探险者铁甲",
                    "探险者皮甲": "探险者皮甲",
                    "探险者布甲": "探险者布甲",
                    "旅法师的灵光袍": "旅法师的灵光袍",
                    "战线支撑者的荆棘重甲": "战线支撑者的荆棘重甲",
                    "复苏战衣": "复苏战衣",
                    "挑战斗篷": "挑战斗篷",

                    "探险者耳环": "探险者耳环",
                    "占星师的耳饰": "占星师的耳饰",
                    "萌爪耳钉": "萌爪耳钉",
                    "猎魔耳环": "猎魔耳环",
					"凶神耳环": "凶神耳环"
                },
                "old": {
                    "荆棘盾剑": "荆棘剑盾",
                    "饮血魔剑": "饮血长枪",
                    "探险者手环": "探险者手套",
                    "秃鹫手环": "秃鹫手套",
                    "复苏战衣": "复苏木甲",
                    "探险者耳环": "探险者头巾",
                    "占星师的耳饰": "占星师的发饰",
                    "萌爪耳钉": "天使缎带"
                }
            },
            "chars": {
                "舞": "舞",
                "默": "默",
                "琳": "琳",
                "艾": "艾",
                "梦": "梦",
                "薇": "薇",
                "伊": "伊",
                "冥": "冥",
                "命": "命",
                "希": "希",
                "霞": "霞",
                "雅": "雅",
				"绮": "绮"
            },
            "mobs": {
                "魔灯之灵（野怪": "魔灯之灵（野怪",
                "六眼飞鱼（野怪": "六眼飞鱼（野怪",
                "铁皮木人（野怪": "铁皮木人（野怪",
                "迅捷魔蛛（野怪": "迅捷魔蛛（野怪",
                "食铁兽（野怪": "食铁兽（野怪",
                "晶刺豪猪（野怪": "晶刺豪猪（野怪",
                "六边形战士（野怪": "六边形战士（野怪",
                "营养均衡的史莱姆（野怪": "营养均衡的史莱姆（野怪"
            }
        },
        "tc": {
            "menu": {
                "Title": "主題包管理器設定",
                "Theme": "選定要使用的主題包",
                "Themes": {
                    "Classic": "經典",
                    "Original": "原生",
                    "testmain001": "測試"
                },
                "OldName": "使用舊版裝備名",
                "ThemeName": "使用主題裝備/物品名稱",
                "OriName": "標註原裝備名(使用主題名稱時)",
                "CharName": "使用主題角色名",
                "CharFGCG": "角色立繪",
                "DetailCG": "角色詳情頁顯示CG",
                "Kanban": "看板娘",
                "ForceEquippedKanban": "強制上陣角色為看板娘",
                "AIKanban": "總使用圖片看板娘",
                "Voice": "主題語音",
                "IconSize": "倉庫裝備圖標大小設定",
                "KanbanSize": "看板娘大小設定",
                "AutoNight": "自動夜間模式",
                "NightMode": "夜間模式",
                "FollowBrowser": "跟隨系統夜間模式",
                "MobileLayout": "移動檢視樣式",
                "UsrInstall": "上傳自定義主題安裝包",
                "UsrUninstall": "卸載已安裝的自定義主題",
                "MoreThemes": "下方是自定義主題",
                "NoCustom": "暫無已安裝的自定義主題",
                "NotSelected": "未選擇項目",
                "InstallBtn": "安裝"
            },
            "msg": {
                "loadtime": "加載完成/中止，耗時：",
                "initstop": "未登入遊戲或遊戲伺服器正在維護，咕咕鎮主題包管理器已停止加載。",
                "now": "(當前)",
                "nofgimg": "此自定義主題包立繪功能不可用！",
                "nospine": "此自定義主題包Spine看板娘功能不可用！",
                "novoice": "此自定義主題包語音功能不可用！",
                "preloadTitle": "資源預載",
                "preload": "預載",
                "cacheClear": "清快取",
                "cacheClearAll": "清全部",
                "cacheLoading": "本地快取：讀取中…",
                "cacheEmpty": "本地快取為空",
                "cacheEntries": "本地快取 {n} 項 / {size} MB（{themes}）",
                "cacheStorage": "　站點儲存 {used}",
                "preloadProgress": "{n}/{total}",
                "preloadDone": "資源預載完成 {ok}/{total}（可讀取 {read}, 僅暖磁碟快取 {warm}{fail}{miss}{skip}, {secs}s）",
                "preloadFailPart": ", 暖快取失敗 {n}",
                "preloadMissPart": ", 缺失 {n}",
                "preloadSkipPart": ", 跳過 {n}",
                "preloadWarmNote": "另有 {warm} 個資源只進了瀏覽器磁碟快取（這類資源伺服器不返回 CORS 標頭，腳本讀不到內容，因此存不進本地快取）。它們不顯示在上面的「本地快取」統計裡，但在 Network 面板裡會顯示 (disk cache)。",
                "preloadWarmFail": "有 {fail} 個資源暖快取失敗（連線被重置）。下次預載會自然重試。",
                "preloadErrors": "前幾個有問題的資源：",
                "preloadCacheWrite": "本地快取 寫入 {stored}/{tried}（寫入失敗 {putFailed}）",
                "preloadCacheOff": "  [!] 快取已關閉：{reason}",
                "preloadCacheLastErr": "  最後錯誤：{err}",
                "preloadNoScope": "沒有快取作用域（主題缺 INF.UID？），只暖了 HTTP 快取。",
                "preloadNoModule": "看板模組未載入，無法預載。",
                "preloadNoTheme": "還沒有主題，跳過預載。",
                "preloadNoInventory": "缺少資源清單函式。",
                "preloadInventoryFail": "讀取主題資源清單失敗。",
                "preloadNothing": "這個主題沒有可預載的資源。",
                "preloadMissing": "有 {n} 個資源伺服器上確實沒有（主題包宣告了但沒上傳）。",
                "preloadSkipped": "跳過 {n} 個主題未提供的可選資源（裝備圖示檔位等）。",
                "preloadStorageLine": "站點儲存用量 {used}（本地快取只存能讀到的資源；配額遠未用滿，進不去的原因是 CORS 不是空間）",
                "cacheCleared": "已清除本地資源快取 {n} 項{which}",
                "cacheClearedTheme": "（主題 {uid}）",
                "cacheClearedAll": "（全部主題）",
                "preloadNote": "首次預載會把當前主題的全部素材抓進瀏覽器快取，JS能讀到的素材同時存進本地快取（清快取按鈕只清這部分）。"

            },
            "errors": {
                "code": "> Error Code\n    ",
                "info": "\n> Information\n    ",
                "K": {
                    "MA": {
                        "_001": "Theme Kanban is Unavailable !"
                    },
                    "SP": {
                        "_001": "WebGL is Unavailable !"
                    }
                },
                "M": {
                    "FG": "此自定義主題包立繪功能不可用！",
                    "VO": "此自定義主題包語音功能不可用！",
                    "SP": "此自定義主題包Spine看板娘功能不可用！",
                    "UOT": "該主題包數據不是 4.x 架構的 JSON，請更新主題包！",
                    "UNU": "未找到該主題包數據，主題包未啟用！",
                    "UBN": "該主題包 UID 與內置主題包衝突，請修改主題包 UID！",
                    "UFG": "此自定義主題包立繪功能不可用！",
                    "UVO": "此自定義主題包語音功能不可用！",
                    "USP": "此自定義主題包Spine看板娘功能不可用！",
                    "DECF": "編碼錯誤或文本包含�，請上載使用 UTF-8 編碼的不含�的主題包文件！"
                }
            },
            "dessert": {
                "lv": {
                    "稀有": "稀有",
                    "史詩": "史詩",
                    "傳奇": "傳奇"
                },
                "name": {
                    "星銅蘋果護身符": "星銅蘋果護身符",
                    "藍銀葡萄護身符": "藍銀葡萄護身符",
                    "紫晶櫻桃護身符": "紫晶櫻桃護身符"
                },
            },
            "items": {
                "体能刺激药水": "體能刺激藥水",
                "锻造材料箱": "鍛造材料箱",
                "灵魂药水": "靈魂藥水",
                "随机装备箱": "隨機裝備箱",
                "宝石原石": "寶石原石",
                "光环天赋石": "光圈天賦石",
                "苹果核": "蘋果核",
                "蓝锻造石": "藍鍛造石",
                "绿锻造石": "綠鍛造石",
                "金锻造石": "金鍛造石"
            },
            "equips": {
                "def": {
                    "探险者之剑": "探險者之劍",
                    "探险者短弓": "探險者短弓",
                    "探险者短杖": "探險者短杖",
                    "狂信者的荣誉之刃": "狂信者的榮譽之刃",
                    "反叛者的刺杀弓": "反叛者的刺殺弓",
                    "幽梦匕首": "幽夢匕首",
                    "光辉法杖": "光輝法杖",
                    "荆棘盾剑": "荊棘盾劍",
                    "陨铁重剑": "隕鐵重劍",
                    "饮血魔剑": "飲血魔劍",
                    "彩金长剑": "彩金長劍",
                    "清澄长杖": "清澄長杖",

                    "探险者手环": "探險者手環",
                    "命师的传承手环": "命師的傳承手環",
                    "秃鹫手环": "禿鷲手環",
                    "海星戒指": "海星戒指",
                    "噬魔戒指": "噬魔戒指",
					"折光戒指": "折光戒指",

                    "探险者铁甲": "探險者鐵甲",
                    "探险者皮甲": "探險者皮甲",
                    "探险者布甲": "探險者布甲",
                    "旅法师的灵光袍": "旅法師的靈光袍",
                    "战线支撑者的荆棘重甲": "戰線支撐者的荊棘重甲",
                    "复苏战衣": "復蘇戰衣",
                    "挑战斗篷": "挑戰鬥篷",

                    "探险者耳环": "探險者耳環",
                    "占星师的耳饰": "占星師的耳飾",
                    "萌爪耳钉": "萌爪耳釘",
                    "猎魔耳环": "獵魔耳環",
					"凶神耳环": "凶神耳環"
                },
                "old": {
                    "荆棘盾剑": "荊棘劍盾",
                    "饮血魔剑": "飲血長槍",
                    "探险者手环": "探險者手套",
                    "秃鹫手环": "禿鷲手套",
                    "复苏战衣": "復蘇木甲",
                    "探险者耳环": "探險者頭巾",
                    "占星师的耳饰": "占星師的髮飾",
                    "萌爪耳钉": "天使緞帶"
                }
            },
            "chars": {
                "舞": "舞",
                "默": "默",
                "琳": "琳",
                "艾": "艾",
                "梦": "夢",
                "薇": "薇",
                "伊": "伊",
                "冥": "冥",
                "命": "命",
                "希": "希",
                "霞": "霞",
                "雅": "雅",
				"绮": "綺"
            },
            "mobs": {
                "魔灯之灵（野怪": "魔燈之靈（野怪",
                "六眼飞鱼（野怪": "六眼飛魚（野怪",
                "铁皮木人（野怪": "鐵皮木人（野怪",
                "迅捷魔蛛（野怪": "迅捷魔蛛（野怪",
                "食铁兽（野怪": "食鐵獸（野怪",
                "晶刺豪猪（野怪": "晶刺豪豬（野怪",
                "六边形战士（野怪": "六邊形戰士（野怪",
                "营养均衡的史莱姆（野怪": "營養均衡的史萊姆（野怪"
            }
        },
        "ja": {
            "menu": {
                "Title": "テーマパックマネージャー設定",
                "Theme": "テーマパックを切り替",
                "Themes": {
                    "Classic": "典型",
                    "Original": "ネイティブ",
                    "testmain001": "テスト"
                },
                "OldName": "旧装備名",
                "ThemeName": "テーマ装備/アイテム名",
                "OriName": "元装備名表示(テーマ名時)",
                "CharName": "テーマ人名",
                "CharFGCG": "立ち絵",
                "DetailCG": "詳細画面でCGを表示",
                "Kanban": "看板娘",
                "ForceEquippedKanban": "出撃中キャラを看板娘に固定",
                "AIKanban": "いつも画像看板娘使用",
                "Voice": "ボイス",
                "IconSize": "アイコン大小設定",
                "KanbanSize": "看板娘大小設定",
                "AutoNight": "自動ナイトモード",
                "NightMode": "ナイトモード",
                "FollowBrowser": "システム設定に従う",
                "MobileLayout": "モバイル表示スタイル",
                "UsrInstall": "カスタムテーマファイルをインストール",
                "UsrUninstall": "カスタムテーマのアンインストール",
                "MoreThemes": "次はカスタムテーマです",
                "NoCustom": "インストール済みのカスタムテーマはありません",
                "NotSelected": "選択されていません",
                "InstallBtn": "インストール"
            },
            "msg": {
                "loadtime": "マウント完了/停止，経過時間：",
                "initstop": "無効なログイン状態またはゲームサーバは現在メンテナンス中で、テーマパック マネージャーのロードは停止しています。",
                "now": "(現在)",
                "nofgimg": "このカスタムテーマパックの立ち絵機能は使用できません！",
                "nospine": "このカスタムテーマパックのSpine看板娘機能は使用できません！",
                "novoice": "このカスタムテーマパックのボイス機能は使用できません！",
                "preloadTitle": "アセットの先読み",
                "preload": "先読み",
                "cacheClear": "キャッシュ削除",
                "cacheClearAll": "すべて削除",
                "cacheLoading": "ローカルキャッシュ：読み込み中…",
                "cacheEmpty": "ローカルキャッシュは空です",
                "cacheEntries": "ローカルキャッシュ {n} 件 / {size} MB（{themes}）",
                "cacheStorage": "　サイトストレージ {used}",
                "preloadProgress": "{n}/{total}",
                "preloadDone": "アセットの先読み完了 {ok}/{total}（読み取り {read}, ディスクキャッシュのみ {warm}{fail}{miss}{skip}, {secs}秒）",
                "preloadFailPart": ", キャッシュ失敗 {n}",
                "preloadMissPart": ", 欠落 {n}",
                "preloadSkipPart": ", スキップ {n}",
                "preloadWarmNote": "別に {warm} 件のアセットはブラウザのディスクキャッシュにのみ格納されました（これらのサーバーは CORS ヘッダーを返さないため、スクリプトは内容を読めず、ローカルキャッシュには保存できません）。上記の「ローカルキャッシュ」統計には表示されませんが、Network パネルでは (disk cache) と表示されます。",
                "preloadWarmFail": "{fail} 件のキャッシュに失敗しました（接続がリセットされました）。次回の先読みで自動的に再試行されます。",
                "preloadErrors": "問題のあるアセット（先頭のみ）：",
                "preloadCacheWrite": "ローカルキャッシュ 書き込み {stored}/{tried}（失敗 {putFailed}）",
                "preloadCacheOff": "  [!] キャッシュは無効です：{reason}",
                "preloadCacheLastErr": "  最後のエラー：{err}",
                "preloadNoScope": "キャッシュスコープがありません（テーマに INF.UID がない？）。HTTP キャッシュのみ温めました。",
                "preloadNoModule": "カンバンモジュールが読み込まれていないため、先読みできません。",
                "preloadNoTheme": "テーマがまだないため、先読みをスキップします。",
                "preloadNoInventory": "アセット一覧の関数がありません。",
                "preloadInventoryFail": "テーマのアセット一覧の読み取りに失敗しました。",
                "preloadNothing": "このテーマに先読みできるアセットはありません。",
                "preloadMissing": "{n} 件のアセットがサーバー上に存在しません（テーマが宣言しているが未アップロード）。",
                "preloadSkipped": "テーマが提供していない任意アセットを {n} 件スキップしました（装備アイコンの段階など）。",
                "preloadStorageLine": "サイトストレージ使用量 {used}（ローカルキャッシュは読めたアセットのみ保存します。配当は十分に余っており、入らない原因は CORS であって容量ではありません）",
                "cacheCleared": "ローカルアセットキャッシュを {n} 件削除しました{which}",
                "cacheClearedTheme": "（テーマ {uid}）",
                "cacheClearedAll": "（すべてのテーマ）",
                "preloadNote": "初回の先読みで現在のテーマの全アセットをブラウザのキャッシュに取り込みます,JSに読み取れたアセットはローカルキャッシュにも保存されます（キャッシュ削除ボタンはこちらだけを消します）。"

            },
            "errors": {
                "code": "> Error Code\n    ",
                "info": "\n> Information\n    ",
                "K": {
                    "MA": {
                        "_001": "Theme Kanban is Unavailable !"
                    },
                    "SP": {
                        "_001": "WebGL is Unavailable !"
                    }
                },
                "M": {
                    "FG": "このテーマパックの立ち絵機能は使用できません！",
                    "VO": "このテーマパックのボイス機能は使用できません！",
                    "SP": "このテーマパックのSpine看板娘機能は使用できません！",
                    "UOT": "このテーマパックのデータは 4.x 形式の JSON ではありません。テーマパックを更新してください！",
                    "UNU": "このテーマパックのデータが見つかりません。テーマパックは有効になっていません！",
                    "UBN": "このテーマパックの UID は内蔵テーマパックと衝突しています。UID を変更してください！",
                    "UFG": "このカスタムテーマパックの立ち絵機能は使用できません！",
                    "UVO": "このカスタムテーマパックのボイス機能は使用できません！",
                    "USP": "このカスタムテーマパックのSpine看板娘機能は使用できません！",
                    "DECF": "エンコードエラー/テキストは�を含む、UTF-8でエンコードされた�を含まないテーマパックファイルをアップロードしてください！"
                }
            },
            "dessert": {
                "lv": {
                    "稀有": "レア",
                    "史诗": "大作",
                    "传奇": "伝説"
                },
                "name": {
                    "星铜苹果护身符": "星銅林檎お守り",
                    "蓝银葡萄护身符": "藍銀葡萄お守り",
                    "紫晶樱桃护身符": "紫水晶桜ん坊お守り"
                },
            },
            "items": {
                "体能刺激药水": "身体刺激剤",
                "锻造材料箱": "鍛造用材料箱",
                "灵魂药水": "魂の薬",
                "随机装备箱": "ランダム装備箱",
                "宝石原石": "宝石原石",
                "光环天赋石": "光輪天賦石",
                "苹果核": "リンゴ核",
                "蓝锻造石": "青鍛造石",
                "绿锻造石": "緑鍛造石",
                "金锻造石": "金鍛造石"
            },
            "equips": {
                "def": {
                    "探险者之剑": "探検家の剣",
                    "探险者短弓": "探検家の弓",
                    "探险者短杖": "探検家の杖",
                    "狂信者的荣誉之刃": "狂信者の栄光刃",
                    "反叛者的刺杀弓": "反逆者の暗殺弓",
                    "幽梦匕首": "ダークドリーム匕首",
                    "光辉法杖": "輝く杖",
                    "荆棘盾剑": "いばら盾剣",
                    "陨铁重剑": "流星鉄のエペの剣",
                    "饮血魔剑": "血に飢えた魔剣",
                    "彩金长剑": "彩金長剣",
                    "清澄长杖": "清澄長杖",

                    "探险者手环": "探検家の腕輪",
                    "命师的传承手环": "命の師匠の継承腕輪",
                    "秃鹫手环": "ハゲタカ腕輪",
                    "海星戒指": "海星指輪",
                    "噬魔戒指": "デビル・デバウラー指輪",
					"折光戒指": "屈折の指輪",

                    "探险者铁甲": "探検家の鎧",
                    "探险者皮甲": "探検家の革",
                    "探险者布甲": "探検家の衣",
                    "旅法师的灵光袍": "旅法師のローブ",
                    "战线支撑者的荆棘重甲": "フロントサポーターのトゲアーマー",
                    "复苏战衣": "蘇るスーツ",
                    "挑战斗篷": "挑戦者のマント",

                    "探险者耳环": "探検家の耳飾り",
                    "占星师的耳饰": "占星術師の耳飾り",
                    "萌爪耳钉": "萌え猫爪耳飾り",
                    "猎魔耳环": "猎魔耳飾り",
					"凶神耳环": "凶神耳飾り"
                },
                "old": {
                    "荆棘盾剑": "いばら剣盾",
                    "饮血魔剑": "血に飢えた槍",
                    "探险者手环": "探検家の手袋",
                    "秃鹫手环": "ハゲタカ手袋",
                    "复苏战衣": "蘇るウッドアーマー",
                    "探险者耳环": "探検家のマフラー",
                    "占星师的耳饰": "占星術師の髪飾り",
                    "萌爪耳钉": "天使のリボン"
                }
            },
            "chars": {
                "舞": "舞",
                "默": "黙",
                "琳": "琳",
                "艾": "艾",
                "梦": "夢",
                "薇": "薇",
                "伊": "伊",
                "冥": "冥",
                "命": "命",
                "希": "希",
                "霞": "霞",
                "雅": "雅",
				"绮": "綺"
            },
            "mobs": {
                "魔灯之灵（野怪": "魔灯の霊（野怪",
                "六眼飞鱼（野怪": "六眼飛魚（野怪",
                "铁皮木人（野怪": "ブリキの木人（野怪",
                "迅捷魔蛛（野怪": "迅捷魔蛛（野怪",
                "食铁兽（野怪": "食鉄獣（野怪",
                "晶刺豪猪（野怪": "晶刺ヤマアラシ（野怪",
                "六边形战士（野怪": "各方面の能力の高い戦士（野怪",
                "营养均衡的史莱姆（野怪": "栄養バランスのスライム（野怪"
            }

        },
        "en": {
            "menu": {
                "Title": "ThemePack Manager Setting",
                "Theme": "Select ThemePack",
                "Themes": {
                    "Classic": "Classic",
                    "Original": "Original",
                    "testmain001": "Test"
                },
                "OldName": "Old NickNames",
                "ThemeName": "Theme Equip/Item Names",
                "OriName": "Mark OriNames (ThemeName On)",
                "CharName": "Theme Character Names",
                "CharFGCG": "FG/CG Images",
                "DetailCG": "Show CG on the card detail page",
                "Kanban": "Kanban Musume",
                "ForceEquippedKanban": "Force deployed card as Kanban",
                "AIKanban": "Always use IMG Kanban",
                "Voice": "Theme Voice",
                "IconSize": "Set Icon Size",
                "KanbanSize": "Set Kanban Size",
                "AutoNight": "Auto NightMode",
                "NightMode": "NightMode",
                "FollowBrowser": "Follow System DarkMode",
                "MobileLayout": "Mobile Layout Style",
                "UsrInstall": "Install Custom ThemePack",
                "UsrUninstall": "Uninstall installed ThemePack",
                "MoreThemes": "Below are Custom ThemePacks",
                "NoCustom": "No Custom ThemePack Installed",
                "NotSelected": "Not Selected",
                "InstallBtn": "Install"
            },
            "msg": {
                "loadtime": "Load Finished/Discontinued! Takes ",
                "initstop": "Invalid login status or Game Server is currently under maintenance,Themepack Manager Loading stopped.",
                "now": "(current)",
                "nofgimg": "The FG/CG Function in this Custom ThemePack is unavailable !",
                "nospine": "The Spine Kanban Function in this Custom ThemePack is unavailable !",
                "novoice": "The Voice Function in this Custom ThemePack is unavailable !",
                "preloadTitle": "Resource Preload",
                "preload": "Preload",
                "cacheClear": "Clear Cache",
                "cacheClearAll": "Clear All",
                "cacheLoading": "Local cache: loading…",
                "cacheEmpty": "Local cache is empty",
                "cacheEntries": "Local cache {n} items / {size} MB ({themes})",
                "cacheStorage": "　Site storage {used}",
                "preloadProgress": "{n}/{total}",
                "preloadDone": "Preload finished {ok}/{total} (read {read}, disk cache only {warm}{fail}{miss}{skip}, {secs}s)",
                "preloadFailPart": ", warm failed {n}",
                "preloadMissPart": ", missing {n}",
                "preloadSkipPart": ", skipped {n}",
                "preloadWarmNote": "{warm} assets went only into the browser disk cache. The server sends no CORS header for those, so the script cannot read their contents and cannot store them locally. They do not appear in the local cache figure above, but the Network panel shows them as (disk cache).",
                "preloadWarmFail": "{fail} assets failed to warm (connection reset). The next preload retries them automatically.",
                "preloadErrors": "First few problematic assets:",
                "preloadCacheWrite": "Local cache wrote {stored}/{tried} (failed {putFailed})",
                "preloadCacheOff": "  [!] Cache is off: {reason}",
                "preloadCacheLastErr": "  last error: {err}",
                "preloadNoScope": "No cache scope (theme has no INF.UID?), so only the HTTP cache was warmed.",
                "preloadNoModule": "The kanban module is not loaded, so preloading is unavailable.",
                "preloadNoTheme": "No theme yet, skipping the preload.",
                "preloadNoInventory": "The asset inventory function is missing.",
                "preloadInventoryFail": "Failed to read the theme asset inventory.",
                "preloadNothing": "This theme has no assets to preload.",
                "preloadMissing": "{n} assets are genuinely absent from the server (declared by the theme but not uploaded).",
                "preloadSkipped": "Skipped {n} optional assets the theme does not provide (equipment icon tiers, etc.).",
                "preloadStorageLine": "Site storage used {used} (the local cache holds only readable assets; quota is far from full, so the limit is CORS, not space)",
                "cacheCleared": "Cleared {n} locally cached assets{which}",
                "cacheClearedTheme": " (theme {uid})",
                "cacheClearedAll": " (all themes)",
                "preloadNote": "The first preload pulls every asset of the current theme into the browser cache, Assets the script can read are also stored in the local cache, and the Clear Cache buttons only clear that part."

            },
            "errors": {
                "code": "> Error Code\n    ",
                "info": "\n> Information\n    ",
                "K": {
                    "MA": {
                        "_001": "Theme Kanban is Unavailable !"
                    },
                    "SP": {
                        "_001": "WebGL is Unavailable !"
                    }
                },
                "M": {
                    "FG": "The FG/CG Function in this ThemePack is unavailable!",
                    "VO": "The Voice Function in this ThemePack is unavailable!",
                    "SP": "The Spine Kanban Function in this ThemePack is unavailable!",
                    "UOT": "The Data of this ThemePack is not 4.x schema JSON, please update the ThemePack !",
                    "UNU": "The Data of this ThemePack is non-existent! ThemePack not activated!",
                    "UBN": "This ThemePack UID conflicts with a built-in ThemePack, please change the UID !",
                    "UFG": "The FG/CG Function in this Custom ThemePack is unavailable !",
                    "UVO": "The Voice Function in this Custom ThemePack is unavailable !",
                    "USP": "The Spine Kanban Function in this Custom ThemePack is unavailable !",
                    "DECF": "Encoding Error or text contains �! Please Upload UTF-8 Encoding and no � ThemePack File!"
                }
            },
            "dessert": {
                "lv": {
                    "稀有": "Rare ",
                    "史诗": "Epic ",
                    "传奇": "Legend "
                },
                "name": {
                    "星铜苹果护身符": "Star-Copper Apple Amulet",
                    "蓝银葡萄护身符": "Blue-Silver Grape Amulet",
                    "紫晶樱桃护身符": "Amethyst Cherry Amulet"
                },
            },
            "items": {
                "体能刺激药水": "Stamina Stimulant Potion",
                "锻造材料箱": "Forge Material Box",
                "灵魂药水": "Soul potion",
                "随机装备箱": "Random Equipment Chest",
                "宝石原石": "Original Gem Stone",
                "光环天赋石": "Halo Talent Stone",
                "苹果核": "Fruit Core",
                "蓝锻造石": "Blue Forge Stone",
                "绿锻造石": "Green Forge Stone",
                "金锻造石": "Gold Forge Stone"
            },
            "equips": {
                "def": {
                    "探险者之剑": "Explorer's Sword",
                    "探险者短弓": "Explorer's Bow",
                    "探险者短杖": "Explorer's Staff",
                    "狂信者的荣誉之刃": "Honor Blade of Crazy Believer",
                    "反叛者的刺杀弓": "Rebel's Assassination Bow",
                    "幽梦匕首": "Faint Dream Dagger",
                    "光辉法杖": "Shining Staff",
                    "荆棘盾剑": "Thorny Shield Sword",
                    "陨铁重剑": "Meteoric Iron Epee Sword",
                    "饮血魔剑": "Bloodthirsty Demon Sword",
                    "彩金长剑": "Lottery Gold Sword",
                    "清澄长杖": "Limpid Long Staff",

                    "探险者手环": "Explorer's Bracelet",
                    "命师的传承手环": "Life's Bracelet from her Shifu",
                    "秃鹫手环": "Vulture Bracelet",
                    "海星戒指": "Starfish Ring",
                    "噬魔戒指": "Devil Devourer Ring",
					"折光戒指": "Refraction Ring",

                    "探险者铁甲": "Explorer's Armor",
                    "探险者皮甲": "Explorer's Leather",
                    "探险者布甲": "Explorer's Cloth",
                    "旅法师的灵光袍": "Magician's Aura Robe",
                    "战线支撑者的荆棘重甲": "Thorny Armor of the Front Supporter",
                    "复苏战衣": "Recovery Suit",
                    "挑战斗篷": "Challenger's Cloak",

                    "探险者耳环": "Explorer's Earrings",
                    "占星师的耳饰": "Astrologer's Earrings",
                    "萌爪耳钉": "Neko Claw Earrings",
                    "猎魔耳环": "Hunt Devil Earrings",
					"凶神耳环": "Evil God Earrings"
                },
                "old": {
                    "荆棘盾剑": "Thorny Sword Shield",
                    "饮血魔剑": "Bloodthirsty Lance",
                    "探险者手环": "Explorer's Glove",
                    "秃鹫手环": "Vulture Glove",
                    "复苏战衣": "Recovery Wood Armour",
                    "探险者耳环": "Explorer's Scarf",
                    "占星师的耳饰": "Astrologer's Hair Ornament",
                    "萌爪耳钉": "Angel's Ribbon"
                }
            },
			"chars": {
				"舞": "Dance",
				"默": "Silence",
				"琳": "Rin",
				"艾": "Aya",
				"梦": "Dream",
				"薇": "Vivi",
				"伊": "Eve",
				"冥": "Nyx",
				"命": "Fate",
				"希": "Hope",
				"霞": "Aurora",
				"雅": "Grace",
				"绮": "Splendor"
			},
            "mobs": {
                "魔灯之灵（野怪": "MagicLamp's Spirit（Mob",
                "六眼飞鱼（野怪": "SixEyed FlyingFish（Mob",
                "铁皮木人（野怪": "Iron Wooden Man（Mob",
                "迅捷魔蛛（野怪": "Quick Magic Spider（Mob",
                "食铁兽（野怪": "Iron Eater（Mob",
                "晶刺豪猪（野怪": "Jingthorn Porcupine（Mob",
                "六边形战士（野怪": "Hexagonal Warrior（Mob",
                "营养均衡的史莱姆（野怪": "Nutritional balance's Slime（Mob"
            }

        }
    },
    mobCheck = [
        "魔灯之灵（野怪",
        "六眼飞鱼（野怪",
        "铁皮木人（野怪",
        "迅捷魔蛛（野怪",
        "食铁兽（野怪",
        "晶刺豪猪（野怪",
        "六边形战士（野怪",
        "营养均衡的史莱姆（野怪"
    ],
    testmain001 = {
        "INF": {
            "UID": "testmain001",
            "Name": {
                "sc": "测_公主连结R",
                "tc": "測_公主連結R",
                "ja": "測_プリコネR",
                "en": "test_PCReDive",
            },
            "Ver": [0, 1, 0],
            "Build": 261003001,
            "COMP": {
                "CharTachie": true,
                "MobsTachie": true,
                "ImageKanban": true,
                "SpineKanban": true,
                "CharSounds": true,
                "EquipIcons": true,
                "ItemIcons": true,
                "DessertIcons": true,
                "EquipThemeName": true,
                "ItemThemeName": true,
                "DessertThemeName": true,
                "CharThemeName": true,
                "MobsThemeName": true,
                "Style": true,
            },

        },
        "MobsTachie": {
            "common": "https://p.inari.site/guguicons/test/mob/",
            "ext": ".png",
            "uri": {
                "魔灯之灵（野怪": "deng",
                "六眼飞鱼（野怪": "fish",
                "铁皮木人（野怪": "mu",
                "迅捷魔蛛（野怪": "zhu",
                "食铁兽（野怪": "shou",
                "晶刺豪猪（野怪": "nzhu",
                "六边形战士（野怪": "liu",
                "营养均衡的史莱姆（野怪": "slime"
            },
        },
        "CharTachie": {
            "common": "https://p.inari.site/guguicons/test/cg/",
            "ext": ".png",
            "uri": {
                "舞": "wuu/",
                "默": "mo/",
                "琳": "lin/",
                "艾": "ai/",
                "梦": "meng/",
                "薇": "wei/",
                "伊": "yi/",
                "冥": "ming/",
                "命": "life/",
                "希": "xii/",
                "霞": "xia/",
                "雅": "ya/",
				"绮": "qi/"
            },
            "HeadFG": {
                "舞": "1",
                "默": "1",
                "琳": "1",
                "艾": "1",
                "梦": "1",
                "薇": "1",
                "伊": "1",
                "冥": "1",
                "命": "1",
                "希": "1",
                "霞": "1",
                "雅": "1",
				"绮": "1"
            },
            "LeftFG": {
                "舞": "2",
                "默": "2",
                "琳": "2",
                "艾": "2",
                "梦": "2",
                "薇": "2",
                "伊": "2",
                "冥": "2",
                "命": "2",
                "希": "2",
                "霞": "2",
                "雅": "2",
				"绮": "2"
            },
            "CG": {
                "舞": "3",
                "默": "3",
                "琳": "3",
                "艾": "3",
                "梦": "3",
                "薇": "3",
                "伊": "3",
                "冥": "3",
                "命": "3",
                "希": "3",
                "霞": "3",
                "雅": "3",
				"绮": "3"
            },
            "LeftPKFG": {
                "舞": "4",
                "默": "4",
                "琳": "4",
                "艾": "4",
                "梦": "4",
                "薇": "4",
                "伊": "4",
                "冥": "4",
                "命": "4",
                "希": "4",
                "霞": "4",
                "雅": "4",
				"绮": "4"
            },
            "RightPKFG": {
                "舞": "5",
                "默": "5",
                "琳": "5",
                "艾": "5",
                "梦": "5",
                "薇": "5",
                "伊": "5",
                "冥": "5",
                "命": "5",
                "希": "5",
                "霞": "5",
                "雅": "5",
				"绮": "5"
            }
        },
        "ImageKanban": {
            "bg": "https://sticker.inari.site/api/bg.jpg",
            "asset": {
                "common": "https://p.inari.site/guguicons/test/cg/",
                "ext": ".png",
				"resize":"64"
            },
            "uri": {
				"舞": "wuu/",
                "默": "mo/",
                "琳": "lin/",
                "艾": "ai/",
                "梦": "meng/",
                "薇": "wei/",
                "伊": "yi/",
                "冥": "ming/",
                "命": "life/",
                "希": "xii/",
                "霞": "xia/",
                "雅": "ya/",
				"绮": "qi/"
            },
            "idle": {
                "舞": "2",
                "默": "2",
                "琳": "2",
                "艾": "2",
                "梦": "2",
                "薇": "2",
                "伊": "2",
                "冥": "2",
                "命": "2",
                "希": "2",
                "霞": "2",
                "雅": "2",
				"绮": "2"
            },
            "win":  {
                "舞": "2",
                "默": "2",
                "琳": "2",
                "艾": "2",
                "梦": "2",
                "薇": "2",
                "伊": "2",
                "冥": "2",
                "命": "2",
                "希": "2",
                "霞": "2",
                "雅": "2",
				"绮": "2"
            },
            "lose":  {
                "舞": "2",
                "默": "2",
                "琳": "2",
                "艾": "2",
                "梦": "2",
                "薇": "2",
                "伊": "2",
                "冥": "2",
                "命": "2",
                "希": "2",
                "霞": "2",
                "雅": "2",
				"绮": "2"
            }
        },
        "SpineKanban": {
            "bg": {
                "url": "https://sticker.inari.site/api/bg.jpg",
                "config": {
                    alpha: true,
                    backgroundColor: "#000000"
                },
            },
            "assest": {
                "common": "https://sticker.inari.site/api/common/",
                "unit": "https://sticker.inari.site/api/unit/",
                "ext": ".cysp",
                "type": "_COMMON_BATTLE.cysp",
                "skeleton": "_CHARA_BASE.cysp",
                "skill": "BATTLE.cysp",
                "default": "default",
                "baseId": "000000",
                "substr": "1",
                "sep": "_",
                "texture": {
                    "pos": "texture.atlas",
                    "img": "texture.png"
                },
                "addAnimations": [
                    'DEAR',
                    'NO_WEAPON',
                    'POSING',
                    'RACE',
                    'RUN_JUMP',
                    'SMILE'
                ],
                "optionList": [
                    ['闲置', 'idle'],
                    ['准备', 'standBy'],
                    ['走', 'walk'],
                    ['跑', 'run'],
                    ['跑（入场）', 'run_gamestart'],
                    ['落地', 'landing'],
                    ['攻击', 'attack'],
                    ['攻击（扫荡）', 'attack_skipQuest'],
                    ['庆祝-短', 'joy_short,hold,joy_short_return'],
                    ['庆祝-长', 'joy_long,hold,joy_long_return'],
                    ['受伤', 'damage'],
                    ['死亡', 'die,stop'],
                    ['合作-准备', 'multi_standBy'],
                    ['合作-闲置', 'multi_idle_standBy'],
                    ['合作-闲置（无武器）', 'multi_idle_noWeapon']
                ],
                "idleCheck": [
                    'multi_idle_standBy',
                    'multi_idle_noWeapon',
                    'idle',
                    'walk',
                    'run',
                    'run_gamestart'
                ],
                "anim": {
                    "click": "000000_dear_smile",
                    "multi_standBy": "multi_standBy",
                    "_idle": "_idle",
                    "stop": "stop",
                    "hold": "hold",
                    "win": "option[value*=joyResult]",
                    "lose": ['damage', 'die', 'landing']
                }
            },
            "conf": {
                "fallback": {
                    "uri": "wuu/",
                    "type": "6",
                    "hasRarity6": true,
                    "wi": -330,
                    "hi": -42,
                    "re": 0.8
                },
                "舞": {
                    "uri": "wuu/",
                    "type": "6",
                    "hasRarity6": true,
                    "wi": -330,
                    "hi": -42,
                    "re": 0.8
                },
                "默": {
                    "uri": "mo/",
                    "type": "7",
                    "hasRarity6": true,
                    "wi": -350,
                    "hi": -42,
                    "re": 0.8
                },
                "琳": {
                    "uri": "lin/",
                    "type": "5",
                    "hasRarity6": true,
                    "wi": -330,
                    "hi": -42,
                    "re": 0.8
                },
                "艾": {
                    "uri": "ai/",
                    "type": "8",
                    "hasRarity6": true,
                    "wi": -320,
                    "hi": -64,
                    "re": 0.8
                },
                "梦": {
                    "uri": "meng/",
                    "type": "4",
                    "hasRarity6": false,
                    "wi": -320,
                    "hi": -42,
                    "re": 0.8
                },
                "薇": {
                    "uri": "wei/",
                    "type": "1",
                    "hasRarity6": true,
                    "wi": -360,
                    "hi": -42,
                    "re": 0.8
                },
                "伊": {
                    "uri": "yi/",
                    "type": "8",
                    "hasRarity6": false,
                    "wi": -380,
                    "hi": -92,
                    "re": 0.8
                },
                "冥": {
                    "uri": "ming/",
                    "type": "3",
                    "hasRarity6": true,
                    "wi": -350,
                    "hi": -48,
                    "re": 0.8
                },
                "命": {
                    "uri": "life/",
                    "type": "1",
                    "hasRarity6": false,
                    "wi": -360,
                    "hi": -36,
                    "re": 1.0
                },
                "希": {
                    "uri": "xii/",
                    "type": "10",
                    "hasRarity6": false,
                    "wi": -370,
                    "hi": -64,
                    "re": 0.8
                },
                "霞": {
                    "uri": "xia/",
                    "type": "7",
                    "hasRarity6": false,
                    "wi": -370,
                    "hi": -64,
                    "re": 0.8
                },
                "雅": {
                    "uri": "ya/",
                    "type": "7",
                    "hasRarity6": false,
                    "wi": -370,
                    "hi": -64,
                    "re": 0.8
                },
				"绮": {
                    "uri": "qi/",
                    "type": "8",
                    "hasRarity6": false,
                    "wi": -380,
                    "hi": -92,
                    "re": 0.8
                },
            }
        },
        "CharSounds": {
            "common": "https://p.inari.site/guguicons/test/vo/",
            "ext": ".mp3",
            "uri": {
                "on": "on",
                "off": "off",
                "舞": "wuu/",
                "默": "mo/",
                "琳": "lin/",
                "艾": "ai/",
                "梦": "meng/",
                "薇": "wei/",
                "伊": "yi/",
                "冥": "ming/",
                "命": "life",
                "希": "xii/",
                "霞": "xia/",
                "雅": "ya/",
				"绮":"qi/"
            },
            "conf": {
                "舞": {
					"uri":"wuu/",
					"click":["0","1","2","3"],
					"levelup":"levelup",
					"colle":"colle",
					"change":"change",
					"power":"power",
					"win":"win",
					"lose":"lose",
					"reset":"reset",
					"exp":"exp",
					"battle":"battle"
				},
                "默":  {
					"click":["0","1","2","3"],
					"levelup":"levelup",
					"colle":"colle",
					"change":"change",
					"power":"power",
					"win":"win",
					"lose":"lose",
					"reset":"reset",
					"exp":"exp",
					"battle":"battle"
				},
                "琳":  {
					"click":["0","1","2","3"],
					"levelup":"levelup",
					"colle":"colle",
					"change":"change",
					"power":"power",
					"win":"win",
					"lose":"lose",
					"reset":"reset",
					"exp":"exp",
					"battle":"battle"
				},
                "艾":  {
					"click":["0","1","2","3"],
					"levelup":"levelup",
					"colle":"colle",
					"change":"change",
					"power":"power",
					"win":"win",
					"lose":"lose",
					"reset":"reset",
					"exp":"exp",
					"battle":"battle"
				},
                "梦":  {
					"click":["0","1","2","3"],
					"levelup":"levelup",
					"colle":"colle",
					"change":"change",
					"power":"power",
					"win":"win",
					"lose":"lose",
					"reset":"reset",
					"exp":"exp",
					"battle":"battle"
				},
                "薇":  {
					"click":["0","1","2","3"],
					"levelup":"levelup",
					"colle":"colle",
					"change":"change",
					"power":"power",
					"win":"win",
					"lose":"lose",
					"reset":"reset",
					"exp":"exp",
					"battle":"battle"
				},
                "伊":  {
					"click":["0","1","2","3"],
					"levelup":"levelup",
					"colle":"colle",
					"change":"change",
					"power":"power",
					"win":"win",
					"lose":"lose",
					"reset":"reset",
					"exp":"exp",
					"battle":"battle"
				},
                "冥":  {
					"click":["0","1","2","3"],
					"levelup":"levelup",
					"colle":"colle",
					"change":"change",
					"power":"power",
					"win":"win",
					"lose":"lose",
					"reset":"reset",
					"exp":"exp",
					"battle":"battle"
				},
                "命":  {
					"click":["0","1","2","3"],
					"levelup":"levelup",
					"colle":"colle",
					"change":"change",
					"power":"power",
					"win":"win",
					"lose":"lose",
					"reset":"reset",
					"exp":"exp",
					"battle":"battle"
				},
                "希":  {
					"click":["0","1","2","3"],
					"levelup":"levelup",
					"colle":"colle",
					"change":"change",
					"power":"power",
					"win":"win",
					"lose":"lose",
					"reset":"reset",
					"exp":"exp",
					"battle":"battle"
				},
                "霞":  {
					"click":["0","1","2","3"],
					"levelup":"levelup",
					"colle":"colle",
					"change":"change",
					"power":"power",
					"win":"win",
					"lose":"lose",
					"reset":"reset",
					"exp":"exp",
					"battle":"battle"
				},
                "雅":  {
					"click":["0","1","2","3"],
					"levelup":"levelup",
					"colle":"colle",
					"change":"change",
					"power":"power",
					"win":"win",
					"lose":"lose",
					"reset":"reset",
					"exp":"exp",
					"battle":"battle"
				},
				"绮":  {
					"click":["0","1","2","3"],
					"levelup":"levelup",
					"colle":"colle",
					"change":"change",
					"power":"power",
					"win":"win",
					"lose":"lose",
					"reset":"reset",
					"exp":"exp",
					"battle":"battle"
				}
            }
        },
        "EquipIcons": {
            "common": "https://p.inari.site/guguicons/test/eq/",
            "ext": ".gif",
            /*"style":{
                "mix":"normal"

            },*/
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
                "探险者短弓": "探险者短弓/",
                "探险者短杖": "探险者短杖/",
                "狂信者的荣誉之刃": "狂信者的荣誉之刃/",
                "反叛者的刺杀弓": "反叛者的刺杀弓/",
                "幽梦匕首": "幽梦匕首/",
                "光辉法杖": "光辉法杖/",
                "荆棘盾剑": "荆棘盾剑/",
                "陨铁重剑": "陨铁重剑/",
                "饮血魔剑": "饮血魔剑/",
                "彩金长剑": "彩金长剑/",
                "清澄长杖": "清澄长杖/",

                "探险者手环": "探险者手环/",
                "命师的传承手环": "命师的传承手环/",
                "秃鹫手环": "秃鹫手环/",
                "海星戒指": "海星戒指/",
                "噬魔戒指": "噬魔戒指/",
				"折光戒指": "折光戒指/",

                "探险者铁甲": "探险者铁甲/",
                "探险者皮甲": "探险者皮甲/",
                "探险者布甲": "探险者布甲/",
                "旅法师的灵光袍": "旅法师的灵光袍/",
                "战线支撑者的荆棘重甲": "战线支撑者的荆棘重甲/",
                "复苏战衣": "复苏战衣/",
                "挑战斗篷": "挑战斗篷/",

                "探险者耳环": "探险者耳环/",
                "占星师的耳饰": "占星师的耳饰/",
                "萌爪耳钉": "萌爪耳钉/",
                "猎魔耳环": "猎魔耳环/",
				"凶神耳环": "凶神耳环/"
            },
            "olduri": {
                "饮血魔剑": "饮血长枪/",
                "探险者手环": "探险者手套/",
                "秃鹫手环": "秃鹫手套/",
                "探险者耳环": "探险者头巾/",
                "占星师的耳饰": "占星师的发饰/",
                "萌爪耳钉": "天使缎带/"
            }
        },
        "ItemIcons": {
            "common": "https://p.inari.site/guguicons/test/items/",
            "ext": ".gif",
            "uri": {
                "体能刺激药水": "powerdrug",
                "锻造材料箱": "forgebox",
                "灵魂药水": "souldrug",
                "随机装备箱": "eqchest",
                "宝石原石": "gemchest",
                "光环天赋石": "halostone",
                "苹果核": "fruitcore",
                "蓝锻造石": "loforge",
                "绿锻造石": "miforge",
                "金锻造石": "hiforge"
            }

        },
        "DessertIcons": {
            "common": "https://p.inari.site/guguicons/test/eq/",
            "ext": ".gif",
            /*"style":{
                "mix":"normal"

            },*/
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
            },
        },
        "ItemThemeName": {
            "intl": true,
            "sc": {
                "体能刺激药水": "体力药剂",
                "锻造材料箱": "自选锻造材料",
                "灵魂药水": "经验药水",
                "随机装备箱": "随机装备箱",
                "宝石原石": "自选概率宝石箱",
                "光环天赋石": "光环天赋石",
                "苹果核": "玛娜",
                "蓝锻造石": "低级锻造石",
                "绿锻造石": "中级锻造石",
                "金锻造石": "高级锻造石"
            },
            "tc": {
                "体能刺激药水": "體力藥劑",
                "锻造材料箱": "自選鍛造材料",
                "灵魂药水": "經驗藥水",
                "随机装备箱": "隨機裝備箱",
                "宝石原石": "自選概率寶石箱",
                "光环天赋石": "光環天賦石",
                "苹果核": "瑪娜",
                "蓝锻造石": "低級鍛造石",
                "绿锻造石": "中級鍛造石",
                "金锻造石": "高級鍛造石"
            },
            "ja": {
                "体能刺激药水": "体力薬剤",
                "锻造材料箱": "自選鍛造材料",
                "灵魂药水": "経験薬",
                "随机装备箱": "ランダム装備箱",
                "宝石原石": "自選確率宝石箱",
                "光环天赋石": "光輪の天賦向上",
                "苹果核": "マナ",
                "蓝锻造石": "下級鍛造石",
                "绿锻造石": "中級鍛造石",
                "金锻造石": "上級鍛造石"
            },
            "en": {
                "体能刺激药水": "Stamina Potion",
                "锻造材料箱": "Optional Forging Material",
                "灵魂药水": "Experience potion",
                "随机装备箱": "Random Equipment Chest",
                "宝石原石": "Optional Probability Gem Chest",
                "光环天赋石": "Halo Talent Stone",
                "苹果核": "Mana",
                "蓝锻造石": "Primary Forge Stone",
                "绿锻造石": "Intermediate Forge Stone",
                "金锻造石": "Superior Forge Stone"
            }
        },
        "DessertThemeName": {
            "intl": true,
            "sc": {
                "lv": {
                    "稀有": "普通的",
                    "史诗": "成熟的",
                    "传奇": "优质的"
                },
                "name": {
                    "星铜苹果护身符": "苹果",
                    "蓝银葡萄护身符": "葡萄",
                    "紫晶樱桃护身符": "西瓜"
                },
            },
            "tc": {
                "lv": {
                    "稀有": "普通的",
                    "史诗": "成熟的",
                    "传奇": "優質的"
                },
                "name": {
                    "星铜苹果护身符": "蘋果",
                    "蓝银葡萄护身符": "葡萄",
                    "紫晶樱桃护身符": "西瓜"
                }
            },
            "ja": {
                "lv": {
                    "稀有": "普通の",
                    "史诗": "熟した",
                    "传奇": "上質な"
                },
                "name": {
                    "星铜苹果护身符": "林檎",
                    "蓝银葡萄护身符": "ぶどう",
                    "紫晶樱桃护身符": "スイカ"
                }
            },
            "en": {
                "lv": {
                    "稀有": "Common   ",
                    "史诗": "Mature   ",
                    "传奇": "Superior "
                },
                "name": {
                    "星铜苹果护身符": "Apple",
                    "蓝银葡萄护身符": "Grape",
                    "紫晶樱桃护身符": "Watermelon"
                }
            }
        },
        "EquipThemeName": {
            "intl": true,
            "sc": {
                "def": {
                    "探险者之剑": "旅人剑",
                    "探险者短弓": "猎人弓",
                    "探险者短杖": "香木法杖",
                    "狂信者的荣誉之刃": "妖刀血鸦",
                    "反叛者的刺杀弓": "深渊之弓",
                    "幽梦匕首": "黑曜石天黑剑",
                    "光辉法杖": "棒棒糖手杖",
                    "荆棘盾剑": "盖亚之斧",
                    "陨铁重剑": "勇气星核剑",
                    "饮血魔剑": "混沌之刃",
                    "彩金长剑": "辉光剑征服者",
                    "清澄长杖": "冰树杖弗洛斯特斯塔弗",

                    "探险者手环": "旅者手镯",
                    "命师的传承手环": "睿智手镯",
                    "秃鹫手环": "朋克手镯",
                    "海星戒指": "永恒绿戒",
                    "噬魔戒指": "深结晶变异水晶",
					"折光戒指": "雪華晶的戒指",

                    "探险者铁甲": "重金属护甲",
                    "探险者皮甲": "皮革工作服",
                    "探险者布甲": "旅者长袍",
                    "旅法师的灵光袍": "魔导师的长袍",
                    "战线支撑者的荆棘重甲": "霸王树之棘针铠",
                    "复苏战衣": "翠绿灵衣",
                    "挑战斗篷": "黑玛瑙之祈装衣",

                    "探险者耳环": "旅者耳环",
                    "占星师的耳饰": "海神耳饰",
                    "萌爪耳钉": "精灵王护石",
                    "猎魔耳环": "狱天耳环",
					"凶神耳环": "妖精晶翅瓦哈"
                },
                "old": {
                    "饮血魔剑": "毁灭之伤冥神枪",
                    "探险者手环": "旅者拳套",
                    "秃鹫手环": "深红爪",
                    "探险者耳环": "旅者头巾",
                    "占星师的耳饰": "樱花月夜簪",
                    "萌爪耳钉": "细冰姬的蝴蝶结"
                }
            },
            "tc": {
                "def": {
                    "探险者之剑": "旅人劍",
                    "探险者短弓": "獵人弓",
                    "探险者短杖": "檀香之杖",
                    "狂信者的荣誉之刃": "妖刀血鴉",
                    "反叛者的刺杀弓": "深淵之弓",
                    "幽梦匕首": "天黑劍奧比修斯",
                    "光辉法杖": "棒棒糖手杖",
                    "荆棘盾剑": "蓋亞之斧",
                    "陨铁重剑": "星核劍艾爾茲修奈德",
                    "饮血魔剑": "渾沌之劍",
                    "彩金长剑": "輝光劍雅德瑪斯",
                    "清澄长杖": "冰樹杖冰霜權杖",

                    "探险者手环": "旅者手镯",
                    "命师的传承手环": "睿智手镯",
                    "秃鹫手环": "龐克棘刺手環",
                    "海星戒指": "常青之綠戒",
                    "噬魔戒指": "深結晶變異水晶",
					"折光戒指": "雪華晶の指輪",

                    "探险者铁甲": "重金屬盔甲",
                    "探险者皮甲": "皮革工作服",
                    "探险者布甲": "旅行長袍",
                    "旅法师的灵光袍": "魔導師的長袍",
                    "战线支撑者的荆棘重甲": "霸王樹之棘針鎧",
                    "复苏战衣": "翠綠靈衣",
                    "挑战斗篷": "黑瑪瑙祈裝衣",

                    "探险者耳环": "旅者耳環",
                    "占星师的耳饰": "海神耳飾",
                    "萌爪耳钉": "精靈王護石",
                    "猎魔耳环": "獄天耳飾",
					"凶神耳环": "妖精晶翅瓦哈"
                },
                "old": {
                    "饮血魔剑": "冥神槍毀滅苦痛",
                    "探险者手环": "旅者拳套",
                    "秃鹫手环": "深紅之爪",
                    "探险者耳环": "旅者頭巾",
                    "占星师的耳饰": "櫻花月夜簪",
                    "萌爪耳钉": "細冰姬的蝴蝶結"
                }
            },
            "ja": {
                "def": {
                    "探险者之剑": "旅立ちの剣",
                    "探险者短弓": "狩人の弓",
                    "探险者短杖": "香木の杖",
                    "狂信者的荣誉之刃": "妖刀血鴉",
                    "反叛者的刺杀弓": "アビスボウ",
                    "幽梦匕首": "天黒剣オブシウス",
                    "光辉法杖": "ロリポップステッキ",
                    "荆棘盾剑": "ガイアアクス",
                    "陨铁重剑": "星核剣エルツシュナイド",
                    "饮血魔剑": "カオスブレード",
                    "彩金长剑": "輝光剣アダマス",
                    "清澄长杖": "氷樹杖フロストスタッフ",

                    "探险者手环": "旅立ちのミサンガ",
                    "命师的传承手环": "ソフォスブレスレット",
                    "秃鹫手环": "パンクニードルバングル",
                    "海星戒指": "常盤の緑環",
                    "噬魔戒指": "深結晶ゼノクリスタル",
					"折光戒指": "雪華晶の指輪",

                    "探险者铁甲": "ヘビーメタルアーマー",
                    "探险者皮甲": "革のサロペット",
                    "探险者布甲": "旅立ちのローブ",
                    "旅法师的灵光袍": "魔導師のローブ",
                    "战线支撑者的荆棘重甲": "覇王樹の棘針鎧",
                    "复苏战衣": "翠緑の霊衣",
                    "挑战斗篷": "黒瑪瑙の祈装衣",

                    "探险者耳环": "旅立ちの耳環",
                    "占星师的耳饰": "海神の耳飾り",
                    "萌爪耳钉": "精霊王の護石",
                    "猎魔耳环": "獄天の耳飾り",
					"凶神耳环": "妖精晶翅ヴァハ"
                },
                "old": {
                    "饮血魔剑": "冥神槍ドゥームペイン",
                    "探险者手环": "旅立ちのパンチ",
                    "秃鹫手环": "クリムゾンクロー",
                    "探险者耳环": "旅立ちの頭巾",
                    "占星师的耳饰": "桜花の月夜簪",
                    "萌爪耳钉": "細氷姫の結び紐"
                }
            },
            "en": {
                "def": {
                    "探险者之剑": "Iron Blade",
                    "探险者短弓": "Hunter's Bow",
                    "探险者短杖": "Fragrant Wood Wand",
                    "狂信者的荣誉之刃": "Blood Raven Demon Blade",
                    "反叛者的刺杀弓": "Abyss Bow",
                    "幽梦匕首": "Heavenly Black Obsidian Sword",
                    "光辉法杖": "Lolipop Stick",
                    "荆棘盾剑": "Gaia Axe",
                    "陨铁重剑": "Star Core Sword - Erst Schneide",
                    "饮血魔剑": "Chaos Blade",
                    "彩金长剑": "Brilliant Sword - Adamas",
                    "清澄长杖": "IceTree Frost Staff",

                    "探险者手环": "Journey Bracelet",
                    "命师的传承手环": "Sophos Bracelet",
                    "秃鹫手环": "Punk Bangle",
                    "海星戒指": "Evergreen Ring",
                    "噬魔戒指": "Deep Crystalized Xenocrystal",
					"折光戒指": "Snow Crystal Ring",

                    "探险者铁甲": "Heavy Metal Armor",
                    "探险者皮甲": "Leather Overalls",
                    "探险者布甲": "Journey Robe",
                    "旅法师的灵光袍": "Magician's Robe",
                    "战线支撑者的荆棘重甲": "Thorn of the Great Tree Armor",
                    "复苏战衣": "Viridian Spiritual Dress",
                    "挑战斗篷": "Black Agate Prayer Dress",

                    "探险者耳环": "Journey Earrings",
                    "占星师的耳饰": "Ocean God's Earrings",
                    "萌爪耳钉": "Fairy King's Guardian Stone",
                    "猎魔耳环": "Heaven Hell Earrings",
					"凶神耳环": "Fairy Crystal Wings Vaha"
                },
                "old": {
                    "饮血魔剑": "Nether God Spear, Doom Pain",
                    "探险者手环": "Journey Punches",
                    "秃鹫手环": "Crimson Claw",
                    "探险者耳环": "Journey Hood",
                    "占星师的耳饰": "Moonlight Blossom Hairpin",
                    "萌爪耳钉": "Ice Princess Ribbon"
                }
            }
        },
        "CharName": {
            "intl": true,
            "sc": {
                "舞": "可可萝",
                "默": "镜华",
                "琳": "佩可莉姆",
                "艾": "璃乃",
                "梦": "忍",
                "薇": "碧",
                "伊": "伊莉亚",
                "冥": "布丁",
                "命": "宫子",
                "希": "克莉丝提娜",
                "霞": "香澄",
				"雅": "凯露",
				"绮": "智",
            },
            "tc": {
                "舞": "可可蘿",
                "默": "鏡華",
                "琳": "貪吃佩可",
                "艾": "璃乃",
                "梦": "忍",
                "薇": "碧",
                "伊": "伊莉亞",
                "冥": "布丁",
                "命": "宮子",
                "希": "克莉絲提娜",
                "霞": "霞",
                "雅": "凱留",
				"绮": "智",
            },
            "ja": {
                "舞": "コッコロ",
                "默": "キョウカ",
                "琳": "ペコリーヌ",
                "艾": "リノ",
                "梦": "シノブ",
                "薇": "アオイ",
                "伊": "イリヤ",
                "冥": "プリン",
                "命": "ミヤコ",
                "希": "クリスティーナ",
                "霞": "カスミ",
                "雅": "キャル",
				"绮": "トモ",
            },
            "en": {
                "舞": "Kokkoro",
                "默": "Kyouka",
                "琳": "Pecorine",
                "艾": "Rino",
                "梦": "Shinobu",
                "薇": "Aoi",
                "伊": "Ilya",
                "冥": "Pudding",
                "命": "Miyako",
                "希": "Christina",
                "霞": "Kasumi",
                "雅": "Kyaru",
				"绮": "Tomo",
            }
        },
        "Style": {
            "old": "0",
            "dfbacksize": "background-size:100% 100%;",
            "eqbacksize": "background-size:100% 100%;",
            "day": {
                "bgcr": "",
                "textcr": "",
            },
            "night": {
                "bgcr": "#141414",
                "textcr": "#b8b8b8",
                "panelcr": "#1d1d1d",
                "bordercr": "#333333",
                "linkcr": "#4a9eff"
            }
        }
    },
    /*
      内置主题包 Classic / Original
      Built-in ThemePacks

      Classic 对应 3.10.x 的 classicTheme（旧版风格主题包）:
      图标使用 inari old 图源，装备/物品/护身符使用主题名称，
      角色立绘、语音、Spine 看板娘均不可用。
    */
    Classic = {
        "INF": {
            "UID": "Classic",
            "Name": {
                "sc": "经典",
                "tc": "經典",
                "ja": "典型",
                "en": "Classic",
            },
            "Ver": [3, 10, 2],
            "Build": 250925001,
            "COMP": {
                "CharTachie": false,
                "MobsTachie": false,
                "ImageKanban": false,
                "SpineKanban": false,
                "CharSounds": false,
                "EquipIcons": true,
                "ItemIcons": true,
                "DessertIcons": true,
                "EquipThemeName": true,
                "ItemThemeName": true,
                "DessertThemeName": true,
                "CharThemeName": false,
                "MobsThemeName": false,
                "Style": true,
            },

        },
        "Style": {
            "old": "",
            "dfbacksize": "background-size:80% 80%;",
            "eqbacksize": "background-size:80% 80%;",
            "day": {
                "bgcr": "",
                "textcr": "",
            },
            "night": {
                "bgcr": "#141414",
                "textcr": "#b8b8b8",
                "panelcr": "#1d1d1d",
                "bordercr": "#333333",
                "linkcr": "#4a9eff"
            }
        },
        "EquipIcons": {
            "common": "https://p.inari.site/guguicons/old/",
            "ext": ".gif",
            "style": {
                "one": false,
                "mix": "background-blend-mode:overlay;background-color:",
                "t1": "#C0C0C0;",
                "t2": "#03B7CD;",
                "t3": "#38B03F;",
                "t4": "#F1A325;",
                "t5": "#EA644A;"
            },
            "defuri": {
                "探险者之剑": "sword_",
                "探险者短弓": "bow_",
                "探险者短杖": "staff_",
                "狂信者的荣誉之刃": "knife_",
                "反叛者的刺杀弓": "bow_",
                "幽梦匕首": "knife_",
                "光辉法杖": "staff_",
                "荆棘盾剑": "sword_",
                "陨铁重剑": "sword_",
                "饮血魔剑": "sword_",
                "彩金长剑": "sword_",
                "清澄长杖": "staff_",

                "探险者手环": "bracelet_",
                "命师的传承手环": "bracelet_",
                "秃鹫手环": "bracelet_",
                "海星戒指": "bracelet_",
                "噬魔戒指": "bracelet_",
				"折光戒指": "bracelet_",

                "探险者铁甲": "armour_",
                "探险者皮甲": "clothes_",
                "探险者布甲": "clothes_",
                "旅法师的灵光袍": "gown_",
                "战线支撑者的荆棘重甲": "armour_",
                "复苏战衣": "gown_",
                "挑战斗篷": "clothes_",

                "探险者耳环": "earring_",
                "占星师的耳饰": "earring_",
                "萌爪耳钉": "neko_",
                "猎魔耳环": "earring_",
				"凶神耳环": "earring_"
            },
            "olduri": {
                "饮血魔剑": "spear_",
                "探险者手环": "gloves_",
                "秃鹫手环": "gloves_",
                "探险者耳环": "swirl_",
                "占星师的耳饰": "swirl_",
                "萌爪耳钉": "swirl_"
            }
        },
        "ItemIcons": {
            "common": "https://p.inari.site/guguicons/old/",
            "ext": ".gif",
            "uri": {
                "体能刺激药水": "powerdrug",
                "锻造材料箱": "forgebox",
                "灵魂药水": "souldrug",
                "随机装备箱": "eqchest",
                "宝石原石": "gem",
                "光环天赋石": "halo",
                "苹果核": "fruitcore",
                "蓝锻造石": "loforge",
                "绿锻造石": "miforge",
                "金锻造石": "hiforge"
            }

        },
        "DessertIcons": {
            "common": "https://p.inari.site/guguicons/old/",
            "ext": ".gif",
            "style": {
                "one": true,
                "mix": "background-blend-mode:overlay;background-color:",
                "t3": "#38B03F;",
                "t4": "#F1A325;",
                "t5": "#EA644A;"
            },
            "uri": {
                "星铜苹果护身符": "apple",
                "蓝银葡萄护身符": "grape",
                "紫晶樱桃护身符": "cherry"
            },
        },
        "EquipThemeName": {
            "intl": true,
            "sc": {
                "def": {
                    "探险者之剑": "探险者之剑",
                    "探险者短弓": "探险者短弓",
                    "探险者短杖": "探险者短杖",
                    "狂信者的荣誉之刃": "狂信者的荣誉之刃",
                    "反叛者的刺杀弓": "反叛者的刺杀弓",
                    "幽梦匕首": "幽梦匕首",
                    "光辉法杖": "光辉法杖",
                    "荆棘盾剑": "荆棘盾剑",
                    "陨铁重剑": "陨铁重剑",
                    "饮血魔剑": "饮血魔剑",
                    "彩金长剑": "彩金长剑",
                    "清澄长杖": "清澄长杖",

                    "探险者手环": "探险者手环",
                    "命师的传承手环": "命师的传承手环",
                    "秃鹫手环": "秃鹫手环",
                    "海星戒指": "海星戒指",
                    "噬魔戒指": "噬魔戒指",
					"折光戒指": "折光戒指",

                    "探险者铁甲": "探险者铁甲",
                    "探险者皮甲": "探险者皮甲",
                    "探险者布甲": "探险者布甲",
                    "旅法师的灵光袍": "旅法师的灵光袍",
                    "战线支撑者的荆棘重甲": "战线支撑者的荆棘重甲",
                    "复苏战衣": "复苏战衣",
                    "挑战斗篷": "挑战斗篷",

                    "探险者耳环": "探险者耳环",
                    "占星师的耳饰": "占星师的耳饰",
                    "萌爪耳钉": "萌爪耳钉",
                    "猎魔耳环": "猎魔耳环",
					"凶神耳环": "凶神耳环"
                },
                "old": {
                    "荆棘盾剑": "荆棘剑盾",
                    "饮血魔剑": "饮血长枪",
                    "探险者手环": "探险者手套",
                    "秃鹫手环": "秃鹫手套",
                    "复苏战衣": "复苏木甲",
                    "探险者耳环": "探险者头巾",
                    "占星师的耳饰": "占星师的发饰",
                    "萌爪耳钉": "天使缎带"
                }
            },
            "tc": {
                "def": {
                    "探险者之剑": "探險者之劍",
                    "探险者短弓": "探險者短弓",
                    "探险者短杖": "探險者短杖",
                    "狂信者的荣誉之刃": "狂信者的榮譽之刃",
                    "反叛者的刺杀弓": "反叛者的刺殺弓",
                    "幽梦匕首": "幽夢匕首",
                    "光辉法杖": "光輝法杖",
                    "荆棘盾剑": "荊棘盾劍",
                    "陨铁重剑": "隕鐵重劍",
                    "饮血魔剑": "飲血魔劍",
                    "彩金长剑": "彩金長劍",
                    "清澄长杖": "清澄長杖",

                    "探险者手环": "探險者手環",
                    "命师的传承手环": "命師的傳承手環",
                    "秃鹫手环": "禿鷲手環",
                    "海星戒指": "海星戒指",
                    "噬魔戒指": "噬魔戒指",
					"折光戒指": "折光戒指",

                    "探险者铁甲": "探險者鐵甲",
                    "探险者皮甲": "探險者皮甲",
                    "探险者布甲": "探險者布甲",
                    "旅法师的灵光袍": "旅法師的靈光袍",
                    "战线支撑者的荆棘重甲": "戰線支撐者的荊棘重甲",
                    "复苏战衣": "復蘇戰衣",
                    "挑战斗篷": "挑戰鬥篷",

                    "探险者耳环": "探險者耳環",
                    "占星师的耳饰": "占星師的耳飾",
                    "萌爪耳钉": "萌爪耳釘",
                    "猎魔耳环": "獵魔耳環",
					"凶神耳环": "凶神耳環"
                },
                "old": {
                    "荆棘盾剑": "荊棘劍盾",
                    "饮血魔剑": "飲血長槍",
                    "探险者手环": "探險者手套",
                    "秃鹫手环": "禿鷲手套",
                    "复苏战衣": "復蘇木甲",
                    "探险者耳环": "探險者頭巾",
                    "占星师的耳饰": "占星師的髮飾",
                    "萌爪耳钉": "天使緞帶"
                }
            },
            "ja": {
                "def": {
                    "探险者之剑": "探検家の剣",
                    "探险者短弓": "探検家の弓",
                    "探险者短杖": "探検家の杖",
                    "狂信者的荣誉之刃": "狂信者の栄光刃",
                    "反叛者的刺杀弓": "反逆者の暗殺弓",
                    "幽梦匕首": "ダークドリーム匕首",
                    "光辉法杖": "輝く杖",
                    "荆棘盾剑": "いばら盾剣",
                    "陨铁重剑": "流星鉄のエペの剣",
                    "饮血魔剑": "血に飢えた魔剣",
                    "彩金长剑": "彩金長剣",
                    "清澄长杖": "澄み渡る長杖",

                    "探险者手环": "探検家の腕輪",
                    "命师的传承手环": "命の師匠の継承腕輪",
                    "秃鹫手环": "ハゲタカ腕輪",
                    "海星戒指": "海星指輪",
                    "噬魔戒指": "デビル・デバウラー指輪",
					"折光戒指": "屈折の指輪",

                    "探险者铁甲": "探検家の鎧",
                    "探险者皮甲": "探検家の革",
                    "探险者布甲": "探検家の衣",
                    "旅法师的灵光袍": "旅法師のローブ",
                    "战线支撑者的荆棘重甲": "フロントサポーターのトゲアーマー",
                    "复苏战衣": "蘇るスーツ",
                    "挑战斗篷": "挑戦者のマント",

                    "探险者耳环": "探検家のイヤリング",
                    "占星师的耳饰": "占星術師のイヤリング",
                    "萌爪耳钉": "萌え猫爪耳飾り",
                    "猎魔耳环": "獄天耳飾り",
					"凶神耳环": "凶神耳飾り",
                },
                "old": {
                    "荆棘盾剑": "いばら剣盾",
                    "饮血魔剑": "血に飢えた槍",
                    "探险者手环": "探検家の手袋",
                    "秃鹫手环": "ハゲタカ手袋",
                    "复苏战衣": "蘇るウッドアーマー",
                    "探险者耳环": "探検家のマフラー",
                    "占星师的耳饰": "占星術師の髪飾り",
                    "萌爪耳钉": "天使のリボン"
                }
            },
            "en": {
                "def": {
                    "探险者之剑": "Explorer's Sword",
                    "探险者短弓": "Explorer's Bow",
                    "探险者短杖": "Explorer's Staff",
                    "狂信者的荣誉之刃": "Honor Blade of crazy believer",
                    "反叛者的刺杀弓": "Rebel's assassination Bow",
                    "幽梦匕首": "Faint Dream Dagger",
                    "光辉法杖": "Shining Staff",
                    "荆棘盾剑": "Thorny shield Sword",
                    "陨铁重剑": "Meteoric iron Epee Sword",
                    "饮血魔剑": "Bloodthirsty demon Sword",
                    "彩金长剑": "Lottery Gold Sword",
                    "清澄长杖": "Clear Long Staff",

                    "探险者手环": "Explorer's Bracelet",
                    "命师的传承手环": "Sophos Bracelet",
                    "秃鹫手环": "Vulture Bracelet",
                    "海星戒指": "Starfish Ring",
                    "噬魔戒指": "Devil Devourer Ring",
					"折光戒指": "Refraction Ring",

                    "探险者铁甲": "Explorer's Armor",
                    "探险者皮甲": "Explorer's Leather",
                    "探险者布甲": "Explorer's Cloth",
                    "旅法师的灵光袍": "Magician's aura Robe",
                    "战线支撑者的荆棘重甲": "Thorny Armor of the front supporter",
                    "复苏战衣": "Recovery suit",
                    "挑战斗篷": "Challenger's Cloak",

                    "探险者耳环": "Explorer's Earrings",
                    "占星师的耳饰": "Astrologer's Earrings",
                    "萌爪耳钉": "Neko Claw Earrings",
                    "猎魔耳环": "Hunt Devil Earrings",
					"凶神耳环": "Evil God Earrings"
                },
                "old": {
                    "荆棘盾剑": "Thorny sword Shield",
                    "饮血魔剑": "Bloodthirsty Lance",
                    "探险者手环": "Explorer's Glove",
                    "秃鹫手环": "Vulture Glove",
                    "复苏战衣": "Revived wood armour",
                    "探险者耳环": "Explorer's Scarf",
                    "占星师的耳饰": "Astrologer's hair ornament",
                    "萌爪耳钉": "Angel's Ribbon"
                }
            }
        },
        "DessertThemeName": {
            "intl": true,
            "sc": {
                "lv": {
                    "稀有": "稀有",
                    "史诗": "史诗",
                    "传奇": "传奇"
                },
                "name": {
                    "星铜苹果护身符": "苹果护身符",
                    "蓝银葡萄护身符": "葡萄护身符",
                    "紫晶樱桃护身符": "樱桃护身符"
                },
            },
            "tc": {
                "lv": {
                    "稀有": "稀有",
                    "史诗": "史詩",
                    "传奇": "傳奇"
                },
                "name": {
                    "星铜苹果护身符": "蘋果護身符",
                    "蓝银葡萄护身符": "葡萄護身符",
                    "紫晶樱桃护身符": "櫻桃護身符"
                }
            },
            "ja": {
                "lv": {
                    "稀有": "レア",
                    "史诗": "大作",
                    "传奇": "伝説"
                },
                "name": {
                    "星铜苹果护身符": "林檎お守り",
                    "蓝银葡萄护身符": "葡萄お守り",
                    "紫晶樱桃护身符": "桜ん坊お守り"
                }
            },
            "en": {
                "lv": {
                    "稀有": "Rare   ",
                    "史诗": "Epic   ",
                    "传奇": "Legend "
                },
                "name": {
                    "星铜苹果护身符": "apple amulet",
                    "蓝银葡萄护身符": "grape amulet",
                    "紫晶樱桃护身符": "cherry amulet"
                }
            }
        },
        "ItemThemeName": {
            "intl": true,
            "sc": {
                "体能刺激药水": "体能刺激药水",
                "锻造材料箱": "锻造材料箱",
                "灵魂药水": "灵魂药水",
                "随机装备箱": "随机装备箱",
                "宝石原石": "宝石原石",
                "光环天赋石": "光环天赋石",
                "苹果核": "苹果核",
                "蓝锻造石": "蓝锻造石",
                "绿锻造石": "绿锻造石",
                "金锻造石": "金锻造石"
            },
            "tc": {
                "体能刺激药水": "體能刺激藥水",
                "锻造材料箱": "鍛造材料箱",
                "灵魂药水": "靈魂藥水",
                "随机装备箱": "隨機裝備箱",
                "宝石原石": "寶石原石",
                "光环天赋石": "光環天賦石",
                "苹果核": "蘋果核",
                "蓝锻造石": "藍鍛造石",
                "绿锻造石": "綠鍛造石",
                "金锻造石": "金鍛造石"
            },
            "ja": {
                "体能刺激药水": "身体刺激剤",
                "锻造材料箱": "鍛造用材料箱",
                "灵魂药水": "魂の薬",
                "随机装备箱": "ランダム装備箱",
                "宝石原石": "宝石原石",
                "光环天赋石": "光輪天賦石",
                "苹果核": "リンゴ核",
                "蓝锻造石": "青鍛造石",
                "绿锻造石": "緑鍛造石",
                "金锻造石": "金鍛造石"
            },
            "en": {
                "体能刺激药水": "Stamina Stimulant Potion",
                "锻造材料箱": "Forge Material Box",
                "灵魂药水": "Soul potion",
                "随机装备箱": "Random Equipment Chest",
                "宝石原石": "Original Gem Stone",
                "光环天赋石": "Halo Talent Stone",
                "苹果核": "Fruit Core",
                "蓝锻造石": "Blue Forge Stone",
                "绿锻造石": "Green Forge Stone",
                "金锻造石": "Gold Forge Stone"
            }
        }
    },
    /*
      Original 对应 3.10.x 的 originTheme（原生主题包）:
      所有主题组件均关闭，游戏原生图标与文案原样保留。
    */
    Original = {
        "INF": {
            "UID": "Original",
            "Name": {
                "sc": "原生",
                "tc": "原生",
                "ja": "ネイティブ",
                "en": "Original",
            },
            "Ver": [3, 10, 2],
            "Build": 250925001,
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
                "Style": true,
            },

        },
        "Style": {
            "old": "1",
            "dfbacksize": "background-size:80% 80%;",
            "eqbacksize": "background-size:100% 100%;",
            "day": {
                "bgcr": "",
                "textcr": "",
            },
            "night": {
                "bgcr": "#141414",
                "textcr": "#b8b8b8",
                "panelcr": "#1d1d1d",
                "bordercr": "#333333",
                "linkcr": "#4a9eff"
            }
        }
    };


/* 内置主题包注册表 Built-in ThemePack Registry */
const BuiltInThemes = {
    "testmain001": testmain001,
    "Classic": Classic,
    "Original": Original
};


/*
 游戏页面运行检测
 Game Page Running Check
*/
/* 插件国际化 Intl */
if (!localStorage.getItem("LangConf")) {
    LAConf = langConf.language;
    localStorage.setItem("LangConf", JSON.stringify(LAConf));
}
else {
    LAConf = JSON.parse(localStorage.getItem("LangConf"));
};

/* 插件加载时长检测 Loading Time Check */
function pluginLoadTime() {
    let loadTime = new Date().getTime() - timeCheck;
    console.log(lang[LAConf].msg.loadtime + loadTime + "ms");
};

/* 是否继续运行插件检测 Continue or Not Check */
let serverMaintenance = document.getElementsByClassName("row").length;
if (serverMaintenance == 0) {
    console.log(lang[LAConf].msg.initstop);
    pluginLoadTime();
    return;
};
if (($('.row>.panel>.panel-heading')[0] || {}).innerHTML == '\n\t登录\n\t') {
    console.log(lang[LAConf].msg.unlogin);
};


/*
  插件日间&夜间模式切换
  Day&Night Mode Switch
*/
let browserNightMode = false;

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
    if (event.matches) {
        browserNightMode = true;
    }
    else {
        browserNightMode = false;
    };
    /* 自动夜间模式开启时跟随系统实时切换 */
    if (MGRConf && MGRConf.AutoNight == "checked" && typeof nightCssSwitch == "function") {
        nightCssSwitch();
    };
});


/*
  环境变量初始化
  ENV Init
*/
/* 获取用户名 Get Username */
if ($("button[class*='btn btn-lg'][onclick*='fyg_index.php']").length == 0) {
    User = "_";
}
else {
    User = $("button[class*='btn btn-lg'][onclick*='fyg_index.php']")[0].innerText;
};

/* 从本地存储读取的部分 LocalStorage Part */
let MGRConf, nowTheme, playVoice = false, voiceConf = {};
if (!localStorage.getItem("MGR_β3_" + User + "_Conf")) {
    MGRConf = defConf;
    localStorage.setItem("MGR_β3_" + User + "_Conf", JSON.stringify(MGRConf));
}
else {
    MGRConf = JSON.parse(localStorage.getItem("MGR_β3_" + User + "_Conf"));
};
/* 配置键补齐与迁移 Config Key Repair & Migration */
let MGRConfDirty = false;
if (MGRConf.DarkModeON !== undefined) {
    /* 旧版本误用 DarkModeON 存储夜间模式开关，统一迁移到 NightMode */
    if (MGRConf.NightMode === undefined || MGRConf.NightMode === "") {
        MGRConf.NightMode = MGRConf.DarkModeON;
    };
    delete MGRConf.DarkModeON;
    MGRConfDirty = true;
};
Object.keys(defConf).forEach(function (k) {
    if (MGRConf[k] === undefined) {
        MGRConf[k] = defConf[k];
        MGRConfDirty = true;
    };
});
if (!isBuiltInTheme(MGRConf.ThemePack) && !localStorage.getItem("GTP_β3_" + MGRConf.ThemePack)) {
    /* 主题包失效（自定义主题被清除 / 名称变更）：回退到测试主题包 */
    MGRConf.ThemePack = testmain001.INF.UID;
    MGRConfDirty = true;
};
if (MGRConfDirty) {
    localStorage.setItem("MGR_β3_" + User + "_Conf", JSON.stringify(MGRConf));
};
if (!localStorage.getItem("LangConf_" + User)) {
    LAConf = langConf.language;
    localStorage.setItem("LangConf_" + User, JSON.stringify(LAConf));
}
else {
    LAConf = JSON.parse(localStorage.getItem("LangConf_" + User));
};
/* 主题包解析 Resolve ThemePack */
nowTheme = resolveThemePack(MGRConf.ThemePack, true);
if (nowTheme.INF.UID != MGRConf.ThemePack) {
    MGRConf.ThemePack = nowTheme.INF.UID;
    localStorage.setItem("MGR_β3_" + User + "_Conf", JSON.stringify(MGRConf));
};

/* 获取看板娘Pos信息 Get Kanban Pos Info */
let IMGPos;
if (localStorage.IMGPos) {
    IMGPos = JSON.parse(localStorage.IMGPos);


}
else {
    IMGPos = { "X": 10, "Y": 10 };
    localStorage.setItem("IMGPos", JSON.stringify(IMGPos));
};


/* 初始化 Init */
let SelLang = {
    "menu": lang[LAConf].menu,
    "msg": lang[LAConf].msg,
    "errors": lang[LAConf].errors,
    "dessert": lang[LAConf].dessert,
    "items": lang[LAConf].items,
    "equips": lang[LAConf].equips.def,
    "chars": lang[LAConf].chars,
    "mobs": lang[LAConf].mobs
};
let equips, dessert, items, chars = lang[LAConf].chars;
if (MGRConf.ThemeName == "") {
    equips = lang[LAConf].equips.def;
    dessert = lang[LAConf].dessert;
    items = lang[LAConf].items;

    if (MGRConf.OldName == "checked") {
        equips.荆棘盾剑 = lang[LAConf].equips.old.荆棘盾剑;
        equips.饮血魔剑 = lang[LAConf].equips.old.饮血魔剑;
        equips.探险者手环 = lang[LAConf].equips.old.探险者手环;
        equips.秃鹫手环 = lang[LAConf].equips.old.秃鹫手环;
        equips.复苏战衣 = lang[LAConf].equips.old.复苏战衣;
        equips.探险者耳环 = lang[LAConf].equips.old.探险者耳环;
        equips.占星师的耳饰 = lang[LAConf].equips.old.占星师的耳饰;
        equips.萌爪耳钉 = lang[LAConf].equips.old.萌爪耳钉;
    };
}
else if (MGRConf.ThemeName == "checked" &&
    nowTheme.INF.COMP.EquipThemeName && nowTheme.EquipThemeName &&
    nowTheme.INF.COMP.ItemThemeName && nowTheme.ItemThemeName &&
    nowTheme.INF.COMP.DessertThemeName && nowTheme.DessertThemeName) {
    let tempOldEqName;
    if (nowTheme.EquipThemeName.intl) {
        equips = nowTheme.EquipThemeName[LAConf].def;
        tempOldEqName = nowTheme.EquipThemeName[LAConf].old;

    }
    else {
        equips = nowTheme.EquipThemeName.sl.def;
        tempOldEqName = nowTheme.EquipThemeName.sl.old;
    };
    nowTheme.DessertThemeName.intl ? dessert = nowTheme.DessertThemeName[LAConf] : dessert = nowTheme.DessertThemeName.sl;
    nowTheme.ItemThemeName.intl ? items = nowTheme.ItemThemeName[LAConf] : items = nowTheme.ItemThemeName.sl;
    if (MGRConf.OldName == "checked") {
        if (tempOldEqName.荆棘盾剑) equips.荆棘盾剑 = tempOldEqName.荆棘盾剑;
        if (tempOldEqName.饮血魔剑) equips.饮血魔剑 = tempOldEqName.饮血魔剑;
        if (tempOldEqName.探险者手环) equips.探险者手环 = tempOldEqName.探险者手环;
        if (tempOldEqName.秃鹫手环) equips.秃鹫手环 = tempOldEqName.秃鹫手环;
        if (tempOldEqName.复苏战衣) equips.复苏战衣 = tempOldEqName.复苏战衣;
        if (tempOldEqName.探险者耳环) equips.探险者耳环 = tempOldEqName.探险者耳环;
        if (tempOldEqName.占星师的耳饰) equips.占星师的耳饰 = tempOldEqName.占星师的耳饰;
        if (tempOldEqName.萌爪耳钉) equips.萌爪耳钉 = tempOldEqName.萌爪耳钉;
    };
}
else {
    /* 主题包未提供主题名称组件：回退到语言内置名称 */
    equips = lang[LAConf].equips.def;
    dessert = lang[LAConf].dessert;
    items = lang[LAConf].items;
    if (MGRConf.OldName == "checked") {
        equips.荆棘盾剑 = lang[LAConf].equips.old.荆棘盾剑;
        equips.饮血魔剑 = lang[LAConf].equips.old.饮血魔剑;
        equips.探险者手环 = lang[LAConf].equips.old.探险者手环;
        equips.秃鹫手环 = lang[LAConf].equips.old.秃鹫手环;
        equips.复苏战衣 = lang[LAConf].equips.old.复苏战衣;
        equips.探险者耳环 = lang[LAConf].equips.old.探险者耳环;
        equips.占星师的耳饰 = lang[LAConf].equips.old.占星师的耳饰;
        equips.萌爪耳钉 = lang[LAConf].equips.old.萌爪耳钉;
    };
};
if (MGRConf.CharName == "checked" && nowTheme.INF.COMP.CharThemeName && nowTheme.CharName) {
    nowTheme.CharName.intl ? chars = nowTheme.CharName[LAConf] : chars = nowTheme.CharName.sl;
}
SelLang.equips = equips;
SelLang.dessert = dessert;
SelLang.items = items;
SelLang.chars = chars;
let err = SelLang.errors;
/* All Kanban Pre init */


function themeGetClass(type) {
    if (typeof GTSpineKanban != "undefined" && GTSpineKanban && typeof GTSpineKanban.getClass == "function") {
        return GTSpineKanban.getClass(type);
    };
    /* 模块不在时的兜底：引擎的规则就是补零到两位 */
    let t = parseInt(type);
    if (!(t > 0)) { return "00"; };
    return t < 10 ? "0" + t : String(t);
};
/* The six URLs for one character, using the same formulas spineload() uses. */
function assetUrlsFor(assest, uri, info, cls) {
    if (!assest || !uri) { return []; };
    let baseId = info && info.hasSpecialBase ? uri : assest.baseId;
    let urls = [assest.common + baseId + assest.skeleton];
    let list = assest.addAnimations || [];
    for (let i = 0; i < list.length; i++) {
        urls.push(assest.common + baseId + '_' + list[i] + assest.ext);
    };
    urls.push(assest.common + themeGetClass(cls) + assest.type);
    urls.push(assest.unit + uri + assest.skill);
    urls.push(assest.unit + uri + assest.texture.pos);
    urls.push(assest.unit + uri + assest.texture.img);
    return urls;
};

function themeAssetUrls(theme, opts) {
    opts = opts || {};
    let urls = [];
    function add(u, optional) {
        if (!u || typeof u != 'string') { return; };
        /* an inline data URI is already local: nothing to warm */
        if (u.indexOf('data:') === 0) { return; };
        let seen = -1;
        for (let i = 0; i < urls.length; i++) { if (urls[i].u == u) { seen = i; break; }; };
        if (seen < 0) { urls.push({ u: u, optional: !!optional }); }
        /* a URL required by one caller and optional for another is required overall */
        else if (!optional) { urls[seen].optional = false; };
    };
    function addAll(list, optional) {
        for (let i = 0; i < list.length; i++) { add(list[i], optional); };
    };
    if (!theme) { return urls; };
    let COMP = (theme.INF && theme.INF.COMP) || {};
    let names = opts.names || null;

    /* ---- spine kanban ---- */
    if (COMP.SpineKanban && theme.SpineKanban && theme.SpineKanban.assest) {
        let assest = theme.SpineKanban.assest;
        let conf = theme.SpineKanban.conf || {};
        let list = names || Object.keys(conf);
        let classes = opts.classes;
        if (!classes || !classes.length) { classes = [1, 2, 3]; };
        for (let i = 0; i < list.length; i++) {
            let info = conf[list[i]] || conf.fallback || {};
            let cls = parseInt(info.type);
            addAll(assetUrlsFor(assest, info.uri, info, cls));
            for (let c = 0; c < classes.length; c++) {
                if (classes[c] == cls) { continue; };
                addAll(assetUrlsFor(assest, info.uri, info, classes[c]));
            };
        };
        if (theme.SpineKanban.bg && theme.SpineKanban.bg.url) { add(theme.SpineKanban.bg.url); };
    };

    /* ---- character tachie (立绘) ---- */
    if (COMP.CharTachie && theme.CharTachie && theme.CharTachie.uri) {
        let t = theme.CharTachie;
        let keys = names || Object.keys(t.uri);
        for (let i = 0; i < keys.length; i++) {
            let k = keys[i];
            if (!t.uri[k]) { continue; };
            let base = t.common + t.uri[k];
            /* every pose table the theme declares, so one pass covers them all */
            let poses = ['HeadFG', 'LeftFG', 'CG', 'LeftPKFG', 'RightPKFG'];
            for (let p = 0; p < poses.length; p++) {
                let v = t[poses[p]] && t[poses[p]][k];
                if (v !== undefined && v !== null) { add(base + v + (t.ext || '')); };
            };
        };
    };

    /* ---- creature art ---- */
    if (COMP.MobsTachie && theme.MobsTachie && theme.MobsTachie.uri) {
        let t = theme.MobsTachie;
        for (let k of Object.keys(t.uri)) { add(t.common + t.uri[k] + (t.ext || '')); };
    };

    /* ---- voice ---- */
    if (COMP.CharSounds && theme.CharSounds && theme.CharSounds.uri) {
        let t = theme.CharSounds;
        let ext = t.ext || '.mp3';
        if (t.uri.on) { add(t.common + t.uri.on + ext); };
        if (t.uri.off) { add(t.common + t.uri.off + ext); };
        let conf = t.conf || {};
        let keys = names || Object.keys(conf);
        let cues = ['levelup', 'colle', 'change', 'power', 'win', 'lose', 'reset', 'exp', 'battle'];
        for (let i = 0; i < keys.length; i++) {
            let k = keys[i];
            let entry = conf[k];
            
            let uri = (entry && typeof entry == 'object' && entry.uri) ? entry.uri : t.uri[k];
            if (!uri) { continue; };
            let base = t.common + uri;
            if (base.charAt(base.length - 1) != '/') { base += '/'; };
            if (entry && typeof entry == 'object') {
                for (let type of Object.keys(entry)) {
                    if (type == 'uri') { continue; };
                    let v = entry[type];
                    if (v === undefined || v === null || v === '') { continue; };
                    /* a list means variants of one cue: warm them all */
                    if (Array.isArray(v)) {
                        for (let n = 0; n < v.length; n++) { add(base + v[n] + ext); };
                    }
                    else { add(base + v + ext); };
                };
            }
            else {
                /* no per-character table: the conventional cue names still apply */
                for (let c = 0; c < cues.length; c++) { add(base + cues[c] + ext); };
                for (let n = 0; n < 4; n++) { add(base + n + ext); };
            };
        };
    };

    let ICON_LEVELS = ['0', '1', '2', '3', '4', '5'];      /* equipment colour tiers */
    let DESSERT_VARIANTS = ['', '_1', '_2', '_3'];          /* base + three qualities */
    /* style.one === true 表示「每项单图」：额外的档位/品质变体根本不存在，
       主题配置已经说清了形状，不该再去生成、更不该请求 —— 每探一个就是一条 404。 */
    function isOneStyle(info) {
        return !!(info && info.style && info.style.one === true);
    };

    /* equipment: 两张表，值是目录，文件 = <dir><档位><ext> */
    if (COMP.EquipIcons && theme.EquipIcons) {
        let t = theme.EquipIcons;
        let ext = t.ext || '.gif';
        let one = isOneStyle(t);
        /* 单图只有 0 档；否则 0..5（0 素色，1-5 颜色档） */
        let levels = one ? ['0'] : ICON_LEVELS;
        for (let tableName of ['defuri', 'olduri']) {
            let table = t[tableName];
            if (!table) { continue; };
            for (let k of Object.keys(table)) {
                let dir = String(table[k]);
                if (dir.charAt(dir.length - 1) != '/') { dir += '/'; };
                for (let n = 0; n < levels.length; n++) {
                    /* 单图模式主题必须提供；多档模式允许只出部分档位 */
                    add(t.common + dir + levels[n] + ext, !one);
                };
            };
        };
    };

    /* desserts: 表里存的是**文件名主干**（不是目录），后面按需接品质后缀。
       真实包: common = ".../test/eq/", uri['星铜苹果护身符'] = "apple", style.one = true,
       实际文件是 eq/apple.gif。（早期版本把它当目录又重新拼了一次，生成
       eq/apple/apple.gif —— 12 条必然 404；下面的 ItemIcons 一直是对的。） */
    if (COMP.DessertIcons && theme.DessertIcons && theme.DessertIcons.uri) {
        let t = theme.DessertIcons;
        let ext = t.ext || '.gif';
        let one = isOneStyle(t);
        let variants = one ? [''] : DESSERT_VARIANTS;
        for (let k of Object.keys(t.uri)) {
            let stem = String(t.uri[k]);
            for (let n = 0; n < variants.length; n++) {
                /* 品质变体同样：非单图时才存在，且仍算可选（包可能只提供部分品质） */
                add(t.common + stem + variants[n] + ext, !one && n > 0);
            };
        };
    };

    /* items: the table already holds the filename stem */
    if (COMP.ItemIcons && theme.ItemIcons && theme.ItemIcons.uri) {
        let t = theme.ItemIcons;
        let ext = t.ext || '.gif';
        for (let k of Object.keys(t.uri)) { add(t.common + t.uri[k] + ext); };
    };

    /* ---- image kanban + background ---- */
    if (COMP.ImageKanban && theme.ImageKanban && theme.ImageKanban.uri) {
        let t = theme.ImageKanban;
        let a = t.asset || {};
        let keys = names || Object.keys(t.uri);
        for (let i = 0; i < keys.length; i++) {
            let k = keys[i];
            if (!t.uri[k]) { continue; };
            let poses = ['idle', 'win', 'lose'];
            for (let p = 0; p < poses.length; p++) {
                let v = t[poses[p]] && t[poses[p]][k];
                if (v !== undefined && v !== null) {
                    add(a.common + t.uri[k] + v + (a.ext || ''));
                };
            };
        };
    };
    if (theme.ImageKanban && theme.ImageKanban.bg) { add(theme.ImageKanban.bg); };
    if (theme.Style && theme.Style.kanbanbg) { add(theme.Style.kanbanbg); };

    return urls;
};

/* ==========================================================================
   资源预加载 / 本地缓存 Resource Preload + Cache
   --------------------------------------------------------------------------
   预加载的全部逻辑都在这里。看板模块只提供两件与预加载无关的通用能力：
     · storeAsset(url, bytes) —— 把已经下载到的字节写进本地缓存
     · setCacheScopeFromTheme(theme) —— 告诉缓存当前的键前缀
   下载策略（并发、CORS 降级、统计口径）属于宿主，不属于看板 API。

   文案全部走 SelLang.msg（见 lang 表的 preload* / cache* 键），与插件其余部分一致。

   为什么需要降级：有些 CDN 不返回 Access-Control-Allow-Origin，文件照样 200 送达，
   但 JS 读不到响应体。这时改用 no-cors 请求（甚至 Image 元素）仍能让浏览器把文件
   存进 HTTP 缓存 —— 预加载的目的只是「让文件进缓存」，不是「读到内容」。
   ========================================================================== */

/* 取一条本地化文案并填充 {占位符}。文案缺失时回退到键名，绝不抛异常。 */
function tpmT(key, vars) {
    let s = (SelLang && SelLang.msg && SelLang.msg[key]);
    if (typeof s != "string") { return key; };
    if (vars) {
        for (let k in vars) {
            if (Object.prototype.hasOwnProperty.call(vars, k)) {
                s = s.split("{" + k + "}").join(String(vars[k]));
            };
        };
    };
    return s;
};

/* 把缓存作用域指向当前主题：模块用它拼缓存键。读不到 UID 时视为「不缓存」。 */
function syncCacheScope() {
    if (typeof GTSpineKanban == "undefined" || !GTSpineKanban || typeof GTSpineKanban.setCacheScopeFromTheme != "function") {
        return null;
    };
    return GTSpineKanban.setCacheScopeFromTheme(nowTheme);
};

/* 把已读到的字节写进本地缓存（模块负责存储，我们负责决定写什么）。
   写失败不能冒泡成未处理的 rejection —— 缓存出问题绝不该影响看板娘。 */
function storeAsset(url, buf) {
    if (typeof GTSpineKanban == "undefined" || !GTSpineKanban || typeof GTSpineKanban.storeAsset != "function") {
        return false;
    };
    try {
        let p = GTSpineKanban.storeAsset(url, buf);
        if (p && typeof p["catch"] == "function") { p["catch"](function () { }); };
    } catch (e) { return false; };
    return true;
};

/* 不需要读响应体，只要让浏览器把文件抓进缓存 */
function warmNoCors(url) {
    return fetch(url, { mode: "no-cors", credentials: "omit" })
        /* 只在真的拿到 opaque 响应时才算成功。连接被重置 / 被中止时 fetch 会 reject，
           不能把它记成「已暖缓存」—— 那会把失败说成成功。 */
        .then(function (res) { return !!(res && res.type == "opaque"); })
        ["catch"](function () { return false; });
};

/* 最后兜底：图片加载是普通请求，同样会进 HTTP 缓存 */
function warmImage(url) {
    if (typeof Image != "function") { return Promise.resolve(false); };
    return new Promise(function (resolve) {
        let img = new Image(), done = false;
        function finish(ok) { if (done) { return; }; done = true; resolve(ok); };
        img.onload = function () { finish(true); };
        img.onerror = function () { finish(false); };
        img.src = url;
        setTimeout(function () { finish(false); }, 8000);
    });
};

/* 预加载一批 URL。返回 { done, warmed, missing, skipped, blocked, failedWarm, total, errors }。
   blocked 保留为 0 恒值，仅为兼容旧调用方的字段读取。

   为什么可选资源走另一条路：可选资源的存在与否**不影响任何结果**（有就进缓存，
   没有就本来不需要），所以不需要先探测一次。而且探测必然产生一条
   「blocked by CORS policy / net::ERR_FAILED」，每个可选资源两行 —— 有 225 个
   可选资源时控制台会被这类**无害的**报错淹没，把真正的失败盖掉。
   直接一次 no-cors：有就暖到，没有就罢，控制台一行不刷。 */
function preloadUrls(urls, onProgress) {
    let total = urls.length;
    let done = 0, warmed = 0, missing = 0, skipped = 0, blocked = 0, failedWarm = 0;
    let errors = [];
    function tick(url) { if (typeof onProgress == "function") { onProgress(done + warmed + missing + skipped + blocked + failedWarm, total, url); }; };

    return Promise.all(urls.map(function (entry) {
        let url = typeof entry == "string" ? entry : entry.u;
        let optional = typeof entry == "string" ? false : !!entry.optional;
        /* warmOnly：宿主已经知道「这份资源服务器不给脚本读」。对它做 cors 探测只有两个结果：
           读不到（照旧），或者在控制台留下 blocked by CORS policy + net::ERR_FAILED 两条。
           探测唯一能换来的是「404 → 缺失」这个分类；宿主不需要时就不该付这份噪音。 */
        let warmOnly = typeof entry == "string" ? false : !!entry.warmOnly;

        /* 可选：一次 no-cors 就够，成不成都不报错 */
        if (optional || warmOnly) {
            return warmNoCors(url).then(function (ok) {
                if (ok) { warmed++; } else if (optional) { skipped++; } else { failedWarm++; };
                tick(url);
                return 0;
            });
        };

        function countMissing(why) {
            missing++;
            if (errors.length < 20) { errors.push({ url: url, why: why }); };
            tick(url);
        };

        return fetch(url, { mode: "cors", credentials: "omit" })
            .then(function (res) {
                if (res.status >= 400) {
                    let err = new Error("HTTP " + res.status);
                    err.http = res.status;
                    throw err;
                };
                return res.arrayBuffer();
            })
            .then(function (buf) {
                done++;
                storeAsset(url, buf);
                tick(url);
                return buf.byteLength;
            })
            ["catch"](function (err) {
                if (err && err.http) { countMissing("HTTP " + err.http); return 0; };
                /* 不是 HTTP 状态码：请求本身失败 —— 最常见的原因是服务器没给
                   Access-Control-Allow-Origin，浏览器因此不把响应体交给脚本。
                   这**不代表文件不存在**：DevTools 会同时显示 200 (OK) 和
                   net::ERR_FAILED，很容易被误读成下载失败。
                   换 no-cors 暖磁盘缓存（它不产生「blocked by CORS policy」）。 */
                return warmNoCors(url).then(function (ok) {
                    if (ok) { warmed++; tick(url); return 0; };
                    return warmImage(url).then(function (ok2) {
                        if (ok2) { warmed++; tick(url); return 0; };
                        /* 暖缓存也没成（常见于连接被重置）。这不是「服务器没有该文件」，
                           也不能算成功 —— 单独计数，下次预加载会自然重试。 */
                        failedWarm++;
                        if (errors.length < 20) { errors.push({ url: url, why: tpmT("preloadWarmFail", { fail: 1 }) }); };
                        tick(url);
                        return 0;
                    });
                });
            });
    })).then(function () {
        return { done: done, warmed: warmed, missing: missing, skipped: skipped,
                 blocked: blocked, failedWarm: failedWarm, total: total, errors: errors };
    });
};

/* 浏览器的实际存储用量 vs 配额。用来一眼排除「配额不够」这个方向的怀疑 ——
   那 447 个进不了本地库是因为读不到内容（CORS），跟配额无关。 */
function fetchStorageEstimate() {
    if (typeof navigator == "undefined" || !navigator.storage || typeof navigator.storage.estimate != "function") {
        return Promise.resolve(null);
    };
    return navigator.storage.estimate().then(function (e) {
        return { usage: e.usage || 0, quota: e.quota || 0 };
    })["catch"](function () { return null; });
};

function storageLine(e) {
    if (!e) { return "n/a"; };
    return (e.usage / 1048576).toFixed(1) + " MB / "
        + (e.quota / 1073741824).toFixed(1) + " GB";
};

/* 哪些资源值得用 cors 去读（读到了既能进本地库、又能把 404 报准）。
   判据不写死域名，而是从**模块自己加载的那批文件**推出来：引擎要读骨架和贴图，
   它们一定能被脚本读到，所以它们所在的域就是「可读域」；同一域上的其它资源
   （语音 / 立绘 / 图标）也就同样可读。域不同的一律标记 warmOnly。
   实测收益：p.inari.site 那 258 个必加载资源每次读不到却要刷 500+ 行报错。 */
function readableHostOf(list) {
    for (let i = 0; i < list.length; i++) {
        let u = typeof list[i] == "string" ? list[i] : list[i].u;
        if (/\.cysp(\?|$)/.test(u) || /\.atlas(\?|$)/.test(u)) {
            let m = /^https?:\/\/([^\/]+)/.exec(u);
            if (m) { return m[1]; };
        };
    };
    return null;
};

function preloadThemeAssets() {
    if (typeof GTSpineKanban == "undefined" || !GTSpineKanban) {
        console.warn("ThemePack: " + tpmT("preloadNoModule"));
        return;
    };
    if (!nowTheme) { console.log("ThemePack: " + tpmT("preloadNoTheme")); return; };
    if (typeof themeAssetUrls != "function") { console.warn("ThemePack: " + tpmT("preloadNoInventory")); return; };

    syncCacheScope();
    let urls;
    try { urls = themeAssetUrls(nowTheme); }
    catch (e) { console.warn("ThemePack: " + tpmT("preloadInventoryFail"), e); return; };
    if (!urls.length) { console.log("ThemePack: " + tpmT("preloadNothing")); return; };

    /* 标记出「读也读不到」的那些，让它们走一次 no-cors 就好 */
    let readable = readableHostOf(urls);
    if (readable) {
        for (let i = 0; i < urls.length; i++) {
            let e = urls[i];
            let u = typeof e == "string" ? e : e.u;
            let m = /^https?:\/\/([^\/]+)/.exec(u);
            if (m && m[1] != readable) {
                if (typeof e == "string") { urls[i] = { u: e, warmOnly: true }; }
                else { e.warmOnly = true; };
            };
        };
    };

    let $btn = $(".tpmSetting#KanbanPreload");
    let $row = $(".tpmSetting#KanbanPreloadNote");
    let label = $btn.length ? $btn[0].value : null;
    let t0 = Date.now();
    if ($btn.length) { $btn[0].disabled = true; $btn[0].value = tpmT("preloadProgress", { n: 0, total: urls.length }); };

    preloadUrls(urls, function (n, total) {
        /* 按钮与菜单行都跟着进度更新，用户不开控制台也能看到在动 */
        let txt = tpmT("preloadProgress", { n: n, total: total });
        if ($btn.length) { $btn[0].value = txt; };
        if ($row.length) { $row[0].textContent = txt; };
    }).then(function (r) {
        let secs = ((Date.now() - t0) / 1000).toFixed(1);
        let fail = r.failedWarm ? tpmT("preloadFailPart", { n: r.failedWarm }) : "";
        let miss = r.missing ? tpmT("preloadMissPart", { n: r.missing }) : "";
        let skip = r.skipped ? tpmT("preloadSkipPart", { n: r.skipped }) : "";
        console.log("ThemePack: " + tpmT("preloadDone", { ok: r.done + r.warmed + r.missing + r.skipped,
            total: r.total, read: r.done, warm: r.warmed, fail: fail, miss: miss, skip: skip, secs: secs }));
        /* 面板数字只反映本地库。能读到的才进本地库；其余只进浏览器磁盘缓存，
           面板看不到 —— 这不是失效，两处存储本来就是分开的。 */
        if (r.warmed) { console.log("ThemePack: " + tpmT("preloadWarmNote", { warm: r.warmed })); };
        if (r.failedWarm) { console.warn("ThemePack: " + tpmT("preloadWarmFail", { fail: r.failedWarm })); };
        if (r.errors.length) {
            console.log("ThemePack: " + tpmT("preloadErrors"));
            r.errors.slice(0, 6).forEach(function (e) { console.log("   " + e.why + "  " + e.url); });
        };
        /* 报告本地缓存的实际写入情况（模块侧统计） */
        if (typeof GTSpineKanban.cacheDiag == "function") {
            let d = GTSpineKanban.cacheDiag();
            console.log("ThemePack: " + tpmT("preloadCacheWrite", { stored: d.stored, tried: d.tried, putFailed: d.putFailed })
                + (d.off ? tpmT("preloadCacheOff", { reason: d.offReason }) : "")
                + (d.lastError ? tpmT("preloadCacheLastErr", { err: d.lastError }) : ""));
            if (!d.scope) { console.warn("ThemePack: " + tpmT("preloadNoScope")); };
        };
        if ($btn.length) { $btn[0].disabled = false; $btn[0].value = label; };
        if ($row.length) {
            $row[0].textContent = (r.missing ? tpmT("preloadMissing", { n: r.missing }) : "")
                + (r.skipped ? " " + tpmT("preloadSkipped", { n: r.skipped }) : "")
                || tpmT("preloadNote");
        };
        if (r.missing) { console.warn("ThemePack: " + tpmT("preloadMissing", { n: r.missing })); };
        if (r.skipped) { console.log("ThemePack: " + tpmT("preloadSkipped", { n: r.skipped })); };
        /* 把浏览器分配到的配额也报出来：进不了本地库与配额无关。 */
        fetchStorageEstimate().then(function (est) {
            console.log("ThemePack: " + tpmT("preloadStorageLine", { used: storageLine(est) }));
        });
    });
};

/* 报告本地缓存占用，并顺手申请一次持久化存储（浏览器可能拒绝，不影响功能）。 */
function refreshCacheInfo() {
    if (typeof GTSpineKanban == "undefined" || !GTSpineKanban) { return; };
    let $info = $(".tpmSetting#KanbanCacheInfo");
    if (typeof GTSpineKanban.requestPersistentStorage == "function") {
        GTSpineKanban.requestPersistentStorage();
    };
    if (typeof GTSpineKanban.cacheStats != "function") { return; };
    GTSpineKanban.cacheStats().then(function (s) {
        let mb = (s.bytes / 1048576).toFixed(1);
        let themes = Object.keys(s.byTheme || {}).join(", ");
        return fetchStorageEstimate().then(function (est) {
            if ($info.length) {
                $info[0].textContent = (s.entries
                    ? tpmT("cacheEntries", { n: s.entries, size: mb, themes: themes })
                    : tpmT("cacheEmpty"))
                    + tpmT("cacheStorage", { used: storageLine(est) });
            };
        });
    });
};

/* 清掉本地缓存。默认只清当前主题；清完下次加载会重新联网。 */
function clearAssetCache(allThemes) {
    if (typeof GTSpineKanban == "undefined" || typeof GTSpineKanban.clearCache != "function") { return; };
    let uid = null;
    if (!allThemes && nowTheme && nowTheme.INF && nowTheme.INF.UID) { uid = String(nowTheme.INF.UID); };
    GTSpineKanban.clearCache(uid).then(function (n) {
        console.log("ThemePack: " + tpmT("cacheCleared", { n: n,
            which: uid ? tpmT("cacheClearedTheme", { uid: uid }) : tpmT("cacheClearedAll") }));
        refreshCacheInfo();
    });
};
/* drag component: shared by every kanban kind; judge by hold >= 0.2s or move > 2px */
const KANBAN_DRAG_HOLD_MS = 200;
function dragfunc(obj, hooks) {
    hooks = hooks || {};
    if (!obj) { return; };
    let rt = IMGPos.X, bo = IMGPos.Y, ww, wh, start = null;

    obj.onmousedown = function (event) {
        event = event || window.event;
        if (typeof hooks.onHit == "function" && !hooks.onHit(event.clientX, event.clientY)) { return; };
        obj.setCapture && obj.setCapture();
        /* re-arm the once-per-drag hook for THIS press */
        let once = hooks.onDragStart;
        let ol = event.clientX - obj.offsetLeft,
            ot = event.clientY - obj.offsetTop,
            cw = obj.clientWidth,
            ch = obj.clientHeight,
            downX = event.clientX,
            downY = event.clientY,
            moved = false;
        ww = $(window).width();
        wh = $(window).height();
        start = { t: Date.now(), rt: rt, bo: bo, cx: event.clientX, cy: event.clientY };

        document.onmousemove = function (event) {
            event = event || window.event;
            if (Math.abs(event.clientX - downX) > 2 || Math.abs(event.clientY - downY) > 2) {
                moved = true;
            };
            rt = ww + ol - event.clientX - cw;
            bo = wh + ot - event.clientY - ch;
            if (ol - event.clientX > 0) { rt = ww - cw; };
            if (ot - event.clientY > 0) { bo = wh - ch; };
            if (rt < 200 - cw && rt < 0) { rt = 200 - cw; };
            if (bo < 200 - ch && bo < 0) { bo = 200 - ch; };
            obj.style.right = rt + "px";
            obj.style.bottom = bo + "px";
            if (moved && once) { let f = once; once = null; f(); };
        };

        document.onmouseup = function () {
            document.onmousemove = null; document.onmouseup = null;
            obj.releaseCapture && obj.releaseCapture();
            let held = Date.now() - start.t;
            if (moved || held >= KANBAN_DRAG_HOLD_MS) {
                if (typeof hooks.onDragEnd == "function") { hooks.onDragEnd(rt, bo); };
            }
            else {
                /* 位置未变化 => 视为点击。把按下点交给宿主：
                   宿主可能要靠它判断「点中的是不是角色」（见 hitTest）。 */
                if (typeof hooks.onClick == "function") { hooks.onClick(start.cx, start.cy); };
            };
            start = null;
        };
        return false;
    };

    obj.addEventListener('touchmove', function (event) {
        event.preventDefault();
        if (event.targetTouches.length != 1) { return; };
        let touch = event.targetTouches[0];
        ww = $(window).width();
        wh = $(window).height();
        if (touch.clientX >= 0) {
            if (touch.clientX < ww - 300) { obj.style.right = (ww - touch.clientX - obj.clientWidth) + 'px'; }
            else { obj.style.right = '0px'; };
        } else { obj.style.right = (ww - obj.clientWidth) + 'px'; };
        if (touch.clientY >= 0) {
            if (touch.clientY < wh - 300) { obj.style.bottom = (wh - touch.clientY - obj.clientHeight) + 'px'; }
            else { obj.style.bottom = '0px'; };
        } else { obj.style.bottom = (wh - obj.clientHeight) + 'px'; };
    }, { passive: false });
};

function spineLibReady() {
    return typeof spine != "undefined" && !!spine && !!spine.webgl;
};
/* 看板模块是否就绪（@require 失败时为 undefined，此时不启用 Spine 看板娘） */
function spineModuleReady() {
    return typeof GTSpineKanban != "undefined" && !!GTSpineKanban && typeof GTSpineKanban.attach == "function";
};
/* 由 insKanbanHTML() 在图/骨模式之间选择后绑定，供战斗与换人等钩子调用。 */
let spineKanban = null;

/* 看板娘 DOM，以及"当前这块看板娘"的资源/动画配置。
   KanbanAssest / CharStatus 在两套看板娘里含义不同：
     - Spine 模式：主题的 SpineKanban.assest / conf[角色]，但引擎真正用的是模块自己那份，
                   这里的副本只供点击/胜负动作取 anim 常量与图片模式拼 URL。
     - 图片模式：主题的 ImageKanban.asset / idle。
   Spine 引擎的其余运行时状态（pagetype / loading / 动画缓存 …）
   现在完全归 gt-spine-kanban 模块所有，通过 spineKanban 实例的方法读写，
   这里不再保留副本（保留只会是永不生效的假状态）。 */
let KanbanSel, KanbanBG, KanbanCommon, KanbanSkill, KanbanCharUri, KanbanAssest, CharStatus;
let spinePagetype = 0;




/*
  核心组件
  Core COMP
*/

/* 自定义主题组件 Custom COMP */
function cloneJSON(v) {
    return JSON.parse(JSON.stringify(v));
};

/* JSON 文本校验 JSON String Check */
function isJSON(str) {
    if (typeof str != "string") { return false; };
    try {
        let obj = JSON.parse(str);
        return (typeof obj == "object" && obj) ? true : false;
    } catch (e) {
        return false;
    };
};

/* 主题包版本比较 ThemePack Version Compare，返回 1 / 0 / -1 */
function compareThemeVer(a, b) {
    let av = (a && a.INF && a.INF.Ver) || [0, 0, 0],
        bv = (b && b.INF && b.INF.Ver) || [0, 0, 0];
    for (let i = 0; i < 3; i++) {
        let x = parseInt(av[i]) || 0, y = parseInt(bv[i]) || 0;
        if (x > y) { return 1; };
        if (x < y) { return -1; };
    };
    let ab = parseInt(a && a.INF && a.INF.Build) || 0,
        bb = parseInt(b && b.INF && b.INF.Build) || 0;
    if (ab > bb) { return 1; };
    if (ab < bb) { return -1; };
    return 0;
};

/* 主题包存储键 ThemePack Storage Key */
function themeKey(uid) {
    return "GTP_β3_" + uid;
};
function themeRegistryKey() {
    return "GTP_β3_" + User + "_Registry";
};
function isBuiltInTheme(uid) {
    return Object.prototype.hasOwnProperty.call(BuiltInThemes, uid);
};

/* 是否为 4.x 架构的主题包数据 Is 4.x Schema */
function isThemePack(theme) {
    return !!(theme && typeof theme === "object" && theme.INF &&
        typeof theme.INF.UID === "string" && theme.INF.UID.length > 0 &&
        theme.INF.COMP && typeof theme.INF.COMP === "object");
};

/* 主题包规范化 ThemePack Normalize：补齐缺失字段，保证组件不缺席 */
function normTheme(theme) {
    let t = cloneJSON(theme), src = theme;
    t.INF = t.INF || {};
    t.INF.UID = String(t.INF.UID);
    t.INF.Name = t.INF.Name || {};
    ["sc", "tc", "ja", "en"].forEach(function (l) {
        if (!t.INF.Name[l]) {
            t.INF.Name[l] = t.INF.Name.sc || t.INF.UID;
        };
    });
    t.INF.Ver = (t.INF.Ver && t.INF.Ver.length == 3) ? t.INF.Ver : [0, 0, 0];
    t.INF.Build = parseInt(t.INF.Build) || 0;
    t.INF.COMP = t.INF.COMP || {};
    [
        "CharTachie", "MobsTachie", "ImageKanban", "SpineKanban", "CharSounds",
        "EquipIcons", "ItemIcons", "DessertIcons",
        "EquipThemeName", "ItemThemeName", "DessertThemeName",
        "CharThemeName", "MobsThemeName", "Style"
    ].forEach(function (k) {
        t.INF.COMP[k] = !!t.INF.COMP[k];
    });

    /* Style 底层样式：3.x 的 backsize / wqbacksize / old 迁移到 4.x Style */
    t.Style = t.Style || {};
    if (!t.Style.dfbacksize) {
        t.Style.dfbacksize = src.backsize || testmain001.Style.dfbacksize;
    };
    if (!t.Style.eqbacksize) {
        t.Style.eqbacksize = src.wqbacksize || src.backsize || testmain001.Style.eqbacksize;
    };
    if (typeof t.Style.old !== "string") {
        t.Style.old = (t.Style.old === undefined || t.Style.old === null)
            ? (src.old === undefined ? "" : String(src.old))
            : String(t.Style.old);
    };
    t.Style.day = t.Style.day || { bgcr: "", textcr: "" };
    t.Style.night = t.Style.night || {};
    ["bgcr", "textcr", "panelcr", "bordercr", "linkcr"].forEach(function (k) {
        if (t.Style.night[k] === undefined && testmain001.Style.night[k] !== undefined) {
            t.Style.night[k] = testmain001.Style.night[k];
        };
    });

    /* Style 组件开启时，主题名称组件才会被使用，其余组件按数据存在与否判断 */
    if (t.INF.COMP.EquipIcons) {
        t.EquipIcons = t.EquipIcons || {};
        t.EquipIcons.common = t.EquipIcons.common || "";
        t.EquipIcons.ext = t.EquipIcons.ext || src.ext || ".gif";
        t.EquipIcons.style = t.EquipIcons.style || {
            one: false,
            mix: "background-blend-mode:normal;background-color:",
            t1: "#C0C0C0;", t2: "#03B7CD;", t3: "#38B03F;", t4: "#F1A325;", t5: "#EA644A;"
        };
        t.EquipIcons.defuri = t.EquipIcons.defuri || {};
        t.EquipIcons.olduri = t.EquipIcons.olduri || {};
        Object.keys(testmain001.EquipIcons.defuri).forEach(function (k) {
            if (!t.EquipIcons.defuri[k]) { t.EquipIcons.defuri[k] = testmain001.EquipIcons.defuri[k]; };
        });
    };
    if (t.INF.COMP.ItemIcons) {
        t.ItemIcons = t.ItemIcons || {};
        t.ItemIcons.common = t.ItemIcons.common || "";
        t.ItemIcons.ext = t.ItemIcons.ext || src.ext || ".gif";
        t.ItemIcons.uri = t.ItemIcons.uri || {};
        Object.keys(testmain001.ItemIcons.uri).forEach(function (k) {
            if (!t.ItemIcons.uri[k]) { t.ItemIcons.uri[k] = testmain001.ItemIcons.uri[k]; };
        });
    };
    if (t.INF.COMP.DessertIcons) {
        t.DessertIcons = t.DessertIcons || {};
        t.DessertIcons.common = t.DessertIcons.common || "";
        t.DessertIcons.ext = t.DessertIcons.ext || src.ext || ".gif";
        t.DessertIcons.style = t.DessertIcons.style || {
            one: true,
            mix: "background-blend-mode:normal;background-color:",
            t3: "#38B03F;", t4: "#F1A325;", t5: "#EA644A;"
        };
        t.DessertIcons.uri = t.DessertIcons.uri || {};
        Object.keys(testmain001.DessertIcons.uri).forEach(function (k) {
            if (!t.DessertIcons.uri[k]) { t.DessertIcons.uri[k] = testmain001.DessertIcons.uri[k]; };
        });
    };

    /* 主题名称组件：补齐各语言分支 */
    [["EquipThemeName", testmain001.EquipThemeName],
    ["ItemThemeName", testmain001.ItemThemeName],
    ["DessertThemeName", testmain001.DessertThemeName]].forEach(function (p) {
        let key = p[0];
        if (!t.INF.COMP[key]) { return; };
        t[key] = t[key] || {};
        if (t[key].intl === undefined) { t[key].intl = true; };
        if (t[key].intl) {
            ["sc", "tc", "ja", "en"].forEach(function (l) {
                if (!t[key][l]) { t[key][l] = cloneJSON(t[key].sc || p[1].sc); };
            });
            if (key == "DessertThemeName") {
                ["sc", "tc", "ja", "en"].forEach(function (l) {
                    let d = t[key][l];
                    d.lv = d.lv || {};
                    d.name = d.name || {};
                    Object.keys(p[1][l].lv).forEach(function (k) {
                        if (!d.lv[k]) { d.lv[k] = p[1][l].lv[k]; };
                    });
                    Object.keys(p[1][l].name).forEach(function (k) {
                        if (!d.name[k]) { d.name[k] = p[1][l].name[k]; };
                    });
                });
            }
            else {
                ["sc", "tc", "ja", "en"].forEach(function (l) {
                    Object.keys(p[1][l]).forEach(function (k) {
                        if (!t[key][l][k]) { t[key][l][k] = p[1][l][k]; };
                    });
                });
            };
        }
        else {
            t[key].sl = t[key].sl || cloneJSON(t[key].sc || p[1].sc);
        };
    });

    if (t.INF.COMP.CharThemeName) {
        t.CharName = t.CharName || {};
        if (t.CharName.intl === undefined) { t.CharName.intl = true; };
        if (t.CharName.intl) {
            ["sc", "tc", "ja", "en"].forEach(function (l) {
                if (!t.CharName[l]) { t.CharName[l] = cloneJSON(t.CharName.sc || testmain001.CharName.sc); };
            });
        }
        else {
            t.CharName.sl = t.CharName.sl || cloneJSON(t.CharName.sc || testmain001.CharName.sc);
        };
    };

    if (t.INF.COMP.CharTachie) {
        t.CharTachie = t.CharTachie || {};
        t.CharTachie.common = t.CharTachie.common || "";
        t.CharTachie.ext = t.CharTachie.ext || ".png";
        ["uri", "HeadFG", "LeftFG", "CG", "LeftPKFG", "RightPKFG"].forEach(function (k) {
            t.CharTachie[k] = t.CharTachie[k] || {};
        });
    };
    if (t.INF.COMP.MobsTachie) {
        t.MobsTachie = t.MobsTachie || {};
        t.MobsTachie.common = t.MobsTachie.common || "";
        t.MobsTachie.ext = t.MobsTachie.ext || ".png";
        t.MobsTachie.uri = t.MobsTachie.uri || {};
    };
    if (t.INF.COMP.CharSounds) {
        t.CharSounds = t.CharSounds || {};
        t.CharSounds.common = t.CharSounds.common || "";
        t.CharSounds.ext = t.CharSounds.ext || ".mp3";
        t.CharSounds.uri = t.CharSounds.uri || {};
        t.CharSounds.conf = t.CharSounds.conf || {};
    };
    if (t.INF.COMP.ImageKanban) {
        t.ImageKanban = t.ImageKanban || {};
        t.ImageKanban.bg = t.ImageKanban.bg || t.Style.kanbanbg || testmain001.ImageKanban.bg;
        t.ImageKanban.asset = t.ImageKanban.asset || { common: "", ext: ".png" };
        t.ImageKanban.uri = t.ImageKanban.uri || {};
        t.ImageKanban.idle = t.ImageKanban.idle || {};
        t.ImageKanban.win = t.ImageKanban.win || {};
        t.ImageKanban.lose = t.ImageKanban.lose || {};
    };
    if (t.INF.COMP.SpineKanban) {
        t.SpineKanban = t.SpineKanban || {};
        t.SpineKanban.bg = t.SpineKanban.bg || {
            url: t.Style.kanbanbg || testmain001.SpineKanban.bg.url,
            config: {
				alpha: t.SpineKanban.bg.config.alpha ?? true,
				backgroundColor: t.SpineKanban.bg.config.backgroundColor || "#000000"
			}
        };
        t.SpineKanban.assest = t.SpineKanban.assest || cloneJSON(testmain001.SpineKanban.assest);
        t.SpineKanban.conf = t.SpineKanban.conf || {};
        t.SpineKanban.conf.fallback = t.SpineKanban.conf.fallback || cloneJSON(testmain001.SpineKanban.conf.fallback);
    };
    return t;
};

/* 自定义主题组件 Custom COMP：校验 / 规范化 / 安装 / 卸载 */
function usTheme(UserJSON, action) {
    let tempTheme;
    if (typeof UserJSON === "string") {
        if (!isJSON(UserJSON)) {
            alert(err.code + 'init-008' + err.info + err.M.UOT);
            return false;
        };
        tempTheme = JSON.parse(UserJSON);
    }
    else if (UserJSON && typeof UserJSON === "object") {
        tempTheme = cloneJSON(UserJSON);
    }
    else {
        alert(err.code + 'init-003' + err.info + err.M.UNU);
        return false;
    };
    if (!isThemePack(tempTheme)) {
        alert(err.code + 'init-005' + err.info + err.M.UOT);
        return false;
    };
    if (tempTheme.INF.UID == testmain001.INF.UID) {
        tempTheme.INF.UID = "Custom_" + testmain001.INF.UID;
    };
    if (isBuiltInTheme(tempTheme.INF.UID)) {
        alert(err.code + 'init-006' + err.info + err.M.UBN);
        return false;
    };
    let theme = normTheme(tempTheme);
    if (action == false) {
        return theme;
    };
    installTheme(theme);
    return theme;
};

/* 安装主题包 Install ThemePack
   内置主题包只落盘数据，不进入「自定义主题」注册表 */
function installTheme(theme) {
    let t = normTheme(theme);
    localStorage.setItem(themeKey(t.INF.UID), JSON.stringify(t));
    if (!isBuiltInTheme(t.INF.UID)) {
        let reg = customThemes();
        if (reg.indexOf(t.INF.UID) == -1) { reg.push(t.INF.UID); };
        localStorage.setItem(themeRegistryKey(), JSON.stringify(reg));
    };
    return t;
};

/* 卸载主题包 Uninstall ThemePack */
function uninstallTheme(uid) {
    if (isBuiltInTheme(uid)) { return false; };
    localStorage.removeItem(themeKey(uid));
    let reg = customThemes().filter(function (i) { return i != uid; });
    localStorage.setItem(themeRegistryKey(), JSON.stringify(reg));
    return true;
};

/* 取 CSS 声明的值 Extract Declaration Value
   4.x 主题包的 Style.dfbacksize / eqbacksize 存的是整条声明（如
   "background-size:100% 100%;"），部分主题也可能只存裸值（如 "80% 80%"）。
   本函数两种写法都能接受，统一返回值部分，避免生成
   "background-size:background-size:100% 100%;" 这种被浏览器整条丢弃的非法声明。
   必须定义在 GTPCssCommon 模板串求值之前。 */
function cssDeclValue(decl, fallback) {
    if (typeof decl != "string" || decl.trim() === "") { return fallback || "100% 100%"; };
    let v = decl.trim();
    let m = /^[a-zA-Z-]+\s*:\s*([\s\S]*?)\s*;?\s*$/.exec(v);
    if (m) { v = m[1].trim(); };
    return v === "" ? (fallback || "100% 100%") : v;
};

/* 已安装的自定义主题列表 Installed Custom Themes */
function customThemes() {
    /* 注册表键固定为 GTP_β3_<User>_Registry，主题键为 GTP_β3_<UID>；
       注册表键含双下划线，故按前缀 + 后缀判定，避免误收注册表自身。 */
    let regKey = themeRegistryKey();
    let reg = localStorage.getItem(regKey), list;
    if (reg) {
        try { list = JSON.parse(reg); } catch (e) { list = null; };
    };
    if (!Array.isArray(list)) {
        /* 首次运行：从 localStorage 中扫描 GTP_β3_<uid> 形式的主题包 */
        list = [];
        for (let i = 0; i < localStorage.length; i++) {
            let k = localStorage.key(i);
            if (!k || k.indexOf("GTP_β3_") !== 0 || k == regKey) { continue; };
            let uid = k.slice(8);
            if (!uid || isBuiltInTheme(uid)) { continue; };
            try {
                let t = JSON.parse(localStorage.getItem(k));
                if (isThemePack(t)) { list.push(t.INF.UID); };
            } catch (e) { /* 忽略损坏数据 */ };
        };
        localStorage.setItem(regKey, JSON.stringify(list));
    }
    else {
        /* 清理历史注册表中混入的内置主题包 */
        let cleaned = list.filter(function (uid) { return !isBuiltInTheme(uid); });
        if (cleaned.length != list.length) {
            localStorage.setItem(regKey, JSON.stringify(cleaned));
        };
        list = cleaned;
    };
    return list.filter(function (uid) {
        return !isBuiltInTheme(uid) && localStorage.getItem(themeKey(uid)) != null;
    });
};

/* 主题包显示名 ThemePack Display Name */
function themePackName(theme) {
    let n = theme.INF.Name || {};
    return n[LAConf] || n.sc || theme.INF.UID;
};
function themePackNameByUID(uid) {
    let t = readTheme(uid);
    return t ? themePackName(t) : uid;
};

/* 主题包下拉列表选项 ThemePack Select Options */
function themeSelectOptions() {
    let html = `<option class="now" value="${MGRConf.ThemePack}">${themePackNameByUID(MGRConf.ThemePack) + SelLang.msg.now}</option>`;
    Object.keys(BuiltInThemes).forEach(function (uid) {
        if (uid == MGRConf.ThemePack) { return; };
        html += `<option class="def" id="${uid}" value="${uid}">${themePackNameByUID(uid)}</option>`;
    });
    let custom = customThemes();
    html += `<option class="hr" disabled>${SelLang.menu.MoreThemes}</option>`;
    if (custom.length == 0) {
        html += `<option class="usr" disabled>${SelLang.menu.NoCustom}</option>`;
    }
    else {
        custom.forEach(function (uid) {
            if (uid == MGRConf.ThemePack) { return; };
            html += `<option class="usr" id="${uid}" value="${uid}">${themePackNameByUID(uid)}</option>`;
        });
    };
    return html;
};

/* 自定义主题卸载列表选项 Custom ThemePack Uninstall Options */
function themeUninstallOptions() {
    let custom = customThemes();
    if (custom.length == 0) {
        return `<option class="hr" value="">${SelLang.menu.NotSelected}</option>`;
    };
    let html = `<option class="hr" value="">${SelLang.menu.NotSelected}</option>`;
    custom.forEach(function (uid) {
        html += `<option class="usr" id="${uid}" value="${uid}">${themePackNameByUID(uid)}</option>`;
    });
    return html;
};

/* 主题包设置面板刷新 ThemePack Setting Refresh */
function refreshThemeUI() {
    let $themes = $(".tpmSetting#Themes"), $uninstall = $(".tpmSetting#UsrUninstall");
    if ($themes.length > 0) { $themes.html(themeSelectOptions()); };
    if ($uninstall.length > 0) { $uninstall.html(themeUninstallOptions()); };
};

/* 自定义主题组件可用性检查 Custom ThemePack Component Check */
function checkThemeComp(theme) {
    let missing = [], comp = theme.INF.COMP;
    if (!comp.CharTachie && !comp.ImageKanban && !comp.SpineKanban) { missing.push(SelLang.msg.nofgimg); };
    if (!comp.SpineKanban) { missing.push(SelLang.msg.nospine); };
    if (!comp.CharSounds) { missing.push(SelLang.msg.novoice); };
    return missing;
};

/* 主题包安装入口 ThemePack Install：解析 .guthemepack / JSON 文件 */
function themePackInstall(fileString) {
    if (fileString.indexOf("�") > -1) {
        alert(SelLang.errors.M.DECF);
        return false;
    };
    let theme = usTheme(fileString, true);
    if (!theme) { return false; };
    let missing = checkThemeComp(theme);
    if (missing.length > 0) { alert(missing.join("\n")); };
    refreshThemeUI();
    if (confirm(SelLang.menu.UsrInstall + "\n" + themePackName(theme) + "\n\n" + SelLang.menu.Theme + " ?")) {
        MGRConf.ThemePack = theme.INF.UID;
        upLocal(true);
    };
    return true;
};

/* 读取主题包 Read ThemePack：内置优先，其次本地存储 */
function readTheme(uid) {
    if (isBuiltInTheme(uid)) { return BuiltInThemes[uid]; };
    let raw = localStorage.getItem(themeKey(uid));
    if (!raw) { return null; };
    try {
        let t = JSON.parse(raw);
        return isThemePack(t) ? t : null;
    } catch (e) {
        return null;
    };
};

/* 主题包解析 Resolve ThemePack：取版本较新者，必要时回写本地存储 */
function resolveThemePack(uid, install) {
    let theme = readTheme(uid), base = isBuiltInTheme(uid) ? BuiltInThemes[uid] : null;
    if (theme && base && compareThemeVer(base, theme) > 0) {
        /* 内置主题包版本更新：以内置数据为准 */
        theme = install ? installTheme(base) : cloneJSON(base);
    }
    else if (theme) {
        theme = normTheme(theme);
        if (base && install) { localStorage.setItem(themeKey(uid), JSON.stringify(theme)); };
    }
    else if (base) {
        theme = install ? installTheme(base) : normTheme(cloneJSON(base));
    };
    if (!theme) {
        /* 主题包缺失：回退到测试主题包 */
        theme = install ? installTheme(testmain001) : normTheme(cloneJSON(testmain001));
    };
    return theme;
};

function doThemeUpdate(NewThemePack, LocalThemePack) {
    if (compareThemeVer(NewThemePack, LocalThemePack) > 0) {
        localStorage.setItem(themeKey(NewThemePack.INF.UID), JSON.stringify(NewThemePack));
        return NewThemePack;
    };
    return LocalThemePack;
};

/* 本地存储配置更新 LocalStorage Update */
function upLocal(refresh) {
    localStorage.setItem("MGR_β3_" + User + "_Conf", JSON.stringify(MGRConf));
    localStorage.setItem("MGR_β3_" + User + "_nowTheme", JSON.stringify(nowTheme));
    if (refresh) {
        window.location.reload();
    };
};

/* 重命名组件 Rename COMP */
function eqtRep(n, v) {
    if (typeof v != "string") { return v; };
    let eqn = SelLang.equips;
    if (!eqn) { return v; };
    if (MGRConf.ThemeName == "checked" && MGRConf.OriName == "checked") {
        n = v
            .replace(new RegExp("探险者之剑", 'g'), eqn.探险者之剑 + `(探险者之剑)`)
            .replace(new RegExp("探险者短弓", 'g'), eqn.探险者短弓 + `(探险者短弓)`)
            .replace(new RegExp("探险者短杖", 'g'), eqn.探险者短杖 + `(探险者短杖)`)
            .replace(new RegExp("狂信者的荣誉之刃", 'g'), eqn.狂信者的荣誉之刃 + `(狂信者的荣誉之刃)`)
            .replace(new RegExp("反叛者的刺杀弓", 'g'), eqn.反叛者的刺杀弓 + `(反叛者的刺杀弓)`)
            .replace(new RegExp("幽梦匕首", 'g'), eqn.幽梦匕首 + `(幽梦匕首)`)
            .replace(new RegExp("光辉法杖", 'g'), eqn.光辉法杖 + `(光辉法杖)`)
            .replace(new RegExp("荆棘盾剑", 'g'), eqn.荆棘盾剑 + `(荆棘盾剑)`)
            .replace(new RegExp("陨铁重剑", 'g'), eqn.陨铁重剑 + `(陨铁重剑)`)
            .replace(new RegExp("饮血魔剑", 'g'), eqn.饮血魔剑 + `(饮血魔剑)`)
            .replace(new RegExp("彩金长剑", 'g'), eqn.彩金长剑 + `(彩金长剑)`)
            .replace(new RegExp("清澄长杖", 'g'), eqn.清澄长杖 + `(清澄长杖)`)

            .replace(new RegExp("探险者手环", 'g'), eqn.探险者手环 + `(探险者手环)`)
            .replace(new RegExp("命师的传承手环", 'g'), eqn.命师的传承手环 + `(命师的传承手环)`)
            .replace(new RegExp("秃鹫手环", 'g'), eqn.秃鹫手环 + `(秃鹫手环)`)
            .replace(new RegExp("海星戒指", 'g'), eqn.海星戒指 + `(海星戒指)`)
            .replace(new RegExp("噬魔戒指", 'g'), eqn.噬魔戒指 + `(噬魔戒指)`)
			.replace(new RegExp("折光戒指", 'g'), eqn.折光戒指 + `(折光戒指)`)

            .replace(new RegExp("探险者铁甲", 'g'), eqn.探险者铁甲 + `(探险者铁甲)`)
            .replace(new RegExp("探险者皮甲", 'g'), eqn.探险者皮甲 + `(探险者皮甲)`)
            .replace(new RegExp("探险者布甲", 'g'), eqn.探险者布甲 + `(探险者布甲)`)
            .replace(new RegExp("旅法师的灵光袍", 'g'), eqn.旅法师的灵光袍 + `(旅法师的灵光袍)`)
            .replace(new RegExp("战线支撑者的荆棘重甲", 'g'), eqn.战线支撑者的荆棘重甲 + `(战线支撑者的荆棘重甲)`)
            .replace(new RegExp("复苏战衣", 'g'), eqn.复苏战衣 + `(复苏战衣)`)
            .replace(new RegExp("挑战斗篷", 'g'), eqn.挑战斗篷 + `(挑战斗篷)`)

            .replace(new RegExp("探险者耳环", 'g'), eqn.探险者耳环 + `(探险者耳环)`)
            .replace(new RegExp("占星师的耳饰", 'g'), eqn.占星师的耳饰 + `(占星师的耳饰)`)
            .replace(new RegExp("萌爪耳钉", 'g'), eqn.萌爪耳钉 + `(萌爪耳钉)`)
            .replace(new RegExp("猎魔耳环", 'g'), eqn.猎魔耳环 + `(猎魔耳环)`)
			.replace(new RegExp("凶神耳环", 'g'), eqn.凶神耳环 + `(凶神耳环)`);
    }
    else {
        n = v
            .replace(new RegExp("探险者之剑", 'g'), eqn.探险者之剑)
            .replace(new RegExp("探险者短弓", 'g'), eqn.探险者短弓)
            .replace(new RegExp("探险者短杖", 'g'), eqn.探险者短杖)
            .replace(new RegExp("狂信者的荣誉之刃", 'g'), eqn.狂信者的荣誉之刃)
            .replace(new RegExp("反叛者的刺杀弓", 'g'), eqn.反叛者的刺杀弓)
            .replace(new RegExp("幽梦匕首", 'g'), eqn.幽梦匕首)
            .replace(new RegExp("光辉法杖", 'g'), eqn.光辉法杖)
            .replace(new RegExp("荆棘盾剑", 'g'), eqn.荆棘盾剑)
            .replace(new RegExp("陨铁重剑", 'g'), eqn.陨铁重剑)
            .replace(new RegExp("饮血魔剑", 'g'), eqn.饮血魔剑)
            .replace(new RegExp("彩金长剑", 'g'), eqn.彩金长剑)
            .replace(new RegExp("清澄长杖", 'g'), eqn.清澄长杖)

            .replace(new RegExp("探险者手环", 'g'), eqn.探险者手环)
            .replace(new RegExp("命师的传承手环", 'g'), eqn.命师的传承手环)
            .replace(new RegExp("秃鹫手环", 'g'), eqn.秃鹫手环)
            .replace(new RegExp("海星戒指", 'g'), eqn.海星戒指)
            .replace(new RegExp("噬魔戒指", 'g'), eqn.噬魔戒指)
			.replace(new RegExp("折光戒指", 'g'), eqn.折光戒指)

            .replace(new RegExp("探险者铁甲", 'g'), eqn.探险者铁甲)
            .replace(new RegExp("探险者皮甲", 'g'), eqn.探险者皮甲)
            .replace(new RegExp("探险者布甲", 'g'), eqn.探险者布甲)
            .replace(new RegExp("旅法师的灵光袍", 'g'), eqn.旅法师的灵光袍)
            .replace(new RegExp("战线支撑者的荆棘重甲", 'g'), eqn.战线支撑者的荆棘重甲)
            .replace(new RegExp("复苏战衣", 'g'), eqn.复苏战衣)
            .replace(new RegExp("挑战斗篷", 'g'), eqn.挑战斗篷)

            .replace(new RegExp("探险者耳环", 'g'), eqn.探险者耳环)
            .replace(new RegExp("占星师的耳饰", 'g'), eqn.占星师的耳饰)
            .replace(new RegExp("萌爪耳钉", 'g'), eqn.萌爪耳钉)
            .replace(new RegExp("猎魔耳环", 'g'), eqn.猎魔耳环)
			.replace(new RegExp("凶神耳环", 'g'), eqn.凶神耳环);
    }


    return n;
};
function dstRep(n, v) {
    /* 调用方常以未初始化的 temp 作为首参，实际来源是第二参 v；
       v 不是字符串时原样返回，避免整个替换流程抛错中断。 */
    if (typeof v != "string") { return v; };
    let dsn = SelLang.dessert;
    if (!dsn || !dsn.lv || !dsn.name) { return v; };
    n = v
        .replace(new RegExp("稀有星铜苹果护身符", 'g'), dsn.lv.稀有 + dsn.name.星铜苹果护身符)
        .replace(new RegExp("稀有蓝银葡萄护身符", 'g'), dsn.lv.稀有 + dsn.name.蓝银葡萄护身符)
        .replace(new RegExp("稀有紫晶樱桃护身符", 'g'), dsn.lv.稀有 + dsn.name.紫晶樱桃护身符)
        .replace(new RegExp("史诗星铜苹果护身符", 'g'), dsn.lv.史诗 + dsn.name.星铜苹果护身符)
        .replace(new RegExp("史诗蓝银葡萄护身符", 'g'), dsn.lv.史诗 + dsn.name.蓝银葡萄护身符)
        .replace(new RegExp("史诗紫晶樱桃护身符", 'g'), dsn.lv.史诗 + dsn.name.紫晶樱桃护身符)
        .replace(new RegExp("传奇星铜苹果护身符", 'g'), dsn.lv.传奇 + dsn.name.星铜苹果护身符)
        .replace(new RegExp("传奇蓝银葡萄护身符", 'g'), dsn.lv.传奇 + dsn.name.蓝银葡萄护身符)
        .replace(new RegExp("传奇紫晶樱桃护身符", 'g'), dsn.lv.传奇 + dsn.name.紫晶樱桃护身符);
    return n;
};
function ittRep(n, v) {
    if (typeof v != "string") { return v; };
    let itn = SelLang.items;
    if (!itn) { return v; };
    n = v
        .replace(new RegExp("体能刺激药水", 'g'), itn.体能刺激药水)
        .replace(new RegExp("锻造材料箱", 'g'), itn.锻造材料箱)
        .replace(new RegExp("灵魂药水", 'g'), itn.灵魂药水)
        .replace(new RegExp("随机装备箱", 'g'), itn.随机装备箱)
        .replace(new RegExp("宝石原石", 'g'), itn.宝石原石)
        .replace(new RegExp("光环天赋石", 'g'), itn.光环天赋石)
        .replace(new RegExp("苹果核", 'g'), itn.苹果核)
        .replace(new RegExp("蓝锻造石", 'g'), itn.蓝锻造石)
        .replace(new RegExp("绿锻造石", 'g'), itn.绿锻造石)
        .replace(new RegExp("金锻造石", 'g'), itn.金锻造石);

    return n;
};
function cntRep(n, v) {
    if (typeof v != "string") { return v; };
    let cnt = SelLang.chars;
    if (!cnt) { return v; };
    n = v

        .replace(new RegExp("舞", 'g'), cnt.舞)
        .replace(new RegExp("默", 'g'), cnt.默)
        .replace(new RegExp("琳", 'g'), cnt.琳)
        .replace(new RegExp("艾", 'g'), cnt.艾)
        .replace(new RegExp("梦", 'g'), cnt.梦)
        .replace(new RegExp("薇", 'g'), cnt.薇)
        .replace(new RegExp("伊", 'g'), cnt.伊)
        .replace(new RegExp("冥", 'g'), cnt.冥)
        .replace(new RegExp("命", 'g'), cnt.命)
        .replace(new RegExp("希", 'g'), cnt.希)
        .replace(new RegExp("霞", 'g'), cnt.霞)
        .replace(new RegExp("雅", 'g'), cnt.雅)
		.replace(new RegExp("绮", 'g'), cnt.绮);

    return n;
};
function alltRep() {
    let turi = window.location.href;

    if (MGRConf.ThemeName == "checked" || MGRConf.OldName == "checked" || LAConf != "sc") {
        /* Index Rep 首页替换 */
        if (turi.indexOf("fyg_index.php") > -1) {

            if ($("div.col-sm-12").length > 0) {
                let $this = $("div.col-sm-12");
                for (let i = 0; i < $this.length; i++) {
                    if (!$this[i].getAttribute("unique")) {
                        let temp;
                        $this[i].setAttribute("unique", $this[i].innerHTML);
                        $this[i].innerHTML = ittRep(temp, $this[i].innerHTML);
                    };
                };
            };

            if ($(".modal-body.fyg_f14>.btn.fyg_mp5[onclick*='25']").length > 0) {
                let $this = $(".modal-body.fyg_f14>.btn.fyg_mp5[onclick*='25']");
                for (let i = 0; i < $this.length; i++) {
                    if (!$this[i].getAttribute("unique")) {
                        let temp;
                        $this[i].setAttribute("unique", $this[i].innerHTML);
                        $this[i].innerHTML = eqtRep(temp, $this[i].innerHTML);
                    };
                };
            };

            if ($(".modal-body.fyg_f14>p").length > 0) {
                let $this = $(".modal-body.fyg_f14>p");
                for (let i = 0; i < $this.length; i++) {
                    if (!$this[i].getAttribute("unique") && !$this[i].innerHTML.indexOf('<button class=') > -1) {
                        let temp;
                        $this[i].setAttribute("unique", $this[i].innerHTML);
                        $this[i].innerHTML = ittRep(temp, $this[i].innerHTML);
                    };
                };
            };

            if ($("p.with-padding[class*='fyg_colpz']").length > 0) {
                let $this = $("p.with-padding[class*='fyg_colpz']");
                for (let i = 0; i < $this.length; i++) {
                    if (!$this[i].getAttribute("unique")) {
                        let temp;
                        $this[i].setAttribute("unique", $this[i].innerHTML);
                        $this[i].innerHTML = eqtRep(temp, $this[i].innerHTML);
                    };
                };
            };

            if ($(".modal-body.fyg_f14>p").length > 0) {
                let $this = $("div.col-sm-12");
                for (let i = 0; i < $this.length; i++) {
                    if (!$this[i].getAttribute("unique")) {
                        let temp;
                        $this[i].setAttribute("unique", $this[i].innerHTML);
                        $this[i].innerHTML = ittRep(temp, $this[i].innerHTML);
                    };
                };
            };

        };

        /* Beach&Equip Rep 沙滩页&卡片装备页替换 */
        if (turi.indexOf("fyg_beach.php") > -1 ||
            turi.indexOf("fyg_equip.php") > -1) {
            if ($("button[class='btn fyg_colpzbg fyg_mp3']").length > 0) {
                let $this = $("button[class='btn fyg_colpzbg fyg_mp3']");
                for (let i = 0; i < $this.length; i++) {
                    if (!$this[i].getAttribute("unique")) {
                        let temp;
                        $this[i].setAttribute("unique", $this[i].getAttribute("data-original-title"));
                        temp = $this[i].getAttribute("data-original-title");
                        if (temp.indexOf("fyg_f18") > -1) {
                            temp = eqtRep(temp, $this[i].getAttribute("data-original-title"));
                        }
                        else {
                            temp = dstRep(temp, $this[i].getAttribute("data-original-title"));
                        };
                        $this[i].setAttribute("data-original-title", temp);
                    };
                };

            };

            if ($("button[class='btn fyg_colpzbg fyg_mp3 fyg_tc']").length > 0) {
                let $this = $("button[class='btn fyg_colpzbg fyg_mp3 fyg_tc']");
                for (let i = 0; i < $this.length; i++) {
                    if (!$this[i].getAttribute("unique")) {
                        let temp;
                        $this[i].setAttribute("unique", $this[i].getAttribute("data-original-title"));
                        temp = ittRep(temp, $this[i].getAttribute("data-original-title"));
                        $this[i].setAttribute("data-original-title", temp);
                    };
                };

            };

            if ($("button.btn.fyg_colpzbg.fyg_mp3[class*='fyg_colpz0']").length > 0) {
                let $this = $("button.btn.fyg_colpzbg.fyg_mp3[class*='fyg_colpz0']");
                for (let i = 0; i < $this.length; i++) {
                    if (!$this[i].getAttribute("unique") && $this[i].getAttribute("data-original-title")) {
                        let temp;
                        $this[i].setAttribute("unique", $this[i].getAttribute("data-original-title"));
                        temp = eqtRep(temp, $this[i].getAttribute("data-original-title"));
                        $this[i].setAttribute("data-original-title", temp);
                    };
                };
            };

            if ($(".modal-body.fyg_f14>.row>.col-md-6>div").length > 0) {
                let $this = $(".modal-body.fyg_f14>.row>.col-md-6>div");
                for (let i = 0; i < $this.length; i++) {
                    if (!$this[i].getAttribute("unique")) {
                        let temp;
                        $this[i].setAttribute("unique", $this[i].innerHTML);
                        $this[i].innerHTML = eqtRep(temp, $this[i].innerHTML);
                    };
                };
            };
        };

        /* PK Rep 争夺战场页替换 */
        if (turi.indexOf("fyg_pk.php") > -1) {
            if ($(".fyg_colpzbg.fyg_mp3").length > 0) {
                let $this = $(".fyg_colpzbg.fyg_mp3");
                for (let i = 0; i < $this.length; i++) {
                    if (!$this[i].getAttribute("unique")) {
                        let title = $this[i].getAttribute("data-original-title"), temp;
                        $this[i].setAttribute("unique", title);
                        $this[i].setAttribute("data-original-title", eqtRep(temp, title));
                    }
                };
            };

            if ($(".col-md-3>.alert.fyg_f18.fyg_tc>img").length > 0) {
                let $this = $(".col-md-3>.alert.fyg_f18.fyg_tc>img");
                for (let i = 0; i < $this.length; i++) {
                    if (!$this[i].getAttribute("unique")) {
                        let title = $this[i].getAttribute("title"), temp;
                        $this[i].setAttribute("unique", title);
                        $this[i].setAttribute("title", eqtRep(temp, title));
                    }
                };
            };
        };

        /* Gem Rep 宝石工坊页替换 */
        if (turi.indexOf("fyg_gem.php") > -1) {
            if ($(".modal-body.fyg_f14>p").length > 0) {
                let $this = $("div.col-sm-12");
                for (let i = 0; i < $this.length; i++) {
                    if (!$this[i].getAttribute("unique")) {
                        let temp;
                        $this[i].setAttribute("unique", $this[i].innerHTML);
                        $this[i].innerHTML = ittRep(temp, $this[i].innerHTML);
                    };
                };
            };
        };

    };

    if (MGRConf.CharName == "checked" || LAConf != "sc") {
        if (turi.indexOf("fyg_index.php") > -1) {
            if ($("[onclick*='fyg_equip.php?eid=2']>.text-info.fyg_f24").length > 0) {
                let $this = $("[onclick*='fyg_equip.php?eid=2']>.text-info.fyg_f24")[0], cn;
                if (!$this.getAttribute("unique")) {
                    $this.setAttribute("unique", $this.innerHTML);
                    $this.innerHTML = cntRep(cn, $this.innerHTML);
                };
            };

            if ($(".btn.btn-block.fyg_mp5").length > 0) {
                let $this = $(".btn.btn-block.fyg_mp5"), cn;
                for (let i = 0; i < $this.length; i++) {
                    if (!$this[i].getAttribute("unique")) {
                        let oricn = $this[i].innerHTML;
                        $this[i].setAttribute("unique", oricn);
                        $this[i].innerHTML = cntRep(cn, $this[i].innerHTML);
                    }
                };
            };

            if ($(".alert.fyg_mp8.fyg_f14[class*='alert-']").length > 0) {
                let $this = $(".alert.fyg_mp8.fyg_f14[class*='alert-']"), cn;
                for (let i = 0; i < $this.length; i++) {
                    if (!$this[i].getAttribute("unique")) {
                        let oricn = $this[i].innerHTML;
                        $this[i].setAttribute("unique", oricn);
                        $this[i].innerHTML = cntRep(cn, $this[i].innerHTML);
                    }
                };
            };

        };

        if (turi.indexOf("fyg_equip.php") > -1) {
            /* 角色名替换（角色列表 + 角色详情预览）。
               实测角色名是 class 恰为 fyg_f24 的 span：
                 列表项： <div class="col-sm-2 fyg_lh60"><span class=" fyg_f24" unique="舞">可可萝</span>
                 详情项： <div class="col-md-3"><span class="fyg_f24" ...>名字</span>
               都不带 text-info，因此 3.x 的
                 .text-info.fyg_f24.fyg_lh60>span[style*='font-size:42px;']
                 .col-md-3>.text-info.fyg_f24
               两个选择器在装备页恒为 0 —— 这就是详情名字一直没被替换的原因。
               等级格是 .fyg_f24.fyg_colpz01，必须排除。 */
            if ($(".fyg_f24:not(.fyg_colpz01)").length > 0) {
                let $names = $(".fyg_f24:not(.fyg_colpz01)"), cn;
                for (let i = 0; i < $names.length; i++) {
                    if (hasUnique($names[i])) { continue; };
                    $names[i].setAttribute("unique", $names[i].innerText);
                    $names[i].innerHTML = cntRep(cn, $names[i].innerHTML);
                };
            };
            /* 出战角色名（左栏 #carding 面板）：
               .col-md-3>.panel-primary>#carding>.row>.text-info.fyg_f18.fyg_lh60>span
               这一格是 fyg_f18（不是 fyg_f24），所以必须单独替换；
               取 :first-child 只为避开同容器里 pull-right 的
               「Lv.800 Exp57.5%」那个 span。 */
            if ($("#carding .text-info.fyg_f18.fyg_lh60>span:first-child").length > 0) {
                let $eq = $("#carding .text-info.fyg_f18.fyg_lh60>span:first-child"), cn;
                for (let i = 0; i < $eq.length; i++) {
                    if (hasUnique($eq[i])) { continue; };
                    $eq[i].setAttribute("unique", $eq[i].innerText);
                    $eq[i].innerHTML = cntRep(cn, $eq[i].innerHTML);
                };
            };
            /* 兼容 3.x 结构（若游戏改回带 span 的写法） */
            if ($(".text-info.fyg_f24.fyg_lh60>span[style='font-size:42px;']").length > 0) {
                let $this = $(".text-info.fyg_f24.fyg_lh60>span[style='font-size:42px;']")[0], cn;
                if (!hasUnique($this)) {
                    $this.setAttribute("unique", $this.innerHTML);
                    $this.innerHTML = cntRep(cn, $this.innerHTML);
                };
            };
        };
    };
};


/* 图标替换组件 Icon Replace COMP */
/* 从元素上取出「品质原文」（稀有/史诗/传奇）。
   注意：**不能**从 style 字符串里找品质 —— style 只有图标路径（ys/icon/z/z9xx），
   品质在名称里，而名称挂在另一个属性上：
     unique              = 原始中文名（如「稀有星铜苹果护身符」），不受语言影响
     data-original-title = 已翻译的显示名（随语言变化，不适合做比较）
   优先用 unique，回退到 data-original-title。 */
function dessertQualityRaw($el) {
    if (!$el || typeof $el.getAttribute != "function") { return ""; };
    let raw = $el.getAttribute("unique") || $el.getAttribute("data-original-title") || "";
    return String(raw);
};
/* style.one 模式（每个道具一张图、按品质改背景色）下的「品质 → 颜色档」定位。
   原实现有两处错误：
     1) 在 style 字符串里找「稀有/史诗/传奇」——style 里只有路径，永远找不到；
     2) 三个分支都写成 indexOf(...) == -1（即「不含该品质」才套用该品质颜色），
        条件与意图完全相反。
   结果三个分支恒为真、且最后一段覆盖前面，于是所有品质都变成 t5(#EA644A)。
   现在：拿品质原文 → 用主题三档标签（可能已被 intl 改写）在原文里定位，
   取**最长命中**那档，避免子串误判。 */
function dessertQualityTier(raw, tstyle) {
    if (!raw) { return ""; };
    let hit = "", hitLen = 0;
    ["t5", "t4", "t3"].forEach(function (k) {
        let lab = tstyle[k + "lv"];
        if (lab == null || lab === "") { return; };
        lab = String(lab);
        if (raw.indexOf(lab) > -1 && lab.length > hitLen) { hit = k; hitLen = lab.length; };
    });
    if (hit) { return hit; };
    /* 主题未声明分档标签时，按默认中文标签兜底 */
    if (raw.indexOf("传奇") > -1) { return "t5"; };
    if (raw.indexOf("史诗") > -1) { return "t4"; };
    if (raw.indexOf("稀有") > -1) { return "t3"; };
    return "";
};

function IconMixMode(n, v, Type, rawQuality) {
    n = v;
    if (nowTheme.INF.COMP[Type]) {
        let tmix = nowTheme[Type].style.mix
            , tstyle = nowTheme[Type].style
            , tbg = "background-image";
        if (v.indexOf(tmix) > -1) {
            return n;
        };
        if (Type == "EquipIcons" && nowTheme.EquipIcons.style.one) {
            if (v.indexOf('_1') > -1) n = n.replace(/background-image/g, tmix + tstyle.t1 + tbg).replace(/_1./g, '.');
            if (v.indexOf('_2') > -1) n = n.replace(/background-image/g, tmix + tstyle.t2 + tbg).replace(/_2./g, '.');
            if (v.indexOf('_3') > -1) n = n.replace(/background-image/g, tmix + tstyle.t3 + tbg).replace(/_3./g, '.');
            if (v.indexOf('_4') > -1) n = n.replace(/background-image/g, tmix + tstyle.t4 + tbg).replace(/_4./g, '.');
            if (v.indexOf('_5') > -1) n = n.replace(/background-image/g, tmix + tstyle.t5 + tbg).replace(/_5./g, '.');
        };
        if (Type == "EquipIcons" && !nowTheme.EquipIcons.style.one) {
            if (v.indexOf('_1') > -1) n = n.replace(/background-image/g, tmix + tstyle.t1 + tbg);
            if (v.indexOf('_2') > -1) n = n.replace(/background-image/g, tmix + tstyle.t2 + tbg);
            if (v.indexOf('_3') > -1) n = n.replace(/background-image/g, tmix + tstyle.t3 + tbg);
            if (v.indexOf('_4') > -1) n = n.replace(/background-image/g, tmix + tstyle.t4 + tbg);
            if (v.indexOf('_5') > -1) n = n.replace(/background-image/g, tmix + tstyle.t5 + tbg);
        };
        if (Type == "DessertIcons" && nowTheme.DessertIcons.style.one) {
            /* 按品质套用对应背景色。品质改从元素属性读取（见 dessertQualityRaw），
               用最长命中定位档位，命不中就保持原样式不动。 */
            let tier = dessertQualityTier(rawQuality, tstyle);
            if (tier && tstyle[tier]) {
                n = v.replace(/background-image/g, tmix + tstyle[tier] + tbg);
            };
        };
        if (Type == "DessertIcons" && !nowTheme.DessertIcons.style.one) {
            /* 非 one 模式：同一道具按品质分文件（_1/_2/_3），同样按品质档取色 */
            let tier = dessertQualityTier(rawQuality, tstyle);
            if (tier && tstyle[tier]) {
                let sfx = (tier == "t3") ? "_1.gif" : (tier == "t4" ? "_2.gif" : "_3.gif");
                n = v.replace(/background-image/g, tmix + tstyle[tier] + tbg).replace(/.gif/g, sfx);
            };
        };
    };
    return n;
};

function eqiRep(n, v) {
    /* 主题包未声明装备图标组件时原样返回 */
    if (!nowTheme.INF.COMP.EquipIcons || !nowTheme.EquipIcons) { return v; };
    let tEqIcons = nowTheme.EquipIcons.defuri
        , toEqIcons = nowTheme.EquipIcons.olduri
        , eUrl = nowTheme.EquipIcons.common;
    if (!tEqIcons || !eUrl) { return v; };
    if (MGRConf.OldName) {
        if (toEqIcons && toEqIcons.荆棘盾剑) tEqIcons.荆棘盾剑 = toEqIcons.荆棘盾剑;
        if (toEqIcons && toEqIcons.饮血魔剑) tEqIcons.饮血魔剑 = toEqIcons.饮血魔剑;
        if (toEqIcons && toEqIcons.探险者手环) tEqIcons.探险者手环 = toEqIcons.探险者手环;
        if (toEqIcons && toEqIcons.秃鹫手环) tEqIcons.秃鹫手环 = toEqIcons.秃鹫手环;
        if (toEqIcons && toEqIcons.复苏战衣) tEqIcons.复苏战衣 = toEqIcons.复苏战衣;
        if (toEqIcons && toEqIcons.探险者耳环) tEqIcons.探险者耳环 = toEqIcons.探险者耳环;
        if (toEqIcons && toEqIcons.占星师的耳饰) tEqIcons.占星师的耳饰 = toEqIcons.占星师的耳饰;
        if (toEqIcons && toEqIcons.萌爪耳钉) tEqIcons.萌爪耳钉 = toEqIcons.萌爪耳钉;
    };

    n = v.replace(/.gif/g, nowTheme.EquipIcons.ext)

        .replace(/ys\/icon\/z\/z2101_/g, eUrl + tEqIcons.探险者之剑)
        .replace(/ys\/icon\/z\/z2102_/g, eUrl + tEqIcons.探险者短弓)
        .replace(/ys\/icon\/z\/z2103_/g, eUrl + tEqIcons.探险者短杖)
        .replace(/ys\/icon\/z\/z2104_/g, eUrl + tEqIcons.狂信者的荣誉之刃)
        .replace(/ys\/icon\/z\/z2105_/g, eUrl + tEqIcons.反叛者的刺杀弓)
        .replace(/ys\/icon\/z\/z2106_/g, eUrl + tEqIcons.幽梦匕首)
        .replace(/ys\/icon\/z\/z2107_/g, eUrl + tEqIcons.光辉法杖)
        .replace(/ys\/icon\/z\/z2108_/g, eUrl + tEqIcons.荆棘盾剑)
        .replace(/ys\/icon\/z\/z2109_/g, eUrl + tEqIcons.陨铁重剑)
        .replace(/ys\/icon\/z\/z2110_/g, eUrl + tEqIcons.饮血魔剑)
        .replace(/ys\/icon\/z\/z2111_/g, eUrl + tEqIcons.彩金长剑)
        .replace(/ys\/icon\/z\/z2112_/g, eUrl + tEqIcons.清澄长杖)

        .replace(/ys\/icon\/z\/z2201_/g, eUrl + tEqIcons.探险者手环)
        .replace(/ys\/icon\/z\/z2202_/g, eUrl + tEqIcons.命师的传承手环)
        .replace(/ys\/icon\/z\/z2203_/g, eUrl + tEqIcons.秃鹫手环)
        .replace(/ys\/icon\/z\/z2204_/g, eUrl + tEqIcons.海星戒指)
        .replace(/ys\/icon\/z\/z2205_/g, eUrl + tEqIcons.噬魔戒指)
		.replace(/ys\/icon\/z\/z2206_/g, eUrl + tEqIcons.折光戒指)

        .replace(/ys\/icon\/z\/z2301_/g, eUrl + tEqIcons.探险者铁甲)
        .replace(/ys\/icon\/z\/z2302_/g, eUrl + tEqIcons.探险者皮甲)
        .replace(/ys\/icon\/z\/z2303_/g, eUrl + tEqIcons.探险者布甲)
        .replace(/ys\/icon\/z\/z2304_/g, eUrl + tEqIcons.旅法师的灵光袍)
        .replace(/ys\/icon\/z\/z2305_/g, eUrl + tEqIcons.战线支撑者的荆棘重甲)
        .replace(/ys\/icon\/z\/z2306_/g, eUrl + tEqIcons.复苏战衣)
        .replace(/ys\/icon\/z\/z2307_/g, eUrl + tEqIcons.挑战斗篷)

        .replace(/ys\/icon\/z\/z2401_/g, eUrl + tEqIcons.探险者耳环)
        .replace(/ys\/icon\/z\/z2402_/g, eUrl + tEqIcons.占星师的耳饰)
        .replace(/ys\/icon\/z\/z2403_/g, eUrl + tEqIcons.萌爪耳钉)
        .replace(/ys\/icon\/z\/z2404_/g, eUrl + tEqIcons.猎魔耳环)
		.replace(/ys\/icon\/z\/z2405_/g, eUrl + tEqIcons.凶神耳环)
    return n;
};
function dsiRep(n, v) {
    if (!nowTheme.INF.COMP.DessertIcons || !nowTheme.DessertIcons || !nowTheme.DessertIcons.uri) { return v; };
    let dUrl = nowTheme.DessertIcons.common, tDsIcons = nowTheme.DessertIcons.uri;
    if (!dUrl) { return v; };
    n = v.replace(/.gif/g, nowTheme.DessertIcons.ext)
        .replace(/ys\/icon\/z\/z901/g, dUrl + tDsIcons.紫晶樱桃护身符)
        .replace(/ys\/icon\/z\/z902/g, dUrl + tDsIcons.蓝银葡萄护身符)
        .replace(/ys\/icon\/z\/z903/g, dUrl + tDsIcons.星铜苹果护身符);

    return n;
};
function itiRep(n, v) {
    if (!nowTheme.INF.COMP.ItemIcons || !nowTheme.ItemIcons || !nowTheme.ItemIcons.uri) { return v; };
    let iUrl = nowTheme.ItemIcons.common, tItIcons = nowTheme.ItemIcons.uri;
    if (!iUrl) { return v; };
    n = v.replace(/.gif/g, nowTheme.ItemIcons.ext)
        .replace(/ys\/icon\/i\/it001/g, iUrl + tItIcons.体能刺激药水)
        .replace(/ys\/icon\/i\/it002/g, iUrl + tItIcons.锻造材料箱)
        .replace(/ys\/icon\/i\/it003/g, iUrl + tItIcons.灵魂药水)
        .replace(/ys\/icon\/i\/it004/g, iUrl + tItIcons.随机装备箱)
        .replace(/ys\/icon\/i\/it005/g, iUrl + tItIcons.宝石原石)
        .replace(/ys\/icon\/i\/it310/g, iUrl + tItIcons.光环天赋石)
        .replace(/ys\/icon\/i\/it309/g, iUrl + tItIcons.苹果核)
        .replace(/ys\/icon\/i\/it301/g, iUrl + tItIcons.蓝锻造石)
        .replace(/ys\/icon\/i\/it302/g, iUrl + tItIcons.绿锻造石)
        .replace(/ys\/icon\/i\/it303/g, iUrl + tItIcons.金锻造石);

    return n;
};
function alliRep() {
    $("button[style*='ys/icon/z/z2']").attr("style", function (n, v) {
        n = IconMixMode(n, v, "EquipIcons");
        n = eqiRep(n, n);
        return n;
    });
    $(".fyg_tc>img[src*='ys/icon/z/z2']").attr("src", function (n, v) {
        n = eqiRep(n, v);
        return n;
    });
    $("img.img-rounded[src*='ys/icon/z/z2']").attr("src", function (n, v) {
        n = eqiRep(n, v);
        return n;
    });
    $("button[style*='ys/icon/z/z9']").attr("style", function (n, v) {
        /* 品质在 unique（原文）上，不在 style 里 —— 必须从这里取出来传进去，
           否则 IconMixMode 无从判断品质，所有护符会被套用同一个颜色。 */
        n = IconMixMode(n, v, "DessertIcons", dessertQualityRaw(this));
        n = dsiRep(n, n);
        return n;
    });

    $("button[style*='ys/icon/i/it']").attr("style", function (n, v) {
        n = itiRep(n, v);
        return n;
    });
    $(".fyg_f18>img[src*='ys/icon/i/it']").attr("src", function (n, v) {
        n = itiRep(n, v);
        return n;
    });
};

/* 当前装备获取组件 Now Equip Get COMP
   对应 3.10.x 的 themeIcon()/.fyg_tc>img 分支：从当前武器图标反推职介类别，
   供 Spine 看板娘按武器加载对应职介动画。
   3.x 的映射（z2101..z2111 -> 职介 1..10）原样保留；
   装备名/图标替换保持 4.x 的 alliRep() 职责，这里只做读取，不写 DOM。 */
let nowEquip = MGRConf.NowEquip;
/* 当前武器图标编号 Current Weapon Icon Id */
const EquipClassMap = {
    "01": 4, "02": 8, "03": 7, "04": 2,
    "06": 9, "07": 7, "08": 3, "09": 5
};
/* 旧版武器名（饮血长枪 / 荆棘剑盾 / 探险者手套 / 秃鹫手套 / 复苏木甲 / 探险者头巾 /
   占星师的发饰 / 天使缎带）在主题包里对应独立图标 id，需按 OldName 开关区分 */
function weaponIconClass(v) {
    let m = /z21(\d\d)_/.exec(v);
    if (!m) { return 0; };
    let id = m[1];
    if (EquipClassMap[id]) { return EquipClassMap[id]; };
    if (id == "10") { return (MGRConf.OldName == "checked") ? 6 : 10; };
    return 0;
};
function getNowEquip() {
    /* 与 getNowCard 一致：图片看板娘模式 / 主题包无 Spine 时不涉及职介动画 */
    if (MGRConf.Kanban != "checked") { return; };
    if (!nowTheme.INF.COMP.SpineKanban || MGRConf.AIKanban) { return; };
    let $wp = $(".fyg_tc>img[src*='ys/icon/z/z21']");
    if ($wp.length == 0) { return; };
    let src = $wp[0].getAttribute ? $wp[0].getAttribute("src") : $wp[0].src;
    if (!src) { return; };
    let cls = weaponIconClass(src);
    if (!cls) { return; };
    nowEquip = cls;
    MGRConf.NowEquip = nowEquip;
    upLocal(false);
    /* 职介变化才重新加载骨架，避免重复请求 */
    if (spinePagetype == cls) { return; };
    spinePagetype = cls;
    /* 职介/角色变了让模块重新加载骨架。
       注意公开 API 里这个名字是 switchCharacter —— `load` 只存在于模块**内层**实例上，
       宿主拿到的是 attach() 返回的公开包装对象，它没有 load（调用会抛
       "spineKanban.load is not a function"）。switchCharacter 内部就是转调 inst.load。 */
    if (spineKanban && typeof spineKanban.switchCharacter == "function") {
        spineKanban.switchCharacter(nowTheme.SpineKanban.conf[nowCard] || nowTheme.SpineKanban.conf.fallback, spinePagetype);
    };
};


/* 角色页立绘添加组件 Char FG/CG add COMP */
/* 获取当前角色组件 */
let nowCard = MGRConf.NowCard, tempCard;
/* 角色键列表 Card Key List
   优先用已初始化的 chars（可能已被主题包改名），
   否则回退到语言定义，保证早期调用也能工作。 */
function cardKeyList() {
    let own = function (o) {
        let out = [];
        if (!o) { return out; };
        for (let k in o) {
            if (Object.prototype.hasOwnProperty.call(o, k)) { out.push(k); };
        };
        return out;
    };
    /* chars 可能已被主题包改名，优先用它；未初始化时回退到语言定义。
       两者都用 typeof 探测，避免在词法声明前访问触发 TDZ 抛错。 */
    let list = (typeof chars != "undefined") ? own(chars) : [];
    if (list.length > 0) { return list; };
    if (typeof lang != "undefined" && lang && lang[LAConf] && lang[LAConf].chars) {
        return own(lang[LAConf].chars);
    };
    return [];
};
/* 角色名归一 Name Normalize：把各种写法收敛成主题包里的角色键 */
function normCardName(t) {
    if (t == null) { return null; };
    t = String(t).trim();
    if (!t) { return null; };
    let cardList = cardKeyList();
    for (let i = 0; i < cardList.length; i++) {
        if (t == cardList[i]) { return t; };
    };
    if (/^[\u4e00-\u9fa5]$/.test(t)) { return t; };
    if (/出战/.test(t) && cardList.length > 0) {
        let m = t.match(new RegExp('(' + cardList.join('|') + ')'));
        if (m) { return m[1]; };
    };
    return null;
};
/* 从一组元素里取第一个可识别的角色名 First Readable Card Name
   元素自身可能没有文本（真实标记里角色名在子 <span> 内，
   例如 #carding .text-info.fyg_f18.fyg_lh60>span），
   因此自身取不到时再尝试第一个子元素。 */
function readCardName(selectors) {
    for (let i = 0; i < selectors.length; i++) {
        let $els = $(selectors[i]);
        for (let j = 0; j < $els.length; j++) {
            let n = cardKeyDeep($els[j]);
            if (n) { return n; };
        };
    };
    return null;
};
/* 出战角色名解析 Equipped Card Name Resolve
   出战角色显示在装备页左侧「角色卡片」面板（#carding 里的
   .text-info.fyg_f18.fyg_lh60>span），这是服务端直出、不随预览变化。
   另备角色列表 / 出战中 等回退标记，全部失败时返回 null。 */
function detectEquippedCard() {
    return readCardName([
        "#carding .text-info.fyg_f18.fyg_lh60>span",
        "#carding .text-info.fyg_f18.fyg_lh60",
        "#carding .text-info>span[style*='font-size:42px']",
        "#carding .text-info.fyg_f18>span",
        "#carding .text-info",
        ".col-md-3>.text-info.fyg_f18.fyg_lh60>span"
    ]);
};
/* 预览角色名解析 Previewed Card Name Resolve
   3.10.x 用 .text-info.fyg_f24.fyg_lh60>span[style*='font-size:42px;']，
   游戏改版后该标记会缺失或变形，这里按可靠性依次尝试多种标记。 */
function detectPreviewCard() {
    return readCardName([
        ".text-info.fyg_f24.fyg_lh60>span[style='font-size:42px;']",
        ".text-info.fyg_f24.fyg_lh60>span[style*='font-size:42px']",
        ".text-info.fyg_f24.fyg_lh60>span",
        ".text-info.fyg_f24>span",
        ".text-info.fyg_f24",
        ".col-md-3>.text-info.fyg_f24"
    ]);
};
/* 是否处于角色专属详情预览 Is Card Detail Preview
   该视图由 xxcard() 渲染：角色卡片页签处于激活状态，
   且 #backpacks 里是单个角色的详情（角色名标记为 fyg_f24）。 */
function isCardDetailPreview() {
    if ($("#eqli2.active").length == 0) { return false; };
    return $(".text-info.fyg_f24").length > 0;
};
/* 看板角色解析 Resolve Kanban Card
   「强制上阵角色为看板娘」开启时：
     - 角色专属详情预览页 -> 跟随预览角色（便于逐个查看）
     - 其它页面           -> 固定使用出战角色
   关闭时维持原逻辑：由当前页面的角色标记决定，并在预览页永久切换看板。 */
function resolveKanbanCard() {
    if (MGRConf.ForceEquippedKanban == "checked") {
        if (isCardDetailPreview()) {
            let preview = detectPreviewCard();
            if (preview) { return preview; };
        };
        let equipped = detectEquippedCard();
        if (equipped) { return equipped; };
        /* 出战角色读不到时保留上一次结果，避免看板娘乱跳 */
        return nowCard || MGRConf.NowCard || null;
    };
    return detectPreviewCard();
};
function getNowCard() {
    tempCard = MGRConf.NowCard;
    let card = resolveKanbanCard();
    if (!card) { return; };
    nowCard = card;
    if (tempCard == nowCard) { return; };
    MGRConf.NowCard = nowCard;
    /* 原来由引擎持有的加载状态（loading / activeSkeleton / 动画缓存）现在在模块实例里，
       随实例销毁 —— 所以换人必须重建实例；否则 loading 仍为 true 会让加载链直接返回，
       看板娘不换人。
       职介要在销毁**之前**从旧实例读出来，之后再读就只剩 0 了。 */
    let prevClass = (spineKanban && spineKanban.getAnimClass()) || pagetype || 0;
    if (spineKanban) { spineKanban.destroy(); spineKanban = null; };
    pagetype = prevClass;
    $(".Kanban.SpineTool#Shell").remove();
    $(".Kanban.Spine#Main").remove();
    $(".Kanban.Image#Main").remove();
    if (nowTheme.INF.COMP.SpineKanban && nowTheme.SpineKanban && nowTheme.SpineKanban.conf) {
        /* 换人后职介由新角色自身声明决定，不能沿用上一个角色/武器的职介。
           注意：图片看板娘模式下 CharStatus 是 idle 图编号（字符串），
           此时不要碰 pagetype，否则 resolveAnimType 会读到垃圾值。 */
        if (!MGRConf.AIKanban) {
            /* 新角色的 conf 条目会在 insKanbanHTML() 重建实例时传入 */
            pagetype = prevClass;
        };
    };
    insKanbanHTML();
    upLocal(false);
};
/* 角色页面立绘CG添加组件 CharPage FG/CG Add COMP
   关键词替换遵循 unique 约定：元素首次被替换时把「未替换的原文」写入
   unique 属性，innerHTML 保存替换后的显示文本。
   因此一切「取角色名」都必须优先读 unique：innerHTML 可能已被替换成
   主题角色名（如 舞 -> 可可萝），再用显示文本去查主题包就会查不到。
   游戏改版后标记可能缺失或结构变形（元素无子节点等），全程逐层判空。 */
function fst(el) {
    if (!el) { return null; };
    let c = el.children;
    if (!c || c.length == 0) { return null; };
    return c[0];
};
/* unique 属性三态：null=未标记过，""=标记为原文为空，其余=原文 */
function hasUnique(el) {
    if (!el || !el.getAttribute) { return false; };
    return el.getAttribute("unique") !== null;
};
function uniqueOf(el) {
    if (!el || !el.getAttribute) { return null; };
    let v = el.getAttribute("unique");
    return (v === null || v === "") ? null : v;
};
/* 按 unique 约定取「角色原始键」 Card Key By Convention
   优先 unique，其次才对未替换过的显示文本做归一。 */
function cardKeyOf(el) {
    if (!el) { return null; };
    let n = normCardName(uniqueOf(el));
    if (n) { return n; };
    if (hasUnique(el)) { return null; };   /* 已替换过，显示文本不再可信 */
    return normCardName(el.innerText);
};
/* 元素自身或其后代里第一个可识别的角色键 First Card Key In Subtree
   实测角色名常常在子 <span> 内（例如出战面板
   #carding .text-info.fyg_f18.fyg_lh60 > span[style=font-size:42px]），
   而祖先元素的 innerText 也会拼进等级/经验等文字，
   因此必须逐层遍历后代，不能只看一层。 */
function cardKeyIn(el, depth) {
    let n = cardKeyOf(el);
    if (n) { return n; };
    if (!el || !el.children || depth > 4) { return null; };
    for (let i = 0; i < el.children.length; i++) {
        n = cardKeyIn(el.children[i], depth + 1);
        if (n) { return n; };
    };
    /* 纯文本节点形式（无子元素）时，用去掉空白后的整体文本兜底 */
    let t = (el.innerText != null ? String(el.innerText) : '').trim();
    if (t && !hasUnique(el)) {
        let m = t.match(/[\u4e00-\u9fa5]/g);
        if (m && m.length == 1) { return normCardName(m[0]); };
    };
    return null;
};
function cardKeyDeep(el) {
    return cardKeyIn(el, 0);
};
function cgImgAdd() {
    let tChar = nowTheme.CharTachie;
    /* 未启用角色立绘（或主题包不支持 / 非装备页）：只做列表缩进微调 */
    if (window.location.href.indexOf("fyg_equip.php") < 0 || nowTheme.INF.COMP.CharTachie != true || MGRConf.CharFGCG == "") {
        let $list = $(".col-sm-2.fyg_lh60>.fyg_f24");
        for (let i = 0; i < $list.length; i++) {
            let el = $list[i];
            if (!el || !cardKeyOf(el)) { continue; };
            let p = el.parentNode;
            if (!p || !p.style) { continue; };
            p.style.textAlign = "left";
            p.style.textIndent = MGRConf.CharName ? "2em" : "8em";
        };
        return;
    };
    if (!tChar) { return; };
    let charName = null;
    /* 详情视图左侧的角色立绘（LeftFG）。
       实测装备页根本不存在 .text-info.fyg_f24*（那是 3.x 的标记）——
       角色名面板实际是 #carding .text-info.fyg_f18.fyg_lh60。
       立绘挂在「出战中角色名面板」之后，保证落在左栏内而不是面板外。 */
    let $panel = $("#carding .text-info.fyg_f18.fyg_lh60");
    if ($panel.length == 0) { $panel = $("#carding .text-info"); };
    let panelKey = null;
    for (let i = 0; i < $panel.length; i++) {
        let k = cardKeyDeep($panel[i]);
        if (k) { panelKey = k; break; };
    };
    if (panelKey && tChar.LeftFG && tChar.LeftFG[panelKey] != null &&
        tChar.uri && tChar.uri[panelKey] && $("#leftFGimg").length == 0 && $panel.length > 0) {
        $(`<p id="leftFGimg1"></p>
            <img id="leftFGimg"
            src="${tChar.common + tChar.uri[panelKey] + tChar.LeftFG[panelKey] + tChar.ext}"
            style="cursor: pointer;">
            <p id="leftFGimg2"></p>`).insertAfter($($panel[0]));
    };
    if ($("#eqli2.active").length == 1) {
        if ($("#CGimg").length == 0) {
            $(`<p id="CGimg"></p><img class="main" id="CGimg" src="${nullimg}">
            <img class="sub" id="CGimg" src="${nullimg}">`)
                .insertBefore("#backpacks");
        };
        $("img.main#CGimg").hide();
        $("img.sub#CGimg").hide();
        /* CG 取角色键。
           规则（与「强制上阵角色为看板娘」的语义一致）：
             - 列表/非详情：用**出战角色**（#carding 面板）的 CG
             - 角色详情预览：#backpacks 里只剩当前预览角色，用它的 CG
           原实现「取第一个能识别的 .fyg_f24」在列表状态下会命中列表首项
           （可可萝/舞），于是非详情时 CG 恒为列表第一个角色，而不是出战角色。
           注意这里必须用 cardKeyOf（只看该元素自身/unique），
           不能用 cardKeyDeep —— 那会先命中外层行容器并返回别的角色。 */
        let cgKey = null;
        let $names = $(".fyg_f24:not(.fyg_colpz01)");
        let nameCount = 0, $first = null;
        for (let i = 0; i < $names.length; i++) {
            if (cardKeyOf($names[i])) { nameCount++; if (!$first) { $first = $names[i]; }; };
        };
        if (nameCount >= 2) {
            /* 角色列表：非详情 -> 用出战角色 */
            cgKey = panelKey;
        }
        else if (nameCount == 1) {
            /* 详情预览：#backpacks 里只剩当前预览角色 */
            cgKey = cardKeyOf($first) || cardKeyOf($first ? $first.parentNode : null) || panelKey;
        }
        else {
            cgKey = panelKey;
        };
        charName = cgKey;
        /* nameCount == 1 即「角色详情预览」：此时 #backpacks 里只剩当前预览角色。
           「角色详情页显示CG」关闭时，详情页不显示 CG（换成内置占位图），
           角色卡片列表页的显示不受影响。 */
        let isDetail = (nameCount == 1);
        if (isDetail && MGRConf.DetailCG != "checked") {
            $("img.main#CGimg").attr('src', nullimg);
            $("img.sub#CGimg").attr('src', nullimg);
            $("img.main#CGimg").removeAttr('data-cgcard');
            $("img.sub#CGimg").removeAttr('data-cgcard');
            $("img.sub#CGimg").hide();
        }
        else if (cgKey && tChar.uri && tChar.uri[cgKey] && tChar.CG && tChar.CG[cgKey]) {
            let src = tChar.common + tChar.uri[cgKey] + tChar.CG[cgKey] + tChar.ext;
            $("img.sub#CGimg").attr('src', src);
            /* 把角色键记在元素上：点击时用「这张 CG 的角色」而不是当时的出战角色 */
            $("img.main#CGimg").attr('data-cgcard', cgKey);
            $("img.sub#CGimg").attr('data-cgcard', cgKey);
            $("img.sub#CGimg").show();
        }
        else {
            $("img.sub#CGimg").removeAttr('data-cgcard');
            $("img.sub#CGimg").hide();
        };
        /* 角色列表头像。
           实测每个角色行里有两个 .col-sm-2.fyg_lh60：
             名字格 .col-sm-2.fyg_lh60            <- 要处理的
             等级格 .col-sm-2.fyg_tl.fyg_lh60     <- 也会被宽松选择器命中
           原来用 $(".col-sm-2.fyg_lh60") 会同时匹配两者，循环下标 i 每行 +2，
           而头像文件名取自下标（HeadFG[key] 与主题包「第几项」），于是从第 2 行
           起头像整体错位、并出现重复。改为直接选角色名 span，一行一次。
           另外：角色详情预览页已经有 CG 大图，不再叠加小头像
           （原实现会插到名字前，导致「头像 + 换行 + 名字」的错位断行）。 */
        /* 仅角色列表需要小头像；详情预览只有一个名字且已有 CG，跳过。 */
        let $list = $(".col-sm-2.fyg_lh60>.fyg_f24");
        let listCount = 0;
        for (let i = 0; i < $list.length; i++) { if (cardKeyOf($list[i])) { listCount++; }; };
        if (listCount < 2) { $list = []; };
        for (let i = 0; i < $list.length; i++) {
            let nameEl = $list[i];
            let key = cardKeyOf(nameEl);
            if (!key) { continue; };
            let host = nameEl.parentNode || null;
            let cell = host;
            if (cell && cell.style) { cell.style.textAlign = "left"; };
            let first = fst(cell) || nameEl;
            /* 幂等：该格已有头像就不再叠加（Ajax 重绘会反复调用） */
            if (cell && $(cell).find("img.HeadFG").length > 0) { continue; };
            let src, spanId;
            if (!tChar.uri || !tChar.uri[key] || !tChar.HeadFG || tChar.HeadFG[key] == null) {
                src = nullimg; spanId = "HeadFGNull";
            }
            else {
                src = tChar.common + tChar.uri[key] + tChar.HeadFG[key] + tChar.ext;
                spanId = "HeadFG1_" + i;
            };
            if (first) {
                $(`<img class="HeadFG" id="HeadFG_${i}"
                    src="${src}"
                    style="vertical-align:top !important;">
                    <span id="${spanId}">&nbsp;&nbsp;</span>`)
                    .insertBefore(first);
            };
        };
    }
    else {
        if ($("img#CGimg").length != 0) {
            $("img#CGimg").attr('src', nullimg);
            $("img#CGimg").hide();
        };
    };
};


/* 取「未替换的原文」 Raw Original Text
   战斗页的名称是带位置的复合字符串（如 "Lv.x 舞 ..."），
   解析要用原文，不能用可能已被替换过的显示文本。
   遵循 unique 约定：有标记就用标记，否则用 innerText。 */
function rawTextOf(el) {
    if (!el) { return null; };
    let v = uniqueOf(el);
    if (v) { return v; };
    return el.innerText != null ? el.innerText : null;
};
/* 战斗页立绘添加组件 PK FG/CG add COMP
   同样对缺失/变形的标记逐层判空，避免 children[0] 为 undefined 时抛错。 */
function pkImgAdd() {
    if (window.location.href.indexOf("fyg_pk.php") < 0 || !nowTheme.INF.COMP.CharTachie || MGRConf.CharFGCG == "") {
        return;
    };
    let charName, tChar = nowTheme.CharTachie;
    if (!tChar || !tChar.uri) { return; };
    if ($(".col-md-6>.alert.alert-danger").length > 0) {
        let $left = $(".col-md-7.fyg_tr");
        for (let i = 0; i < $left.length; i++) {
            let LfPKFG = $left[i];
            if (!LfPKFG || !LfPKFG.style) { continue; };
            charName = rawTextOf(fst(LfPKFG));
            if (!charName || charName.length < 9) { continue; };
            if (charName[7] == " ") {
                let n = charName[8];
                if (!tChar.uri[n] || !tChar.LeftPKFG || tChar.LeftPKFG[n] == null) { continue; };
                LfPKFG.style.backgroundImage = `
                url("${tChar.common + tChar.uri[n] + tChar.LeftPKFG[n] + tChar.ext}")`;
                LfPKFG.style.backgroundSize = "contain";
                LfPKFG.style.backgroundPosition = "left top";
                LfPKFG.style.backgroundRepeat = "no-repeat";
                LfPKFG.style.height = "100%";
            };
        };
    };
    if ($(".col-md-6>.alert.alert-info").length > 0) {
        let $right = document.getElementsByClassName('col-md-7 fyg_tl');
        for (let i = 0; i < $right.length; i++) {
            let rtPKFG = $right[i];
            if (!rtPKFG || !rtPKFG.style) { continue; };
            charName = rawTextOf(fst(rtPKFG));
            if (!charName) { continue; };
            let isMob = false;
            for (let k = 0; k < mobCheck.length; k++) {
                if (charName.indexOf(mobCheck[k]) > -1) {
                    isMob = true;
                    if (nowTheme.INF.COMP.MobsTachie && nowTheme.MobsTachie) {
                        let tMob = nowTheme.MobsTachie;
                        rtPKFG.style.backgroundImage = `url("${tMob.common + tMob.uri[mobCheck[k]] + tMob.ext}")`;
                        rtPKFG.style.backgroundSize = "contain";
                        rtPKFG.style.backgroundPosition = "right top";
                        rtPKFG.style.backgroundRepeat = "no-repeat";
                    };
                };
            };

            if (charName[7] != " " && isMob == false && charName.length >= 9) {
                let n = charName[charName.length - 9];
                if (!tChar.uri[n] || !tChar.RightPKFG || tChar.RightPKFG[n] == null) { continue; };
                rtPKFG.style.backgroundImage = `
                url("${tChar.common + tChar.uri[n] + tChar.RightPKFG[n] + tChar.ext}")
                `;
                rtPKFG.style.backgroundSize = "contain";
                rtPKFG.style.backgroundPosition = "right top";
                rtPKFG.style.backgroundRepeat = "no-repeat";
				rtPKFG.style.height = "100%";
            };
        };
    };
};

/*
  主题语音组件 Theme Voice COMP
  对应 3.10.x 的 themeVoice()，音源来自主题包的 CharSounds 组件。
*/
/* 主题语音可用性 Theme Voice Available */
function voiceAvailable(theme) {
    return !!(theme.INF.COMP.CharSounds && theme.CharSounds && theme.CharSounds.uri);
};
/* 取某角色的语音前缀 Character Voice Prefix */
function voicePrefix(cardname) {
    let t = nowTheme;
    if (!voiceAvailable(t)) { return null; };
    let card = cardname || nowCard || MGRConf.NowCard;
    let uri = t.CharSounds.uri[card];
    if (!uri) { return null; };
    return t.CharSounds.common + (uri.charAt(uri.length - 1) == "/" ? uri : uri + "/");
};
/* 主题语音播放 Theme Voice Play
   type: on / off / click / levelup / colle / change / power / win / lose / reset / exp / battle
   cardname: 指定角色，缺省使用当前角色 */
function charVoice(type, cardname) {
    let t = nowTheme;
    if (!t || !voiceAvailable(t)) { return false; };
    let $audio = $(".tpmSetting#themeSoundPlay");
    if ($audio.length == 0) {
        $audio = $(`<audio id="themeSoundPlay" class="tpmSetting" controls src="${nullimg}" type="audio/mp3" style="display:none"></audio>`);
        $audio.appendTo('body');
    };
    let node = $audio[0];
    /* 开关提示音不受语音开关限制 */
    if (type == "on") {
        node.loop = false;
        node.src = t.CharSounds.common + t.CharSounds.uri.on + t.CharSounds.ext;
        playVoice = true;
        node.play().catch(function () { });
        return node;
    };
    if (type == "off") {
        if (!playVoice) { return false; };
        node.loop = false;
        node.src = t.CharSounds.common + t.CharSounds.uri.off + t.CharSounds.ext;
        playVoice = false;
        node.play().catch(function () { });
        return node;
    };
    if (MGRConf.Voice != "checked") { return false; };
    let prefix = voicePrefix(cardname);
    if (!prefix) { return false; };
    let loop = false;
    if (type == "click") {
        /* 与 3.10.x 一致：点击音为 0-3 的随机一条 */
        node.src = prefix + Math.ceil(Math.random() * 4 - 1) + t.CharSounds.ext;
    }
    else if (["levelup", "colle", "change", "power", "win", "lose", "reset", "exp", "battle"].indexOf(type) > -1) {
        node.src = prefix + type + t.CharSounds.ext;
        /* 战胜/战败不循环。
           3.10.x 曾是「ended 后再 play 一次」的循环，迁移时写成 node.loop = true，
           带来两个问题：
             1) 战败音无限重复播放；
             2) 结果音结束后再次战斗时，同一 src 的 play() 对已结束的媒体是空操作
                （不会再播），于是「第二次战败没有声音」。
           改为单次播放 + 播前 seek 归零，两个问题一起解决。 */
        loop = false;
    }
    else {
        return false;
    };
    node.loop = loop;
    /* 播前归零：同一 src 连续触发时保证从头重播 */
    try {
        node.pause();
        node.currentTime = 0;
    }
    catch (e) { };
    node.play().catch(function () { });
    /* 返回播放节点：调用方据此判断「是否正在播」，
       以便把结果语音/看板动作排到出击语音之后。 */
    return node;
};
/* 主题语音是否正在播放（用于排「出击语音 -> 结果语音」的顺序） */
function voicePlaying() {
    let $audio = $(".tpmSetting#themeSoundPlay");
    if ($audio.length == 0) { return false; };
    let node = $audio[0];
    return !!(node && !node.paused && !node.ended && node.currentTime > 0);
};


/*
  插件页面资产
  Page Assets
*/

/* CSS */
const SettingCssCommon = `
#settingIconBox{
    position:fixed;
    margin-left: -25px;
    margin-top: -25px;
    right:20px;
    bottom:20px;
    z-index:88;
    cursor:pointer;
    width:72px;
    height=72px;
}

.settingBoxMain>hr {
    border-top: 1px solid #333;
    margin-top: 0px;
    margin-bottom: 5px;
}

.btn-switch {
    cursor: pointer;
    width: 52px;
    height: 25px;
    position: relative;
    border: 1px solid #505050;
    background-color: #111;
    box-shadow: #dfdfdf 0 0 0 0 inset;
    border-radius: 20px;
    background-clip: content-box;
    display: inline-block;
    -webkit-appearance: none;
    user-select: none;
    outline: none !important;
    margin: 0px 0 0;
    color:#ccc;
}

.btn-switch.large {
    width: 70px;
    height: 24px;
    border-radius: 30px;
}

.btn-switch.large.btns,.btn-switch.large.select {
    line-height: normal;
    text-align: center;
}

.btn-switch.large.select {
    width: 110px;
}

.btn-switch.large.input {
    text-align: right;
}

.btn-switch.large:before {
    content: '';
    width: 22px;
    height: 22px;
    border-radius: 30px;
}

.btn-switch.large:after {
    content: '';
    color: #999;
    left: 30px;
    position: absolute;
    line-height: 24px;
    font-size: 14px;
}

.btn-switch.large:checked:after {
    content: '';
    color: #fff;
    left: 10px;
    position: absolute;
    line-height: 24px;
    font-size: 14px;
}

.btn-switch.large:checked:before {
    left: 46px;
}

.btn-switch:before {
    content: '';
    width: 29px;
    height: 23px;
    position: absolute;
    top: 0px;
    left: 0;
    border-radius: 20px;
    background-color: #ddd;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
}

.btn-switch:checked {
    border-color: #225ab3;
    box-shadow: #225ab3 0 0 0 16px inset;
    background-color: #225ab3;
}

.btn-switch:checked:before {
    left: 21px;
}

.btn-switch.btn-switch-animbg {
    transition: background-color ease 0.4s;
}

.btn-switch.btn-switch-animbg:before {
    transition: left 0.3s;
}

.btn-switch.btn-switch-animbg:checked {
    box-shadow: #dfdfdf 0 0 0 0 inset;
    background-color: #64bd63;
    transition: border-color 0.4s, background-color ease 0.4s;
}

.btn-switch.btn-switch-animbg:checked:before {
    transition: left 0.3s;
}

.btn-switch.btn-switch-anim {
    transition: border cubic-bezier(0, 0, 0, 1) 0.4s, box-shadow cubic-bezier(0, 0, 0, 1) 0.4s;
}

.btn-switch.btn-switch-anim:before {
    transition: left 0.3s;
}

.btn-switch.btn-switch-anim:checked {
    box-shadow: #64bd63 0 0 0 16px inset;
    background-color: #64bd63;
    transition: border ease 0.4s, box-shadow ease 0.4s, background-color ease 1.2s;
}

.btn-switch.btn-switch-anim:checked:before {
    transition: left 0.3s;
}

input[type=checkbox]:checked::before {
    font: normal normal normal 14px/2 FontAwesome;
}
`
    , SettingCssPC = `
.settingBox {
    position:fixed;
    z-index:999;
    border: 20px solid #000;
    border-radius: 60px;
    width:450px;
    height:800px;
    bottom: 10px;
    right: 10px;
    /* 三段式布局：头部/页脚固定，只有中间内容区滚动，
       因此面板内容变长时页脚不会被顶出手机外壳。
       用「绝对定位三段」而不是 flex：父级不裁剪时 flex 子项拿不到有界高度，
       overflow-y:auto 会静默失效（PC 下滚不动的真正原因）；
       绝对定位给的是确定高度，必定生效。
       注意：display 上不能加 important —— jQuery 的 show()/hide() 用行内样式，
       important 会压过它，导致面板关不掉（一直显示）、原有点图标进子页的交互失效。
       底色铺满整个外壳（含圆角区），否则壳外会露出下层网页内容。 */
    background-color: #000;
    display: block;
}
/* 外发光（手机外壳的光晕）。
   关键：它必须画在「外壳底色之后」。
   因为 ::before 是子元素，默认永远画在父元素背景之上；
   一旦父级有了不透明底色，这层半透明发光就会变成盖在填充上的膜，
   既露出下面的网页内容、又不再是外发光。
   用 z-index:-1 把它压到父级背景之后（父级已建立层叠上下文），
   于是既能共存、又不会在壳上留缝。 */
.settingBox:before {
    content: "";
    position: absolute;
    z-index: -1;
    width: 430px;
    height: 787px;
    box-shadow: 0 0 24px #fff;
    border-radius: 45px;
    left: -10px;
    top: -8px;
    pointer-events: none;
}
.settingBoxMain {
   color: #888;
   background-color: #000;
   padding: 0 5px;
   font-size: 18px;
   line-height:30px;
   /* 夹在头部(42px)与页脚之间：上下偏移量确定，因此高度确定，
      overflow-y:auto 必定生效（原来固定 height:788px，内容超长会溢出且页脚被顶走）。 */
   position: absolute;
   top: 42px;
   bottom: 32px;
   left: 0;
   right: 0;
   overflow-y: auto;
   overflow-x: hidden;
   -webkit-overflow-scrolling: touch;
   /* 只接管纵向手势，横向仍可正常操作；滚动不穿透到下层页面 */
   touch-action: pan-y;
   overscroll-behavior-y: contain;
   scrollbar-width: thin;
   scrollbar-color: #555 #000;
}
.settingBoxMain::-webkit-scrollbar {
   width: 8px;
}
.settingBoxMain::-webkit-scrollbar-track {
   background: #000;
}
.settingBoxMain::-webkit-scrollbar-thumb {
   background: #555;
   border-radius: 4px;
}
/* 可拖拽滚动的容器：抓取手势 + 拖动时禁止选中文字 */
.settingBoxMain.gtpDraggable {
   cursor: grab;
}
.settingBoxMain.gtpDragging {
   cursor: grabbing;
   user-select: none;
   -webkit-user-select: none;
}
.settingBoxHeader {
    /* 绝对定位：位置由父级（固定高度的 .settingBox）确定，
       从而让中间内容区拿到确定高度可以滚动。 */
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 42px;
    background-color: #222;
    display: block;
   font-size: 100%;
   margin: 0px;
   padding: 0px;
   color: #aaaaaa;
   font-family: "Helvetica Neue", Helvetica, arial, sans-serif;
   line-height: 1.231;
   border-top-left-radius:36px;
   border-top-right-radius:36px;
}
.settingBoxHeader>logo{
   float: left;
   color: #aaaaaa;
   margin: 25px 2px 0px 30px;
   font-size: 150%;
   padding: 0px;
   display: block;
   margin-block-start: 0.67em;
   margin-block-end: 0.67em;
   margin-inline-start: 0px;
   margin-inline-end: 0px;
}
.settingBoxHeader>span {
   cursor: pointer;
   color: #aaa;
   position: relative;
   float: right;
   margin: 25px 2px 0px 30px;
   font-size: 150%;
   padding: 0px;
   margin-block-start: 0.67em;
   margin-block-end: 0.67em;
   margin-inline-start: 0px;
   margin-inline-end: 0px;
}
.settingBoxFooter {
   background-color: #111;
   border-top: 1px solid #333;
   padding: 8px 0 6px 10px;
   color: #888;
   font-size: 10px;
   margin: 0;
   border-bottom-left-radius:36px;
   border-bottom-right-radius:36px;
   /* 固定在底部，内容区滚动时始终可见 */
   position: absolute;
   left: 0;
   right: 0;
   bottom: 0;
}
.settingBoxFooter>a {
   position: relative;
   color: #888;
   font-size: 10px;
}
.settingCOMP.appIcons {
    display: inline-block;
    line-height: 18px;
    text-align: center;
    width: 24.6%;
    font-size: 14px;
    padding: 10px 1px;
}
.settingCOMP.appIcons>img{
    cursor: pointer;
    position:relative;
    padding: 5px 5px;
    width: 50%;
}
.settingCOMP.appIcons>span{
    height: 2.7em;
    word-break: break-word;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    display: -webkit-box;
    overflow: hidden;
}
`
    , SettingCssPhone = `
/* 手机端：外观完全保持原样（铺满视口的仿真手机菜单），
   仅补上三段式滚动布局，使内容可滚动、头部页脚不被顶走。 */
.settingBox {
    position:fixed;
    z-index:999;
    width:100%;
    height:100%;
    /* 底色铺满，避免边缘露出下层网页内容 */
    background-color: #000;
    /* 四边都贴住视口，避免不同浏览器下 100% 与 fixed 组合出现偏差 */
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    margin: 0px;
    /* 同样不能用 !important：否则 show()/hide() 关不掉面板 */
    display: flex;
    flex-direction: column;
    overflow: hidden;
 }
 .settingBoxMain {
    color: #888;
    background-color: #000;
    padding: 20px;
    font-size: 3.6em;
    line-height:2.4em;
    /* 原来固定 height:92%、不滚动 → 内容溢出；
       改为占满剩余空间并在内部滚动。 */
    flex: 1 1 auto;
    min-height: 0;
    overflow-y: auto;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
    touch-action: pan-y;
    overscroll-behavior-y: contain;
 }
 .settingBoxHeader {
    height: 5%;
    background-color: #000;
    display: block;
    font-size: 4em;
    line-height:2.4em;
    color: #bbbbbb;
 }
 .settingBoxHeader>span {
    cursor: pointer;
    color: #aaa;
    position: relative;
    float: right;
 }
 .settingBoxFooter {
    /* 原来 height:100% 会把页脚整个顶出屏幕，改由 flex 自适应 */
    flex: 0 0 auto;
    background-color: #000;
    color: #bbb;
    font-size: 3em;
 }
 .settingBoxFooter>a {
    position: relative;
    color: #bbb;
 }
`
    , CharCssPC = `
.col-sm-2.fyg_lh60{
    width:33%;
}
.col-sm-2.fyg_tl.fyg_lh60{
    width:16%;
}
.col-sm-8{
    width:50%;
}
.HeadFG {
    height:50px;
    width:50px;
}
`
    , CharCssPhone = `
.col-sm-2.fyg_lh60{
    width:33%;
}
.col-sm-2.fyg_tl.fyg_lh60{
    width:16%;
}
.col-sm-8{
    width:50%;
}
.HeadFG {
    height:50px;
    width:50px;
}
`
    , PKCssPC = `
.col-md-6>.alert{
    height: 100%;
}
.col-md-6>.alert>.row>.col-md-7{
    height: 100%;
}
`
    , PKCssPhone = `
.col-md-6>.alert{
    height: 100%;
}
.col-md-6>.alert>.row>.col-md-7{
    height: 100%;
}
`
    , GTPCssCommon = `
/* 仓库装备图标大小与背景适配 Icon Size & Background Fit
   注意：4.x 主题包的 Style.dfbacksize / eqbacksize 存放的是「整条声明」
   （形如 "background-size:100% 100%;"），必须取出其值再拼装，
   否则会生成 background-size:background-size:100% 100%; 这种非法声明，
   浏览器整条丢弃，图标背景与稀有度边框就会失效。 */
.btn.fyg_mp3 {
    width:${Math.floor(MGRConf.IconSize)}px !important;
    height:${Math.floor(MGRConf.IconSize)}px !important;
    line-height:${Math.floor(MGRConf.IconSize * 3.1 / 5) - 1}px;
    background-size:${cssDeclValue(nowTheme.Style.dfbacksize)};
}
.btn.fyg_tr.fyg_mp3 {
    width: 263px !important;
    height: 40px !important;
}
.btn.fyg_tl.fyg_mp3 {
    width: 263px !important;
    height: 40px !important;
}
.btn.fyg_tc.fyg_mp3 {
    width: 536px !important;
    height: 40px !important;
}
.btn.fyg_colpzbg.fyg_mp3 {
    width:${Math.floor(MGRConf.IconSize)}px !important;
    height:${Math.floor(MGRConf.IconSize)}px !important;
    background-size:${cssDeclValue(nowTheme.Style.eqbacksize)};
}
.img-rounded {
    width:${Math.floor(MGRConf.IconSize)}px;
    height:${Math.floor(MGRConf.IconSize)}px;
}
.smallcardimg {
    width:${Math.floor(MGRConf.IconSize)}px;
    height:${Math.floor(MGRConf.IconSize)}px;
}
.btn.fyg_colpzbg.fyg_colpz01.fyg_mp3.fyg_tc,
.btn.fyg_colpzbg.fyg_colpz02.fyg_mp3.fyg_tc,
.btn.fyg_colpzbg.fyg_colpz03.fyg_mp3.fyg_tc,
.btn.fyg_colpzbg.fyg_colpz04.fyg_mp3.fyg_tc,
.btn.fyg_colpzbg.fyg_colpz05.fyg_mp3.fyg_tc {
    width: 60px !important;
    height: 100px !important;
    line-height: 24px;
}
`
    , GTPCssPC = `
`
    , GTPCssPhone = `
/* 移动视图样式适配 Mobile Layout Style */
select, body, h4, h5, i, .fyg_f14, h3, button, input, span, .panel-body, .col-sm-8 {
    font-size: 28px !important;
}
h2, .panel-heading, .fyg_f18, .col-sm-2.fyg_lh60 {
    font-size: 32px !important;
}
.col-sm-2.fyg_lh60[style='text-align: left;'] {
    width: 180px;
    white-space: pre-wrap;
}
.text-info.fyg_f24.fyg_lh60>span, .text-info.fyg_f24, .col-sm-2.fyg_lh60[style='text-align: left;']>span {
    font-size: 48px !important;
}
.progress {
    height: 24px !important;
}
div[class*='progress-bar'] {
    font-size: 26px !important;
    line-height: 24px;
}
p {
    font-size: 26px !important;
}
div[class='btn'], div[class='btn btn-primary'], .with-padding.bg-special.fyg_f14, .icon.icon-diamond {
    font-size: 24px !important;
}
.btn.btn-block.dropdown-toggle.fyg_lh30 {
    font-size: 18px !important;
}
button[onclick*='b_forcbs('] {
    white-space: pre-wrap;
}
.img-rounded, .smallcardimg {
    height: 100px;
    width: 100px;
}
.btn.fyg_mp3 {
    width:${Math.floor(MGRConf.IconSize * 2)}px !important;
    height:${Math.floor(MGRConf.IconSize * 2)}px !important;
    line-height:${Math.floor(MGRConf.IconSize * 1.2) - 1}px;
}
.btn.fyg_colpzbg.fyg_mp3 {
    width:${Math.floor(MGRConf.IconSize * 2)}px !important;
    height:${Math.floor(MGRConf.IconSize * 2)}px !important;
}
.fyg_tc>.btn.fyg_colpzbg.fyg_mp3.fyg_tc {
    width: 120px !important;
    height: 160px !important;
    line-height: 42px;
}
.btn.btn-primary.btn-group.dropup {
    height: 160px !important;
}
.HeadFG {
    height: 100px;
    width: 100px;
}
`
    , KanbanCssCommon = `
.Kanban.Spine#Canvas {
    display: block;
}
`
    , KanbanCssPC = `
.Kanban.Spine#Main {
    width:${3.65 * Math.floor(MGRConf.KanbanSize)}px;
    height:${3.05 * Math.floor(MGRConf.KanbanSize)}px;

}
.Kanban.Spine#Canvas {
    width:${3.6 * Math.floor(MGRConf.KanbanSize)}px;
    height:${3 * Math.floor(MGRConf.KanbanSize)}px;
}
.Kanban.Image#Main {
    width:${3.6 * Math.floor(MGRConf.KanbanSize)}px;
    height:${3 * Math.floor(MGRConf.KanbanSize)}px;
}
/* 图片看板娘按 MGRConf.KanbanSize% + object-fit:contain，配合画布的 flex 居中，
   立绘既不会撑破 bg，又能随「看板娘大小」一起缩放。 */
.Kanban.Image#Canvas {
    overflow: hidden;
	display: flex;
    justify-content: center;   /* 水平居中 */
    align-items: center;
}
.Kanban.Image#Image {
    width: ${imageKanbanResize()}%;
    height: ${imageKanbanResize()}%;
    object-fit: contain;
    object-position: center bottom;
    display: block;
}
`
    , KanbanCssPhone = `
.Kanban.Spine#Main {
    width:${4.85 * Math.floor(MGRConf.KanbanSize)}px;
    height:${4.05 * Math.floor(MGRConf.KanbanSize)}px;

}
.Kanban.Spine#Canvas {
    width:${4.8 * Math.floor(MGRConf.KanbanSize)}px;
    height:${4 * Math.floor(MGRConf.KanbanSize)}px;
}
/* 图片看板娘：立绘等比缩放并完整放进画布，不超出 bg 画布范围 */
.Kanban.Image#Canvas {
    overflow: hidden;
	display: flex;
    justify-content: center;   /* 水平居中 */
    align-items: center;
}
.Kanban.Image#Image {
    width: ${imageKanbanResize()}%;
    height: ${imageKanbanResize()}%;
    object-fit: contain;
    object-position: center bottom;
    display: block;
}
`;


/* CSS Switch */
let SettingCss, GPTCss, KanbanCss, NightCss, useMobileLayout = false;
/* 移动视图样式适配 Mobile Layout Style：
   与 3.10.x 保持一致，由 UA 判定移动端；也可在设置面板中手动开启/关闭。 */
if (MGRConf.MobileLayout == "checked") {
    useMobileLayout = true;
}
else if (MGRConf.MobileLayout == "") {
    useMobileLayout = false;
}
else {
    useMobileLayout = (navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Phone') > -1);
};

/* 夜间模式 Night Mode */
browserNightMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
function nightModeCheck() {
    if (MGRConf.NightMode == "checked") { return true; };
    return MGRConf.AutoNight == "checked" && browserNightMode;
};
NightCss = `
/* 夜间模式 Night Mode */
body {
    background-color: ${nowTheme.Style.night.bgcr} !important;
    color: ${nowTheme.Style.night.textcr} !important;
}
.panel, .panel-body, .panel-heading, .well, .modal-content, .modal-body, .modal-header, .modal-footer,
.table, .table>tbody>tr>td, .table>thead>tr>th, .dropdown-menu, .alert, .list-group-item {
    background-color: ${nowTheme.Style.night.panelcr} !important;
    color: ${nowTheme.Style.night.textcr} !important;
    border-color: ${nowTheme.Style.night.bordercr} !important;
}
.panel-heading, .modal-header, .modal-footer, .table>thead>tr>th {
    border-color: ${nowTheme.Style.night.bordercr} !important;
}
.btn-default, .btn.btn-default, input, select, textarea {
    background-color: ${nowTheme.Style.night.panelcr} !important;
    color: ${nowTheme.Style.night.textcr} !important;
    border-color: ${nowTheme.Style.night.bordercr} !important;
}
a, .text-primary, .text-info {
    color: ${nowTheme.Style.night.linkcr} !important;
}
`;

function nightCssSwitch() {
    let $night = $("style#GTPNightCss");
    if (nightModeCheck()) {
        if ($night.length == 0) {
            $('head').append(`<style id="GTPNightCss">${NightCss}</style>`);
        }
        else {
            $night.html(NightCss);
        };
    }
    else if ($night.length > 0) {
        $night.remove();
    };
};

/* 构建 GTP 全局样式 Build GTP Global CSS（受图标大小 / 移动视图影响） */
function buildGPTCss() {
    let css = GTPCssCommon + (useMobileLayout ? GTPCssPhone : GTPCssPC);
    if (window.location.href.indexOf("fyg_equip.php") > -1) {
        css += useMobileLayout ? CharCssPhone : CharCssPC;
    };
    if (window.location.href.indexOf("fyg_pk.php") > -1) {
        css += useMobileLayout ? PKCssPhone : PKCssPC;
    };
    return css;
};

/* 主题自定义样式 Theme Custom Style */
function themeStyleCss() {
    let bg = nowTheme.INF.COMP.Style ? nowTheme.Style.kanbanbg : "";
    if (!bg) {
        if (nowTheme.INF.COMP.ImageKanban && nowTheme.ImageKanban) { bg = nowTheme.ImageKanban.bg; }
        else if (nowTheme.INF.COMP.SpineKanban && nowTheme.SpineKanban) { bg = nowTheme.SpineKanban.bg.url; };
    };
    if (!bg) { return ""; };
    return `#divkanban:hover, .Kanban#Main:hover {\n    background: url(${bg});\n    background-size: cover;\n}\n`;
};

if (useMobileLayout) {
    SettingCss = SettingCssCommon + SettingCssPhone;
    KanbanCss = KanbanCssCommon + KanbanCssPhone;
} else {
    SettingCss = SettingCssCommon + SettingCssPC;
    KanbanCss = KanbanCssCommon + KanbanCssPC;
};
GPTCss = buildGPTCss();

function insCss() {
    $('head').append(`<style id="GTPCss">${GPTCss}</style>`);
    let themeCss = themeStyleCss();
    if (themeCss) {
        $('head').append(`<style id="GTPThemeCss">${themeCss}</style>`);
    };
    nightCssSwitch();
};

insCss();


/* Kanban HTML */

if (!nowTheme.INF.COMP.SpineKanban && !nowTheme.INF.COMP.ImageKanban && MGRConf.Kanban) {
    MGRConf.Kanban = "";
    upLocal(false);
    /* 此处早于 insSettingHTML()（设置在 4611 行才插入 DOM），
       #Kanban 复选框可能还不存在，直接 [0].checked 会抛
       TypeError: Cannot set properties of undefined。
       元素不存在也没关系：设置面板稍后按 MGRConf.Kanban 渲染，自会是未勾选。 */
    let $kanbanSwitch = $(".tpmSetting#Kanban");
    if ($kanbanSwitch.length > 0 && $kanbanSwitch[0]) {
        $kanbanSwitch[0].checked = "";
    };
    alert(err.code + 'K_MA_001' + err.info + err.K.MA._001);
};
/* 图片看板娘使用角色立绘（CharTachie.LeftFG）。
   与 ImageKanban 的 idle/win/lose 图属同一套路径结构
   （common + uri[角色] + 文件名 + ext），因此可直接替换。
   默认启用（无开关）；取不到时返回 null，调用方自动回退到 ImageKanban 自己的图。 */
function imageKanbanUrl(card) {
    if (!card) { return null; };
    let tC = nowTheme.ImageKanban;
    if (!tC || !tC.uri || !tC.idle) { return null; };
    let uri = tC.uri[card], fg = tC.idle[card];
    if (!uri || fg == null) { return null; };
    return tC.asset.common + uri + fg + tC.asset.ext;
};
/* 图片看板娘的缩放百分比。主题未声明 ImageKanban 时必须可回退，
   否则模板字符串在拼接样式阶段就会抛异常（与是否真的显示图片看板娘无关）。 */
function imageKanbanResize() {
    let a = nowTheme.ImageKanban && nowTheme.ImageKanban.asset;
    let r = a && a.resize;
    r = parseFloat(r);
    return (isNaN(r) || r <= 0) ? 64 : r;
};
/* 看板娘尺寸：桌面 / 移动两套比例，与原来的 CSS 数值一致 */
function kanbanSpineStyle() {
    let boxy = (MGRConf.MobileLayout == "checked") ||
        (MGRConf.MobileLayout == "" && /Android|Phone|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent));
    let size = Math.floor(MGRConf.KanbanSize) || 100;
    return boxy
        ? { main: [4.85 * size, 4.05 * size], canvas: [4.8 * size, 4 * size] }
        : { main: [3.65 * size, 3.05 * size], canvas: [3.6 * size, 3 * size] };
};
function insKanbanHTML() {
    if ($(".Kanban#Main").length > 0) {
        return;
    };
    if (MGRConf.Kanban) {
        let KanbanHTML;
        if (nowTheme.INF.COMP.SpineKanban && !MGRConf.AIKanban) {
            let tempSpine = nowTheme.SpineKanban;
            KanbanBG = tempSpine.bg.url;
            KanbanAssest = tempSpine.assest;
            KanbanCommon = KanbanAssest.common;
            KanbanSkill = KanbanAssest.skill;
            /* 未单独配置的角色用 conf.fallback 兜底
               （原来直接取 conf[nowCard]，该角色没配置时 undefined.uri 会抛异常） */
            let spineChar0 = tempSpine.conf[nowCard] || tempSpine.conf.fallback;
            KanbanCharUri = spineChar0.uri;
            /* 结构、画布、工具条、拖拽、点击判定全部由模块负责。本脚本只给主题 JSON，
               并回答「播哪个动画」「点了说什么话」「拖到哪了」。 */
            /* @require 失败时模块不存在：退回图片看板娘（若有），不要抛异常。
               这一步放在尺寸计算之前 —— 没有模块就完全不需要碰 navigator 等宿主对象。 */
            if (!spineModuleReady()) {
                console.log('Spine kanban module unavailable (@require failed).');
                if (nowTheme.INF.COMP.ImageKanban) {
                    MGRConf.AIKanban = "checked";
                    upLocal(false);
                    insKanbanHTML();
                };
                return;
            };
            /* spine-webgl 没就绪时不要进模块 —— 模块只会回报 no-spine-library，
               而这里退回图片看板娘更符合预期（原引擎就是被这个判断挡住的）。 */
            if (!spineLibReady()) {
                /* 明确说出原因：Safari 的「跟踪预防」等会拦掉 @require 的资源，
                   这时 spine 根本不存在，跟主题包无关。 */
                console.warn('ThemePack: spine-webgl 未加载（@require 失败或被浏览器拦截），' +
                    '改用图片看板娘。若主题只有 SpineKanban，请检查 @require 是否被拦。');
                if (nowTheme.INF.COMP.ImageKanban) {
                    MGRConf.AIKanban = "checked";
                    upLocal(false);
                    if ($(".tpmSetting#AIKanban").length > 0) {
                        $(".tpmSetting#AIKanban")[0].checked = "checked";
                    };
                    insKanbanHTML();
                };
                return;
            };
            let boxy = kanbanSpineStyle();
    /* 建实例之前先定缓存作用域：否则首次加载的资源不会进本地缓存 */
    syncCacheScope();
            spineKanban = GTSpineKanban.attach({
                json: tempSpine,
                character: spineChar0,
                animClass: spinePagetype,
                /* 本脚本自己持有 spine 运行时（@require），显式交给模块：
                   某些用户脚本沙箱不会把 @require 的库挂到页面 window 上，
                   模块自己去探测会探测不到，然后误以为缺库去 CDN 找。 */
                spine: (typeof spine != "undefined") ? spine : null,
                loadsync: true,
                pos: { X: IMGPos.X, Y: IMGPos.Y },
                canvas: { width: boxy.canvas[0], height: boxy.canvas[1] },
                style: { cls: 'Spine', width: boxy.main[0], height: boxy.main[1], hoverBg: KanbanBG },
                onClick: function () { charVoice("click"); },
                onError: function (code) {
                    console.log('Spine kanban unavailable: ' + code);
                    if (nowTheme.INF.COMP.ImageKanban) {
                        MGRConf.AIKanban = "checked";
                        upLocal(false);
                        if ($(".tpmSetting#AIKanban").length > 0) {
                            $(".tpmSetting#AIKanban")[0].checked = "checked";
                        };
                        insKanbanHTML();
                    };
                }
            });
            console.log("spine mode (module)");

        }
        else if ((!nowTheme.INF.COMP.SpineKanban || MGRConf.AIKanban) && nowTheme.INF.COMP.ImageKanban) {
            let tempIMG = nowTheme.ImageKanban;
            KanbanBG = nowTheme.ImageKanban.bg;
            KanbanAssest = tempIMG.asset;
            KanbanCharUri = tempIMG.uri[nowCard];
            CharStatus = tempIMG.idle[nowCard];
            /* 图片看板娘默认使用角色立绘；
               取不到才退回 ImageKanban 的 idle 图。
               尺寸交给 CSS（等比缩放并限制在画布内），不再用行内宽度，避免溢出。 */
            let lfgIdle = imageKanbanUrl(nowCard);
            let imgSrc = lfgIdle
                ? lfgIdle
                : (KanbanAssest.common + KanbanCharUri + CharStatus + KanbanAssest.ext);
            KanbanHTML = $(`<style>${KanbanCss}
            .Kanban.Image#Main:hover{
                background:url(${KanbanBG});
                background-size:cover;
            }</style>
            <div class="Kanban Image" id="Main" style = "position:fixed;right:${IMGPos.X}px;bottom:${IMGPos.Y}px;z-index:88;cursor:pointer;" >
                <div class="Kanban Image" id="Canvas" >
                    <img class="Kanban Image" id="Image" src="${imgSrc}">
                </div>
            </div>`).insertBefore('body');
            console.log("image mode" + (lfgIdle ? " (idle)" : ""));
        };
        /* 拖拽：所有看板种类共用同一个组件（图片 / Spine / 以后新增的） */
        KanbanSel = $(".Kanban#Main")[0];
        dragfunc(KanbanSel, {
            onHit: function (clientX, clientY) {
                return !spineKanban || spineKanban.hitTest(clientX, clientY);
            },
            onClick: function () {
                charVoice("click");
                playAnimation([KanbanAssest.anim.click, "idle"]);
            },
            onDragStart: function () {
                playAnimation(["run"]);
            },
            onDragEnd: function (rt, bo) {
                IMGPos.X = rt; IMGPos.Y = bo;
                localStorage.setItem("IMGPos", JSON.stringify(IMGPos));
                playAnimation(["idle"]);
            }
        });
    };
};

if (MGRConf.Kanban) {
    insKanbanHTML();
};

/* Setting HTML */
function insSettingHTML() {
    if ($(".settingCOMP#appBox").length > 0) {
        return;
    };
    let settingHTML = $(`<style>${SettingCss}</style>
    <div class="settingCOMP" id="settingIconBox" >
        <svg class="settingCOMP" id="settingIcon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9241" width=100% height=100%>
            <path d="M967.882752 603.308032c26.207232-104.832-2.62144-173.251584-2.62144-173.251584l-100.272128-4.922368c-8.786944-31.470592-21.655552-61.147136-38.00576-88.600576l67.64544-76.797952c-55.595008-92.654592-124.363776-120.651776-124.363776-120.651776l-74.48064 67.513344c-27.746304-16.140288-57.759744-28.643328-89.506816-37.108736l-6.390784-100.893696c-104.827904-26.211328-173.251584 2.625536-173.251584 2.625536l-4.7616 96.979968c-31.289344 7.86432-61.060096 19.470336-88.580096 34.787328l-70.501376-63.904768c0 0-68.768768 27.997184-124.363776 120.651776 17.671168 20.058112 52.43904 43.088896 54.524928 72.580096 0.514048 7.28064-33.462272 93.239296-34.927616 93.313024l-90.230784 4.427776c0 0-28.828672 68.41856-2.625536 173.251584l89.423872 5.666816c8.444928 35.557376 21.997568 69.04832 39.94112 99.762176l-58.875904 64.949248c0 0 27.997184 68.768768 120.651776 124.363776l67.101696-59.101184c30.400512 18.198528 63.587328 32.063488 98.861056 40.890368l4.36224 88.844288c0 0 68.422656 28.832768 173.251584 2.625536l5.876736-92.72832c35.72224-9.469952 69.250048-24.103936 99.827712-43.199488l71.151616 62.669824c92.658688-55.590912 120.655872-124.363776 120.655872-124.363776l-64.81408-71.501824c15.968256-28.69248 27.952128-59.809792 35.791872-92.572672L967.882752 603.308032zM516.528128 735.343616c-118.956032 0-215.389184-96.433152-215.389184-215.39328 0-118.956032 96.433152-215.389184 215.389184-215.389184s215.39328 96.433152 215.39328 215.389184C731.921408 638.911488 635.48416 735.343616 516.528128 735.343616z" fill="#1296db" p-id="9242"></path>
        </svg>
    </div>
    <div class="settingCOMP settingBox" id="appBox" style='display:none'>
        <div class="settingCOMP settingBoxHeader" id="appBox">
                <logo>　All Settings Launcher</logo>
                <span class="settingCOMP settingBoxClose" id="appBox">✖　</span>
            </div>
        <div class="settingCOMP settingBoxMain" id="appBox">
            <div class="settingCOMP appIcons" id="appBox" style='display:none'></div>
        </div>
        <div class="settingCOMP settingBoxFooter" id="appBox">　　　</div>
    </div>`);
    settingHTML.insertBefore('body');

};
function insTPMSettingIcon() {
    if ($(".settingCOMP.appIcons#tpmSetting").length > 0) {
        return;
    };
    let tpmSettingIcon = $(`
    <div class="settingCOMP appIcons" id="tpmSetting">
        <img src="https://gu.inari.site/Wiki/image.png"></img>
        <span>${SelLang.menu.Title}</span>
    </div>`);
    tpmSettingIcon.insertAfter('.settingCOMP.appIcons#appBox');

};
function insTPMSettingHTML() {
    if ($(".settingCOMP.settingBox#tpmSetting").length > 0) {
        return;
    };
    let tpmSettingHTML = $(`
    <div class="settingCOMP settingBox" id="tpmSetting" style='display:none'>
        <div class="settingCOMP settingBoxHeader" id="tpmSetting">
            <logo>　${SelLang.menu.Title} (Ver ${defConf.Ver})</logo>
            <span class="settingCOMP settingBoxClose" id="tpmSetting">✖　</span>
        </div>
        <div class="settingCOMP settingBoxMain" id="tpmSetting"><HR>
            <p>${SelLang.menu.Theme}<label style="float: right;margin-bottom: 0px;">
                <select  class="tpmSetting btn-switch large select" id="Themes">
                    ${themeSelectOptions()}
                </select>
            </label></p><HR>
            <p>${SelLang.menu.UsrUninstall}<label style="float: right;margin-bottom: 0px;">
                <select  class="tpmSetting btn-switch large select" id="UsrUninstall">
                    ${themeUninstallOptions()}
                </select>
            </label></p><HR>
            <p>${SelLang.menu.UsrInstall}<label style="float: right;margin-bottom: 0px;"><input type="button" class="tpmSetting btn-switch large btns" id="UsrInstall" value="${SelLang.menu.InstallBtn}" onclick="$('.tpmSetting#ThemePackUpload').click();"><HR>
            <input type= "file" class="tpmSetting" id="ThemePackUpload" accept=".guthemepack,.json" style="display:none;"></label></p>
            <p>${SelLang.menu.OldName}<label style="float: right;margin-bottom: 0px;"><input class="tpmSetting btn-switch large" id="OldName" type="checkbox" ${MGRConf.OldName}></label></p><HR>
            <p>${SelLang.menu.ThemeName}<label style="float: right;margin-bottom: 0px;"><input class="tpmSetting btn-switch large" id="ThemeName" type="checkbox" ${MGRConf.ThemeName}></label></p><HR>
            <p>${SelLang.menu.OriName}<label style="float: right;margin-bottom: 0px;"><input class="tpmSetting btn-switch large" id="OriName" type="checkbox" ${MGRConf.OriName}></label></p><HR>
            <p>${SelLang.menu.CharName}<label style="float: right;margin-bottom: 0px;"><input class="tpmSetting btn-switch large" id="CharName" type="checkbox" ${MGRConf.CharName}></label></p><HR>
            <p>${SelLang.menu.CharFGCG}<label style="float: right;margin-bottom: 0px;"><input class="tpmSetting btn-switch large" id="CharFGCG" type="checkbox" ${MGRConf.CharFGCG}></label></p><HR>
            <p>${SelLang.menu.DetailCG}<label style="float: right;margin-bottom: 0px;"><input class="tpmSetting btn-switch large" id="DetailCG" type="checkbox" ${MGRConf.DetailCG}></label></p><HR>
            <p>${SelLang.menu.Kanban}<label style="float: right;margin-bottom: 0px;"><input class="tpmSetting btn-switch large" id="Kanban" type="checkbox" ${MGRConf.Kanban}></label></p><HR>
            <p>${SelLang.menu.ForceEquippedKanban}<label style="float: right;margin-bottom: 0px;"><input class="tpmSetting btn-switch large" id="ForceEquippedKanban" type="checkbox" ${MGRConf.ForceEquippedKanban}></label></p><HR>
            <p>${SelLang.menu.AIKanban}<label style="float: right;margin-bottom: 0px;"><input class="tpmSetting btn-switch large" id="AIKanban" type="checkbox" ${MGRConf.AIKanban}></label></p><HR>
            <p>${SelLang.menu.Voice}<label style="float: right;margin-bottom: 0px;"><input class="tpmSetting btn-switch large" id="Voice" type="checkbox" ${MGRConf.Voice}></label></p><HR>
            <p>${SelLang.menu.AutoNight}<label style="float: right;margin-bottom: 0px;"><input class="tpmSetting btn-switch large" id="AutoNight" type="checkbox" ${MGRConf.AutoNight}></label></p><HR>
            <p>${SelLang.menu.NightMode}<label style="float: right;margin-bottom: 0px;"><input class="tpmSetting btn-switch large input" id="NightMode" type="checkbox" ${MGRConf.NightMode}></label></p><HR>
            <p>${SelLang.menu.MobileLayout}<label style="float: right;margin-bottom: 0px;"><input class="tpmSetting btn-switch large" id="MobileLayout" type="checkbox" ${MGRConf.MobileLayout}></label></p><HR>
            <p>${SelLang.menu.IconSize}(px)<label style="float: right;margin-bottom: 0px;"><input class="tpmSetting btn-switch large input" id="IconSize" type="number" min="32" max="128" value="${MGRConf.IconSize}"></label></p><HR>
            <p>${SelLang.menu.KanbanSize}(%)<label style="float: right;margin-bottom: 0px;"><input class="tpmSetting btn-switch large input" id="KanbanSize" type="number" value="${MGRConf.KanbanSize}"></label></p><HR>
            <p>${SelLang.msg.preloadTitle}<label style="float: right;margin-bottom: 0px;">
            <input type="button" class="tpmSetting btn-switch large btns" id="KanbanPreload" value="${SelLang.msg.preload}">
            <input type="button" class="tpmSetting btn-switch large btns" id="KanbanCacheClear" value="${SelLang.msg.cacheClear}">
            <input type="button" class="tpmSetting btn-switch large btns" id="KanbanCacheClearAll" value="${SelLang.msg.cacheClearAll}">
            </label></p>
            <p class="tpmSetting" id="KanbanCacheInfo" style="font-size: 12px; opacity: 0.8;">${SelLang.msg.cacheLoading}</p>
            <p class="tpmSetting" id="KanbanPreloadNote" style="font-size: 12px; opacity: 0.8; margin-top: -6px;">${SelLang.msg.preloadNote}</p><HR>

            <audio id="themeSoundPlay" class="tpmSetting" controls src="${nullimg}" type="audio/mp3" style='display:none'></audio>
        </div>
        <div class="settingCOMP settingBoxFooter" id="tpmSetting">　　　<a target="_blank" href="https://github.com/HazukiKaguya/GuguTown_ThemePack">Help/使用帮助</a>　|　Author/作者 Github@HazukiKaguya</div>
    </div>`);
    tpmSettingHTML.insertAfter('.settingCOMP.settingBox#appBox');

};
function insLangSettingIcon() {
    if ($(".settingCOMP.appIcons#langSetting").length > 0) {
        return;
    };
    let tpmSettingIcon = $(`
    <div class="settingCOMP appIcons" id="langSetting">
        <img src="https://p.inari.site/guguicons/lang.png"></img>
        <span>${langConf[LAConf].title}</span>
    </div>`);
    tpmSettingIcon.insertAfter('.settingCOMP.appIcons#appBox');

};
function insLangSettingHTML() {
    if ($(".settingCOMP.settingBox#langSetting").length > 0) {
        return;
    };
    let langSettingHTML = $(`
    <div class="settingCOMP settingBox" id="langSetting" style='display:none'>
        <div class="settingCOMP settingBoxHeader" id="langSetting">
            <logo>　${langConf[LAConf].title}</logo>
            <span class="settingCOMP settingBoxClose" id="langSetting">✖　</span>
        </div>
        <div class="settingCOMP settingBoxMain" id="langSetting"><HR>
            <p>${langConf[LAConf].title}<label style="float: right;margin-bottom: 0px;">
                <select  class="langSetting btn-switch large select" id="Langs">
                    <option class="now" value="${LAConf}">${langConf[LAConf].name}</option>
                    <option class="def" id="sc" value="sc">${langConf.sc.name}</option>
                    <option class="def" id="tc" value="tc">${langConf.tc.name}</option>
                    <option class="def" id="ja" value="ja">${langConf.ja.name}</option>
                    <option class="def" id="en" value="en">${langConf.en.name}</option>
                </select>
            </label></p>
        </div>
        <div class="settingCOMP settingBoxFooter" id="langSetting">　　${langConf[LAConf].title}</div>
    </div>`);
    langSettingHTML.insertAfter('.settingCOMP.settingBox#appBox');
    $(`.langSetting#Langs>.def#${LAConf}`).hide();

};

/* 设置面板拖拽滚动 Drag Scroll
   让设置了固定高度的 .settingBoxMain（手机仿真设置界面）既能用滚轮滚动，
   也能像手机设置页一样「按住拖动」来滚动。
   要点：
     - 用 mousemove 计算偏移；只在真正拖动（超过阈值）时才接管，
       因此不会影响勾选框 / 下拉框 / 数字输入的点击。
     - 交互控件本身不作为拖动起点，避免与它们的原生拖动冲突。
     - 拖动时 preventDefault 阻止选中文字；pointer-events 不拦截子元素，控件仍可点击。 */
function dragScrollInit() {
    if (window.__gtpDragScrollBound) { return; };
    window.__gtpDragScrollBound = true;
    let DRAG_THRESHOLD = 4;
    $(document)
        .on('mousedown', ".settingBoxMain", function (e) {
            let el = this;
            let tag = (e.target && e.target.tagName) ? e.target.tagName.toUpperCase() : "";
            /* 诊断：确认事件是否送达、以及容器是否真的可滚动 */
            console.log('[dragScroll] down target=' + tag +
                ' which=' + e.which +
                ' scrollH=' + el.scrollHeight + ' clientH=' + el.clientHeight +
                ' scrollable=' + (el.scrollHeight > el.clientHeight));
            /* 只响应左键；触摸/右键交给原生滚动与菜单 */
            if (e.which && e.which != 1) { return; };
            /* 交互控件上不启动拖动 */
            if (tag == "INPUT" || tag == "SELECT" || tag == "BUTTON" ||
                tag == "OPTION" || tag == "TEXTAREA" || tag == "A" || tag == "AUDIO") {
                return;
            };
            /* 内容不足一屏时无需拖动 */
            if (el.scrollHeight <= el.clientHeight) { return; };
            let startX = e.pageX, startY = e.pageY;
            let startTop = el.scrollTop, startLeft = el.scrollLeft;
            let moved = false;
            let move = function (ev) {
                let dy = ev.pageY - startY, dx = ev.pageX - startX;
                if (!moved && Math.abs(dy) < DRAG_THRESHOLD && Math.abs(dx) < DRAG_THRESHOLD) {
                    return;
                };
                moved = true;
                $(el).addClass('gtpDragging');
                ev.preventDefault();
                el.scrollTop = startTop - dy;
                el.scrollLeft = startLeft - dx;
            };
            let up = function () {
                $(document).off('mousemove', move).off('mouseup', up);
                $(el).removeClass('gtpDragging');
                if (moved) {
                    /* 拖动过就吞掉紧随其后的 click，避免误触控件 */
                    let swallow = function (ev) {
                        ev.stopPropagation();
                        ev.preventDefault();
                    };
                    document.addEventListener('click', swallow, true);
                    setTimeout(function () {
                        document.removeEventListener('click', swallow, true);
                    }, 0);
                };
            };
            $(document).on('mousemove', move).on('mouseup', up);
        })
        /* 鼠标停在面板上时即可用滚轮滚动（无需先点一下） */
        .on('mouseenter', ".settingBoxMain", function () {
            $(this).addClass('gtpDraggable');
        })
        .on('mouseleave', ".settingBoxMain", function () {
            $(this).removeClass('gtpDraggable gtpDragging');
        });
};

/* 下拉框长文本滚动 Marquee for <select>
   .btn-switch.large.select 只有 110px 宽，主题名/自定义名过长会被系统裁掉。
   原生 <select> 的选中文本不受 CSS overflow / text-overflow 控制
   （浏览器把文本裁在控件边框内），所以改用「循环旋转选中项文本」的方式：
   每隔 marqueeSpeed 毫秒把首字符移到末尾，形成横向滚动观感。
   仅在文本确实放不下时启用；下拉展开或切换时暂停，避免干扰选择。 */
let marqueeSpeed = 240;
let marqueePaused = false;
function marqueeTooLong(text, sel) {
    let w = sel.clientWidth || 110;
    let avail = Math.max(20, w - 22);   /* 预留下拉箭头宽度 */
    try {
        let cv = marqueeTooLong._cv || (marqueeTooLong._cv = document.createElement('canvas'));
        let cx = cv.getContext('2d');
        if (cx) {
            let cs = window.getComputedStyle(sel);
            cx.font = (cs.fontSize || '14px') + ' ' + (cs.fontFamily || 'sans-serif');
            if (cx.measureText(text).width <= avail) { return false; };
        };
    }
    catch (e) { };
    /* 取不到 canvas 时按字符数粗略判断，保证仍有滚动效果 */
    return text.length > 8;
};
/* 记录原文：一旦旋转过 option.text，展开下拉框时 Chromium 会按「当前文本」
   计算弹层宽度 —— 文本被转过就量不出完整宽度。所以旋转前先把原文存进
   data-gtp-mq，复位时再写回，保证展开时按完整文本自适应宽度。 */
function marqueeStore(opt) {
    if (!opt.getAttribute || opt.getAttribute('data-gtp-mq') != null) { return; };
    let t = opt.text != null ? String(opt.text) : '';
    if (!t) { return; };
    opt.setAttribute('data-gtp-mq', t);
};
function marqueeReset(sel) {
    if (!sel || !sel.options) { return; };
    for (let i = 0; i < sel.options.length; i++) {
        let o = sel.options[i];
        if (!o.getAttribute) { continue; };
        let orig = o.getAttribute('data-gtp-mq');
        if (orig == null) { continue; };
        if (o.text !== orig) { o.text = orig; }
        o.removeAttribute('data-gtp-mq');   /* 复位后视为未旋转 */
    };
};
function marqueeTick() {
    if (marqueePaused) { return; };
    $(".tpmSetting.btn-switch.large.select").each(function () {
        let sel = this;
        if (!sel.options || sel.selectedIndex < 0) { return; };
        let opt = sel.options[sel.selectedIndex];
        let t = opt.text != null ? String(opt.text) : '';
        if (!t) { return; };
        /* 若当前文本明显长于原文（异常/多次旋转叠加），先复位再判断 */
        let orig = opt.getAttribute ? opt.getAttribute('data-gtp-mq') : null;
        if (orig != null && t.length > orig.length) { t = orig; opt.text = orig; };
        if (!marqueeTooLong(t, sel)) { return; };
        marqueeStore(opt);
        let m = t.match(/^(\s*)([\s\S]*?)(\s*)$/);
        opt.text = m[1] + m[2].slice(1) + m[2].charAt(0) + m[3];
    });
};
function marqueeInit() {
    if (window.__gtpMarqueeBound) { return; };
    window.__gtpMarqueeBound = true;
    if (typeof setInterval != "function") { return; };
    setInterval(marqueeTick, marqueeSpeed);
    /* 展开下拉框 / 失焦 / 改选期间：
       先暂停、并把文本复位成原文 —— 这样原生弹层能按完整文本自适应宽度，
       选项名不会被滚动位移影响。收起后（blur/change）再恢复滚动。 */
    $(document)
        .on('mousedown focus', ".tpmSetting.btn-switch.large.select", function () {
            marqueePaused = true;
            marqueeReset(this);
        })
        .on('blur change', ".tpmSetting.btn-switch.large.select", function () {
            marqueePaused = false;
        });
};

insSettingHTML();
insTPMSettingIcon(); insTPMSettingHTML();
insLangSettingIcon(); insLangSettingHTML();
dragScrollInit();
marqueeInit();

/* HomePage */

/*
  看板娘组件
  Window Size Check
*/

/* 看板娘位置重置 */
function KanbanPosReset() {
    if ($(".Kanban#Main").length == 0) {
        return;
    };
    let $this = $('.Kanban#Main')[0];
    if ($(window).width() < 200) {
        IMGPos.X = 200 - $this.clientWidth;
        localStorage.setItem("IMGPos", JSON.stringify(IMGPos));
    };
    if ($(window).height() < 200) {
        IMGPos.Y = 200 - $this.clientHeight;
        localStorage.setItem("IMGPos", JSON.stringify(IMGPos));
    };
};

/* 看板娘窗体自适应 Kanban Window Pos */
window.onresize = function settingBoxPos() {
    if ($(".Kanban#Main").length == 0) {
        return;
    };
    let $this = $('.Kanban#Main')[0], rt, bo;
    rect = $this.getBoundingClientRect();
    if ($this.clientWidth - rect.right > 0) {
        if ($(window).width() > 200) {
            rt = $(window).width() - $this.clientWidth;
        }
        else {
            rt = 200 - $this.clientWidth;
        }
        $this.style.right = rt + "px";
        IMGPos.X = rt;
        localStorage.setItem("IMGPos", JSON.stringify(IMGPos));
    };
    if ($this.clientHeight - rect.bottom > 0) {
        if ($(window).height() > 200) {
            bo = $(window).height() - $this.clientHeight;
        }
        else {
            bo = 200 - $this.clientHeight;
        }
        $this.style.bottom = bo + "px";
        IMGPos.Y = bo;
        localStorage.setItem("IMGPos", JSON.stringify(IMGPos));
    };
};


/* 看板拖拽组件已移入 gt-spine-kanban 模块（含 0.2s 点击/拖拽判定） */

/*
    Spine
*/
/* 原内联 Spine 引擎已移至本文件上方的模块 */
/* 主题包要求播放某个动画 —— 唯一需要本脚本转达给看板模块的事情。
   引擎在模块里，所以这里只做转发；图片看板娘模式下没有骨架，直接忽略。
   调用方（点击 / 拖拽 / 战斗胜负）仍然只认 playAnimation 这个名字。 */
function playAnimation(animation) {
    if (!spineKanban || typeof spineKanban.playAnime != "function") { return; };
    spineKanban.playAnime(Array.isArray(animation) ? animation.slice() : [animation]);
};

/*
    钩子
    Hooks
*/

/* 战斗挂钩看板 Battle Hook Kanban */
function battleCG(type) {
    if (MGRConf.Kanban != "checked") { return; };
    if (nowTheme.INF.COMP.ImageKanban && (MGRConf.AIKanban || !nowTheme.INF.COMP.SpineKanban)) {
        /* 图片看板娘：胜负使用 ImageKanban 的 win / lose 图
           （若启用「图片看板娘使用角色立绘」则改用 LeftFG）。 */
        let tIMG = nowTheme.ImageKanban, card = nowCard || MGRConf.NowCard;
        if (!tIMG || !tIMG.uri[card]) { return; };
        let $img = $(".Kanban.Image#Main img#Image");
        if ($img.length == 0) { return; };
        let lfg = imageKanbanUrl(card);
        if (lfg) {
            /* LeftFG 只有一张立绘：胜负都回到它，无需 win/lose 资源 */
            $img.attr('src', lfg);
            return;
        };
        let img = (type == "win") ? tIMG.win[card] : tIMG.lose[card];
        if (img == null) { return; };
        $img.attr('src', tIMG.asset.common + tIMG.uri[card] + img + tIMG.asset.ext);
        setTimeout(() => {
            let idle = tIMG.idle[card];
            if (idle != null && $img.length > 0) {
                $img.attr('src', tIMG.asset.common + tIMG.uri[card] + idle + tIMG.asset.ext);
            };
        }, 3000);
    }
    else if (type == "win" && nowTheme.INF.COMP.SpineKanban && !MGRConf.AIKanban) {
        let $joy = $(`${KanbanAssest.anim.win}`);
        if ($joy.length > 0) {
            let spjoy = $joy[0].value.split(',');
            playAnimation([spjoy[0]]);
        };
    }
    else if (type == "lose" && nowTheme.INF.COMP.SpineKanban && !MGRConf.AIKanban) {
        /* 必须传副本：playAnimation 内部会 push('idle')，
           直接传 KanbanAssest.anim.lose 会把 idle 追加进这个全局数组，
           打一场涨一次，导致后续胜负动作播放异常。 */
        playAnimation(KanbanAssest.anim.lose.slice());
    };
};
/* 战斗语音挂钩 Battle Hook Voice */
function battleVoice(type) {
    if (type == "win") { charVoice("win"); }
    else if (type == "lose") { charVoice("lose"); };
};


/* 管理器菜单钩子 MGR Menu Hooks */
$(document)
    .on('click', "#settingIconBox", function () {
        $('.settingBox#appBox').show();
    })
    .on('click', ".settingCOMP.appIcons#tpmSetting", function () {
        $('.settingBox#appBox').hide();
        $('.settingBox#tpmSetting').show(); refreshCacheInfo();
    })
    .on('click', ".settingCOMP.appIcons#langSetting", function () {
        $('.settingBox#appBox').hide();
        $('.settingBox#langSetting').show();
    })
    .on('click', ".settingBoxClose", function () {
        $('.settingBox').hide();
    })
    .on('change', ".langSetting#Langs", function (e) {
        if (e.target.value != LAConf) {
            LAConf = e.target.value;
            localStorage.setItem("LangConf_" + User, JSON.stringify(LAConf));
            window.location.reload();
        };
    })
    /* 资源预加载与本地缓存 */
    .on('click', ".tpmSetting#KanbanPreload", function () {
        preloadThemeAssets();
    })
    .on('click', ".tpmSetting#KanbanCacheClear", function () {
        clearAssetCache(false);
    })
    .on('click', ".tpmSetting#KanbanCacheClearAll", function () {
        clearAssetCache(true);
    })
    .on('change', ".tpmSetting#Themes", function (e) {
        if (e.target.value && e.target.value != MGRConf.ThemePack) {
            MGRConf.ThemePack = e.target.value;
            upLocal(true);
        };
    })
    .on('change', ".tpmSetting#UsrUninstall", function (e) {
        let uid = e.target.value;
        if (!uid) { return; };
        if (!confirm(SelLang.menu.UsrUninstall + "\n" + themePackNameByUID(uid) + " ?")) { return; };
        uninstallTheme(uid);
        /* 卸载的正是当前主题包时，回退到测试主题包 */
        if (MGRConf.ThemePack == uid) {
            MGRConf.ThemePack = testmain001.INF.UID;
            upLocal(true);
            return;
        };
        refreshThemeUI();
    })
    .on('change', ".tpmSetting#OldName", function (e) {
        let changed = false;
        if (e.target.checked && MGRConf.OldName != "checked") {
            MGRConf.OldName = "checked";
            changed = true;

        }
        else if (!e.target.checked && MGRConf.OldName == "checked") {
            MGRConf.OldName = "";
            changed = true;
        };
        if (changed) {
            if (window.location.href.indexOf("fyg_wish.php") > -1 ||
                window.location.href.indexOf("fyg_shop.php") > -1 ||
                window.location.href.indexOf("fyg_stat.php") > -1 ||
                window.location.href.indexOf("fyg_ulog.php") > -1 ||
                window.location.href.indexOf("fyg_llpw.php") > -1 ||
                window.location.href.indexOf("fyg_byebye.php") > -1) {
                upLocal(false);
            }
            else {
                upLocal(true);
            };
        };
    })
    .on('change', ".tpmSetting#ThemeName", function (e) {
        let changed = false;
        if (e.target.checked && MGRConf.ThemeName != "checked") {
            MGRConf.ThemeName = "checked";
            changed = true;
        }
        else if (!e.target.checked && MGRConf.ThemeName == "checked") {
            MGRConf.ThemeName = "";
            changed = true;
        };
        if (changed) {
            if (window.location.href.indexOf("fyg_wish.php") > -1 ||
                window.location.href.indexOf("fyg_shop.php") > -1 ||
                window.location.href.indexOf("fyg_ulog.php") > -1 ||
                window.location.href.indexOf("fyg_llpw.php") > -1 ||
                window.location.href.indexOf("fyg_byebye.php") > -1) {
                upLocal(false);
            }
            else {
                upLocal(true);
            };
        };

    })
    .on('change', ".tpmSetting#OriName", function (e) {
        let changed = false;
        if (e.target.checked && MGRConf.OriName != "checked") {
            MGRConf.OriName = "checked";
            changed = true;
        }
        else if (!e.target.checked && MGRConf.OriName == "checked") {
            MGRConf.OriName = "";
            changed = true;
        };
        if (changed) {
            if (window.location.href.indexOf("fyg_pk.php") > -1) {
                upLocal(true);
            }
            else {
                upLocal(false);
            };
        };
    })
    .on('change', ".tpmSetting#CharName", function (e) {
        let changed = false;
        if (e.target.checked && MGRConf.CharName != "checked") {
            MGRConf.CharName = "checked";
            changed = true;
        }
        else if (!e.target.checked && MGRConf.CharName == "checked") {
            MGRConf.CharName = "";
            changed = true;
        };
        if (changed) {
            if (window.location.href.indexOf("fyg_shop.php") > -1 ||
                window.location.href.indexOf("fyg_ulog.php") > -1 ||
                window.location.href.indexOf("fyg_llpw.php") > -1 ||
                window.location.href.indexOf("fyg_byebye.php") > -1) {
                upLocal(false);
            }
            else {
                upLocal(true);
            };
        };
    })
    .on('change', ".tpmSetting#CharFGCG", function (e) {
        let changed = false;
        if (e.target.checked && MGRConf.CharFGCG != "checked") {
            MGRConf.CharFGCG = "checked";
            changed = true;
        }
        else if (!e.target.checked && MGRConf.CharFGCG == "checked") {
            MGRConf.CharFGCG = "";
            changed = true;
        };
        if (changed) {
            if (window.location.href.indexOf("fyg_pk.php") > -1 ||
                window.location.href.indexOf("fyg_equip.php") > -1) {
                upLocal(true);
            }
            else {
                upLocal(false);
            };
        };
    })
    .on('change', ".tpmSetting#DetailCG", function (e) {
        /* 只影响角色详情页的 CG；列表页不变。
           装备页当场重跑 cgImgAdd 即可看到效果，无需刷新。 */
        let want = e.target.checked ? "checked" : "";
        if (MGRConf.DetailCG != want) {
            MGRConf.DetailCG = want;
            upLocal(false);
            if (window.location.href.indexOf("fyg_equip.php") > -1) {
                cgImgAdd();
            };
        };
    })
    .on('change', ".tpmSetting#Kanban", function (e) {
        if (e.target.checked && MGRConf.Kanban != "checked") {
            MGRConf.Kanban = "checked";
            upLocal(false);
            insKanbanHTML();
        }
        else if (!e.target.checked && MGRConf.Kanban == "checked") {
            MGRConf.Kanban = "";
            $(".Kanban.SpineTool#Shell").remove();
            $(".Kanban.Spine#Main").remove();
            $(".Kanban.Image#Main").remove();
            upLocal(false);
        };
    })
    .on('change', ".tpmSetting#AIKanban", function (e) {
        if (e.target.checked && MGRConf.AIKanban != "checked") {
            MGRConf.AIKanban = "checked";
            $(".Kanban.SpineTool#Shell").remove();
            $(".Kanban.Spine#Main").remove();
            upLocal(false);
            insKanbanHTML();
        }
        else if (!e.target.checked && MGRConf.AIKanban == "checked") {
            MGRConf.AIKanban = "";
            $(".Kanban.Image#Main").remove();
            upLocal(false);
            insKanbanHTML();
        };
    })
    .on('change', ".tpmSetting#ForceEquippedKanban", function (e) {
        if (e.target.checked && MGRConf.ForceEquippedKanban != "checked") {
            MGRConf.ForceEquippedKanban = "checked";
            upLocal(false);
            /* 立刻按新策略重算看板角色 */
            getNowCard();
        }
        else if (!e.target.checked && MGRConf.ForceEquippedKanban == "checked") {
            MGRConf.ForceEquippedKanban = "";
            upLocal(false);
            getNowCard();
        };
    })
    .on('change', ".tpmSetting#Voice", function (e) {
        if (e.target.checked && MGRConf.Voice != "checked") {
            MGRConf.Voice = "checked";
            upLocal(false);
            charVoice("on");
        }
        else if (!e.target.checked && MGRConf.Voice == "checked") {
            MGRConf.Voice = "";
            upLocal(false);
            charVoice("off");
        };
    })
    .on('click', "img#CGimg", function (e) {
        /* 点击角色立绘 CG 播放该角色的点击语音。
           语音开关未开时 charVoice 内部会自行返回 false。
           用 data-cgcard 拿到「这张 CG 的角色」，
           cgImgAdd 已按 出战角色 / 详情预览角色 解析好并写在元素上。 */
        if (MGRConf.Voice != "checked") { return; };
        if (!e.target || e.target.tagName != "IMG") { return; };
        charVoice("click", e.target.getAttribute("data-cgcard") || null);
    })
    .on('change', ".tpmSetting#AutoNight", function (e) {
        let changed = false;
        if (e.target.checked && MGRConf.AutoNight != "checked") {
            MGRConf.AutoNight = "checked";
            changed = true;
        }
        else if (!e.target.checked && MGRConf.AutoNight == "checked") {
            MGRConf.AutoNight = "";
            changed = true;
        };
        if (changed) {
            upLocal(false);
            nightCssSwitch();
        };
    })
    .on('change', ".tpmSetting#NightMode", function (e) {
        let changed = false;
        if (e.target.checked && MGRConf.NightMode != "checked") {
            MGRConf.NightMode = "checked";
            changed = true;
        }
        else if (!e.target.checked && MGRConf.NightMode == "checked") {
            MGRConf.NightMode = "";
            changed = true;
        };
        if (changed) {
            upLocal(false);
            nightCssSwitch();
        };
    })
    .on('change', ".tpmSetting#MobileLayout", function (e) {
        let changed = false;
        if (e.target.checked && MGRConf.MobileLayout != "checked") {
            MGRConf.MobileLayout = "checked";
            changed = true;
        }
        else if (!e.target.checked && MGRConf.MobileLayout == "checked") {
            MGRConf.MobileLayout = "";
            changed = true;
        };
        if (changed) {
            upLocal(true);
        };
    })
    .on('change', ".tpmSetting#IconSize", function (e) {
        let size = Math.floor(parseInt(e.target.value));
        if (isNaN(size)) { size = parseInt(defConf.IconSize); };
        /* 与 3.10.x 一致：限制在 32-128 之间 */
        if (size < 32) { size = 32; };
        if (size > 128) { size = 128; };
        if (String(size) != String(MGRConf.IconSize)) {
            MGRConf.IconSize = String(size);
            e.target.value = size;
            upLocal(false);
            /* 图标大小可即时生效：重建 GTP 全局样式表 */
            $("style#GTPCss").remove();
            GPTCss = buildGPTCss();
            $('head').append(`<style id="GTPCss">${GPTCss}</style>`);
        };
    })
    .on('change', ".tpmSetting#KanbanSize", function (e) {
        if (e.target.value != MGRConf.KanbanSize) {
            MGRConf.KanbanSize = e.target.value;
            if (MGRConf.Kanban == "checked") {
                upLocal(true);
            }
            else {
                upLocal(false);
            }
        };
    })
    .on('change', ".tpmSetting#ThemePackUpload", function (e) {
        if (e.target.files.length == 0) {
            return;
        };
        let reader = new FileReader();
        reader.readAsText(e.target.files[0], "UTF-8");
        reader.onload = function (evt) {
            themePackInstall(String(evt.target.result));
            $(".tpmSetting#ThemePackUpload").val("");
        };
    })
    ;


/* 组件激活钩子 COMP Active Hooks */
/* 战斗结果检测 Battle Result Check
   实测（fyg_pk.php 控制台）：
     win=null lose="终末之日 获得了胜利！"
     win=null lose="营养均衡的史莱姆 获得了胜利！"
   `.col-md-6>.alert.alert-danger` 与 `.alert.alert-info` 是**左右两侧**
   （见 pkImgAdd：danger=左侧我方、info=右侧敌方），**不是胜负标记**，
   所以「按 class 区分胜负」永远只会命中一侧 —— 这是多次打野怪都不出声的根因。
   胜负要靠游戏自己写的文字 + 所在侧别判断：
   结果文字总是以**获胜方**为主语，例如
     「<野怪名> 获得了胜利！」出现在右侧(alert-info) = 敌方胜 = 我方败。
   只看「胜利」二字会把败仗误判成胜仗，必须结合侧别。 */
let battleArmed = false, sucheck = 0, facheck = 0, collecheck = false;
/* 已播报的战斗结果，记忆在 sessionStorage：
   结果刚触发时紧接的 Ajax 刷新会重建 DOM，容易把播放吞掉；
   记忆「这个结果已经播过」后，刷新后读到同一结果不再重复，
   而新结果（文本不同）依然会播。 */
const BATTLE_SESSION_KEY = "GTP_β3_BattleAnnounced";
function battleSessionGet() {
    try { return sessionStorage.getItem(BATTLE_SESSION_KEY) || null; }
    catch (e) { return null; };
};
function battleSessionSet(txt) {
    try {
        if (txt) { sessionStorage.setItem(BATTLE_SESSION_KEY, txt); }
        else { sessionStorage.removeItem(BATTLE_SESSION_KEY); };
    }
    catch (e) { };
};
/* 从结果文字 + 所在侧判断胜负：见上方说明。
   只看「胜利」二字会把败仗判成胜仗，必须结合侧别。 */
function battleOutcomeSide(txt, isRight) {
    if (!txt) { return null; };
    if (/获得胜利|胜利/.test(txt)) { return isRight ? "lose" : "win"; };
    if (/失败|战败|败北|被打败|倒下了|被击败/.test(txt)) { return isRight ? "win" : "lose"; };
    return null;
};
function battleResultTexts() {
    let out = [];
    let $a = $(".alert.alert-danger.with-icon.fyg_tc, .alert.alert-info.with-icon.fyg_tc");
    for (let i = 0; i < $a.length; i++) {
        let t = $a[i].innerText != null ? String($a[i].innerText) : '';
        t = t.replace(/\s+/g, ' ').trim();
        /* isRight: 该结果框是否属于右侧（敌方） */
        let isRight = $($a[i]).hasClass("alert-info");
        if (t) { out.push({ txt: t, right: isRight }); };
    };
    return out;
};
/* 归一成一个胜负结论；两侧都存在时优先采信「敌方失败」 */
function battleOutcomeOf(items) {
    let res = null;
    for (let i = 0; i < items.length; i++) {
        let o = battleOutcomeSide(items[i].txt, items[i].right);
        if (o == "win") { res = "win"; }
        else if (o == "lose" && res != "win") { res = "lose"; };
    };
    return res;
};
/* 进入战斗时调用：新一场开始，清掉上一场的记忆并解除抑制。
   ⚠ 必须在这里清 sessionStorage 与残留标记：
     连续打同一种野怪时，结果文本完全相同，
     若沿用「按文本去重」的记忆，第二场起会被误判成「同一场已播过」而全部静音。
   battleArm 同时也用于「加载后兜底检查」（此时不清记忆）。 */
function clearBattleMemory() {
    battleSessionSet(null);
    $(".alert.alert-danger.with-icon.fyg_tc, .alert.alert-info.with-icon.fyg_tc")
        .removeAttr('data-gtp-seen');
};
function battleArm(reset) {
    battleArmed = true;
    if (reset) { clearBattleMemory(); };
};
function battleJoin(items) {
    return items.map(function (o) { return (o.right ? '[敌]' : '[我]') + o.txt; }).join(' || ');
};
/* 战斗结果播报 Battle Result Announce
   看板动作**立即**执行（不等语音）：避免语音事件异常时动作也被拖住或丢失。
   只有结果语音会排到「出击语音」之后，以免两句话叠在一起。
   失败/结束事件都做了兜底，避免事件不发导致结果音永远不播。
   用序号防止旧的 ended 回调覆盖新一场的结果。 */
let battleAnnounceSeq = 0;
function announceBattleResult(outcome) {
    /* 动作先走：与语音互不阻塞 */
    battleCG(outcome);
    let seq = ++battleAnnounceSeq;
    let voice = function () { battleVoice(outcome); };
    if (!voicePlaying()) { voice(); return; };
    let node = $(".tpmSetting#themeSoundPlay")[0];
    let start = Date.now();
    let done = function () {
        node.removeEventListener('ended', done);
        node.removeEventListener('error', done);
        if (seq !== battleAnnounceSeq) { return; };
        voice();
    };
    node.addEventListener('ended', done);
    node.addEventListener('error', done);
    /* 兜底：某些环境不派发 ended，超时后直接播结果音 */
    setTimeout(function () {
        node.removeEventListener('ended', done);
        node.removeEventListener('error', done);
        if (seq !== battleAnnounceSeq) { return; };
        voice();
    }, 6000);
};
function battleCheck() {
    if (!battleArmed) { return; };
    let items = battleResultTexts();
    let joined = battleJoin(items);
    console.log('[battleCheck] result=' + JSON.stringify(joined.slice(0, 70)) +
        ' announced=' + JSON.stringify((battleSessionGet() || '').slice(0, 30)));
    /* 结果元素消失：本场尚未出结果 */
    if (!items.length) { return; };
    /* 结果文字没有对应结论（尚未定胜负）时不处理 */
    let outcome = battleOutcomeOf(items);
    if (!outcome) { return; };
    /* 与本次已播报的结果相同 = 同一次结果（后续 Ajax 重复上报），不重播。
       新一场在 battleArm(true) 时已清空记忆，
       所以连续打同一种野怪（文本完全相同）依然会正常播报。 */
    if (joined === battleSessionGet()) { return; };
    battleSessionSet(joined);
    battleArmed = false;
    announceBattleResult(outcome);
};
function collectionCheck() {
    if (collecheck) { return; };
    if ($("button[class*='fyg_colpz05bg'][style*='b4.gif']").length > 0) {
        let $lvl = $("button[class*='fyg_colpz05bg'][style*='b4.gif']+.fyg_f18");
        if ($lvl.length > 0) {
            collecheck = true;
            charVoice("levelup", String($lvl[0].innerText).charAt(5));
        };
    };
};
$(document)
    .on('click', ".detaillogitem", function () {
        alltRep(); alliRep();
    })
    .on('click', "[onclick*='jgjg(']", function () {
        /* 进入战斗：新一场开始，清掉上一场的播报记忆与残留标记。
           这样连续打同一种野怪（结果文本完全相同）也会正常播报。 */
        battleArm(true);
        charVoice("battle");
        playAnimation(['attack', 'idle']);
    })
    .on('click', "[onclick*='gox(']", function () {
        collecheck = false;
    })
    .ajaxSuccess(function (e, x) {
        if (window.location.href.indexOf('php') > -1 || window.location.pathname == '/') {
            if (!x.responseJSON) {
                if (window.location.href.indexOf('fyg_pk.php') > -1) {
                    alltRep(); alliRep(); pkImgAdd();
                    battleCheck();
                };
                if (window.location.href.indexOf('fyg_equip.php') > -1) {
                    getNowCard(); alltRep(); getNowEquip(); alliRep(); cgImgAdd();
                    collectionCheck();
                };
                if (window.location.href.indexOf('fyg_beach.php') > -1 || window.location.href.indexOf('fyg_gem.php') > -1) {
                    alltRep(); alliRep();
                };
                if (window.location.href.indexOf('fyg_index.php') > -1) {
                    /* 首页仓库/饰品图标同样需要替换（与 3.10.x 的 themeIcon() 一致），
                       不能只在弹窗打开时才跑 alliRep()，否则首屏图标不被替换。 */
                    alltRep(); alliRep();
                    if ($(".modal-open").length > 0) {
                        alltRep(); alliRep();
                    };
                };
            };
        };
    });

/* 首屏执行一次替换 First Paint Rep
   3.10.x 在 finalInit() 里就跑了第一次替换（首页仓库是服务端直出，没有 Ajax 事件），
   4.x 只在 ajaxSuccess 里跑，首屏可能来不及替换 —— 这里补上同样的首屏一次。
   每个步骤单独 try/catch：游戏改版导致某个选择器失效时，不应连带打断其余替换。 */
function safeRep(fn, label) {
    try { fn(); }
    catch (e) { console.warn('[GTP] ' + label + ' failed: ' + (e && e.message ? e.message : e)); };
};
(function firstPaintRep() {
    let turi = window.location.href;
    if (turi.indexOf('php') < 0 && window.location.pathname != '/') { return; };
    if (turi.indexOf('fyg_pk.php') > -1) {
        safeRep(alltRep, 'alltRep'); safeRep(alliRep, 'alliRep'); safeRep(pkImgAdd, 'pkImgAdd');
    }
    else if (turi.indexOf('fyg_equip.php') > -1) {
        safeRep(getNowCard, 'getNowCard'); safeRep(alltRep, 'alltRep');
        safeRep(getNowEquip, 'getNowEquip'); safeRep(alliRep, 'alliRep'); safeRep(cgImgAdd, 'cgImgAdd');
    }
    else {
        safeRep(alltRep, 'alltRep'); safeRep(alliRep, 'alliRep');
    };
})();

pluginLoadTime();
