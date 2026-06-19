import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const rol = user.user_metadata?.rol;

  // Check if admin/coordinador (user may have multiple roles)
  const { data: miembros } = await supabase
    .from("miembros_institucion")
    .select("rol")
    .eq("usuario_id", user.id);

  const roles = (miembros || []).map(m => m.rol);

  if (roles.includes("admin_plantel") || roles.includes("coordinador")) redirect("/admin/dashboard");
  if (rol === "alumno") redirect("/alumno/pendientes");
  redirect("/dashboard");

  return null;
}
