import { useState, useContext, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { login } from '../services/api';

const Login = () => {
    const { user, setUser } = useContext(AuthContext);
    const [form, setForm] = useState({ email: "", password: "" });
    const [isloading, setIsloading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [alert, setAlert] = useState({ show: false, message: "", type: "" });
    const navigate = useNavigate();
    useEffect (() => {
        if(user) {
            navigate('/dashboard', {replace: true});
        }
    }, [user])

    const showAlert = (message, type) => {
        setAlert({ show: true, message, type });

        if (type === 'error') {
            setTimeout(() => setAlert({ show: false, message: '', type: '' }), 4000)
        }
    }

    const validateForm = () => {
        if (!form.email || !form.password) {
            showAlert("Please fill in all fields", "error");
            return false
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(form.email)) {
            showAlert('Please enter a valid email address', 'error')
            return false
        }
        return true
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm())
            return;

        setIsloading(true);

        try {
            const response = await login(form);
            console.log("Full response:", response);
            console.log("Response data:", response.data);

            const data = response.data;

            const userData = {
                _id: data._id,
                name: data.name,
                email: data.email
            };

            localStorage.setItem("user", JSON.stringify(userData));
            localStorage.setItem("token", data.token);

            setUser(userData);
            showAlert("Login successful! Redirecting to dashboard...", "success");

            setTimeout(() => {
                navigate('/dashboard', {replace:true});
            }, 1500);

        } catch (error) {
            const message = error.response?.data?.message || "Login failed. Please try again.";
            showAlert(message, "error");
            console.error(message);
        } finally {
            setIsloading(false);
        }
    }
    return (
        <div className='container-center'>
            <div className='auth-wrapper'>

                {/* Left Panel */}
                <div className='auth-panel-left'>
                    <div className='auth-brand'>
                        <span className='auth-brand-icon'><i className='ti ti-list-check'/></span>
                        <span className='auth-brand-name'>Task Manager</span>
                    </div>
                    <div className='auth-panel-content'>
                        <h2 className='auth-panel-title'>Stay Organized<br />Get things done</h2>
                        <p className='auth-panel-sub'>Manage your tasks efficiently and never miss a deadline.</p>
                        <div className='auth-features'>
                            <div className='auth-features-item'>
                                <span>📋</span> Create and organize tasks
                            </div>
                            <div className='auth-featire-item'>
                                <span>📅</span> Set due dates and priorities
                            </div>
                            <div className='auth-feature-item'>
                                <span>✔️</span> Track your progress
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel Form */}
                <div className='auth-panel-right'>
                    <div className='auth-form-header'>
                        <h1 className='auth-title'>Welcome back</h1>
                        <p className='auth-subtitle'>Sign in to your account to continue</p>
                    </div>
                    {/* Alert */}
                    {alert.show && (
                        <div className={`alert ${alert.type === 'success' ? 'alert-success' : 'alert-error'}`}>
                            {alert.type === 'success' 
    ? <i className='ti ti-circle-check' /> 
    : <i className='ti ti-alert-circle' />
}
                            <span>{alert.message}</span>
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className='auth-form'>

                        {/* Email */}
                        <div className='form-group'>
                            <label className='form-label'>Email address</label>
                            <div className='input-icon-wrapper'>
                                <span className='input-icon'><i className='ti ti-mail' /></span>
                                <input
                                    type="email"
                                    placeholder='you@example.com'
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    className='input input-with-icon'
                                    disabled={isloading}
                                    autoComplete='email'
                                />
                            </div>
                        </div>
                        {/* password */}
                        <div className='form-group'>
                            <label className='form-label'>Password</label>
                            <div className='input-icon-wrapper'>
                                <span className='input-icon'><i className='ti ti-lock' /></span>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder='Min. 6 characters'
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    className='input input-with-icon input-with-toggle'
                                    disabled={isloading}
                                    autoComplete='current-password'
                                />
                                <button
                                    type='button'
                                    className='password-toggle'
                                    onClick={() => setShowPassword(!showPassword)}
                                    tabIndex={-1}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}>
                                    {showPassword ? <i className='ti ti-eye-off' /> : <i className='ti ti-eye'></i>}
                                </button>
                            </div>
                        </div>

                        {/* Remember me + forgot password */}
                        <div className='form-row'>
                            <label className='checkbox-label'>
                                <input type="checkbox"
                                    className='checkbox' />
                                Remember me
                            </label>
                            <a href="#" className='forgot-link'>
                                Forgot Password?
                            </a>
                        </div>

                        {/* submit */}
                        <button type='submit'
                            className='btn'
                            disabled={isloading}>
                            {isloading ? (
                                <span className='btn-loading'>
                                    <span className='spinner' />Singing in...
                                </span>
                            ) : (
                                '→  Sign In'
                            )}
                        </button>

                        {/* switch */}
                        <p className='auth-switch'>
                            Do you have an account? {' '}
                            <Link to='/register' className='auth-switch-link'>Create Account</Link>
                        </p>
                    </form>

                </div>
            </div>
        </div>
    )
}

export default Login