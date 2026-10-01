// ============================================================
// pets.jsx —— 三只宠物的手绘 SVG 形象
// 风格：圆滚滚、大眼睛、腮红，Q 版可爱风
// stage 0=蛋宝宝 1=小宝宝 2=小少年 3=大朋友(蝴蝶结) 4=闪亮之星(皇冠+星光)
// face: normal 普通 / happy 开心 / sleepy 睡觉
// ============================================================
import { PETS } from './data.js';

// ---------- 表情：眼睛 ----------
function Eyes({ face }) {
  if (face === 'happy') {
    // 开心的月牙眼 ∩ ∩
    return (
      <g stroke="#4a3b32" strokeWidth="5" strokeLinecap="round" fill="none">
        <path d="M70 108 Q82 94 94 108" />
        <path d="M106 108 Q118 94 130 108" />
      </g>
    );
  }
  if (face === 'sleepy') {
    // 睡觉的闭眼 ‿ ‿
    return (
      <g stroke="#4a3b32" strokeWidth="5" strokeLinecap="round" fill="none">
        <path d="M70 108 Q82 116 94 108" />
        <path d="M106 108 Q118 116 130 108" />
      </g>
    );
  }
  // 普通：大眼睛 + 高光
  return (
    <g>
      <circle cx="82" cy="106" r="13" fill="#fff" />
      <circle cx="118" cy="106" r="13" fill="#fff" />
      <circle cx="84" cy="108" r="6.5" fill="#4a3b32" />
      <circle cx="116" cy="108" r="6.5" fill="#4a3b32" />
      <circle cx="86" cy="105" r="2.4" fill="#fff" />
      <circle cx="118" cy="105" r="2.4" fill="#fff" />
    </g>
  );
}

// ---------- 表情：嘴巴 ----------
function Mouth({ face, y = 126 }) {
  if (face === 'happy') {
    return <path d={`M88 ${y} Q100 ${y + 12} 112 ${y}`} stroke="#4a3b32" strokeWidth="4" strokeLinecap="round" fill="none" />;
  }
  if (face === 'sleepy') {
    return <circle cx="100" cy={y + 2} r="3.5" fill="#4a3b32" />;
  }
  // 普通：ω 小嘴
  return (
    <path d={`M100 ${y} q0 6 -7 7 M100 ${y} q0 6 7 7`} stroke="#4a3b32" strokeWidth="3.5" strokeLinecap="round" fill="none" />
  );
}

// ---------- 通用：腮红 ----------
function Blush({ color }) {
  return (
    <g fill={color} opacity="0.85">
      <ellipse cx="66" cy="126" rx="9" ry="5.5" />
      <ellipse cx="134" cy="126" rx="9" ry="5.5" />
    </g>
  );
}

// ---------- 蛋宝宝（所有宠物 stage 0 通用） ----------
function Egg({ tint }) {
  return (
    <g>
      <ellipse cx="100" cy="115" rx="48" ry="58" fill={tint} stroke="#fff" strokeWidth="4" />
      <ellipse cx="82" cy="95" rx="10" ry="14" fill="#ffffff" opacity="0.45" />
      <circle cx="118" cy="140" r="7" fill="#ffffff" opacity="0.5" />
      <circle cx="86" cy="152" r="5" fill="#ffffff" opacity="0.5" />
      <circle cx="128" cy="100" r="4" fill="#ffffff" opacity="0.5" />
      <Eyes face="normal" />
      <Blush color="#ffb3c7" />
      <Mouth face="normal" y={128} />
    </g>
  );
}

