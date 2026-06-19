"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function AdminDashboardPage() {
  const [msg, setMsg] = useState("Verificando...");

  useEffect(() => {
    (async () => {
      try {
        const supabase = createClient();
        const { data: { user }, error: ue } = await supabase.auth.getUser();
        if (ue || !user) { setMsg("No auth: " + (ue?.message || "")); return; }

        const { data: rows, error: qe } = await supabase
          .from("miembros_institucion")
          .select("rol")
          .eq("usuario_id", user.id);

        if (qe) { setMsg("Query error: " + qe.message); return; }

        const roles = (rows || []).map(r => r.rol);
        setMsg("User: " + user.email + " | Roles: " + (roles.join(", ") || "ninguno"));

        if (roles.includes("admin_plantel") || roles.includes("coordinador")) {
          setMsg("✅ Admin OK");
        } else {
          setMsg("❌ No eres admin. Roles: " + (roles.join(", ") || "ninguno"));
        }
      } catch (e: any) {
        setMsg("Error: " + e.message);
      }
    })();
  }, []);

  return <div style={{ padding: 40, fontFamily: "system-ui" }}>
    <h1>Admin Dashboard</h1>
    <pre style={{ background: "#f5f5f5", padding: 16, borderRadius: 8 }}>{msg}</pre>
    <a href="/dashboard" style={{ color: "#6366f1" }}>← Volver</a>
  </div>;
}
