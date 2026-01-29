import { useState } from "react";
import { X, Instagram, Twitter, Facebook, Youtube, TrendingUp, Heart, MessageCircle, UserPlus, Share2, Eye, Play } from "lucide-react";
import { Button } from "@repo/ui/src/components/ui/button";
import { Task } from "@repo/lib";

interface TaskType {
    id: string;
    label: string;
    icon: any;
}

interface Platform {
    id: string;
    name: string;
    icon: any;
    color: string;
    taskTypes: TaskType[];
}

const platforms: Platform[] = [
    {
        id: "instagram",
        name: "Instagram",
        icon: Instagram,
        color: "from-pink-500 to-orange-600",
        taskTypes: [
            { id: "like", label: "Beğeni", icon: Heart },
            { id: "comment", label: "Yorum", icon: MessageCircle },
            { id: "follow", label: "Takip", icon: UserPlus },
            { id: "share", label: "Paylaşım", icon: Share2 },
            { id: "view", label: "Hikaye Görüntüleme", icon: Eye },
        ],
    },
    {
        id: "twitter",
        name: "Twitter",
        icon: Twitter,
        color: "from-blue-400 to-blue-600",
        taskTypes: [
            { id: "like", label: "Beğeni", icon: Heart },
            { id: "retweet", label: "Retweet", icon: Share2 },
            { id: "comment", label: "Yorum", icon: MessageCircle },
            { id: "follow", label: "Takip", icon: UserPlus },
        ],
    },
    {
        id: "facebook",
        name: "Facebook",
        icon: Facebook,
        color: "from-blue-600 to-blue-700",
        taskTypes: [
            { id: "like", label: "Beğeni", icon: Heart },
            { id: "comment", label: "Yorum", icon: MessageCircle },
            { id: "share", label: "Paylaşım", icon: Share2 },
            { id: "follow", label: "Takip", icon: UserPlus },
        ],
    },
    {
        id: "youtube",
        name: "YouTube",
        icon: Youtube,
        color: "from-red-500 to-red-600",
        taskTypes: [
            { id: "like", label: "Beğeni", icon: Heart },
            { id: "subscribe", label: "Abone Ol", icon: UserPlus },
            { id: "comment", label: "Yorum", icon: MessageCircle },
            { id: "view", label: "İzlenme", icon: Play },
        ],
    },
    {
        id: "tiktok",
        name: "TikTok",
        icon: TrendingUp,
        color: "from-black to-gray-800",
        taskTypes: [
            { id: "like", label: "Beğeni", icon: Heart },
            { id: "comment", label: "Yorum", icon: MessageCircle },
            { id: "follow", label: "Takip", icon: UserPlus },
            { id: "share", label: "Paylaşım", icon: Share2 },
            { id: "view", label: "İzlenme", icon: Eye },
        ],
    },
];

interface CreateTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (task: Omit<Task, 'id' | 'createdAt'>) => void;
}

