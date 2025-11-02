
try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('adminUser', JSON.stringify(data.admin));
        router.push('/dashboard');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      height: '100vh', background: '#667eea', fontFamily: 'Arial'
    }}>
      <div style={{
        background: 'white', padding: '50px', borderRadius: '15px',
        width: '100%', maxWidth: '400px'
      }}>
        <h1 style={{ textAlign: 'center', color: '#667eea', marginBottom: '20px' }}>🛡️ Admin Login</h1>
        {error && <div style={{ background: '#fee', color: '#c33', padding: '10px', borderRadius: '5px', marginBottom: '15px' }}>{error}</div>}
        <form onSubmit={handleLogin}>
          <input type="text" placeholder="Username" 
            value={username} onChange={(e) => setUsername(e.target.value)} 
            required style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '5px' }} />
          <input type="password" placeholder="Password" 
            value={password} onChange={(e) => setPassword(e.target.value)} 
            required style={{ width: '100%', padding: '10px', marginBottom: '20px', border: '1px solid #ddd', borderRadius: '5px' }} />
          <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', background: '#667eea', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
