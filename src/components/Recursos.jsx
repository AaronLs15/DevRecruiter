import React, { useMemo, useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  Search,
  Filter,
  Star,
  StarOff,
  ExternalLink,
  Link as LinkIcon,
  FileText,
  File,
  BookOpen,
  GraduationCap,
  Hammer,
  Code2,
  ListChecks,
  Copy,
  Download,
  Globe,
  Sparkles,
} from "lucide-react";

/**
 * Recursos.jsx — Sección de recursos con UI mejorada
 * - Búsqueda en tiempo real
 * - Filtros por nivel, formato, etiquetas y idioma
 * - Ordenamiento
 * - Favoritos (persistencia en localStorage)
 * - Secciones de Documentos locales y Recursos externos
 * - Diseño responsive con Tailwind + accesible
 *
 * Instrucciones: solo reemplaza tu componente por este archivo.
 * Opcional: puedes pasar una prop `extraResources` para inyectar recursos desde tu API.
 */

// --- Catálogo base: recursos para mejorar como programador ---
const baseResources = [
  // Documentos locales (ejemplo)
  {
    id: "doc-1",
    type: "document",
    title: "Guía de entrevistas técnicas.pdf",
    description: "Preguntas frecuentes, estructuras de datos y consejos.",
    url: "/docs/guia-entrevistas-tecnicas.pdf",
    tags: ["Entrevistas", "Algoritmos"],
    level: "Intermedio",
    format: "Documento",
    lang: "ES",
  },
  {
    id: "doc-2",
    type: "document",
    title: "Preguntas comunes de RRHH.docx",
    description: "Respuestas modelo y buenas prácticas.",
    url: "/docs/preguntas-rrhh.docx",
    tags: ["Entrevistas", "Soft Skills"],
    level: "Básico",
    format: "Documento",
    lang: "ES",
  },

  // Recursos externos (curados)
  {
    id: "ext-1",
    type: "link",
    title: "roadmap.sh",
    description: "Roadmaps interactivos para Frontend, Backend, DevOps y más.",
    url: "https://roadmap.sh/",
    tags: ["Frontend", "Backend", "DevOps"],
    level: "Básico",
    format: "Roadmap",
    lang: "EN",
  },
  {
    id: "ext-2",
    type: "link",
    title: "freeCodeCamp",
    description: "Cursos gratuitos con proyectos prácticos.",
    url: "https://www.freecodecamp.org/",
    tags: ["Web", "Frontend", "Backend"],
    level: "Básico",
    format: "Curso",
    lang: "EN",
  },
  {
    id: "ext-3",
    type: "link",
    title: "The Odin Project",
    description: "Currículo full‑stack gratuito y basado en proyectos.",
    url: "https://www.theodinproject.com/",
    tags: ["Web", "Full‑Stack"],
    level: "Intermedio",
    format: "Curso",
    lang: "EN",
  },
  {
    id: "ext-4",
    type: "link",
    title: "Refactoring.Guru",
    description: "Patrones de diseño y principios de refactorización.",
    url: "https://refactoring.guru/",
    tags: ["Arquitectura", "Buenas Prácticas"],
    level: "Intermedio",
    format: "Artículo",
    lang: "EN",
  },
  {
    id: "ext-5",
    type: "link",
    title: "Clean Code (resumen)",
    description: "Resumen y notas clave de Clean Code (referencia rápida).",
    url: "https://gist.github.com/eduardolu/clean-code-notes",
    tags: ["Buenas Prácticas"],
    level: "Intermedio",
    format: "Artículo",
    lang: "ES",
  },
  {
    id: "ext-6",
    type: "link",
    title: "LeetCode",
    description: "Práctica de algoritmos y estructuras de datos.",
    url: "https://leetcode.com/",
    tags: ["Algoritmos", "Entrevistas"],
    level: "Intermedio",
    format: "Katas",
    lang: "EN",
  },
  {
    id: "ext-7",
    type: "link",
    title: "Codewars",
    description: "Retos de programación tipo katas con gamificación.",
    url: "https://www.codewars.com/",
    tags: ["Katas", "Algoritmos"],
    level: "Básico",
    format: "Katas",
    lang: "EN",
  },
  {
    id: "ext-8",
    type: "link",
    title: "Exercism",
    description: "Mentoría y ejercicios en múltiples lenguajes.",
    url: "https://exercism.org/",
    tags: ["Katas"],
    level: "Básico",
    format: "Katas",
    lang: "EN",
  },
  {
    id: "ext-9",
    type: "link",
    title: "Frontend Mentor",
    description: "Desafíos reales de UI para mejorar tu CSS/JS.",
    url: "https://www.frontendmentor.io/",
    tags: ["Frontend", "UI"],
    level: "Intermedio",
    format: "Práctica",
    lang: "EN",
  },
  {
    id: "ext-10",
    type: "link",
    title: "Advent of Code",
    description: "Retos anuales de algoritmos en diciembre.",
    url: "https://adventofcode.com/",
    tags: ["Algoritmos", "Diversión"],
    level: "Intermedio",
    format: "Katas",
    lang: "EN",
  },
  {
    id: "ext-11",
    type: "link",
    title: "PostgreSQL Tutorial",
    description: "Tutoriales paso a paso para PostgreSQL.",
    url: "https://www.postgresql.org/docs/current/tutorial.html",
    tags: ["Bases de Datos"],
    level: "Intermedio",
    format: "Documento",
    lang: "EN",
  },
  {
    id: "ext-12",
    type: "link",
    title: "SQLBolt",
    description: "Lecciones interactivas de SQL en el navegador.",
    url: "https://sqlbolt.com/",
    tags: ["Bases de Datos"],
    level: "Básico",
    format: "Práctica",
    lang: "EN",
  },
  {
    id: "ext-13",
    type: "link",
    title: "Docker - Getting Started",
    description: "Guía oficial para comenzar con Docker.",
    url: "https://docs.docker.com/get-started/",
    tags: ["DevOps", "Docker"],
    level: "Básico",
    format: "Documento",
    lang: "EN",
  },
  {
    id: "ext-14",
    type: "link",
    title: "System Design Primer",
    description: "Guía popular para entrevistas de diseño de sistemas.",
    url: "https://github.com/donnemartin/system-design-primer",
    tags: ["Arquitectura", "Entrevistas"],
    level: "Avanzado",
    format: "Repo",
    lang: "EN",
  },
  {
    id: "ext-15",
    type: "link",
    title: "Patterns.dev",
    description:
      "Patrones de rendimiento, diseño y arquitectura para web moderna.",
    url: "https://www.patterns.dev/",
    tags: ["Frontend", "Arquitectura"],
    level: "Intermedio",
    format: "Artículo",
    lang: "EN",
  },
  {
    id: "ext-16",
    type: "link",
    title: "You Don't Know JS (serie)",
    description: "Libros abiertos sobre JavaScript profundo.",
    url: "https://github.com/getify/You-Dont-Know-JS",
    tags: ["JavaScript", "Libros"],
    level: "Intermedio",
    format: "Libro",
    lang: "EN",
  },
  {
    id: "ext-17",
    type: "link",
    title: "Frontend Roadmap (ES)",
    description: "Recorrido sugerido para frontenders en español.",
    url: "https://roadmap.sh/frontend?lang=es",
    tags: ["Frontend", "ES"],
    level: "Básico",
    format: "Roadmap",
    lang: "ES",
  },
  {
    id: "ext-18",
    type: "link",
    title: "Open Data Structures (Libro)",
    description: "Libro libre sobre Estructuras de Datos.",
    url: "https://opendatastructures.org/",
    tags: ["Algoritmos", "CS"],
    level: "Avanzado",
    format: "Libro",
    lang: "EN",
  },
];

