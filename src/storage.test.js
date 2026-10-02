// storage.js 单元测试：存档读写 / 成长计算 / 老存档迁移
import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  newPet, loadSave, persistSave, activePet, totalHearts,
  calcStage, addHearts, clamp,
} from './storage.js';

// localStorage 内存模拟
function mockLocalStorage() {
  const store = {};
  vi.stubGlobal('localStorage', {
    getItem: (k) => (k in store ? store[k] : null),
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: (k) => { delete store[k]; },
    clear: () => { for (const k of Object.keys(store)) delete store[k]; },
  });
  return store;
}

beforeEach(() => {
  mockLocalStorage();
});

describe('newPet', () => {
  it('初始字段正确', () => {
    const p = newPet('bunny', '小白');
    expect(p.type).toBe('bunny');
    expect(p.name).toBe('小白');
    expect(p.hearts).toBe(0);
    expect(p.stage).toBe(0);
    expect(p.mood).toBe(60);
    expect(p.fullness).toBe(50);
    expect(p.id).toBeTruthy();
  });
});

describe('calcStage', () => {
  it('按爱心门槛返回阶段', () => {
    expect(calcStage(0)).toBe(0);
    expect(calcStage(5)).toBe(0);
    expect(calcStage(6)).toBe(1);   // 破壳啦
    expect(calcStage(14)).toBe(2);
    expect(calcStage(114)).toBe(6);
    expect(calcStage(115)).toBe(7); // 传奇宝贝
    expect(calcStage(999)).toBe(7); // 封顶
  });
});

describe('addHearts', () => {
  it('心情 >=70 有 +1 加成', () => {
    const p = newPet('cat');
    p.mood = 80;
    addHearts(p, 5);
    expect(p.hearts).toBe(6);
  });

  it('心情 <70 无加成', () => {
    const p = newPet('cat');
    p.mood = 60;
    addHearts(p, 5);
    expect(p.hearts).toBe(5);
  });

  it('跨过门槛返回升级 true 并更新 stage', () => {
    const p = newPet('cat');
    p.mood = 60;
    expect(addHearts(p, 6)).toBe(true);
    expect(p.stage).toBe(1);
    expect(addHearts(p, 1)).toBe(false);
  });
});

describe('clamp', () => {
  it('限制在 [min, max] 内', () => {
    expect(clamp(50)).toBe(50);
    expect(clamp(-5)).toBe(0);
    expect(clamp(120)).toBe(100);
    expect(clamp(5, 10, 20)).toBe(10);
  });
});

describe('totalHearts / activePet', () => {
  it('totalHearts 累加所有宠物', () => {
    const a = newPet('bunny'); a.hearts = 10;
    const b = newPet('cat'); b.hearts = 25;
    expect(totalHearts({ pets: [a, b] })).toBe(35);
    expect(totalHearts({ pets: [] })).toBe(0);
  });

  it('activePet 按 id 找，找不到回退第一只，空则 null', () => {
    const a = newPet('bunny');
    const b = newPet('cat');
    const save = { pets: [a, b], activePetId: b.id };
    expect(activePet(save)).toBe(b);
    expect(activePet({ pets: [a, b], activePetId: 'nope' })).toBe(a);
    expect(activePet({ pets: [], activePetId: null })).toBeNull();
  });
});

describe('loadSave / persistSave', () => {
  it('无存档时返回空存档（不自动写回，由 persistSave 负责）', () => {
    const save = loadSave();
    expect(save.pets).toEqual([]);
    expect(save.wordPoints).toBe(0);
    expect(save.learnedWords).toEqual([]);
    expect(save.playSec).toBe(0);
    expect(save.restUntil).toBe(0);
  });

  it('老存档缺字段自动补全', () => {
    localStorage.setItem('pet-paradise-save-v1', JSON.stringify({ pets: [] }));
    const save = loadSave();
    expect(save.playSec).toBe(0);
    expect(save.restUntil).toBe(0);
    expect(save.wordPoints).toBe(0);
    expect(save.learnedWords).toEqual([]);
  });

  it('老存档 pochacco 自动迁移为 cinnamoroll', () => {
    const old = newPet('pochacco', '小狗');
    localStorage.setItem(
      'pet-paradise-save-v1',
      JSON.stringify({ pets: [old], activePetId: old.id }),
    );
    const save = loadSave();
    expect(save.pets[0].type).toBe('cinnamoroll');
    // 迁移结果已持久化
    const again = JSON.parse(localStorage.getItem('pet-paradise-save-v1'));
    expect(again.pets[0].type).toBe('cinnamoroll');
  });

  it('persistSave 往返一致', () => {
    const save = loadSave();
    const p = newPet('qilin', '阿麟');
    save.pets.push(p);
    save.activePetId = p.id;
    save.wordPoints = 42;
    persistSave(save);
    const back = loadSave();
    expect(back.pets).toHaveLength(1);
    expect(back.pets[0].type).toBe('qilin');
    expect(back.wordPoints).toBe(42);
  });
});
