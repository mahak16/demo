import { useState } from 'react';
import { GraduationCap } from 'lucide-react';
import TopicAssessment from './components/TopicAssessment';
import StudyPlanDisplay from './components/StudyPlanDisplay';
import type { Topic, StudyPlan } from './types';

function App() {
  const [studyPlan, setStudyPlan] = useState<StudyPlan | null>(null);

  const generateStudyPlan = async (topics: Topic[]) => {
    try {
      const response = await fetch('/api/server/generatePlan.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topics }),
      });

      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setStudyPlan(data);
    } catch (err) {
      console.error('API error:', err);
      alert('Something went wrong while generating the study plan.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-5xl mx-auto px-4 py-6 flex items-center gap-2">
          <GraduationCap className="text-blue-500" size={32} />
          <h1 className="text-3xl font-bold text-gray-900">AI Study Planner</h1>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-8">
        {!studyPlan ? (
          <div className="bg-white p-6 shadow rounded-lg">
            <h2 className="text-2xl font-bold mb-6">Assess Your Topics</h2>
            <TopicAssessment onSubmit={generateStudyPlan} />
          </div>
        ) : (
          <StudyPlanDisplay plan={studyPlan} />
        )}
      </main>
    </div>
  );
}

export default App;
