# Practice Flow - Guitar Practice Analytics

A specialized practice tracker for guitarists that combines simple time logging with guitar-specific analytics. Track your practice sessions, build streaks, and get insights into your practice habits.

## Features

### 🎯 **Practice Timer**
- Real-time practice session timer with start/stop/pause controls
- Session state persistence during browser refresh
- Visual feedback and completion notifications

### 📊 **Progress Analytics**
- Current practice streak tracking
- Weekly and monthly practice totals
- Visual charts showing skill focus distribution
- Daily practice patterns over the past week
- Weekly goal tracking with progress indicators

### 🎸 **Guitar-Specific Skills**
- Track practice by skill: Scales, Chords, Songs, Technique, Theory, Improvisation
- Skill distribution analysis to identify focus areas
- Tagged sessions with skill combinations

### 📱 **Mobile-Optimized**
- Touch-friendly interface designed for use during practice
- Responsive design works on all screen sizes
- Fast session logging in under 15 seconds

### 🔒 **Privacy-First**
- All data stored locally in your browser
- No accounts, tracking, or external services required
- Import/export functionality for backup

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- Modern web browser

### Installation

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd practice-flow
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to `http://localhost:3000`

4. **Start practicing:**
   - Click "Start Practice" to begin a timed session
   - Or manually log sessions with duration and skills
   - View progress in the Dashboard tab
   - Browse history in the History tab

### Building for Production

```bash
npm run build
npm run preview
```

## Usage Guide

### Recording Practice Sessions

**Option 1: Live Timer**
1. Click "Start Practice" on the Timer tab
2. Practice your guitar
3. Click "Finish" when done
4. Select skills practiced and add notes
5. Save the session

**Option 2: Manual Entry**
1. Enter duration manually
2. Select skills practiced
3. Add optional notes about your session
4. Save the session

### Understanding Your Progress

**Dashboard Overview:**
- **Streak**: Consecutive days with practice sessions
- **Weekly Total**: Total minutes practiced this week
- **Monthly Total**: Total minutes practiced this month
- **Weekly Goal**: Progress toward 5-hour weekly goal (customizable)

**Charts:**
- **Skill Focus**: Pie chart showing time distribution across skills
- **This Week**: Bar chart showing daily practice minutes

**Recent Sessions**: Latest 5 sessions with duration, skills, and notes

### Managing Sessions

**History Tab:**
- View all practice sessions chronologically
- Filter by specific skills
- Sort by date or duration
- Delete sessions if needed
- See running totals for filtered sessions

## Technical Details

### Tech Stack
- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and building
- **Styling**: Tailwind CSS for responsive design
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React for consistent iconography

### Data Storage
- **Local Storage**: All data persists in browser localStorage
- **Automatic Backup**: Data survives browser restarts
- **Quota Management**: Automatic cleanup if storage quota exceeded

### Performance
- **Session Logging**: Completes in <2 seconds
- **Chart Rendering**: Optimized for smooth interaction
- **Mobile Performance**: Touch-friendly with haptic feedback

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Development

### Project Structure

```
src/
├── components/           # React components
│   ├── Timer.tsx        # Practice session timer
│   ├── SessionLogger.tsx # Session entry form
│   ├── Dashboard.tsx    # Progress overview
│   ├── ProgressCharts.tsx # Data visualizations
│   └── SessionHistory.tsx # Historical sessions
├── utils/               # Utility functions
│   ├── storage.ts      # localStorage helpers
│   ├── timeUtils.ts    # Time formatting
│   └── analytics.ts    # Progress calculations
├── types/              # TypeScript interfaces
│   └── index.ts        # Type definitions
└── App.tsx            # Main application
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Data Schema

```typescript
interface PracticeSession {
  id: string;
  date: string; // ISO string
  duration: number; // minutes
  skills: Skill[];
  notes?: string;
}

type Skill = 'scales' | 'chords' | 'songs' | 'technique' | 'theory' | 'improvisation';
```

## Customization

### Weekly Goal
The default weekly goal is 300 minutes (5 hours). To customize:
1. Open `src/components/Dashboard.tsx`
2. Change the `weeklyGoal` constant
3. Rebuild the app

### Skill Categories
To modify available skills:
1. Update the `Skill` type in `src/types/index.ts`
2. Update `SKILL_OPTIONS` arrays in components
3. Update `SKILL_COLORS` in `ProgressCharts.tsx`

### Color Theme
Custom colors are defined in `tailwind.config.js`:
- Primary (blue): Used for main actions and charts
- Accent (amber): Used for highlights and secondary elements

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Run tests: `npm run lint`
5. Commit changes: `git commit -m 'Add feature'`
6. Push to branch: `git push origin feature-name`
7. Submit a pull request

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues or questions, please open a GitHub issue with:
- Browser version and operating system
- Steps to reproduce the problem
- Expected vs actual behavior

---

**Practice consistently. Track progress. Improve daily.** 🎸