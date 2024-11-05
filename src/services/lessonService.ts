import { GoogleGenerativeAI } from '@google/generative-ai';

export interface DrawStep {
  type: 'text' | 'line' | 'circle';
  x: number;
  y: number;
  text?: string;
  color: string;
  thickness?: number;
  width?: number;
  points?: { x: number; y: number }[];
  delay: number;
  duration: number;
}

export interface LessonStep {
  content: string;
  drawSteps: DrawStep[];
}

export interface VocabularyTerm {
  term: string;
  definition: string;
}

export interface Lesson {
  topic: string;
  gradeLevel: string;
  subject: string;
  learningObjectives: string[];
  vocabulary: VocabularyTerm[];
  steps: LessonStep[];
}

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const DEFAULT_LESSON: Lesson = {
  topic: '',
  gradeLevel: '',
  subject: '',
  learningObjectives: [],
  vocabulary: [],
  steps: [{
    content: 'Loading lesson content...',
    drawSteps: [{
      type: 'text',
      x: 100,
      y: 100,
      text: 'Preparing lesson...',
      color: '#000000',
      thickness: 2,
      delay: 0,
      duration: 1000
    }]
  }]
};

export async function generateLesson(
  subject: 'math' | 'science' | 'ela',
  topic: string,
  gradeLevel: string
): Promise<Lesson> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Act as an expert teacher creating a structured 5-minute lesson. Topic: ${topic} for ${subject} at grade ${gradeLevel}.

Response format must be valid JSON matching this structure exactly:
{
  "topic": "${topic}",
  "gradeLevel": "${gradeLevel}",
  "subject": "${subject}",
  "learningObjectives": [
    "objective 1",
    "objective 2",
    "objective 3"
  ],
  "vocabulary": [
    {
      "term": "example term",
      "definition": "example definition"
    }
  ],
  "steps": [
    {
      "content": "Step explanation",
      "drawSteps": [
        {
          "type": "text",
          "x": 100,
          "y": 100,
          "text": "Example text",
          "color": "#000000",
          "thickness": 2,
          "delay": 500,
          "duration": 1000
        }
      ]
    }
  ]
}

Important:
- Keep JSON structure exact
- Include 3-5 learning objectives
- Break lesson into 4-6 clear steps
- Each step should have 2-3 drawing actions
- Use coordinates between 0-800 for x and 0-600 for y
- Use valid hex colors
- Keep delays between 0-2000ms
- Ensure all JSON syntax is valid`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean the response to ensure valid JSON
    const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
    
    try {
      const lesson = JSON.parse(cleanedText);
      return validateAndProcessLesson(lesson);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      console.error('Raw Text:', cleanedText);
      return {
        ...DEFAULT_LESSON,
        topic,
        gradeLevel,
        subject
      };
    }
  } catch (error) {
    console.error('Lesson Generation Error:', error);
    return {
      ...DEFAULT_LESSON,
      topic,
      gradeLevel,
      subject
    };
  }
}

function validateAndProcessLesson(lesson: any): Lesson {
  const processedLesson: Lesson = {
    topic: lesson.topic || '',
    gradeLevel: lesson.gradeLevel || '',
    subject: lesson.subject || '',
    learningObjectives: [],
    vocabulary: [],
    steps: []
  };

  // Validate and process learning objectives
  if (Array.isArray(lesson.learningObjectives)) {
    processedLesson.learningObjectives = lesson.learningObjectives
      .filter((obj: any) => typeof obj === 'string')
      .map((obj: string) => obj.trim());
  }

  // Validate and process vocabulary
  if (Array.isArray(lesson.vocabulary)) {
    processedLesson.vocabulary = lesson.vocabulary
      .filter((term: any) => term && typeof term.term === 'string' && typeof term.definition === 'string')
      .map((term: VocabularyTerm) => ({
        term: term.term.trim(),
        definition: term.definition.trim()
      }));
  }

  // Validate and process steps
  if (Array.isArray(lesson.steps)) {
    processedLesson.steps = lesson.steps
      .filter((step: any) => step && typeof step.content === 'string')
      .map((step: any) => ({
        content: step.content.trim(),
        drawSteps: Array.isArray(step.drawSteps) ? step.drawSteps
          .filter((drawStep: any) => drawStep && drawStep.type)
          .map((drawStep: any) => ({
            type: ['text', 'line', 'circle'].includes(drawStep.type) ? drawStep.type : 'text',
            x: Number(drawStep.x) || 0,
            y: Number(drawStep.y) || 0,
            text: drawStep.text || '',
            color: /^#[0-9A-F]{6}$/i.test(drawStep.color) ? drawStep.color : '#000000',
            thickness: Number(drawStep.thickness) || 2,
            width: Number(drawStep.width) || 50,
            points: Array.isArray(drawStep.points) ? drawStep.points : [],
            delay: Math.min(Math.max(Number(drawStep.delay) || 500, 0), 2000),
            duration: Math.min(Math.max(Number(drawStep.duration) || 1000, 100), 3000)
          })) : []
      }));
  }

  // Ensure at least one step exists
  if (processedLesson.steps.length === 0) {
    processedLesson.steps = DEFAULT_LESSON.steps;
  }

  return processedLesson;
}