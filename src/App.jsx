import React, { useState, useEffect } from 'react';
import { Plus, X, List, RefreshCw } from 'lucide-react';
import { supabase } from './supabaseClient';

const DemonListTracker = () => {
  const [levels, setLevels] = useState([]);
  const [extendedList, setExtendedList] = useState([]);
  const [currentView, setCurrentView] = useState('main');
  const [bankedPoints, setBankedPoints] = useState({
    judah: 0,
    whitman: 0,
    jack: 0
  });
  const [editingCell, setEditingCell] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLevelData, setNewLevelData] = useState({
    name: '',
    creator: '',
    gddlRank: '',
    points: ''
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
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'banked_points' },
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

  const loadBankedPoints = async () => {
    const { data, error } = await supabase
      .from('banked_points')
      .select('*')
      .single();
    
    if (error && error.code !== 'PGRST116') {
      console.error('Error loading banked points:', error);
      return;
    }
    
    if (data) {
      setBankedPoints({
        judah: data.judah || 0,
        whitman: data.whitman || 0,
        jack: data.jack || 0
      });
    } else {
      await supabase.from('banked_points').insert({
        judah: 0,
        whitman: 0,
        jack: 0
      });
    }
  };

  const loadData = async () => {
    setLoading(true);
    await Promise.all([
      loadLevels(),
      loadExtendedLevels(),
      loadBankedPoints()
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

  const calculateTotal = (player, includeExtended = false) => {
    const listToUse = includeExtended ? [...levels, ...extendedList] : levels;
    const currentPoints = listToUse.reduce((sum, level) => {
      const lockedPoints = level[`${player}_locked`];
      if (lockedPoints !== null) {
        return sum + lockedPoints;
      }
      
      const progress = level[player];
      if (!progress || progress === 0) return sum;
      
      // If 100%, award full level points. Otherwise award fractional points
      if (progress === 100) {
        return sum + level.points;
      } else {
        const earnedPoints = progress / 100;
        return sum + earnedPoints;
      }
    }, 0);
    
    return currentPoints + (bankedPoints[player] || 0);
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

    setSaving(true);
    const updateData = {
      [player]: numValue,
      [`${player}_locked`]: null
    };

    const { error } = await supabase
      .from(table)
      .update(updateData)
      .eq('id', levelId);

    if (error) {
      console.error('Error updating progress:', error);
    }
    setSaving(false);
  };

  const handleBankedPointsChange = async (player, value) => {
    const numValue = value === '' ? 0 : Math.max(0, parseFloat(value) || 0);
    
    setSaving(true);
    const { error } = await supabase
      .from('banked_points')
      .update({ [player]: numValue })
      .eq('id', 1);

    if (error) {
      console.error('Error updating banked points:', error);
    } else {
      setBankedPoints(prev => ({ ...prev, [player]: numValue }));
    }
    setSaving(false);
  };

  const addLevel = async () => {
    if (!newLevelData.name || !newLevelData.creator || !newLevelData.gddlRank || !newLevelData.points) {
      alert('Please fill in all fields');
      return;
    }

    const gddlRank = parseFloat(newLevelData.gddlRank);
    const points = parseInt(newLevelData.points);

    setSaving(true);

    try {
      // Step 1: Get fresh data from database to ensure we have latest values
      const { data: freshMainLevels } = await supabase.from('levels').select('*').order('rank');
      const { data: freshExtendedLevels } = await supabase.from('extended_levels').select('*').order('rank');
      
      const allCurrentLevels = [...(freshMainLevels || []), ...(freshExtendedLevels || [])];
      
      console.log('Fresh data loaded, total levels:', allCurrentLevels.length);
      
      // Step 2: Create new level
      const newLevel = {
        name: newLevelData.name,
        creator: newLevelData.creator,
        gddl_rank: gddlRank,
        points: points,
        judah: 0,
        whitman: 0,
        jack: 0,
        judah_locked: null,
        whitman_locked: null,
        jack_locked: null
      };

      // Step 3: Determine proper ranking with new level included
      const allWithNew = [...allCurrentLevels, newLevel].sort((a, b) => b.gddl_rank - a.gddl_rank);
      const newLevelRank = allWithNew.findIndex(l => 
        l.name === newLevel.name && 
        l.gddl_rank === newLevel.gddl_rank &&
        !l.id
      ) + 1;

      console.log('New level will be rank:', newLevelRank);

      // Step 4: Determine final placement for all levels
      const top25Ids = allWithNew.slice(0, 25).map(l => l.id).filter(Boolean);
      const beyond25Ids = allWithNew.slice(25).map(l => l.id).filter(Boolean);

      console.log('Top 25 should contain IDs:', top25Ids);
      console.log('Extended should contain IDs:', beyond25Ids);

      // Step 5: Insert new level into correct table
      const newLevelTable = newLevelRank <= 25 ? 'levels' : 'extended_levels';
      const { data: insertedLevel, error: insertError } = await supabase
        .from(newLevelTable)
        .insert([{ ...newLevel, rank: newLevelRank }])
        .select()
        .single();

      if (insertError) throw insertError;
      console.log('Inserted new level:', insertedLevel.name, 'at rank', newLevelRank);

      // Step 6: Handle levels that need to move FROM main TO extended
      let pointsToBank = { judah: 0, whitman: 0, jack: 0 };
      
      for (const level of allCurrentLevels) {
        // Currently in main list
        const currentlyInMain = freshMainLevels.find(l => l.id === level.id);
        if (!currentlyInMain) continue;
        
        // Should now be in extended (not in top 25)
        if (!top25Ids.includes(level.id)) {
          console.log(`Level "${level.name}" needs to move from main to extended`);
          console.log('  Current progress:', { judah: level.judah, whitman: level.whitman, jack: level.jack });
          
          // Calculate points to bank
          ['judah', 'whitman', 'jack'].forEach(player => {
            const progress = level[player] || 0;
            if (progress === 100) {
              pointsToBank[player] += level.points;
            } else if (progress > 0) {
              pointsToBank[player] += progress / 100;
            }
          });
          
          // Get new rank in extended list
          const newRank = allWithNew.findIndex(l => l.id === level.id) + 1;
          
          // Insert into extended_levels - PRESERVE all progress data
          await supabase.from('extended_levels').insert([{
            name: level.name,
            creator: level.creator,
            gddl_rank: level.gddl_rank,
            points: level.points,
            rank: newRank,
            judah: level.judah,
            whitman: level.whitman,
            jack: level.jack,
            judah_locked: level.judah_locked,
            whitman_locked: level.whitman_locked,
            jack_locked: level.jack_locked
          }]);
          
          // Delete from main
          await supabase.from('levels').delete().eq('id', level.id);
          
          console.log(`  Moved to extended at rank ${newRank}, preserved progress`);
        }
      }

      // Step 7: Bank the points
      if (pointsToBank.judah > 0 || pointsToBank.whitman > 0 || pointsToBank.jack > 0) {
        console.log('Banking points:', pointsToBank);
        const { data: currentBanked } = await supabase
          .from('banked_points')
          .select('*')
          .single();

        await supabase
          .from('banked_points')
          .update({
            judah: (currentBanked?.judah || 0) + pointsToBank.judah,
            whitman: (currentBanked?.whitman || 0) + pointsToBank.whitman,
            jack: (currentBanked?.jack || 0) + pointsToBank.jack
          })
          .eq('id', 1);
      }

      // Step 8: Handle levels that need to move FROM extended TO main
      for (const level of allCurrentLevels) {
        // Currently in extended list
        const currentlyInExtended = freshExtendedLevels.find(l => l.id === level.id);
        if (!currentlyInExtended) continue;
        
        // Should now be in main (in top 25)
        if (top25Ids.includes(level.id)) {
          console.log(`Level "${level.name}" needs to move from extended to main`);
          
          // Get new rank in main list
          const newRank = allWithNew.findIndex(l => l.id === level.id) + 1;
          
          // Insert into levels - PRESERVE all progress data
          await supabase.from('levels').insert([{
            name: level.name,
            creator: level.creator,
            gddl_rank: level.gddl_rank,
            points: level.points,
            rank: newRank,
            judah: level.judah,
            whitman: level.whitman,
            jack: level.jack,
            judah_locked: level.judah_locked,
            whitman_locked: level.whitman_locked,
            jack_locked: level.jack_locked
          }]);
          
          // Delete from extended
          await supabase.from('extended_levels').delete().eq('id', level.id);
          
          console.log(`  Moved to main at rank ${newRank}, preserved progress`);
        }
      }

      // Step 9: Update ranks for levels that stayed in their current table
      for (const level of allCurrentLevels) {
        const newRank = allWithNew.findIndex(l => l.id === level.id) + 1;
        const shouldBeInMain = top25Ids.includes(level.id);
        const currentlyInMain = freshMainLevels.find(l => l.id === level.id);
        const currentlyInExtended = freshExtendedLevels.find(l => l.id === level.id);
        
        // If staying in main
        if (shouldBeInMain && currentlyInMain) {
          await supabase.from('levels').update({ rank: newRank }).eq('id', level.id);
          console.log(`Updated rank for "${level.name}" in main list to ${newRank}`);
        }
        
        // If staying in extended
        if (!shouldBeInMain && currentlyInExtended) {
          await supabase.from('extended_levels').update({ rank: newRank }).eq('id', level.id);
          console.log(`Updated rank for "${level.name}" in extended list to ${newRank}`);
        }
      }

      console.log('All operations complete, reloading data');

      // Step 10: Reload everything
      await loadData();
      
      setShowAddModal(false);
      setNewLevelData({ name: '', creator: '', gddlRank: '', points: '' });
    } catch (error) {
      console.error('Error adding level:', error);
      alert('Error adding level: ' + error.message);
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
              <th className="px-4 py-4 text-center text-white font-bold">Judah</th>
              <th className="px-4 py-4 text-center text-white font-bold">Whitman</th>
              <th className="px-4 py-4 text-center text-white font-bold">Jack</th>
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
                <td className="px-4 py-3 text-center text-green-300 font-bold">{level.points}</td>
                
                {['judah', 'whitman', 'jack'].map(player => (
                  <td key={player} className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <input
                        type="text"
                        inputMode="numeric"
                        value={level[player] || 0}
                        onChange={(e) => handleProgressChange(level.id, player, e.target.value, isExtended)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            saveProgress(level.id, player, e.target.value, isExtended);
                            e.target.blur();
                          }
                        }}
                        className="w-16 px-2 py-1 bg-white/20 border border-white/30 rounded text-white text-center focus:ring-2 focus:ring-purple-500 focus:border-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <span className="text-white/70 text-sm">%</span>
                    </div>
                  </td>
                ))}
                
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => deleteLevel(level.id, isExtended)}
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
                <td colSpan="5" className="px-4 py-4 text-white font-bold text-right">
                  Banked Points:
                </td>
                {['judah', 'whitman', 'jack'].map(player => (
                  <td key={player} className="px-4 py-4 text-center">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={bankedPoints[player] || 0}
                      onChange={(e) => handleBankedPointsChange(player, e.target.value)}
                      className="w-20 px-2 py-1 bg-white/20 border border-white/30 rounded text-white text-center font-bold focus:ring-2 focus:ring-purple-500"
                    />
                  </td>
                ))}
                <td></td>
              </tr>
              <tr>
                <td colSpan="5" className="px-4 py-4 text-white font-bold text-right text-xl">
                  Main List Total:
                </td>
                <td className="px-4 py-4 text-center text-green-300 font-bold text-2xl">{calculateTotal('judah', false).toFixed(2)}</td>
                <td className="px-4 py-4 text-center text-green-300 font-bold text-2xl">{calculateTotal('whitman', false).toFixed(2)}</td>
                <td className="px-4 py-4 text-center text-green-300 font-bold text-2xl">{calculateTotal('jack', false).toFixed(2)}</td>
                <td></td>
              </tr>
              <tr className="bg-gradient-to-r from-purple-600/50 to-blue-600/50">
                <td colSpan="5" className="px-4 py-4 text-white font-bold text-right text-2xl">
                  TOTAL POINTS (All Lists):
                </td>
                <td className="px-4 py-4 text-center text-2xl">{calculateTotal('judah', true).toFixed(2)}</td>
                <td className="px-4 py-4 text-center text-2xl">{calculateTotal('whitman', true).toFixed(2)}</td>
                <td className="px-4 py-4 text-center text-2xl">{calculateTotal('jack', true).toFixed(2)}</td>
                <td></td>
              </tr>
            </tfoot>
          )}
          {isExtended && (
            <tfoot className="bg-purple-600/40">
              <tr className="bg-gradient-to-r from-purple-600/50 to-blue-600/50">
                <td colSpan="5" className="px-4 py-4 text-white font-bold text-right text-2xl">
                  TOTAL POINTS (All Lists):
                </td>
                <td className="px-4 py-4 text-center text-2xl">{calculateTotal('judah', true).toFixed(2)}</td>
                <td className="px-4 py-4 text-center text-2xl">{calculateTotal('whitman', true).toFixed(2)}</td>
                <td className="px-4 py-4 text-center text-2xl">{calculateTotal('jack', true).toFixed(2)}</td>
                <td></td>
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
              Demon List Tracker
            </h1>
            <button
              onClick={loadData}
              className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-all"
              title="Refresh data"
            >
              <RefreshCw size={20} />
            </button>
          </div>
          <p className="text-blue-200 text-center">Track your extreme demon completions and progress</p>
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

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Points
                  </label>
                  <input
                    type="number"
                    value={newLevelData.points}
                    onChange={(e) => setNewLevelData({ ...newLevelData, points: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., 75"
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
                    setNewLevelData({ name: '', creator: '', gddlRank: '', points: '' });
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg flex items-center gap-2 mx-auto"
          >
            <Plus size={20} />
            Add Level
          </button>
        </div>

        <div className="mt-6 bg-white/10 backdrop-blur-md rounded-lg p-4 text-white text-sm">
          <p><strong>Instructions:</strong></p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li><strong>🌐 LIVE SYNCING:</strong> Changes sync automatically across all devices!</li>
            <li>Click the refresh button (↻) to manually reload data</li>
            <li>Higher GDDL rank = harder level (e.g., 25.56 is rank #1)</li>
            <li>Only the top 25 levels appear on the main list</li>
            <li>Enter progress as a percentage (0-100) for each player, then press Enter to save</li>
            <li>100% completion awards the full level points, lower percentages award fractional points (e.g., 23% = 0.23 points)</li>
            <li>Total Points includes points from both Main and Extended lists</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DemonListTracker;
