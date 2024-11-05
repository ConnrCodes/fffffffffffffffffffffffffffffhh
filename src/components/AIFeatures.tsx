import React from 'react';
import { 
  Brain, 
  Sparkles, 
  Zap, 
  Code2, 
  FileText, 
  Table, 
  Calculator, 
  Languages, 
  Calendar,
  BarChart,
  BookOpen,
  Lightbulb
} from 'lucide-react';
import { motion } from 'framer-motion';

interface AIFeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  command: string;
  onClick: () => void;
}

const AIFeature: React.FC<AIFeatureProps> = ({ icon, title, description, command, onClick }) => (
  <motion.button
    className="flex items-center gap-3 w-full p-3 bg-purple-900/20 rounded-lg hover:bg-purple-900/30 transition-colors"
    onClick={onClick}
    whileHover={{ scale: 1.02, backgroundColor: 'rgba(147, 51, 234, 0.3)' }}
    whileTap={{ scale: 0.98 }}
  >
    <div className="text-purple-400">{icon}</div>
    <div className="text-left flex-1">
      <div className="text-purple-300 font-medium">{title}</div>
      <div className="text-purple-400/70 text-sm">{description}</div>
      <div className="text-purple-500 text-xs mt-1">Try: "{command}"</div>
    </div>
  </motion.button>
);

interface Props {
  onFeatureSelect: (command: string) => void;
}

const AIFeatures: React.FC<Props> = ({ onFeatureSelect }) => {
  const features = [
    {
      icon: <Code2 className="w-5 h-5" />,
      title: "Code Assistant",
      description: "Get help with coding, debugging, and best practices",
      command: "help me write a function that"
    },
    {
      icon: <Table className="w-5 h-5" />,
      title: "Data Analysis",
      description: "Create spreadsheets and analyze data",
      command: "create a spreadsheet for"
    },
    {
      icon: <Brain className="w-5 h-5" />,
      title: "Smart Analysis",
      description: "Analyze text, documents, or complex problems",
      command: "analyze this text:"
    },
    {
      icon: <Languages className="w-5 h-5" />,
      title: "Language Translation",
      description: "Translate text between languages",
      command: "translate to Spanish:"
    },
    {
      icon: <Calculator className="w-5 h-5" />,
      title: "Math & Calculations",
      description: "Solve mathematical problems and equations",
      command: "solve this equation:"
    },
    {
      icon: <FileText className="w-5 h-5" />,
      title: "Document Generation",
      description: "Create reports, summaries, and documents",
      command: "generate a report about"
    },
    {
      icon: <BarChart className="w-5 h-5" />,
      title: "Data Visualization",
      description: "Create charts and visualize data",
      command: "create a chart showing"
    },
    {
      icon: <Calendar className="w-5 h-5" />,
      title: "Schedule Planning",
      description: "Help with scheduling and time management",
      command: "plan a schedule for"
    },
    {
      icon: <BookOpen className="w-5 h-5" />,
      title: "Learning Assistant",
      description: "Get explanations and learning materials",
      command: "explain the concept of"
    },
    {
      icon: <Sparkles className="w-5 h-5" />,
      title: "Creative Writing",
      description: "Generate stories, poems, or creative content",
      command: "write a creative story about"
    },
    {
      icon: <Lightbulb className="w-5 h-5" />,
      title: "Brainstorming",
      description: "Generate ideas and solutions",
      command: "brainstorm ideas for"
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Quick Solutions",
      description: "Get instant answers and explanations",
      command: "how do I"
    }
  ];

  return (
    <motion.div 
      className="grid grid-cols-2 gap-2 p-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {features.map((feature, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <AIFeature
            {...feature}
            onClick={() => onFeatureSelect(feature.command)}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default AIFeatures;