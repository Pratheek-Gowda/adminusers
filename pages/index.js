import React, { useState } from 'react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Use local Vercel API endpoint
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('adminUser', JSON.stringify(data.admin));
        window.location.href = '/dashboard';
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (error) {
      setError('Connection error: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
        }
        
        .login-container {
          background: white;
          padding: 50px;
          border-radius: 15px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          width: 100%;
          max-width: 400px;
        }
        
        h1 {
          color: #667eea;
          margin-bottom: 10px;
          text-align: center;
          font-size: 28px;
        }
        
        .subtitle {
          text-align: center;
          color: #666;
          margin-bottom: 30px;
          font-size: 14px;
        }
        
        .form-group {
          margin-bottom: 20px;
        }
        
        label {
          display: block;
          margin-bottom: 8px;
          color: #333;
          font-weight: 600;
        }
        
        input {
          width: 100%;
          padding: 12px 15px;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          font-size: 14px;
        }
        
        input:focus {
          outline: none;
          border-color: #667eea;
        }
        
        button {
          width: 100%;
          padding: 12px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
        }
        
        button:hover {
          transform: translateY(-2px);
        }
        
        .error {
          background: #fee;
          color: #c33;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 20px;
          border-left: 4px solid #c33;
          display: ${error ? 'block' : 'none'};
        }
      `}</style>
      
      <div className="login-container">
        <h1>🛡️ Admin Dashboard</h1>
        <p className="subtitle">Referral Analytics & Management</p>
        
        {error && <div className="error">{error}</div>}
        
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input 
              type="text" 
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login to Dashboard'}
          </button>
        </form>
      </div>
    </>
  );
}
