import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const rol = user.user_metadata?.rol;

  if (rol === "alumno") redirect("/alumno/pendientes");
  redirect("/dashboard");

  return null;
}
