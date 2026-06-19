import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  try {
    const { data: rows } = await supabase
      .from("miembros_institucion")
      .select("rol")
      .eq("usuario_id", user.id);

    const ok = rows?.some(r => r.rol === "admin_plantel" || r.rol === "coordinador");
    if (!ok) redirect("/dashboard");
  } catch {
    redirect("/dashboard");
  }

  return <>{children}</>;
}
