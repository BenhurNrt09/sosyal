"use server";

import { createClient } from "@repo/lib/src/server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

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

    return redirect("/dashboard");
}

export async function signUp(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const fullName = formData.get("fullName") as string;
    const username = formData.get("username") as string;

    const supabase = await createClient();

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