// ---------- 小兔 ----------
function Bunny({ face, deco }) {
  const c = PETS.bunny;
  return (
    <g>
      {/* 尾巴 */}
      <circle cx="150" cy="142" r="13" fill="#fff" stroke="#f3c6d8" strokeWidth="2" />
      {/* 长耳朵 */}
      <g>
        <ellipse cx="76" cy="42" rx="15" ry="34" fill={c.bodyColor} stroke="#f3c6d8" strokeWidth="3" transform="rotate(-12 76 42)" />
        <ellipse cx="124" cy="42" rx="15" ry="34" fill={c.bodyColor} stroke="#f3c6d8" strokeWidth="3" transform="rotate(12 124 42)" />
        <ellipse cx="76" cy="46" rx="7" ry="20" fill={c.earColor} transform="rotate(-12 76 46)" />
        <ellipse cx="124" cy="46" rx="7" ry="20" fill={c.earColor} transform="rotate(12 124 46)" />
      </g>
      {/* 脚 */}
      <ellipse cx="78" cy="164" rx="15" ry="9" fill={c.bodyColor} stroke="#f3c6d8" strokeWidth="3" />
      <ellipse cx="122" cy="164" rx="15" ry="9" fill={c.bodyColor} stroke="#f3c6d8" strokeWidth="3" />
      {/* 圆滚滚的身体 */}
      <circle cx="100" cy="115" r="52" fill={c.bodyColor} stroke="#f3c6d8" strokeWidth="3" />
      <ellipse cx="100" cy="140" rx="26" ry="20" fill="#fff5f8" />
      {/* 脸 */}
      <Eyes face={face} />
      <Blush color={c.blush} />
      <ellipse cx="100" cy="120" rx="5" ry="4" fill="#ff8fa8" />
      <Mouth face={face} y={126} />
      {deco}
    </g>
  );
}

// ---------- 小猫 ----------
function Cat({ face, deco }) {
  const c = PETS.cat;
  return (
    <g>
      {/* 三角耳朵 */}
      <polygon points="62,80 76,38 96,70" fill={c.bodyColor} stroke="#e8a56b" strokeWidth="3" strokeLinejoin="round" />
      <polygon points="138,80 124,38 104,70" fill={c.bodyColor} stroke="#e8a56b" strokeWidth="3" strokeLinejoin="round" />
      <polygon points="70,70 77,50 89,66" fill={c.earColor} />
      <polygon points="130,70 123,50 111,66" fill={c.earColor} />
      {/* 脚 */}
      <ellipse cx="78" cy="164" rx="15" ry="9" fill={c.bodyColor} stroke="#e8a56b" strokeWidth="3" />
      <ellipse cx="122" cy="164" rx="15" ry="9" fill={c.bodyColor} stroke="#e8a56b" strokeWidth="3" />
      {/* 身体 */}
      <circle cx="100" cy="115" r="52" fill={c.bodyColor} stroke="#e8a56b" strokeWidth="3" />
      {/* 头顶条纹 */}
      <g stroke="#e8a56b" strokeWidth="4" strokeLinecap="round">
        <path d="M88 70 q2 8 0 14" />
        <path d="M100 68 q2 8 0 14" />
        <path d="M112 70 q2 8 0 14" />
      </g>
      {/* 胡须 */}
      <g stroke="#c98d55" strokeWidth="2.5" strokeLinecap="round" opacity="0.8">
        <path d="M38 118 L64 122" /><path d="M38 132 L64 130" />
        <path d="M162 118 L136 122" /><path d="M162 132 L136 130" />
      </g>
      <Eyes face={face} />
      <Blush color={c.blush} />
      <polygon points="94,120 106,120 100,126" fill="#ff8fa8" />
      <Mouth face={face} y={128} />
      {deco}
    </g>
  );
}

