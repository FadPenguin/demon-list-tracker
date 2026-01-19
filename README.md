# Demon List Tracker

A real-time, collaborative tracker for Geometry Dash extreme demon completions. Built with React, Supabase, and Netlify.

## Features

- 🎮 Track progress for multiple players (Judah, Whitman, Jack)
- 📊 Main list (top 25) and extended list
- 🔒 Point locking when levels reach 100%
- 💾 Real-time database syncing with Supabase
- 🌐 Live updates across all devices
- 📱 Mobile responsive design

## Tech Stack

- **Frontend**: React 18 with Vite
- **Database**: Supabase (PostgreSQL)
- **Hosting**: Netlify
- **Real-time**: Supabase Realtime subscriptions
- **UI**: Custom CSS with Tailwind-like utilities

## Deployment Instructions

### For Beginners (Ages 12+)

See `DEPLOYMENT-GUIDE.txt` for a complete, kid-friendly walkthrough.

### Quick Start

See `QUICK-START.txt` for experienced developers.

### Prerequisites

- GitHub account
- Supabase account
- Netlify account

### Setup Steps

1. **Create Supabase Project**
   - Go to supabase.com
   - Create new project
   - Run `supabase-setup.sql` in SQL Editor
   - Save your Project URL and anon key

2. **Upload to GitHub**
   - Create new repository
   - Upload all project files

3. **Deploy to Netlify**
   - Import from GitHub
   - Add environment variables:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
   - Build command: `npm run build`
   - Publish directory: `dist`

4. **Done!**
   - Your site is live
   - Share the URL with friends

## Environment Variables

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## Local Development

```bash
# Install dependencies
npm install

# Create .env file with your Supabase credentials
echo "VITE_SUPABASE_URL=your-url" > .env
echo "VITE_SUPABASE_ANON_KEY=your-key" >> .env

# Run development server
npm run dev

# Build for production
npm run build
```

## Database Schema

### Tables

- **levels** - Top 25 demons
- **extended_levels** - Demons ranked 26+
- **banked_points** - Points from deleted levels

### Fields

- `rank` - Current ranking position
- `name` - Level name
- `creator` - Creator name
- `gddl_rank` - GDDL difficulty ranking
- `points` - Point value
- `judah`, `whitman`, `jack` - Player progress (0-100)
- `judah_locked`, `whitman_locked`, `jack_locked` - Locked point values

## How It Works

1. Data is stored in Supabase PostgreSQL database
2. Real-time subscriptions push updates to all connected clients
3. When a player reaches 100%, their points are locked
4. Deleting a level banks the points for all players
5. GDDL rank determines position in list (higher = harder)

## Features Explained

### Point Locking
When a level reaches 100% completion, the point value is locked. Even if the level's points change later, the player keeps their original points.

### Banked Points
When a level is deleted, any earned points (locked or from 100% completion) are "banked" and continue to count toward the player's total.

### Real-time Sync
Changes made by any user are instantly visible to all other users viewing the site. No refresh needed!

## Troubleshooting

**Data not saving?**
- Check Supabase connection in browser console
- Verify environment variables are set correctly
- Ensure SQL script ran successfully

**Changes not appearing?**
- Check real-time subscriptions are active
- Hard refresh (Ctrl+Shift+R)
- Check browser console for errors

**Build failed?**
- Verify all files are in GitHub
- Check build logs in Netlify
- Ensure environment variables are set

## Educational Value

This project teaches:
- React hooks and state management
- Database design (PostgreSQL)
- REST API interactions
- Real-time data synchronization
- Environment variables and security
- Git/GitHub version control
- Web deployment (CI/CD)
- Responsive design

Perfect for learning full-stack web development!

## License

Free to use and modify. Built as an educational project.

## Credits

Built with love for the Geometry Dash community! 🎮

---

**Want to customize?**
- Change player names in the code
- Adjust point values
- Add more players
- Customize colors and styling
- Add authentication
- Create leaderboards

The possibilities are endless! 🚀
