import { useState, useContext, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import { register } from "../services/api.js";
import { AuthContext } from '../context/AuthContext';

const Register = () => {
    const { user } = useContext(AuthContext);
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [alert, setAlert] = useState(false);
    const [isloading, setIsloading] = useState(false);
    const [strength, setStrength] = useState({ score: 0, label: '', color: '' });
    // const [popup, setPopup] = useState({ show: false, message: "", type: ""});
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/dashboard', { replace: true });
        }
    }, [user])

    const showAlert = (message, type) => {
        setAlert({ show: true, message, type });

        if (type === 'error') {
            setTimeout(() => setAlert({ show: false, message: '', type: '' }), 4000)
        }
    }

    const checkStrength = (val) => {
        if (!val) {
            setStrength({ score: 0, label: "", color: '' });
            return
        }
        let score = 0;
        if (val.length >= 6) score++
        if (val.length >= 10) score++
        if (/[A-Z]/.test(val)) score++
        if (/[0-9]/.test(val)) score++
        if (/[^a-zA-Z0-9]/.test(val)) score++

        const levels = [
            { label: 'Very weak', color: '#ef4444' },
            { label: 'Weak', color: '#f97316' },
            { label: 'Fair', color: '#eab308' },
            { label: 'Strong', color: '#22c55e' },
            { label: 'Very strong', color: '#16a34a' },
        ]

        const lvl = levels[Math.min(score - 1, 4)]
        setStrength({ score, label: lvl.label, color: lvl.color })
    }

    const validateForm = () => {
        if (!form.name.trim() || !form.email || !form.password) {
            showAlert("Please fill in all fields", "error");
            return false
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(form.email)) {
            showAlert('Please enter a valid email address', 'error')
            return false
        }
        if (form.password.length < 6) {
            showAlert('Password must be at least 6 characters', 'error')
            return false
        }
        return true
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return

        setIsloading(true);

        try {
            const { data } = await register(form);

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify({
                _id: data._id,
                name: data.name,
                email: data.email
            }));

            showAlert("Account created!, Redirecting to login...", "success");

            setTimeout(() => {
                navigate('/', { replace: true });
            }, 2000);

        } catch (error) {
            const message = error.response?.data?.message || "registration failed. Please try again.";

            showAlert(message, "error");
            console.error(message);

        } finally {
            setIsloading(false);
        }

    }
    const strengthPercent = strength.score ? `${(strength.score / 5) * 100}%` : '0%';

    return (
        <div className='container-center'>
            <div className='auth-wrapper'>

                {/* Left Panel */}
                <div className='auth-panel-left'>
                    <div className='auth-brand'>
                        <span className='auth-brand-icon'><i className='ti ti-list-check' /></span>
                        <span className='auth-brand-name'>Task Manager</span>
                    </div>
                    <div className='auth-panel-content'>
                        <h2 className='auth-panel-title'>Your Productivity<br />starts here.</h2>
                        <p className='auth-panel-sub'>Join thousands of users managing their tasks smarter every day.</p>
                        <div className='auth-features'>
                            <div className='auth-features-item'>
                                <span>🚀</span> Get started in seconds
                            </div>
                            <div className='auth-featire-item'>
                                <span>🔐</span> Secure and Private
                            </div>
                            <div className='auth-feature-item'>
                                <span>📊</span> Track everything in one place
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel Form */}
                <div className='auth-panel-right'>
                    <div className='auth-form-header'>
                        <h1 className='auth-title'>Create Account</h1>
                        <p className='auth-subtitle'>Start managing your tasks today - Its's free</p>
                    </div>
                    {/* Alert */}
                    {alert.show && (
                        <div className={`alert ${alert.type === 'success' ? 'alert-success' : 'alert-error'}`}>
                            <span>{alert.type === 'success'
                                ? <i className='ti ti-circle-check' />
                                : <i className='ti ti-alert-circle' />
                            }</span>
                            <span>{alert.message}</span>
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className='auth-form'>
                        {/* name */}
                        <div className='form-group'>
                            <label className='form-label'>Full Name</label>
                            <div className='input-icon-wrapper'>
                                <span className='input-icon'><i className='ti ti-user' /></span>

                                <input
                                    type="text"
                                    placeholder='Your full name'
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    className='input input-with-icon'
                                    disabled={isloading}
                                    autoComplete='name'
                                />
                            </div>
                        </div>
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
                                    onChange={(e) => {
                                        setForm({ ...form, password: e.target.value })
                                        checkStrength(e.target.value)
                                    }}
                                    className='input input-with-icon input-with-toggle'
                                    disabled={isloading}
                                    autoComplete='new-password'
                                />
                                <button
                                    type='button'
                                    className='password-toggle'
                                    onClick={() => setShowPassword(!showPassword)}
                                    tabIndex={-1}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}>
                                    {showPassword ? <i className='ti ti-eye-off' /> : <i className='ti ti-eye' />}
                                </button>

                                {/* Strength bar */}
                                {form.password && (
                                    <div className='strength-wrapper'>
                                        <div className='strength-bar'>
                                            <div className='strength-fill'
                                                style={{
                                                    width: strengthPercent,
                                                    backgroundColor: strength.color
                                                }} />
                                        </div>
                                        <span className='strength-label'
                                            style={{ color: strength.color }}>
                                            {strength.label}
                                        </span>
                                    </div>
                                )}
                            </div>
                            {/* Terms */}
                            <p className='auth-terms'>By continuing, you agree to our {' '}
                                <a href="#" className='auth-switch-link'>Terms of Service</a>{' '} and {' '}<a href="#" className='auth-switch-link'>Privacy Policy</a>.
                            </p>

                            {/* submit */}
                            <button type='submit'
                                className='btn'
                                disabled={isloading}>
                                {isloading ? (
                                    <span className='btn-loading'>
                                        <span className='spinner' />Creating Account...
                                    </span>
                                ) : (
                                    '→  Create Account'
                                )}
                            </button>

                            {/* switch */}
                            <p className='auth-switch'>
                                Already have an account? {' '}
                                <Link to='/' className='auth-switch-link'>Signin</Link>
                            </p>
                        </div>

                    </form>

                </div>
            </div>
        </div>
    )
}


export default Register