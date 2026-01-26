"use client";

import { ListTodo, Plus, Filter } from "lucide-react";
import { Button } from "@repo/ui";

export default function TasksPage() {
    const taskStats = [
        { label: "Toplam Görev", value: "0", color: "blue" },
        { label: "Aktif Görevler", value: "0", color: "green" },
        { label: "Bekleyen Onay", value: "0", color: "orange" },
        { label: "Tamamlanan", value: "0", color: "violet" },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Görevler</h1>
                    <p className="mt-1 text-slate-500 dark:text-slate-400">Platform görevlerini yönetin</p>
                </div>
                <Button className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-700 hover:to-violet-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Yeni Görev
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                {taskStats.map((stat) => (
                    <div key={stat.label} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50 dark:backdrop-blur-sm">
                        <div className="flex items-center gap-3">
                            <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-${stat.color}-100 text-${stat.color}-600 dark:bg-${stat.color}-900/20 dark:text-${stat.color}-400`}>
                                <ListTodo className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50 dark:backdrop-blur-sm">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Görev Listesi</h2>
                    <Button variant="outline" className="border-slate-200 text-slate-500 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
                        <Filter className="mr-2 h-4 w-4" />
                        Filtrele
                    </Button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-200 dark:border-slate-800">
                                <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Görev Adı</th>
                                <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Kategori</th>
                                <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Ödül</th>
                                <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Durum</th>
                                <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Tamamlayan</th>
                                <th className="pb-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colSpan={6} className="py-12 text-center text-slate-500">
                                    Henüz görev bulunmuyor
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
