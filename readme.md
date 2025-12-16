# 🚀 Selfish: Space Edition - Online Multiplayer Game

> A real-time multiplayer web implementation of the popular board game "Selfish: Space Edition", featuring modern web technologies and exciting gameplay.

**🚧 Status: In Active Development**

---

## 📋 Project Overview

**Selfish: Space Edition** is a competitive multiplayer board game where players are astronauts racing to reach a rescue ship in space. This project brings the tabletop experience online, allowing friends to play together in real-time from anywhere.

### 🎮 Game Features (Planned & In Progress)
- [x] Real-time multiplayer using WebSocket
- [x] Room creation and joining system
- [x] User authentication
- [ ] Complete game logic engine
- [ ] Interactive game board UI
- [ ] Card system (Space Cards, Action Cards, Oxygen Cards)
- [ ] Turn-based gameplay with oxygen management
- [ ] Victory/defeat conditions

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript |
| **Frontend** | React 19 |
| **Styling** | TailwindCSS 4 |
| **API Layer** | tRPC |
| **Database** | Prisma ORM |
| **Authentication** | better-auth |
| **Real-time** | WebSocket (ws) |
| **Validation** | Zod |
| **State Management** | TanStack React Query |

---

## 🏗️ Architecture

```
src/
├── app/                 # Next.js App Router pages
│   ├── api/             # API routes (tRPC, auth)
│   ├── game/            # Game board interface
│   ├── lobby/           # Game lobby
│   ├── room/            # Room management
│   └── login/           # Authentication
├── components/          # Reusable UI components
├── lib/
│   ├── game/            # Game logic & state
│   ├── websocket/       # WebSocket client
│   └── auth.ts          # Auth configuration
└── server/              # WebSocket server
```

---

## 🎯 Key Technical Highlights

- **Type-Safe API**: End-to-end type safety with tRPC + Zod validation
- **Real-time Updates**: WebSocket integration for live game state synchronization
- **Modern React**: Leveraging React 19 with Server Components and Suspense
- **Authentication**: Secure user authentication with better-auth
- **Database Design**: Prisma ORM with structured game state persistence

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/[your-username]/selfish-space-web.git

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Generate Prisma client
npx prisma generate

# Run development servers
npm run dev:all
```

### Development Scripts

```bash
npm run dev        # Start Next.js dev server
npm run dev:ws     # Start WebSocket server
npm run dev:all    # Start both servers concurrently
npm run build      # Production build
```

---

## 📝 Development Roadmap

### Phase 1: Foundation ✅
- [x] Project setup with Next.js 16 + TypeScript
- [x] Authentication system
- [x] Database schema with Prisma
- [x] WebSocket server setup

### Phase 2: Core Features 🔄 (Current)
- [ ] Room creation and management
- [ ] Player lobby system
- [ ] Game state initialization

### Phase 3: Gameplay
- [ ] Card deck implementation
- [ ] Turn-based game engine
- [ ] Victory/defeat detection

### Phase 4: Polish
- [ ] Animations and visual effects
- [ ] Sound effects
- [ ] Mobile responsiveness

---

## 🎲 Game Rules Summary

1. **Objective**: Race to reach the rescue ship before running out of oxygen
2. **Turn Structure**: Move → Draw Space Card → Resolve Effects → Play Action Cards
3. **Resources**: Manage oxygen carefully - it's your lifeline!
4. **Cards**: Use Action Cards strategically to help yourself or sabotage others

---

## 📄 License

This project is for personal/educational use only. The original "Selfish: Space Edition" board game is copyright of Big Potato / Ridley's Games.

---

## 👤 Author

**Jiahui** - Full Stack Developer

---

*This project demonstrates proficiency in modern web development, real-time systems, and game logic implementation.*

<!-- Last deployment trigger: 2025-12-15 -->
