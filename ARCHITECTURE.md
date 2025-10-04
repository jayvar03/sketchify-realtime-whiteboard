# Sketchify Architecture

## System Overview

Sketchify is a real-time collaborative whiteboard application using a client-server architecture with WebSocket communication.

```
┌─────────────────┐    WebSocket    ┌─────────────────┐
│   React Client  │ ←──────────────→ │  Node.js Server │
│                 │                 │                 │
│ • Canvas API    │                 │ • Socket.io     │
│ • Recoil State  │                 │ • Room Manager  │
│ • UI Components │                 │ • Event Handler │
└─────────────────┘                 └─────────────────┘
```

## Frontend Architecture

### Core Technologies
- **React 18** - Component-based UI with hooks
- **TypeScript** - Type safety and better DX
- **Recoil** - Atomic state management
- **Canvas API** - High-performance drawing
- **Socket.io Client** - Real-time communication

### State Management
```typescript
// Room State
interface RoomState {
  id: string;
  usersMoves: Map<string, Move[]>;
  movesWithoutUser: Move[];
  myMoves: Move[];
  users: Map<string, User>;
}

// Drawing Options
interface OptionsState {
  lineColor: RGBA;
  fillColor: RGBA;
  lineWidth: number;
  shape: "line" | "rect" | "circle" | "image";
  mode: "draw" | "eraser";
}
```

### Component Structure
```
src/
├── common/
│   ├── components/     # Reusable UI components
│   ├── constants/      # App constants
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Utilities (socket, image optimization)
│   ├── recoil/        # State atoms and selectors
│   └── types/         # TypeScript definitions
├── modules/
│   ├── home/          # Landing page and room creation
│   └── room/          # Collaborative whiteboard
│       ├── components/
│       │   ├── board/     # Canvas, minimap, mouse tracking
│       │   ├── chat/      # Chat system
│       │   └── toolbar/   # Drawing tools
│       ├── hooks/         # Room-specific logic
│       ├── helpers/       # Canvas utilities
│       └── context/       # Room context provider
```

## Backend Architecture

### Server Components
- **Express Server** - HTTP server and static file serving
- **Socket.io** - WebSocket server for real-time events
- **Room Manager** - In-memory room storage and management
- **Event Handlers** - Socket event processing

### Data Structures
```typescript
// Room Storage
interface Room {
  users: Map<string, string>;        // userId -> username
  usersMoves: Map<string, Move[]>;   // userId -> moves
  drawed: Move[];                    // shared moves
}

// Drawing Move
interface Move {
  id: string;
  timestamp: number;
  path: [number, number][];
  options: DrawingOptions;
  img?: { base64: string };
}
```

## Real-time Communication

### Socket Events Flow

#### Room Management
```
Client                    Server
  |                        |
  |-- create_room -------->|
  |<------- created -------|
  |                        |
  |-- join_room ---------->|
  |<------- joined --------|
  |                        |
  |-- joined_room -------->|
  |<------- room ----------|
```

#### Drawing Synchronization
```
User A                    Server                    User B
  |                        |                        |
  |-- draw --------------->|                        |
  |<------ your_move ------|                        |
  |                        |-- user_draw --------->|
  |                        |                        |
```

### Event Types
- **Room Events**: create_room, join_room, leave_room
- **Drawing Events**: draw, undo, clear_canvas
- **User Events**: mouse_move, new_user, user_disconnected
- **Chat Events**: send_msg, new_msg

## Canvas System

### Rendering Pipeline
1. **Clear Canvas** - Reset drawing surface
2. **Draw Background** - Render grid/background
3. **Sort Moves** - Order by timestamp
4. **Render Moves** - Draw each move sequentially
5. **Update Minimap** - Sync minimap view

### Drawing Optimization
- **requestAnimationFrame** - Smooth rendering
- **Canvas Context Reuse** - Minimize context creation
- **Path Optimization** - Efficient line drawing
- **Image Caching** - Reuse loaded images

## Security Model

### Input Validation
- Username: 1-50 characters, no HTML
- Room ID: 1-10 characters, alphanumeric
- File uploads: 10MB limit, image types only
- Socket events: Type and structure validation

### Rate Limiting
- Drawing events: Throttled per user
- Connection attempts: Limited per IP
- File uploads: Size and frequency limits

### Data Protection
- No persistent storage of drawings
- Session-based data only
- XSS prevention in user inputs
- Secure WebSocket connections

## Performance Considerations

### Frontend Optimizations
- Canvas rendering with requestAnimationFrame
- Efficient state updates with Recoil
- Image optimization and lazy loading
- Memory leak prevention
- Event listener cleanup

### Backend Optimizations
- In-memory storage for fast access
- Efficient room cleanup
- Event throttling and validation
- Minimal data transmission

### Network Efficiency
- Only essential data transmitted
- Socket.io compression enabled
- Optimized move data structures
- Batched updates where possible

## Scalability Design

### Current Limitations
- In-memory storage (single server)
- Room capacity: 12 users
- No persistent data storage

### Scaling Options
- **Horizontal Scaling**: Multiple server instances
- **Load Balancing**: Distribute connections
- **Database Integration**: Persistent room storage
- **Redis**: Session management and caching
- **CDN**: Static asset delivery

## Development Workflow

### Build Process
- **Vite** - Fast development and building
- **TypeScript** - Compile-time type checking
- **ESLint** - Code quality and consistency
- **Concurrent Development** - Client and server together

### Code Quality
- TypeScript strict mode
- Comprehensive error handling
- Memory leak prevention
- Performance monitoring
- Security best practices
