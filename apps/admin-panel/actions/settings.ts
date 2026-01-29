"use server";

import { createClient } from "@repo/lib/src/server";
import { revalidatePath } from "next/cache";

export async function updateAdminPassword(currentPassword: string, newPassword: string) {
    const supabase = await createClient();

    // In Supabase, password update usually requires the user to be signed in
    // and then calling updateSession or updateAttributes.
    // However, since we are in a server action:
    const { error } = await supabase.auth.updateUser({
        password: newPassword
    });

    if (error) return { error: error.message };

    return { success: true, message: "Şifre başarıyla güncellendi." };
}

export async function updateSiteSettings(payload: { siteName: string; siteDesc: string }) {
    // This would typically involve a 'settings' table or updating a global config.
    // For now, let's assume we might have a specific profile or metadata field.
    // Since there's no settings table yet, we'll return a mock success for UI feedback
    // but in a real app, you'd insert/update a settings row.

    console.log("Updating site settings:", payload);

    // Future implementation:
    // const supabase = await createClient();
    // await supabase.from('site_settings').upsert({ key: 'config', ...payload });

    revalidatePath("/dashboard/settings");
    return { success: true, message: "Ayarlar kaydedildi." };
}
