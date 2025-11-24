# Selfish: Space Edition – Web 局域网版开发清单

> 🎯 目标：做一个 **非商业、只给自己和朋友在局域网里玩** 的《Selfish: Space Edition》网页版。
> 
> ✅ 原则：先把 **规则正确 + 能完整跑一局**，再考虑动画、美术、优化。

---

## 0. 项目基本信息

- 项目名（可改）：`selfish-space-web`
- 用途：
  - 仅限本人与熟人局域网游玩
  - 不对公网开放，不放公开 Demo
- 版权声明（必须在 README 里写）：
  - 本项目为 **非官方粉丝自制实现**
  - Selfish 系列桌游及原始美术版权归 **Big Potato / Ridley’s Games** 所有
  - 本项目不附带原版卡牌扫描或官方插画

建议在项目根目录建：`README.md` + 本清单：`DEV_CHECKLIST.md`。

---

## 1. 技术栈 & 目录结构（先决定）

### 1.1 技术选型（推荐）

- 前端：
  - React + TypeScript
  - Vite（或 Next.js，如果你已经很熟）
  - UI：Tailwind CSS（快速出界面）
- 后端：
  - Node.js + TypeScript
  - WebSocket：`socket.io`（房间 + 实时状态广播）
- 部署方式：
  - 本地运行 / LAN：前后端都在你电脑上跑，朋友通过局域网 IP 访问

### 1.2 推荐基础目录结构

```text
selfish-space-web/
├── README.md
├── DEV_CHECKLIST.md          # 就是这份文件
├── server/                   # Node + socket.io
│   ├── src/
│   │   ├── index.ts          # 入口
│   │   ├── game/
│   │   │   ├── types.ts      # 游戏相关类型
│   │   │   ├── cards-config.ts
│   │   │   ├── engine.ts     # 回合逻辑、效果结算
│   │   │   └── state.ts      # 房间 & 游戏状态管理
│   │   └── sockets.ts        # socket.io 事件绑定
│   └── package.json
└── client/                   # React 前端
    ├── src/
    │   ├── main.tsx
    │   ├── App.tsx
    │   ├── pages/
    │   │   ├── HomePage.tsx
    │   │   └── RoomPage.tsx
    │   ├── components/
    │   │   ├── GameBoard.tsx
    │   │   ├── PlayerPanel.tsx
    │   │   ├── HandArea.tsx
    │   │   └── CardView.tsx
    │   ├── game/
    │   │   ├── types.ts      # 前端复用的类型（可与 server 共用）
    │   │   └── api.ts        # 与 socket 的交互封装
    │   └── styles/
    └── package.json
```

---

## 2. 功能模块清单（从必需到可选）

### 2.1 最小可玩核心（MVP）

**只要实现下面这些，就能玩一整局：**

- [ ] 玩家可以：创建房间 / 加入房间
- [ ] 房间内可看到：
  - [ ] 房间号
  - [ ] 玩家列表 + 昵称
- [ ] 房主可以点击「开始游戏」
- [ ] 系统初始化：
  - [ ] 生成太空路线（起点 → 飞船终点）
  - [ ] 建立 Space Deck（太空卡牌堆）
  - [ ] 建立 Game Deck（行动牌 + 氧气牌）
  - [ ] 给每个玩家发初始氧气牌（例如：4 张单氧 + 1 张双氧）
- [ ] 回合流程：
  - [ ] 当前玩家能：
    - [ ] 点击「移动」：前进一格，翻一张太空卡
    - [ ] 系统自动应用太空卡效果（例如：扣氧、退回、抽牌等）
  - [ ] 每前进一次，若规则需要则自动消耗 1 单位氧气
  - [ ] 回合结束 → 轮到下一位存活玩家
- [ ] 胜负判定：
  - [ ] 有玩家到达飞船终点 → 此玩家胜利
  - [ ] 所有玩家死亡 → 群体灭亡结局
- [ ] 结束画面：显示赢家 / 全灭信息 + 简单战报（可选）

