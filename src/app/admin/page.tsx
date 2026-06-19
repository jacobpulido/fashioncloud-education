"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AdminRedirectPage() {
  const [msg, setMsg] = useState("Cargando...");

  useEffect(() => {
    async function check() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = "/login"; return; }

      const { data } = await supabase
        .from("miembros_institucion")
        .select("rol")
        .eq("usuario_id", user.id);

      const roles = (data || []).map(r => r.rol);
      setMsg(`User: ${user.email} | Roles: ${roles.join(", ") || "ninguno"}`);

      if (roles.includes("admin_plantel") || roles.includes("coordinador")) {
        window.location.href = "/admin/dashboard";
      } else {
        window.location.href = "/dashboard";
      }
    }
    check();
  }, []);

  return <div style={{padding:40,fontFamily:"system-ui"}}><p>{msg}</p></div>;
}
