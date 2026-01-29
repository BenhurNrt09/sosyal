"use client";

import { useState, useEffect } from "react";
import { Plus, Clock, CheckCircle2, XCircle, AlertCircle, List, Heart, MessageCircle, UserPlus, Share2, Eye, Play, ExternalLink, Loader2 } from "lucide-react";
import { Button, Card, CardContent } from "@repo/ui";
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
        pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 border-amber-200/50 dark:border-amber-500/10",
        approved: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200/50 dark:border-blue-500/10",
        "in-progress": "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400 border-orange-200/50 dark:border-orange-500/10",
        completed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-500/10",
        rejected: "bg-rose-100 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400 border-rose-200/50 dark:border-rose-500/10",
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

export default function TasksPage() {
    const [activeTab, setActiveTab] = useState<TaskStatus>("all");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tasks, setTasks] = useState<Task[]>([]);
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

    const handleCreateTask = async (newTask: Omit<Task, 'id' | 'createdAt'>) => {
        await addTaskToStore(newTask);
    };

    const filteredTasks = tasks.filter((task) => {
        if (activeTab === "all") return true;
        if (activeTab === "waiting") return task.status === "pending" || task.status === "approved";
        return task.status === activeTab;
    });

    const tabs = [
        { id: "all" as TaskStatus, label: "TÜMÜ", icon: List, count: tasks.length },
        { id: "pending" as TaskStatus, label: "BEKLEYEN", icon: Clock, count: tasks.filter(t => t.status === "pending").length },
        { id: "completed" as TaskStatus, label: "TAMAMLANAN", icon: CheckCircle2, count: tasks.filter(t => t.status === "completed").length },
        { id: "rejected" as TaskStatus, label: "REDDEDİLEN", icon: XCircle, count: tasks.filter(t => t.status === "rejected").length },
    ];

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <Loader2 className="w-12 h-12 text-orange-600 animate-spin" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Görevler Getiriliyor</p>
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-12">
            {/* Header with Add Button */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">Görevlerim</h1>
                    <p className="mt-1 text-slate-500 dark:text-slate-400 font-medium text-sm">Oluşturduğunuz tüm görevlerin takibi</p>
                </div>
                <Button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-orange-600 hover:bg-orange-700 text-white font-black rounded-[1.2rem] h-14 px-8 shadow-xl shadow-orange-200/50 uppercase tracking-widest text-xs flex items-center gap-3 active:scale-95 transition-all"
                >
                    <Plus className="h-5 w-5" />
                    Yeni Görev Ekle
                </Button>
            </div>

            {/* Tabs */}
            <div className="bg-white/50 dark:bg-slate-900/30 backdrop-blur-sm rounded-[2rem] p-2 border border-slate-100 dark:border-slate-800">
                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                                    flex items-center gap-3 px-6 py-4 rounded-2xl font-black text-[10px] tracking-widest transition-all whitespace-nowrap
                                    ${isActive
                                        ? "bg-orange-600 text-white shadow-lg shadow-orange-200/50"
                                        : "text-slate-400 dark:text-slate-500 hover:bg-orange-50 dark:hover:bg-slate-800/50 hover:text-orange-600"
                                    }
                                `}
                            >
                                <Icon className="w-4 h-4" />
                                {tab.label}
                                <span className={`
                                    px-2 py-0.5 rounded-lg text-[9px] font-black
                                    ${isActive
                                        ? "bg-black/10 text-white"
                                        : "bg-slate-100 dark:bg-slate-800 text-slate-500"
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
            <div className="space-y-6">
                {filteredTasks.length === 0 ? (
                    <Card className="rounded-[3rem] border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 dark:backdrop-blur-sm shadow-sm">
                        <CardContent className="p-20 flex flex-col items-center justify-center text-center">
                            <div className="w-24 h-24 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-inner">
                                <List className="w-10 h-10" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3 uppercase tracking-tight">
                                {activeTab === "all" ? "HİÇ GÖREV YOK" : "BU KATEGORİ BOŞ"}
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400 font-medium mb-10 max-w-sm text-sm">
                                Şirketinizi veya kişisel hesaplarınızı büyütmek için hemen ilk görevinizi oluşturun.
                            </p>
                            <Button
                                onClick={() => setIsModalOpen(true)}
                                className="bg-orange-600 hover:bg-orange-700 text-white font-black rounded-2xl h-14 px-10 shadow-xl shadow-orange-200/50 uppercase tracking-widest text-[10px]"
                            >
                                ŞİMDİ BAŞLA
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-6">
                        {filteredTasks.map((task) => {
                            const TaskIcon = getTaskTypeIcon(task.taskType);
                            return (
                                <Card
                                    key={task.id}
                                    className="rounded-[2.5rem] border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 dark:backdrop-blur-sm overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none transition-all group"
                                >
                                    <CardContent className="p-8">
                                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                                            <div className="flex items-center gap-5">
                                                <div className="w-16 h-16 rounded-[1.5rem] bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                                    <TaskIcon className="w-8 h-8" />
                                                </div>
                                                <div>
                                                    <h3 className="font-black text-slate-900 dark:text-white text-xl tracking-tighter uppercase leading-none mb-2">
                                                        {task.platformName} - {task.taskTypeName}
                                                    </h3>
                                                    <div className="flex items-center gap-3">
                                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-tight">{task.accountName}</p>
                                                        <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                                                        <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black border uppercase tracking-widest ${getStatusColor(task.status)} shadow-sm`}>
                                                            {getStatusLabel(task.status)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-10 lg:gap-14 py-6 lg:py-0 border-y lg:border-none border-slate-50 dark:border-slate-800/50">
                                                <div>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 opacity-70">MİKTAR</p>
                                                    <p className="font-black text-slate-900 dark:text-white text-lg">{task.quantity}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 opacity-70">BİRİM</p>
                                                    <p className="font-black text-slate-900 dark:text-white text-lg">{task.price.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}₺</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 opacity-70">TOPLAM</p>
                                                    <p className="font-black text-orange-600 dark:text-orange-400 text-lg">
                                                        {(Number(task.quantity) * Number(task.price)).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}₺
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 opacity-70">TARİH</p>
                                                    <p className="font-black text-slate-900 dark:text-white text-sm">
                                                        {new Date(task.createdAt).toLocaleDateString('tr-TR')}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex lg:flex-col justify-end gap-3 shrink-0">
                                                <a
                                                    href={task.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="h-12 px-6 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 font-black text-[10px] uppercase tracking-widest flex items-center gap-2 border border-slate-100 dark:border-slate-800 transition-all active:scale-95"
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                    LİNKİ AÇ
                                                </a>
                                            </div>
                                        </div>
                                        {task.description && (
                                            <div className="mt-8 p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 shadow-inner">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 opacity-70">AÇIKLAMA</p>
                                                <p className="text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
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

            {/* Modal */}
            <CreateTaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateTask}
            />
        </div>
    );
}
