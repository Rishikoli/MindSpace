'use client';

import { useState, useEffect, useCallback } from 'react';
import { AMBIENT_SOUNDS, audioManager } from '@/utils/audio';

interface TimerSettings {
  workDuration: number;
  breakDuration: number;
  longBreakDuration: number;
  sessionsBeforeLongBreak: number;
}

type TimerState = 'work' | 'break' | 'longBreak';

export default function FocusMode() {
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [timerState, setTimerState] = useState<TimerState>('work');
  const [completedSessions, setCompletedSessions] = useState(0);
  const [settings, setSettings] = useState<TimerSettings>({
    workDuration: 25,
    breakDuration: 5,
    longBreakDuration: 15,
    sessionsBeforeLongBreak: 4,
  });
  const [showSettings, setShowSettings] = useState(false);
  const [ambientSound, setAmbientSound] = useState<string | null>(null);
  const [volume, setVolume] = useState(50);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const savedName = localStorage.getItem('mindspace_user_name');
    if (savedName) {
      setUserName(savedName);
    }
  }, []);

  // Reset timer when settings change
  useEffect(() => {
    if (!isRunning) {
      if (timerState === 'work') {
        setTimeLeft(settings.workDuration * 60);
      } else if (timerState === 'break') {
        setTimeLeft(settings.breakDuration * 60);
      } else {
        setTimeLeft(settings.longBreakDuration * 60);
      }
    }
  }, [settings, timerState, isRunning]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const handleTimerComplete = useCallback(() => {
    const notification = new Audio('/notification.mp3');
    notification.play();

    if (timerState === 'work') {
      const newCompletedSessions = completedSessions + 1;
      setCompletedSessions(newCompletedSessions);
      
      if (newCompletedSessions % settings.sessionsBeforeLongBreak === 0) {
        setTimerState('longBreak');
        setTimeLeft(settings.longBreakDuration * 60);
      } else {
        setTimerState('break');
        setTimeLeft(settings.breakDuration * 60);
      }
    } else {
      setTimerState('work');
      setTimeLeft(settings.workDuration * 60);
    }
    setIsRunning(false);
  }, [timerState, completedSessions, settings]);

  const handleSettingsChange = (key: keyof TimerSettings, value: number) => {
    if (value > 0) {
      setSettings(prev => ({
        ...prev,
        [key]: value
      }));
    }
  };

  const handleAmbientSound = (soundName: string) => {
    if (ambientSound === soundName) {
      audioManager.stop();
      setAmbientSound(null);
    } else {
      const sound = AMBIENT_SOUNDS.find(s => s.name === soundName);
      if (sound) {
        audioManager.setVolume(volume / 100);
        audioManager.play(sound);
        setAmbientSound(soundName);
      }
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    audioManager.setVolume(newVolume / 100);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = (): number => {
    const totalSeconds = timerState === 'work' 
      ? settings.workDuration * 60 
      : timerState === 'break' 
        ? settings.breakDuration * 60 
        : settings.longBreakDuration * 60;
    return ((totalSeconds - timeLeft) / totalSeconds) * 100;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-gray-900">
          {userName ? `${userName}'s` : 'Your'} Focus Mode
        </h1>
        <p className="text-gray-700 mb-8">Use the Pomodoro Technique to maintain focus and take regular breaks</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold mb-2 text-gray-900">
                {timerState === 'work' ? 'Focus Time' : timerState === 'break' ? 'Short Break' : 'Long Break'}
              </h2>
              <div className="relative w-48 h-48 mx-auto mb-4">
                <div className="absolute inset-0 rounded-full border-8 border-gray-100"></div>
                <div 
                  className="absolute inset-0 rounded-full border-8 border-blue-600 transition-all duration-1000"
                  style={{ 
                    clipPath: `polygon(50% 50%, -50% -50%, ${getProgressPercentage()}% -50%)`,
                    transform: `rotate(${getProgressPercentage() * 3.6}deg)`
                  }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl font-bold text-gray-900">{formatTime(timeLeft)}</span>
                </div>
              </div>
              <div className="space-x-4">
                <button
                  onClick={() => setIsRunning(!isRunning)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors"
                >
                  {isRunning ? 'Pause' : 'Start'}
                </button>
                <button
                  onClick={() => {
                    setIsRunning(false);
                    setTimeLeft(settings.workDuration * 60);
                    setTimerState('work');
                  }}
                  className="bg-gray-200 text-gray-800 px-6 py-2 rounded-full hover:bg-gray-300 transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>

            <div className="text-center">
              <p className="text-gray-800 mb-2">Completed Sessions: {completedSessions}</p>
              <div className="flex justify-center space-x-2">
                {Array.from({ length: settings.sessionsBeforeLongBreak }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full ${
                      i < completedSessions % settings.sessionsBeforeLongBreak
                        ? 'bg-blue-600'
                        : 'bg-gray-200'
                    }`}
                  ></div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Ambient Sounds</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-800 mb-1">
                  Volume
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => handleVolumeChange(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {AMBIENT_SOUNDS.map((sound) => (
                  <button
                    key={sound.name}
                    onClick={() => handleAmbientSound(sound.name)}
                    className={`p-4 rounded-lg text-center transition-colors ${
                      ambientSound === sound.name
                        ? 'bg-blue-50 border-2 border-blue-600 text-gray-900'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-800'
                    }`}
                  >
                    <div className="text-2xl mb-2">{sound.icon}</div>
                    <div className="font-medium mb-1">{sound.name}</div>
                    <div className="text-sm text-gray-600">{sound.description}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Timer Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">
                    Work Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={settings.workDuration}
                    onChange={(e) => handleSettingsChange('workDuration', Number(e.target.value))}
                    className="w-full p-2 border rounded text-gray-900"
                    min="1"
                    max="60"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">
                    Break Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={settings.breakDuration}
                    onChange={(e) => handleSettingsChange('breakDuration', Number(e.target.value))}
                    className="w-full p-2 border rounded text-gray-900"
                    min="1"
                    max="30"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">
                    Long Break Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={settings.longBreakDuration}
                    onChange={(e) => handleSettingsChange('longBreakDuration', Number(e.target.value))}
                    className="w-full p-2 border rounded text-gray-900"
                    min="1"
                    max="60"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">
                    Sessions Before Long Break
                  </label>
                  <input
                    type="number"
                    value={settings.sessionsBeforeLongBreak}
                    onChange={(e) => handleSettingsChange('sessionsBeforeLongBreak', Number(e.target.value))}
                    className="w-full p-2 border rounded text-gray-900"
                    min="1"
                    max="10"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-900">Focus Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">The Pomodoro Technique</h4>
              <p className="text-gray-800">
                1. Work for 25 minutes
                2. Take a 5-minute break
                3. After 4 sessions, take a longer 15-minute break
                4. Repeat the cycle
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Best Practices</h4>
              <ul className="text-gray-800 list-disc list-inside">
                <li>Find a quiet workspace</li>
                <li>Stay hydrated</li>
                <li>Use ambient sounds to maintain focus</li>
                <li>Take regular breaks to prevent burnout</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
