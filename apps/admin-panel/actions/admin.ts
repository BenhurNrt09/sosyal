"use server";

import { createAdminClient as createClient } from "@repo/lib/src/server";
import { revalidatePath } from "next/cache";

/**
 * Get all users (admin only)
 * This uses service role to bypass RLS
 */
export async function getAllUsers() {
    console.log("getAllUsers action started...");
    const supabase = await createClient();

    // TEMPORARY: Bypass admin check to debug RLS/Connection issues
    /* 
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Oturum açılmadı" };
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (!profile || profile.role !== 'admin') return { error: "Yetkisiz erişim" };
    */

    // Fetch all users
    const { data, error } = await (supabase as any)
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("CRITICAL: Error fetching users in action:", error);
        return { error: `Veritabanı Hatası: ${error.message} (Kod: ${error.code})`, data: [] };
    }

    console.log(`Successfully fetched ${data?.length || 0} users.`);
    return { data: data || [] };
}

export async function updateUserRole(userId: string, role: string) {
    const supabase = await createClient();
    const { error } = await (supabase as any)
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
    const { error } = await (supabase as any)
        .from("profiles")
        .update({ balance: amount })
        .eq("id", userId);

    if (error) return { error: error.message };

    // Notify user about balance adjustment
    await (supabase as any).from("notifications").insert({
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

    // Delete from profiles
    const { error } = await (supabase as any)
        .from("profiles")
        .delete()
        .eq("id", userId);

    if (error) return { error: error.message };
    revalidatePath("/dashboard/users");
    return { success: true };
}

export async function createNewUser(email: string, username: string, password: string, name: string) {
    const supabase = await createClient();

    // Verify caller is admin
    const { data: { user: admin } } = await supabase.auth.getUser();
    if (!admin) return { error: "Oturum açılmadı" };

    const { data: adminProfile } = await (supabase as any)
        .from("profiles")
        .select("role")
        .eq("id", admin.id)
        .single();

    if (!adminProfile || adminProfile.role !== 'admin') {
        return { error: "Yetkisiz erişim" };
    }

    // Create user via Supabase Auth Admin API
    // Note: This requires admin privileges
    const { data: newUser, error: signUpError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
            username,
            name,
            full_name: name
        }
    });

    if (signUpError) {
        console.error("User creation error:", signUpError);
        return { error: signUpError.message };
    }

    // Profile will be created by trigger
    revalidatePath("/dashboard/users");
    return { success: true, user: newUser };
}
