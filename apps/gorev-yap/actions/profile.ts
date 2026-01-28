"use server";

import { createClient } from "@repo/lib/src/server";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
    const supabase = await createClient();

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
        return { error: "Kullanıcı oturumu bulunamadı" };
    }

    // Extract form data
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const deviceType = formData.get("deviceType") as string;
    const instagram = formData.get("instagram") as string;
    const tiktok = formData.get("tiktok") as string;
    const twitter = formData.get("twitter") as string;
    const youtube = formData.get("youtube") as string;

    // Update profile
    const { error: updateError } = await supabase
        .from("profiles")
        .update({
            name,
            full_name: name, // Sync full_name as well
            phone: phone || null,
            device_type: deviceType || null,
            instagram_username: instagram || null,
            tiktok_username: tiktok || null,
            twitter_username: twitter || null,
            youtube_username: youtube || null,
            updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

    if (updateError) {
        console.error("Profile update error:", updateError);
        return { error: "Profil güncellenirken bir hata oluştu" };
    }

    revalidatePath("/profile");
    return { success: true };
}

export async function getProfile() {
    const supabase = await createClient();

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
        return { error: "Kullanıcı oturumu bulunamadı" };
    }

    const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    if (profileError) {
        console.error("Profile fetch error:", profileError);
        return { error: "Profil yüklenirken bir hata oluştu" };
    }

    return { profile };
}
