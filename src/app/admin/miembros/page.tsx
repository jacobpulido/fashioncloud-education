import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { listMiembros } from "@/lib/actions/institucion";
import { AdminMiembrosClient } from "./client";

export default async function AdminMiembros() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: miembro } = await supabase
    .from("miembros_institucion")
    .select("institucion_id, rol")
    .eq("usuario_id", user.id)
    .single();

  if (!miembro || !["admin_plantel", "coordinador"].includes(miembro.rol)) redirect("/dashboard");

  const miembros = await listMiembros(miembro.institucion_id);

  return <AdminMiembrosClient miembros={miembros} institucionId={miembro.institucion_id} />;
}
