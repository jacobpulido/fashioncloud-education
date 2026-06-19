"use client";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export default function AdminPage() {
  const [msg, setMsg] = useState("Redirigiendo...");
  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = "/login"; return; }
      const { data: admin } = await supabase.rpc("is_admin");
      window.location.href = admin ? "/admin/dashboard" : "/dashboard";
    })();
  }, []);
  return <div style={{padding:40,fontFamily:"system-ui"}}><p>{msg}</p></div>;
}