// ---------- 小狐狸 ----------
function Fox({ face, deco }) {
  const c = PETS.fox;
  return (
    <g>
      {/* 蓬松大尾巴 */}
      <path d="M142 158 C172 152 192 128 188 96 C174 108 160 112 146 116 Z" fill={c.bodyColor} stroke="#d4691e" strokeWidth="3" strokeLinejoin="round" />
      <path d="M182 100 C188 112 186 124 178 132 C172 122 172 110 174 102 Z" fill="#fff" />
      {/* 尖耳朵 */}
      <polygon points="58,82 70,32 96,68" fill={c.bodyColor} stroke="#d4691e" strokeWidth="3" strokeLinejoin="round" />
      <polygon points="142,82 130,32 104,68" fill={c.bodyColor} stroke="#d4691e" strokeWidth="3" strokeLinejoin="round" />
      <polygon points="67,68 72,46 86,62" fill="#7a3f16" />
      <polygon points="133,68 128,46 114,62" fill="#7a3f16" />
      {/* 脚 */}
      <ellipse cx="78" cy="164" rx="15" ry="9" fill={c.bodyColor} stroke="#d4691e" strokeWidth="3" />
      <ellipse cx="122" cy="164" rx="15" ry="9" fill={c.bodyColor} stroke="#d4691e" strokeWidth="3" />
      {/* 身体 */}
      <circle cx="100" cy="115" r="52" fill={c.bodyColor} stroke="#d4691e" strokeWidth="3" />
      {/* 白色脸颊 + 口鼻 */}
      <ellipse cx="64" cy="132" rx="15" ry="11" fill="#fff" transform="rotate(-15 64 132)" />
      <ellipse cx="136" cy="132" rx="15" ry="11" fill="#fff" transform="rotate(15 136 132)" />
      <ellipse cx="100" cy="132" rx="21" ry="14" fill="#fff" />
      <Eyes face={face} />
      <Blush color={c.blush} />
      <ellipse cx="100" cy="126" rx="6" ry="5" fill="#5b3a29" />
      <Mouth face={face} y={132} />
      {deco}
    </g>
  );
}

// ---------- 装饰：蝴蝶结（stage 3+） ----------
function Bow() {
  return (
    <g transform="translate(138 52)">
      <polygon points="0,0 -20,-12 -20,12" fill="#ff6b9d" stroke="#e14e7f" strokeWidth="2" strokeLinejoin="round" />
      <polygon points="0,0 20,-12 20,12" fill="#ff6b9d" stroke="#e14e7f" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="0" cy="0" r="7" fill="#ff477e" stroke="#e14e7f" strokeWidth="2" />
    </g>
  );
}

// ---------- 装饰：皇冠 + 星光（stage 4） ----------
function Crown() {
  return (
    <g>
      <polygon points="78,34 84,12 94,26 100,8 106,26 116,12 122,34" fill="#ffd93d" stroke="#e8a100" strokeWidth="2.5" strokeLinejoin="round" />
      <circle cx="100" cy="8" r="4" fill="#ff6b9d" />
      {/* 星光 */}
      <g fill="#fff3a0" stroke="#e8a100" strokeWidth="1.5">
        <path d="M40 60 l3 8 8 3 -8 3 -3 8 -3 -8 -8 -3 8 -3 Z" className="sparkle" />
        <path d="M160 70 l2.5 7 7 2.5 -7 2.5 -2.5 7 -2.5 -7 -7 -2.5 7 -2.5 Z" className="sparkle s2" />
        <path d="M150 150 l2.5 7 7 2.5 -7 2.5 -2.5 7 -2.5 -7 -7 -2.5 7 -2.5 Z" className="sparkle s3" />
      </g>
    </g>
  );
}

const EGG_TINT = { bunny: '#ffe9f2', cat: '#ffedda', fox: '#ffe4cf' };

// 阶段缩放：越长大越大只
const STAGE_SCALE = [1, 0.78, 0.92, 1.06, 1.18];

/**
 * 宠物形象主组件
 * @param type bunny | cat | fox
 * @param stage 0-4 成长阶段
 * @param face normal | happy | sleepy
 */
export function PetAvatar({ type, stage, face = 'normal', className = '' }) {
  let body;
  const deco = (
    <>
      {stage >= 3 && stage < 4 && <Bow />}
      {stage >= 4 && <Crown />}
    </>
  );
  if (stage === 0) {
    body = <Egg tint={EGG_TINT[type]} />;
  } else if (type === 'bunny') {
    body = <Bunny face={face} deco={deco} />;
  } else if (type === 'cat') {
    body = <Cat face={face} deco={deco} />;
  } else {
    body = <Fox face={face} deco={deco} />;
  }
  const scale = STAGE_SCALE[stage] || 1;
  return (
    <svg viewBox="0 0 200 200" className={className} role="img" aria-label="宠物">
      <g transform={`translate(100 108) scale(${scale}) translate(-100 -108)`}>
        {body}
      </g>
    </svg>
  );
}
