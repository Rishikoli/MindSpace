'use client';

import { useState } from 'react';

interface StudyTask {
  id: string;
  title: string;
  duration: number;
  completed: boolean;
}

interface CustomStudyPlanProps {
  subject: string;
}

export default function CustomStudyPlan({ subject }: CustomStudyPlanProps) {
  const [tasks, setTasks] = useState<StudyTask[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`study_plan_${subject}`);
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [newTask, setNewTask] = useState({ title: '', duration: 30 });

  const addTask = () => {
    if (!newTask.title.trim()) return;

    const task: StudyTask = {
      id: Date.now().toString(),
      title: newTask.title,
      duration: newTask.duration,
      completed: false
    };

    const updatedTasks = [...tasks, task];
    setTasks(updatedTasks);
    localStorage.setItem(`study_plan_${subject}`, JSON.stringify(updatedTasks));
    setNewTask({ title: '', duration: 30 });
  };

  const toggleTask = (taskId: string) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    localStorage.setItem(`study_plan_${subject}`, JSON.stringify(updatedTasks));
  };

  const deleteTask = (taskId: string) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
    localStorage.setItem(`study_plan_${subject}`, JSON.stringify(updatedTasks));
  };

  const totalDuration = tasks.reduce((acc, task) => acc + task.duration, 0);
  const completedDuration = tasks
    .filter(task => task.completed)
    .reduce((acc, task) => acc + task.duration, 0);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Custom Study Plan</h3>
      
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <input
            type="text"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            placeholder="Enter task title"
            className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          />
          <select
            value={newTask.duration}
            onChange={(e) => setNewTask({ ...newTask, duration: parseInt(e.target.value) })}
            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          >
            <option value="15">15 min</option>
            <option value="30">30 min</option>
            <option value="45">45 min</option>
            <option value="60">60 min</option>
          </select>
          <button
            onClick={addTask}
            disabled={!newTask.title.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors disabled:bg-gray-400"
          >
            Add Task
          </button>
        </div>

        <div className="mb-4">
          <div className="text-sm font-medium text-gray-700">
            Progress: {completedDuration}/{totalDuration} minutes
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all"
              style={{ width: `${totalDuration ? (completedDuration / totalDuration) * 100 : 0}%` }}
            ></div>
          </div>
        </div>

        {tasks.length > 0 ? (
          <ul className="space-y-3">
            {tasks.map(task => (
              <li
                key={task.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                    className="w-5 h-5 text-blue-600"
                  />
                  <span className={task.completed ? 'line-through text-gray-500' : 'text-gray-900 font-medium'}>
                    {task.title} ({task.duration} min)
                  </span>
                </div>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center py-4">
            No tasks added yet. Create your first task above!
          </p>
        )}
      </div>
    </div>
  );
}
