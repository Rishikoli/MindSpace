import AIStudyCoach from '@/components/AIStudyCoach';

export default function AICoach() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">AI Study Coach</h1>
        <p className="text-gray-600">Get personalized learning recommendations</p>
        
        {/* AI Coach Component */}
        <div className="mt-8">
          <AIStudyCoach />
        </div>
      </div>
    </main>
  );
}
