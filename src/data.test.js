// data.js 单元测试：宠物配置 / 关卡 / 题库 / 工具函数
import { describe, it, expect } from 'vitest';
import {
  PETS, PET_ORDER, FOODS, WORDS, STAGES, UNLOCK_NEED,
  sample, shuffle, todayStr, seededShuffle, dailyFoods,
} from './data.js';

describe('宠物配置', () => {
  it('PET_ORDER 有 9 只宠物，且都在 PETS 里注册', () => {
    expect(PET_ORDER).toHaveLength(9);
    for (const t of PET_ORDER) {
      expect(PETS[t], `PETS 缺少 ${t}`).toBeDefined();
      expect(PETS[t].type).toBe(t);
    }
  });

  it('每只宠物字段完整', () => {
    for (const t of PET_ORDER) {
      const p = PETS[t];
      expect(p.name, `${t}.name`).toBeTruthy();
      expect(p.emoji, `${t}.emoji`).toBeTruthy();
      expect(p.personality, `${t}.personality`).toBeTruthy();
      expect(p.bodyColor, `${t}.bodyColor`).toBeTruthy();
      expect(p.blush, `${t}.blush`).toBeTruthy();
    }
  });

  it('每只宠物的最爱食物都在 FOODS 里', () => {
    const foodIds = new Set(FOODS.map((f) => f.id));
    for (const t of PET_ORDER) {
      expect(foodIds.has(PETS[t].favoriteFood), `${t}.favoriteFood=${PETS[t].favoriteFood}`).toBe(true);
    }
  });
});

describe('解锁与成长', () => {
  it('UNLOCK_NEED 数量与宠物数一致，第一只免费且递增', () => {
    expect(UNLOCK_NEED).toHaveLength(PET_ORDER.length);
    expect(UNLOCK_NEED[0]).toBe(0);
    for (let i = 1; i < UNLOCK_NEED.length; i++) {
      expect(UNLOCK_NEED[i]).toBeGreaterThan(UNLOCK_NEED[i - 1]);
    }
  });

  it('STAGES 有 8 阶，门槛从 0 开始递增', () => {
    expect(STAGES).toHaveLength(8);
    expect(STAGES[0].need).toBe(0);
    for (let i = 1; i < STAGES.length; i++) {
      expect(STAGES[i].need).toBeGreaterThan(STAGES[i - 1].need);
      expect(STAGES[i].name).toBeTruthy();
    }
  });
});

describe('单词题库', () => {
  it('共 200 词，字段完整、英文不重复', () => {
    expect(WORDS).toHaveLength(200);
    const seen = new Set();
    for (const w of WORDS) {
      expect(w.en).toBeTruthy();
      expect(w.zh).toBeTruthy();
      expect(w.cat).toBeTruthy();
      expect(seen.has(w.en), `重复单词 ${w.en}`).toBe(false);
      seen.add(w.en);
    }
  });
});

describe('工具函数', () => {  it('sample 取 n 个不重复元素', () => {
    const arr = [1, 2, 3, 4, 5];
    const got = sample(arr, 3);
    expect(got).toHaveLength(3);
    expect(new Set(got).size).toBe(3);
    expect(arr).toHaveLength(5); // 不修改原数组
  });

  it('shuffle 不丢不增元素', () => {
    const arr = [1, 2, 3, 4, 5, 6, 7];
    const got = shuffle(arr);
    expect([...got].sort()).toEqual([...arr].sort());
  });

  it('todayStr 格式为 YYYY-M-D', () => {
    expect(todayStr()).toMatch(/^\d{4}-\d{1,2}-\d{1,2}$/);
  });
});

describe('每日菜单', () => {
  it('FOODS 食物池有 12 种', () => {
    expect(FOODS).toHaveLength(12);
    expect(new Set(FOODS.map((f) => f.id)).size).toBe(12);
  });

  it('同一天菜单稳定：每天 6 种、不重复、必含最爱', () => {
    const a = dailyFoods('2026-10-2', 'apple');
    const b = dailyFoods('2026-10-2', 'apple');
    expect(a).toEqual(b);
    expect(a).toHaveLength(6);
    expect(new Set(a.map((f) => f.id)).size).toBe(6);
    expect(a.some((f) => f.id === 'apple')).toBe(true);
  });

  it('菜单里的食物都在食物池中', () => {
    const ids = new Set(FOODS.map((f) => f.id));
    for (const f of dailyFoods('2026-10-3', 'milk')) {
      expect(ids.has(f.id)).toBe(true);
    }
  });

  it('seededShuffle 同一种子结果一致，不修改原数组', () => {
    const arr = [1, 2, 3, 4, 5, 6];
    expect(seededShuffle(arr, 'x')).toEqual(seededShuffle(arr, 'x'));
    expect(arr).toEqual([1, 2, 3, 4, 5, 6]);
  });
});
