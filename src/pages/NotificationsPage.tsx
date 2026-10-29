import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LiquidGlassCard, LiquidGlassBadge } from '../components/LiquidGlass';
import { 
  Bell, 
  CheckCheck, 
  ShieldAlert, 
  UserCheck, 
  CheckCircle2, 
  Info, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const { 
    notifications, 
    markNotificationRead, 
    markAllNotificationsRead, 
    setSelectedTrackRequestId, 
    setActiveTab,
    currentUser 
  } = useApp();

  const [filter, setFilter] = useState<'all' | 'unread' | 'emergency'>('all');

  const relevantNotifications = notifications.filter(n => {
    if (currentUser.role === 'guest') return true;
    return n.roleTarget === 'all' || n.roleTarget === currentUser.role;
  });

  const filtered = relevantNotifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'emergency') return n.type === 'emergency';
    return true;
  });

  const handleNotificationClick = (item: any) => {
    markNotificationRead(item.id);
    if (item.relatedRequestId) {
      setSelectedTrackRequestId(item.relatedRequestId);
      setActiveTab('track');
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'emergency':
        return <ShieldAlert className="w-5 h-5 text-rose-600" />;
      case 'assignment':
        return <UserCheck className="w-5 h-5 text-[#52b788]" />;
      case 'completion':
        return <CheckCircle2 className="w-5 h-5 text-[#52b788]" />;
      default:
        return <Info className="w-5 h-5 text-stone-500" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200/80">
        <div>
          <LiquidGlassBadge variant="emerald" size="sm">
            <Sparkles className="w-3 h-3 text-[#2d6a4f]" />
            <span>Activity & Live Alerts</span>
          </LiquidGlassBadge>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1b4332] tracking-tight mt-1.5">
            System Notifications
          </h1>
          <p className="text-xs sm:text-sm text-stone-600">
            Real-time status alerts for assistance dispatches, assignments, and government bulletins.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={markAllNotificationsRead}
            className="btn-glass-secondary px-4 py-2 rounded-full text-xs font-bold text-[#1b4332] flex items-center gap-1.5 cursor-pointer"
          >
            <CheckCheck className="w-4 h-4 text-[#52b788]" />
            <span>Mark All as Read</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs with Glass Styling */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold cursor-pointer transition-all ${
            filter === 'all' 
              ? 'bg-[#1b4332] text-white shadow-xs' 
              : 'bg-white/80 hover:bg-white text-stone-700 border border-stone-200'
          }`}
        >
          All Notifications ({relevantNotifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold cursor-pointer transition-all ${
            filter === 'unread' 
              ? 'bg-[#1b4332] text-white shadow-xs' 
              : 'bg-white/80 hover:bg-white text-stone-700 border border-stone-200'
          }`}
        >
          Unread ({relevantNotifications.filter(n => !n.read).length})
        </button>
        <button
          onClick={() => setFilter('emergency')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold cursor-pointer transition-all ${
            filter === 'emergency' 
              ? 'bg-rose-600 text-white shadow-xs' 
              : 'bg-white/80 hover:bg-white text-stone-700 border border-stone-200'
          }`}
        >
          Emergencies ({relevantNotifications.filter(n => n.type === 'emergency').length})
        </button>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <LiquidGlassCard variant="default" className="p-12 text-center text-xs text-stone-500 space-y-2 shadow-xs">
          <Bell className="w-8 h-8 text-stone-300 mx-auto" />
          <p className="font-bold text-stone-700">No notifications to display</p>
          <p>You are all caught up with your alerts.</p>
        </LiquidGlassCard>
      ) : (
        <LiquidGlassCard variant="default" className="overflow-hidden shadow-md divide-y divide-stone-100 p-0">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => handleNotificationClick(item)}
              className={`p-5 flex items-start justify-between gap-4 cursor-pointer transition-all ${
                !item.read ? 'bg-[#f0fbf5]/80 hover:bg-[#ebfbee]' : 'hover:bg-white/80'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className={`p-2.5 rounded-2xl shrink-0 ${
                  item.type === 'emergency' ? 'bg-rose-100 shadow-2xs' : 'bg-white shadow-2xs'
                }`}>
                  {getIcon(item.type)}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className={`text-sm ${!item.read ? 'font-black text-[#1b4332]' : 'font-semibold text-stone-700'}`}>
                      {item.title}
                    </h3>
                    {!item.read && (
                      <span className="w-2 h-2 rounded-full bg-[#52b788] shrink-0 animate-pulse" />
                    )}
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {item.message}
                  </p>
                  <div className="text-[10px] text-stone-400 pt-0.5">
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {new Date(item.timestamp).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {item.relatedRequestId && (
                <div className="shrink-0 flex items-center gap-1 text-xs text-[#40916c] font-bold pt-1">
                  <span>Track</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))}
        </LiquidGlassCard>
      )}

    </div>
  );
};
