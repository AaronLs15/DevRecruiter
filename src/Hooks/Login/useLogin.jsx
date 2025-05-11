// src/Hooks/Login/useLogin.js
import { useState, useContext } from 'react';
import { actUsuario, iniciarSesion } from '../../api/chat';
import { AuthContext } from '../../context/AuthContext';
import { NavLink, useNavigate } from 'react-router-dom';

export function useLogin() {
    const [isLogin, setIsLogin] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isEmployer, setIsEmployer] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const { markAuthenticated } = useContext(AuthContext);

    const navigate = useNavigate();

    const handleToggle = () => {
        setError('');
        setSuccess('');
        setIsLogin(!isLogin);
    };

    const handleSubmit = async (e) => {
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
                navigate('/Chat'); 
                } else {
                setError('Correo o contraseña no son válidos.');
                }
            } else {
                const responseData = await actUsuario({ data: payload });
                localStorage.setItem('userID', responseData.id);
                localStorage.setItem('userEmail', email);
                localStorage.setItem('userName', name);
                localStorage.setItem('userRole', isEmployer ? 'Empleador' : 'Aspirante');
                setSuccess(`Usuario creado con ID: ${responseData.id}`);
            }
            markAuthenticated();
        } catch (err) {
            console.error(err);
            setError('Error de red, inténtalo de nuevo.');
        } finally {
            // limpiar campos
            setName('');
            setEmail('');
            setPassword('');
            setIsEmployer(false);
            setSubmitted(prev => !prev);
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
        submitted
    };
}
