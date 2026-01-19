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
    
    // Subscribe to real-time changes
    const levelsChannel = supabase
      .channel('levels-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'levels' },
        () => loadLevels()
      )
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'extended_levels' },
        () => loadExtendedLevels()
      )
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'banked_points' },
        () => loadBankedPoints()
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
      if (progress === 100) {
        return sum + level.points;
      } else if (progress > 0) {
        return sum + (progress / 100);
      }
      return sum;
    }, 0);
    return currentPoints + bankedPoints[player];
  };

const updateProgress = async (id, player, value, isExtended = false) => {
    const numValue = Math.max(0, Math.min(100, Number(value) || 0));
    const table = isExtended ? 'extended_levels' : 'levels';
    
    const updates = { [player]: numValue };

    const { error } = await supabase
      .from(table)
      .update(updates)
      .eq('id', id);

    if (error) {
      console.error('Error updating progress:', error);
      alert('Failed to update progress. Please try again.');
    }
  };

  const updateCell = async (id, field, value, isExtended = false) => {
    const table = isExtended ? 'extended_levels' : 'levels';
    
    if (field === 'gddl_rank') {
      // Get all levels from both tables
      const { data: mainData } = await supabase.from('levels').select('*');
      const { data: extData } = await supabase.from('extended_levels').select('*');
      
      const allLevels = [...(mainData || []), ...(extData || [])].map(level =>
        level.id === id ? { ...level, gddl_rank: value } : level
      );
      
      const sortedAll = sortAndRankLevels(allLevels);
      const top25 = sortedAll.slice(0, 25);
      const overflow = sortedAll.slice(25);
      
      // Clear both tables
      await supabase.from('levels').delete().neq('id', 0);
      await supabase.from('extended_levels').delete().neq('id', 0);
      
      // Insert sorted data
      if (top25.length > 0) {
        await supabase.from('levels').insert(top25.map(({ id, ...rest }) => rest));
      }
      if (overflow.length > 0) {
        await supabase.from('extended_levels').insert(overflow.map(({ id, ...rest }) => rest));
      }
      
      await loadData();
    } else {
      const dbField = field === 'gddlRank' ? 'gddl_rank' : field;
      
      const { error } = await supabase
        .from(table)
        .update({ [dbField]: value })
        .eq('id', id);

      if (error) {
        console.error('Error updating cell:', error);
        alert('Failed to update. Please try again.');
      }
    }
    
    setEditingCell(null);
  };

  const addLevel = async () => {
    if (!newLevelData.name || !newLevelData.creator || !newLevelData.gddlRank || !newLevelData.points) {
      alert('Please fill in all fields');
      return;
    }

    const newLevel = {
      rank: 0,
      name: newLevelData.name,
      creator: newLevelData.creator,
      gddl_rank: Number(newLevelData.gddlRank),
      points: Number(newLevelData.points),
      judah: 0,
      whitman: 0,
      jack: 0,
      judah_locked: null,
      whitman_locked: null,
      jack_locked: null
    };
    
    // Get all levels
    const { data: mainData } = await supabase.from('levels').select('*');
    const { data: extData } = await supabase.from('extended_levels').select('*');
    
    const allLevels = [...(mainData || []), ...(extData || []), newLevel];
    const sortedAll = sortAndRankLevels(allLevels);
    const top25 = sortedAll.slice(0, 25);
    const overflow = sortedAll.slice(25);
    
    // Clear both tables
    await supabase.from('levels').delete().neq('id', 0);
    await supabase.from('extended_levels').delete().neq('id', 0);
    
    // Insert sorted data
    if (top25.length > 0) {
      await supabase.from('levels').insert(top25.map(({ id, ...rest }) => rest));
    }
    if (overflow.length > 0) {
      await supabase.from('extended_levels').insert(overflow.map(({ id, ...rest }) => rest));
    }
    
    await loadData();
    setNewLevelData({ name: '', creator: '', gddlRank: '', points: '' });
    setShowAddModal(false);
  };

  const deleteLevel = async (id, isExtended = false) => {
    const table = isExtended ? 'extended_levels' : 'levels';
    const listToDelete = isExtended ? extendedList : levels;
    const levelToDelete = listToDelete.find(level => level.id === id);
    
    const newBankedPoints = { ...bankedPoints };
    ['judah', 'whitman', 'jack'].forEach(player => {
      const lockedPoints = levelToDelete[`${player}_locked`];
      if (lockedPoints !== null) {
        newBankedPoints[player] += lockedPoints;
      } else {
        const progress = levelToDelete[player];
        if (progress === 100) {
          newBankedPoints[player] += levelToDelete.points;
        } else if (progress > 0) {
          newBankedPoints[player] += (progress / 100);
        }
      }
    });
    
    // Update banked points
    await supabase
      .from('banked_points')
      .update(newBankedPoints)
      .eq('id', 1);

    // Delete the level
    await supabase
      .from(table)
      .delete()
      .eq('id', id);
    
    await loadData();
  };

  const promoteFromExtended = async (id) => {
    const levelToPromote = extendedList.find(level => level.id === id);
    if (!levelToPromote) return;
    
    // Get all levels
    const { data: mainData } = await supabase.from('levels').select('*');
    const { data: extData } = await supabase.from('extended_levels').select('*');
    
    const allLevels = [...(mainData || []), levelToPromote];
    const sortedAll = sortAndRankLevels(allLevels);
    const top25 = sortedAll.slice(0, 25);
    const overflow = sortedAll.slice(25);
    
    // Clear both tables
    await supabase.from('levels').delete().neq('id', 0);
    await supabase.from('extended_levels').delete().neq('id', 0);
    
    // Insert sorted data
    if (top25.length > 0) {
      await supabase.from('levels').insert(top25.map(({ id, ...rest }) => rest));
    }
    if (overflow.length > 0) {
      await supabase.from('extended_levels').insert(overflow.map(({ id, ...rest }) => rest));
    }
    
    await loadData();
  };

  const renderCell = (level, field, isExtended = false) => {
    const dbField = field === 'gddlRank' ? 'gddl_rank' : field;
    const displayValue = level[dbField];
    
    if (editingCell?.id === level.id && editingCell?.field === field) {
      return (
        <input
          type={field === 'gddlRank' || field === 'points' ? 'number' : 'text'}
          step={field === 'gddlRank' ? '0.01' : '1'}
          className="w-full px-2 py-1 border border-blue-500 rounded"
          defaultValue={displayValue}
          autoFocus
          onBlur={(e) => updateCell(level.id, field, field === 'gddlRank' || field === 'points' ? Number(e.target.value) : e.target.value, isExtended)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              updateCell(level.id, field, field === 'gddlRank' || field === 'points' ? Number(e.target.value) : e.target.value, isExtended);
            }
          }}
        />
      );
    }
    return (
      <div
        className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
        onClick={() => setEditingCell({ id: level.id, field })}
      >
        {field === 'gddlRank' ? displayValue.toFixed(2) : displayValue}
      </div>
    );
  };

  const renderProgressCell = (level, player, isExtended = false) => {
    const progress = level[player];
    const lockedPoints = level[`${player}_locked`];
    
    let earnedPoints;
    if (lockedPoints !== null) {
      earnedPoints = lockedPoints;
    } else if (progress === 100) {
      earnedPoints = level.points;
    } else if (progress > 0) {
      earnedPoints = progress / 100;
    } else {
      earnedPoints = 0;
    }
    
    const isLocked = lockedPoints !== null;
    
    return (
      <div className="flex flex-col items-center gap-1">
        <input
          type="number"
          min="0"
          max="100"
          value={progress}
          onChange={(e) => updateProgress(level.id, player, e.target.value, isExtended)}
          className={`w-16 px-2 py-1 text-center border rounded ${
            isLocked
              ? 'bg-blue-100 border-blue-500 font-bold' 
              : progress === 100 
              ? 'bg-green-100 border-green-500 font-bold' 
              : progress > 0 
              ? 'bg-yellow-50 border-yellow-400'
              : 'bg-white border-gray-300'
          }`}
        />
        <span className={`text-xs font-semibold ${
          isLocked
            ? 'text-blue-600'
            : progress === 100 
            ? 'text-green-600' 
            : progress > 0 
            ? 'text-yellow-600'
            : 'text-gray-400'
        }`}>
          {earnedPoints > 0 ? `+${earnedPoints.toFixed(2)}${isLocked ? ' 🔒' : ''}` : '—'}
        </span>
      </div>
    );
  };

  const renderTable = (levelList, isExtended = false) => (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Rank</th>
              <th className="px-4 py-3 text-left font-semibold">Level Name</th>
              <th className="px-4 py-3 text-left font-semibold">Creator</th>
              <th className="px-4 py-3 text-left font-semibold">GDDL Rank</th>
              <th className="px-4 py-3 text-left font-semibold">Points</th>
              <th className="px-4 py-3 text-center font-semibold">Judah %</th>
              <th className="px-4 py-3 text-center font-semibold">Whitman %</th>
              <th className="px-4 py-3 text-center font-semibold">Jack %</th>
              <th className="px-4 py-3 text-center font-semibold"></th>
            </tr>
          </thead>
          <tbody>
            {levelList.map((level, index) => (
              <tr key={level.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                <td className="px-4 py-3 font-bold text-purple-600">#{level.rank}</td>
                <td className="px-4 py-3">{renderCell(level, 'name', isExtended)}</td>
                <td className="px-4 py-3">{renderCell(level, 'creator', isExtended)}</td>
                <td className="px-4 py-3">{renderCell(level, 'gddlRank', isExtended)}</td>
                <td className="px-4 py-3 font-semibold text-blue-600">{renderCell(level, 'points', isExtended)}</td>
                <td className="px-4 py-3 text-center">{renderProgressCell(level, 'judah', isExtended)}</td>
                <td className="px-4 py-3 text-center">{renderProgressCell(level, 'whitman', isExtended)}</td>
                <td className="px-4 py-3 text-center">{renderProgressCell(level, 'jack', isExtended)}</td>
                <td className="px-4 py-3 text-center flex gap-2 justify-center">
                  {isExtended && (
                    <button
                      onClick={() => promoteFromExtended(level.id)}
                      className="text-green-500 hover:text-green-700 transition-colors"
                      title="Promote to main list"
                    >
                      ↑
                    </button>
                  )}
                  <button
                    onClick={() => deleteLevel(level.id, isExtended)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                    title="Remove from list (points will be banked)"
                  >
                    <X size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          {!isExtended && (
            <tfoot className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold">
              <tr>
                <td colSpan="5" className="px-4 py-3 text-right text-lg">Current List Points:</td>
                <td className="px-4 py-3 text-center text-lg">
                  {(calculateTotal('judah') - bankedPoints.judah).toFixed(2)}
                </td>
                <td className="px-4 py-3 text-center text-lg">
                  {(calculateTotal('whitman') - bankedPoints.whitman).toFixed(2)}
                </td>
                <td className="px-4 py-3 text-center text-lg">
                  {(calculateTotal('jack') - bankedPoints.jack).toFixed(2)}
                </td>
                <td></td>
              </tr>
              <tr>
                <td colSpan="5" className="px-4 py-3 text-right text-lg">Banked Points:</td>
                <td className="px-4 py-3 text-center text-lg">
                  {bankedPoints.judah.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-center text-lg">
                  {bankedPoints.whitman.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-center text-lg">
                  {bankedPoints.jack.toFixed(2)}
                </td>
                <td></td>
              </tr>
              <tr className="border-t-2 border-white/30">
                <td colSpan="5" className="px-4 py-4 text-right text-xl">Total Points:</td>
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
            <li>When a level is 100% completed, the point value is locked 🔒</li>
            <li>Enter progress as a percentage (0-100) for each player</li>
            <li>Total Points includes points from both Main and Extended lists</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DemonListTracker;
