"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export function MobileNavAlumno({ nombre }: { nombre?: string }) {
  const [open, setOpen] = useState(false);
  const links = [
    { href: "/alumno/pendientes", label: "Mis pendientes" },
    { href: "/alumno/materias", label: "Mis materias" },
  ];

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}
        className="fixed left-4 top-4 z-40 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-md lg:hidden"
        aria-label="Abrir menú"><Menu size={20} /></button>
      {open && <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setOpen(false)} />}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 transform bg-[#0b1120] px-4 py-6 shadow-xl transition-transform duration-300 lg:hidden ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between px-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/40">FashionCloud</p>
            <p className="text-lg font-bold text-white">Education</p>
            <p className="text-xs text-white/50">{nombre || "Alumno"}</p>
          </div>
          <button type="button" onClick={() => setOpen(false)} className="text-white/60 hover:text-white"><X size={20} /></button>
        </div>
        <nav className="mt-8 space-y-1">
          {links.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-white/70 transition hover:bg-white/10">
              <span>{l.label}</span>
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-6 left-4 right-4 border-t border-white/10 pt-4">
          <form action="/auth/salir" method="post">
            <button type="submit" className="w-full rounded-md px-3 py-2 text-left text-sm text-white/40 transition hover:bg-white/5 hover:text-white/70">
              Cerrar sesión
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
