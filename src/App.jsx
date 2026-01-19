import React, { useState, useEffect } from 'react';
import { Plus, X, List, RefreshCw } from 'lucide-react';
import { supabase } from './supabaseClient';

const DemonListTracker = () => {
  const [levels, setLevels] = useState([]);
  const [extendedList, setExtendedList] = useState([]);
  const [currentView, setCurrentView] = useState('main');
  const [editingCell, setEditingCell] = useState(null);
  const [players, setPlayers] = useState(['judah', 'whitman', 'jack']);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLevelData, setNewLevelData] = useState({
    name: '',
    creator: '',
    gddlRank: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
    
    // Subscribe to real-time changes - single reload for all changes
    const levelsChannel = supabase
      .channel('levels-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'levels' },
        () => loadData()
      )
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'extended_levels' },
        () => loadData()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(levelsChannel);
    };
  }, []);

  const loadLevels = async () => {
    const { data, error } = await supabase
      .from('levels')
      .select('*')
      .order('rank', { ascending: true });
    
    if (error) {
      console.error('Error loading levels:', error);
      return;
    }
    
    if (data && data.length > 0) {
      setLevels(data);
      // Extract player names from the first level's columns
      const firstLevel = data[0];
      const detectedPlayers = Object.keys(firstLevel).filter(key => 
        !['id', 'rank', 'name', 'creator', 'gddl_rank', 'points', 'created_at'].includes(key) &&
        !key.endsWith('_locked')
      );
      if (detectedPlayers.length > 0) {
        setPlayers(detectedPlayers);
      }
    } else {
      await initializeDefaultLevels();
    }
  };

  const loadExtendedLevels = async () => {
    const { data, error } = await supabase
      .from('extended_levels')
      .select('*')
      .order('rank', { ascending: true });
    
    if (error) {
      console.error('Error loading extended levels:', error);
      return;
    }
    
    setExtendedList(data || []);
  };

  const loadData = async () => {
    setLoading(true);
    await Promise.all([
      loadLevels(),
      loadExtendedLevels()
    ]);
    setLoading(false);
  };

  const initializeDefaultLevels = async () => {
    const defaultLevels = [
      { rank: 1, name: 'Tartarus', creator: 'Riot', gddl_rank: 25.56, points: 100, judah: 0, whitman: 0, jack: 0, judah_locked: null, whitman_locked: null, jack_locked: null },
      { rank: 2, name: 'Acheron', creator: 'Ryamu', gddl_rank: 24.89, points: 95, judah: 0, whitman: 0, jack: 0, judah_locked: null, whitman_locked: null, jack_locked: null },
      { rank: 3, name: 'Silent clubstep', creator: 'Sailent', gddl_rank: 23.45, points: 90, judah: 0, whitman: 0, jack: 0, judah_locked: null, whitman_locked: null, jack_locked: null },
      { rank: 4, name: 'Zodiac', creator: 'Xaro', gddl_rank: 22.10, points: 85, judah: 0, whitman: 0, jack: 0, judah_locked: null, whitman_locked: null, jack_locked: null },
      { rank: 5, name: 'Sakupen Circles', creator: 'Diamond', gddl_rank: 21.78, points: 80, judah: 0, whitman: 0, jack: 0, judah_locked: null, whitman_locked: null, jack_locked: null },
      { rank: 6, name: 'Slaughterhouse', creator: 'Icedcave', gddl_rank: 21.23, points: 78, judah: 0, whitman: 0, jack: 0, judah_locked: null, whitman_locked: null, jack_locked: null },
      { rank: 7, name: 'Abyss of Darkness', creator: 'Exen', gddl_rank: 20.67, points: 76, judah: 0, whitman: 0, jack: 0, judah_locked: null, whitman_locked: null, jack_locked: null },
      { rank: 8, name: 'Tidal Wave', creator: 'OniLink', gddl_rank: 20.12, points: 74, judah: 0, whitman: 0, jack: 0, judah_locked: null, whitman_locked: null, jack_locked: null },
      { rank: 9, name: 'Limbo', creator: 'Mindcap', gddl_rank: 19.58, points: 72, judah: 0, whitman: 0, jack: 0, judah_locked: null, whitman_locked: null, jack_locked: null },
      { rank: 10, name: 'Avernus', creator: 'Xanii', gddl_rank: 19.05, points: 70, judah: 0, whitman: 0, jack: 0, judah_locked: null, whitman_locked: null, jack_locked: null },
      { rank: 11, name: 'Kocmoc', creator: 'Ggb0y', gddl_rank: 18.54, points: 68, judah: 0, whitman: 0, jack: 0, judah_locked: null, whitman_locked: null, jack_locked: null },
      { rank: 12, name: 'Firework', creator: 'Trick', gddl_rank: 18.04, points: 66, judah: 0, whitman: 0, jack: 0, judah_locked: null, whitman_locked: null, jack_locked: null },
      { rank: 13, name: 'Nullscapes', creator: 'Hydrogen', gddl_rank: 17.56, points: 64, judah: 0, whitman: 0, jack: 0, judah_locked: null, whitman_locked: null, jack_locked: null },
      { rank: 14, name: 'Aerial Gleam', creator: 'Luqualizer', gddl_rank: 17.09, points: 62, judah: 0, whitman: 0, jack: 0, judah_locked: null, whitman_locked: null, jack_locked: null },
      { rank: 15, name: 'Kyouki', creator: 'Maceira', gddl_rank: 16.64, points: 60, judah: 0, whitman: 0, jack: 0, judah_locked: null, whitman_locked: null, jack_locked: null },
      { rank: 16, name: 'Yatagarasu', creator: 'TrusTa', gddl_rank: 16.20, points: 58, judah: 0, whitman: 0, jack: 0, judah_locked: null, whitman_locked: null, jack_locked: null },
      { rank: 17, name: 'Bloodbath', creator: 'Riot', gddl_rank: 15.78, points: 56, judah: 0, whitman: 0, jack: 0, judah_locked: null, whitman_locked: null, jack_locked: null },
      { rank: 18, name: 'Arcturus', creator: 'Maxfs919', gddl_rank: 15.37, points: 54, judah: 0, whitman: 0, jack: 0, judah_locked: null, whitman_locked: null, jack_locked: null },
      { rank: 19, name: 'Cataclysm', creator: 'Ggb0y', gddl_rank: 14.98, points: 52, judah: 0, whitman: 0, jack: 0, judah_locked: null, whitman_locked: null, jack_locked: null },
      { rank: 20, name: 'Sonic Wave', creator: 'Cyclic', gddl_rank: 14.60, points: 50, judah: 0, whitman: 0, jack: 0, judah_locked: null, whitman_locked: null, jack_locked: null },
      { rank: 21, name: 'Phobos', creator: 'KrmaL', gddl_rank: 14.24, points: 48, judah: 0, whitman: 0, jack: 0, judah_locked: null, whitman_locked: null, jack_locked: null },
      { rank: 22, name: 'Allegiance', creator: 'Pennutoh', gddl_rank: 13.89, points: 46, judah: 0, whitman: 0, jack: 0, judah_locked: null, whitman_locked: null, jack_locked: null },
      { rank: 23, name: 'Crimson Planet', creator: 'Darwin', gddl_rank: 13.56, points: 44, judah: 0, whitman: 0, jack: 0, judah_locked: null, whitman_locked: null, jack_locked: null },
      { rank: 24, name: 'Black Blizzard', creator: 'Viprin', gddl_rank: 13.24, points: 42, judah: 0, whitman: 0, jack: 0, judah_locked: null, whitman_locked: null, jack_locked: null },
      { rank: 25, name: 'Congregation', creator: 'Presta', gddl_rank: 12.93, points: 40, judah: 0, whitman: 0, jack: 0, judah_locked: null, whitman_locked: null, jack_locked: null },
    ];

    const { data, error } = await supabase
      .from('levels')
      .insert(defaultLevels)
      .select();

    if (error) {
      console.error('Error initializing levels:', error);
    } else {
      setLevels(data);
    }
  };

  const sortAndRankLevels = (levelList) => {
    const sorted = [...levelList].sort((a, b) => b.gddl_rank - a.gddl_rank);
    return sorted.map((level, index) => ({
      ...level,
      rank: index + 1
    }));
  };

  const calculatePointsFromRank = (rank) => {
    // Rank 1 = 25 points, Rank 2 = 24 points, ..., Rank 25 = 1 point
    // Rank 26+ (extended list) = 0 points
    if (rank <= 25) {
      return 26 - rank;
    }
    return 0;
  };

  const calculateTotal = (player, listType = 'both') => {
    let listToUse = [];
    if (listType === 'main') {
      listToUse = levels;
    } else if (listType === 'extended') {
      listToUse = extendedList;
    } else {
      listToUse = [...levels, ...extendedList];
    }
    
    const currentPoints = listToUse.reduce((sum, level) => {
      const progress = level[player];
      if (!progress || progress === 0) return sum;
      
      // If locked, use the locked value (points at time of completion)
      const lockedPoints = level[`${player}_locked`];
      if (lockedPoints !== null) {
        return sum + lockedPoints;
      }
      
      // If 100% but not locked yet, lock the current rank-based points
      if (progress === 100) {
        const points = calculatePointsFromRank(level.rank);
        return sum + points;
      }
      
      // Otherwise award fractional points based on current rank
      const points = calculatePointsFromRank(level.rank);
      const earnedPoints = (progress / 100) * points;
      return sum + earnedPoints;
    }, 0);
    
    return currentPoints;
  };

  const handleProgressChange = (levelId, player, value, isExtended = false) => {
    const numValue = value === '' ? 0 : Math.max(0, Math.min(100, parseFloat(value) || 0));
    const listSetter = isExtended ? setExtendedList : setLevels;
    const currentList = isExtended ? extendedList : levels;

    // Update UI immediately (local state only)
    const updateData = {
      [player]: numValue,
      [`${player}_locked`]: null
    };

    listSetter(currentList.map(level => 
      level.id === levelId 
        ? { ...level, ...updateData }
        : level
    ));
  };

  const saveProgress = async (levelId, player, value, isExtended = false) => {
    const numValue = value === '' ? 0 : Math.max(0, Math.min(100, parseFloat(value) || 0));
    const table = isExtended ? 'extended_levels' : 'levels';
    const currentList = isExtended ? extendedList : levels;

    console.log(`Saving progress: level ${levelId}, player ${player}, value ${numValue}, table ${table}`);

    // Find the level to get its current rank
    const level = currentList.find(l => l.id === levelId);
    if (!level) {
      console.error('Level not found');
      return;
    }

    setSaving(true);
    const updateData = {
      [player]: numValue,
      [`${player}_locked`]: numValue === 100 ? calculatePointsFromRank(level.rank) : null
    };

    const { data, error } = await supabase
      .from(table)
      .update(updateData)
      .eq('id', levelId)
      .select();

    if (error) {
      console.error('Error updating progress:', error);
    } else {
      console.log('Successfully saved:', data);
    }
    setSaving(false);
  };

  const addLevel = async () => {
    if (!newLevelData.name || !newLevelData.creator || !newLevelData.gddlRank) {
      alert('Please fill in all fields');
      return;
    }

    const gddlRank = parseFloat(newLevelData.gddlRank);

    setSaving(true);

    try {
      // Step 1: Get fresh data from database to ensure we have latest values
      const { data: freshMainLevels } = await supabase.from('levels').select('*').order('rank');
      const { data: freshExtendedLevels } = await supabase.from('extended_levels').select('*').order('rank');
      
      const allCurrentLevels = [...(freshMainLevels || []), ...(freshExtendedLevels || [])];
      
      console.log('Fresh data loaded, total levels:', allCurrentLevels.length);
      
      // Step 2: Create new level (points will be calculated based on rank)
      const newLevel = {
        name: newLevelData.name,
        creator: newLevelData.creator,
        gddl_rank: gddlRank
      };

      // Add player progress fields
      players.forEach(player => {
        newLevel[player] = 0;
        newLevel[`${player}_locked`] = null;
      });

      // Step 3: Determine proper ranking with new level included
      const allWithNew = [...allCurrentLevels, newLevel].sort((a, b) => b.gddl_rank - a.gddl_rank);
      const newLevelRank = allWithNew.findIndex(l => 
        l.name === newLevel.name && 
        l.gddl_rank === newLevel.gddl_rank &&
        !l.id
      ) + 1;

      console.log('New level will be rank:', newLevelRank);

      // Calculate points for the new level based on its rank
      const newLevelPoints = calculatePointsFromRank(newLevelRank);

      // Step 4: Determine final placement for all levels
      const top25Ids = allWithNew.slice(0, 25).map(l => l.id).filter(Boolean);
      const beyond25Ids = allWithNew.slice(25).map(l => l.id).filter(Boolean);

      console.log('Top 25 should contain IDs:', top25Ids);
      console.log('Extended should contain IDs:', beyond25Ids);

      // Step 5: Insert new level into correct table
      const newLevelTable = newLevelRank <= 25 ? 'levels' : 'extended_levels';
      const { data: insertedLevel, error: insertError } = await supabase
        .from(newLevelTable)
        .insert([{ ...newLevel, rank: newLevelRank, points: newLevelPoints }])
        .select()
        .single();

      if (insertError) throw insertError;
      console.log('Inserted new level:', insertedLevel.name, 'at rank', newLevelRank);

      // Step 6: Handle levels that need to move FROM main TO extended
      for (const level of allCurrentLevels) {
        // Currently in main list
        const currentlyInMain = freshMainLevels.find(l => l.id === level.id);
        if (!currentlyInMain) continue;
        
        // Should now be in extended (not in top 25)
        if (!top25Ids.includes(level.id)) {
          console.log(`Level "${level.name}" needs to move from main to extended`);
          console.log('  Current progress:', { judah: level.judah, whitman: level.whitman, jack: level.jack });
          
          // Get new rank in extended list
          const newRank = allWithNew.findIndex(l => l.id === level.id) + 1;
          const newPoints = calculatePointsFromRank(newRank);
          
          // Insert into extended_levels - PRESERVE all progress data
          const insertData = {
            name: level.name,
            creator: level.creator,
            gddl_rank: level.gddl_rank,
            points: newPoints,
            rank: newRank
          };
          
          // Add all player fields
          players.forEach(player => {
            insertData[player] = level[player] || 0;
            insertData[`${player}_locked`] = level[`${player}_locked`];
          });
          
          await supabase.from('extended_levels').insert([insertData]);
          
          // Delete from main
          await supabase.from('levels').delete().eq('id', level.id);
          
          console.log(`  Moved to extended at rank ${newRank}, preserved progress`);
        }
      }

      // Step 7: Handle levels that need to move FROM extended TO main
      for (const level of allCurrentLevels) {
        // Currently in extended list
        const currentlyInExtended = freshExtendedLevels.find(l => l.id === level.id);
        if (!currentlyInExtended) continue;
        
        // Should now be in main (in top 25)
        if (top25Ids.includes(level.id)) {
          console.log(`Level "${level.name}" needs to move from extended to main`);
          
          // Get new rank in main list
          const newRank = allWithNew.findIndex(l => l.id === level.id) + 1;
          const newPoints = calculatePointsFromRank(newRank);
          
          // Insert into levels - PRESERVE all progress data
          const insertData = {
            name: level.name,
            creator: level.creator,
            gddl_rank: level.gddl_rank,
            points: newPoints,
            rank: newRank
          };
          
          // Add all player fields
          players.forEach(player => {
            insertData[player] = level[player] || 0;
            insertData[`${player}_locked`] = level[`${player}_locked`];
          });
          
          await supabase.from('levels').insert([insertData]);
          
          // Delete from extended
          await supabase.from('extended_levels').delete().eq('id', level.id);
          
          console.log(`  Moved to main at rank ${newRank}, preserved progress`);
        }
      }

      // Step 8: Update ranks AND points for levels that stayed in their current table
      for (const level of allCurrentLevels) {
        const newRank = allWithNew.findIndex(l => l.id === level.id) + 1;
        const newPoints = calculatePointsFromRank(newRank);
        const shouldBeInMain = top25Ids.includes(level.id);
        const currentlyInMain = freshMainLevels.find(l => l.id === level.id);
        const currentlyInExtended = freshExtendedLevels.find(l => l.id === level.id);
        
        // If staying in main
        if (shouldBeInMain && currentlyInMain) {
          await supabase.from('levels').update({ rank: newRank, points: newPoints }).eq('id', level.id);
          console.log(`Updated rank for "${level.name}" in main list to ${newRank} (${newPoints} pts)`);
        }
        
        // If staying in extended
        if (!shouldBeInMain && currentlyInExtended) {
          await supabase.from('extended_levels').update({ rank: newRank, points: newPoints }).eq('id', level.id);
          console.log(`Updated rank for "${level.name}" in extended list to ${newRank} (${newPoints} pts)`);
        }
      }

      console.log('All operations complete, reloading data');

      // Step 9: Reload everything
      await loadData();
      
      setShowAddModal(false);
      setNewLevelData({ name: '', creator: '', gddlRank: '' });
    } catch (error) {
      console.error('Error adding level:', error);
      alert('Error adding level: ' + error.message);
    }
    
    setSaving(false);
  };

  const addPlayer = async () => {
    const playerName = prompt('Enter player name:');
    if (!playerName || playerName.trim() === '') return;
    
    const sanitizedName = playerName.toLowerCase().replace(/[^a-z0-9_]/g, '_');
    
    if (players.includes(sanitizedName)) {
      alert('Player already exists!');
      return;
    }
    
    setSaving(true);
    
    try {
      // Add columns to levels table using raw SQL
      const { error: levelsError } = await supabase.rpc('exec_sql', {
        sql_query: `
          ALTER TABLE levels 
          ADD COLUMN IF NOT EXISTS ${sanitizedName} integer DEFAULT 0,
          ADD COLUMN IF NOT EXISTS ${sanitizedName}_locked integer;
        `
      });
      
      if (levelsError) throw levelsError;
      
      // Add columns to extended_levels table using raw SQL
      const { error: extendedError } = await supabase.rpc('exec_sql', {
        sql_query: `
          ALTER TABLE extended_levels 
          ADD COLUMN IF NOT EXISTS ${sanitizedName} integer DEFAULT 0,
          ADD COLUMN IF NOT EXISTS ${sanitizedName}_locked integer;
        `
      });
      
      if (extendedError) throw extendedError;
      
      // Add to players list
      setPlayers([...players, sanitizedName]);
      alert(`Successfully added player: ${playerName}`);
      
      // Reload data to get the new columns
      await loadData();
    } catch (error) {
      console.error('Error adding player:', error);
      alert('Error adding player. Make sure you have created the exec_sql function in Supabase (see console for details).');
      console.log('To create the exec_sql function, run this in Supabase SQL Editor:\n\nCREATE OR REPLACE FUNCTION exec_sql(sql_query text)\nRETURNS void\nLANGUAGE plpgsql\nSECURITY DEFINER\nAS $$\nBEGIN\n  EXECUTE sql_query;\nEND;\n$$;');
    }
    
    setSaving(false);
  };

  const removePlayer = async () => {
    if (players.length <= 1) {
      alert('Cannot remove the last player!');
      return;
    }
    
    const playerName = prompt(`Enter player name to remove:\n\nAvailable players: ${players.join(', ')}`);
    if (!playerName || playerName.trim() === '') return;
    
    const sanitizedName = playerName.toLowerCase().replace(/[^a-z0-9_]/g, '_');
    
    if (!players.includes(sanitizedName)) {
      alert('Player not found!');
      return;
    }
    
    if (!confirm(`Are you sure you want to remove player "${sanitizedName}"? This will delete all their progress data permanently!`)) {
      return;
    }
    
    setSaving(true);
    
    try {
      // Remove columns from levels table using raw SQL
      const { error: levelsError } = await supabase.rpc('exec_sql', {
        sql_query: `
          ALTER TABLE levels 
          DROP COLUMN IF EXISTS ${sanitizedName},
          DROP COLUMN IF EXISTS ${sanitizedName}_locked;
        `
      });
      
      if (levelsError) throw levelsError;
      
      // Remove columns from extended_levels table using raw SQL
      const { error: extendedError } = await supabase.rpc('exec_sql', {
        sql_query: `
          ALTER TABLE extended_levels 
          DROP COLUMN IF EXISTS ${sanitizedName},
          DROP COLUMN IF EXISTS ${sanitizedName}_locked;
        `
      });
      
      if (extendedError) throw extendedError;
      
      // Remove from players list
      setPlayers(players.filter(p => p !== sanitizedName));
      alert(`Successfully removed player: ${playerName}`);
      
      // Reload data
      await loadData();
    } catch (error) {
      console.error('Error removing player:', error);
      alert('Error removing player: ' + error.message);
    }
    
    setSaving(false);
  };

  const deleteLevel = async (levelId, isExtended = false) => {
    if (!window.confirm('Are you sure you want to delete this level?')) {
      return;
    }

    const table = isExtended ? 'extended_levels' : 'levels';
    const listSetter = isExtended ? setExtendedList : setLevels;
    const currentList = isExtended ? extendedList : levels;

    setSaving(true);
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', levelId);

    if (error) {
      console.error('Error deleting level:', error);
      alert('Error deleting level. Please try again.');
    } else {
      const updatedList = sortAndRankLevels(currentList.filter(l => l.id !== levelId));
      
      for (const level of updatedList) {
        await supabase
          .from(table)
          .update({ rank: level.rank })
          .eq('id', level.id);
      }
      
      listSetter(updatedList);
    }
    setSaving(false);
  };

  const renderTable = (levelList, isExtended = false) => (
    <div className="bg-white/10 backdrop-blur-md rounded-lg shadow-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-purple-600/30">
            <tr>
              <th className="px-4 py-4 text-left text-white font-bold">Rank</th>
              <th className="px-4 py-4 text-left text-white font-bold">Level</th>
              <th className="px-4 py-4 text-left text-white font-bold">Creator</th>
              <th className="px-4 py-4 text-center text-white font-bold">GDDL Rank</th>
              <th className="px-4 py-4 text-center text-white font-bold">Points</th>
              {players.map(player => (
                <th key={player} className="px-4 py-4 text-center text-white font-bold capitalize">{player}</th>
              ))}
              <th className="px-4 py-4 text-center text-white font-bold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {levelList.map((level) => (
              <tr key={level.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                <td className="px-4 py-3 text-white font-semibold">#{level.rank}</td>
                <td className="px-4 py-3 text-white font-semibold">{level.name}</td>
                <td className="px-4 py-3 text-blue-200">{level.creator}</td>
                <td className="px-4 py-3 text-center text-yellow-300">{level.gddl_rank.toFixed(2)}</td>
                <td className="px-4 py-3 text-center text-green-300 font-bold">{calculatePointsFromRank(level.rank)}</td>
                
                {players.map(player => {
                  const isLocked = level[`${player}_locked`] !== null;
                  const isExtended = level.rank > 25;
                  const canEdit = !isExtended || isLocked; // Can only edit extended if already have locked points
                  
                  return (
                    <td key={player} className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {isLocked ? (
                          <div className="flex items-center gap-1 text-green-400 font-bold">
                            <span>🔒 {level[`${player}_locked`]} pts</span>
                          </div>
                        ) : canEdit ? (
                          <>
                            <input
                              type="text"
                              inputMode="numeric"
                              value={level[player] || 0}
                              onChange={(e) => handleProgressChange(level.id, player, e.target.value, level.rank > 25)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  saveProgress(level.id, player, e.target.value, level.rank > 25);
                                  e.target.blur();
                                }
                              }}
                              onBlur={(e) => saveProgress(level.id, player, e.target.value, level.rank > 25)}
                              className="w-16 px-2 py-1 bg-white/20 border border-white/30 rounded text-white text-center focus:ring-2 focus:ring-purple-500 focus:border-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                            <span className="text-white/70 text-sm">%</span>
                          </>
                        ) : (
                          <span className="text-gray-500 text-sm">No points</span>
                        )}
                      </div>
                    </td>
                  );
                })}
                
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => deleteLevel(level.id, level.rank > 25)}
                    className="bg-red-500/20 hover:bg-red-500/40 text-red-300 p-2 rounded transition-all"
                    title="Delete level"
                  >
                    <X size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          {!isExtended && (
            <tfoot className="bg-purple-600/40">
              <tr>
                <td colSpan="5" className="px-4 py-4 text-white font-bold text-right text-xl">
                  Main List Points:
                </td>
                {players.map(player => (
                  <td key={player} className="px-4 py-4 text-center text-green-300 font-bold text-2xl">
                    {calculateTotal(player, 'main').toFixed(2)}
                  </td>
                ))}
                <td className="px-4 py-4"></td>
              </tr>
              <tr>
                <td colSpan="5" className="px-4 py-4 text-white font-bold text-right text-xl">
                  Extended List Points:
                </td>
                {players.map(player => (
                  <td key={player} className="px-4 py-4 text-center text-blue-300 font-bold text-2xl">
                    {calculateTotal(player, 'extended').toFixed(2)}
                  </td>
                ))}
                <td className="px-4 py-4"></td>
              </tr>
              <tr className="bg-gradient-to-r from-purple-600/50 to-blue-600/50">
                <td colSpan="5" className="px-4 py-4 text-white font-bold text-right text-2xl">
                  TOTAL POINTS (All Lists):
                </td>
                {players.map(player => (
                  <td key={player} className="px-4 py-4 text-center text-2xl font-bold">
                    {calculateTotal(player, 'both').toFixed(2)}
                  </td>
                ))}
                <td className="px-4 py-4"></td>
              </tr>
            </tfoot>
          )}
          {isExtended && (
            <tfoot className="bg-purple-600/40">
              <tr>
                <td colSpan="5" className="px-4 py-4 text-white font-bold text-right text-xl">
                  Main List Points:
                </td>
                {players.map(player => (
                  <td key={player} className="px-4 py-4 text-center text-green-300 font-bold text-2xl">
                    {calculateTotal(player, 'main').toFixed(2)}
                  </td>
                ))}
                <td className="px-4 py-4"></td>
              </tr>
              <tr>
                <td colSpan="5" className="px-4 py-4 text-white font-bold text-right text-xl">
                  Extended List Points:
                </td>
                {players.map(player => (
                  <td key={player} className="px-4 py-4 text-center text-blue-300 font-bold text-2xl">
                    {calculateTotal(player, 'extended').toFixed(2)}
                  </td>
                ))}
                <td className="px-4 py-4"></td>
              </tr>
              <tr className="bg-gradient-to-r from-purple-600/50 to-blue-600/50">
                <td colSpan="5" className="px-4 py-4 text-white font-bold text-right text-2xl">
                  TOTAL POINTS (All Lists):
                </td>
                {players.map(player => (
                  <td key={player} className="px-4 py-4 text-center text-2xl font-bold">
                    {calculateTotal(player, 'both').toFixed(2)}
                  </td>
                ))}
                <td className="px-4 py-4"></td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading demon list...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/10 backdrop-blur-md rounded-lg shadow-2xl p-6 mb-6">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-4xl font-bold text-white text-center flex-1">
              Demon Tracker
            </h1>
            <button
              onClick={loadData}
              className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-all"
              title="Refresh data"
            >
              <RefreshCw size={20} />
            </button>
          </div>
          <p className="text-blue-200 text-center">Track your demon completions and progress</p>
          {saving && <p className="text-yellow-300 text-center text-sm mt-2">Saving changes...</p>}
          <p className="text-green-300 text-center text-sm mt-2">✓ Real-time syncing with Supabase</p>
          
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={() => setCurrentView('main')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                currentView === 'main'
                  ? 'bg-white text-purple-600'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              Main List (Top 25)
            </button>
            <button
              onClick={() => setCurrentView('extended')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                currentView === 'extended'
                  ? 'bg-white text-purple-600'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <List size={18} />
              Extended List ({extendedList.length})
            </button>
          </div>
        </div>

        {currentView === 'main' ? renderTable(levels, false) : renderTable(extendedList, true)}

        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl">
              <h2 className="text-2xl font-bold text-purple-600 mb-6">Add New Level</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Level Name
                  </label>
                  <input
                    type="text"
                    value={newLevelData.name}
                    onChange={(e) => setNewLevelData({ ...newLevelData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter level name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Creator
                  </label>
                  <input
                    type="text"
                    value={newLevelData.creator}
                    onChange={(e) => setNewLevelData({ ...newLevelData, creator: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter creator name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    GDDL Rank
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newLevelData.gddlRank}
                    onChange={(e) => setNewLevelData({ ...newLevelData, gddlRank: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., 15.50"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={addLevel}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all"
                >
                  Add Level
                </button>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setNewLevelData({ name: '', creator: '', gddlRank: '' });
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 text-center flex gap-4 justify-center">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg flex items-center gap-2"
          >
            <Plus size={20} />
            Add Level
          </button>
          <button
            onClick={addPlayer}
            className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-teal-700 transition-all shadow-lg flex items-center gap-2"
          >
            <Plus size={20} />
            Add Player
          </button>
          <button
            onClick={removePlayer}
            className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-red-700 hover:to-pink-700 transition-all shadow-lg flex items-center gap-2"
          >
            <X size={20} />
            Remove Player
          </button>
        </div>

        <div className="mt-6 bg-white/10 backdrop-blur-md rounded-lg p-4 text-white text-sm">
          <p><strong>Instructions:</strong></p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li><strong>🌐 LIVE SYNCING:</strong> Changes sync automatically across all devices!</li>
            <li>Click the refresh button (↻) to manually reload data</li>
            <li>Higher GDDL rank = harder level (e.g., 25.56 is rank #1)</li>
            <li>Only the top 25 levels appear on the main list and award points</li>
            <li>Points are auto-calculated: Rank 1 = 25 pts, Rank 2 = 24 pts, ..., Rank 25 = 1 pt</li>
            <li>Extended list levels (rank 26+) are worth 0 points</li>
            <li>Enter progress as a percentage (0-100) - saves when you press Enter or click away</li>
            <li>100% completion locks in the points at the current rank - they won't change if rankings shift</li>
            <li>Total Points includes points from both Main and Extended lists (locked points persist)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DemonListTracker;
