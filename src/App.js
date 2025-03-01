import React, { useState } from 'react';
import Questionnaire from './components/Questionnaire';
import Recommendation from './components/Recommendation';
import './App.css';

function App() {
  const [answers, setAnswers] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleQuestionnaireComplete = (questionnaireAnswers) => {
    setAnswers(questionnaireAnswers);
    setIsCompleted(true);
  };

  const handleBackToQuestionnaire = () => {
    setIsCompleted(false);
  };

  return (
    <div className="App">
      <div className="app-container">
        {!isCompleted ? (
          <Questionnaire onComplete={handleQuestionnaireComplete} initialAnswers={answers} />
        ) : (
          <Recommendation answers={answers} onBackClick={handleBackToQuestionnaire} />
        )}
      </div>
    </div>
  );
}

export default App;
