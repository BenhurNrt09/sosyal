"use client";

import { useEffect, useState } from "react";
import { Bell, Send, Search, Trash2, Users, Loader2, Info, CheckCircle, AlertCircle, Wallet, MessageSquare } from "lucide-react";
import { Button, Input } from "@repo/ui";
import { getAllNotifications, broadcastNotification, deleteNotification } from "@/actions/notifications";

export default function AdminNotificationsPage() {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [isSending, setIsSending] = useState(false);

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
    }, []);

    const loadNotifications = async () => {
        setLoading(true);
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
            alert(`${result.count} kullanıcıya bildirim başarıyla gönderildi.`);
            setShowModal(false);
            setNewNotification({ target: 'all', specificUserId: '', title: '', message: '', type: 'info', link: '' });
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

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'payment': return <Wallet className="w-4 h-4 text-blue-500" />;
            case 'support': return <MessageSquare className="w-4 h-4 text-purple-500" />;
            case 'warning': return <AlertCircle className="w-4 h-4 text-orange-500" />;
            default: return <Info className="w-4 h-4 text-slate-400" />;
        }
    };

    const filteredNotifications = notifications.filter(n =>
        n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.profiles?.username?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Sistem Bildirimleri</h1>
                    <p className="mt-1 text-slate-500">Kullanıcılara toplu veya özel bildirimler gönderin</p>
                </div>
                <Button
                    onClick={() => setShowModal(true)}
                    className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold rounded-xl"
                >
                    <Send className="mr-2 h-4 w-4" />
                    Yeni Bildirim Gönder
                </Button>
            </div>

            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
                <div className="mb-6 flex items-center gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <Input
                            placeholder="Bildirimlerde veya kullanıcı adında ara..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-11 h-12 rounded-xl border-slate-100 bg-slate-50 focus:bg-white transition-all"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
                        </div>
                    ) : (
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50">
                                    <th className="pb-4">KULLANICI</th>
                                    <th className="pb-4">BİLDİRİM</th>
                                    <th className="pb-4">TİP</th>
                                    <th className="pb-4">TARİH</th>
                                    <th className="pb-4 text-right">İŞLEMLER</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredNotifications.map((notif) => (
                                    <tr key={notif.id} className="group">
                                        <td className="py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                                                    {(notif.profiles?.username || 'G').charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-slate-900">{notif.profiles?.username || 'Genel'}</div>
                                                    <div className="text-[10px] text-slate-400">{notif.profiles?.email || 'Global Broadcast'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 max-w-xs md:max-w-md">
                                            <div className="text-sm font-bold text-slate-800">{notif.title}</div>
                                            <div className="text-xs text-slate-500 line-clamp-1">{notif.message}</div>
                                        </td>
                                        <td className="py-4">
                                            <div className="flex items-center gap-2">
                                                {getTypeIcon(notif.type)}
                                                <span className="text-[10px] font-bold text-slate-500 uppercase">{notif.type}</span>
                                            </div>
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
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Broadcast Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2.5rem] p-10 w-full max-w-xl shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 tracking-tight">YENİ BİLDİRİM</h2>
                                <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-1">Global veya Özel Mesaj</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="w-10 h-10 rounded-full bg-slate-50 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => setNewNotification({ ...newNotification, target: 'all' })}
                                    className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${newNotification.target === 'all' ? 'border-violet-600 bg-violet-50' : 'border-slate-50 hover:border-violet-200'
                                        }`}
                                >
                                    <Users className={`w-6 h-6 ${newNotification.target === 'all' ? 'text-violet-600' : 'text-slate-300'}`} />
                                    <span className={`text-xs font-black ${newNotification.target === 'all' ? 'text-violet-600' : 'text-slate-400'}`}>TÜMÜNE</span>
                                </button>
                                <button
                                    onClick={() => setNewNotification({ ...newNotification, target: 'specific' })}
                                    className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${newNotification.target === 'specific' ? 'border-violet-600 bg-violet-50' : 'border-slate-50 hover:border-violet-200'
                                        }`}
                                >
                                    <Bell className={`w-6 h-6 ${newNotification.target === 'specific' ? 'text-violet-600' : 'text-slate-300'}`} />
                                    <span className={`text-xs font-black ${newNotification.target === 'specific' ? 'text-violet-600' : 'text-slate-400'}`}>ÖZEL</span>
                                </button>
                            </div>

                            {newNotification.target === 'specific' && (
                                <div className="animate-in slide-in-from-top-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block tracking-widest">KULLANICI ID (UUID)</label>
                                    <Input
                                        value={newNotification.specificUserId}
                                        onChange={(e) => setNewNotification({ ...newNotification, specificUserId: e.target.value })}
                                        placeholder="00000000-0000-0000-0000-000000000000"
                                        className="h-12 rounded-xl border-slate-100 bg-slate-50 font-mono text-xs"
                                    />
                                </div>
                            )}

                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block tracking-widest">BİLDİRİM BAŞLIĞI</label>
                                <Input
                                    value={newNotification.title}
                                    onChange={(e) => setNewNotification({ ...newNotification, title: e.target.value })}
                                    placeholder="Örn: Hafta Sonu Bonusu!"
                                    className="h-12 rounded-xl border-slate-100 bg-slate-50 font-bold"
                                />
                            </div>

                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block tracking-widest">MESAJ İÇERİĞİ</label>
                                <textarea
                                    value={newNotification.message}
                                    onChange={(e) => setNewNotification({ ...newNotification, message: e.target.value })}
                                    placeholder="Bildirim detaylarını buraya yazın..."
                                    className="w-full min-h-[120px] rounded-2xl border-slate-100 bg-slate-50 p-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-violet-600/20 transition-all resize-none"
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
                                        className="h-12 rounded-xl border-slate-100 bg-slate-50"
                                    />
                                </div>
                            </div>

                            <Button
                                onClick={handleBroadcast}
                                disabled={isSending}
                                className="w-full h-14 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-violet-200 mt-4 active:scale-[0.98] transition-all"
                            >
                                {isSending ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        <Send className="mr-2 h-5 w-5" />
                                        İNDİRİMLERİ GÖNDER
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
