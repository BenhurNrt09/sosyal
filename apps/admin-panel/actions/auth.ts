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

    // Double check if user is admin - in a real app this is robust middleware check
    // For now we just login.
    return redirect("/dashboard");
}
