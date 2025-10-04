# 🎨 Sketchify - Real-time Collaborative Whiteboard

**Sketchify** is a simple real-time collaborative whiteboard application that enables teams to draw, brainstorm, and communicate together seamlessly. Built with modern web technologies including React, TypeScript, and Socket.io, it delivers instant synchronization across multiple users and devices.

![React](https://img.shields.io/badge/React-18-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue) ![Socket.io](https://img.shields.io/badge/Socket.io-4.6-green) ![Node.js](https://img.shields.io/badge/Node.js-18+-brightgreen)

## ✨ Key Features

### 🎨 Drawing & Design
- **Multi-tool Support** - Pencil, rectangle, circle, eraser with customizable colors and line widths
- **Real-time Sync** - See other users' drawings instantly as they create
- **Canvas Controls** - Undo/redo, pan, zoom, and clear functionality
- **Image Integration** - Upload and position images on the canvas
- **Export Options** - Download finished work as high-quality PNG files

### 👥 Collaboration
- **Multi-user Rooms** - Support for up to 12 users per session
- **Live Chat System** - Built-in messaging for team communication
- **User Presence** - Visual indicators showing active collaborators
- **Room Management** - Easy create/join system with unique room IDs

### 📱 Cross-Platform
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Touch Support** - Native touch drawing for mobile devices
- **Modern UI** - Clean, intuitive interface built with Tailwind CSS

## 🚀 Quick Start

### Development Setup
```bash
# Clone repository
git clone https://github.com/jayvar03/sketchify-realtime-whiteboard.git
cd sketchify

# Install dependencies
npm install

# Start development (runs both client and server)
npm run dev
```

Visit `http://localhost:3000` to start collaborating!

### Production Deployment
```bash
# Build for production
npm run build

# Start production server (single URL for frontend + backend)
npm start
```

Production server runs on port 3001 and serves both frontend and backend.

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern UI framework with hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Recoil** - State management
- **Vite** - Fast build tool

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web server framework
- **Socket.io** - Real-time communication
- **TypeScript** - Type-safe server code

## 📁 Project Architecture

```
sketchify/
├── src/                    # Frontend application
│   ├── common/            # Shared utilities & components
│   │   ├── components/    # Reusable UI components
│   │   ├── constants/     # App constants
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility functions
│   │   ├── recoil/        # State management
│   │   └── types/         # TypeScript definitions
│   ├── modules/           # Feature modules
│   │   ├── home/          # Landing page & room management
│   │   └── room/          # Main whiteboard interface
│   └── App.tsx            # Root component
├── server/                # Backend application
│   └── index.ts           # Express + Socket.io server
├── dist/                  # Production build output
└── public/                # Static assets
```

## 🎯 How to Use

### Getting Started
1. **Create Room** - Enter your username and click "Create New Room"
2. **Share Room** - Copy the room ID and share with team members
3. **Join Room** - Others enter username and room ID to join
4. **Start Drawing** - Use the toolbar to select tools and start collaborating

### Drawing Tools
- **Pencil Tool** - Freehand drawing with customizable colors and width
- **Shape Tools** - Create perfect rectangles and circles
- **Eraser Tool** - Remove unwanted drawings
- **Color Picker** - Full spectrum with transparency support
- **Line Width** - Adjustable brush sizes

### Collaboration Features
- **Real-time Drawing** - See teammates draw in real-time
- **Live Chat** - Click chat icon to open messaging panel
- **User List** - See who's currently in the room
- **Canvas Sharing** - Everyone sees the same canvas state

### Keyboard Shortcuts
- `Ctrl + Drag` - Pan around the canvas
- `Ctrl + Z` - Undo last action
- `Ctrl + Y` - Redo last undone action

## 🚀 Deployment Options

### Traditional Server
```bash
# On your server
npm run build
npm start
# Access via http://your-domain:3001
```

## ⚙️ Configuration

### Environment Variables
```env
NODE_ENV=production
PORT=3001
```

### Customization Options
- **Canvas Size** - Edit `src/common/constants/canvasSize.ts`
- **User Limit** - Modify room capacity in `server/index.ts`
- **CORS Settings** - Configure allowed origins in server setup

## 🔧 Development Scripts

```bash
npm run dev          # Start development mode (client + server)
npm run dev:client   # Start only frontend (port 3000)
npm run dev:server   # Start only backend (port 3001)
npm run build        # Build for production
npm run build:client # Build only frontend
npm run build:server # Build only backend
npm start            # Start production server
```

## 🐛 Troubleshooting

**Port Conflicts:**
```bash
# Windows
taskkill /F /IM node.exe
# macOS/Linux
killall node
```

**Build Issues:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Connection Problems:**
- Ensure firewall allows ports 3000/3001
- Check CORS configuration for production
- Verify Socket.io connection in browser console

## 📋 Requirements

- **Node.js** 18 or higher
- **npm** or **yarn** package manager
- **Modern browser** (Chrome, Firefox, Safari, Edge)

## 📄 License

MIT License

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 🙏 Acknowledgments

Built with modern web technologies and inspired by collaborative design tools. Thanks to the open-source community for the amazing libraries and frameworks.

---

**🎨 Made with ❤️ for seamless creative collaboration**
