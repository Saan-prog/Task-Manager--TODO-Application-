import { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getTasks, updateTask, updateStatus, removeTask, createTask } from '../services/api';

const Dashboard = () => {
    const { user, setUser } = useContext(AuthContext);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [tasks, setTasks] = useState([]);
    const [form, setForm] = useState({ title: '', description: '', status: 'Pending', dueDate: '' });
    const [editId, setEditId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [popup, setPopup] = useState({ show: false, message: '', type: '' });
    const taskListRef = useRef(null);
    const navigate = useNavigate();

    const showPopup = (message, type) => {
        setPopup({ show: true, message, type });
        setTimeout(() => setPopup({ show: false, message: '', type: '' }), 3000);
    };

    const handleSessionExpiry = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/', { replace: true });
    };

    const fetchTask = async () => {
        try {
            const { data } = await getTasks();
            setTasks(data);
        } catch (error) {
            if (error.response?.status === 401) handleSessionExpiry();
            else showPopup('Failed to fetch tasks', 'error');
        } finally {
            setIsFetching(false);
        }
    };

    useEffect(() => { fetchTask(); }, []);
    useEffect(() => {
        if(search || filterStatus !== 'all') {
            taskListRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [search, filterStatus]);

    const filteredTasks = tasks.filter((task) => {
        const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const handleSubmit = async () => {
        if (!form.title.trim()) { showPopup('Title is required', 'error'); return; }
        setIsLoading(true);
        try {
            if (editId) {
                await updateTask(editId, form);
                showPopup('Task updated!', 'success');
                setEditId(null);
            } else {
                await createTask(form);
                showPopup('Task created!', 'success');
            }
            setForm({ title: '', description: '', status: 'Pending', dueDate: '' });
            await fetchTask();
        } catch (error) {
            showPopup(error.response?.data?.message || 'Operation failed', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (task) => {
        setForm({
            title: task.title,
            description: task.description || '',
            status: task.status || 'Pending',
            dueDate: task.dueDate?.slice(0, 10) || '',
        });
        setEditId(task._id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setEditId(null);
        setForm({ title: '', description: '', status: 'Pending', dueDate: '' });
    };

    const toggleStatus = async (task) => {
        try {
            await updateStatus(task._id, { status: task.status === 'Pending' ? 'Completed' : 'Pending' });
            await fetchTask();
            showPopup(`Marked as ${task.status === 'Pending' ? 'Completed' : 'Pending'}`, 'success');
        } catch { showPopup('Failed to update status', 'error'); }
    };

    const deleteTask = async (id) => {
        if (!window.confirm('Delete this task?')) return;
        try {
            await removeTask(id);
            await fetchTask();
            showPopup('Task deleted', 'success');
        } catch { showPopup('Failed to delete task', 'error'); }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/', { replace: true });
    };

    const completedCount = tasks.filter(t => t.status === 'Completed').length;
    const pendingCount   = tasks.filter(t => t.status === 'Pending').length;

    // First letter of user's name for avatar
    const avatarLetter = user?.name?.charAt(0).toUpperCase() || 'U';

    return (
        <div className='dashboard-page'>

            {/* ── Toast ── */}
            {popup.show && (
                <div className={`popup-toast ${popup.type === 'success' ? 'popup-success' : 'popup-error'}`}>
                    <i className={`ti ${popup.type === 'success' ? 'ti-circle-check' : 'ti-alert-circle'}`} />
                    {popup.message}
                </div>
            )}

            {/* ── Single Navbar ── */}
            <nav className='dash-nav'>

                {/* Left side */}
                <div className='dash-brand'>
                    <div className='dash-brand-icon'>
                        <i className='ti ti-list-check' />
                    </div>
                    <span className='dash-brand-name'>Task Manager</span>
                </div>


                {/* center of the navabr */}
            <div className='dash-nav-center'>
                <div className='dash-search-wrap'>
                    <i className='ti ti-search dash-search-icon' />
                    <input
                        type='text'
                        placeholder='Search tasks...'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className='dash-search-input'
                    />
                </div>

                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className='dash-filter-select'
                    >
                        <option value='all'>All</option>
                        <option value='Pending'>Pending</option>
                        <option value='Completed'>Completed</option>
                    </select>
                
                </div>
                    {/* Right side of the navbar*/}
                    <div className='dash-nav-right'>
                    <div className='dash-user-chip'>
                        <div className='dash-avatar'>{avatarLetter}</div>
                        <span className='dash-username'>{user?.name}</span>
                    </div>

                    {/* Logout */}
                    <button onClick={handleLogout} className='dash-logout-btn'>
                        <i className='ti ti-logout' />
                        <span>Logout</span>
                    </button>
                    </div>
            </nav>

            {/* ── Page body ── */}
            <div className='dash-body'>

                {/* Stats */}
                <div className='dash-stats'>
                    {[
                        { label: 'Total',   value: tasks.length,   icon: 'ti-layout-list' },
                        { label: 'Pending', value: pendingCount,   icon: 'ti-clock' },
                        { label: 'Done',    value: completedCount, icon: 'ti-circle-check' },
                    ].map(({ label, value, icon }) => (
                        <div key={label} className='dash-stat-card'>
                            <div className='dash-stat-top'>
                                <span className='dash-stat-label'>{label}</span>
                                <i className={`ti ${icon} dash-stat-icon`} />
                            </div>
                            <span className='dash-stat-value'>{value}</span>
                        </div>
                    ))}
                </div>

                {/* Form */}
                <div className='dash-form-card'>
                    <h2 className='dash-form-title'>
                        <i className={`ti ${editId ? 'ti-edit' : 'ti-plus'}`} />
                        {editId ? 'Edit Task' : 'New Task'}
                    </h2>

                    <div className='dash-form-fields'>
                        <input
                            type='text'
                            placeholder='Task title *'
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            className='dash-input'
                        />
                        <input
                            type='text'
                            placeholder='Description (optional)'
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            className='dash-input'
                        />
                        <input
                            type='date'
                            value={form.dueDate}
                            onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                            className='dash-input'
                        />
                    </div>

                    <div className='dash-form-actions'>
                        <button
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className='btn-primary flex items-center justify-center gap-2 flex-1'
                        >
                            {isLoading ? (
                                <><span className='spinner' />{editId ? 'Updating...' : 'Creating...'}</>
                            ) : (
                                <><i className={`ti ${editId ? 'ti-check' : 'ti-plus'}`} />{editId ? 'Update Task' : 'Add Task'}</>
                            )}
                        </button>
                        {editId && (
                            <button onClick={cancelEdit} className='btn-ghost flex items-center gap-2'>
                                <i className='ti ti-x' /> Cancel
                            </button>
                        )}
                    </div>
                </div>

                {/* Task count line */}
                <div className='dash-list-header' ref={taskListRef}>
                    <span className='dash-list-title'>Tasks</span>
                    <span className='dash-list-count'>{filteredTasks.length} of {tasks.length}</span>
                </div>

                {/* Task list */}
                <div className='dash-task-list'>
                    {isFetching ? (
                        <div className='dash-empty'>
                            <span className='spinner' style={{ borderColor: 'var(--border)', borderTopColor: 'var(--primary)', width: 24, height: 24 }} />
                        </div>
                    ) : filteredTasks.length === 0 ? (
                        <div className='dash-empty'>
                            <i className='ti ti-checklist' style={{ fontSize: 36, color: 'var(--border)' }} />
                            <p style={{ color: 'var(--text-faint)', fontSize: 13 }}>
                                {search || filterStatus !== 'all'
                                    ? 'No tasks match your filter'
                                    : 'No tasks yet — add one above'}
                            </p>
                        </div>
                    ) : (
                        filteredTasks.map((task) => (
                            <div key={task._id} className='task-card'>

                                <div className='task-info'>
                                    <p className='task-title' style={{
                                        color: task.status === 'Completed' ? 'var(--text-faint)' : 'var(--text-bright)',
                                        textDecoration: task.status === 'Completed' ? 'line-through' : 'none',
                                    }}>
                                        {task.title}
                                    </p>

                                    {task.description && (
                                        <p className='task-desc'>{task.description}</p>
                                    )}

                                    <div className='task-meta'>
                                        <span className={task.status === 'Completed' ? 'badge-completed' : 'badge-pending'}>
                                            {task.status}
                                        </span>
                                        {task.dueDate && (
                                            <span className='task-date'>
                                                <i className='ti ti-calendar' style={{ fontSize: 11 }} />
                                                {task.dueDate.slice(0, 10)}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className='task-actions'>
                                    <button onClick={() => toggleStatus(task)} className='icon-btn success' title='Toggle status'>
                                        <i className='ti ti-check' />
                                    </button>
                                    <button onClick={() => handleEdit(task)} className='icon-btn edit' title='Edit'>
                                        <i className='ti ti-edit' />
                                    </button>
                                    <button onClick={() => deleteTask(task._id)} className='icon-btn danger' title='Delete'>
                                        <i className='ti ti-trash' />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

            </div>
        </div>
    );
};

export default Dashboard;