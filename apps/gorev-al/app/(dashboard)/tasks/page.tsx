"use client";

import { useState, useEffect } from "react";
import { getTasks, subscribeToTasks, updateTask, Task, applyForTask } from "@repo/lib";
import { createClient } from "@repo/lib/src/supabase";
import { Heart, MessageCircle, UserPlus, Share2, Eye, Play, ExternalLink, CheckCircle } from "lucide-react";
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

const getPlatformColor = (platform: string) => {
    const colors: Record<string, string> = {
        instagram: "from-pink-500 to-purple-600",
        twitter: "from-blue-400 to-blue-600",
        facebook: "from-blue-600 to-blue-700",
        youtube: "from-red-500 to-red-600",
        tiktok: "from-black to-gray-800",
    };
    return colors[platform] || "from-violet-600 to-purple-600";
};

export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [filter, setFilter] = useState<"all" | string>("all");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTasks();

        // Subscribe to real-time updates
        const unsubscribe = subscribeToTasks((updatedTasks) => {
            // Filter only pending tasks
            setTasks(updatedTasks.filter(t => t.status === "pending"));
        });

        return unsubscribe;
    }, []);

    const loadTasks = async () => {
        setLoading(true);
        const allTasks = await getTasks();
        setTasks(allTasks.filter(t => t.status === "pending"));
        setLoading(false);
    };

    const filteredTasks = filter === "all"
        ? tasks
        : tasks.filter(t => t.platform === filter);

    const platforms = ["all", "instagram", "twitter", "facebook", "youtube", "tiktok"];

    const handleApply = async (taskId: string) => {
        // In a real app, we'd get the actual user ID from Auth.
        // For now, let's assume we have a way to get it or mock it.
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            alert("Lütfen önce giriş yapın.");
            return;
        }

        const success = await applyForTask(taskId, user.id);
        if (success) {
            alert("Göreve başvurunuz alındı! Admin onayından sonra işleme başlayabilirsiniz.");
            loadTasks();
        } else {
            alert("Başvuru sırasında bir hata oluştu. Muhtemelen zaten başvurdunuz.");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-500">Görevler yükleniyor...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-black text-slate-900 mb-2">Yeni Görevler</h1>
                <p className="text-slate-500">Görevlere başvurun ve kazanmaya başlayın!</p>
            </div>

            {/* Platform Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                {platforms.map(platform => (
                    <button
                        key={platform}
                        onClick={() => setFilter(platform)}
                        className={`px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${filter === platform
                            ? "bg-violet-600 text-white shadow-md"
                            : "bg-white text-slate-600 border border-slate-200 hover:border-violet-500"
                            }`}
                    >
                        {platform === "all" ? "Tümü" : platform.charAt(0).toUpperCase() + platform.slice(1)}
                    </button>
                ))}
            </div>

            {/* Task Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTasks.length === 0 ? (
                    <div className="col-span-full bg-white rounded-[2rem] p-16 shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
                        <div className="w-20 h-20 bg-violet-50 text-violet-600 rounded-2xl flex items-center justify-center mb-4">
                            <CheckCircle className="w-10 h-10" />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mb-2">Görev Bulunamadı</h3>
                        <p className="text-slate-500">Şu anda müsait görev bulunmuyor. Daha sonra tekrar kontrol edin.</p>
                    </div>
                ) : (
                    filteredTasks.map((task) => {
                        const TaskIcon = getTaskTypeIcon(task.taskType);
                        const platformColor = getPlatformColor(task.platform);

                        return (
                            <div
                                key={task.id}
                                className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-shadow"
                            >
                                {/* Header */}
                                <div className="flex items-start gap-3 mb-4">
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${platformColor} flex items-center justify-center shrink-0`}>
                                        <TaskIcon className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-black text-slate-900 text-lg truncate">
                                            {task.taskTypeName}
                                        </h3>
                                        <p className="text-sm text-slate-500">{task.platformName}</p>
                                    </div>
                                </div>

                                {/* Account */}
                                <div className="mb-4 p-3 bg-slate-50 rounded-lg">
                                    <p className="text-xs text-slate-500 mb-1">Hesap</p>
                                    <p className="font-bold text-slate-900">{task.accountName}</p>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">Miktar</p>
                                        <p className="font-bold text-slate-900">{task.quantity}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">Ödeme</p>
                                        <p className="font-bold text-emerald-600 text-lg">
                                            {(Number(task.quantity) * Number(task.price)).toFixed(2)}₺
                                        </p>
                                    </div>
                                </div>

                                {task.description && (
                                    <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                                        {task.description}
                                    </p>
                                )}

                                {/* Actions */}
                                <div className="flex gap-2">
                                    <Button
                                        onClick={() => handleApply(task.id)}
                                        className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-xl font-bold"
                                    >
                                        Başvur
                                    </Button>
                                    <a
                                        href={task.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-4 py-2 rounded-xl border-2 border-slate-200 hover:border-violet-500 flex items-center justify-center transition-colors"
                                    >
                                        <ExternalLink className="w-4 h-4 text-slate-600" />
                                    </a>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
