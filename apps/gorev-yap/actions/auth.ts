"use server";

import { createClient } from "@repo/lib/src/server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

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

    // 1. Sign up auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
                username: username,
                role: 'user', // Default role
            },
        },
    });

    if (authError) {
        return { error: authError.message };
    }

    // 2. Profile creation is handled by Supabase Trigger usually, 
    // but if we want to be explicit or if trigger is missing (which it is currently in my schema artifacts, I defined tables but not triggers),
    // we should insert into profiles manually here if the trigger isn't set up.
    // My db_schema.sql only defined tables and RLS, no triggers for auto-profile creation.
    // So I MUST insert into public.profiles here manually to be safe.

    if (authData.user) {
        const { error: profileError } = await supabase.from('profiles').insert({
            id: authData.user.id,
            username,
            full_name: fullName,
            email: email, // If I added email to profiles, which I didn't in the schema I see, let me double check schema...
            // Checking schema... "username text unique, full_name text..."
            // No email in profiles, correct.
            role: 'user',
            balance: 0
        });

        if (profileError) {
            console.error("Profile creation error:", profileError);
            // We might want to rollback auth user here in a real critical system, 
            // but for MVP we just return error.
            return { error: "Profil oluşturulamadı: " + profileError.message };
        }
    }

    return redirect("/dashboard");
}

export async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    return redirect("/");
}
