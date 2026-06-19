import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { listMiembros } from "@/lib/actions/institucion";
import { AdminMiembrosClient } from "./client";

export default async function AdminMiembros() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: membres } = await supabase
    .from("miembros_institucion")
    .select("rol, institucion_id")
    .eq("usuario_id", user.id);

  const adminRole = (membres || []).find(m => m.rol === "admin_plantel" || m.rol === "coordinador");
  if (!adminRole) redirect("/dashboard");

  const lista = await listMiembros(adminRole.institucion_id);
  return <AdminMiembrosClient miembros={lista} institucionId={adminRole.institucion_id} />;
}
