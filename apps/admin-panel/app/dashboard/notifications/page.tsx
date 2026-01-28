"use client";

import { useEffect, useState } from "react";
import { Bell, Send, Search, Trash2, Users, Loader2, Info, CheckCircle, AlertCircle, Wallet, MessageSquare, X } from "lucide-react";
import { Button, Input } from "@repo/ui";
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
            .channel('admin_notifications')
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
        // Only show loading on initial fetch
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
            // Realtime will fetch the list, but we call it just in case
            loadNotifications();
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
        if (!confirm("Tüm bildirimlerinizi okundu olarak işaretlemek istediğinize emin misiniz?")) return;
        const result = await markAllNotificationsAsRead();
        if (result.success) {
            loadNotifications();
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
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
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Sistem Bildirimleri</h1>
                    <p className="mt-1 text-slate-500 dark:text-slate-400 font-medium">Kullanıcılara toplu veya özel bildirimler gönderin</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        onClick={handleMarkAllAsRead}
                        variant="outline"
                        className="border-slate-200 dark:border-slate-800 dark:text-slate-300 font-bold rounded-xl"
                    >
                        Tümünü Okundu İşaretle
                    </Button>
                    <Button
                        onClick={() => setShowModal(true)}
                        className="bg-cyan-600 hover:bg-cyan-700 text-white font-black rounded-xl shadow-lg shadow-cyan-200"
                    >
                        <Send className="mr-2 h-4 w-4" />
                        Yeni Bildirim Gönder
                    </Button>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-sm border border-slate-100 dark:border-slate-800">
                <div className="mb-6 flex items-center gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <Input
                            placeholder="Bildirimlerde veya kullanıcı adında ara..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-11 h-12 rounded-xl border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-800 transition-all dark:text-white"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-cyan-600" />
                        </div>
                    ) : (
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50 dark:border-slate-800">
                                    <th className="pb-4">KULLANICI</th>
                                    <th className="pb-4">BİLDİRİM</th>
                                    <th className="pb-4">TİP</th>
                                    <th className="pb-4">DURUM</th>
                                    <th className="pb-4">TARİH</th>
                                    <th className="pb-4 text-right">İŞLEMLER</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredNotifications.map((notif) => (
                                    <tr key={notif.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-500">
                                                    {(notif.profiles?.username || 'G').charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-slate-900 dark:text-white">{notif.profiles?.username || 'Genel'}</div>
                                                    <div className="text-[10px] text-slate-400">{notif.profiles?.email || 'Global Broadcast'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 max-w-xs md:max-w-md">
                                            <div className="text-sm font-bold text-slate-800 dark:text-slate-100">{notif.title}</div>
                                            <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{notif.message}</div>
                                        </td>
                                        <td className="py-4">
                                            <div className="flex items-center gap-2">
                                                {getTypeIcon(notif.type)}
                                                <span className="text-[10px] font-bold text-slate-500 uppercase">{notif.type}</span>
                                            </div>
                                        </td>
                                        <td className="py-4">
                                            {notif.is_read ? (
                                                <span className="text-[10px] font-bold text-green-500 bg-green-50 dark:bg-green-500/10 px-2 py-1 rounded-full uppercase">Okundu</span>
                                            ) : (
                                                <span className="text-[10px] font-bold text-amber-500 bg-amber-50 dark:bg-amber-500/10 px-2 py-1 rounded-full uppercase">Beklemede</span>
                                            )}
                                        </td>
                                        <td className="py-4 text-xs text-slate-400 font-medium">
                                            {new Date(notif.created_at).toLocaleDateString('tr-TR')}
                                        </td>
                                        <td className="py-4 text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDelete(notif.id)}
                                                className="text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg group-hover:opacity-100 opacity-0 transition-all"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredNotifications.length === 0 && !loading && (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center text-slate-400 text-sm font-medium">
                                            Kayıtlı bildirim bulunamadı.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Success Popup */}
            {showSuccessModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[60] flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-300 flex flex-col items-center text-center">
                        <div className="w-20 h-20 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                            <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-500" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tight">İŞLEM BAŞARILI!</h2>
                        <p className="text-slate-500 dark:text-slate-400 font-medium mb-8">
                            Bildirimleriniz toplam <span className="text-green-600 dark:text-green-500 font-bold">{sentCount}</span> kullanıcıya başarıyla iletildi.
                        </p>
                        <Button
                            onClick={() => setShowSuccessModal(false)}
                            className="w-full h-14 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-2xl shadow-lg shadow-cyan-200"
                        >
                            TAMAM
                        </Button>
                    </div>
                </div>
            )}

            {/* Broadcast Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 w-full max-w-xl shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">YENİ BİLDİRİM</h2>
                                <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-1">Global veya Özel Mesaj</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center justify-center transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => setNewNotification({ ...newNotification, target: 'all' })}
                                    className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${newNotification.target === 'all' ? 'border-primary bg-primary/10' : 'border-slate-50 dark:border-slate-800 hover:border-primary/50'
                                        }`}
                                >
                                    <Users className={`w-6 h-6 ${newNotification.target === 'all' ? 'text-primary' : 'text-slate-300'}`} />
                                    <span className={`text-xs font-black ${newNotification.target === 'all' ? 'text-primary' : 'text-slate-400'}`}>TÜMÜNE</span>
                                </button>
                                <button
                                    onClick={() => setNewNotification({ ...newNotification, target: 'specific' })}
                                    className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${newNotification.target === 'specific' ? 'border-primary bg-primary/10' : 'border-slate-50 dark:border-slate-800 hover:border-primary/50'
                                        }`}
                                >
                                    <Bell className={`w-6 h-6 ${newNotification.target === 'specific' ? 'text-primary' : 'text-slate-300'}`} />
                                    <span className={`text-xs font-black ${newNotification.target === 'specific' ? 'text-primary' : 'text-slate-400'}`}>ÖZEL</span>
                                </button>
                            </div>

                            {newNotification.target === 'specific' && (
                                <div className="animate-in slide-in-from-top-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block tracking-widest">KULLANICI ID (UUID)</label>
                                    <Input
                                        value={newNotification.specificUserId}
                                        onChange={(e) => setNewNotification({ ...newNotification, specificUserId: e.target.value })}
                                        placeholder="00000000-0000-0000-0000-000000000000"
                                        className="h-12 rounded-xl border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-mono text-xs dark:text-white"
                                    />
                                </div>
                            )}

                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block tracking-widest">BİLDİRİM BAŞLIĞI</label>
                                <Input
                                    value={newNotification.title}
                                    onChange={(e) => setNewNotification({ ...newNotification, title: e.target.value })}
                                    placeholder="Örn: Hafta Sonu Bonusu!"
                                    className="h-12 rounded-xl border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-bold dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block tracking-widest">MESAJ İÇERİĞİ</label>
                                <textarea
                                    value={newNotification.message}
                                    onChange={(e) => setNewNotification({ ...newNotification, message: e.target.value })}
                                    placeholder="Bildirim detaylarını buraya yazın..."
                                    className="w-full min-h-[120px] rounded-2xl border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 p-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none dark:text-white"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block tracking-widest">TİP</label>
                                    <select
                                        value={newNotification.type}
                                        onChange={(e) => setNewNotification({ ...newNotification, type: e.target.value })}
                                        className="w-full h-12 rounded-xl border-slate-100 bg-slate-50 px-4 text-sm font-bold focus:outline-none"
                                    >
                                        <option value="info">Duyuru</option>
                                        <option value="success">Başarı</option>
                                        <option value="warning">Uyarı</option>
                                        <option value="payment">Ödeme</option>
                                        <option value="support">Destek</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block tracking-widest">LİNK (OPSİYONEL)</label>
                                    <Input
                                        value={newNotification.link}
                                        onChange={(e) => setNewNotification({ ...newNotification, link: e.target.value })}
                                        placeholder="/tasks veya /wallet"
                                        className="h-12 rounded-xl border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 dark:text-white"
                                    />
                                </div>
                            </div>

                            <Button
                                onClick={handleBroadcast}
                                disabled={isSending}
                                className="w-full h-14 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 mt-4 active:scale-[0.98] transition-all"
                            >
                                {isSending ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        <Send className="mr-2 h-5 w-5" />
                                        BİLDİRİMİ GÖNDER
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
