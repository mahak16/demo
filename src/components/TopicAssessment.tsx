'use client';
import { useState } from 'react';
import { PlusCircle, Brain, Clock } from 'lucide-react';
import type { Topic } from '../types';

export default function TopicAssessment({ onSubmit }: { onSubmit: (topics: Topic[]) => void }) {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [newTopic, setNewTopic] = useState('');

  const addTopic = () => {
    if (!newTopic.trim()) return;
    const topic: Topic = {
      id: Date.now().toString(),
      name: newTopic,
      confidence: 50,
      timeSpent: 0,
      priority: 'medium'
    };
    setTopics([...topics, topic]);
    setNewTopic('');
  };

  const updateConfidence = (id: string, confidence: number) => {
    setTopics(topics.map(topic =>
      topic.id === id ? { ...topic, confidence } : topic
    ));
  };

  const updateTimeSpent = (id: string, timeSpent: number) => {
    setTopics(topics.map(topic =>
      topic.id === id ? { ...topic, timeSpent } : topic
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <input
          type="text"
          value={newTopic}
          onChange={(e) => setNewTopic(e.target.value)}
          placeholder="Enter a topic..."
          className="flex-1 px-4 py-2 rounded-lg border border-gray-300"
        />
        <button onClick={addTopic} className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <PlusCircle size={20} /> Add Topic
        </button>
      </div>

      <div className="space-y-4">
        {topics.map(topic => (
          <div key={topic.id} className="bg-white p-4 shadow rounded-lg">
            <h3 className="font-semibold text-lg">{topic.name}</h3>
            <div className="mt-3">
              <label>
                <Brain size={18} className="inline text-blue-500 mr-2" />
                Confidence: {topic.confidence}%
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={topic.confidence}
                  onChange={(e) => updateConfidence(topic.id, Number(e.target.value))}
                  className="w-full"
                />
              </label>
              <label className="mt-2 block">
                <Clock size={18} className="inline text-blue-500 mr-2" />
                Time Spent (hrs):
                <input
                  type="number"
                  min="0"
                  value={topic.timeSpent}
                  onChange={(e) => updateTimeSpent(topic.id, Number(e.target.value))}
                  className="ml-2 px-2 py-1 border rounded"
                />
              </label>
            </div>
          </div>
        ))}
      </div>

      {topics.length > 0 && (
        <button onClick={() => onSubmit(topics)} className="w-full py-3 bg-green-600 text-white rounded-lg">
          Generate Study Plan
        </button>
      )}
    </div>
  );
}
