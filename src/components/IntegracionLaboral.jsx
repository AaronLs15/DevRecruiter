// src/components/IntegracionLaboral.jsx
import React, { useContext, useEffect, useMemo, useState } from "react";
import useUserData from "../Hooks/chat/useUserData";
import { AuthContext } from "../context/AuthContext";
import { FaSearch, FaFilter, FaTimes, FaEnvelope, FaUserTie, FaRegFilePdf, FaArrowLeft, FaStar, FaRegStar, FaExternalLinkAlt, FaClipboard } from "react-icons/fa";

/**
 * Integración Laboral — UI mejorada (acceso solo Empleadores)
 * - Búsqueda, filtros por habilidades y ordenamiento
 * - Cards con resumen (puesto, experiencia, skills, score promedio)
 * - Panel lateral de detalle con entrevistas finalizadas
 * - Acciones: Contactar (mailto), Copiar email, Descargar CV (si existe perfil.cvUrl)
 * - Loading con skeletons, estados vacíos y de error estilizados
 */

export default function IntegracionLaboral() {
  const { user } = useContext(AuthContext) || { user: null };
  const { userData, loading, error } = useUserData();

  const [perfilSeleccionado, setPerfilSeleccionado] = useState(null);
  const [query, setQuery] = useState("");
  const [skillFilter, setSkillFilter] = useState([]); // array de strings
  const [sortBy, setSortBy] = useState("Relevancia"); // Relevancia | Nombre | Puntuación | Reciente

  // --- Guardia de acceso ---
  if (!user || user.role !== "Empleador") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white flex items-center justify-center p-6">
        <div className="max-w-md text-center bg-white/5 border border-white/10 rounded-2xl p-8">
          <h1 className="text-2xl font-bold mb-2">Acceso restringido</h1>
          <p className="text-white/70">Este módulo es exclusivo para <span className="font-semibold">Empleadores</span>.</p>
        </div>
      </div>
    );
  }

  // --- Map a perfiles consumibles ---
  const perfilesBase = useMemo(() => {
    if (!userData) return [];
    return userData.map((u) => {
      const entrevistas = u.entrevistas ? safelyParse(u.entrevistas) : [];
      const scores = entrevistas.map((e) => toNumber(e.Puntaje_Total)).filter((n) => Number.isFinite(n));
      const avgScore = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null;
      const lastDate = entrevistas.length ? entrevistas.map((e) => new Date(e.Fecha_Entrevista || 0)).sort((a,b) => b - a)[0] : null;
      const habilidades = (u.Habilidades ? u.Habilidades.split(',') : []).map((h) => h.trim()).filter(Boolean);
      return {
        raw: u,
        id: u.id,
        nombre: u.Nombre_usuario,
        puesto: u.Puesto_Aspirado || "—",
        email: u.Email,
        experiencia: u.Experiencia || "No especificada",
        habilidades,
        entrevistas,
        avgScore,
        lastDate,
        cvUrl: u.CVUrl || u.cvUrl || null,
      };
    });
  }, [userData]);

  // Derivar universo de skills para chips
  const allSkills = useMemo(() => {
    const set = new Set();
    perfilesBase.forEach((p) => p.habilidades.forEach((h) => set.add(h)));
    return Array.from(set).sort((a,b)=>a.localeCompare(b));
  }, [perfilesBase]);

  // Filtrado + búsqueda + ordenamiento
  const perfiles = useMemo(() => {
    let list = [...perfilesBase];

    // búsqueda
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((p) =>
        p.nombre.toLowerCase().includes(q) ||
        p.puesto.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q) ||
        p.habilidades.some((h) => h.toLowerCase().includes(q))
      );
    }

    // skills
    if (skillFilter.length) {
      list = list.filter((p) => skillFilter.every((s) => p.habilidades.includes(s)));
    }

    // orden
    list.sort((a, b) => {
      if (sortBy === "Nombre") return a.nombre.localeCompare(b.nombre);
      if (sortBy === "Puntuación") return (b.avgScore || -1) - (a.avgScore || -1);
      if (sortBy === "Reciente") return (b.lastDate?.getTime() || 0) - (a.lastDate?.getTime() || 0);
      // Relevancia básica: tiene score y entrevistas más recientes primero
      const aRank = (a.avgScore || 0) + (a.lastDate ? a.lastDate.getTime()/1e12 : 0);
      const bRank = (b.avgScore || 0) + (b.lastDate ? b.lastDate.getTime()/1e12 : 0);
      return bRank - aRank;
    });

    return list;
  }, [perfilesBase, query, skillFilter, sortBy]);

  // Skeletons
  if (loading) {
    return (
      <div className="p-6 md:p-8 bg-gradient-to-b from-gray-950 to-gray-900 min-h-screen text-white">
        <Header query={query} setQuery={setQuery} skillFilter={skillFilter} setSkillFilter={setSkillFilter} allSkills={[]} sortBy={sortBy} setSortBy={setSortBy} total={0} />
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-2xl border border-white/10 bg-white/5 p-5 h-48" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 md:p-8 bg-gradient-to-b from-gray-950 to-gray-900 min-h-screen text-white">
        <div className="max-w-5xl mx-auto">
          <Header query={query} setQuery={setQuery} skillFilter={skillFilter} setSkillFilter={setSkillFilter} allSkills={allSkills} sortBy={sortBy} setSortBy={setSortBy} total={0} />
          <div className="mt-6 text-red-200 bg-red-500/10 border border-red-500/30 rounded-xl p-4">
            Error al cargar perfiles: {String(error)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 bg-gradient-to-b from-gray-950 to-gray-900 min-h-screen text-white">
      <div className="max-w-6xl mx-auto">
        <Header
          query={query}
          setQuery={setQuery}
          skillFilter={skillFilter}
          setSkillFilter={setSkillFilter}
          allSkills={allSkills}
          sortBy={sortBy}
          setSortBy={setSortBy}
          total={perfiles.length}
        />

        {perfiles.length === 0 ? (
          <EmptyState />)
          : (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {perfiles.map((perfil) => (
              <PerfilCard key={perfil.id} perfil={perfil} onOpen={() => setPerfilSeleccionado(perfil)} />
            ))}
          </div>
        )}
      </div>

      {/* Panel lateral */}
      <DetailPanel perfil={perfilSeleccionado} onClose={() => setPerfilSeleccionado(null)} />
    </div>
  );
}

function Header({ query, setQuery, skillFilter, setSkillFilter, allSkills, sortBy, setSortBy, total }) {
  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Integración Laboral</h1>
          <p className="text-white/70">Perfiles de aspirantes. Total: {total}</p>
        </div>
      </div>

      {/* Controles */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* Búsqueda */}
        <div className="lg:col-span-5">
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
            <FaSearch className="text-white/50" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por nombre, puesto, email o skill…"
              className="w-full bg-transparent outline-none placeholder:text-white/40"
              aria-label="Buscar"
            />
          </div>
        </div>

        {/* Orden */}
        <div className="lg:col-span-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-blue-500"
          >
            {['Relevancia','Nombre','Puntuación','Reciente'].map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>

        {/* Filtro por skills */}
        <div className="lg:col-span-4">
          <div className="flex items-center gap-2 flex-wrap">
            {allSkills.length === 0 && (
              <span className="text-white/60 text-sm">No hay skills detectadas aún.</span>
            )}
            {allSkills.map((s) => {
              const active = skillFilter.includes(s);
              return (
                <button
                  key={s}
                  onClick={() => setSkillFilter((prev) => active ? prev.filter(x=>x!==s) : [...prev, s])}
                  className={`text-xs rounded-full px-3 py-1 border transition ${active ? 'bg-blue-500/10 border-blue-400/30 text-blue-200' : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'}`}
                >
                  #{s}
                </button>
              );
            })}
            {skillFilter.length > 0 && (
              <button onClick={() => setSkillFilter([])} className="text-xs inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                <FaTimes /> Limpiar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function PerfilCard({ perfil, onOpen }) {
  return (
    <button onClick={onOpen} className="group text-left w-full rounded-2xl border border-white/10 bg-white/5 p-5 hover:border-white/20 hover:bg-white/10 transition">
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 rounded-full bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-200 text-xl font-bold">
          {perfil.nombre?.[0]?.toUpperCase() || "?"}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold truncate">{perfil.nombre}</h3>
            <span className="text-[11px] rounded-full px-2 py-0.5 border border-white/10 text-white/60">{perfil.experiencia}</span>
          </div>
          <p className="text-blue-300 text-sm">{perfil.puesto}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {perfil.habilidades.slice(0, 5).map((h, i) => (
              <span key={i} className="text-[11px] rounded-md px-2 py-0.5 bg-white/5 border border-white/10 text-white/70">#{h}</span>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-3 text-sm text-white/70">
            <span className="inline-flex items-center gap-1">
              <FaEnvelope className="opacity-70" /> {perfil.email}
            </span>
            <ScorePill score={perfil.avgScore} />
          </div>
        </div>
      </div>
    </button>
  );
}

function ScorePill({ score }) {
  if (!Number.isFinite(score)) return <span className="text-xs text-white/50">Sin puntaje</span>;
  const stars = Math.round((score / 100) * 5);
  return (
    <span className="inline-flex items-center gap-1 text-xs bg-emerald-500/10 text-emerald-200 border border-emerald-400/30 rounded-full px-2 py-0.5">
      {Array.from({ length: 5 }).map((_, i) => (i < stars ? <FaStar key={i} /> : <FaRegStar key={i} />))}
      <span className="ml-1">{score}/100</span>
    </span>
  );
}

function DetailPanel({ perfil, onClose }) {
  useEffect(() => {
    if (!perfil) return;
    const onEsc = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [perfil, onClose]);

  return (
    <div className={`fixed inset-0 z-40 ${perfil ? '' : 'pointer-events-none'}`}>
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/60 transition-opacity ${perfil ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />

      {/* Panel */}
      <div className={`absolute top-0 right-0 h-full w-full sm:w-[480px] bg-gray-900 border-l border-white/10 text-white shadow-2xl transform transition-transform ${perfil ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <button onClick={onClose} className="inline-flex items-center gap-2 text-white/80 hover:text-white">
            <FaArrowLeft /> Volver
          </button>
          {/*<div className="flex items-center gap-3">
            <a
              href={perfil?.cvUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 border ${perfil?.cvUrl ? 'bg-white/5 hover:bg-white/10 border-white/20' : 'bg-white/5 border-white/10 opacity-50 cursor-not-allowed'}`}
              onClick={(e)=>{ if(!perfil?.cvUrl) e.preventDefault(); }}
            >
              <FaRegFilePdf /> CV
            </a>
            <a
              href={perfil ? `mailto:${perfil.email}` : '#'}
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 bg-emerald-600 hover:bg-emerald-700 border border-emerald-500"
            >
              <FaEnvelope /> Contactar
            </a>
          </div>*/}
        </div>

        {/* Cabecera */}
        <div className="p-5 flex items-start gap-4">
          <div className="h-14 w-14 rounded-full bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-200 text-2xl font-bold">
            {perfil?.nombre?.[0]?.toUpperCase()}
          </div>
          <div className="min-w-0">
            <h2 className="text-xl font-bold truncate">{perfil?.nombre}</h2>
            <div className="text-blue-300">{perfil?.puesto}</div>
            <div className="mt-1 text-white/70 text-sm italic">{perfil?.experiencia}</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {perfil?.habilidades?.map((h, i) => (
                <span key={i} className="text-[11px] rounded-md px-2 py-0.5 bg-white/5 border border-white/10 text-white/70">#{h}</span>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-3 text-sm text-white/70">
              <span className="inline-flex items-center gap-1"><FaEnvelope className="opacity-70" /> {perfil?.email}</span>
              <ScorePill score={perfil?.avgScore} />
              <CopyEmailButton email={perfil?.email} />
            </div>
          </div>
        </div>

        {/* Entrevistas */}
        <div className="px-5 pb-24">
          <h3 className="text-lg font-semibold mb-3">Entrevistas Finalizadas</h3>
          {perfil?.entrevistas?.length ? (
            <div className="space-y-3">
              {perfil.entrevistas.map((e, i) => (
                <div key={i} className="rounded-xl bg-white/5 border border-white/10 p-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/80">{e.Tipo_Entrevista}</span>
                    <span className="text-white/60">{fmtDate(e.Fecha_Entrevista)}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="text-white/80 text-sm">Puntuación:</div>
                    <div className="flex items-center gap-2">
                      <Progress value={toNumber(e.Puntaje_Total)} />
                      <span className="text-white/70 text-sm w-14 text-right">{toNumber(e.Puntaje_Total)}/100</span>
                    </div>
                  </div>
                  {e.Feedback && (
                    <p className="mt-2 text-white/70 text-sm">{e.Feedback}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-white/60 text-sm">No hay entrevistas finalizadas.</div>
          )}
        </div>
      </div>
    </div>
  );
}

function Progress({ value = 0 }) {
  const v = Math.max(0, Math.min(100, Number(value) || 0));
  return (
    <div className="w-36 h-2 rounded-full bg-white/10 border border-white/10 overflow-hidden">
      <div className="h-full bg-emerald-500" style={{ width: `${v}%` }} />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="mt-10 rounded-2xl border border-dashed border-white/10 bg-white/5 p-8 text-center">
      <div className="text-white/70">No se encontraron perfiles que coincidan con los filtros actuales.</div>
      <div className="text-white/50 text-sm mt-1">Intenta limpiar los filtros o usar otros términos de búsqueda.</div>
    </div>
  );
}

function CopyEmailButton({ email }) {
  const [copied, setCopied] = useState(false);
  useEffect(() => { if (!copied) return; const t = setTimeout(()=>setCopied(false), 1200); return () => clearTimeout(t); }, [copied]);
  return (
    <button
      type="button"
      onClick={async () => { try { await navigator.clipboard.writeText(email || ""); setCopied(true); } catch {} }}
      className="text-xs inline-flex items-center gap-1 rounded-lg px-2 py-1 bg-white/5 border border-white/10 hover:bg-white/10"
    >
      <FaClipboard /> {copied ? 'Copiado' : 'Copiar'}
    </button>
  );
}

function fmtDate(d) {
  if (!d) return "";
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return String(d);
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' });
}

function toNumber(x) {
  const n = Number(x);
  return Number.isFinite(n) ? n : null;
}

function safelyParse(jsonLike) {
  try { return typeof jsonLike === 'string' ? JSON.parse(jsonLike) : jsonLike || []; } catch { return []; }
}
