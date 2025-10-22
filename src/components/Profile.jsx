import React, { useContext, useEffect, useMemo, useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { AuthContext } from '../context/AuthContext';
import { getProfileByID, getPuntajesEntrevista } from '../api/chat';
import { FaUser, FaEnvelope, FaBriefcase, FaMapMarkerAlt, FaBuilding, FaRegFilePdf, FaCalendarAlt, FaMedal, FaSpinner, FaCopy } from 'react-icons/fa';
import logo from '../assets/logo.jpg';

export default function Perfil() {
  const { user } = useContext(AuthContext); // { id, role, token }
  const userID = localStorage.getItem('userID') || user?.id;
  const userRole = localStorage.getItem('userRole') || user?.role || user?.rol;

  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // overview | stats | history
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const dataProfile = await getProfileByID(userID, userRole);
        setProfile(dataProfile);

        const responseStats = await getPuntajesEntrevista(userID);
        const rawStats = Array.isArray(responseStats?.data) ? responseStats.data : [];
        const formattedStats = rawStats.map((item) => ({
          date: new Date(item.Fecha_Entrevista).toLocaleDateString(),
          score: Number(item.Puntaje_Total) || 0,
          feedback: item.Feedback || '',
          tipo: item.Tipo_Entrevista || 'General',
        }));
        setStats(formattedStats);
      } catch (err) {
        console.error(err);
        setError(err?.message || 'No se pudo cargar el perfil');
      } finally {
        setLoading(false);
      }
    };
    if (userID) fetchData();
  }, [userID, userRole]);

  const avgScore = useMemo(() => {
    if (!stats.length) return null;
    const sum = stats.reduce((a, b) => a + (b.score || 0), 0);
    return Math.round(sum / stats.length);
  }, [stats]);

  const lastInterview = useMemo(() => {
    if (!stats.length) return null;
    return stats.reduce((latest, curr) => {
      const d = new Date(curr.date);
      return d > new Date(latest.date) ? curr : latest;
    }, stats[0]);
  }, [stats]);

  const copyEmail = async () => {
    try {
      if (!profile?.Email) return;
      await navigator.clipboard.writeText(profile.Email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-950 to-gray-900">
        <div className="flex items-center gap-3 text-white/80">
          <FaSpinner className="animate-spin" />
          Cargando perfil…
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 md:p-8 max-w-3xl mx-auto text-white">
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4">
          <div className="font-semibold">Ocurrió un error</div>
          <div className="text-white/80 text-sm mt-1">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto text-white bg-gradient-to-b from-gray-950 to-gray-900 rounded-2xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="h-20 w-20 rounded-full overflow-hidden border border-white/10 bg-white/5">
            <img src={logo} alt="Logo" className="h-full w-full object-cover" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Perfil de {profile?.Nombre_usuario}</h2>
            {avgScore != null ? (
              <div className="mt-1 text-white/70 text-sm flex items-center gap-2">
                <FaMedal className="text-yellow-300" /> Promedio entrevistas: <span className="font-semibold text-white">{avgScore}/100</span>
                {lastInterview && (
                  <span className="ml-2 text-white/60 inline-flex items-center gap-1"><FaCalendarAlt /> Última: {lastInterview.date}</span>
                )}
              </div>
            ) : (
              <div className="mt-1 text-white/60 text-sm">Aún no hay entrevistas registradas.</div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6 flex items-center gap-2 border-b border-white/10">
        {['overview','stats','history'].map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-3 py-2 text-sm rounded-t-lg border-b-2 transition ${
              activeTab === t ? 'border-blue-500 text-white' : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            {t === 'overview' ? 'Resumen' : t === 'stats' ? 'Estadísticas' : 'Historial'}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'overview' && (
        <section className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Datos */}
          <div className="md:col-span-2 rounded-2xl border border-white/10 bg-white/5 p-5">
            <Item label="Email" icon={<FaEnvelope />}>
              <span className="break-all">{profile?.Email}</span>
              <button onClick={copyEmail} className="ml-2 text-xs inline-flex items-center gap-1 rounded-lg px-2 py-1 bg-white/5 border border-white/10 hover:bg-white/10">
                <FaCopy /> {copied ? 'Copiado' : 'Copiar'}
              </button>
            </Item>
            {profile?.Experiencia && <Item label="Experiencia" icon={<FaBriefcase />}>{profile.Experiencia}</Item>}
            {profile?.Puesto_Aspirado && <Item label="Puesto aspirado" icon={<FaBriefcase />}>{profile.Puesto_Aspirado}</Item>}
            {profile?.Habilidades && (
              <Item label="Habilidades">
                <div className="flex flex-wrap gap-2">
                  {String(profile.Habilidades).split(',').map((h, i) => (
                    <span key={i} className="text-[11px] rounded-md px-2 py-0.5 bg-white/5 border border-white/10 text-white/70">#{h.trim()}</span>
                  ))}
                </div>
              </Item>
            )}
            {profile?.Ubicacion && <Item label="Ubicación" icon={<FaMapMarkerAlt />}>{profile.Ubicacion}</Item>}
            {profile?.Empresa && <Item label="Empresa" icon={<FaBuilding />}>{profile.Empresa}</Item>}
          </div>

          {/* Aside */}
          <aside className="md:col-span-1 rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="text-sm text-white/60">Rol</div>
            <div className="text-lg font-semibold">{userRole}</div>
            <div className="mt-4 text-sm text-white/60">ID de usuario</div>
            <div className="text-lg font-mono">{userID}</div>
            {profile?.CVUrl && (
              <a
                href={profile.CVUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-xl px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/20"
              >
                <FaRegFilePdf /> Ver CV
              </a>
            )}
          </aside>
        </section>
      )}

      {activeTab === 'stats' && (
        <section className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-lg font-semibold mb-3">Evolución de puntajes</h3>
          {stats.length ? (
            <div className="w-full h-72">
              <ResponsiveContainer>
                <LineChart data={stats} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff22" />
                  <XAxis dataKey="date" tick={{ fill: '#E5E7EB' }} />
                  <YAxis domain={[0, 'auto']} tick={{ fill: '#E5E7EB' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #334155' }} itemStyle={{ color: '#E5E7EB' }} formatter={(v) => [`${v}`, 'Puntuación']} />
                  <Line type="monotone" dataKey="score" stroke="#3B82F6" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState text="Aún no hay datos de entrevistas para graficar." />
          )}
        </section>
      )}

      {activeTab === 'history' && (
        <section className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-lg font-semibold mb-3">Historial de entrevistas</h3>
          {stats.length ? (
            <ul className="divide-y divide-white/10">
              {stats.map((s, i) => (
                <li key={i} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="text-white/90 font-medium">{s.tipo}</div>
                    <div className="text-white/60 text-sm">{s.date}</div>
                  </div>
                  <div className="text-white/80">
                    <span className="rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-200 px-2 py-1 text-sm">{s.score}/100</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState text="Sin entrevistas registradas." />
          )}
        </section>
      )}
    </div>
  );
}

function Item({ label, icon = <FaUser />, children }) {
  return (
    <div className="py-2 border-b border-white/10 last:border-b-0">
      <div className="text-sm text-white/60 flex items-center gap-2">
        <span className="opacity-70">{icon}</span>
        {label}
      </div>
      <div className="mt-1 text-white">{children}</div>
    </div>
  );
}

function EmptyState({ text }) {
  return (
    <div className="rounded-xl border border-dashed border-white/10 bg-white/5 p-6 text-white/70 text-sm text-center">
      {text}
    </div>
  );
}