const LEVELS = ["Todos", "Básico", "Intermedio", "Avanzado"];
const FORMATS = [
  "Todos",
  "Documento",
  "Artículo",
  "Curso",
  "Katas",
  "Práctica",
  "Roadmap",
  "Repo",
  "Libro",
];
const LANGS = ["Todos", "ES", "EN"];
const TAGS = [
  "Frontend",
  "Backend",
  "Full‑Stack",
  "DevOps",
  "Bases de Datos",
  "JavaScript",
  "UI",
  "Arquitectura",
  "Algoritmos",
  "Entrevistas",
  "Soft Skills",
  "Buenas Prácticas",
  "Docker",
  "Katas",
  "CS",
];

const ICONS = {
  Documento: FileText,
  Artículo: File,
  Curso: GraduationCap,
  Katas: ListChecks,
  Práctica: Hammer,
  Roadmap: BookOpen,
  Repo: Code2,
  Libro: BookOpen,
};

const FavoriteButton = ({ active, onToggle }) => (
  <button
    onClick={onToggle}
    className={`inline-flex items-center gap-1 rounded-xl px-2 py-1 text-xs transition-all border ${
      active
        ? "bg-yellow-500/10 border-yellow-500/40 text-yellow-300 hover:bg-yellow-500/20"
        : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
    }`}
    aria-pressed={active}
    aria-label={active ? "Quitar de favoritos" : "Agregar a favoritos"}
  >
    {active ? (
      <Star className="h-3.5 w-3.5" />
    ) : (
      <StarOff className="h-3.5 w-3.5" />
    )}
    <span>{active ? "Favorito" : "Guardar"}</span>
  </button>
);

