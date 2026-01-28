"use client";

import { MessageSquare, Search, MoreVertical, Loader2, CheckCircle, Clock, Trash2, Reply } from "lucide-react";
import { Button, Input } from "@repo/ui";
import { useState, useEffect } from "react";
import { createClient } from "@repo/lib/src/supabase";
import { replyToSupportTicket, deleteSupportTicket } from "@/actions/support";

export default function SupportAdminPage() {
    const [tickets, setTickets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        replied: 0
    });

    useEffect(() => {
        fetchTickets();
    }, []);

    async function fetchTickets() {
        setLoading(true);
        const supabase = createClient();

        const { data, error } = await supabase
            .from("support_tickets")
            .select("*, profiles:user_id(username, full_name, email)")
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching tickets:", error);
        } else {
            setTickets(data || []);
            setStats({
                total: data?.length || 0,
                pending: data?.filter(t => t.status === 'pending').length || 0,
                replied: data?.filter(t => t.status === 'replied').length || 0
            });
        }
        setLoading(false);
    }

    async function deleteTicket(id: string) {
        if (!confirm("Bu talebi silmek istediğinize emin misiniz?")) return;

        const result = await deleteSupportTicket(id);

        if (result.error) {
            alert("Silme işlemi sırasında hata oluştu: " + result.error);
        } else {
            setTickets(tickets.filter(t => t.id !== id));
            setStats(prev => ({ ...prev, total: prev.total - 1 }));
        }
    }

    const [selectedTicket, setSelectedTicket] = useState<any>(null);
    const [adminResponse, setAdminResponse] = useState("");
    const [isResponding, setIsResponding] = useState(false);

    async function submitResponse() {
        if (!adminResponse.trim()) return;
        setIsResponding(true);

        const result = await replyToSupportTicket(
            selectedTicket.id,
            adminResponse,
            selectedTicket.user_id,
            selectedTicket.subject
        );

        if (result.error) {
            alert("Cevap gönderilirken hata oluştu: " + result.error);
        } else {
            setTickets(tickets.map(t => t.id === selectedTicket.id ? { ...t, status: 'replied', admin_response: adminResponse } : t));
            setStats(prev => ({ ...prev, pending: prev.pending - 1, replied: prev.replied + 1 }));
            setSelectedTicket(null);
            setAdminResponse("");
        }
        setIsResponding(false);
    }

    const filteredTickets = tickets.filter(ticket =>
        ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.profiles?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Modal */}
            {selectedTicket && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2rem] p-8 w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900">Destek Talebi Cevapla</h2>
                                <p className="text-slate-500 font-medium">{selectedTicket.profiles?.username} - {selectedTicket.subject}</p>
                            </div>
                            <button onClick={() => setSelectedTicket(null)} className="text-slate-400 hover:text-slate-600">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-slate-50 p-6 rounded-2xl">
                                <p className="text-xs font-bold text-slate-400 uppercase mb-2">Kullanıcı Mesajı</p>
                                <p className="text-slate-700 font-medium whitespace-pre-wrap">{selectedTicket.message}</p>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Cevabınız</label>
                                <textarea
                                    value={adminResponse}
                                    onChange={(e) => setAdminResponse(e.target.value)}
                                    className="w-full border border-slate-200 rounded-2xl p-4 min-h-[200px] focus:ring-2 focus:ring-violet-500 outline-none font-medium"
                                    placeholder="Kullanıcıya iletilecek cevabı yazın..."
                                />
                            </div>

                            <div className="flex gap-4">
                                <Button
                                    variant="outline"
                                    onClick={() => setSelectedTicket(null)}
                                    className="flex-1 rounded-xl h-12"
                                >
                                    Vazgeç
                                </Button>
                                <Button
                                    onClick={submitResponse}
                                    disabled={isResponding || !adminResponse.trim()}
                                    className="flex-1 bg-violet-600 hover:bg-violet-700 text-white rounded-xl h-12 font-bold"
                                >
                                    {isResponding ? "Gönderiliyor..." : "Cevabı Gönder"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Destek Talepleri</h1>
                    <p className="mt-1 text-slate-500 dark:text-slate-400">Kullanıcı mesajlarını ve yardım taleplerini yönetin</p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                            <MessageSquare className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Toplam Mesaj</p>
                            <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
                        </div>
                    </div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                            <Clock className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Bekleyen</p>
                            <p className="text-2xl font-bold text-slate-900">{stats.pending}</p>
                        </div>
                    </div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600">
                            <CheckCircle className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Cevaplanan</p>
                            <p className="text-2xl font-bold text-slate-900">{stats.replied}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <Input
                            placeholder="Taleplerde ara (konu, kullanıcı adı, email)..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="h-10 border-slate-200 bg-white pl-10 text-slate-900 placeholder:text-slate-400"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-200 text-left">
                                    <th className="pb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Kullanıcı</th>
                                    <th className="pb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Konu</th>
                                    <th className="pb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Durum</th>
                                    <th className="pb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Tarih</th>
                                    <th className="pb-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredTickets.length > 0 ? (
                                    filteredTickets.map((ticket) => (
                                        <tr key={ticket.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="py-4">
                                                <div>
                                                    <div className="font-bold text-slate-900">{ticket.profiles?.username || 'Bilinmiyor'}</div>
                                                    <div className="text-xs text-slate-500">{ticket.profiles?.email}</div>
                                                </div>
                                            </td>
                                            <td className="py-4 font-medium text-slate-700">{ticket.subject}</td>
                                            <td className="py-4">
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${ticket.status === 'pending' ? 'bg-orange-100 text-orange-600' :
                                                    ticket.status === 'replied' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-600'
                                                    }`}>
                                                    {ticket.status === 'pending' ? 'BEKLEYEN' :
                                                        ticket.status === 'replied' ? 'CEVAPLANDI' : 'KAPALI'}
                                                </span>
                                            </td>
                                            <td className="py-4 text-sm text-slate-500">
                                                {new Date(ticket.created_at).toLocaleDateString('tr-TR')}
                                            </td>
                                            <td className="py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => {
                                                            setSelectedTicket(ticket);
                                                            setAdminResponse(ticket.admin_response || "");
                                                        }}
                                                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                    >
                                                        <Reply className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => deleteTicket(ticket.id)}
                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center text-slate-500">
                                            Henüz destek talebi bulunmuyor
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
