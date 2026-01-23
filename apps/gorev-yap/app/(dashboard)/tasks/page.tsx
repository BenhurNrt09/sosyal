import { getMyTasks } from "../../actions/management";
import { Button } from "@repo/ui/components/ui/button";
import { PlusCircle, Search } from "lucide-react";
import Link from "next/link";

export default async function MyTasksPage() {
    const tasks = await getMyTasks();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">Görevlerim</h2>
                <Link href="/dashboard/tasks/new">
                    <Button className="bg-orange-600 hover:bg-orange-700 gap-2">
                        <PlusCircle className="h-4 w-4" />
                        Yeni Görev
                    </Button>
                </Link>
            </div>

            <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
                <div className="p-4 border-b bg-slate-50 flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <input
                            className="h-9 w-full rounded-md border border-input bg-white pl-9 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-600"
                            placeholder="Görev ara..."
                        />
                    </div>
                </div>

                <div className="relative w-full overflow-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 uppercase font-medium">
                            <tr>
                                <th className="px-6 py-3">Başlık</th>
                                <th className="px-6 py-3">Platform</th>
                                <th className="px-6 py-3">İlerleme</th>
                                <th className="px-6 py-3">Bütçe</th>
                                <th className="px-6 py-3">Durum</th>
                                <th className="px-6 py-3 text-right">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {tasks.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                        Henüz hiç görev oluşturmadınız.
                                    </td>
                                </tr>
                            ) : (
                                tasks.map((task) => (
                                    <tr key={task.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-900">{task.title}</td>
                                        <td className="px-6 py-4">
                                            <span className="capitalize px-2 py-1 rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
                                                {task.platform}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="h-2 w-24 rounded-full bg-slate-100 overflow-hidden">
                                                    <div
                                                        className="h-full bg-green-500"
                                                        style={{ width: `${((task.total_quantity - task.remaining_quantity) / task.total_quantity) * 100}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs text-slate-500">
                                                    {task.total_quantity - task.remaining_quantity}/{task.total_quantity}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-slate-900">
                                            {task.total_budget}₺
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${task.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'
                                                }`}>
                                                {task.status === 'active' ? 'Aktif' : task.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link href={`/dashboard/tasks/${task.id}`}>
                                                <Button size="sm" variant="outline">
                                                    Yönet
                                                </Button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
