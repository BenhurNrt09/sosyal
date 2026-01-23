"use server";

import { createClient } from "@repo/lib/src/server";
import { redirect } from "next/navigation";

export async function signIn(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return { error: error.message };
    }

    return redirect("/dashboard");
}

export async function signUp(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const fullName = formData.get("fullName") as string;
    const username = formData.get("username") as string;

    const supabase = createClient();

    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
                username: username,
                role: 'user',
            },
        },
    });

    if (authError) {
        return { error: authError.message };
    }

    if (authData.user) {
        const { error: profileError } = await supabase.from('profiles').insert({
            id: authData.user.id,
            username,
            full_name: fullName,
            role: 'user',
            balance: 0
        });

        if (profileError) {
            return { error: "Profil hatası: " + profileError.message };
        }
    }

    return redirect("/dashboard");
}
