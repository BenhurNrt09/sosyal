"use client";

import { useEffect, useState } from "react";
import { Bell, Send, Search, Trash2, Users, Loader2, Info, CheckCircle, AlertCircle, Wallet, MessageSquare, X } from "lucide-react";
import { Button, Input, Card, CardContent } from "@repo/ui";
import { getAllNotifications, broadcastNotification, deleteNotification, markAllNotificationsAsRead } from "@/actions/notifications";
import { createClient } from "@repo/lib/src/supabase";

export default function AdminNotificationsPage() {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [sentCount, setSentCount] = useState(0);

    const [newNotification, setNewNotification] = useState({
        target: 'all' as 'all' | 'specific',
        specificUserId: '',
        title: '',
        message: '',
        type: 'info',
        link: ''
    });

    useEffect(() => {
        loadNotifications();

        // Realtime Subscription
        const supabase = createClient();
        const channel = supabase
            .channel('admin_notifications_page')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'notifications'
            }, () => {
                loadNotifications();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const loadNotifications = async () => {
        if (notifications.length === 0) setLoading(true);
        const result = await getAllNotifications();
        if (result.notifications) setNotifications(result.notifications);
        setLoading(false);
    };

    const handleBroadcast = async () => {
        if (!newNotification.title || !newNotification.message) {
            alert("Lütfen başlık ve mesaj girin.");
            return;
        }
        setIsSending(true);
        const result = await broadcastNotification(newNotification as any);
        if (result.success) {
            setSentCount(result.count || 0);
            setShowModal(false);
            setNewNotification({ target: 'all', specificUserId: '', title: '', message: '', type: 'info', link: '' });
            setShowSuccessModal(true);
            loadNotifications();
            // Sidebar'ı tetikle
            window.dispatchEvent(new CustomEvent('notifications-updated'));
        } else {
            alert("Hata: " + result.error);
        }
        setIsSending(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Bu bildirimi silmek istediğinize emin misiniz?")) return;
        const result = await deleteNotification(id);
        if (result.success) {
            setNotifications(notifications.filter(n => n.id !== id));
        }
    };

    const handleMarkAllAsRead = async () => {
        if (!confirm("Tüm bildirimleri okundu olarak işaretlemek istediğinize emin misiniz?")) return;
        const result = await markAllNotificationsAsRead();
        if (result.success) {
            loadNotifications();
            // Sidebar'ı tetikle
            window.dispatchEvent(new CustomEvent('notifications-updated'));
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'success': return <CheckCircle className="w-4 h-4 text-emerald-500" />;
            case 'payment': return <Wallet className="w-4 h-4 text-blue-500" />;
            case 'support': return <MessageSquare className="w-4 h-4 text-cyan-500" />;
            case 'warning': return <AlertCircle className="w-4 h-4 text-orange-500" />;
            default: return <Info className="w-4 h-4 text-slate-400" />;
        }
    };

    const filteredNotifications = notifications.filter(n =>
        n.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.profiles?.username?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Panel</h1>
                    <p className="mt-1 text-slate-500 dark:text-slate-400 font-medium tracking-tight uppercase text-[10px] tracking-widest opacity-70">Sistem Bildirim Merkezi</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        onClick={handleMarkAllAsRead}
                        variant="outline"
                        className="border-slate-100 dark:border-slate-800 dark:text-slate-300 font-black rounded-2xl h-12 px-6 uppercase tracking-tight text-xs"
                    >
                        Tümünü Okundu İşaretle
                    </Button>
                    <Button
                        onClick={() => setShowModal(true)}
                        className="bg-cyan-600 hover:bg-cyan-700 text-white font-black rounded-2xl h-12 px-6 shadow-xl shadow-cyan-200 uppercase tracking-tight text-xs flex items-center gap-2"
                    >
                        <Send className="h-4 w-4" />
                        Yeni Bildirim
                    </Button>
                </div>
            </div>

            <Card className="rounded-[2.5rem] border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 dark:backdrop-blur-sm shadow-sm overflow-hidden">
                <CardContent className="p-0">
                    <div className="p-8 border-b border-slate-50 dark:border-slate-800">
                        <div className="relative">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                placeholder="Bildirimlerde veya kullanıcı adında ara..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full h-14 pl-14 pr-8 bg-slate-50 dark:bg-slate-800/30 border-none rounded-2xl text-sm font-black text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-4 focus:ring-cyan-500/10 transition-all font-sans"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-50 dark:border-slate-800">
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">KULLANICI</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">BİLDİRİM İÇERİĞİ</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">TİP</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">DURUM</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">İŞLEMLER</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                {loading && notifications.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-24 text-center">
                                            <Loader2 className="w-12 h-12 animate-spin text-cyan-600 mx-auto" />
                                        </td>
                                    </tr>
                                ) : filteredNotifications.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-24 text-center text-slate-400 font-black uppercase text-[10px] tracking-[0.2em]">
                                            Kayıtlı bildirim bulunamadı
                                        </td>
                                    </tr>
                                ) : (
                                    filteredNotifications.map((notif) => (
                                        <tr key={notif.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[11px] font-black text-slate-500 border border-white/10">
                                                        {(notif.profiles?.username || 'G').charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-black text-slate-900 dark:text-white tracking-tight">{notif.profiles?.username || 'GENEL BROADCAST'}</div>
                                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{notif.profiles?.email || 'Global Sistem Mesajı'}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 max-w-md">
                                                <div className="text-sm font-black text-slate-800 dark:text-slate-100 tracking-tight">{notif.title}</div>
                                                <div className="text-xs font-medium text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">{notif.message}</div>
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    {getTypeIcon(notif.type)}
                                                    <span className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">{notif.type}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${notif.is_read ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400' : 'bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400'}`}>
                                                    {notif.is_read ? 'OKUNDU' : 'BEKLEMEDE'}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <button
                                                    onClick={() => handleDelete(notif.id)}
                                                    className="h-10 w-10 flex items-center justify-center rounded-xl bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition-all shadow-sm border border-rose-100 dark:border-rose-800 group-hover:opacity-100 opacity-0"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Modals are kept with improved styling */}
            {showSuccessModal && (
                <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-md z-[60] flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-12 w-full max-w-md shadow-2xl animate-in zoom-in duration-300 flex flex-col items-center text-center border border-slate-100 dark:border-slate-800">
                        <div className="w-24 h-24 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mb-8 shadow-inner">
                            <CheckCircle className="w-12 h-12 text-emerald-600 dark:text-emerald-500" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-3 uppercase tracking-tight">TEBRİKLER!</h2>
                        <p className="text-slate-500 dark:text-slate-400 font-bold mb-10 text-sm">
                            Bildirimlerin toplam <span className="text-emerald-600 dark:text-emerald-500 font-black">{sentCount}</span> kullanıcıya başarıyla gönderildi.
                        </p>
                        <Button
                            onClick={() => setShowSuccessModal(false)}
                            className="w-full h-14 bg-cyan-600 hover:bg-cyan-700 text-white font-black rounded-[1.2rem] shadow-xl shadow-cyan-200 uppercase tracking-widest text-xs"
                        >
                            ANLADIM
                        </Button>
                    </div>
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 w-full max-w-xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-y-auto max-h-[90vh] no-scrollbar">
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">YENİ BİLDİRİM</h2>
                                <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] mt-2">GLOBAL VEYA ÖZEL MESAJ GÖNDERİMİ</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center justify-center transition-all">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="space-y-8">
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => setNewNotification({ ...newNotification, target: 'all' })}
                                    className={`h-24 rounded-[1.8rem] border-2 flex flex-col items-center justify-center gap-2 transition-all ${newNotification.target === 'all'
                                        ? 'border-cyan-600 bg-cyan-50 dark:bg-cyan-900/10'
                                        : 'border-slate-50 dark:border-slate-800 hover:border-cyan-200'}`}
                                >
                                    <Users className={`w-7 h-7 ${newNotification.target === 'all' ? 'text-cyan-600' : 'text-slate-300'}`} />
                                    <span className={`text-[10px] font-black tracking-widest ${newNotification.target === 'all' ? 'text-cyan-600' : 'text-slate-400'}`}>TÜM KULLANICILAR</span>
                                </button>
                                <button
                                    onClick={() => setNewNotification({ ...newNotification, target: 'specific' })}
                                    className={`h-24 rounded-[1.8rem] border-2 flex flex-col items-center justify-center gap-2 transition-all ${newNotification.target === 'specific'
                                        ? 'border-cyan-600 bg-cyan-50 dark:bg-cyan-900/10'
                                        : 'border-slate-50 dark:border-slate-800 hover:border-cyan-200'}`}
                                >
                                    <Bell className={`w-7 h-7 ${newNotification.target === 'specific' ? 'text-cyan-600' : 'text-slate-300'}`} />
                                    <span className={`text-[10px] font-black tracking-widest ${newNotification.target === 'specific' ? 'text-cyan-600' : 'text-slate-400'}`}>TEK BİR KULLANICI</span>
                                </button>
                            </div>

                            {newNotification.target === 'specific' && (
                                <div className="space-y-2 animate-in slide-in-from-top-4 duration-500">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">KULLANICI ID (UUID)</label>
                                    <input
                                        value={newNotification.specificUserId}
                                        onChange={(e) => setNewNotification({ ...newNotification, specificUserId: e.target.value })}
                                        placeholder="00000000-0000-0000-0000-000000000000"
                                        className="w-full h-14 px-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border-none font-mono text-xs dark:text-white placeholder:text-slate-300 focus:ring-4 focus:ring-cyan-500/10 transition-all font-black"
                                    />
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">BİLDİRİM BAŞLIĞI</label>
                                <input
                                    value={newNotification.title}
                                    onChange={(e) => setNewNotification({ ...newNotification, title: e.target.value })}
                                    placeholder="Örn: Hafta Sonu Özel Bonusu!"
                                    className="w-full h-14 px-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border-none text-sm font-black dark:text-white placeholder:text-slate-300 focus:ring-4 focus:ring-cyan-500/10 transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">MESAJ İÇERİĞİ</label>
                                <textarea
                                    value={newNotification.message}
                                    onChange={(e) => setNewNotification({ ...newNotification, message: e.target.value })}
                                    placeholder="Bildirim detaylarını buraya yazın..."
                                    className="w-full min-h-[140px] rounded-[1.8rem] bg-slate-50 dark:bg-slate-800/50 border-none p-6 text-sm font-bold dark:text-white placeholder:text-slate-300 focus:ring-4 focus:ring-cyan-500/10 transition-all resize-none shadow-inner"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">TİP</label>
                                    <select
                                        value={newNotification.type}
                                        onChange={(e) => setNewNotification({ ...newNotification, type: e.target.value })}
                                        className="w-full h-14 rounded-2xl bg-slate-50 dark:bg-slate-800/50 px-5 text-xs font-black uppercase tracking-widest focus:outline-none dark:text-white cursor-pointer"
                                    >
                                        <option value="info">DUYURU</option>
                                        <option value="success">BAŞARI</option>
                                        <option value="warning">UYARI</option>
                                        <option value="payment">ÖDEME</option>
                                        <option value="support">DESTEK</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">YÖNLENDİRME (UPSİYONEL)</label>
                                    <input
                                        value={newNotification.link}
                                        onChange={(e) => setNewNotification({ ...newNotification, link: e.target.value })}
                                        placeholder="/tasks veya /wallet"
                                        className="w-full h-14 px-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border-none text-xs font-black dark:text-white focus:ring-4 focus:ring-cyan-500/10 transition-all font-mono"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 h-16 rounded-[1.2rem] border-slate-100 dark:border-slate-800 font-black uppercase tracking-widest text-[10px]"
                                >
                                    İPTAL
                                </Button>
                                <Button
                                    onClick={handleBroadcast}
                                    disabled={isSending}
                                    className="flex-[2] h-16 bg-cyan-600 hover:bg-cyan-700 text-white font-black rounded-[1.2rem] shadow-xl shadow-cyan-200 uppercase tracking-widest text-[10px] flex items-center justify-center gap-3"
                                >
                                    {isSending ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            <Send className="h-5 w-5" />
                                            BİLDİRİMİ YAYINLA
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
