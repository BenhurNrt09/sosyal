import { getTasks } from "../../actions/tasks";
import { Button } from "@repo/ui/components/ui/button";
import { Badge } from "lucide-react"; // Note: simple icon for now, later use UI badge
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle
} from "@repo/ui/components/ui/card"; // We need to create Card component in UI package first if not exists, but I'll assume standard shadcn structure or create it now.

// Let's assume we need to create the Card component in @repo/ui first, 
// strictly following the plan, I should check if it exists or create it. 
// For now, I will create a basic grid layout and if Card is missing I will add it in the next step.
// Actually, I haven't added Card to @repo/ui yet. I should do that.
// BUT, to keep flow, I'll write this page to use standard HTML/Tailwind for cards first or generic divs, 
// then I'll add the Card component to @repo/ui to make it proper. 
// User wants professional design, so I should probably add the Card component to @repo/ui.

export default async function TasksPage() {
    const tasks = await getTasks();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">Görevler</h2>
                <div className="flex gap-2">
                    {/* Filters can go here */}
                    <Button variant="outline">Filtrele</Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {tasks.length === 0 ? (
                    <div className="col-span-full flex h-48 flex-col items-center justify-center rounded-xl border border-dashed bg-slate-50 text-slate-400">
                        <p>Şu an aktif görev bulunmuyor.</p>
                    </div>
                ) : (
                    tasks.map((task) => (
                        <div key={task.id} className="group relative overflow-hidden rounded-xl border bg-white shadow-sm transition-all hover:shadow-md">
                            <div className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-600 uppercase">
                                        {task.platform}
                                    </div>
                                    <span className="text-lg font-bold text-green-600">
                                        +{task.price_per_action}₺
                                    </span>
                                </div>
                                <h3 className="mt-4 text-lg font-bold text-slate-900 line-clamp-2">
                                    {task.title}
                                </h3>
                                <p className="mt-2 text-sm text-slate-500 line-clamp-2">
                                    {task.description || "Görev açıklaması bulunmuyor."}
                                </p>

                                <div className="mt-6 flex items-center justify-between text-sm text-slate-500">
                                    <span>Kalan: {task.remaining_quantity}</span>
                                    <span>{task.task_type}</span>
                                </div>
                            </div>
                            <div className="bg-slate-50 px-6 py-4">
                                <Button className="w-full bg-slate-900 hover:bg-slate-800">
                                    Görevi Yap
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
