import React, { useState, useCallback, useEffect } from 'react';
import { questionnaire } from '../data/questionnaireData';
import { getRandomScenario, generateRandomAnswers, getScenarioByName } from '../utils/testScenarios';
import './Questionnaire.css';

const Questionnaire = ({ onComplete, initialAnswers }) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(initialAnswers || {});
  const [otherValues, setOtherValues] = useState({});
  const [isOnConditionalQuestion, setIsOnConditionalQuestion] = useState(false);
  const [conditionalParentId, setConditionalParentId] = useState(null);
  const [conditionalIndex, setConditionalIndex] = useState(-1);
  const [isPageNavigatorOpen, setIsPageNavigatorOpen] = useState(false);
  const [currentTestScenario, setCurrentTestScenario] = useState(null);
  const [selectedScenario, setSelectedScenario] = useState('');

  // Available scenarios for the dropdown
  const availableScenarios = [
    { name: 'Bhumi NGO Scenario', label: 'Bhumi NGO' },
    { name: 'Educational Institution Scenario', label: 'Educational Institution' },
    { name: 'Rural Development Scenario', label: 'Rural Development Trust' },
    { name: 'Urban Healthcare Scenario', label: 'Urban Healthcare Initiative' },
    { name: 'Random Data', label: 'Generate Random Data' },
    { name: 'Random Scenario', label: 'Random Scenario' }
  ];

  // Initialize answers from initialAnswers prop when it changes
  useEffect(() => {
    if (initialAnswers) {
      setAnswers(initialAnswers);
    }
  }, [initialAnswers]);

  // Define isQuestionVisible function first since it's used by other functions
  const isQuestionVisible = useCallback((questionId, sectionIndex, questionIndex) => {
    // Base case: always show first question of each section
    if (questionIndex === 0) return true;
    
    // Skip questions based on previous answers
    switch (questionId) {
      // Skip email frequency questions if not using email marketing
      case 'ngoEmailFrequency':
        return answers.ngoEmailMarketing === 'yes';
      
      // Skip online platform details if not using online platforms
      case 'ngoOnlinePlatformsUsed':
        return answers.ngoOnlinePlatforms === 'yes';
      
      // Skip volunteer-specific questions if no volunteers
      case 'ngoVolunteersCount':
      case 'ngoVolunteerPercentage':
      case 'ngoVolunteerFundraisingActivities':
        return answers.ngoVolunteers === 'yes';
      
      // Skip corporate/foundation relation details if no such relations
      case 'ngoCorporatePartnersCount':
        return answers.ngoCorporateRelations === 'yes';
      case 'ngoFoundationCount':
        return answers.ngoFoundationRelations === 'yes';
      case 'ngoGovernmentFundingCount':
        return answers.ngoGovernmentRelations === 'yes';
      
      // Skip fundraising staff count if no fundraising department
      case 'ngoFundraisingStaffCount':
        return answers.ngoFundraisingDept === 'yes';
      
      // Skip digital budget amount if no digital budget
      case 'ngoDigitalBudgetAmount':
        return answers.ngoDigitalBudget === 'yes';
      
      // Skip event details if no events
      case 'ngoEventCount':
      case 'ngoEventTypes':
        return answers.ngoEventExperience === 'yes';
      
      // Skip ethical considerations details if no ethical concerns
      case 'ngoEthicalDetails':
        return answers.ngoEthicalConsiderations === 'yes';
      
      // Skip social media platforms if not on social media
      case 'ngoSocialMediaPlatforms':
        return answers.ngoSocialMedia === 'yes';
      
      // Skip venue details if no venue access
      case 'ngoEventVenueDetails':
        return answers.ngoEventVenues === 'yes';
      
      // Skip virtual event types if no virtual events
      case 'ngoVirtualEventTypes':
        return answers.ngoVirtualEvents === 'yes';
      
      // Show FCRA process stage only if in process of obtaining FCRA
      case 'ngoFCRAProcessStage':
        return answers.ngoComplianceInProcess && 
               answers.ngoComplianceInProcess.includes('fcra');
      
      // Show 501c type only if in process of obtaining 501c
      case 'ngo501cProcessType':
        return answers.ngoComplianceInProcess && 
               answers.ngoComplianceInProcess.includes('501c');
      
      // By default, show the question
      default:
        return true;
    }
  }, [answers]);

  // Enhance isSectionVisible with more comprehensive conditional logic
  const isSectionVisible = useCallback((sectionIndex) => {
    if (sectionIndex === 0) return true; // First section always visible
    
    const complianceStatus = answers.ngoComplianceStatus || [];
    const registrationType = answers.ngoRegistrationType;
    const foreignFundingIntent = answers.ngoForeignFundingIntent;
    const corporateRelations = answers.ngoCorporateRelations;
    const eventExperience = answers.ngoEventExperience;
    const hasVolunteers = answers.ngoVolunteers;
    
    // Skip CSR related sections if no CSR-1
    if ((sectionIndex === 5 || sectionIndex === 6) && 
        !complianceStatus.includes('csr1') && 
        corporateRelations !== 'yes') {
      return false;
    }

    // Skip international sections if no FCRA and no intent
    if (sectionIndex === 8 && 
        !complianceStatus.includes('fcra') && 
        foreignFundingIntent !== 'yes') {
      return false;
    }

    // Skip endowment sections for non-educational institutions
    if (sectionIndex === 7 && 
        registrationType !== 'educational' && 
        registrationType !== 'hospital') {
      return false;
    }

    // Skip volunteer capacity section if no volunteers
    if (sectionIndex === 4 && hasVolunteers !== 'yes') {
      return false;
    }

    // Skip event experience section if no event experience and not interested
    if (sectionIndex === 5 && 
        eventExperience !== 'yes' && 
        (!answers.ngoFundraisingGoals || !answers.ngoFundraisingGoals.includes('events'))) {
      return false;
    }

    return true;
  }, [answers]);

  // Define getTotalPages with properly defined dependencies
  const getTotalPages = useCallback(() => {
    let totalPages = 0;

    questionnaire.forEach((section, sectionIndex) => {
      if (!isSectionVisible(sectionIndex)) return;

      section.questions.forEach((question, questionIndex) => {
        if (!isQuestionVisible(question.id, sectionIndex, questionIndex)) return;

        totalPages++;

        if (question.conditionalQuestions && answers[question.id]) {
          const conditionals = question.conditionalQuestions[answers[question.id]];
          if (conditionals) {
            totalPages += conditionals.length;
          }
        }
      });
    });

    return totalPages;
  }, [answers, isSectionVisible, isQuestionVisible]);

  // Calculate completion percentage - updated to consider only visible questions
  const calculateProgress = useCallback(() => {
    let totalVisibleQuestions = 0;
    let answeredVisibleQuestions = 0;
    
    questionnaire.forEach((section, sectionIndex) => {
      // Skip invisible sections
      if (!isSectionVisible(sectionIndex)) return;
      
      section.questions.forEach((q, questionIndex) => {
        // Skip invisible questions
        if (!isQuestionVisible(q.id, sectionIndex, questionIndex)) return;
        
        totalVisibleQuestions++;
        if (answers[q.id]) answeredVisibleQuestions++;
        
        // Count visible conditional questions
        if (q.conditionalQuestions && answers[q.id]) {
          const conditionals = q.conditionalQuestions[answers[q.id]];
          if (conditionals) {
            totalVisibleQuestions += conditionals.length;
            // Count answered conditionals
            conditionals.forEach(cq => {
              if (answers[cq.id]) answeredVisibleQuestions++;
            });
          }
        }
      });
    });
    
    return totalVisibleQuestions === 0 ? 0 : Math.round((answeredVisibleQuestions / totalVisibleQuestions) * 100);
  }, [answers, isSectionVisible, isQuestionVisible]);

  // Check if a section is complete
  const isSectionComplete = useCallback((sectionIndex) => {
    const section = questionnaire[sectionIndex];
    return section.questions.every(question => {
      if (!question.required) return true;
      if (!answers[question.id]) return false;
      
      // Check conditional questions if they exist and should be shown
      if (question.conditionalQuestions && answers[question.id]) {
        const conditionals = question.conditionalQuestions[answers[question.id]];
        if (conditionals) {
          return conditionals.every(q => !q.required || answers[q.id]);
        }
      }
      return true;
    });
  }, [answers]);

  // Helper function to count total required questions
  const getTotalRequiredQuestions = useCallback(() => {
    let total = 0;
    
    questionnaire.forEach((section, sectionIndex) => {
      // Skip invisible sections
      if (!isSectionVisible(sectionIndex)) return;
      
      section.questions.forEach((q, questionIndex) => {
        // Skip invisible questions
        if (!isQuestionVisible(q.id, sectionIndex, questionIndex)) return;
        
        if (q.required) total++;
        
        // Count required conditional questions if they should be shown
        if (q.conditionalQuestions && answers[q.id]) {
          const conditionals = q.conditionalQuestions[answers[q.id]];
          if (conditionals) {
            conditionals.forEach(cq => {
              if (cq.required) total++;
            });
          }
        }
      });
    });
    
    return total;
  }, [answers, isSectionVisible, isQuestionVisible]);

  // Update getCurrentPage to only count visible questions
  const getCurrentPage = useCallback(() => {
    let page = 1;
    
    // Count pages in previous sections
    for (let sectionIndex = 0; sectionIndex < currentSection; sectionIndex++) {
      // Skip invisible sections
      if (!isSectionVisible(sectionIndex)) continue;
      
      // Count visible questions in this section
      const section = questionnaire[sectionIndex];
      for (let questionIndex = 0; questionIndex < section.questions.length; questionIndex++) {
        const question = section.questions[questionIndex];
        
        // Skip invisible questions
        if (!isQuestionVisible(question.id, sectionIndex, questionIndex)) continue;
        
        page++;
        
        // Add conditional questions if they should be shown
        if (question.conditionalQuestions && answers[question.id]) {
          const conditionals = question.conditionalQuestions[answers[question.id]];
          if (conditionals) {
            page += conditionals.length;
          }
        }
      }
    }
    
    // Count visible questions in the current section up to the current question
    for (let questionIndex = 0; questionIndex < currentQuestion; questionIndex++) {
      const question = questionnaire[currentSection].questions[questionIndex];
      
      // Skip invisible questions
      if (!isQuestionVisible(question.id, currentSection, questionIndex)) continue;
      
      page++;
      
      // Add conditional questions if they should be shown
      if (question.conditionalQuestions && answers[question.id]) {
        const conditionals = question.conditionalQuestions[answers[question.id]];
        if (conditionals) {
          page += conditionals.length;
        }
      }
    }
    
    // Add the current question
    if (!isOnConditionalQuestion) {
      page++;
    } else {
      // Add parent question + conditional index
      page++;
      page += conditionalIndex;
    }
    
    // Adjust for 0-based index
    return page - 1;
  }, [currentSection, currentQuestion, isOnConditionalQuestion, conditionalIndex, answers, isSectionVisible, isQuestionVisible]);

  // Define isPageAccessible as a useCallback to handle visibility logic
  const isPageAccessible = useCallback((pageNum) => {
    // Always allow access if questionnaire is substantially complete
    if (Object.keys(answers).length >= getTotalRequiredQuestions()) {
      return true;
    }
    
    // Allow backwards navigation
    const currentPage = getCurrentPage();
    if (pageNum <= currentPage) {
      return true;
    }

    // For forward navigation, simulate the journey to the target page
    // to ensure all required questions on the way are answered
    let simulatedPage = 1;
    
    // Iterate through visible sections and questions
    for (let sectionIndex = 0; sectionIndex < questionnaire.length; sectionIndex++) {
      // Skip invisible sections
      if (!isSectionVisible(sectionIndex)) continue;
      
      const section = questionnaire[sectionIndex];
      
      for (let questionIndex = 0; questionIndex < section.questions.length; questionIndex++) {
        const question = section.questions[questionIndex];
        
        // Skip invisible questions
        if (!isQuestionVisible(question.id, sectionIndex, questionIndex)) continue;
        
        // Check if we've reached our target page
        if (simulatedPage === pageNum) {
          return true;
        }
        
        // Check if this question is required and unanswered
        if (simulatedPage < pageNum && question.required && !answers[question.id]) {
          return false;
        }
        
        simulatedPage++;
        
        // Handle conditional questions
        if (question.conditionalQuestions && answers[question.id]) {
          const conditionals = question.conditionalQuestions[answers[question.id]];
          
          if (conditionals) {
            for (let i = 0; i < conditionals.length; i++) {
              const cq = conditionals[i];
              
              // Check if we've reached our target page within conditionals
              if (simulatedPage === pageNum) {
                return true;
              }
              
              // Check if this conditional question is required and unanswered
              if (simulatedPage < pageNum && cq.required && !answers[cq.id]) {
                return false;
              }
              
              simulatedPage++;
            }
          }
        }
      }
    }
    
    return false;
  }, [answers, getCurrentPage, getTotalRequiredQuestions, isSectionVisible, isQuestionVisible]);

  // Update navigateToPage to handle adaptive questioning
  const navigateToPage = (pageNum) => {
    // Validate page number is within range
    const totalPages = getTotalPages();
    if (pageNum < 1 || pageNum > totalPages) {
      console.error('Invalid page number:', pageNum, 'totalPages:', totalPages);
      return;
    }

    // Add debug logging
    console.log('Navigation Debug:', {
      targetPage: pageNum,
      currentPage: getCurrentPage(),
      totalPages: getTotalPages(),
      answeredQuestions: Object.keys(answers).length,
      requiredQuestions: getTotalRequiredQuestions(),
      isAccessible: isPageAccessible(pageNum),
      currentSection,
      currentQuestion,
      isOnConditionalQuestion,
      conditionalParentId,
      conditionalIndex
    });

    if (!isPageAccessible(pageNum)) {
      alert('Please complete the previous questions first.');
      return;
    }

    // Reset conditional question state
    setIsOnConditionalQuestion(false);
    setConditionalParentId(null);
    setConditionalIndex(-1);

    // Find the section and question that corresponds to this page number
    let currentCountedPage = 0;
    let targetFound = false;
    
    // Iterate through visible sections and questions to find target
    outer: for (let sectionIndex = 0; sectionIndex < questionnaire.length; sectionIndex++) {
      // Skip invisible sections
      if (!isSectionVisible(sectionIndex)) continue;
      
      const section = questionnaire[sectionIndex];
      
      for (let questionIndex = 0; questionIndex < section.questions.length; questionIndex++) {
        const question = section.questions[questionIndex];
        
        // Skip invisible questions
        if (!isQuestionVisible(question.id, sectionIndex, questionIndex)) continue;
        
        currentCountedPage++;
        
        // Check if this is our target page
        if (currentCountedPage === pageNum) {
          setCurrentSection(sectionIndex);
          setCurrentQuestion(questionIndex);
          targetFound = true;
          break outer;
        }
        
        // Check if target is within conditional questions
        if (question.conditionalQuestions && 
            answers[question.id] && 
            question.conditionalQuestions[answers[question.id]]) {
            
          const conditionals = question.conditionalQuestions[answers[question.id]];
          
          if (conditionals) {
            // Check each conditional question
            for (let conIndex = 0; conIndex < conditionals.length; conIndex++) {
              currentCountedPage++;
              
              if (currentCountedPage === pageNum) {
                setCurrentSection(sectionIndex);
                setCurrentQuestion(questionIndex);
                setIsOnConditionalQuestion(true);
                setConditionalParentId(question.id);
                setConditionalIndex(conIndex);
                targetFound = true;
                break outer;
              }
            }
          }
        }
      }
    }
    
    // If we didn't find the target page, navigate to the closest available page
    if (!targetFound) {
      console.warn('Target page not found in navigation, defaulting to first page');
      setCurrentSection(0);
      setCurrentQuestion(0);
    }
    
    setIsPageNavigatorOpen(false);
  };

  const handleSectionClick = (sectionIndex) => {
    // Only allow navigation to completed sections or the current section
    if (sectionIndex <= currentSection) {
      setCurrentSection(sectionIndex);
      setCurrentQuestion(0);
      setIsOnConditionalQuestion(false);
      setConditionalParentId(null);
      setConditionalIndex(-1);
    }
  };

  const handleInputChange = (questionId, value) => {
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionId]: value
    }));
  };

  const handleOtherChange = (questionId, value) => {
    setOtherValues(prevValues => ({
      ...prevValues,
      [questionId]: value
    }));
  };

  const handleNext = () => {
    try {
      const currentSectionData = questionnaire[currentSection];
      const questionData = getCurrentQuestion();
      
      if (!questionData) {
        // Safety check - if question data is undefined, move to next section
        if (currentSection < questionnaire.length - 1) {
          setCurrentSection(currentSection + 1);
          setCurrentQuestion(0);
          setIsOnConditionalQuestion(false);
          setConditionalParentId(null);
          setConditionalIndex(-1);
        } else {
          onComplete(answers);
        }
        return;
      }
      
      // Check if current question is valid
      if (questionData.required && !answers[questionData.id]) {
        alert('Please answer this question before proceeding.');
        return;
      }

      // If we're on a conditional question
      if (isOnConditionalQuestion && conditionalParentId) {
        const parentQuestion = currentSectionData.questions.find(q => q.id === conditionalParentId);
        if (!parentQuestion || 
            !parentQuestion.conditionalQuestions || 
            !answers[conditionalParentId] || 
            !parentQuestion.conditionalQuestions[answers[conditionalParentId]]) {
          // Invalid conditional state, move to next regular question
          const parentIndex = currentSectionData.questions.findIndex(q => q.id === conditionalParentId);
          if (parentIndex >= 0 && parentIndex < currentSectionData.questions.length - 1) {
            setCurrentQuestion(parentIndex + 1);
            // Skip to next visible question
            findNextVisibleQuestion(currentSection, parentIndex + 1);
          } else if (currentSection < questionnaire.length - 1) {
            // Skip to next visible section and question
            findNextVisibleSection(currentSection + 1);
          } else {
            onComplete(answers);
          }
          setIsOnConditionalQuestion(false);
          setConditionalParentId(null);
          setConditionalIndex(-1);
          return;
        }
        
        const conditionalQuestions = parentQuestion.conditionalQuestions[answers[conditionalParentId]];
        
        if (conditionalIndex < conditionalQuestions.length - 1) {
          // Move to next conditional question
          setConditionalIndex(conditionalIndex + 1);
        } else {
          // We're done with conditional questions, move to next regular question
          const parentIndex = currentSectionData.questions.findIndex(q => q.id === conditionalParentId);
          if (parentIndex >= 0 && parentIndex < currentSectionData.questions.length - 1) {
            setCurrentQuestion(parentIndex + 1);
            // Skip to next visible question
            findNextVisibleQuestion(currentSection, parentIndex + 1);
          } else if (currentSection < questionnaire.length - 1) {
            // Skip to next visible section and question
            findNextVisibleSection(currentSection + 1);
          } else {
            onComplete(answers);
          }
          setIsOnConditionalQuestion(false);
          setConditionalParentId(null);
          setConditionalIndex(-1);
        }
      } else {
        // Check if current question has conditionals that should be shown
        if (questionData.conditionalQuestions && 
            answers[questionData.id] && 
            questionData.conditionalQuestions[answers[questionData.id]]) {
          // Show first conditional question
          setIsOnConditionalQuestion(true);
          setConditionalParentId(questionData.id);
          setConditionalIndex(0);
        } else if (currentQuestion < currentSectionData.questions.length - 1) {
          // Move to next question in section, skipping irrelevant ones
          findNextVisibleQuestion(currentSection, currentQuestion + 1);
        } else if (currentSection < questionnaire.length - 1) {
          // Move to next visible section
          findNextVisibleSection(currentSection + 1);
        } else {
          // Questionnaire completed
          onComplete(answers);
        }
      }
    } catch (error) {
      console.error('Error in handleNext:', error);
      // Recover by moving to the next section
      if (currentSection < questionnaire.length - 1) {
        setCurrentSection(currentSection + 1);
        setCurrentQuestion(0);
      } else {
        onComplete(answers);
      }
      setIsOnConditionalQuestion(false);
      setConditionalParentId(null);
      setConditionalIndex(-1);
    }
  };

  // Helper function to find the next visible question in the current section
  const findNextVisibleQuestion = (sectionIndex, startQuestionIndex) => {
    const section = questionnaire[sectionIndex];
    let nextQuestionIndex = startQuestionIndex;

    while (nextQuestionIndex < section.questions.length) {
      const question = section.questions[nextQuestionIndex];
      if (isQuestionVisible(question.id, sectionIndex, nextQuestionIndex)) {
        // Found a visible question
        setCurrentQuestion(nextQuestionIndex);
        return true;
      }
      nextQuestionIndex++;
    }

    // No visible questions in this section, move to next section
    if (sectionIndex < questionnaire.length - 1) {
      findNextVisibleSection(sectionIndex + 1);
    } else {
      // End of questionnaire
      onComplete(answers);
    }
    return false;
  };

  // Helper function to find the next visible section and its first visible question
  const findNextVisibleSection = (startSectionIndex) => {
    let nextSectionIndex = startSectionIndex;

    while (nextSectionIndex < questionnaire.length) {
      if (isSectionVisible(nextSectionIndex)) {
        // Found a visible section, now find its first visible question
        setCurrentSection(nextSectionIndex);
        findNextVisibleQuestion(nextSectionIndex, 0);
        return true;
      }
      nextSectionIndex++;
    }

    // No more visible sections, end questionnaire
    onComplete(answers);
    return false;
  };

  // Update handlePrevious to also skip irrelevant questions when going backwards
  const handlePrevious = () => {
    try {
      if (isOnConditionalQuestion) {
        if (conditionalIndex > 0) {
          // Go to previous conditional question
          setConditionalIndex(conditionalIndex - 1);
        } else {
          // Go back to the parent question
          setIsOnConditionalQuestion(false);
          const parentIndex = questionnaire[currentSection].questions.findIndex(
            q => q.id === conditionalParentId
          );
          setCurrentQuestion(parentIndex >= 0 ? parentIndex : 0);
          setConditionalParentId(null);
          setConditionalIndex(-1);
        }
      } else if (currentQuestion > 0) {
        // Find previous visible question in this section
        findPrevVisibleQuestion(currentSection, currentQuestion - 1);
      } else if (currentSection > 0) {
        // Find previous visible section
        findPrevVisibleSection(currentSection - 1);
      }
    } catch (error) {
      console.error('Error in handlePrevious:', error);
      // Recover by moving to the previous section or beginning
      if (currentSection > 0) {
        setCurrentSection(currentSection - 1);
        setCurrentQuestion(0);
      } else {
        setCurrentQuestion(0);
      }
      setIsOnConditionalQuestion(false);
      setConditionalParentId(null);
      setConditionalIndex(-1);
    }
  };

  // Helper function to find previous visible question
  const findPrevVisibleQuestion = (sectionIndex, startQuestionIndex) => {
    let prevQuestionIndex = startQuestionIndex;

    while (prevQuestionIndex >= 0) {
      const question = questionnaire[sectionIndex].questions[prevQuestionIndex];
      if (isQuestionVisible(question.id, sectionIndex, prevQuestionIndex)) {
        // Check if this question has conditional questions we need to navigate to
        if (question.conditionalQuestions && 
            answers[question.id] && 
            question.conditionalQuestions[answers[question.id]]) {
          const conditionals = question.conditionalQuestions[answers[question.id]];
          if (conditionals && conditionals.length > 0) {
            setIsOnConditionalQuestion(true);
            setConditionalParentId(question.id);
            setConditionalIndex(conditionals.length - 1);
          } else {
            setCurrentQuestion(prevQuestionIndex);
          }
        } else {
          setCurrentQuestion(prevQuestionIndex);
        }
        return true;
      }
      prevQuestionIndex--;
    }

    // No visible questions found in this section, go to previous section
    if (sectionIndex > 0) {
      findPrevVisibleSection(sectionIndex - 1);
    }
    return false;
  };

  // Helper function to find previous visible section
  const findPrevVisibleSection = (startSectionIndex) => {
    let prevSectionIndex = startSectionIndex;

    while (prevSectionIndex >= 0) {
      if (isSectionVisible(prevSectionIndex)) {
        setCurrentSection(prevSectionIndex);
        // Go to the last visible question in this section
        const lastQuestionIndex = questionnaire[prevSectionIndex].questions.length - 1;
        findPrevVisibleQuestion(prevSectionIndex, lastQuestionIndex);
        return true;
      }
      prevSectionIndex--;
    }
    
    // No previous visible sections, stay at first question of first section
    setCurrentSection(0);
    setCurrentQuestion(0);
    return false;
  };

  // Get the current question to display (either a regular or a conditional question)
  const getCurrentQuestion = () => {
    try {
      if (isOnConditionalQuestion && conditionalParentId) {
        const parentQuestion = questionnaire[currentSection].questions.find(q => q.id === conditionalParentId);
        if (parentQuestion && 
            parentQuestion.conditionalQuestions && 
            answers[conditionalParentId] && 
            parentQuestion.conditionalQuestions[answers[conditionalParentId]]) {
          const conditionalQuestions = parentQuestion.conditionalQuestions[answers[conditionalParentId]];
          if (conditionalQuestions && conditionalIndex >= 0 && conditionalIndex < conditionalQuestions.length) {
            return conditionalQuestions[conditionalIndex];
          }
        }
        // If we couldn't get a valid conditional question, fall back to current regular question
        return questionnaire[currentSection].questions[currentQuestion];
      }
      return questionnaire[currentSection].questions[currentQuestion];
    } catch (error) {
      console.error('Error in getCurrentQuestion:', error);
      // Return a safe fallback question if there was an error
      return {
        id: 'error',
        text: 'There was an error loading this question. Please click Next to continue.',
        type: 'text',
        required: false
      };
    }
  };

  const renderQuestion = (question) => {
    switch (question.type) {
      case 'text':
        return (
          <input
            type="text"
            className="questionnaire-input"
            value={answers[question.id] || ''}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            required={question.required}
          />
        );
      
      case 'number':
        return (
          <input
            type="number"
            className="questionnaire-input"
            min={question.min}
            max={question.max}
            value={answers[question.id] || ''}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            required={question.required}
          />
        );
      
      case 'textarea':
        return (
          <textarea
            className="questionnaire-textarea"
            maxLength={question.maxLength}
            value={answers[question.id] || ''}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            required={question.required}
          ></textarea>
        );
      
      case 'radio':
        return (
          <div className="radio-group">
            {question.options.map((option) => (
              <div key={option.value} className="radio-option">
                <input
                  type="radio"
                  id={`${question.id}-${option.value}`}
                  name={question.id}
                  value={option.value}
                  checked={answers[question.id] === option.value}
                  onChange={() => handleInputChange(question.id, option.value)}
                  required={question.required}
                />
                <label htmlFor={`${question.id}-${option.value}`}>{option.label}</label>
              </div>
            ))}
            {question.hasOther && (
              <div className="radio-option other-option">
                <input
                  type="radio"
                  id={`${question.id}-other`}
                  name={question.id}
                  value="other"
                  checked={answers[question.id] === 'other'}
                  onChange={() => handleInputChange(question.id, 'other')}
                />
                <label htmlFor={`${question.id}-other`}>Other:</label>
                <input
                  type="text"
                  className="other-input"
                  value={otherValues[question.id] || ''}
                  onChange={(e) => handleOtherChange(question.id, e.target.value)}
                  disabled={answers[question.id] !== 'other'}
                />
              </div>
            )}
          </div>
        );
      
      case 'checkbox':
        return (
          <div className="checkbox-group">
            {question.options.map((option) => (
              <div key={option.value} className="checkbox-option">
                <input
                  type="checkbox"
                  id={`${question.id}-${option.value}`}
                  value={option.value}
                  checked={(answers[question.id] || []).includes(option.value)}
                  onChange={(e) => {
                    const currentValues = answers[question.id] || [];
                    let newValues = [...currentValues];
                    
                    if (e.target.checked) {
                      newValues.push(option.value);
                    } else {
                      newValues = newValues.filter(value => value !== option.value);
                    }
                    
                    if (question.max && newValues.length > question.max) {
                      alert(`Please select a maximum of ${question.max} options.`);
                      return;
                    }
                    
                    handleInputChange(question.id, newValues);
                  }}
                />
                <label htmlFor={`${question.id}-${option.value}`}>{option.label}</label>
              </div>
            ))}
            {question.hasOther && (
              <div className="checkbox-option other-option">
                <input
                  type="checkbox"
                  id={`${question.id}-other`}
                  value="other"
                  checked={(answers[question.id] || []).includes('other')}
                  onChange={(e) => {
                    const currentValues = answers[question.id] || [];
                    let newValues = [...currentValues];
                    
                    if (e.target.checked) {
                      newValues.push('other');
                    } else {
                      newValues = newValues.filter(value => value !== 'other');
                    }
                    
                    handleInputChange(question.id, newValues);
                  }}
                />
                <label htmlFor={`${question.id}-other`}>Other:</label>
                <input
                  type="text"
                  className="other-input"
                  value={otherValues[question.id] || ''}
                  onChange={(e) => handleOtherChange(question.id, e.target.value)}
                  disabled={!((answers[question.id] || []).includes('other'))}
                />
              </div>
            )}
          </div>
        );
      
      case 'rating':
        return (
          <div className="rating-group">
            {question.subQuestions.map((subQuestion) => (
              <div key={subQuestion.id} className="rating-item">
                <div className="rating-label">{subQuestion.text}</div>
                <div className="rating-options">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <div key={rating} className="rating-option">
                      <input
                        type="radio"
                        id={`${question.id}-${subQuestion.id}-${rating}`}
                        name={`${question.id}-${subQuestion.id}`}
                        value={rating}
                        checked={
                          answers[question.id] && 
                          answers[question.id][subQuestion.id] === rating
                        }
                        onChange={() => {
                          const currentRatings = answers[question.id] || {};
                          handleInputChange(question.id, {
                            ...currentRatings,
                            [subQuestion.id]: rating
                          });
                        }}
                        required={question.required}
                      />
                      <label htmlFor={`${question.id}-${subQuestion.id}-${rating}`}>{rating}</label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );
      
      default:
        return null;
    }
  };

  // Handle filling form with selected scenario data
  const handleScenarioSelect = (e) => {
    const selected = e.target.value;
    setSelectedScenario(selected);
    
    if (!selected) return;
    
    if (selected === 'Random Data') {
      const randomData = generateRandomAnswers();
      setAnswers(randomData);
      setCurrentTestScenario('Random Data');
    } else if (selected === 'Random Scenario') {
      const scenario = getRandomScenario();
      setAnswers(scenario.data);
      setCurrentTestScenario(scenario.name);
    } else {
      const scenario = getScenarioByName(selected);
      if (scenario) {
        setAnswers(scenario.data);
        setCurrentTestScenario(scenario.name);
      }
    }
  };

  const handleClearAnswers = () => {
    setAnswers({});
    setCurrentTestScenario(null);
    setSelectedScenario('');
  };

  let questionData;
  try {
    questionData = getCurrentQuestion();
  } catch (error) {
    console.error('Error getting current question:', error);
    questionData = {
      id: 'error',
      text: 'There was an error loading this question. Please click Next to continue.',
      type: 'text',
      required: false
    };
  }

  return (
    <div className="questionnaire-container">
      <div className="test-controls">
        <div className="scenario-selector">
          <select
            value={selectedScenario}
            onChange={handleScenarioSelect}
            className="scenario-dropdown"
          >
            <option value="">Select an NGO Profile</option>
            {availableScenarios.map(scenario => (
              <option key={scenario.name} value={scenario.name}>
                {scenario.label}
              </option>
            ))}
          </select>
          <button onClick={handleClearAnswers} className="test-button clear">
            Clear All
          </button>
        </div>
        {currentTestScenario && (
          <div className="current-scenario">
            Current Profile: {currentTestScenario}
          </div>
        )}
      </div>

      <div className="section-navigation">
        {questionnaire.map((section, index) => (
          isSectionVisible(index) && (
            <div
              key={section.id}
              className={`section-tab ${
                index === currentSection ? 'active' : ''
              } ${isSectionComplete(index) ? 'completed' : ''}`}
              onClick={() => handleSectionClick(index)}
            >
              {section.title}
            </div>
          )
        ))}
      </div>

      <div className="progress-container">
        <div className="progress-info">
          <span>Progress</span>
          <span className="progress-percentage">{calculateProgress()}%</span>
        </div>
        <div className="progress-bar">
          <div
            className="progress"
            style={{
              width: `${calculateProgress()}%`
            }}
          ></div>
        </div>
      </div>

      <div className="page-navigation">
        <div className="page-info" onClick={() => setIsPageNavigatorOpen(true)}>
          Page {getCurrentPage()} of {getTotalPages()}
          <span className="page-navigation-hint">(Click to navigate)</span>
        </div>
        {isPageNavigatorOpen && (
          <div className="page-navigator">
            <div className="page-navigator-header">
              <h3>Go to Page</h3>
              <button className="close-navigator" onClick={() => setIsPageNavigatorOpen(false)}>×</button>
            </div>
            <div className="page-numbers">
              {Array.from({ length: getTotalPages() }, (_, i) => i + 1).map(pageNum => (
                <button
                  key={pageNum}
                  className={`page-number ${getCurrentPage() === pageNum ? 'current' : ''} 
                             ${isPageAccessible(pageNum) ? 'accessible' : 'locked'}`}
                  onClick={() => navigateToPage(pageNum)}
                  disabled={!isPageAccessible(pageNum)}
                >
                  {pageNum}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <h2 className="section-title">{questionnaire[currentSection].title}</h2>
      
      <div className="question-card">
        <h3 className="question-text">{questionData.text}</h3>
        <div className="question-input">
          {renderQuestion(questionData)}
        </div>
      </div>
      
      <div className="navigation-buttons">
        {(currentQuestion > 0 || currentSection > 0 || isOnConditionalQuestion) && (
          <button onClick={handlePrevious} className="prev-button">
            Previous
          </button>
        )}
        <button onClick={handleNext} className="next-button">
          {currentSection === questionnaire.length - 1 && 
           currentQuestion === questionnaire[currentSection].questions.length - 1 &&
           !isOnConditionalQuestion
           ? 'Submit' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default Questionnaire;