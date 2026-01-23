"use client";

import { useState } from "react";
import { Plus, Clock, CheckCircle2, XCircle, AlertCircle, List } from "lucide-react";
import { Button } from "@repo/ui/src/components/ui/button";

type TaskStatus = "all" | "pending" | "completed" | "rejected" | "waiting";

export default function TasksPage() {
    const [activeTab, setActiveTab] = useState<TaskStatus>("all");

    const tabs = [
        { id: "all" as TaskStatus, label: "Tümü", icon: List, count: 0 },
        { id: "pending" as TaskStatus, label: "Devam Eden", icon: Clock, count: 0 },
        { id: "completed" as TaskStatus, label: "Tamamlanan", icon: CheckCircle2, count: 0 },
        { id: "rejected" as TaskStatus, label: "Reddedilen", icon: XCircle, count: 0 },
        { id: "waiting" as TaskStatus, label: "Bekleyen", icon: AlertCircle, count: 0 },
    ];

    return (
        <div className="space-y-6">
            {/* Header with Add Button */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black text-slate-900">Görevlerim</h2>
                <Button className="bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl px-6 py-3 shadow-lg shadow-violet-200">
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
                                        ? "bg-violet-600 text-white shadow-md shadow-violet-200"
                                        : "text-slate-500 hover:bg-violet-50 hover:text-violet-600"
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
                {/* Empty State */}
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-20 h-20 bg-violet-50 text-violet-600 rounded-2xl flex items-center justify-center mb-6">
                        <List className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-2">
                        {activeTab === "all" && "Henüz Görev Yok"}
                        {activeTab === "pending" && "Devam Eden Görev Yok"}
                        {activeTab === "completed" && "Tamamlanmış Görev Yok"}
                        {activeTab === "rejected" && "Reddedilen Görev Yok"}
                        {activeTab === "waiting" && "Bekleyen Görev Yok"}
                    </h3>
                    <p className="text-slate-500 mb-6 max-w-md">
                        Henüz bu kategoride görev bulunmuyor. Yeni görev ekleyerek başlayabilirsiniz.
                    </p>
                    <Button className="bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl px-6 py-3 shadow-lg shadow-violet-200">
                        <Plus className="mr-2 h-4 w-4" />
                        İlk Görevi Ekle
                    </Button>
                </div>
            </div>
        </div>
    );
}
