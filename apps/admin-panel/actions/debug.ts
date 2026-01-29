"use server";
import { createClient } from "@repo/lib/src/server";

export async function debugCurrentUser() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "No user session" };

    const { data: profile, error: profileError } = await (supabase as any)
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    return {
        auth_user: {
            id: user.id,
            email: user.email,
        },
        profile,
        profileError
    };
}
