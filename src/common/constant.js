export const resourceBaseUrl = `https://raw.githubusercontent.com/moyuan-myj/moyuanmz-mbjs/refs/heads/main/`
export const getResourceUrl = (url) => {
    return `${resourceBaseUrl}${url}`
}

export const getImageUrl = (name) => {
    return new URL(`../static/image/${name}.png`, import.meta.url).href;
}

export const AttackType = {
    physics: {text: '物理', value: 'physics'},
    magic: {text: '魔法', value: 'magic'},
}

// （无地形0%-树林20%-城墙30%-山地10%-基岩20%-货物15%-沙丘10%-礁石5%-石柱5%）
export const TerrainType = {
    none: {text: '无地形', value: 'none', rate: 0},
    forest: {text: '树林', value: 'forest', rate: 20},
    wall: {text: '城墙', value: 'wall', rate: 30},
    mountain: {text: '山地', value: 'mountain', rate: 10},
    rock: {text: '基岩', value: 'rock', rate: 20},
    cargo: {text: '货物', value: 'cargo', rate: 15},
    sand: {text: '沙丘', value: 'sand', rate: 10},
    reef: {text: '礁石', value: 'reef', rate: 5},
    column: {text: '石柱', value: 'column', rate: 5},
}
export const TerrainTypeShowList = Object.values(TerrainType).map((i) => {
    return {
        text: `${i.text} (${i.rate}%)`,
        value: i.value
    }
})

// 攻击系数（单点0.5-AOE10，水狗1.5）
export const AttackRate = {
    single: {text: '单点', value: 'single', rate: 0.5},
    aoe: {text: 'AOE', value: 'aoe', rate: 10},
    waterDog: {text: '水狗', value: 'water', rate: 1.5},
}

// 攻击段数（单点20，AOE1，水狗6）
export const AttackSegment = {
    single: {text: '单点', value: 'single', segment: 20},
    aoe: {text: 'AOE', value: 'aoe', segment: 1},
    waterDog: {text: '水狗', value: 'water', segment: 6},
}

export const TrueFalseCheckBoxData = [
    {text: '是', value: 1},
    {text: '否', value: 0},
]

export const sq_table = [
    {id: 1, name: "菲依雅", effect: "主动进入战斗造成魔法伤害提升2%~8%"},
    {id: 2, name: "", effect: "主动进入战斗时，目标越远伤害越高，最高提升2%~8%"},
    {id: 3, name: "", effect: "主动进入战斗前未进行过移动，伤害提升2%~8%"},
    {id: 4, name: "索尔", effect: "范围伤害提升2%~8%"},
    {id: 5, name: "", effect: "进入战斗暴击率提升2%~10%"},
    {id: 6, name: "", effect: "固定伤害提升2%~10%"},
    {id: 7, name: "海姆达尔", effect: "进入战斗遭受物理伤害降低2%~8%"},
    {id: 8, name: "", effect: "自身相邻有友军时，进入战斗遭受伤害降低1%~6%"},
    {id: 9, name: "", effect: "反击伤害提升2%~10%"},
    {id: 10, name: "巴德尔", effect: "遭受范围伤害降低2%~8%"},
    {id: 11, name: "", effect: "受到固定伤害降低2%~10%"},
    {id: 12, name: "", effect: "主动进入战斗防御，魔防提升2%~8%"},
    {id: 13, name: "奥丁", effect: "主动进入战斗造成物理伤害提升2%~8%"},
    {id: 14, name: "", effect: "范围技能命中3名及以上敌军时造成伤害提升1%~6%"},
    {id: 15, name: "", effect: "进入战斗前移动越远伤害越高，最高提升2%~8%"},
    {id: 16, name: "弗丽嘉", effect: "进入战斗时，目标越远遭受伤害越低，最多降低2%~8%"},
    {id: 17, name: "", effect: "进入战斗遭受魔法伤害降低2%~8%"},
    {id: 18, name: "", effect: "部队生命低于100%时，遭受范围伤害降低2%~8%"},
    {id: 19, name: "提尔", effect: "与有弱化效果的敌军进入战斗时，造成物理伤害提升2%~8%"},
    {id: 20, name: "", effect: "与克制的敌军进入战斗时，造成物理伤害提升2%~8%"},
    {id: 21, name: "", effect: "进入战斗暴击伤害提升2%~10%"},
    {id: 22, name: "洛基", effect: "与有弱化效果的敌军进入战斗时，造成魔法伤害提升2%~8%"},
    {id: 23, name: "", effect: "与克制的敌军进入战斗时，造成魔法伤害提升2%~8%"},
    {id: 24, name: "", effect: "进入战斗遭受暴击率降低2%~10%"},
    {id: 25, name: "维达", effect: "被近战攻击进入战斗时，遭受伤害降低2%~8%"},
    {id: 26, name: "", effect: "被远程攻击进入战斗时，遭受伤害降低1%~6%"},
    {id: 27, name: "", effect: "进入战斗遭受暴击伤害降低2%~10%"},
];
export const sq_table_columns = [
    // { label: "编号", prop: "id", width: 60, align: "center" },
    {label: "神契", prop: "name", width: 100, align: "center"},
    {label: "神祈特效", prop: "effect", align: "left"},
];