### 2.2 二级功能（体验变好）

- [ ] 手牌操作：
  - [ ] 玩家能看到自己手牌列表
  - [ ] 点击某张行动牌 → 查看描述 → 确认「打出」
- [ ] 行动牌效果（先挑简单的实现）：
  - [ ] `Rocket Booster`：当前玩家前进一格，不消耗氧气
  - [ ] `Laser Blast`：选择一名玩家后退一格
  - [ ] `Shield`：对自己生效一次，抵消一次别人的攻击
- [ ] UI 提示：
  - [ ] 当前是哪个玩家回合
  - [ ] 最近一次事件描述（日志简版）
  - [ ] 氧气不足 / 玩家死亡提示

### 2.3 未来可选功能（可以往后拖）

- [ ] 所有行动牌 & 太空牌的完整效果
- [ ] 观战视角（死亡玩家改为观战）
- [ ] 动画（卡牌翻转、移动过场）
- [ ] 自定义规则（修改初始氧气、禁用某些卡等）

---

## 3. 核心游戏规则抽象（程序视角）

### 3.1 概念对象

- 玩家（Player）
- 宇航员位置（Position：整数格子，从 0 起点 → N 飞船）
- 氧气值 / 氧气牌
- 手牌（Hand：一组 Card）
- 牌堆（Deck）：
  - Space Deck（太空事件）
  - Game Deck（行动+氧气牌）
- 游戏状态（GameState）：
  - 玩家数组
  - 当前玩家索引
  - 牌堆状态
  - 舰船位置（终点格）
  - 太空轨道上的已翻太空卡

### 3.2 TypeScript 类型（简化草稿）

```ts
export type PlayerStatus = "ALIVE" | "DEAD";

export interface Player {
  id: string;
  name: string;
  position: number;      // 在轨道上的格子编号
  oxygen: number;        // 剩余氧气总量
  hand: string[];        // 手牌中卡牌 id 列表
  status: PlayerStatus;
}

export interface GameState {
  roomId: string;
  players: Player[];
  currentPlayerIndex: number;
  phase: "LOBBY" | "PLAYING" | "FINISHED";
  winnerId?: string;
  trackLength: number;       // 终点格编号
  spaceDeck: string[];       // 未翻太空卡 id 列表
  spaceDiscard: string[];
  gameDeck: string[];        // 行动+氧气牌未抽牌堆
  gameDiscard: string[];
  revealedSpaceCards: Record<number, string>; // 某个位置上已翻的太空卡
}
```

---

## 4. 网络通信设计（socket 事件）

### 4.1 客户端 → 服务器

- [ ] `room:create`
  - payload：{ playerName }
- [ ] `room:join`
  - payload：{ roomId, playerName }
- [ ] `game:start`
  - 只有房主可以发
- [ ] `game:action:move`
  - 当前玩家点击「移动」
- [ ] `game:action:playCard`
  - payload：{ cardId, targetPlayerId? }

### 4.2 服务器 → 客户端（广播）

- [ ] `room:state`
  - 房间当前状态（玩家列表、是否已开始）
- [ ] `game:state`
  - 完整的游戏状态（但要注意：
    - 不要把别人的手牌内容发给所有人
    - 可以为每个玩家生成「只属于自己视角」的状态）
- [ ] `game:log`
  - 文本事件，如：
    - "Alice moved forward and drew COSMIC_RADIATION"
    - "Bob played LASER_BLAST on Carol"
- [ ] `game:ended`
  - payload：{ winnerId?, reason }

---

## 5. UI 设计最小版

### 5.1 页面导航

- `/` 首页
  - [ ] 填入昵称
  - [ ] 按钮：创建房间 / 加入房间（输入 roomId）
