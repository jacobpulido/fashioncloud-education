"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export default function Page() {
  const [msg, setMsg] = useState("...");

  useEffect(() => {
    createClient().auth.getUser().then(({ data: { user } }) => {
      if (user) createClient().from("miembros_institucion").select("rol").eq("usuario_id", user.id).then(({ data }) => {
        setMsg(`User: ${user.email}, Roles: ${(data||[]).map(r=>r.rol).join(",") || "none"}`);
      });
    });
  }, []);

  return <div style={{padding:40,fontFamily:"system-ui",background:"#0b1120",color:"white",minHeight:"100vh"}}>
    <h1>ADMIN PAGE v3</h1>
    <pre id="debug">{msg}</pre>
    <a href="/dashboard" style={{color:"#6366f1"}}>← Dashboard</a>
  </div>;
}
