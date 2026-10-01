// ============================================================
// App.jsx —— 游戏主流程
// 领养页 → 主页（喂食 / 抚摸 / 玩耍 / 洗澡 / 单词测验 / 宠物小屋）
// 状态更新走 commit()：深拷贝 → 改 → 落盘 → setState，全同步，无时序坑
// ============================================================
import { useState, useRef } from 'react';
import { PETS, PET_ORDER, FOODS, STAGES, UNLOCK_NEED, QUIZ_QUESTIONS } from './data.js';
import { loadSave, persistSave, newPet, activePet, totalHearts, addHearts, clamp } from './storage.js';
import { PetAvatar } from './pets.jsx';
import { StatusBar, FoodPicker, Quiz, LevelUpModal } from './components.jsx';
import { speak } from './speech.js';
import { sfxClick, sfxEat, sfxHappy, sfxLevelUp, sfxBubble } from './audio.js';

// 互动对应的英文单词（边玩边学）
const PLAY_WORDS = { pet: 'Pet', ball: 'Ball', bath: 'Bath' };
const PLAY_ZH = { pet: '抚摸', ball: '玩球', bath: '洗澡' };
const PLAY_ZH2 = { pet: '抚摸', ball: '球', bath: '洗澡' };

// ---------------- 领养页 ----------------
// fixedType: 解锁领养时直接指定类型（跳过选择）；onCancel: 解锁流程可返回
function AdoptScreen({ ownedTypes, fixedType, onAdopt, onCancel }) {
  const firstChoice = fixedType || PET_ORDER.find((t) => !ownedTypes.includes(t)) || 'bunny';
  const [type, setType] = useState(firstChoice);
  const [name, setName] = useState('');
  const choices = fixedType ? [fixedType] : PET_ORDER.filter((t) => !ownedTypes.includes(t));

  return (
    <div className="screen adopt">
      <h1 className="game-title">🐾 宠物喂养乐园</h1>
      <p className="subtitle">{ownedTypes.length === 0 ? '选一只小可爱带回家吧！' : '再领养一只小可爱吧！'}</p>
      <div className="adopt-cards">
        {choices.map((t) => {
          const cfg = PETS[t];
          const favFood = FOODS.find((f) => f.id === cfg.favoriteFood);
          return (
            <button
              key={t}
              className={'adopt-card' + (type === t ? ' selected' : '')}
              onClick={() => { sfxClick(); setType(t); }}
            >
              <PetAvatar type={t} stage={1} face="happy" className="adopt-pet" />
              <div className="adopt-name">{cfg.name}</div>
              <div className="adopt-desc">{cfg.personality}</div>
              <div className="adopt-fav">最爱：{favFood.emoji} {favFood.zh}</div>
            </button>
          );
        })}
      </div>
      <div className="name-row">
        <label>给它起个名字：</label>
        <input
          value={name}
          maxLength={8}
          placeholder={`比如：${PETS[type].name}乖乖`}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <button
        className="btn btn-primary btn-big"
        onClick={() => { sfxHappy(); onAdopt(type, name.trim() || `${PETS[type].name}乖乖`); }}
      >
        🎀 带{PETS[type].name}回家
      </button>
      {onCancel && <button className="btn btn-ghost" onClick={onCancel}>先不领养</button>}
    </div>
  );
}

// ---------------- 宠物小屋（切换 / 解锁） ----------------
function PetHouse({ save, onSwitch, onUnlock, onClose }) {
  const owned = save.pets.map((p) => p.type);
  const locked = PET_ORDER.filter((t) => !owned.includes(t));
  const total = totalHearts(save);
  const nextNeed = UNLOCK_NEED[save.pets.length]; // 解锁下一只需要的总爱心
  const canUnlock = locked.length > 0 && total >= nextNeed;

  return (
    <div className="modal-mask" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>🏠 宠物小屋</h3>
        <div className="house-list">
          {save.pets.map((p) => (
            <button
              key={p.id}
              className={'house-card' + (p.id === save.activePetId ? ' active' : '')}
              onClick={() => { sfxClick(); onSwitch(p.id); }}
            >
              <PetAvatar type={p.type} stage={p.stage} className="house-pet" />
              <div className="house-name">{p.name}</div>
              <div className="house-stage">{STAGES[p.stage].name} · 💗{p.hearts}</div>
              {p.id === save.activePetId && <span className="house-tag">出场中</span>}
            </button>
          ))}
          {locked.map((t) => (
            <div key={t} className="house-card locked">
              <div className="house-lock">🔒</div>
              <div className="house-name">{PETS[t].name}</div>
              <div className="house-stage">
                {canUnlock ? '可以领养啦！' : `总爱心满 ${nextNeed} 解锁（${total}/${nextNeed}）`}
              </div>
              {canUnlock && (
                <button className="btn btn-primary btn-small" onClick={() => onUnlock(t)}>
                  领养{PETS[t].name}
                </button>
              )}
            </div>
          ))}
        </div>
        <button className="btn btn-ghost" onClick={onClose}>关闭</button>
      </div>
    </div>
  );
}

