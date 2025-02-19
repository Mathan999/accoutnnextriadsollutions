import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useSpring } from 'framer-motion';

// Styles for the background text animation
const styles = {
  backgroundText: {
    position: 'absolute' as 'absolute',
    whiteSpace: 'nowrap' as 'nowrap',
    fontSize: '8rem',
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 0.02)',
    pointerEvents: 'none' as 'none',
    userSelect: 'none' as 'none',
  }
};

interface LoginFormData {
  email: string;
  password: string;
}

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<Partial<LoginFormData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string>('');

  // Use spring animation for smooth mouse movement
  const x = useSpring(0, {
    stiffness: 50,
    damping: 20,
    mass: 0.5
  });
  const y = useSpring(0, {
    stiffness: 50,
    damping: 20,
    mass: 0.5
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate smoother mouse position with reduced movement range
      const xPos = (e.clientX - window.innerWidth / 2) / 50;
      const yPos = (e.clientY - window.innerHeight / 2) / 50;
      
      // Update spring animation values
      x.set(xPos);
      y.set(yPos);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [x, y]);

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginFormData> = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      if (formData.email === 'nextriadsolutions@gmail.com' && formData.password === 'nextriad123') {
        await new Promise(resolve => setTimeout(resolve, 1000));
        localStorage.setItem('isAuthenticated', 'true');
        navigate('/home');
      } else {
        setLoginError('Invalid email or password. Please try again.');
      }
    } catch (error) {
      setLoginError('Failed to login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name as keyof LoginFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Background text animation elements
  const renderBackgroundText = () => {
    return [...Array(10)].map((_, index) => (
      <motion.div
        key={index}
        style={{
          ...styles.backgroundText,
          top: `${index * 150}px`, // Spacing between lines
        }}
        initial={{ x: -1000 }}
        animate={{ 
          x: window.innerWidth + 1000,
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          delay: index * 2,
          ease: "linear"
        }}
      >
        NEXTRIAD SOLUTIONS
      </motion.div>
    ));
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
      {/* Background Text Layer */}
      <div className="absolute inset-0 overflow-hidden">
        {renderBackgroundText()}
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-blue-500 opacity-10 animate-pulse"
            style={{
              width: `${Math.random() * 300}px`,
              height: `${Math.random() * 300}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${4 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Login Form Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          transform: `perspective(1000px) rotateX(${y.get()}deg) rotateY(${x.get()}deg)`,
        }}
        transition={{ duration: 0.8 }}
        className="max-w-md w-full space-y-8 p-8 bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white border-opacity-20 relative z-10"
      >
        {/* Header */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-center text-4xl font-bold text-white mb-2">
            Welcome Back
          </h2>
          <p className="text-center text-blue-200 text-lg">
            Sign in to continue your journey
          </p>
        </motion.div>

        {/* Error Message */}
        {loginError && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-red-500 bg-opacity-20 backdrop-blur-sm border border-red-500 text-white px-4 py-3 rounded-lg"
            role="alert"
          >
            <span className="block sm:inline">{loginError}</span>
          </motion.div>
        )}

        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Email Input */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <label htmlFor="email" className="block text-sm font-medium text-blue-200">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={`mt-1 block w-full rounded-lg border ${
                  errors.email ? 'border-red-500' : 'border-blue-300'
                } bg-white bg-opacity-10 px-4 py-3 text-white placeholder-blue-200 backdrop-blur-sm transition-all duration-200 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50`}
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email}</p>
              )}
            </motion.div>

            {/* Password Input */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <label htmlFor="password" className="block text-sm font-medium text-blue-200">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className={`mt-1 block w-full rounded-lg border ${
                  errors.password ? 'border-red-500' : 'border-blue-300'
                } bg-white bg-opacity-10 px-4 py-3 text-white placeholder-blue-200 backdrop-blur-sm transition-all duration-200 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50`}
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-400">{errors.password}</p>
              )}
            </motion.div>
          </div>

          {/* Remember Me and Forgot Password */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-blue-300 text-blue-600 focus:ring-blue-500 bg-opacity-20 backdrop-blur-sm"
              />
              <label htmlFor="remember-me" className="ml-2 block text-blue-200">
                Remember me
              </label>
            </div>

            <motion.a
              whileHover={{ scale: 1.05 }}
              href="#"
              className="font-medium text-blue-300 hover:text-blue-200 transition-colors duration-200"
            >
            </motion.a>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium text-lg"
          >
            {isLoading ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </div>
            ) : (
              'Sign in'
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;