// ============================================================
// data.js —— 游戏全部静态数据：宠物、食物、单词题库、成长配置
// ============================================================

// 三只宠物配置
export const PETS = {
  bunny: {
    type: 'bunny',
    name: '小兔',
    emoji: '🐰',
    personality: '活泼好动，最爱蹦蹦跳跳',
    favoriteFood: 'carrot',          // 最爱吃的食物 id
    bodyColor: '#ffffff',
    earColor: '#ffd6e7',
    blush: '#ffb3c7',
  },
  cat: {
    type: 'cat',
    name: '小猫',
    emoji: '🐱',
    personality: '温柔爱撒娇，喜欢晒太阳',
    favoriteFood: 'fish',
    bodyColor: '#ffcf9e',
    earColor: '#ff9d76',
    blush: '#ff9d9d',
  },
  fox: {
    type: 'fox',
    name: '小狐狸',
    emoji: '🦊',
    personality: '聪明好奇，喜欢探险',
    favoriteFood: 'apple',
    bodyColor: '#ff9e5e',
    earColor: '#e56b2d',
    blush: '#ff9d9d',
  },
};
export const PET_ORDER = ['bunny', 'cat', 'fox'];

// 食物：每种都是英文单词卡（英文 + 中文 + emoji）
export const FOODS = [
  { id: 'apple',  en: 'Apple',  zh: '苹果', emoji: '🍎' },
  { id: 'milk',   en: 'Milk',   zh: '牛奶', emoji: '🥛' },
  { id: 'carrot', en: 'Carrot', zh: '胡萝卜', emoji: '🥕' },
  { id: 'cookie', en: 'Cookie', zh: '饼干', emoji: '🍪' },
  { id: 'fish',   en: 'Fish',   zh: '鱼',   emoji: '🐟' },
  { id: 'banana', en: 'Banana', zh: '香蕉', emoji: '🍌' },
];

// 单词题库：2–3 年级水平，共 36 词（食物 / 动物 / 颜色 / 数字）
export const WORDS = [
  // 食物
  { en: 'Apple',  zh: '苹果', emoji: '🍎', cat: '食物' },
  { en: 'Milk',   zh: '牛奶', emoji: '🥛', cat: '食物' },
  { en: 'Carrot', zh: '胡萝卜', emoji: '🥕', cat: '食物' },
  { en: 'Cookie', zh: '饼干', emoji: '🍪', cat: '食物' },
  { en: 'Fish',   zh: '鱼',   emoji: '🐟', cat: '食物' },
  { en: 'Banana', zh: '香蕉', emoji: '🍌', cat: '食物' },
  { en: 'Egg',    zh: '鸡蛋', emoji: '🥚', cat: '食物' },
  { en: 'Bread',  zh: '面包', emoji: '🍞', cat: '食物' },
  { en: 'Cake',   zh: '蛋糕', emoji: '🍰', cat: '食物' },
  { en: 'Water',  zh: '水',   emoji: '💧', cat: '食物' },
  // 动物
  { en: 'Cat',    zh: '小猫', emoji: '🐱', cat: '动物' },
  { en: 'Dog',    zh: '小狗', emoji: '🐶', cat: '动物' },
  { en: 'Rabbit', zh: '兔子', emoji: '🐰', cat: '动物' },
  { en: 'Bird',   zh: '小鸟', emoji: '🐦', cat: '动物' },
  { en: 'Panda',  zh: '熊猫', emoji: '🐼', cat: '动物' },
  { en: 'Monkey', zh: '猴子', emoji: '🐵', cat: '动物' },
  { en: 'Tiger',  zh: '老虎', emoji: '🐯', cat: '动物' },
  { en: 'Duck',   zh: '鸭子', emoji: '🦆', cat: '动物' },
  // 颜色
  { en: 'Red',    zh: '红色', emoji: '🔴', cat: '颜色' },
  { en: 'Yellow', zh: '黄色', emoji: '🟡', cat: '颜色' },
  { en: 'Blue',   zh: '蓝色', emoji: '🔵', cat: '颜色' },
  { en: 'Green',  zh: '绿色', emoji: '🟢', cat: '颜色' },
  { en: 'Pink',   zh: '粉色', emoji: '🌸', cat: '颜色' },
  { en: 'White',  zh: '白色', emoji: '⚪', cat: '颜色' },
  { en: 'Black',  zh: '黑色', emoji: '⚫', cat: '颜色' },
  { en: 'Orange', zh: '橙色', emoji: '🟠', cat: '颜色' },
  // 数字
  { en: 'One',   zh: '一', emoji: '1️⃣', cat: '数字' },
  { en: 'Two',   zh: '二', emoji: '2️⃣', cat: '数字' },
  { en: 'Three', zh: '三', emoji: '3️⃣', cat: '数字' },
  { en: 'Four',  zh: '四', emoji: '4️⃣', cat: '数字' },
  { en: 'Five',  zh: '五', emoji: '5️⃣', cat: '数字' },
  { en: 'Six',   zh: '六', emoji: '6️⃣', cat: '数字' },
  { en: 'Seven', zh: '七', emoji: '7️⃣', cat: '数字' },
  { en: 'Eight', zh: '八', emoji: '8️⃣', cat: '数字' },
];

// 成长阶段：5 阶，hearts 为累计爱心阈值
export const STAGES = [
  { name: '蛋宝宝',   need: 0,  desc: '一颗可爱的蛋，等待孵化' },
  { name: '小宝宝',   need: 8,  desc: '破壳啦！小小一只' },
  { name: '小少年',   need: 20, desc: '长大了一圈，更活泼了' },
  { name: '大朋友',   need: 40, desc: '已经是可靠的大朋友了' },
  { name: '闪亮之星', need: 70, desc: '闪闪发光的最终形态！' },
];

// 每日额度
export const DAILY_FEED = 3;   // 每天喂食次数
export const DAILY_PLAY = 5;   // 每天互动次数
export const QUIZ_QUESTIONS = 5; // 每天测验题数

// 解锁新宠物需要的总爱心
export const UNLOCK_NEED = [0, 50, 120]; // 第1/2/3只

// 随机取 n 个不重复的数组元素
export function sample(arr, n) {
  const copy = [...arr];
  const out = [];
  while (out.length < n && copy.length > 0) {
    out.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0]);
  }
  return out;
}

// 洗牌
export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// 今天的日期字符串（用于每日重置）
export function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}