const Tag = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`rounded-full px-3 py-1 text-xs font-medium transition border ${
      active
        ? "bg-blue-500/10 border-blue-500/40 text-blue-300"
        : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
    }`}
  >
    #{label}
  </button>
);

export default function Recursos({ extraResources = [] }) {
  const { user } = useContext(AuthContext);
  const safeUserId =
    user?.id ?? user?.ID ?? user?.Id ?? user?.Id_Usuario ?? "anon";
  const counterKey = `recursos:consultados:${safeUserId}`;

  const [query, setQuery] = useState("");
  const [level, setLevel] = useState("Todos");
  const [format, setFormat] = useState("Todos");
  const [lang, setLang] = useState("Todos");
  const [activeTags, setActiveTags] = useState([]);
  const [onlyFavs, setOnlyFavs] = useState(false);
  const [sortBy, setSortBy] = useState("Relevancia");
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("recursos:favoritos") || "[]");
    } catch {
      return [];
    }
  });

  const bumpConsulted = () => {
    try {
      const current = parseInt(localStorage.getItem(counterKey) || "0", 10);
      const next = (Number.isFinite(current) ? current : 0) + 1;
      localStorage.setItem(counterKey, String(next));
      // Notifica a Home si está montado (actualiza en vivo)
      window.dispatchEvent(new Event("recurso:consultado"));
    } catch {
      // noop
    }
  };

  useEffect(() => {
    localStorage.setItem("recursos:favoritos", JSON.stringify(favorites));
  }, [favorites]);

  const allResources = useMemo(() => {
    // Permite inyectar más recursos desde props (API)
    return [...baseResources, ...extraResources];
  }, [extraResources]);

  const toggleTag = (t) =>
    setActiveTags((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );

  const toggleFavorite = (id) =>
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const filtered = useMemo(() => {
    return allResources
      .filter((r) => (onlyFavs ? favorites.includes(r.id) : true))
      .filter((r) => (level === "Todos" ? true : r.level === level))
      .filter((r) => (format === "Todos" ? true : r.format === format))
      .filter((r) => (lang === "Todos" ? true : r.lang === lang))
      .filter((r) =>
        activeTags.length === 0
          ? true
          : activeTags.every((t) => r.tags?.includes(t))
      )
      .filter((r) => {
        if (!query.trim()) return true;
        const q = query.toLowerCase();
        return (
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.tags?.some((t) => t.toLowerCase().includes(q))
        );
      })
      .sort((a, b) => {
        if (sortBy === "A‑Z") return a.title.localeCompare(b.title);
        if (sortBy === "Z‑A") return b.title.localeCompare(a.title);
        if (sortBy === "Formato")
          return (a.format || "").localeCompare(b.format || "");
        // Relevancia básica: favoritos primero, luego por coincidencia de query
        const aFav = favorites.includes(a.id) ? 1 : 0;
        const bFav = favorites.includes(b.id) ? 1 : 0;
        if (aFav !== bFav) return bFav - aFav;
        return 0;
      });
  }, [
    allResources,
    favorites,
    onlyFavs,
    level,
    format,
    lang,
    activeTags,
    query,
    sortBy,
  ]);

  const documents = filtered.filter((r) => r.type === "document");
  const externals = filtered.filter((r) => r.type === "link");

  const ResultCount = () => (
    <div className="text-sm text-white/60">
      {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
      {onlyFavs ? " — mostrando favoritos" : ""}
    </div>
  );

  return (
    <div className="text-white p-6 md:p-8 bg-gradient-to-b from-gray-950 to-gray-900 rounded-2xl min-h-screen">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight flex items-center gap-2">
            <Sparkles className="h-7 w-7 text-blue-400" /> Recursos
          </h1>
          <p className="text-white/70 max-w-2xl mt-1">
            Encuentra guías, cursos, retos y herramientas para crecer como
            desarrollador.
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2">
          <ResultCount />
        </div>
      </div>

      {/* Controles principales */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-6">
        {/* Búsqueda */}
        <div className="lg:col-span-5">
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
            <Search className="h-5 w-5 text-white/50" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por título, etiqueta o descripción…"
              className="w-full bg-transparent outline-none placeholder:text-white/40"
              aria-label="Buscar recursos"
            />
          </div>
        </div>

        {/* Filtros rápidos */}
        <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-5 gap-2">
          <div className="relative">
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-blue-500"
              aria-label="Filtrar por nivel"
            >
              {LEVELS.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>
          <div className="relative">
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-blue-500"
              aria-label="Filtrar por formato"
            >
              {FORMATS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>
          <div className="relative">
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-blue-500"
              aria-label="Filtrar por idioma"
            >
              {LANGS.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-blue-500"
              aria-label="Ordenar"
            >
              {["Relevancia", "A‑Z", "Z‑A", "Formato"].map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={() => setOnlyFavs((s) => !s)}
            className={`inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm border transition ${
              onlyFavs
                ? "bg-yellow-500/10 border-yellow-500/40 text-yellow-200"
                : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
            }`}
            aria-pressed={onlyFavs}
          >
            <Star className="h-4 w-4" /> Favoritos
          </button>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-6">
        {TAGS.map((t) => (
          <Tag
            key={t}
            label={t}
            active={activeTags.includes(t)}
            onClick={() => toggleTag(t)}
          />
        ))}
      </div>

      <div className="md:hidden mb-4">
        <ResultCount />
      </div>

      {/* Contenido */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Documentos */}
        <section className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <header className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-300" /> Documentos locales
            </h2>
            <span className="text-xs text-white/60">
              {documents.length} ítem(s)
            </span>
          </header>

          {documents.length === 0 ? (
            <EmptyState label="No hay documentos que coincidan." />
          ) : (
            <ul className="space-y-3">
              {documents.map((doc) => (
                <li key={doc.id} className="group">
                  <CardItem
                    resource={doc}
                    onToggleFav={() => toggleFavorite(doc.id)}
                    fav={favorites.includes(doc.id)}
                    isDocument
                    onConsult={bumpConsulted}
                  />
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Recursos externos */}
        <section className="xl:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-5">
          <header className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Globe className="h-5 w-5 text-green-300" /> Recursos externos
            </h2>
            <span className="text-xs text-white/60">
              {externals.length} ítem(s)
            </span>
          </header>

          {externals.length === 0 ? (
            <EmptyState label="No hay recursos que coincidan." />
          ) : (
            <ul className="grid sm:grid-cols-2 gap-4">
              {externals.map((res) => (
                <li key={res.id} className="group">
                  <CardItem
                    resource={res}
                    onToggleFav={() => toggleFavorite(res.id)}
                    fav={favorites.includes(res.id)}
                    onConsult={bumpConsulted}
                  />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

function CardItem({
  resource,
  fav,
  onToggleFav,
  isDocument = false,
  onConsult,
}) {
  const Icon = ICONS[resource.format] || File;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(resource.url);
    } catch (e) {
      console.error("No se pudo copiar", e);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-b from-gray-900/60 to-gray-900/20 p-4 hover:border-white/20 transition">
      <div className="flex items-start gap-3">
        <div className="shrink-0 mt-1">
          <div className="h-9 w-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
            <Icon className="h-5 w-5 text-white/80" />
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold truncate" title={resource.title}>
              {resource.title}
            </h3>
            <span className="text-[10px] rounded-full px-2 py-0.5 border border-white/10 text-white/60">
              {resource.level} • {resource.lang}
            </span>
            {resource.format && (
              <span className="text-[10px] rounded-full px-2 py-0.5 bg-white/5 border border-white/10 text-white/70">
                {resource.format}
              </span>
            )}
          </div>
          <p className="text-sm text-white/70 mt-1 line-clamp-2">
            {resource.description}
          </p>

          {/* Tags */}
          <div className="mt-2 flex flex-wrap gap-2">
            {resource.tags?.map((t) => (
              <span
                key={t}
                className="text-[10px] rounded-md px-2 py-0.5 bg-white/5 border border-white/10 text-white/60"
              >
                #{t}
              </span>
            ))}
          </div>

          {/* Acciones */}
          <div className="mt-3 flex items-center gap-2">
            {isDocument ? (
              <a
                href={resource.url}
                className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm bg-blue-500/10 hover:bg-blue-500/20 border border-blue-400/30 text-blue-200"
                download
                onClick={onConsult}
              >
                Descargar
              </a>
            ) : (
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onConsult}
                className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm bg-green-500/10 hover:bg-green-500/20 border border-green-400/30 text-green-200"
              >
                Abrir
              </a>
            )}

            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm bg-white/5 border border-white/10 hover:bg-white/10 text-white/80"
              title="Copiar enlace"
            >
              <Copy className="h-4 w-4" /> Copiar
            </button>

            <FavoriteButton active={fav} onToggle={onToggleFav} />
          </div>
        </div>
      </div>

      {/* Marca de tipo */}
      <div className="absolute -right-8 -top-8 rotate-45 bg-white/5 border border-white/10 text-white/40 text-[10px] px-10 py-1">
        {isDocument ? "Documento" : "Recurso"}
      </div>
    </div>
  );
}

function EmptyState({ label }) {
  return (
    <div className="flex items-center justify-center p-8 rounded-xl border border-dashed border-white/10 bg-white/5 text-white/60">
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4" />
        <span>{label}</span>
      </div>
    </div>
  );
}
