"use client";

import { useEffect, useState } from "react";
import {
    Search,
    Reply,
    Trash2,
    Loader2,
    MessageSquare,
    Clock,
    CheckCircle2,
    X,
    Send
} from "lucide-react";
import {
    getSupportTickets,
    deleteSupportTicket,
    replyToSupportTicket
} from "@/actions/support";
import { createClient } from "@repo/lib/src/supabase";
import {
    Button,
    Input,
    Label,
    Card,
    CardContent
} from "@repo/ui";

export default function SupportPage() {
    const [tickets, setTickets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedTicket, setSelectedTicket] = useState<any>(null);
    const [answer, setAnswer] = useState("");
    const [sending, setSending] = useState(false);
    const [userDisplayName, setUserDisplayName] = useState("Sistem Yöneticisi");
    const [stats, setStats] = useState({
        total: 0,
        open: 0,
        replied: 0
    });

    useEffect(() => {
        loadTickets();
        const supabase = createClient();
        const ch = supabase.channel('support_changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'support_tickets' }, () => loadTickets(false))
            .subscribe();

        return () => {
            supabase.removeChannel(ch);
        };
    }, []);

    async function loadTickets(showLoading = true) {
        if (showLoading) setLoading(true);
        const result = await getSupportTickets();
        if (result.data) {
            setTickets(result.data);
            const open = result.data.filter((t: any) => t.status === 'open' || t.status === 'pending').length;
            const replied = result.data.filter((t: any) => t.status === 'replied').length;
            setStats({
                total: result.data.length,
                open,
                replied
            });
        }
        setLoading(false);
    }

    const handleAnswerSubmit = async () => {
        if (!answer.trim() || !selectedTicket) return;
        setSending(true);
        const result = await replyToSupportTicket(
            selectedTicket.id,
            answer,
            selectedTicket.user_id,
            selectedTicket.subject
        );
        if (result.success) {
            setSelectedTicket(null);
            setAnswer("");
            loadTickets(false);
        } else {
            alert("Hata: " + result.error);
        }
        setSending(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Bu talebi silmek istediğinize emin misiniz?")) return;
        const result = await deleteSupportTicket(id);
        if (result.success) {
            loadTickets(false);
        } else {
            alert("Hata: " + result.error);
        }
    };

    const filteredTickets = tickets.filter(ticket =>
        ticket.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.profiles?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Panel</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Hoş geldin, <span className="text-slate-900 dark:text-white font-bold">{userDisplayName}</span></p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                {/* Stats Cards */}
                <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/20 text-blue-600">
                            <MessageSquare className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Toplam Mesaj</p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.total}</p>
                        </div>
                    </div>
                </div>
                <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 dark:bg-orange-900/20 text-orange-600">
                            <Clock className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Bekleyen</p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.open}</p>
                        </div>
                    </div>
                </div>
                <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 dark:bg-green-900/20 text-green-600">
                            <CheckCircle2 className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Cevaplanan</p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.replied}</p>
                        </div>
                    </div>
                </div>
            </div>

            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Destek Talepleri</h2>

            <Card className="rounded-[2rem] border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 dark:backdrop-blur-sm shadow-sm overflow-hidden">
                <CardContent className="p-0">
                    <div className="p-6 border-b border-slate-50 dark:border-slate-800">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Taleplerde ara..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-6 py-4 bg-slate-50 dark:bg-slate-800/30 border-none rounded-2xl text-sm font-bold text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-cyan-500/20 transition-all font-sans"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-50 dark:border-slate-800">
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">KULLANICI</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">KONU</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">DURUM</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">TARİH</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">İŞLEMLER</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="py-20 text-center">
                                            <Loader2 className="w-10 h-10 animate-spin text-cyan-600 mx-auto" />
                                        </td>
                                    </tr>
                                ) : filteredTickets.length > 0 ? (
                                    filteredTickets.map((ticket) => (
                                        <tr key={ticket.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-cyan-100 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold shadow-sm">
                                                        {(ticket.profiles?.username || 'U').charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="text-sm font-black text-slate-900 dark:text-slate-100 truncate">{ticket.profiles?.username || 'Kullanıcı'}</div>
                                                        <div className="text-[11px] font-bold text-slate-400 truncate">{ticket.profiles?.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="text-sm font-bold text-slate-700 dark:text-slate-300 line-clamp-1 truncate max-w-[200px]">{ticket.subject}</div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`text-[9px] font-black px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 shadow-sm ${ticket.status === 'open' || ticket.status === 'pending' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400' :
                                                    ticket.status === 'closed' ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400' :
                                                        'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400'
                                                    }`}>
                                                    <div className={`w-1 h-1 rounded-full ${ticket.status === 'open' || ticket.status === 'pending' ? 'bg-amber-500' :
                                                        ticket.status === 'closed' ? 'bg-slate-500' : 'bg-emerald-500'
                                                        }`} />
                                                    {ticket.status === 'open' || ticket.status === 'pending' ? 'BEKLEYEN' : ticket.status === 'closed' ? 'KAPANDI' : 'CEVAPLANDI'}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                <div className="text-[11px] font-bold text-slate-400">{new Date(ticket.created_at).toLocaleDateString('tr-TR')}</div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedTicket(ticket);
                                                            setAnswer(ticket.admin_response || "");
                                                        }}
                                                        className="p-2.5 rounded-xl bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-100 dark:hover:bg-cyan-900/40 transition-all shadow-sm"
                                                        title="Cevapla"
                                                    >
                                                        <Reply className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(ticket.id)}
                                                        className="p-2.5 rounded-xl bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/40 transition-all shadow-sm"
                                                        title="Sil"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="py-20 text-center text-slate-400 font-bold">
                                            Gösterilecek destek talebi bulunmuyor.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Manual Modal */}
            {selectedTicket && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="w-full max-w-[500px] bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Talebi Cevapla</h3>
                            <button onClick={() => setSelectedTicket(null)} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                                <X className="w-5 h-5 text-slate-400" />
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Konu</div>
                                <div className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4">{selectedTicket.subject}</div>
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Mesaj</div>
                                <div className="text-sm text-slate-600 dark:text-slate-400">{selectedTicket.message}</div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Cevabınız</Label>
                                <textarea
                                    value={answer}
                                    onChange={(e) => setAnswer(e.target.value)}
                                    className="w-full h-40 p-5 rounded-[1.5rem] bg-slate-50 dark:bg-slate-800/30 border-none text-sm font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:ring-4 focus:ring-cyan-500/10 transition-all resize-none font-sans"
                                    placeholder="Mesajınızı buraya yazın..."
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setSelectedTicket(null)}
                                    className="flex-1 rounded-2xl h-14 border-slate-100 dark:border-slate-800 font-bold uppercase tracking-tight"
                                >
                                    İptal
                                </Button>
                                <Button
                                    onClick={handleAnswerSubmit}
                                    disabled={sending || !answer.trim()}
                                    className="flex-[1.5] bg-cyan-600 hover:bg-cyan-700 text-white rounded-2xl h-14 font-black gap-2 uppercase tracking-tight shadow-xl shadow-cyan-200"
                                >
                                    {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                                    Cevapla
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
