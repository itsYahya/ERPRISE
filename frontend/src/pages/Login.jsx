import './Login.css';

function Login() {
    return (
        <div className="auth-form">
            <div className="form">
                <div className='brand'>
                    <img src='/logo.png' alt='logo' />
                </div>
                <div className='input-fields'>
                    <div className='input-field'>
                        <label htmlFor="email">Email</label>
                        <input name="email" id="email" placeholder='Email' />
                    </div>
                    <div className='input-field'>
                        <label htmlFor="password">Password</label>
                        <input name="password" id="password" placeholder='Password' />
                    </div>
                </div>
                <div className='btn'>
                    <button>Se connecter</button>
                </div>
            </div>
            <div className="slide">
                <br />
                <h2>Nous vous souhaitons la bienvenue sur votre espace personnel</h2>
                <br/>
                <p>Un système ERP intégré et sécurisé, conçu pour accompagner les organisations dans la gestion efficace, centralisée et conforme de leurs activités.</p>
            </div>
        </div>
    );
}

export default Login;
