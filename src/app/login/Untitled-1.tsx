const handleLogin = async () => {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      const encryptedToken = sessionStorage.getItem('encryptedToken');
      if (encryptedToken) {
        headers['Authorization'] = `Bearer ${encryptedToken}`;
      }

      

      const loginResponse = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const loginData = await loginResponse.json();

      if (loginResponse.ok) {
        
        const encryptedToken = createEncryptedToken(loginData.access_token);
        sessionStorage.setItem('accessToken', loginData.access_token);
        sessionStorage.setItem('encryptedToken', encryptedToken);
        
        
        if (loginData.statusCode === 201) {
          
          router.push('/dashboard');
        } else {
          
          setError('Session expired. Please login again.');
          
          sessionStorage.removeItem('accessToken');
          sessionStorage.removeItem('encryptedToken');
        }
      } else {
        setError(loginData.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('An error occurred while logging in');
      
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('encryptedToken');
    }
  };

  const handleLogin = async () => {
    try {
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      const encryptedToken = sessionStorage.getItem('encryptedToken');
      if (encryptedToken) {
        headers['Authorization'] = `Bearer ${encryptedToken}`;
      }
  
      const loginResponse = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          email,
          password,
        }),
      });
  
      if (loginResponse.ok) {
        const loginData = await loginResponse.json();
        const encryptedToken = createEncryptedToken(loginData.access_token);
        sessionStorage.setItem('accessToken', loginData.access_token);
        sessionStorage.setItem('encryptedToken', encryptedToken);
        router.push('/dashboard');
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('An error occurred while logging in');
    }
  };