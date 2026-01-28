"use client";

import { Users, Search, UserPlus, MoreVertical, Loader2, Trash2, Ban, ShieldCheck, Wallet, X } from "lucide-react";
import { Button, Input } from "@repo/ui";
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
            // Use admin action to bypass RLS
            const { getAllUsers } = await import("@/actions/admin");
            const result = await getAllUsers();

            if (result.error) {
                console.error("Error fetching users:", result.error);
                setError(result.error);
                setUsers([]);
            } else {
                setUsers(result.data || []);
                const now = new Date();
                const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));

                setStats({
                    total: result.data?.length || 0,
                    active: result.data?.filter(u => u.role !== 'banned').length || 0,
                    new: result.data?.filter(u => new Date(u.created_at) > thirtyDaysAgo).length || 0
                });
            }
        } catch (err: any) {
            console.error("Failed to call getAllUsers:", err);
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
        <div className="space-y-6">
            {/* New User Modal */}
            {isNewUserModalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2.5rem] p-10 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-black text-slate-900">Yeni Kullanıcı Ekle</h2>
                            <button onClick={() => setIsNewUserModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
                                <Input
                                    type="email"
                                    value={newUserData.email}
                                    onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                                    placeholder="kullanici@example.com"
                                    className="h-12"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Kullanıcı Adı</label>
                                <Input
                                    type="text"
                                    value={newUserData.username}
                                    onChange={(e) => setNewUserData({ ...newUserData, username: e.target.value })}
                                    placeholder="kullaniciadi"
                                    className="h-12"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">İsim</label>
                                <Input
                                    type="text"
                                    value={newUserData.name}
                                    onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
                                    placeholder="Ad Soyad"
                                    className="h-12"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Şifre</label>
                                <Input
                                    type="password"
                                    value={newUserData.password}
                                    onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
                                    placeholder="••••••••"
                                    className="h-12"
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <Button
                                    onClick={() => setIsNewUserModalOpen(false)}
                                    variant="outline"
                                    className="flex-1 h-12 font-bold"
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
                                    className="flex-1 h-12 bg-cyan-600 hover:bg-cyan-700 text-white font-bold"
                                >
                                    {isUpdating ? "Oluşturuluyor..." : "Kullanıcı Oluştur"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Balance Modal */}
            {isBalanceModalOpen && selectedUser && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2.5rem] p-10 w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-black text-slate-900">Bakiye Düzenle</h2>
                            <button onClick={() => setIsBalanceModalOpen(false)} className="text-slate-400"><X /></button>
                        </div>
                        <div className="space-y-4">
                            <p className="text-sm font-bold text-slate-500">{selectedUser.username} için yeni bakiye girin:</p>
                            <Input
                                type="number"
                                value={newBalance}
                                onChange={(e) => setNewBalance(e.target.value)}
                                placeholder="TL Cinsinden..."
                                className="h-12 text-lg font-black"
                            />
                            <Button
                                onClick={handleBalanceUpdate}
                                disabled={isUpdating}
                                className="w-full h-12 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl"
                            >
                                {isUpdating ? "Güncelleniyor..." : "Güncelle"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Kullanıcılar</h1>
                    <p className="mt-1 text-slate-500 dark:text-slate-400">Platform kullanıcılarını yönetin</p>
                </div>
                <Button onClick={() => setIsNewUserModalOpen(true)} className="bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl shadow-lg shadow-cyan-200">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Yeni Kullanıcı
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <StatCard icon={<Users />} label="Toplam Kullanıcı" value={stats.total} color="blue" />
                <StatCard icon={<ShieldCheck />} label="Aktif Kullanıcı" value={stats.active} color="green" />
                <StatCard icon={<UserPlus />} label="Yeni (30 Gün)" value={stats.new} color="orange" />
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <Input
                            placeholder="Kullanıcı ara..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="h-10 border-slate-200 bg-white pl-10 text-slate-900"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto text-slate-900">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl font-bold flex items-center gap-3">
                            <Ban className="w-5 h-5" />
                            {error}
                        </div>
                    )}
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-cyan-600" />
                        </div>
                    ) : (
                        <table className="w-full text-slate-900">
                            <thead>
                                <tr className="border-b border-slate-200 text-left">
                                    <th className="pb-3 text-xs font-semibold uppercase tracking-wider text-slate-500 font-bold">Kullanıcı</th>
                                    <th className="pb-3 text-xs font-semibold uppercase tracking-wider text-slate-500 font-bold">Email</th>
                                    <th className="pb-3 text-xs font-semibold uppercase tracking-wider text-slate-500 font-bold">Bakiye</th>
                                    <th className="pb-3 text-xs font-semibold uppercase tracking-wider text-slate-500 font-bold">Rol</th>
                                    <th className="pb-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500 font-bold">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-9 w-9 rounded-xl bg-cyan-100 flex items-center justify-center text-cyan-600 font-bold text-xs">
                                                    {(user.username || 'K').charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-900">{user.username}</div>
                                                    <div className="text-[10px] text-slate-400 uppercase font-black">{user.name || 'İsimsiz'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 text-sm text-slate-600 font-medium">{user.email}</td>
                                        <td className="py-4 text-sm text-slate-900 font-black">₺{user.balance?.toFixed(2) || '0.00'}</td>
                                        <td className="py-4 text-sm font-medium">
                                            <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase ${user.role === 'admin' ? 'bg-amber-100 text-amber-700' :
                                                user.role === 'banned' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="py-4 text-right">
                                            <div className="flex justify-end gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => {
                                                        setSelectedUser(user);
                                                        setNewBalance(user.balance?.toString() || "0");
                                                        setIsBalanceModalOpen(true);
                                                    }}
                                                    className="text-blue-600 hover:bg-blue-50"
                                                >
                                                    <Wallet className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleRoleUpdate(user.id, user.role)}
                                                    className={user.role === 'banned' ? 'text-green-600 hover:bg-green-50' : 'text-orange-600 hover:bg-orange-50'}
                                                >
                                                    {user.role === 'banned' ? <ShieldCheck className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDelete(user.id)}
                                                    className="text-red-600 hover:bg-red-50"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon, label, value, color }: any) {
    const colors: any = {
        blue: "bg-blue-100 text-blue-600",
        green: "bg-green-100 text-green-600",
        orange: "bg-orange-100 text-orange-600"
    };
    return (
        <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${colors[color]}`}>
                    {icon}
                </div>
                <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</p>
                    <p className="text-2xl font-black text-slate-900">{value}</p>
                </div>
            </div>
        </div>
    );
}
