import { Input, Button, Spinner } from '@heroui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import './Login.css';

function Login() {
    const [username, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await api.post('/api/token/', {
                username,
                password
            });
            
            localStorage.setItem('access', response.data.access);
            localStorage.setItem('refresh', response.data.refresh);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            
            navigate('/overview/dashboard');
        } catch (err) {
            setError(err.response?.data?.detail || 'Une erreur est survenue lors de la connexion.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-overlay">
                <div className="login-content">
                    <div className="login-left">
                        <div className="login-logo">
                            <img src="/logo.png" alt="Logo" />
                        </div>
                        <form onSubmit={handleSubmit} className="login-form">
                            <div className="space-y-6">
                                <div>
                                    <Input
                                        type="text"
                                        label="Username"
                                        placeholder="John Doe"
                                        value={username}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="login-input"
                                        size="lg"
                                        radius="lg"
                                        isRequired
                                    />
                                </div>
                                <div>
                                    <Input
                                        type="password"
                                        label="Mot de passe"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="login-input"
                                        size="lg"
                                        radius="lg"
                                        isRequired
                                    />
                                </div>
                                {error && (
                                    <div className="error-message">
                                        {error}
                                    </div>
                                )}
                                <Button
                                    type="submit"
                                    className="login-button"
                                    size="lg"
                                    isLoading={loading}
                                >
                                    {loading ? <Spinner color="white" size="sm" /> : "Se connecter"}
                                </Button>
                            </div>
                        </form>
                    </div>
                    <div className="login-right">
                        <h1>Bienvenue</h1>
                        <p>Un système ERP intégré et sécurisé, conçu pour accompagner les organisations dans la gestion efficace, centralisée et conforme de leurs activités.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
