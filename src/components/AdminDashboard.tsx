import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Users, Calculator, MessageSquare, DollarSign } from 'lucide-react';

const AdminDashboard = () => {
  const mockUsageData = {
    chatMessages: 150,
    calculations: 75,
    expenses: 45,
    activeUsers: 3
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0,
      y: 20,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  };

  const numberVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30,
        delay: 0.2
      }
    }
  };

  const iconVariants = {
    hover: {
      scale: 1.2,
      rotate: 360,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 15
      }
    }
  };

  const glowVariants = {
    animate: {
      opacity: [0.3, 0.6, 0.3],
      scale: [1, 1.2, 1],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div
      className="bg-black/80 rounded-lg p-6 backdrop-blur-sm border border-red-500/30 relative overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent"
        animate={{
          opacity: [0.3, 0.5, 0.3],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <motion.h2
        className="text-red-400 text-lg font-semibold mb-4 flex items-center gap-2 relative z-10"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <motion.div
          variants={iconVariants}
          whileHover="hover"
        >
          <Activity className="w-5 h-5" />
        </motion.div>
        Admin Dashboard
      </motion.h2>

      <div className="grid grid-cols-2 gap-4 relative z-10">
        {[
          { icon: Users, label: "Active Users", value: mockUsageData.activeUsers },
          { icon: MessageSquare, label: "Chat Messages", value: mockUsageData.chatMessages },
          { icon: Calculator, label: "Calculations", value: mockUsageData.calculations },
          { icon: DollarSign, label: "Expenses Tracked", value: mockUsageData.expenses }
        ].map((item, index) => (
          <motion.div
            key={item.label}
            variants={cardVariants}
            className="bg-red-900/20 p-4 rounded-lg relative overflow-hidden group"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-transparent"
              variants={glowVariants}
              animate="animate"
            />

            <div className="flex items-center gap-2 text-red-300 mb-2">
              <motion.div
                variants={iconVariants}
                whileHover="hover"
              >
                <item.icon className="w-4 h-4" />
              </motion.div>
              <h3>{item.label}</h3>
            </div>

            <motion.p
              className="text-2xl font-bold text-red-400"
              variants={numberVariants}
            >
              {item.value}
            </motion.p>

            <motion.div
              className="absolute bottom-0 left-0 h-1 bg-red-500/30"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{
                duration: 1,
                delay: index * 0.2,
                ease: "easeOut"
              }}
            />
          </motion.div>
        ))}
      </div>

      <motion.div
        className="absolute -bottom-32 -right-32 w-64 h-64 bg-red-500/10 rounded-full blur-3xl"
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
  );
};

export default AdminDashboard;