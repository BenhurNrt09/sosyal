"use client";

import { useEffect, useState } from "react";
import { Bell, CheckCircle, Info, AlertCircle, Wallet, MessageSquare, Clock } from "lucide-react";
import { getNotifications, markAsRead } from "@/actions/notifications";
import { Button } from "@repo/ui/src/components/ui/button";
import { createClient } from "@repo/lib/src/supabase";

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadNotifications();

        // Realtime Subscription
        const supabase = createClient();
        let subscription: any;

        async function setupRealtime() {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                subscription = supabase
                    .channel('user_notifications')
                    .on('postgres_changes', {
                        event: '*',
                        schema: 'public',
                        table: 'notifications',
                        filter: `user_id=eq.${user.id}`
                    }, () => {
                        loadNotifications(false); // Silent reload
                    })
                    .subscribe();
            }
        }

        setupRealtime();

        return () => {
            if (subscription) supabase.removeChannel(subscription);
        };
    }, []);

    async function loadNotifications(showLoading = true) {
        if (showLoading) setLoading(true);
        const result = await getNotifications();
        if (result.notifications) {
            setNotifications(result.notifications);
        }
        setLoading(false);
    }

    const handleMarkAsRead = async (id: string) => {
        await markAsRead(id);
        setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'payment': return <Wallet className="w-5 h-5 text-blue-500" />;
            case 'support': return <MessageSquare className="w-5 h-5 text-purple-500" />;
            case 'warning': return <AlertCircle className="w-5 h-5 text-orange-500" />;
            default: return <Info className="w-5 h-5 text-slate-400" />;
        }
    };

    return (
        <div className="space-y-6 pb-12">
            <div>
                <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight uppercase">BİLDİRİMLER</h1>
                <p className="text-slate-500 font-medium">Hesap hareketlerini ve duyuruları takip edin</p>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
                </div>
            ) : notifications.length > 0 ? (
                <div className="space-y-3">
                    {notifications.map((notification) => (
                        <div
                            key={notification.id}
                            onClick={() => !notification.is_read && handleMarkAsRead(notification.id)}
                            className={`bg-white rounded-[1.5rem] p-6 border transition-all cursor-pointer ${notification.is_read
                                ? "border-slate-100 opacity-75"
                                : "border-orange-100 bg-orange-50/20 shadow-sm"
                                }`}
                        >
                            <div className="flex gap-4">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${notification.is_read ? "bg-slate-100" : "bg-orange-100"
                                    }`}>
                                    {getTypeIcon(notification.type)}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className={`font-black tracking-tight ${notification.is_read ? "text-slate-600" : "text-slate-900"
                                            }`}>
                                            {notification.title}
                                        </h3>
                                        <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {new Date(notification.created_at).toLocaleDateString('tr-TR')}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-500 font-medium leading-relaxed">
                                        {notification.message}
                                    </p>
                                </div>
                                {!notification.is_read && (
                                    <div className="w-2 h-2 bg-orange-600 rounded-full mt-2"></div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 flex flex-col items-center justify-center min-h-[400px] text-center">
                    <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mb-6 shadow-inner">
                        <Bell className="w-8 h-8" />
                    </div>
                    <h2 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-wide">BİLDİRİM YOK</h2>
                    <p className="text-slate-400 text-sm font-bold tracking-wider uppercase">HENÜZ BİR BİLDİRİM ALMADINIZ.</p>
                </div>
            )}
        </div>
    );
}
