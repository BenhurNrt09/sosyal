"use client";

import { Users, Search, UserPlus, Loader2, Trash2, Ban, ShieldCheck, Wallet, X } from "lucide-react";
import { Button, Input, Card, CardContent } from "@repo/ui";
import { useState, useEffect } from "react";
import { createClient } from "@repo/lib/src/supabase";
import { updateUserRole, updateUserBalance, deleteUserAccount } from "@/actions/users";

export default function UsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [stats, setStats] = useState({
        total: 0,
        active: 0,
        new: 0
    });

    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [isBalanceModalOpen, setIsBalanceModalOpen] = useState(false);
    const [newBalance, setNewBalance] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);
    const [isNewUserModalOpen, setIsNewUserModalOpen] = useState(false);
    const [newUserData, setNewUserData] = useState({
        email: "",
        username: "",
        password: "",
        name: ""
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    async function fetchUsers() {
        setLoading(true);
        setError(null);

        try {
            const { getAllUsers } = await import("@/actions/admin");
            const result = await getAllUsers() as any;

            if (result.error) {
                setError(result.error);
                setUsers([]);
            } else {
                setUsers(result.data || []);
                const now = new Date();
                const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));

                setStats({
                    total: result.data?.length || 0,
                    active: result.data?.filter((u: any) => u.role !== 'banned').length || 0,
                    new: result.data?.filter((u: any) => new Date(u.created_at) > thirtyDaysAgo).length || 0
                });
            }
        } catch (err: any) {
            setError("Sunucu hatası: " + err.message);
        }
        setLoading(false);
    }

    const handleRoleUpdate = async (userId: string, currentRole: string) => {
        const newRole = currentRole === 'banned' ? 'user' : 'banned';
        const confirmMsg = currentRole === 'banned' ? "Kullanıcının engelini kaldırmak istiyor musunuz?" : "Kullanıcıyı engellemek istiyor musunuz?";
        if (!confirm(confirmMsg)) return;

        const result = await updateUserRole(userId, newRole);
        if (result.success) fetchUsers();
        else alert("Hata: " + result.error);
    };

    const handleDelete = async (userId: string) => {
        if (!confirm("Kullanıcıyı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.")) return;
        const result = await deleteUserAccount(userId);
        if (result.success) fetchUsers();
        else alert("Hata: " + result.error);
    };

    const handleBalanceUpdate = async () => {
        if (!selectedUser || isNaN(parseFloat(newBalance))) return;
        setIsUpdating(true);
        const result = await updateUserBalance(selectedUser.id, parseFloat(newBalance));
        if (result.success) {
            setIsBalanceModalOpen(false);
            fetchUsers();
        } else alert("Hata: " + result.error);
        setIsUpdating(false);
    };

    const filteredUsers = users.filter(user =>
        user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Panel</h1>
                    <p className="mt-1 text-slate-500 dark:text-slate-400 font-medium">Platform kullanıcılarını yönetin</p>
                </div>
                <Button onClick={() => setIsNewUserModalOpen(true)} className="bg-cyan-600 hover:bg-cyan-700 text-white rounded-2xl h-12 px-6 font-black uppercase tracking-tight shadow-xl shadow-cyan-200">
                    <UserPlus className="mr-2 h-5 w-5" />
                    Yeni Kullanıcı
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <StatCard icon={<Users className="w-7 h-7" />} label="Toplam Kullanıcı" value={stats.total} color="blue" />
                <StatCard icon={<ShieldCheck className="w-7 h-7" />} label="Aktif Kullanıcı" value={stats.active} color="green" />
                <StatCard icon={<UserPlus className="w-7 h-7" />} label="Yeni (30 Gün)" value={stats.new} color="orange" />
            </div>

            <Card className="rounded-[2.5rem] border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 dark:backdrop-blur-sm shadow-sm overflow-hidden">
                <CardContent className="p-0">
                    <div className="p-8 border-b border-slate-50 dark:border-slate-800">
                        <div className="relative">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <input
                                placeholder="Kullanıcı ara (ad, kullanıcı adı, email)..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full h-14 pl-14 pr-8 bg-slate-50 dark:bg-slate-800/30 border-none rounded-2xl text-sm font-black text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:ring-4 focus:ring-cyan-500/10 transition-all font-sans"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        {error && (
                            <div className="m-8 p-5 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800 text-rose-600 dark:text-rose-400 rounded-3xl font-black flex items-center gap-4 uppercase text-xs tracking-widest">
                                <Ban className="w-6 h-6" />
                                {error}
                            </div>
                        )}
                        {loading ? (
                            <div className="flex justify-center py-24">
                                <Loader2 className="h-12 w-12 animate-spin text-cyan-600" />
                            </div>
                        ) : (
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-slate-50 dark:border-slate-800">
                                        <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Kullanıcı</th>
                                        <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Email</th>
                                        <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">Bakiye</th>
                                        <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">Rol</th>
                                        <th className="px-8 py-6 text-right text-[10px] font-black uppercase text-slate-400 tracking-widest">İşlemler</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                    {filteredUsers.length > 0 ? (
                                        filteredUsers.map((user) => (
                                            <tr key={user.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                                <td className="px-8 py-7">
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-11 w-11 rounded-2xl bg-cyan-100 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-black text-sm shadow-sm ring-1 ring-white/10">
                                                            {(user.username || 'K').charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <div className="font-black text-slate-900 dark:text-white text-sm">{user.username}</div>
                                                            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">{user.name || 'İsimsiz'}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-7 text-sm text-slate-600 dark:text-slate-400 font-bold">{user.email}</td>
                                                <td className="px-8 py-7 text-sm text-slate-900 dark:text-white font-black text-center">₺{user.balance?.toLocaleString('tr-TR', { minimumFractionDigits: 2 }) || '0.00'}</td>
                                                <td className="px-8 py-7 text-center">
                                                    <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest inline-flex items-center gap-1.5 ${user.role === 'admin' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400' :
                                                        user.role === 'banned' ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                                                        }`}>
                                                        <div className={`w-1 h-1 rounded-full ${user.role === 'admin' ? 'bg-amber-500' : user.role === 'banned' ? 'bg-rose-500' : 'bg-slate-500'}`} />
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-7">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => {
                                                                setSelectedUser(user);
                                                                setNewBalance(user.balance?.toString() || "0");
                                                                setIsBalanceModalOpen(true);
                                                            }}
                                                            className="h-10 w-10 flex items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 transition-all shadow-sm border border-blue-100 dark:border-blue-800"
                                                            title="Bakiye"
                                                        >
                                                            <Wallet className="h-4.5 w-4.5" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleRoleUpdate(user.id, user.role)}
                                                            className={`h-10 w-10 flex items-center justify-center rounded-xl transition-all shadow-sm border ${user.role === 'banned'
                                                                ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800 hover:bg-emerald-100'
                                                                : 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 border-orange-100 dark:border-orange-800 hover:bg-orange-100'}`}
                                                            title={user.role === 'banned' ? "Engeli Kaldır" : "Engelle"}
                                                        >
                                                            {user.role === 'banned' ? <ShieldCheck className="h-4.5 w-4.5" /> : <Ban className="h-4.5 w-4.5" />}
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(user.id)}
                                                            className="h-10 w-10 flex items-center justify-center rounded-xl bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition-all shadow-sm border border-rose-100 dark:border-rose-800"
                                                            title="Sil"
                                                        >
                                                            <Trash2 className="h-4.5 w-4.5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="py-24 text-center text-slate-400 font-black text-sm uppercase tracking-widest">
                                                Kullanıcı bulunamadı.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Modals are kept below with dark mode updates */}
            {isNewUserModalOpen && (
                <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 w-full max-w-md shadow-2xl border border-slate-100 dark:border-slate-800">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Yeni Kullanıcı</h2>
                            <button onClick={() => setIsNewUserModalOpen(false)} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-slate-400">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Email Adresi</label>
                                <input
                                    type="email"
                                    value={newUserData.email}
                                    onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                                    placeholder="kullanici@example.com"
                                    className="w-full h-14 px-6 bg-slate-50 dark:bg-slate-800/30 border-none rounded-2xl text-sm font-black text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-4 focus:ring-cyan-500/10 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Kullanıcı Adı</label>
                                <input
                                    type="text"
                                    value={newUserData.username}
                                    onChange={(e) => setNewUserData({ ...newUserData, username: e.target.value })}
                                    placeholder="kullaniciadi"
                                    className="w-full h-14 px-6 bg-slate-50 dark:bg-slate-800/30 border-none rounded-2xl text-sm font-black text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-4 focus:ring-cyan-500/10 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Ad Soyad</label>
                                <input
                                    type="text"
                                    value={newUserData.name}
                                    onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
                                    placeholder="Mesela: Ali Yılmaz"
                                    className="w-full h-14 px-6 bg-slate-50 dark:bg-slate-800/30 border-none rounded-2xl text-sm font-black text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-4 focus:ring-cyan-500/10 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Şifre</label>
                                <input
                                    type="password"
                                    value={newUserData.password}
                                    onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
                                    placeholder="••••••••"
                                    className="w-full h-14 px-6 bg-slate-50 dark:bg-slate-800/30 border-none rounded-2xl text-sm font-black text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-4 focus:ring-cyan-500/10 transition-all"
                                />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <Button
                                    onClick={() => setIsNewUserModalOpen(false)}
                                    variant="outline"
                                    className="flex-1 h-14 font-black uppercase tracking-tight rounded-2xl border-slate-100 dark:border-slate-800"
                                >
                                    İptal
                                </Button>
                                <Button
                                    onClick={async () => {
                                        setIsUpdating(true);
                                        const supabase = createClient();
                                        const { error } = await supabase.auth.signUp({
                                            email: newUserData.email,
                                            password: newUserData.password,
                                            options: {
                                                data: {
                                                    username: newUserData.username,
                                                    name: newUserData.name
                                                }
                                            }
                                        });
                                        if (!error) {
                                            setIsNewUserModalOpen(false);
                                            setNewUserData({ email: "", username: "", password: "", name: "" });
                                            fetchUsers();
                                        } else {
                                            alert("Hata: " + error.message);
                                        }
                                        setIsUpdating(false);
                                    }}
                                    disabled={isUpdating}
                                    className="flex-[1.5] h-14 bg-cyan-600 hover:bg-cyan-700 text-white font-black uppercase tracking-tight rounded-2xl shadow-xl shadow-cyan-200"
                                >
                                    {isUpdating ? <Loader2 className="w-5 h-5 animate-spin" /> : "Oluştur"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isBalanceModalOpen && selectedUser && (
                <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 w-full max-w-sm shadow-2xl border border-slate-100 dark:border-slate-800">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Bakiye Düzenle</h2>
                            <button onClick={() => setIsBalanceModalOpen(false)} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-all">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="space-y-6">
                            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Kullanıcı</p>
                                <p className="text-sm font-black text-slate-900 dark:text-white">{selectedUser.username}</p>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Yeni Bakiye (TL)</label>
                                <input
                                    type="number"
                                    value={newBalance}
                                    onChange={(e) => setNewBalance(e.target.value)}
                                    placeholder="0.00"
                                    className="w-full h-16 px-6 bg-slate-50 dark:bg-slate-800/30 border-none rounded-2xl text-2xl font-black text-slate-900 dark:text-white focus:ring-4 focus:ring-cyan-500/10 transition-all"
                                />
                            </div>
                            <Button
                                onClick={handleBalanceUpdate}
                                disabled={isUpdating}
                                className="w-full h-14 bg-cyan-600 hover:bg-cyan-700 text-white font-black uppercase tracking-tight rounded-2xl shadow-xl shadow-cyan-200"
                            >
                                {isUpdating ? <Loader2 className="w-5 h-5 animate-spin" /> : "Bakiyeyi Güncelle"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function StatCard({ icon, label, value, color }: any) {
    const colors: any = {
        blue: "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
        green: "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400",
        orange: "bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400"
    };
    return (
        <div className="rounded-[2.2rem] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-8 shadow-sm">
            <div className="flex items-center gap-5">
                <div className={`flex h-16 w-16 items-center justify-center rounded-[1.2rem] ${colors[color]} shadow-sm`}>
                    {icon}
                </div>
                <div>
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">{label}</p>
                    <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">{value?.toLocaleString('tr-TR')}</p>
                </div>
            </div>
        </div>
    );
}
