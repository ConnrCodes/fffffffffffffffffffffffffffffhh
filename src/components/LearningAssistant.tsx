import React, { useState, useRef, useEffect } from 'react';
import { Book, GraduationCap, Loader2, Beaker, BookOpen, ChevronLeft, ChevronRight, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateLesson, type Lesson, type DrawStep } from '../services/lessonService';

const LearningAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [topic, setTopic] = useState('');
  const [subject, setSubject] = useState<'math' | 'science' | 'ela'>('math');
  const [gradeLevel, setGradeLevel] = useState('9');
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const startLesson = async () => {
    if (!topic.trim()) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const newLesson = await generateLesson(subject, topic, gradeLevel);
      setLesson(newLesson);
      setIsOpen(true);
      setCurrentStep(0);
      speakText("Welcome to today's lesson. Let's begin by understanding our learning objectives.");
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate lesson');
    } finally {
      setIsLoading(false);
    }
  };

  const speakText = (text: string) => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const drawOnCanvas = async (steps: DrawStep[]) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#FFFBF5'; // Slight cream color for chalkboard feel
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, step.delay));

      ctx.beginPath();
      ctx.strokeStyle = step.color;
      ctx.fillStyle = step.color;
      ctx.lineWidth = step.thickness || 2;

      switch (step.type) {
        case 'text':
          ctx.font = `${step.thickness ? step.thickness * 12 : 24}px 'Comic Sans MS'`;
          ctx.fillText(step.text || '', step.x, step.y);
          break;
        case 'line':
          if (step.points && step.points.length >= 2) {
            ctx.moveTo(step.points[0].x, step.points[0].y);
            ctx.lineTo(step.points[1].x, step.points[1].y);
          }
          break;
        case 'circle':
          ctx.arc(step.x, step.y, step.width || 50, 0, Math.PI * 2);
          break;
      }

      if (step.type !== 'text') {
        ctx.stroke();
      }

      await new Promise(resolve => setTimeout(resolve, step.duration));
    }
    setIsDrawing(false);
  };

  useEffect(() => {
    if (lesson && lesson.steps[currentStep]) {
      drawOnCanvas(lesson.steps[currentStep].drawSteps);
      speakText(lesson.steps[currentStep].content);
    }
  }, [currentStep, lesson]);

  const getSubjectIcon = () => {
    switch (subject) {
      case 'math': return <GraduationCap className="w-5 h-5" />;
      case 'science': return <Beaker className="w-5 h-5" />;
      case 'ela': return <BookOpen className="w-5 h-5" />;
    }
  };

  return (
    <div className="relative">
      <div className="bg-black/80 rounded-lg p-6 backdrop-blur-sm border border-indigo-500/30">
        <div className="flex items-center gap-2 mb-4">
          <Book className="w-6 h-6 text-indigo-400" />
          <h2 className="text-indigo-400 text-lg font-semibold">Virtual Classroom</h2>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value as 'math' | 'science' | 'ela')}
              className="bg-indigo-900/20 border border-indigo-500/30 rounded-lg px-4 py-2 text-indigo-100"
            >
              <option value="math">Mathematics</option>
              <option value="science">Science</option>
              <option value="ela">English Language Arts</option>
            </select>

            <select
              value={gradeLevel}
              onChange={(e) => setGradeLevel(e.target.value)}
              className="bg-indigo-900/20 border border-indigo-500/30 rounded-lg px-4 py-2 text-indigo-100"
            >
              {[6, 7, 8, 9, 10, 11, 12].map(grade => (
                <option key={grade} value={grade}>Grade {grade}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="What would you like to learn today?"
              className="flex-1 bg-indigo-900/20 border border-indigo-500/30 rounded-lg px-4 py-2 text-indigo-100 placeholder-indigo-400/50"
            />
            <button
              onClick={startLesson}
              disabled={!topic.trim() || isLoading}
              className="px-4 py-2 bg-indigo-500 text-white rounded-lg disabled:opacity-50 flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Preparing Lesson...
                </>
              ) : (
                <>
                  {getSubjectIcon()}
                  Start Class
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 text-red-400">
              {error}
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isOpen && lesson && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#1a1a2e]/95"
          >
            <div className="h-full flex flex-col">
              {/* Classroom Header */}
              <motion.div 
                className="bg-[#2a2a4e] p-4 text-white flex justify-between items-center"
                initial={{ y: -50 }}
                animate={{ y: 0 }}
              >
                <div className="flex items-center gap-4">
                  {getSubjectIcon()}
                  <div>
                    <h3 className="text-xl font-semibold">{lesson.topic}</h3>
                    <p className="text-white/60 text-sm">Grade {lesson.gradeLevel} {lesson.subject}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    window.speechSynthesis.cancel();
                  }}
                  className="text-white/80 hover:text-white px-4 py-2 rounded-lg bg-white/10"
                >
                  Leave Class
                </button>
              </motion.div>

              {/* Main Classroom Area */}
              <div className="flex-1 flex overflow-hidden">
                {/* Left Sidebar - Learning Materials */}
                <motion.div 
                  className="w-80 bg-[#2a2a4e] p-6 overflow-y-auto"
                  initial={{ x: -320 }}
                  animate={{ x: 0 }}
                >
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-white/80 font-semibold mb-3">Today's Objectives</h4>
                      <ul className="space-y-2">
                        {lesson.learningObjectives.map((objective, index) => (
                          <motion.li
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-start gap-2 text-white/70"
                          >
                            <span className="text-indigo-400 mt-1">•</span>
                            <span>{objective}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>

                    {lesson.vocabulary.length > 0 && (
                      <div>
                        <h4 className="text-white/80 font-semibold mb-3">Key Terms</h4>
                        <div className="space-y-3">
                          {lesson.vocabulary.map((term, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.5 + index * 0.1 }}
                              className="bg-white/10 p-3 rounded-lg"
                            >
                              <div className="text-indigo-400 font-medium">{term.term}</div>
                              <div className="text-white/60 text-sm mt-1">{term.definition}</div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Main Content - Whiteboard */}
                <div className="flex-1 p-6 flex flex-col">
                  <div className="relative flex-1 bg-[#FFFBF5] rounded-lg shadow-2xl overflow-hidden">
                    <canvas
                      ref={canvasRef}
                      width={800}
                      height={600}
                      className="w-full h-full"
                    />
                    {isSpeaking && (
                      <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-indigo-500/20 text-indigo-300 rounded-full">
                        <Volume2 className="w-4 h-4 animate-pulse" />
                        <span className="text-sm">Speaking...</span>
                      </div>
                    )}
                  </div>

                  {/* Lesson Navigation */}
                  <motion.div 
                    className="mt-4 flex justify-between items-center"
                    initial={{ y: 50 }}
                    animate={{ y: 0 }}
                  >
                    <button
                      onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                      disabled={currentStep === 0 || isDrawing}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg disabled:opacity-50"
                    >
                      <ChevronLeft className="w-5 h-5" />
                      Previous
                    </button>
                    <div className="text-white/60">
                      Step {currentStep + 1} of {lesson.steps.length}
                    </div>
                    <button
                      onClick={() => setCurrentStep(Math.min(lesson.steps.length - 1, currentStep + 1))}
                      disabled={currentStep === lesson.steps.length - 1 || isDrawing}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg disabled:opacity-50"
                    >
                      Next
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LearningAssistant;