export const sbkj_table = [
    {id: 1, type: "步兵", tech: "对枪特训", effect: "对枪兵士兵攻防克制修正+30%"},
    {id: 2, type: "步兵", tech: "压制战法", effect: "敌人生命百分比<=自身时,攻防+20%"},
    {id: 3, type: "步兵", tech: "应急处理", effect: "士兵大于80%血，减伤20%"},
    {id: 4, type: "步兵", tech: "防空重甲", effect: "被远程打,双防+20%"},
    {id: 5, type: "步兵", tech: "孤军奋战", effect: "身边1格没有队友,增伤30%"},
    {id: 6, type: "枪兵", tech: "对骑特训", effect: "对骑兵士兵攻防克制修正+30%"},
    {id: 7, type: "枪兵", tech: "作战续行", effect: "士兵低于70%血时,减伤20%"},
    {id: 8, type: "枪兵", tech: "反击方阵", effect: "被打时攻击+30%"},
    {id: 9, type: "枪兵", tech: "巩固防线", effect: "不站地形时,双防+20%"},
    {id: 10, type: "枪兵", tech: "浴血奋战", effect: "敌人生命百分比>=自身时,攻击+20%"},
    {id: 11, type: "骑兵", tech: "对步特训", effect: "对步兵士兵攻智防克制修正+30%"},
    {id: 12, type: "骑兵", tech: "集团冲锋", effect: "身边2格有队友,攻防+20%(注意骑兵位置)"},
    {id: 13, type: "骑兵", tech: "高速移动", effect: "主动进攻减伤20%"},
    {id: 14, type: "骑兵", tech: "精钢铁蹄", effect: "战前每跑1格,增伤8%,最多40%"},
    {id: 15, type: "骑兵", tech: "奔袭破阵", effect: "进攻被护卫时,攻防+20%"},
    {id: 16, type: "飞兵", tech: "先制打击", effect: "高于80%血时,攻防+20%"},
    {id: 17, type: "飞兵", tech: "空海奇袭", effect: "主动攻击满血敌人时,攻防+20%"},
    {id: 18, type: "飞兵", tech: "特技飞行", effect: "站地形时,减伤+20%"},
    {id: 19, type: "飞兵", tech: "地空协同", effect: "部队是混合部队时,双防+20%"},
    {id: 20, type: "水兵", tech: "先制打击", effect: "高于80%血时,攻防+20%"},
    {id: 21, type: "水兵", tech: "空海奇袭", effect: "主动攻击满血敌人时,攻防+20%"},
    {id: 22, type: "水兵", tech: "水战强化", effect: "在水中时,增伤+30%"},
    {id: 23, type: "水兵", tech: "水灵加护", effect: "在水中被打,攻击+20%,魔防+20%"},
    {id: 24, type: "弓兵", tech: "野战特训", effect: "站地形时，攻防+20%"},
    {id: 25, type: "弓兵", tech: "暗影打击", effect: "主动攻击满血敌人时,攻防+20%"},
    {id: 26, type: "弓兵", tech: "密林游侠", effect: "站地形时，增伤+30%"},
    {id: 27, type: "弓兵", tech: "密林游侠", effect: "对飞兵士兵攻防克制修正+30%"},
    {id: 28, type: "弓兵", tech: "闪转腾挪", effect: "被近战打，双防+20%"},
    {id: 29, type: "刺客", tech: "野战特训", effect: "站地形时，攻防+20%"},
    {id: 30, type: "刺客", tech: "暗影打击", effect: "主动攻击满血敌人时,攻防+20%"},
    {id: 31, type: "刺客", tech: "杀戮气息", effect: "主动攻击满血敌人时,增伤+30%"},
    {id: 32, type: "刺客", tech: "以法特训", effect: "与法师或僧侣交战时，双防+30%"},
    {id: 33, type: "法师", tech: "自我暗示", effect: "敌方有强化时，攻防+20%"},
    {id: 34, type: "法师", tech: "法力虚空", effect: "敌方有弱化时，攻防+20%"},
    {id: 35, type: "法师", tech: "圣光护佑", effect: "部队满血时，减伤30%"},
    {id: 36, type: "法师", tech: "聚精会神", effect: "小于等于90%血时，增伤20%"},
    {id: 37, type: "僧兵", tech: "对魔特训", effect: "对魔物士兵攻防克制修正+30%"},
    {id: 38, type: "僧兵", tech: "圣光护佑", effect: "部队满血时，减伤30%"},
    {id: 39, type: "僧兵", tech: "虔诚信仰", effect: "高于80%血时，增伤30%"},
    {id: 40, type: "僧兵", tech: "祛除不纯", effect: "与混合部队交战时，攻防+20%"},
    {id: 41, type: "魔物", tech: "自我暗示", effect: "敌方有强化时，攻防+20%"},
    {id: 42, type: "魔物", tech: "法力虚空", effect: "敌方有弱化时，攻防+20%"},
    {id: 43, type: "魔物", tech: "暗黑力量", effect: "自身有弱化时，增伤30%"},
    {id: 44, type: "魔物", tech: "污秽铠甲", effect: "常驻双防+20%，但与魔物或僧侣交战时，双防克制修正-16%"},
]
export const sbkj_table_columns = [
    // { label: "编号", prop: "id", width: 60, align: "center" },
    {label: "士兵种类", prop: "type", width: 100, align: "center"},
    {label: "科技名称", prop: "tech", width: 150, align: "center"},
    {label: "科技效果", prop: "effect", align: "left"},
];

