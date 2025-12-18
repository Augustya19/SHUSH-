import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Settings } from 'lucide-react';
import { UserProfile } from '../types';
import { userDataService } from '../services/storageService';

interface Props {
  user: UserProfile;
  onUpdateUser: () => void; // Trigger refresh in parent
}

export const PeriodTracker: React.FC<Props> = ({ user, onUpdateUser }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [cycleStatus, setCycleStatus] = useState<{ title: string; subtitle: string; color: string; dayCount: number }>({
    title: 'Track Your Cycle',
    subtitle: 'Select a date',
    color: 'bg-gray-200',
    dayCount: 0
  });

  useEffect(() => {
    calculateStatus();
  }, [user, currentDate]);

  // --- LOGIC: Date Helpers ---
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const isSameDay = (d1: Date, d2: Date) => {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  };

  // --- LOGIC: Cycle Calculation ---
  const calculateStatus = () => {
    if (user.logs.length === 0) {
      setCycleStatus({ title: 'No Data', subtitle: 'Log your period', color: 'bg-gray-100', dayCount: 0 });
      return;
    }

    // Find the latest start date of a period block
    // We assume logs are sorted. We look for the last log entry.
    // A better algo: Find the last log that is closest to today or in the past.
    const todayStr = new Date().toISOString().split('T')[0];
    const pastLogs = user.logs.filter(l => l <= todayStr);
    
    if (pastLogs.length === 0) {
       // Only future logs exist
       setCycleStatus({ title: 'Future Logged', subtitle: 'Wait for it', color: 'bg-pink-100', dayCount: 0 });
       return;
    }

    // Find the start of the most recent period cycle
    // Simple approach: Take the last logged date, assume it's part of the current cycle interaction
    // Complex approach: Group consecutive dates.
    
    // Let's rely on calculation from the *Start* of the cycle.
    // We need to find the start date of the most recent period block.
    // Reverse iterate logs, find a break > 1 day.
    
    let lastCycleStart = pastLogs[pastLogs.length - 1];
    for (let i = pastLogs.length - 1; i > 0; i--) {
      const curr = new Date(pastLogs[i]);
      const prev = new Date(pastLogs[i-1]);
      const diffDays = (curr.getTime() - prev.getTime()) / (1000 * 3600 * 24);
      
      if (diffDays > 2) {
        // Gap found, so pastLogs[i] is the start of the latest block
        lastCycleStart = pastLogs[i];
        break;
      }
      if (i === 1) {
         // If we get here, the whole array might be one block, or just one entry
         // check gap between 1 and 0
         const diff0 = (new Date(pastLogs[1]).getTime() - new Date(pastLogs[0]).getTime()) / (1000 * 3600 * 24);
         if (diff0 <= 2) lastCycleStart = pastLogs[0];
      }
    }

    const startObj = new Date(lastCycleStart);
    const todayObj = new Date();
    todayObj.setHours(0,0,0,0);
    startObj.setHours(0,0,0,0);

    const diffTime = todayObj.getTime() - startObj.getTime();
    const cycleDay = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

    // Check if currently bleeding (is today inside logs?)
    if (user.logs.includes(todayStr)) {
       setCycleStatus({
         title: 'Period',
         subtitle: 'Heavy flow possible',
         color: 'bg-brand-dark-pink',
         dayCount: cycleDay // Day X of cycle
       });
       return;
    }

    if (cycleDay > user.cycleLength) {
      setCycleStatus({
        title: 'Late',
        subtitle: 'Days late',
        color: 'bg-red-500',
        dayCount: cycleDay - user.cycleLength
      });
    } else if (cycleDay <= user.periodLength) {
       // Within period window but not logged?
       setCycleStatus({
        title: 'Period',
        subtitle: 'Spotting?',
        color: 'bg-brand-dark-pink',
        dayCount: cycleDay
      });
    } else {
      // Predicted phases
      const ovulationDay = user.cycleLength - 14;
      const daysUntilNext = user.cycleLength - cycleDay + 1;

      if (Math.abs(cycleDay - ovulationDay) <= 2) {
        setCycleStatus({
          title: 'Fertile',
          subtitle: 'High chance of pregnancy',
          color: 'bg-teal-400',
          dayCount: cycleDay
        });
      } else {
        setCycleStatus({
          title: 'Safe',
          subtitle: 'Period in...',
          color: 'bg-pink-300',
          dayCount: daysUntilNext
        });
      }
    }
  };

  // --- HANDLERS ---
  const handleDateClick = (day: number) => {
    const dateStr = formatDate(currentDate.getFullYear(), currentDate.getMonth(), day);
    userDataService.togglePeriodDate(user.id, dateStr);
    onUpdateUser();
  };

  const handleMonthChange = (offset: number) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1);
    setCurrentDate(newDate);
  };

  // --- RENDERING ---
  const renderCalendarGrid = () => {
    const totalDays = getDaysInMonth(currentDate);
    const startDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for start padding
    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10 w-10"></div>);
    }

    // Days
    for (let i = 1; i <= totalDays; i++) {
      const dateStr = formatDate(currentDate.getFullYear(), currentDate.getMonth(), i);
      const isLogged = user.logs.includes(dateStr);
      const isToday = isSameDay(new Date(), new Date(currentDate.getFullYear(), currentDate.getMonth(), i));

      days.push(
        <button
          key={i}
          onClick={() => handleDateClick(i)}
          className={`
            h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200
            ${isLogged 
              ? 'bg-brand-dark-pink text-white shadow-md scale-105' 
              : isToday 
                ? 'border-2 border-pink-400 text-pink-600 font-bold' 
                : 'hover:bg-pink-100 text-gray-700'}
          `}
        >
          {i}
        </button>
      );
    }
    return days;
  };

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col items-center py-8 px-4">
      
      {/* 1. CIRCULAR STATUS INDICATOR (Similar to Flo) */}
      <div className="relative w-72 h-72 mb-8 flex items-center justify-center">
        {/* Outer Ring */}
        <div className={`absolute inset-0 rounded-full opacity-20 ${cycleStatus.color === 'bg-red-500' ? 'bg-red-500' : 'bg-pink-500'}`}></div>
        
        {/* Main Circle */}
        <div className={`
          relative w-64 h-64 rounded-full shadow-2xl flex flex-col items-center justify-center text-white transition-colors duration-500
          ${cycleStatus.color}
        `}>
          <div className="text-center animate-in zoom-in duration-300">
            <span className="text-lg opacity-90 font-medium uppercase tracking-wide">{cycleStatus.title}</span>
            <div className="flex items-baseline justify-center gap-1 my-1">
              <span className="text-7xl font-bold font-serif">{cycleStatus.dayCount}</span>
              {cycleStatus.title === 'Safe' && <span className="text-xl">Days</span>}
            </div>
            <span className="text-sm opacity-90">{cycleStatus.subtitle}</span>
          </div>

          <button className="mt-6 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-6 py-2 rounded-full text-sm font-semibold transition-all">
            Edit Period Dates
          </button>
        </div>
      </div>

      {/* 2. CALENDAR CARD */}
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-6 animate-in slide-in-from-bottom duration-500">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => handleMonthChange(-1)} className="p-2 hover:bg-pink-50 rounded-full text-gray-600">
            <ChevronLeft size={20} />
          </button>
          <h2 className="text-xl font-bold text-gray-800 font-serif">
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h2>
          <button onClick={() => handleMonthChange(1)} className="p-2 hover:bg-pink-50 rounded-full text-gray-600">
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Days of Week */}
        <div className="grid grid-cols-7 mb-4">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
            <div key={i} className="text-center text-xs font-bold text-gray-400 uppercase">
              {d}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-y-4 justify-items-center">
          {renderCalendarGrid()}
        </div>
        
        {/* Legend / Info */}
        <div className="mt-8 flex justify-center gap-6 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-brand-dark-pink"></div>
            <span>Period</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-teal-400"></div>
            <span>Fertile</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full border-2 border-pink-400"></div>
            <span>Today</span>
          </div>
        </div>
      </div>

      {/* Settings Teaser */}
      <div className="mt-8 bg-white/50 p-4 rounded-xl flex items-center gap-4 cursor-pointer hover:bg-white/80 transition-colors">
        <div className="bg-pink-100 p-2 rounded-full text-pink-600">
          <Settings size={20} />
        </div>
        <div className="text-left">
          <p className="font-semibold text-gray-700">Cycle Settings</p>
          <p className="text-xs text-gray-500">Cycle: {user.cycleLength} Days • Period: {user.periodLength} Days</p>
        </div>
      </div>

    </div>
  );
};
