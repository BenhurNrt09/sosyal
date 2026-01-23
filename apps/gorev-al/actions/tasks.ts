"use server";

import { createClient } from "@repo/lib/src/server";
import { Task } from "@repo/types";

export async function getTasks() {
    const supabase = createClient();

    const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching tasks:", error);
        return [];
    }

    return data as Task[];
}

export async function getTaskById(id: string) {
    const supabase = createClient();

    const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        console.error("Error fetching task:", error);
        return null;
    }

    return data as Task;
}