export const zykz_table = [
    {
        attack: "枪兵",
        枪兵: "",
        步兵: "-20%",
        骑兵: "+30%",
        飞兵: "",
        水兵: "",
        弓兵: "",
        法师: "",
        僧侣: "",
        魔物: "",
    },
    {
        attack: "步兵",
        枪兵: "+40%",
        步兵: "",
        骑兵: "-30%",
        飞兵: "",
        水兵: "",
        弓兵: "",
        法师: "",
        僧侣: "",
        魔物: "",
    },
    {
        attack: "骑兵",
        枪兵: "-30%",
        步兵: "+20%",
        骑兵: "",
        飞兵: "",
        水兵: "",
        弓兵: "",
        法师: "",
        僧侣: "",
        魔物: "",
    },
    {
        attack: "飞兵",
        枪兵: "",
        步兵: "",
        骑兵: "",
        飞兵: "",
        水兵: "",
        弓兵: "",
        法师: "",
        僧侣: "",
        魔物: "",
    },
    {
        attack: "水兵",
        枪兵: "",
        步兵: "",
        骑兵: "",
        飞兵: "",
        水兵: "",
        弓兵: "",
        法师: "",
        僧侣: "",
        魔物: "",
    },
    {
        attack: "弓兵",
        枪兵: "",
        步兵: "",
        骑兵: "",
        飞兵: "+30%",
        水兵: "",
        弓兵: "",
        法师: "",
        僧侣: "",
        魔物: "",
    },
    {
        attack: "法师",
        枪兵: "",
        步兵: "",
        骑兵: "",
        飞兵: "",
        水兵: "",
        弓兵: "",
        法师: "",
        僧侣: "",
        魔物: "",
    },
    {
        attack: "僧侣",
        枪兵: "",
        步兵: "",
        骑兵: "",
        飞兵: "",
        水兵: "",
        弓兵: "",
        法师: "",
        僧侣: "",
        魔物: "+80%",
    },
    {
        attack: "魔物",
        枪兵: "",
        步兵: "",
        骑兵: "",
        飞兵: "",
        水兵: "",
        弓兵: "",
        法师: "",
        僧侣: "-40%",
        魔物: "",
    },
];

