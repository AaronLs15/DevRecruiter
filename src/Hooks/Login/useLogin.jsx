import { useState, useContext } from 'react';
import { actUsuario, iniciarSesion, actAspirante, actEmpleador } from '../../api/chat';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export function useLogin() {
  const [isLogin, setIsLogin] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isEmployer, setIsEmployer] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { markAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  // Modal de info adicional
  const [showModal, setShowModal] = useState(false);
  const [extraData, setExtraData] = useState({
    Experiencia: '',
    Puesto_Aspirado: '',
    Habilidades: '',
    Ubicacion: '',
    Empresa: ''
  });

  const handleToggle = () => {
    setError('');
    setSuccess('');
    setIsLogin(!isLogin);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !password || (!isLogin && !name)) {
      setError('Por favor completa todos los campos.');
      return;
    }

    const payload = isLogin
      ? { Email: email, Password: password }
      : { Name: name, Email: email, Password: password, Rol: isEmployer ? 'Empleador' : 'Aspirante' };

    try {
      if (isLogin) {
        const user = await iniciarSesion({ data: payload });
        if (user && (user.id || user.ID)) {
          const id = user.id || user.ID;
          localStorage.setItem('userID', id);
          localStorage.setItem('userEmail', user.Email);
          localStorage.setItem('userName', user.Nombre_usuario);
          localStorage.setItem('userRole', user.Rol);
          setSuccess('Sesión iniciada correctamente.');
          markAuthenticated();
          navigate('/Inicio');
          return;
        }
        setError('Correo o contraseña no son válidos.');
        return;
      }

      // Registro
      const response = await actUsuario({ data: payload });
      localStorage.setItem('userID', response.id);
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userName', name);
      localStorage.setItem('userRole', isEmployer ? 'Empleador' : 'Aspirante');
      setSuccess(`Usuario creado con ID: ${response.id}`);

      // Mostramos modal para datos extra
      setShowModal(true);
    } catch (err) {
      console.error(err);
      setError('Error de red, inténtalo de nuevo.');
      return;
    } finally {
      // Limpiamos campos excepto el rol
      setName('');
      setEmail('');
      setPassword('');
    }
  };

  const handleExtraChange = e => {
    const { name, value } = e.target;
    setExtraData(d => ({ ...d, [name]: value }));
  };

  const handleExtraSubmit = async () => {
    const ID_Usuario = localStorage.getItem('userID');
    try {
      if (isEmployer) {
        await actEmpleador({ data: { ID_Usuario, Empresa: extraData.Empresa } });
      } else {
        await actAspirante({ data: { ID_Usuario, ...extraData } });
      }
      setShowModal(false);
      // Reiniciamos form extra y rol
      setExtraData({ Experiencia: '', Puesto_Aspirado: '', Habilidades: '', Ubicacion: '', Empresa: '' });
      setIsEmployer(false);
      markAuthenticated();
      navigate('/Inicio');
    } catch (e) {
      console.error(e);
      setError('Error al guardar información adicional.');
    }
  };

  return {
    isLogin,
    name, setName,
    email, setEmail,
    password, setPassword,
    isEmployer, setIsEmployer,
    error,
    success,
    handleToggle,
    handleSubmit,
    showModal,
    extraData,
    handleExtraChange,
    handleExtraSubmit
  };
}
