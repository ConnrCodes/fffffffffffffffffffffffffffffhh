import React, { useState } from 'react';
import ChatInterface from './components/ChatInterface';
import HolographicCircle from './components/HolographicCircle';
import { VisionProvider } from './contexts/VisionContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ParticleBackground from './components/ParticleBackground';
import VoiceCommands from './components/VoiceCommands';
import WeatherForecast from './components/WeatherForecast';
import { motion } from 'framer-motion';
import Calculator from './components/Calculator';
import ExpenseTracker from './components/ExpenseTracker';
import Login from './components/Login';
import StartupSequence from './components/StartupSequence';
import NetworkStatus from './components/NetworkStatus';

const AppContent = () => {
  const { user, logout } = useAuth();
  const [isStarting, setIsStarting] = useState(true);

  if (isStarting) {
    return <StartupSequence onComplete={() => setIsStarting(false)} />;
  }

  if (!user) {
    return <Login />;
  }

  const isAdmin = user.role === 'admin';
  const hasAccess = (feature: string) => {
    return user.allowedFeatures.includes('all') || user.allowedFeatures.includes(feature);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      <motion.div 
        className="max-w-7xl mx-auto p-4 md:p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-8">
          <motion.div 
            className="flex items-center gap-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <HolographicCircle />
            <div className="flex-1">
              {isAdmin ? (
                <WeatherForecast />
              ) : (
                <ExpenseTracker />
              )}
            </div>
          </motion.div>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <motion.div 
            className="lg:col-span-3 space-y-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <VoiceCommands />
            {!isAdmin && hasAccess('calculator') && <Calculator />}
          </motion.div>
          <motion.div 
            className="lg:col-span-9"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {(isAdmin || hasAccess('chat')) && <ChatInterface />}
          </motion.div>
        </div>
      </motion.div>
      <NetworkStatus />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <VisionProvider>
        <ParticleBackground />
        <AppContent />
      </VisionProvider>
    </AuthProvider>
  );
}

export default App;