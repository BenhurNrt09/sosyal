"use server";

import { createClient } from "@repo/lib/src/server";
import { revalidatePath } from "next/cache";

export async function updateUserRole(userId: string, role: string) {
    const supabase = await createClient();
    const { error } = await supabase
        .from("profiles")
        .update({ role })
        .eq("id", userId);

    if (error) return { error: error.message };
    revalidatePath("/dashboard/users");
    return { success: true };
}

export async function updateUserBalance(userId: string, amount: number) {
    const supabase = await createClient();

    // We update the balance field in profiles
    const { error } = await supabase
        .from("profiles")
        .update({ balance: amount })
        .eq("id", userId);

    if (error) return { error: error.message };

    // Notify user about balance adjustment
    await supabase.from("notifications").insert({
        user_id: userId,
        title: "Bakiye Güncellendi",
        message: `Hesap bakiyeniz yönetici tarafından ${amount} TL olarak güncellendi.`,
        type: 'payment',
        link: '/wallet'
    });

    revalidatePath("/dashboard/users");
    return { success: true };
}

export async function deleteUserAccount(userId: string) {
    const supabase = await createClient();

    // Note: This only deletes public.profiles due to RLS/Foreign Key.
    // Full deletion requires auth admin API which usually isn't available in standard server client.
    // For now, we delete from profiles.
    const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", userId);

    if (error) return { error: error.message };
    revalidatePath("/dashboard/users");
    return { success: true };
}
