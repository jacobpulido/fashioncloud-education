"use client";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export default function Page() {
  const [msg, setMsg] = useState("Verificando...");

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = "/login"; return; }
      
      const { data: admin, error } = await supabase.rpc("is_admin");
      
      if (error) { setMsg("Error: " + error.message); return; }
      
      if (admin) {
        setMsg("✅ Admin");
      } else {
        setMsg("❌ No admin (is_admin returned false)");
      }
    })();
  }, []);

  return <div style={{padding:40,fontFamily:"system-ui"}}>
    <h1>Admin Dashboard</h1>
    <pre style={{background:"#f0f0f0",padding:16,borderRadius:8}}>{msg}</pre>
    <a href="/dashboard" style={{color:"#6366f1"}}>← Back</a>
  </div>;
}
