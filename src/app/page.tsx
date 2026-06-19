import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Use the is_admin() RPC (bypasses RLS via SECURITY DEFINER)
  const { data: admin } = await supabase.rpc("is_admin");
  
  if (admin) redirect("/admin/dashboard");
  
  const rol = user.user_metadata?.rol;
  if (rol === "alumno") redirect("/alumno/pendientes");
  
  redirect("/dashboard");
}