export const zykz_table_columns = [
    {label: "进攻 \\ 防守", prop: "attack", width: 100, align: "center", fixed: true},
    {label: "枪兵", prop: "枪兵", width: 80, align: "center"},
    {label: "步兵", prop: "步兵", width: 80, align: "center"},
    {label: "骑兵", prop: "骑兵", width: 80, align: "center"},
    {label: "飞兵", prop: "飞兵", width: 80, align: "center"},
    {label: "水兵", prop: "水兵", width: 80, align: "center"},
    {label: "弓兵", prop: "弓兵", width: 80, align: "center"},
    {label: "法师", prop: "法师", width: 80, align: "center"},
    {label: "僧侣", prop: "僧侣", width: 80, align: "center"},
    {label: "魔物", prop: "魔物", width: 80, align: "center"},
];

export const chakan_gfczjs_columns = [
    // { label: "编号", prop: "id", width: 60, align: "center" },
    {label: "攻守方", prop: "attacker", width: 100, align: "center"},
    {label: "攻防差", prop: "defenseDifference", align: "right"},
    {label: "通用增减%", prop: "commonEffect", align: "right"},
    {label: "技能增减%", prop: "skillEffect", align: "right"},
    {label: "远程增减%", prop: "rangedEffect", align: "right"},
    {label: "其他增减%", prop: "otherEffect", align: "right"},
    {label: "技能倍率", prop: "skillMultiplier", align: "right"},
    {label: "单段", prop: "singleSegment", align: "right"},
    {label: "暴伤倍率", prop: "critMultiplier", align: "right"},
    {label: "暴击单段", prop: "critSingleSegment", align: "right"},
];


export const sbkj_aoe_table = [
    {id: 1, soldierType: "步兵", techName: "对枪特训", techEffect: "对枪兵士兵攻防克制修正+30%"},
    {id: 2, soldierType: "步兵", techName: "应急处理", techEffect: "士兵大于80%血，减伤20%"},
    {id: 3, soldierType: "枪兵", techName: "对骑特训", techEffect: "对骑兵士兵攻防克制修正+30%"},
    {id: 4, soldierType: "枪兵", techName: "作战续行", techEffect: "士兵低于70%血时,减伤20%"},
    {id: 5, soldierType: "骑兵", techName: "对步特训", techEffect: "对步兵士兵攻智防克制修正+30%"},
    {id: 6, soldierType: "飞兵", techName: "特技飞行", techEffect: "站地形时,减伤+20%"},
    {id: 7, soldierType: "弓兵", techName: "密林游侠", techEffect: "对飞兵士兵攻防克制修正+30%"},
    {id: 8, soldierType: "法师", techName: "圣光护佑", techEffect: "部队满血时，减伤30%"},
    {id: 9, soldierType: "僧兵", techName: "对魔特训", techEffect: "对魔物士兵攻防克制修正+30%"},
    {id: 10, soldierType: "僧兵", techName: "圣光护佑", techEffect: "部队满血时，减伤30%"},
    {
        id: 11,
        soldierType: "魔物",
        techName: "污秽铠甲",
        techEffect: "常驻双防+20%，但与魔物或僧侣交战时，双防克制修正-16%"
    },
];

export const sbkj_aoe_table_columns = [
    // { label: "编号", prop: "id", width: 60, align: "center" },
    {label: "士兵种类", prop: "soldierType", width: 100, align: "center"},
    {label: "科技名称", prop: "techName", width: 150, align: "center"},
    {label: "科技效果", prop: "techEffect", align: "left"},
];


export const mianbanList = [
    "生命",
    "攻击",
    "智力",
    "防御",
    "魔防",
    "技巧",
]
export const mianbanDefault = mianbanList.reduce((acc, cur) => {
    acc[cur] = 0
    return acc
}, {})

