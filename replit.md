# PhishGuard - Кибер Защита Тренинг

## Overview
PhishGuard is an interactive cybersecurity training game designed to teach users how to recognize and respond to phishing attacks, scams, and social engineering attempts. The application is entirely in Bulgarian and uses realistic scenarios to educate users about online security threats.

## Project Type
- **Frontend**: React 18 with Vite
- **Styling**: TailwindCSS
- **Icons**: Lucide React
- **Language**: Bulgarian (BG)

## Project Structure
```
├── src/
│   ├── App.jsx          # Main application component with game logic
│   ├── main.jsx         # React entry point
│   └── index.css        # TailwindCSS imports and global styles
├── index.html           # HTML template
├── vite.config.js       # Vite configuration (port 5000, host 0.0.0.0)
├── tailwind.config.js   # TailwindCSS configuration
├── postcss.config.js    # PostCSS configuration
└── package.json         # Dependencies and scripts
```

## Game Features
- **Interactive Scenarios**: 4 different scam scenarios (SMS phishing, social engineering, investment scams, tech support scams)
- **Difficulty Levels**: Easy, Medium, Hard scenarios
- **Game Mechanics**:
  - Budget/HP system (starts at 100%)
  - XP/Reputation system (goal: 2000 XP to become "Кибер Страж")
  - Hint system (clue feature)
  - Multiple choice responses to threats
- **Educational Feedback**: Immediate feedback on choices with explanations

## Development
The project uses Vite as the build tool and development server.

### Running Locally
```bash
npm run dev
```
This starts the development server on `http://0.0.0.0:5000`

### Building for Production
```bash
npm run build
```
Builds the optimized production bundle to the `dist/` directory.

## Configuration
- **Port**: 5000 (required for Replit webview)
- **Host**: 0.0.0.0 (allows external connections)
- **HMR**: Configured for port 5000

## Deployment
The application is configured for Replit's autoscale deployment:
- Build command: `npm run build`
- Run command: `npx vite preview --host 0.0.0.0 --port 5000`

## Recent Changes
- **2025-11-12**: Initial setup and responsive design improvements
  - Created Vite + React project structure
  - Configured TailwindCSS with responsive breakpoints
  - Set up development workflow on port 5000 with proper HMR WebSocket configuration
  - Configured deployment settings
  - **Responsive Design Enhancements**:
    - Added mobile-first responsive layout (sm, md breakpoints)
    - Optimized chat message display with proper text wrapping and scrolling
    - Increased chat area padding (280px-320px) to ensure messages are fully visible above interaction panel
    - Made all UI elements responsive (buttons, text sizes, spacing)
    - Fixed viewport height constraints for proper display on all screen sizes
    - Added breakpoint-specific text sizes and spacing for better mobile experience

## Technical Notes
- The app is a single-page application with no backend
- All scenario data is stored in a JavaScript array within App.jsx
- No database or API calls required
- Fully client-side rendered
- **Responsive Design**: Uses Tailwind CSS breakpoints (sm: 640px, md: 768px) for mobile/tablet/desktop compatibility
- **Layout**: Fixed viewport height (100vh) with proper overflow handling to prevent scroll issues
