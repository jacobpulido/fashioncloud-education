import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { listMiembros } from "@/lib/actions/institucion";
import { AdminMiembrosClient } from "./client";

export default async function AdminMiembros() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: miembros } = await supabase
    .from("miembros_institucion")
    .select("institucion_id, rol")
    .eq("usuario_id", user.id);

  const adminRole = (miembros || []).find(m => ["admin_plantel", "coordinador"].includes(m.rol));
  if (!adminRole) redirect("/dashboard");

  const lista = await listMiembros(adminRole.institucion_id);

  return <AdminMiembrosClient miembros={lista} institucionId={adminRole.institucion_id} />;
}