/// {"索尔":"./image/索尔.png","菲依雅":"./image/菲依雅.png","海姆达尔":"./image/海姆达尔.png","巴德尔":"./image/巴德尔.png","奥丁":"./image/奥丁.png","弗丽嘉":"./image/弗丽嘉.png","提尔":"./image/提尔.png","洛基":"./image/洛基.png","维达":"./image/维达.png","未携带":"./image/神契未携带.png"}
const sq_slsb_dict = {
    "索尔": {
        "生命": 360,
        "攻击": 45,
        "智力": 45,
        "防御": 30,
        "魔防": 30,
        "技巧": 10,
        "士兵生命": 0.06,
        "士兵攻击": 0.06,
        "士兵防御": 0.06,
        "士兵魔防": 0.06
    },
    "菲依雅": {
        "生命": 180,
        "攻击": 18,
        "智力": 75,
        "防御": 28,
        "魔防": 50,
        "技巧": 9,
        "士兵生命": 0.06,
        "士兵攻击": 0.06,
        "士兵防御": 0.06,
        "士兵魔防": 0.06
    },
    "海姆达尔": {
        "生命": 500,
        "攻击": 24,
        "智力": 18,
        "防御": 82,
        "魔防": 6,
        "技巧": 5,
        "士兵生命": 0.06,
        "士兵攻击": 0.06,
        "士兵防御": 0.06,
        "士兵魔防": 0.06
    },
    "巴德尔": {
        "生命": 380,
        "攻击": 21,
        "智力": 72,
        "防御": 46,
        "魔防": 12,
        "技巧": 9,
        "士兵生命": 0.06,
        "士兵攻击": 0.06,
        "士兵防御": 0.06,
        "士兵魔防": 0.06
    },
    "奥丁": {
        "生命": 300,
        "攻击": 93,
        "智力": 12,
        "防御": 36,
        "魔防": 10,
        "技巧": 15,
        "士兵生命": 0.06,
        "士兵攻击": 0.06,
        "士兵防御": 0.06,
        "士兵魔防": 0.06
    },
    "弗丽嘉": {
        "生命": 420,
        "攻击": 18,
        "智力": 27,
        "防御": 8,
        "魔防": 86,
        "技巧": 5,
        "士兵生命": 0.06,
        "士兵攻击": 0.06,
        "士兵防御": 0.06,
        "士兵魔防": 0.06
    },
    "提尔": {
        "生命": 460,
        "攻击": 96,
        "智力": 18,
        "防御": 28,
        "魔防": 10,
        "技巧": 8,
        "士兵生命": 0.06,
        "士兵攻击": 0.06,
        "士兵防御": 0.06,
        "士兵魔防": 0.06
    },
    "洛基": {
        "生命": 400,
        "攻击": 12,
        "智力": 120,
        "防御": 10,
        "魔防": 18,
        "技巧": 10,
        "士兵生命": 0.06,
        "士兵攻击": 0.06,
        "士兵防御": 0.06,
        "士兵魔防": 0.06
    },
    "维达": {
        "生命": 400,
        "攻击": 69,
        "智力": 21,
        "防御": 14,
        "魔防": 44,
        "技巧": 9,
        "士兵生命": 0.06,
        "士兵攻击": 0.06,
        "士兵防御": 0.06,
        "士兵魔防": 0.06
    }
}
Object.keys(sq_slsb_dict).forEach((key) => {
    sq_slsb_dict[key].image = getImageUrl(key);
})
export {sq_slsb_dict}
export const sq_slsb_table_columns = [
    {label: "名称", prop: "名称", width: 120, align: "center", fixed: true, isShowItemValue: true},
    {label: "生命", prop: "生命", max: 600, width: 140, align: "center"},
    {label: "攻击", prop: "攻击", max: 75, width: 140, align: "center"},
    {label: "智力", prop: "智力", max: 75, width: 140, align: "center"},
    {label: "防御", prop: "防御", max: 60, width: 140, align: "center"},
    {label: "魔防", prop: "魔防", max: 60, width: 140, align: "center"},
    {label: "技巧", prop: "技巧", max: 0, width: 140, align: "center"},
    {label: "士兵生命", prop: "士兵生命", max: 18, width: 140, align: "center", isPercent: true},
    {label: "士兵攻击", prop: "士兵攻击", max: 18, width: 140, align: "center", isPercent: true},
    {label: "士兵防御", prop: "士兵防御", max: 18, width: 140, align: "center", isPercent: true},
    {label: "士兵魔防", prop: "士兵魔防", max: 18, width: 140, align: "center", isPercent: true},
]
export const sq_slsb_table = Object.keys(sq_slsb_dict).map((name) => {
    return {
        "名称": name,
        ...sq_slsb_dict[name]
    }
})

