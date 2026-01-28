"use client";

import { useState, useEffect } from "react";
import { Plus, Clock, CheckCircle2, XCircle, AlertCircle, List, Heart, MessageCircle, UserPlus, Share2, Eye, Play, ExternalLink } from "lucide-react";
import { Button } from "@repo/ui/src/components/ui/button";
import { CreateTaskModal } from "./create-task-modal";
import { getTasks, addTask as addTaskToStore, subscribeToTasks, Task } from "@repo/lib";

type TaskStatus = "all" | "pending" | "completed" | "rejected" | "waiting";

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
        "in-progress": "bg-purple-100 text-purple-700",
        completed: "bg-emerald-100 text-emerald-700",
        rejected: "bg-red-100 text-red-700",
    };
    return colors[status] || "bg-slate-100 text-slate-700";
};

const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
        pending: "Bekliyor",
        approved: "Onaylandı",
        "in-progress": "Devam Ediyor",
        completed: "Tamamlandı",
        rejected: "Reddedildi",
    };
    return labels[status] || status;
};

export default function TasksPage() {
    const [activeTab, setActiveTab] = useState<TaskStatus>("all");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    // Load tasks from Supabase
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

    const handleCreateTask = async (newTask: Omit<Task, 'id' | 'createdAt'>) => {
        await addTaskToStore(newTask);
        // Task list will auto-update via subscription
    };

    const filteredTasks = tasks.filter((task) => {
        if (activeTab === "all") return true;
        if (activeTab === "waiting") return task.status === "pending" || task.status === "approved";
        return task.status === activeTab;
    });

    const tabs = [
        { id: "all" as TaskStatus, label: "Tümü", icon: List, count: tasks.length },
        { id: "pending" as TaskStatus, label: "Bekleyen", icon: Clock, count: tasks.filter(t => t.status === "pending").length },
        { id: "completed" as TaskStatus, label: "Tamamlanan", icon: CheckCircle2, count: tasks.filter(t => t.status === "completed").length },
        { id: "rejected" as TaskStatus, label: "Reddedilen", icon: XCircle, count: tasks.filter(t => t.status === "rejected").length },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-500">Görevler yükleniyor...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header with Add Button */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black text-slate-900">Görevlerim</h2>
                <Button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl px-6 py-3 shadow-lg shadow-orange-200"
                >
                    <Plus className="mr-2 h-5 w-5" />
                    Yeni Görev Ekle
                </Button>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-[2rem] p-2 shadow-sm border border-slate-100">
                <div className="flex gap-2 overflow-x-auto">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                                    flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap
                                    ${activeTab === tab.id
                                        ? "bg-orange-600 text-white shadow-md shadow-orange-200"
                                        : "text-slate-500 hover:bg-orange-50 hover:text-orange-600"
                                    }
                                `}
                            >
                                <Icon className="w-4 h-4" />
                                {tab.label}
                                <span className={`
                                    px-2 py-0.5 rounded-full text-xs font-bold
                                    ${activeTab === tab.id
                                        ? "bg-white/20 text-white"
                                        : "bg-slate-100 text-slate-600"
                                    }
                                `}>
                                    {tab.count}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Content Area */}
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 min-h-[400px]">
                {filteredTasks.length === 0 ? (
                    /* Empty State */
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-20 h-20 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-6">
                            <List className="w-10 h-10" />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mb-2">
                            {activeTab === "all" && "Henüz Görev Yok"}
                            {activeTab === "pending" && "Bekleyen Görev Yok"}
                            {activeTab === "completed" && "Tamamlanmış Görev Yok"}
                            {activeTab === "rejected" && "Reddedilen Görev Yok"}
                        </h3>
                        <p className="text-slate-500 mb-6 max-w-md">
                            Henüz bu kategoride görev bulunmuyor. Yeni görev ekleyerek başlayabilirsiniz.
                        </p>
                        <Button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl px-6 py-3 shadow-lg shadow-orange-200"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            İlk Görevi Ekle
                        </Button>
                    </div>
                ) : (
                    /* Task List */
                    <div className="space-y-4">
                        {filteredTasks.map((task) => {
                            const TaskIcon = getTaskTypeIcon(task.taskType);
                            return (
                                <div
                                    key={task.id}
                                    className="border border-slate-200 rounded-2xl p-6 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
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
                                            <p className="font-bold text-orange-600">
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

                                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                        <a
                                            href={task.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-orange-600 hover:text-orange-700 font-medium flex items-center gap-2"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                            Linki Görüntüle
                                        </a>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Modal */}
            <CreateTaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateTask}
            />
        </div>
    );
}
