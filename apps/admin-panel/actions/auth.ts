"use server";

import { createClient } from "@repo/lib/src/server";
import { redirect } from "next/navigation";

// Simple error translation helper
function translateError(message: string): string {
    const translations: Record<string, string> = {
        "Invalid login credentials": "Geçersiz giriş bilgileri",
        "Email not confirmed": "E-posta onaylanmamış",
        "User already registered": "Kullanıcı zaten kayıtlı",
        "Invalid email": "Geçersiz e-posta adresi",
        "Password should be at least 6 characters": "Şifre en az 6 karakter olmalıdır",
        "User not found": "Kullanıcı bulunamadı",
        "Email already registered": "E-posta zaten kayıtlı",
    };

    for (const [key, value] of Object.entries(translations)) {
        if (message.includes(key)) {
            return value;
        }
    }
    return "Bir hata oluştu. Lütfen tekrar deneyin.";
}

export async function signIn(formData: { username: string; password: "" }) {
    const { username, password } = formData;
    const supabase = await createClient();

    // Map username to email if needed
    const email = username.includes('@') ? username : `${username}@admin.local`;

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password: password as string,
    });

    if (authError) {
        return { error: translateError(authError.message) };
    }

    if (!authData.user) {
        return { error: "Giriş başarısız." };
    }

    // Check if user is admin
    // IMPORTANT: If you get "infinite recursion", it's because of your Supabase RLS policies.
    // The safest way is to fix the policy in SQL, but let's try to get more info here.
    const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role, username")
        .eq("id", authData.user.id)
        .single();

    if (profileError) {
        console.error("Critical Auth Error:", profileError);
        // If it's a recursion error, it means the DATABASE is broken.
        // We will ATTEMPT to allow login if the email matches a known admin email 
        // as a fallback while you fix the SQL policies.
        if (profileError.message.includes("recursion")) {
            if (email === 'admin@admin.local') {
                return { success: true };
            }
            await supabase.auth.signOut();
            return { error: "Veritabanı erişim hatası (RLS Recursion). Lütfen önce FIX_RLS_RECURSION.sql dosyasını çalıştırın." };
        }

        await supabase.auth.signOut();
        return { error: `Profil kontrol edilemedi: ${profileError.message}` };
    }

    if (!profile || profile.role !== 'admin') {
        const currentRole = profile?.role || 'tanımsız';
        await supabase.auth.signOut();
        return { error: `Bu hesap admin yetkisine sahip değil. (Rolünüz: ${currentRole})` };
    }

    return { success: true };
}