- `/room/:roomId` 游戏页
  - [ ] 上方：房间号 + 当前状态（LOBBY / PLAYING / FINISHED）
  - [ ] 左侧：宇航员轨道
    - 竖直或水平的格子，显示每个玩家的当前位置
  - [ ] 右侧：玩家面板
    - 每个玩家：昵称、氧气值、存活/死亡
  - [ ] 中间：当前事件区域
    - 当前翻出的太空卡 / 最近一次操作说明
  - [ ] 底部：当前玩家手牌
    - 一组简洁卡片按钮：卡名 + 简短描述

### 5.2 UI 优先级

1. [ ] 先画出：玩家列表 + 轨道 + 手牌区（静态假数据）
2. [ ] 接上 socket，能看到别人加入房间
3. [ ] 实现「移动」按钮 → 轨道上位置变化 + 太空卡效果文本
4. [ ] 再逐步加行动牌按钮交互

---

## 6. 美术与素材使用策略

- **第一版策略：**
  - [ ] 氧气卡：用简单 icon（比如一个圆圈 + 数字）
  - [ ] 行动卡 / 太空卡：用纯色背景 + 文本
- 不做：
  - [ ] 不直接嵌入官方卡牌扫描
  - [ ] 不使用官方 logo
- 如果你日后想更好看：
  - [ ] 自己画矢量 icon / 小插画
  - [ ] 或用 AI 画风格不同但功能相同的图标

---

## 7. 实际开发步骤（建议顺序）

### Step 1 – 初始化项目

- [ ] 建 Git 仓库
- [ ] 在根目录放：`README.md` + `DEV_CHECKLIST.md`（本文件）
- [ ] 在 `client/` 用 Vite + React + TS 初始化
- [ ] 在 `server/` 初始化 Node + TS 项目

### Step 2 – socket 通信雏形

- [ ] server：启动一个基本的 socket.io 服务器
- [ ] client：连接服务器，能在浏览器控制台打印“已连接”
- [ ] 实现最简单的 `room:create` / `room:join` / `room:state`

### Step 3 – 游戏状态模型 & 初始化

- [ ] 在 server 里写好：`GameState` / `Player` / `Card` 类型
- [ ] 写 `cards-config.ts`：填好各牌的数量 & 基本描述
- [ ] 实现 `startGame(roomId)`：生成初始 GameState

### Step 4 – 回合：移动 + 太空卡

- [ ] 添加 `game:action:move`
  - [ ] 校验：是当前玩家才能移动
  - [ ] 玩家位置 +1
  - [ ] 从 Space Deck 抽一张卡 → 应用效果
  - [ ] 按规则扣氧气 / 抽牌 / 退格
  - [ ] 检查玩家是否死亡 / 是否胜利
  - [ ] 广播新的 `game:state`

### Step 5 – UI 联动

- [ ] 前端 `RoomPage`：
  - [ ] 显示玩家列表 & 轨道格子 & 手牌（先用假数据）
- [ ] 把 `game:state` 映射到 UI：
  - [ ] 每个玩家的小头像/条
  - [ ] 格子上显示他们的位置
  - [ ] 当前玩家底部显示「移动」按钮

### Step 6 – 加入几张行动牌

- [ ] 在后端实现 2~3 张行动牌逻辑：
  - [ ] `Rocket Booster`
  - [ ] `Laser Blast`
  - [ ] `Shield`
- [ ] 前端在手牌列表里添加：
  - 点击卡片 → 发送 `game:action:playCard`

### Step 7 – 打磨体验 & 填完整规则

- [ ] 补全剩余的行动牌 / 太空牌效果
- [ ] 添加错误提示（不合法操作时）
- [ ] 添加简单的事件日志区

---

## 8. 你现在可以做的第一件事

1. 把这个文件保存为：`DEV_CHECKLIST.md`（已完成 🎉）  
2. 建一个新项目文件夹 `selfish-space-web`，把它放进去  
3. 初始化 `client/` 和 `server/` 两个子项目  
4. 先只做：房间创建 + 玩家加入 + 打印假游戏状态  
5. 完成后，再回来勾选上面的步骤，一步一步往下推进

祝你做出自己的宇宙背刺版 Selfish！🚀🌌  