export function CreateTaskModal({ isOpen, onClose, onSubmit }: CreateTaskModalProps) {
    const [step, setStep] = useState(1);
    const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);
    const [selectedTaskType, setSelectedTaskType] = useState<TaskType | null>(null);
    const [taskData, setTaskData] = useState({
        link: "",
        accountName: "",
        quantity: "",
        price: "",
        description: "",
    });

    const handlePlatformSelect = (platform: Platform) => {
        setSelectedPlatform(platform);
        setStep(2);
    };

    const handleTaskTypeSelect = (taskType: TaskType) => {
        setSelectedTaskType(taskType);
        setStep(3);
    };

    const handleSubmit = () => {
        const newTask: any = {
            platform: selectedPlatform!.id,
            platformName: selectedPlatform!.name,
            taskType: selectedTaskType!.id,
            taskTypeName: selectedTaskType!.label,
            ...taskData,
            status: "pending",
        };
        onSubmit(newTask);
        handleClose();
    };

    const handleClose = () => {
        setStep(1);
        setSelectedPlatform(null);
        setSelectedTaskType(null);
        setTaskData({
            link: "",
            accountName: "",
            quantity: "",
            price: "",
            description: "",
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-slate-100 px-8 py-6 flex justify-between items-center rounded-t-3xl">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900">Yeni Görev Oluştur</h2>
                        <p className="text-sm text-slate-500 mt-1">
                            {step === 1 && "Platform seçin"}
                            {step === 2 && "Görev türünü seçin"}
                            {step === 3 && "Görev detaylarını girin"}
                        </p>
                    </div>
                    <button
                        onClick={handleClose}
                        className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
                    >
                        <X className="w-5 h-5 text-slate-600" />
                    </button>
                </div>

                {/* Step Indicator */}
                <div className="px-8 py-4 bg-slate-50">
                    <div className="flex items-center justify-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 1 ? 'bg-orange-600 text-white' : 'bg-slate-200 text-slate-500'}`}>1</div>
                        <div className={`w-16 h-1 ${step >= 2 ? 'bg-orange-600' : 'bg-slate-200'}`} />
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 2 ? 'bg-orange-600 text-white' : 'bg-slate-200 text-slate-500'}`}>2</div>
                        <div className={`w-16 h-1 ${step >= 3 ? 'bg-orange-600' : 'bg-slate-200'}`} />
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 3 ? 'bg-orange-600 text-white' : 'bg-slate-200 text-slate-500'}`}>3</div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8">
                    {/* Step 1: Platform Selection */}
                    {step === 1 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                            {platforms.map((platform) => {
                                const Icon = platform.icon;
                                return (
                                    <button
                                        key={platform.id}
                                        onClick={() => handlePlatformSelect(platform)}
                                        className="p-6 rounded-2xl border-2 border-slate-200 hover:border-orange-500 hover:shadow-lg transition-all group"
                                    >
                                        <div className={`w-16 h-16 mx-auto rounded-xl bg-gradient-to-br ${platform.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                                            <Icon className="w-8 h-8 text-white" />
                                        </div>
                                        <p className="text-sm font-bold text-slate-900">{platform.name}</p>
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {/* Step 2: Task Type Selection */}
                    {step === 2 && selectedPlatform && (
                        <div>
                            <div className="mb-6 flex items-center gap-3">
                                <button
                                    onClick={() => setStep(1)}
                                    className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                                >
                                    ← Platform Değiştir
                                </button>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {selectedPlatform.taskTypes.map((taskType) => {
                                    const Icon = taskType.icon;
                                    return (
                                        <button
                                            key={taskType.id}
                                            onClick={() => handleTaskTypeSelect(taskType)}
                                            className="p-6 rounded-2xl border-2 border-slate-200 hover:border-orange-500 hover:shadow-lg transition-all group text-left"
                                        >
                                            <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                                <Icon className="w-6 h-6" />
                                            </div>
                                            <p className="font-bold text-slate-900">{taskType.label}</p>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Step 3: Task Details Form */}
                    {step === 3 && (
                        <div className="space-y-6">
                            <div className="mb-6 flex items-center gap-3">
                                <button
                                    onClick={() => setStep(2)}
                                    className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                                >
                                    ← Görev Türü Değiştir
                                </button>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">
                                    Link / URL
                                </label>
                                <input
                                    type="url"
                                    value={taskData.link}
                                    onChange={(e) => setTaskData({ ...taskData, link: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    placeholder="https://..."
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">
                                    Hesap Adı / Kullanıcı Adı
                                </label>
                                <input
                                    type="text"
                                    value={taskData.accountName}
                                    onChange={(e) => setTaskData({ ...taskData, accountName: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    placeholder="@kullaniciadi"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">
                                        Miktar
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={taskData.quantity}
                                        onChange={(e) => setTaskData({ ...taskData, quantity: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        placeholder="100"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">
                                        Birim Fiyat (₺)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={taskData.price}
                                        onChange={(e) => setTaskData({ ...taskData, price: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        placeholder="0.50"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">
                                    Açıklama (Opsiyonel)
                                </label>
                                <textarea
                                    value={taskData.description}
                                    onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                                    rows={3}
                                    placeholder="Ekstra notlar..."
                                />
                            </div>

                            {/* Total Preview */}
                            <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-slate-700">Toplam Tutar</span>
                                    <span className="text-2xl font-black text-orange-600">
                                        {(Number(taskData.quantity) * Number(taskData.price) || 0).toFixed(2)}₺
                                    </span>
                                </div>
                            </div>

                            <Button
                                onClick={handleSubmit}
                                disabled={!taskData.link || !taskData.accountName || !taskData.quantity || !taskData.price}
                                className="w-full bg-gradient-to-r from-orange-600 to-orange-600 hover:from-orange-700 hover:to-orange-700 text-white rounded-xl h-12 text-base font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Görevi Oluştur
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
