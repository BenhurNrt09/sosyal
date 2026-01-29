"use client";

import { useState, useEffect } from "react";
import { getTasks, subscribeToTasks, Task, applyForTask } from "@repo/lib";
import { createClient } from "@repo/lib/src/supabase";
import { Heart, MessageCircle, UserPlus, Share2, Eye, Play, ExternalLink, CheckCircle, Loader2, Target, Zap, DollarSign } from "lucide-react";
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

const getPlatformColor = (platform: string) => {
    const colors: Record<string, string> = {
        instagram: "from-pink-500 to-purple-600 shadow-pink-200/50",
        twitter: "from-blue-400 to-blue-600 shadow-blue-200/50",
        facebook: "from-blue-600 to-blue-700 shadow-indigo-200/50",
        youtube: "from-red-500 to-red-600 shadow-red-200/50",
        tiktok: "from-slate-900 to-slate-800 shadow-slate-200/50",
    };
    return colors[platform] || "from-violet-600 to-purple-600 shadow-violet-200/50";
};

export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [filter, setFilter] = useState<"all" | string>("all");
    const [loading, setLoading] = useState(true);
    const [appliedTaskId, setAppliedTaskId] = useState<string | null>(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    useEffect(() => {
        loadTasks();

        const unsubscribe = subscribeToTasks((updatedTasks) => {
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
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            alert("Lütfen önce giriş yapın.");
            return;
        }

        const success = await applyForTask(taskId, user.id);
        if (success) {
            setAppliedTaskId(taskId);
            setShowSuccessModal(true);
            loadTasks();
        } else {
            alert("Başvuru sırasında bir hata oluştu. Muhtemelen zaten başvurdunuz.");
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <Loader2 className="w-12 h-12 text-violet-600 animate-spin" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Aktif Görevler Taranıyor</p>
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">Yeni Görevler</h1>
                    <p className="mt-1 text-slate-500 dark:text-slate-400 font-medium text-sm">Size uygun görevlere başvurun ve hemen kazanın</p>
                </div>
            </div>

            {/* Platform Filter */}
            <div className="bg-white/50 dark:bg-slate-900/30 backdrop-blur-sm rounded-[2rem] p-2 border border-slate-100 dark:border-slate-800">
                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                    {platforms.map(platform => (
                        <button
                            key={platform}
                            onClick={() => setFilter(platform)}
                            className={`px-6 py-4 rounded-2xl font-black text-[10px] tracking-widest transition-all whitespace-nowrap uppercase
                                ${filter === platform
                                    ? "bg-violet-600 text-white shadow-lg shadow-violet-200/50"
                                    : "text-slate-400 dark:text-slate-500 hover:bg-violet-50 dark:hover:bg-slate-800/50 hover:text-violet-600"
                                }`}
                        >
                            {platform === "all" ? "TÜMÜ" : platform}
                        </button>
                    ))}
                </div>
            </div>

            {/* Task Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredTasks.length === 0 ? (
                    <Card className="col-span-full rounded-[3rem] border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 dark:backdrop-blur-sm shadow-sm overflow-hidden">
                        <CardContent className="p-20 flex flex-col items-center justify-center text-center">
                            <div className="w-24 h-24 bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-inner">
                                <Target className="w-10 h-10" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3 uppercase tracking-tight">HİÇ GÖREV YOK</h3>
                            <p className="text-slate-500 dark:text-slate-400 font-medium mb-10 max-w-sm text-sm">
                                Şu anda başvuruya açık görev bulunmuyor. Yeni görevler için bildirimlerimizi takipte kalın.
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    filteredTasks.map((task) => {
                        const TaskIcon = getTaskTypeIcon(task.taskType);
                        const platformColor = getPlatformColor(task.platform);

                        return (
                            <Card
                                key={task.id}
                                className="rounded-[2.5rem] border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 dark:backdrop-blur-sm overflow-hidden hover:shadow-2xl hover:shadow-violet-200/30 dark:hover:shadow-none transition-all group relative"
                            >
                                <CardContent className="p-8">
                                    {/* Header */}
                                    <div className="flex items-start gap-4 mb-6">
                                        <div className={`w-16 h-16 rounded-[1.5rem] bg-gradient-to-br ${platformColor} flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                                            <TaskIcon className="w-8 h-8 text-white" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-[9px] font-black text-violet-600 dark:text-violet-400 uppercase tracking-widest bg-violet-50 dark:bg-violet-900/20 px-2 py-0.5 rounded-lg border border-violet-100 dark:border-violet-800/50">
                                                    {task.platformName}
                                                </span>
                                            </div>
                                            <h3 className="font-black text-slate-900 dark:text-white text-xl tracking-tighter uppercase leading-tight line-clamp-1">
                                                {task.taskTypeName}
                                            </h3>
                                        </div>
                                    </div>

                                    {/* Account Info */}
                                    <div className="mb-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                        <div>
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">HESAP</p>
                                            <p className="font-black text-slate-700 dark:text-slate-200 text-sm tracking-tight">{task.accountName}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">MİKTAR</p>
                                            <p className="font-black text-slate-700 dark:text-slate-200 text-sm tracking-tight">{task.quantity}</p>
                                        </div>
                                    </div>

                                    {/* Payment Section */}
                                    <div className="mb-8 flex items-end justify-between px-2">
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 opacity-70">TOPLAM ÖDEME</p>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400 tracking-tighter">
                                                    {(Number(task.quantity) * Number(task.price)).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                                                </span>
                                                <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">₺</span>
                                            </div>
                                        </div>
                                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-inner">
                                            <DollarSign className="w-6 h-6" />
                                        </div>
                                    </div>

                                    {/* Description */}
                                    {task.description && (
                                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-8 line-clamp-2 leading-relaxed">
                                            {task.description}
                                        </p>
                                    )}

                                    {/* Actions */}
                                    <div className="flex gap-3 pt-4 border-t border-slate-50 dark:border-slate-800">
                                        <Button
                                            onClick={() => handleApply(task.id)}
                                            disabled={appliedTaskId === task.id}
                                            className={`flex-1 h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl transition-all active:scale-[0.98] ${appliedTaskId === task.id
                                                ? "bg-emerald-500 text-white cursor-default shadow-emerald-200/50"
                                                : "bg-violet-600 hover:bg-violet-700 text-white shadow-violet-200/50"
                                                }`}
                                        >
                                            {appliedTaskId === task.id ? (
                                                <span className="flex items-center gap-2">
                                                    <CheckCircle className="w-4 h-4" /> BAŞVURULDU
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-2">
                                                    <Zap className="w-4 h-4" /> HEMEN BAŞVUR
                                                </span>
                                            )}
                                        </Button>
                                        <a
                                            href={task.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center border border-slate-100 dark:border-slate-800 text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-all hover:bg-slate-100 active:scale-95"
                                        >
                                            <ExternalLink className="w-5 h-5" />
                                        </a>
                                    </div>
                                </CardContent>
                                {/* Platform Branding Bar */}
                                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${platformColor} opacity-50`} />
                            </Card>
                        );
                    })
                )}
            </div>

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-md z-[60] flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-12 w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-300 text-center border border-slate-100 dark:border-slate-800">
                        <div className="w-24 h-24 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner ring-8 ring-emerald-50/50 dark:ring-emerald-900/10">
                            <CheckCircle className="w-12 h-12" />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-3 tracking-tighter uppercase">İŞLEM TAMAM!</h2>
                        <p className="text-slate-500 dark:text-slate-400 font-bold mb-10 text-sm leading-relaxed">
                            Göreve başvurunuz başarıyla alındı. <br />
                            <span className="text-violet-600 dark:text-violet-400 uppercase text-[10px] tracking-widest font-black">"KANITLARIM"</span> <br />
                            kısmından takibini yapabilirsiniz.
                        </p>
                        <Button
                            onClick={() => setShowSuccessModal(false)}
                            className="w-full h-14 bg-slate-900 hover:bg-black text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl"
                        >
                            ANLADIM
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
