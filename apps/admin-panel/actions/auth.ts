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

export async function signIn(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return { error: translateError(error.message) };
    }

    // Double check if user is admin - in a real app this is robust middleware check
    // For now we just login.
    return redirect("/dashboard");
}
