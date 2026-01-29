"use client";

import { useState, useEffect } from "react";
import { getTasks, subscribeToTasks, updateTask, deleteTask, Task } from "@repo/lib";
import { Heart, MessageCircle, UserPlus, Share2, Eye, Play, ExternalLink, Clock, CheckCircle, XCircle, AlertCircle, Trash2, Loader2, Filter } from "lucide-react";
import { Button, Card, CardContent } from "@repo/ui";

const getTaskTypeIcon = (taskType: string) => {
    const icons: Record<string, any> = {
        like: Heart,
        comment: MessageCircle,
        follow: UserPlus,
        share: Share2,
        view: Eye,
        subscribe: UserPlus,
        retweet: Share2,
    };
    return icons[taskType] || Heart;
};

const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
        pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400",
        approved: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
        "in-progress": "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/20 dark:text-cyan-400",
        completed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400",
        rejected: "bg-rose-100 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400",
    };
    return colors[status] || "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400";
};

const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
        pending: "BEKLEYEN",
        approved: "ONAYLANDI",
        "in-progress": "DEVAM EDİYOR",
        completed: "TAMAMLANDI",
        rejected: "REDDEDİLDİ",
    };
    return labels[status] || status.toUpperCase();
};

export default function AdminTasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [filter, setFilter] = useState<"all" | Task["status"]>("all");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTasks();

        const unsubscribe = subscribeToTasks((updatedTasks) => {
            setTasks(updatedTasks);
        });

        return unsubscribe;
    }, []);

    const loadTasks = async () => {
        setLoading(true);
        const data = await getTasks();
        setTasks(data);
        setLoading(false);
    };

    const filteredTasks = filter === "all" ? tasks : tasks.filter(t => t.status === filter);

    const handleStatusUpdate = async (taskId: string, newStatus: Task["status"]) => {
        await updateTask(taskId, { status: newStatus });
    };

    const handleDelete = async (taskId: string) => {
        if (confirm("Bu görevi silmek istediğinizden emin misiniz?")) {
            await deleteTask(taskId);
        }
    };

    const statusCounts = {
        all: tasks.length,
        pending: tasks.filter(t => t.status === "pending").length,
        approved: tasks.filter(t => t.status === "approved").length,
        "in-progress": tasks.filter(t => t.status === "in-progress").length,
        completed: tasks.filter(t => t.status === "completed").length,
        rejected: tasks.filter(t => t.status === "rejected").length,
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Panel</h1>
                    <p className="mt-1 text-slate-500 dark:text-slate-400 font-medium">Tüm görevleri yönetin, onaylayın veya reddedin</p>
                </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <StatSimple label="Toplam" value={statusCounts.all} color="slate" />
                <StatSimple label="Bekleyen" value={statusCounts.pending} color="amber" />
                <StatSimple label="Onaylı" value={statusCounts.approved} color="blue" />
                <StatSimple label="Gerekli" value={statusCounts["in-progress"]} color="cyan" />
                <StatSimple label="Bitti" value={statusCounts.completed} color="emerald" />
                <StatSimple label="Red" value={statusCounts.rejected} color="rose" />
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
                {([
                    { key: "all", label: "TÜMÜ" },
                    { key: "pending", label: "BEKLEYEN" },
                    { key: "approved", label: "ONAYLANDI" },
                    { key: "in-progress", label: "DEVAM EDİYOR" },
                    { key: "completed", label: "TAMAMLANDI" },
                    { key: "rejected", label: "REDDEDİLDİ" }
                ] as const).map(({ key, label }) => (
                    <button
                        key={key}
                        onClick={() => setFilter(key)}
                        className={`px-5 py-3 rounded-2xl font-black text-[10px] tracking-widest transition-all ${filter === key
                            ? "bg-cyan-600 text-white shadow-lg shadow-cyan-200"
                            : "bg-white dark:bg-slate-900/50 text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-800 hover:border-cyan-500"
                            }`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* Task List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 bg-white dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-100 dark:border-slate-800">
                        <Loader2 className="w-12 h-12 animate-spin text-cyan-600 mb-4" />
                        <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Görevler yükleniyor...</p>
                    </div>
                ) : filteredTasks.length === 0 ? (
                    <div className="bg-white dark:bg-slate-900/50 rounded-[2.5rem] p-16 text-center border border-slate-100 dark:border-slate-800">
                        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                            <AlertCircle className="w-10 h-10 text-slate-400" />
                        </div>
                        <p className="text-slate-500 font-black uppercase text-xs tracking-widest">Bu kategoride görev bulunamadı</p>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
                        {filteredTasks.map((task) => {
                            const TaskIcon = getTaskTypeIcon(task.taskType);
                            return (
                                <Card
                                    key={task.id}
                                    className="rounded-[2.5rem] border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 dark:backdrop-blur-sm overflow-hidden"
                                >
                                    <CardContent className="p-8">
                                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                            <div className="flex items-center gap-5">
                                                <div className="w-14 h-14 rounded-2xl bg-cyan-100 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shadow-sm">
                                                    <TaskIcon className="w-7 h-7" />
                                                </div>
                                                <div>
                                                    <h3 className="font-black text-slate-900 dark:text-white text-xl tracking-tight">
                                                        {task.platformName} - {task.taskTypeName}
                                                    </h3>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <p className="text-sm font-bold text-slate-400">{task.accountName}</p>
                                                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                                                        <span className={`text-[9px] font-black px-2 py-1 rounded-lg ${getStatusColor(task.status)} tracking-widest`}>
                                                            {getStatusLabel(task.status)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 py-6 lg:py-0 border-y lg:border-none border-slate-50 dark:border-slate-800">
                                                <div>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Miktar</p>
                                                    <p className="font-black text-slate-900 dark:text-white">{task.quantity}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Birim Fiyat</p>
                                                    <p className="font-black text-slate-900 dark:text-white">{Number(task.price).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}₺</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Toplam</p>
                                                    <p className="font-black text-cyan-600 dark:text-cyan-400">
                                                        {(Number(task.quantity) * Number(task.price)).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}₺
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Oluşturma</p>
                                                    <p className="font-black text-slate-900 dark:text-white">
                                                        {new Date(task.createdAt).toLocaleDateString('tr-TR')}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <a
                                                    href={task.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="h-12 px-5 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:bg-slate-100 transition-all flex items-center justify-center gap-2 text-xs font-black uppercase tracking-tight"
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                    LİNK
                                                </a>
                                                <div className="flex gap-2">
                                                    {task.status === "pending" && (
                                                        <button
                                                            onClick={() => handleStatusUpdate(task.id, 'approved')}
                                                            className="h-12 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-tight shadow-lg shadow-blue-200"
                                                        >
                                                            Onayla
                                                        </button>
                                                    )}
                                                    {task.status === "approved" && (
                                                        <button
                                                            onClick={() => handleStatusUpdate(task.id, 'in-progress')}
                                                            className="h-12 px-6 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-black text-xs uppercase tracking-tight shadow-lg shadow-cyan-200"
                                                        >
                                                            Başlat
                                                        </button>
                                                    )}
                                                    {task.status === "in-progress" && (
                                                        <button
                                                            onClick={() => handleStatusUpdate(task.id, 'completed')}
                                                            className="h-12 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-tight shadow-lg shadow-emerald-200"
                                                        >
                                                            Tamamla
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleDelete(task.id)}
                                                        className="h-12 w-12 rounded-xl bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition-all flex items-center justify-center border border-rose-100 dark:border-rose-800"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        {task.description && (
                                            <div className="mt-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Açıklama</p>
                                                <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                                                    {task.description}
                                                </p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

function StatSimple({ label, value, color }: { label: string, value: number, color: string }) {
    const colors: any = {
        slate: "text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900/50 border-slate-100 dark:border-slate-800",
        amber: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-900/20",
        blue: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/20",
        cyan: "text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-900/10 border-cyan-100 dark:border-cyan-900/20",
        emerald: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900/20",
        rose: "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/10 border-rose-100 dark:border-rose-900/20",
    };
    return (
        <div className={`p-4 rounded-2xl border ${colors[color]} shadow-sm`}>
            <p className="text-[9px] font-black uppercase tracking-widest opacity-70 mb-1">{label}</p>
            <p className="text-xl font-black">{value}</p>
        </div>
    );
}
