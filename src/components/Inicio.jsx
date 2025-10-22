import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaRobot, FaBriefcase, FaBook } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";

/**
 * Home.jsx — versión mejorada
 * - UI modernizada (cards con bordes suaves, sombras, gradientes)
 * - Banner con CTA contextual (respeta login)
 * - Contador de "Recursos Consultados" funcional por usuario (localStorage)
 * - Suscripción a un CustomEvent global: `recurso:consultado`
 *
 */

export default function Home() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const userId = user?.id ?? user?.ID ?? user?.Id ?? user?.Id_Usuario ?? "anon";
  const counterKey = `recursos:consultados:${userId}`;

  const secciones = useMemo(
    () => [
      {
        id: 1,
        titulo: "Chat Bot",
        descripcion:
          "Habla con nuestro asistente virtual para practicar entrevistas y recibir retroalimentación personalizada.",
        icono: <FaRobot className="h-12 w-12 text-blue-400" />,
        color: "from-blue-600/30 to-blue-400/10 border-blue-500/30",
        ruta: "/Chat",
        cta: "Practicar",
      },
      {
        id: 2,
        titulo: "Integración Laboral",
        descripcion:
          "Explora perfiles profesionales y oportunidades de empleo adaptadas a tus habilidades.",
        icono: <FaBriefcase className="h-12 w-12 text-green-400" />,
        color: "from-green-600/30 to-green-400/10 border-green-500/30",
        ruta: "/IntegracionLaboral",
        cta: "Explorar",
      },
      {
        id: 3,
        titulo: "Recursos",
        descripcion:
          "Accede a documentos, enlaces y materiales para tu desarrollo profesional.",
        icono: <FaBook className="h-12 w-12 text-yellow-400" />,
        color: "from-yellow-600/30 to-yellow-400/10 border-yellow-500/30",
        ruta: "/Recursos",
        cta: "Aprender",
      },
    ],
    []
  );

  // Filtrado por rol/sesión
  const seccionesMostradas = useMemo(() => {
    if (!user) return secciones; // Todas visibles; redireccionarán a Login
    if (user.role === "Aspirante")
      return secciones.filter((s) => [1, 3].includes(s.id));
    if (user.role === "Empleador")
      return secciones.filter((s) => [2, 3].includes(s.id));
    return secciones;
  }, [user, secciones]);

  const [recursosCount, setRecursosCount] = useState(() => {
    try {
      return parseInt(localStorage.getItem(counterKey) || "0", 10);
    } catch {
      return 0;
    }
  });

  // Re-cargar cuando cambie el usuario
  useEffect(() => {
    try {
      const val = parseInt(localStorage.getItem(counterKey) || "0", 10);
      setRecursosCount(Number.isFinite(val) ? val : 0);
    } catch {
      setRecursosCount(0);
    }
  }, [counterKey]);

  // Suscripción al evento global emitido por Recursos.jsx
  useEffect(() => {
    const handler = () => {
      try {
        const current = parseInt(localStorage.getItem(counterKey) || "0", 10);
        const next = (Number.isFinite(current) ? current : 0) + 1;
        localStorage.setItem(counterKey, String(next));
        setRecursosCount(next);
      } catch {
        // noop
      }
    };

    window.addEventListener("recurso:consultado", handler);

    // También reflejar cambios si se actualiza en otra pestaña
    const storageHandler = (e) => {
      if (e.key === counterKey) {
        const val = parseInt(e.newValue || "0", 10);
        if (Number.isFinite(val)) setRecursosCount(val);
      }
    };
    window.addEventListener("storage", storageHandler);

    return () => {
      window.removeEventListener("recurso:consultado", handler);
      window.removeEventListener("storage", storageHandler);
    };
  }, [counterKey]);

  // Determinar ruta destino: Login si no hay usuario
  const getRuta = (rutaOriginal) => (!user ? "/Login" : rutaOriginal);

  const goRecursos = () => navigate(getRuta("/Recursos"));

  return (
    <div className="text-white p-6 md:p-8 bg-gradient-to-b from-gray-950 to-gray-900 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Banner */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-fuchsia-900/20 p-8 md:p-10 shadow-xl">
          <div className="absolute -top-20 -right-20 h-56 w-56 rounded-full bg-white/5 blur-3xl" />
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Bienvenido a DevRecruiter
          </h1>
          <p className="text-white/70 mt-2 max-w-2xl">
            Preparándote para destacar en tu próxima entrevista laboral.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={goRecursos}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 bg-white/10 hover:bg-white/15 border border-white/20"
            >
              <span>
                {user
                  ? "Explorar recursos"
                  : "Inicia sesión para guardar progreso"}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14 5l7 7-7 7M21 12H3"
                />
              </svg>
            </button>
            {user && (
              <span className="text-xs text-white/60 border border-white/10 rounded-lg px-3 py-1">
                Sesión como{" "}
                <strong className="text-white/80">{user.role}</strong>
              </span>
            )}
          </div>
        </div>

        {/* Secciones */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {seccionesMostradas.map((seccion) => (
            <Link
              key={seccion.id}
              to={getRuta(seccion.ruta)}
              className={`group relative overflow-hidden rounded-2xl border ${
                "bg-gradient-to-b " + seccion.color + " border-white/10"
              } p-6 transition-transform hover:scale-[1.02] hover:border-white/20`}
            >
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/5 blur-2xl" />
              <div className="flex items-center gap-4 mb-3">
                {seccion.icono}
                <h2 className="text-2xl font-bold">{seccion.titulo}</h2>
              </div>
              <p className="text-white/70 min-h-[56px]">
                {seccion.descripcion}
              </p>
              <div className="mt-6 flex items-center justify-between">
                {!user && (
                  <span className="text-[11px] rounded-full px-2 py-1 border border-white/10 text-white/60">
                    Requiere iniciar sesión
                  </span>
                )}
                <span className="ml-auto inline-flex items-center gap-2 rounded-xl px-3 py-2 bg-white/5 border border-white/10 group-hover:bg-white/10">
                  Ir a sección
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14 5l7 7-7 7M21 12H3"
                    />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Estadísticas — sólo Aspirantes */}
        {user && user.role === "Aspirante" && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              label="Entrevistas Completadas"
              value={user.countEntrevista ?? 0}
            />
            <StatCard
              label="Recursos Consultados"
              value={recursosCount}
              hint="Se incrementa al abrir/descargar desde la sección Recursos"
            />
            <StatCard label="Días Activos" value={user.diasActivo ?? 0} />
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, hint }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="text-sm text-white/60">{label}</div>
      <div className="mt-1 text-3xl font-extrabold tracking-tight">{value}</div>
      {hint && <div className="mt-2 text-[11px] text-white/50">{hint}</div>}
    </div>
  );
}
