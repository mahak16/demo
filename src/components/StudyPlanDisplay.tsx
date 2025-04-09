'use client';
import { Clock, Brain, AlertTriangle } from 'lucide-react';
import type { StudyPlan, Topic } from '../types';

export default function StudyPlanDisplay({ plan }: { plan: StudyPlan }) {
  const getPriorityColor = (priority: Topic['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Your Personalized Study Plan</h2>
        <div className="flex items-center gap-2 mb-4">
          <Clock className="text-blue-500" />
          <span className="text-lg">Total Study Time: {plan.totalHours} hours</span>
        </div>

        <h3 className="text-xl font-semibold">AI Recommendations</h3>
        <ul className="list-disc pl-5 space-y-1">
          {plan.recommendations.map((rec, i) => (
            <li key={i} className="text-gray-700">{rec}</li>
          ))}
        </ul>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {plan.topics.map(topic => (
          <div key={topic.id} className="bg-white p-4 rounded shadow">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-lg">{topic.name}</h3>
              <span className={`${getPriorityColor(topic.priority)} flex items-center gap-1`}>
                <AlertTriangle size={16} />
                {topic.priority} priority
              </span>
            </div>
            <div className="text-sm text-gray-600">
              <div className="flex items-center mb-2">
                <Brain size={16} className="text-blue-500 mr-2" />
                Confidence: {topic.confidence}%
              </div>
              <div className="flex items-center">
                <Clock size={16} className="text-blue-500 mr-2" />
                Time spent: {topic.timeSpent} hours
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
