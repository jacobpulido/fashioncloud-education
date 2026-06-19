import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminDashboard() {
  const supabase = await createClient();
  const { data: { user }, error: userErr } = await supabase.auth.getUser();

  let debug = `User: ${user?.email || "none"}`;
  debug += `\nUser error: ${userErr?.message || "none"}`;

  if (!user) {
    redirect("/login");
    return <pre>{debug}</pre>;
  }

  const { data: rows, error: dbErr } = await supabase
    .from("miembros_institucion")
    .select("rol, institucion_id")
    .eq("usuario_id", user.id);

  debug += `\n\nDB query: ${JSON.stringify(rows)}`;
  debug += `\nDB error: ${dbErr?.message || "none"}`;
  debug += `\n\nNEXT_PUBLIC_SUPABASE_URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) || "NOT SET"}`;

  // Force output
  return (
    <html>
      <body style={{fontFamily:"monospace", padding:40, background:"#0b1120", color:"white", whiteSpace:"pre-wrap"}}>
        <h1 style={{color:"#6366f1"}}>Admin Debug</h1>
        <pre>{debug}</pre>
        <hr style={{margin:"20px 0", borderColor:"#333"}} />
        <a href="/dashboard" style={{color:"#6366f1", marginRight:16}}>Dashboard</a>
        <a href="/admin/dashboard" style={{color:"#6366f1"}}>Admin (reload)</a>
      </body>
    </html>
  );
}