// ["无","满月","轻风","时钟","怒涛","魔术","顽石","水晶","寒冰","流星","烈日","大树","荆棘","钢铁"]
// {"满月": "./image/满月.png", "轻风": "./image/轻风.png", "时钟": "./image/时钟.png",
//                  "怒涛": "./image/怒涛.png", "魔术": "./image/魔术.png", "顽石": "./image/顽石.png",
//                  "水晶": "./image/水晶.png", "寒冰": "./image/寒冰.png", "流星": "./image/流星.png",
//                  "烈日": "./image/烈日.png", "大树": "./image/大树.png", "荆棘": "./image/荆棘.png",
//                  "钢铁": "./image/钢铁.png"}

const options_fm = ["无", "满月", "轻风", "时钟", "怒涛", "魔术", "顽石", "水晶", "寒冰", "流星", "烈日", "大树", "荆棘", "钢铁"]
// 附魔共鸣
const fmGm = {
    "满月": {
        "攻击百分比": 0.05,
        "智力百分比": 0.05,
    },
    "轻风": {
        "攻击百分比": 0.05,
        "智力百分比": 0.05,
    },
    "时钟": {
        "攻击百分比": 0.05,
        "智力百分比": 0.05,
    },
    "怒涛": {
        "攻击百分比": 0.05,
        "智力百分比": 0.05,
    },
    "魔术": {
        "攻击百分比": 0.05,
        "智力百分比": 0.05,
    },
    "顽石": {
        "防御百分比": 0.05,
        "魔防百分比": 0.05,
    },
    "水晶": {
        "防御百分比": 0.05,
        "魔防百分比": 0.05,
    },
    "寒冰": {
        "防御百分比": 0.05,
        "魔防百分比": 0.05,
    },
    "大树": {
        "生命百分比": 0.1,
    },
    "荆棘": {
        "生命百分比": 0.1,
    },
    "钢铁": {
        "生命百分比": 0.1,
    },


}

export const fmOptions = options_fm.map((name) => {
    return {
        "value": name,
        "label": name,
        "image": name === '无' ? "" : getImageUrl(name),
        "gm": fmGm[name]
    }
})

export const fmInputTableColumns = [
    {label: "部位", prop: "部位", width: 80, fixed: true},
    {
        label: "生命百分比", prop: "生命百分比",
        maxList:{
            武器:10,
            衣服:15,
            头饰:15,
            饰品:10
        },
        width: 140, isPercent: true
    },
    {
        label: "攻击百分比", prop: "攻击百分比",
        maxList:{
            武器:15,
            衣服:5,
            头饰:5,
            饰品:10
        },
        width: 140, isPercent: true
    },
    {
        label: "智力百分比", prop: "智力百分比",
        maxList:{
            武器:15,
            衣服:5,
            头饰:5,
            饰品:10
        },
        width: 140, isPercent: true
    },
    {label: "防御百分比", prop: "防御百分比",
        maxList:{
            武器:5,
            衣服:15,
            头饰:15,
            饰品:10
        },
        width: 140, isPercent: true},
    {label: "魔防百分比", prop: "魔防百分比",
        maxList:{
            武器:5,
            衣服:15,
            头饰:15,
            饰品:10
        },
        width: 140, isPercent: true},
    {label: "生命固定值", prop: "生命固定值",
        maxList:{
            武器:130,
            衣服:200,
            头饰:200,
            饰品:130
        },
        width: 140,},
    {label: "攻击固定值", prop: "攻击固定值",
        maxList:{
            武器:30,
            衣服:10,
            头饰:10,
            饰品:20
        },
        width: 140,},
    {label: "智力固定值", prop: "智力固定值",
        maxList:{
            武器:30,
            衣服:10,
            头饰:10,
            饰品:20
        },
        width: 140,},
    {label: "防御固定值", prop: "防御固定值",
        maxList:{
            武器:6,
            衣服:18,
            头饰:18,
            饰品:12
        },
        width: 140,},
    {label: "魔防固定值", prop: "魔防固定值",
        maxList:{
            武器:6,
            衣服:18,
            头饰:18,
            饰品:12
        },
        width: 140,},
]
const zbLabel = ["武器", "衣服", "头饰", "饰品"]
export const defaultFmInput = zbLabel.map((name) => {
    return {
        "部位": name,
        ...fmInputTableColumns.reduce((acc, cur) => {
            if (cur.prop === '部位') {
                return acc
            }
            acc[cur.prop] = 0
            return acc
        }, {})
    }
})

