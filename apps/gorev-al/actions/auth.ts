"use server";

import { createClient, createAdminClient } from "@repo/lib/src/server";
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

export async function signIn(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const rememberMe = formData.get("rememberMe") === "true";
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: {
            // If rememberMe is true, session persists; otherwise, it's a session-only login
            // By default, Supabase persists sessions in localStorage
            // For session-only, we would need custom handling or rely on browser session storage
        }
    });

    if (error) {
        return { error: translateError(error.message) };
    }

    // Step 2: Check App Authorization (App Isolation)
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
        const { data: profile } = await supabase
            .from("profiles")
            .select("is_parala_user, role")
            .eq("id", user.id)
            .single();

        if (profile?.role !== 'admin' && !profile?.is_parala_user) {
            await supabase.auth.signOut();
            return { error: "Bu uygulama için kaydınız bulunmamaktadır. Lütfen kayıt olun." };
        }
    }

    return redirect("/dashboard");
}

export async function signUp(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const fullName = formData.get("fullName") as string;
    const username = formData.get("username") as string;

    const supabase = await createClient();

    // Session Cleanup: Ensure any previous user is signed out before new registration
    await supabase.auth.signOut();

    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`,
            data: {
                full_name: fullName,
                username: username,
                name: fullName,
                role: 'user',
                is_parala_user: true,
                is_dijital_havuz_user: false
            },
        },
    });

    if (authError) {
        return { error: translateError(authError.message) };
    }

    // Profile is automatically created by database trigger (handle_new_user)
    // No need to manually insert to avoid duplicate key errors

    return { success: true };
}

export async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    return redirect("/");
}

export async function checkResetEmail(email: string) {
    const supabase = createClient();
    const { data: profile, error } = await supabase
        .from("profiles")
        .select("id, is_parala_user")
        .eq("email", email)
        .single();

    if (error || !profile) {
        return { error: "Bu e-posta adresi ile kayıtlı kullanıcı bulunamadı." };
    }

    if (!profile.is_parala_user) {
        return { error: "Bu uygulama için yetkiniz bulunmamaktadır." };
    }

    return { success: true };
}

export async function updatePassword(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const adminSupabase = createAdminClient();

    // 1. Get user id by email
    const { data: { users }, error: fetchError } = await adminSupabase.auth.admin.listUsers();
    const user = users.find(u => u.email === email);

    if (fetchError || !user) {
        return { error: "Kullanıcı güncellenirken bir hata oluştu." };
    }

    // 2. Update password
    const { error: updateError } = await adminSupabase.auth.admin.updateUserById(
        user.id,
        { password: password }
    );

    if (updateError) {
        return { error: "Şifre güncellenemedi: " + updateError.message };
    }

    return { success: true };
}
