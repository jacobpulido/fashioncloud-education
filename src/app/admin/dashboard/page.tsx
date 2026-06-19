"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userName, setUserName] = useState("Admin");

  useEffect(() => {
    async function check() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        window.location.href = "/login";
        return;
      }

      setUserName(user.user_metadata?.nombre || "Admin");

      // Query client-side (works because user is authenticated in this context)
      const { data: rows } = await supabase
        .from("miembros_institucion")
        .select("rol")
        .eq("usuario_id", user.id);

      const admin = rows?.some(r => r.rol === "admin_plantel" || r.rol === "coordinador");
      
      if (!admin) {
        window.location.href = "/dashboard";
        return;
      }

      setIsAdmin(true);
      setLoading(false);
    }
    check();
  }, []);

  if (loading) return <div style={{padding:40,fontFamily:"system-ui",background:"#0b1120",color:"white",minHeight:"100vh"}}><p>Cargando...</p></div>;
  if (!isAdmin) return null;

  return (
    <div style={{display:"flex",minHeight:"100vh",fontFamily:"system-ui"}}>
      <aside style={{position:"fixed",inset:"0 auto 0 0",width:256,background:"#0b1120",padding:24}}>
        <div style={{marginBottom:32}}>
          <p style={{fontSize:11,fontWeight:600,letterSpacing:1,color:"rgba(255,255,255,0.4)",textTransform:"uppercase"}}>FashionCloud</p>
          <p style={{fontSize:18,fontWeight:700,color:"white"}}>Education</p>
          <p style={{fontSize:12,color:"rgba(255,255,255,0.5)",marginTop:2}}>{userName}</p>
        </div>
        <nav>
          <div style={{display:"flex",alignItems:"center",gap:8,padding:"8px 12px",borderRadius:6,fontSize:14,color:"rgba(255,255,255,0.7)",background:"rgba(255,255,255,0.1)"}}>Dashboard</div>
          <Link href="/admin/miembros" style={{display:"flex",alignItems:"center",gap:8,padding:"8px 12px",borderRadius:6,fontSize:14,color:"rgba(255,255,255,0.7)",textDecoration:"none"}}>Miembros</Link>
        </nav>
        <div style={{position:"absolute",bottom:24,left:24,right:24,borderTop:"1px solid rgba(255,255,255,0.1)",paddingTop:16}}>
          <a href="/dashboard" style={{display:"block",padding:"8px 12px",borderRadius:6,fontSize:14,color:"rgba(255,255,255,0.4)",textDecoration:"none"}}>← Vista docente</a>
        </div>
      </aside>
      <div style={{marginLeft:256,flex:1,background:"#f9fafb",padding:32}}>
        <h1 style={{fontSize:24,fontWeight:700,color:"#111"}}>Panel de Administración</h1>
        <p style={{fontSize:14,color:"#6b7280",marginTop:4}}>Gestiona tu institución</p>
        <div style={{marginTop:24,background:"white",borderRadius:12,border:"1px solid #e5e7eb",padding:24}}>
          <p style={{fontSize:14,color:"#374151"}}>Aquí podrás gestionar los miembros y la configuración de tu institución.</p>
          <Link href="/admin/miembros" style={{display:"inline-flex",marginTop:12,background:"#0b1120",color:"white",padding:"8px 16px",borderRadius:8,fontSize:14,fontWeight:500,textDecoration:"none"}}>
            Gestionar miembros
          </Link>
        </div>
      </div>
    </div>
  );
}
