"use server";

import { createClient } from "@repo/lib/src/server";
import { Task, TaskSubmission } from "@repo/types";

export async function getMyTasks() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("created_by", user.id)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching my tasks:", error);
        return [];
    }

    return data as Task[];
}

export async function getTaskWithSubmissions(taskId: string) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    // Verify ownership
    const { data: task } = await supabase
        .from("tasks")
        .select("*")
        .eq("id", taskId)
        .eq("created_by", user.id)
        .single();

    if (!task) return null;

    // Get submissions
    const { data: submissions } = await supabase
        .from("task_submissions")
        .select(`
      *,
      profiles:worker_id (
        username,
        full_name,
        avatar_url
      )
    `)
        .eq("task_id", taskId)
        .order("created_at", { ascending: false });

    return { task: task as Task, submissions: submissions as any[] };
}
