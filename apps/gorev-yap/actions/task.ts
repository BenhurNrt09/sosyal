"use server";

import { createClient } from "@repo/lib/src/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createTask(formData: FormData) {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const platform = formData.get("platform") as string;
    const type = formData.get("type") as string;
    const quantity = parseInt(formData.get("quantity") as string);
    const price = parseFloat(formData.get("price") as string);

    const totalBudget = quantity * price;

    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { error: "Oturum açmanız gerekiyor." };
    }

    // Check balance (Mock check for MVP, normally we query profile)
    /*
    const { data: profile } = await supabase.from('profiles').select('balance').eq('id', user.id).single();
    if (profile.balance < totalBudget) {
        return { error: "Yetersiz bakiye." };
    }
    */

    const { error } = await supabase.from("tasks").insert({
        created_by: user.id,
        title,
        description,
        platform: platform as any,
        task_type: type as any,
        total_quantity: quantity,
        remaining_quantity: quantity,
        price_per_action: price,
        total_budget: totalBudget,
        status: 'active'
    });

    if (error) {
        console.error("Create task error:", error);
        return { error: "Görev oluşturulurken bir hata oluştu." };
    }

    // Deduct balance logic would go here

    revalidatePath("/dashboard/tasks");
    redirect("/dashboard/tasks");
}
