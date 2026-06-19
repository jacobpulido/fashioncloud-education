"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function listarAlumnos() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  // Try to use the admin client to query auth.users
  // This requires SUPABASE_SERVICE_ROLE_KEY to be set
  try {
    const admin = createAdminClient();
    const { data } = await admin.auth.admin.listUsers({
      perPage: 1000,
    });
    
    if (data?.users) {
      return data.users
        .filter(u => u.id !== user.id)
        .map(u => ({
          id: u.id,
          email: u.email,
          nombre: u.user_metadata?.nombre || u.email,
          rol: u.user_metadata?.rol || "alumno",
        }));
    }
  } catch (e) {
    console.error("Admin client error:", e);
  }

  // Fallback: return empty
  return [];
}
