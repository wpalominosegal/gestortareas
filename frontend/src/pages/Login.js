// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';


// const Login = () => {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const navigate = useNavigate();

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const response = await axios.post('http://localhost:5000/usuarios/login', { email, password });
//             localStorage.setItem('token', response.data.token);
//             navigate('/tareas');
//         } catch (error) {
//             alert('Error al iniciar sesión');
//         }
//     };

//     return (
//         <form onSubmit={handleSubmit}>
//             <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
//             <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />
//             <button type="submit">Iniciar Sesión</button>
//         </form>
//     );
// };

// export default Login;
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css'; // Importar el archivo CSS

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/usuarios/login', { email, password });
            localStorage.setItem('token', response.data.token);
            navigate('/tareas');
        } catch (error) {
            setError('Error al iniciar sesión. Verifica tus credenciales.');
            console.error(error);
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>Iniciar Sesión</h2>
                {error && <p className="error">{error}</p>}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Iniciar Sesión</button>
                <a href="/register" className="link">¿No tienes una cuenta? Regístrate</a>
            </form>
        </div>
    );
};

export default Login;