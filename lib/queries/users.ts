import { supabaseAdmin } from "@/lib/supabase/admin";

export async function getAllUsers() {
  const { data, error } = await supabaseAdmin
    .from("user" as any)
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as any[]) || [];
}

export async function updateUserRole(userId: string, role: string) {
  const { data, error } = await supabaseAdmin
    .from("user" as any)
    .update({ role } as any)
    .eq("id", userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
