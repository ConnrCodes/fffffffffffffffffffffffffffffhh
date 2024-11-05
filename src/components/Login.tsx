import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, Key, User, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (login(username, password)) {
      setError('');
    } else {
      setError('Invalid credentials');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30
      }
    }
  };

  const iconVariants = {
    hover: {
      scale: 1.2,
      rotate: 15,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 15
      }
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 15
      }
    },
    tap: {
      scale: 0.98
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900/20 to-black/40">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-black/80 p-8 rounded-lg backdrop-blur-sm border border-purple-500/30 w-full max-w-md relative overflow-hidden"
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent"
          animate={{
            opacity: [0.5, 0.8, 0.5],
            scale: [1, 1.02, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        <motion.div
          variants={itemVariants}
          className="flex items-center gap-2 mb-6"
        >
          <motion.div
            variants={iconVariants}
            whileHover="hover"
          >
            <LogIn className="w-6 h-6 text-purple-400" />
          </motion.div>
          <h1 className="text-2xl font-bold text-purple-400">Login</h1>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          <motion.div variants={itemVariants}>
            <label className="block text-purple-300 mb-2">Username</label>
            <div className="relative group">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="absolute left-3 top-1/2 transform -translate-y-1/2"
              >
                <User className="w-5 h-5 text-purple-400" />
              </motion.div>
              <motion.input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-purple-900/20 border border-purple-500/30 rounded-lg pl-10 pr-4 py-2 text-purple-100 focus:border-purple-500 transition-colors"
                placeholder="Enter username"
                whileFocus={{ scale: 1.02 }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30
                }}
              />
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <label className="block text-purple-300 mb-2">Password</label>
            <div className="relative group">
              <motion.div
                whileHover={{ scale: 1.1, rotate: -5 }}
                className="absolute left-3 top-1/2 transform -translate-y-1/2"
              >
                <Key className="w-5 h-5 text-purple-400" />
              </motion.div>
              <motion.input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-purple-900/20 border border-purple-500/30 rounded-lg pl-10 pr-4 py-2 text-purple-100 focus:border-purple-500 transition-colors"
                placeholder="Enter password"
                whileFocus={{ scale: 1.02 }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30
                }}
              />
            </div>
          </motion.div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2 text-red-400 text-sm"
              >
                <AlertCircle className="w-4 h-4" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            type="submit"
            className="w-full bg-purple-500 text-white rounded-lg py-2 hover:bg-purple-600 transition-colors relative overflow-hidden group"
          >
            <motion.span
              className="absolute inset-0 bg-gradient-to-r from-purple-400/0 via-purple-400/50 to-purple-400/0"
              animate={{
                x: [-500, 500],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{
                opacity: 0,
              }}
            />
            <motion.span
              animate={{ scale: [1, 1.02, 1] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              Login
            </motion.span>
          </motion.button>
        </form>

        <motion.div
          className="absolute -bottom-32 -right-32 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>
    </div>
  );
};

export default Login;