// ---------------- 主页 ----------------
function HomeScreen({ save, commit, onUnlockRequest }) {
  const pet = activePet(save);
  const cfg = PETS[pet.type];
  const [showFood, setShowFood] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showHouse, setShowHouse] = useState(false);
  const [levelUp, setLevelUp] = useState(null);   // 升级弹窗：新阶段名
  const [toast, setToast] = useState('');
  const [anim, setAnim] = useState('');           // happy | eat | jump | bath
  const [floats, setFloats] = useState([]);       // 飘爱心
  const [bubbles, setBubbles] = useState([]);     // 洗澡泡泡
  const [showBall, setShowBall] = useState(false);// 玩球动画
  const timer = useRef(null);

  // 小提示条，2.5 秒自动消失
  const say = (msg) => {
    setToast(msg);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(''), 2600);
  };

  // 飘一个爱心/文字
  const float = (text) => {
    const id = Date.now() + Math.random();
    setFloats((f) => [...f, { id, text }]);
    setTimeout(() => setFloats((f) => f.filter((x) => x.id !== id)), 1300);
  };

  // 短暂播放宠物动作动画
  const playAnim = (name, ms = 1300) => {
    setAnim(name);
    setTimeout(() => setAnim(''), ms);
  };

  // ---- 喂食 ----
  const feed = (food) => {
    setShowFood(false);
    if (save.feedLeft <= 0) {
      say('吃饱啦，正在睡觉💤 明天再来喂吧！');
      return;
    }
    const fav = cfg.favoriteFood === food.id;
    const { newStageName } = commit((s) => {
      const p = activePet(s);
      s.feedLeft -= 1;
      p.fullness = clamp(p.fullness + 25);
      p.mood = clamp(p.mood + 5);
      let name = '';
      if (addHearts(p, fav ? 3 : 2)) name = STAGES[p.stage].name;
      if (!s.learnedWords.includes(food.en)) s.learnedWords.push(food.en);
      return { newStageName: name };
    });
    sfxEat();
    speak(food.en);
    playAnim('eat');
    float(fav ? '+3💗 最爱！' : '+2💗');
    say(fav ? `${pet.name}最爱吃${food.zh}啦！${food.en}！` : `啊呜，真好吃！${food.en} ${food.zh}`);
    if (newStageName) setTimeout(() => { sfxLevelUp(); setLevelUp(newStageName); }, 900);
  };

  // ---- 互动：抚摸 / 玩球 / 洗澡 ----
  const play = (kind) => {
    if (save.playLeft <= 0) {
      say('玩累了，想休息💤 明天再陪你玩！');
      return;
    }
    const word = PLAY_WORDS[kind];
    const moodAdd = kind === 'ball' ? 15 : kind === 'pet' ? 12 : 10;
    const { newStageName } = commit((s) => {
      const p = activePet(s);
      s.playLeft -= 1;
      p.mood = clamp(p.mood + moodAdd);
      let name = '';
      if (addHearts(p, 1)) name = STAGES[p.stage].name;
      if (!s.learnedWords.includes(word)) s.learnedWords.push(word);
      return { newStageName: name };
    });
    speak(word); // 每种互动都教一个英文单词
    if (kind === 'pet') { sfxHappy(); playAnim('happy'); }
    if (kind === 'ball') {
      sfxHappy(); playAnim('jump');
      setShowBall(true);
      setTimeout(() => setShowBall(false), 1200);
    }
    if (kind === 'bath') {
      sfxBubble(); playAnim('bath');
      const id = Date.now();
      setBubbles(Array.from({ length: 8 }, (_, i) => ({ id: id + i, left: 12 + i * 10 })));
      setTimeout(() => setBubbles([]), 1400);
    }
    float('+1💗');
    float(word);
    say(`${PLAY_ZH[kind]}！${word}（${PLAY_ZH2[kind]}）`);
    if (newStageName) setTimeout(() => { sfxLevelUp(); setLevelUp(newStageName); }, 900);
  };

  // ---- 测验完成 ----
  const onQuizDone = (score) => {
    setShowQuiz(false);
    const { gained, newStageName } = commit((s) => {
      const p = activePet(s);
      s.quizDone = true;
      const g = score * 2 + (score === QUIZ_QUESTIONS ? 3 : 0);
      let name = '';
      if (addHearts(p, g)) name = STAGES[p.stage].name;
      p.mood = clamp(p.mood + 10);
      return { gained: g, newStageName: name };
    });
    sfxHappy();
    playAnim('happy');
    float(`+${gained}💗`);
    say(score === QUIZ_QUESTIONS ? `全对！太厉害了！+${gained}💗` : `答对 ${score} 题！+${gained}💗 明天继续加油！`);
    if (newStageName) setTimeout(() => { sfxLevelUp(); setLevelUp(newStageName); }, 900);
  };

  const tired = save.playLeft <= 0;
  const face = anim === 'happy' || anim === 'jump' ? 'happy' : tired ? 'sleepy' : 'normal';

  return (
    <div className="screen home">
      <header className="topbar">
        <h1 className="game-title small">🐾 宠物喂养乐园</h1>
        <button className="btn btn-ghost btn-small" onClick={() => { sfxClick(); setShowHouse(true); }}>🏠 宠物小屋</button>
      </header>

      <StatusBar pet={pet} />

      {/* 宠物舞台 */}
      <div className="stage">
        <div className={`pet-wrap anim-${anim}`}>
          <PetAvatar type={pet.type} stage={pet.stage} face={face} className="pet" />
          {tired && <span className="sleep-z">💤</span>}
          {showBall && <span className="ball">⚽</span>}
          {bubbles.map((b) => (
            <span key={b.id} className="bubble" style={{ left: `${b.left}%` }}>🫧</span>
          ))}
          {floats.map((f) => (
            <span key={f.id} className="float-up">{f.text}</span>
          ))}
        </div>
        <div className="pet-name">{pet.name} <span className="pet-type">({cfg.name} · {STAGES[pet.stage].name})</span></div>
        {/* 点宠物 = 抚摸 */}
        <button className="pet-click-hint" onClick={() => play('pet')} aria-label="抚摸宠物">
          👆 点一点{pet.name}，摸摸它
        </button>
      </div>

      {/* 今日额度 */}
      <div className="daily">
        <span>🍼 今日喂食：{save.feedLeft > 0 ? '🍼'.repeat(save.feedLeft) : '吃饱啦💤'}</span>
        <span>🎮 今日互动：{save.playLeft > 0 ? '⭐'.repeat(save.playLeft) : '休息中💤'}</span>
      </div>

      {/* 动作按钮 */}
      <div className="actions">
        <button className="action-btn feed" onClick={() => { sfxClick(); setShowFood(true); }} disabled={save.feedLeft <= 0}>
          <span className="a-emoji">🍼</span><span>喂食</span>
        </button>
        <button className="action-btn" onClick={() => play('pet')} disabled={save.playLeft <= 0}>
          <span className="a-emoji">🤗</span><span>抚摸</span><span className="a-en">Pet</span>
        </button>
        <button className="action-btn" onClick={() => play('ball')} disabled={save.playLeft <= 0}>
          <span className="a-emoji">⚽</span><span>玩球</span><span className="a-en">Ball</span>
        </button>
        <button className="action-btn" onClick={() => play('bath')} disabled={save.playLeft <= 0}>
          <span className="a-emoji">🫧</span><span>洗澡</span><span className="a-en">Bath</span>
        </button>
        <button
          className="action-btn quiz-btn"
          onClick={() => { sfxClick(); setShowQuiz(true); }}
          disabled={save.quizDone}
        >
          <span className="a-emoji">📖</span><span>学单词</span>
          <span className="a-en">{save.quizDone ? '明天再来' : 'Quiz'}</span>
        </button>
      </div>

      <p className="tip">💡 喂食、互动、答题都能得💗，💗攒够宠物就会长大哦！</p>

      {showFood && <FoodPicker favoriteId={cfg.favoriteFood} onPick={feed} onClose={() => setShowFood(false)} />}
      {showQuiz && !save.quizDone && <Quiz onDone={onQuizDone} onQuit={() => setShowQuiz(false)} />}
      {showHouse && (
        <PetHouse
          save={save}
          onSwitch={(id) => { commit((s) => { s.activePetId = id; }); setShowHouse(false); say('换好啦！'); }}
          onUnlock={(t) => { setShowHouse(false); onUnlockRequest(t); }}
          onClose={() => setShowHouse(false)}
        />
      )}
      {levelUp && <LevelUpModal stageName={levelUp} onClose={() => setLevelUp(null)} />}
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

// ---------------- App 根组件 ----------------
export default function App() {
  const [save, setSave] = useState(() => loadSave());
  // 解锁领养流程：null = 不在领养页；字符串 = 要领养的宠物类型
  const [adoptType, setAdoptType] = useState(null);

  // 统一的状态提交入口：深拷贝 → 改 → 落盘 → setState，全同步
  // fn 返回的对象会被原样带回（用于取升级阶段名等）
  const commit = (fn) => {
    const next = structuredClone(save);
    const extra = fn(next) || {};
    persistSave(next);
    setSave(next);
    return extra;
  };

  const adopt = (type, name) => {
    commit((s) => {
      const p = newPet(type, name);
      s.pets.push(p);
      s.activePetId = p.id;
    });
    setAdoptType(null);
  };

  const ownedTypes = save.pets.map((p) => p.type);

  // 还没领养，或正在走解锁领养流程 → 领养页
  if (save.pets.length === 0 || adoptType) {
    return (
      <div className="app">
        <AdoptScreen
          ownedTypes={ownedTypes}
          fixedType={adoptType}
          onAdopt={adopt}
          onCancel={adoptType ? () => setAdoptType(null) : undefined}
        />
      </div>
    );
  }

  return (
    <div className="app">
      <HomeScreen
        key={save.activePetId}
        save={save}
        commit={commit}
        onUnlockRequest={(t) => setAdoptType(t)}
      />
    </div>
  );
}
