"use client";

import { useState, useEffect } from "react";
import { getTasks, subscribeToTasks, updateTask, deleteTask, Task } from "@repo/lib";
import { Heart, MessageCircle, UserPlus, Share2, Eye, Play, ExternalLink, Clock, CheckCircle, XCircle, AlertCircle, Trash2 } from "lucide-react";
import { Button } from "@repo/ui/src/components/ui/button";

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
        pending: "bg-amber-100 text-amber-700",
        approved: "bg-blue-100 text-blue-700",
        "in-progress": "bg-cyan-100 text-cyan-700",
        completed: "bg-emerald-100 text-emerald-700",
        rejected: "bg-red-100 text-red-700",
    };
    return colors[status] || "bg-slate-100 text-slate-700";
};

const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
        pending: "Bekleyen",
        approved: "Onaylandı",
        "in-progress": "Devam Ediyor",
        completed: "Tamamlandı",
        rejected: "Reddedildi",
    };
    return labels[status] || status;
};

export default function AdminTasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [filter, setFilter] = useState<"all" | Task["status"]>("all");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTasks();

        // Subscribe to real-time updates
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

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-500">Görevler yükleniyor...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-black text-slate-900 mb-2">Görev Yönetimi</h1>
                <p className="text-slate-500">Tüm görevleri yönetin, onaylayın veya reddedin</p>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="bg-white rounded-xl p-4 border border-slate-200">
                    <p className="text-xs text-slate-500 mb-1">Toplam</p>
                    <p className="text-2xl font-black text-slate-900">{statusCounts.all}</p>
                </div>
                <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                    <p className="text-xs text-amber-700 mb-1">Bekleyen</p>
                    <p className="text-2xl font-black text-amber-800">{statusCounts.pending}</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                    <p className="text-xs text-blue-700 mb-1">Onaylandı</p>
                    <p className="text-2xl font-black text-blue-800">{statusCounts.approved}</p>
                </div>
                <div className="bg-cyan-50 rounded-xl p-4 border border-cyan-200">
                    <p className="text-xs text-cyan-700 mb-1">Devam Ediyor</p>
                    <p className="text-2xl font-black text-cyan-800">{statusCounts["in-progress"]}</p>
                </div>
                <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
                    <p className="text-xs text-emerald-700 mb-1">Tamamlandı</p>
                    <p className="text-2xl font-black text-emerald-800">{statusCounts.completed}</p>
                </div>
                <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                    <p className="text-xs text-red-700 mb-1">Reddedildi</p>
                    <p className="text-2xl font-black text-red-800">{statusCounts.rejected}</p>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                {([
                    { key: "all", label: "Tümü" },
                    { key: "pending", label: "Bekleyen" },
                    { key: "approved", label: "Onaylandı" },
                    { key: "in-progress", label: "Devam Ediyor" },
                    { key: "completed", label: "Tamamlandı" },
                    { key: "rejected", label: "Reddedildi" }
                ] as const).map(({ key, label }) => (
                    <button
                        key={key}
                        onClick={() => setFilter(key)}
                        className={`px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${filter === key
                            ? "bg-cyan-600 text-white shadow-md"
                            : "bg-white text-slate-600 border border-slate-200 hover:border-cyan-500"
                            }`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* Task List */}
            <div className="space-y-4">
                {filteredTasks.length === 0 ? (
                    <div className="bg-white rounded-2xl p-16 text-center">
                        <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <AlertCircle className="w-10 h-10 text-slate-400" />
                        </div>
                        <p className="text-slate-500">Bu kategoride görev bulunamadı</p>
                    </div>
                ) : (
                    filteredTasks.map((task) => {
                        const TaskIcon = getTaskTypeIcon(task.taskType);
                        return (
                            <div
                                key={task.id}
                                className="bg-white rounded-2xl border border-slate-200 p-6"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-xl bg-cyan-100 text-cyan-600 flex items-center justify-center">
                                            <TaskIcon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-black text-slate-900 text-lg">
                                                {task.platformName} - {task.taskTypeName}
                                            </h3>
                                            <p className="text-sm text-slate-500">{task.accountName}</p>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(task.status)}`}>
                                        {getStatusLabel(task.status)}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">Miktar</p>
                                        <p className="font-bold text-slate-900">{task.quantity}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">Birim Fiyat</p>
                                        <p className="font-bold text-slate-900">{task.price}₺</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">Toplam</p>
                                        <p className="font-bold text-cyan-600">
                                            {(Number(task.quantity) * Number(task.price)).toFixed(2)}₺
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">Oluşturma</p>
                                        <p className="font-bold text-slate-900 text-sm">
                                            {new Date(task.createdAt).toLocaleDateString('tr-TR')}
                                        </p>
                                    </div>
                                </div>

                                {task.description && (
                                    <p className="text-sm text-slate-600 mb-4 bg-slate-50 p-3 rounded-lg">
                                        {task.description}
                                    </p>
                                )}

                                {/* Actions */}
                                <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
                                    <a
                                        href={task.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-cyan-600 hover:text-cyan-700 font-medium flex items-center gap-2"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                        Link
                                    </a>
                                    <div className="ml-auto flex gap-2">
                                        {task.status === "pending" && (
                                            <Button
                                                onClick={() => handleStatusUpdate(task.id, 'approved')}
                                                className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4"
                                            >
                                                <CheckCircle className="w-4 h-4 mr-1" />
                                                Onayla
                                            </Button>
                                        )}
                                        {task.status === "approved" && (
                                            <Button
                                                onClick={() => handleStatusUpdate(task.id, 'in-progress')}
                                                className="bg-cyan-600 hover:bg-cyan-700 text-white text-sm px-4"
                                            >
                                                <Clock className="w-4 h-4 mr-1" />
                                                Başlat
                                            </Button>
                                        )}
                                        {task.status === "in-progress" && (
                                            <Button
                                                onClick={() => handleStatusUpdate(task.id, 'completed')}
                                                className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm px-4"
                                            >
                                                <CheckCircle className="w-4 h-4 mr-1" />
                                                Tamamla
                                            </Button>
                                        )}
                                        {task.status !== "rejected" && task.status !== "completed" && (
                                            <Button
                                                onClick={() => handleStatusUpdate(task.id, 'rejected')}
                                                className="bg-red-600 hover:bg-red-700 text-white text-sm px-4"
                                            >
                                                <XCircle className="w-4 h-4 mr-1" />
                                                Reddet
                                            </Button>
                                        )}
                                        <Button
                                            onClick={() => handleDelete(task.id)}
                                            className="bg-slate-600 hover:bg-slate-700 text-white text-sm px-4"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
