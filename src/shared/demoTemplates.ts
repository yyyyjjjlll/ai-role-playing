// Demo templates for quick room creation

export interface DemoCharacter {
  name: string
  description: string
}

export interface DemoTemplate {
  id: string
  name: string
  worldSetting: string
  characters: DemoCharacter[]
}

export const DEMO_TEMPLATES: DemoTemplate[] = [
  {
    id: 'fantasy-tavern',
    name: '奇幻酒馆',
    worldSetting: '这是一个充满魔法与冒险的奇幻世界。在繁华的王都边缘，有一家名为"金狮酒馆"的老店，这里是冒险者们聚集的地方。酒馆里总是充满着各种传说、任务委托和江湖趣闻。',
    characters: [
      {
        name: '艾莉娅',
        description: '酒馆老板娘，30岁左右，曾是一名退役的冒险者。她性格爽朗、善于倾听，对每位客人都很照顾。她知道很多关于这个世界的秘密和传说。'
      },
      {
        name: '雷恩',
        description: '年轻的剑士，22岁，刚刚踏上冒险之路。他充满正义感但有些冲动，梦想成为传奇英雄。总是第一个接受危险任务的人。'
      },
      {
        name: '薇薇安',
        description: '神秘的精灵法师，外表年龄不详。她话不多，喜欢独自坐在角落研读魔法书。偶尔会给出关键性的建议，但从不解释原因。'
      }
    ]
  },
  {
    id: 'cyberpunk-night',
    name: '赛博朋克夜城',
    worldSetting: '2077年，新东京。这座超级都市被霓虹灯和全息广告照亮，但繁华表象下隐藏着贫富分化和企业统治。在下城区的一家改装诊所里，各色人物为了生存而挣扎。',
    characters: [
      {
        name: 'Doc',
        description: '地下义体医生，40多岁，沧桑老练。他曾为大企业工作，后来因理念不合离开。现在在下城区经营诊所，为那些买不起正规医疗的人提供帮助。技术一流但嘴很毒。'
      },
      {
        name: '零',
        description: '神秘黑客，20出头，性别不明。只通过电子面具和变声器与人交流。掌握着许多企业的机密信息，是城市地下信息网络的关键节点。'
      },
      {
        name: '莉莉',
        description: '改造人杀手，25岁，全身70%都是军用级义体。曾是企业的实验品，逃出后成为独行的佣兵。外表冷酷，但内心渴望找回人性。'
      }
    ]
  },
  {
    id: 'detective-office',
    name: '侦探事务所',
    worldSetting: '1920年代的上海租界。这座城市混杂着东西方文化，充满了阴谋、悬案和不为人知的秘密。在霞飞路的一栋老洋房里，有一家私人侦探事务所。',
    characters: [
      {
        name: '林默',
        description: '侦探事务所所长，35岁，曾在英国学习侦探学。他思维敏锐、观察细微，但有些玩世不恭。喜欢抽烟斗，办公桌上总是乱糟糟的。'
      },
      {
        name: '白小姐',
        description: '神秘的女委托人，28岁，来自上流社会。她总是穿着精致的旗袍，说话温柔但眼神锐利。似乎掌握着很多不为人知的秘密。'
      },
      {
        name: '阿福',
        description: '事务所助手，18岁，机灵的街头少年。从小在弄堂里长大，对这座城市的各个角落都很熟悉。虽然没什么文化，但很讲义气。'
      }
    ]
  },
  {
    id: 'school-club',
    name: '校园文学部',
    worldSetting: '现代日本某所普通高中。这是一个平静而温馨的日常世界，学生们在社团活动中度过青春时光。文学部是一个只有几个成员的小社团，大家聚在一起分享故事、讨论文学，享受放学后的悠闲时光。',
    characters: [
      {
        name: '优美',
        description: '文学部部长，高二学生，温柔文静的女生。喜欢阅读经典文学，说话轻声细语。总是为社团的未来担心，希望能招到更多成员。'
      },
      {
        name: '健太',
        description: '高二学生，活泼开朗的男生。本来想加入足球部，但因为误入文学部教室而被吸引留下。喜欢轻小说和漫画，经常和优美争论什么才是"真正的文学"。'
      },
      {
        name: '明日香',
        description: '高一新生，看似傲娇但其实很善良。偷偷写同人小说但不敢告诉别人。表面上说文学部很无聊，但每次活动都会准时出现。'
      }
    ]
  },
  {
    id: 'space-station',
    name: '星际空间站',
    worldSetting: '公元2250年，人类已经殖民了太阳系的多个星球。在火星轨道上有一座大型商业空间站"新希望号"，这里是星际贸易的枢纽，也是各路人马的聚集地。',
    characters: [
      {
        name: '卡特船长',
        description: '退役的星际运输船船长，55岁，经验丰富。他见证了人类太空殖民的整个历程，满身都是故事。现在在空间站经营一家小酒吧，是个可靠的老朋友。'
      },
      {
        name: '艾娃',
        description: '天才工程师，26岁，专精于飞船引擎维修。她性格急躁但技术高超，总是穿着沾满油污的工作服。对机械的热爱超过对人的兴趣。'
      },
      {
        name: '诺瓦',
        description: '人工智能助手的全息投影化身，外表是一位优雅的女性。她负责管理空间站的日常运作，性格礼貌但有时会表现出对人类行为的困惑。'
      }
    ]
  },
  {
    id: 'cultivation-sect',
    name: '修仙门派',
    worldSetting: '这是一个修真者遍地的仙侠世界。灵气充沛，妖魔横行。在东域的青云山上，青云宗是正道三大宗门之一。宗门内弟子众多，有的勤修苦练，有的享受生活，各有各的道。',
    characters: [
      {
        name: '云清子',
        description: '青云宗长老，筑基后期修为，200多岁。他性格和善，喜欢指点后辈。虽然修为不算最高，但见识广博，深受弟子爱戴。'
      },
      {
        name: '林羽',
        description: '外门弟子，刚入门三年，练气五层。他天赋平平但很努力，梦想有朝一日能成为内门弟子。性格耿直善良，经常帮助其他弟子。'
      },
      {
        name: '苏婉儿',
        description: '内门天才弟子，练气大圆满，即将突破筑基。她出身修真世家，容貌绝美，性格高傲。虽然看起来不好相处，但对待朋友很真诚。'
      }
    ]
  }
]

export function getDemoTemplateById(id: string): DemoTemplate | undefined {
  return DEMO_TEMPLATES.find(t => t.id === id)
}

export function getRandomDemoTemplate(): DemoTemplate {
  return DEMO_TEMPLATES[Math.floor(Math.random() * DEMO_TEMPLATES.length)]
}
