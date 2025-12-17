// MindCare AI JavaScript Functionality

// Application Data
const appData = {
  chatResponses: {
    anxious: {
      response: "I understand you're feeling anxious. Let's try a quick breathing exercise: Breathe in for 4 counts, hold for 4, breathe out for 6. This activates your parasympathetic nervous system to help you feel calmer. Would you like me to guide you through some other coping strategies?",
      followUp: ["Breathing Exercise", "Grounding Technique", "Talk to Professional"]
    },
    overwhelmed: {
      response: "Feeling overwhelmed is very common, and you're not alone. Let's break this down into manageable pieces. Can you tell me what's contributing most to this feeling right now? In the meantime, try the 5-4-3-2-1 grounding technique: Name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, 1 you can taste.",
      followUp: ["Stress Management", "Priority Setting", "Professional Help"]
    },
    sleep: {
      response: "Sleep difficulties can really impact your mental health. Here are some evidence-based strategies: Keep a consistent sleep schedule, avoid screens 1 hour before bed, try progressive muscle relaxation, and keep your bedroom cool and dark. Would you like me to guide you through a relaxation exercise?",
      followUp: ["Relaxation Exercise", "Sleep Hygiene Tips", "Track Sleep Pattern"]
    },
    depressed: {
      response: "I'm concerned about how you're feeling. Depression is a real medical condition, and seeking help is a sign of strength. Please consider talking to a mental health professional. In the meantime, small steps like getting sunlight, gentle movement, or connecting with someone you trust can help. Are you having thoughts of self-harm?",
      followUp: ["Crisis Resources", "Find Therapist", "Self-Care Activities"]
    },
    crisis: {
      response: "Your safety is the top priority. If you're having thoughts of hurting yourself or others, please contact emergency services immediately (911) or call the National Suicide Prevention Lifeline at 988. You can also text HOME to 741741 for crisis text support. Is there someone you trust who can be with you right now?",
      followUp: ["Call 911", "Crisis Hotline: 988", "Crisis Text: 741741"]
    }
  },
  moodOptions: [
    {value: 1, emoji: "😢", label: "Very Low"},
    {value: 2, emoji: "😞", label: "Low"},
    {value: 3, emoji: "😐", label: "Below Average"},
    {value: 4, emoji: "🙂", label: "Average"},
    {value: 5, emoji: "😊", label: "Good"},
    {value: 6, emoji: "😄", label: "Very Good"},
    {value: 7, emoji: "🤗", label: "Great"},
    {value: 8, emoji: "😃", label: "Excellent"},
    {value: 9, emoji: "🥳", label: "Amazing"},
    {value: 10, emoji: "🌟", label: "Outstanding"}
  ],
  assessmentQuestions: [
    "Over the past 2 weeks, how often have you felt down, depressed, or hopeless?",
    "How often have you had little interest or pleasure in doing things?",
    "How often have you had trouble falling or staying asleep, or sleeping too much?",
    "How often have you felt tired or had little energy?",
    "How often have you had poor appetite or overeating?",
    "How often have you felt bad about yourself or that you are a failure?",
    "How often have you had trouble concentrating on things?",
    "How often have you felt nervous, anxious, or on edge?",
    "How often have you been unable to stop or control worrying?"
  ],
  resources: [
    {
      title: "Breathing Exercises",
      description: "Learn various breathing techniques to manage anxiety and stress",
      category: "Coping Skills"
    },
    {
      title: "Mindfulness Meditation",
      description: "Guided meditation practices for mental wellness",
      category: "Relaxation"
    },
    {
      title: "Sleep Hygiene",
      description: "Tips and strategies for better sleep quality",
      category: "Lifestyle"
    },
    {
      title: "Stress Management",
      description: "Effective techniques for managing daily stress",
      category: "Coping Skills"
    },
    {
      title: "Crisis Resources",
      description: "Emergency contacts and immediate help resources",
      category: "Emergency"
    },
    {
      title: "Understanding Anxiety",
      description: "Educational content about anxiety disorders and treatment",
      category: "Education"
    }
  ],
  emergencyContacts: [
    {
      name: "National Suicide Prevention Lifeline",
      number: "988",
      description: "24/7 crisis support"
    },
    {
      name: "Crisis Text Line",
      number: "Text HOME to 741741",
      description: "24/7 text support"
    },
    {
      name: "Emergency Services",
      number: "911",
      description: "For immediate medical emergencies"
    }
  ]
};

// Application State
let currentAssessmentQuestion = 0;
let assessmentAnswers = [];
let moodData = JSON.parse(localStorage.getItem('moodData') || '[]');
let chatHistory = [];

// DOM Elements
const chatModal = document.getElementById('chat-modal');
const assessmentModal = document.getElementById('assessment-modal');
const moodModal = document.getElementById('mood-modal');
const resourcesModal = document.getElementById('resources-modal');

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
  initializeEventListeners();
  setupMoodTracker();
  setupAssessment();
  setupResources();
});

// Event Listeners
function initializeEventListeners() {
  // Header buttons
  document.getElementById('emergency-btn').addEventListener('click', showEmergencyContacts);
  document.getElementById('start-chat-btn').addEventListener('click', openChatModal);
  document.getElementById('book-consultation-btn').addEventListener('click', scrollToContact);

  // Chat modal
  document.getElementById('close-chat').addEventListener('click', closeChatModal);
  document.getElementById('send-message').addEventListener('click', sendChatMessage);
  document.getElementById('chat-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      sendChatMessage();
    }
  });

  // Assessment modal
  document.getElementById('close-assessment').addEventListener('click', closeAssessmentModal);

  // Mood modal
  document.getElementById('close-mood').addEventListener('click', closeMoodModal);

  // Resources modal
  document.getElementById('close-resources').addEventListener('click', closeResourcesModal);

  // Modal background clicks
  [chatModal, assessmentModal, moodModal, resourcesModal].forEach(modal => {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  });

  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Form submission
  document.querySelector('.consultation-form').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Thank you for your consultation request. We will contact you within 24 hours.');
  });
}

// Chat Functionality
function openChatModal() {
  chatModal.classList.add('active');
  document.getElementById('chat-input').focus();
}

function closeChatModal() {
  chatModal.classList.remove('active');
}

function sendChatMessage() {
  const input = document.getElementById('chat-input');
  const message = input.value.trim();
  
  if (!message) return;

  addChatMessage(message, 'user');
  input.value = '';

  // Simulate AI typing
  setTimeout(() => {
    const response = generateAIResponse(message);
    addChatMessage(response.message, 'ai');
    
    if (response.followUp) {
      addFollowUpButtons(response.followUp);
    }
  }, 1000);
}

function addChatMessage(message, sender) {
  const messagesContainer = document.getElementById('chat-messages');
  const messageElement = document.createElement('div');
  messageElement.className = `chat-message chat-message--${sender}`;
  
  const contentElement = document.createElement('div');
  contentElement.className = 'chat-message__content';
  contentElement.textContent = message;
  
  messageElement.appendChild(contentElement);
  messagesContainer.appendChild(messageElement);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
  
  chatHistory.push({ message, sender, timestamp: new Date() });
}

function addFollowUpButtons(buttons) {
  const messagesContainer = document.getElementById('chat-messages');
  const buttonsContainer = document.createElement('div');
  buttonsContainer.className = 'chat-followup-buttons';
  buttonsContainer.style.cssText = 'display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: 1rem; justify-content: flex-start;';
  
  buttons.forEach(buttonText => {
    const button = document.createElement('button');
    button.className = 'btn btn--outline btn--sm';
    button.textContent = buttonText;
    button.addEventListener('click', () => {
      handleFollowUpAction(buttonText);
      buttonsContainer.remove();
    });
    buttonsContainer.appendChild(button);
  });
  
  messagesContainer.appendChild(buttonsContainer);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function handleFollowUpAction(action) {
  let response = "";
  
  switch(action) {
    case "Breathing Exercise":
      response = "Let's do a simple breathing exercise: 1) Sit comfortably and close your eyes. 2) Breathe in slowly through your nose for 4 counts. 3) Hold your breath for 4 counts. 4) Exhale slowly through your mouth for 6 counts. 5) Repeat 5-10 times. This helps activate your body's relaxation response.";
      break;
    case "Grounding Technique":
      response = "Try the 5-4-3-2-1 grounding technique: Look around and name 5 things you can see, 4 things you can physically touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste. This helps bring your focus back to the present moment.";
      break;
    case "Talk to Professional":
      response = "Speaking with a mental health professional is a great step. You can find therapists through Psychology Today, contact your insurance provider for covered therapists, or call 211 for local mental health resources. Would you like help finding resources in your area?";
      break;
    case "Crisis Resources":
      response = "If you're in immediate danger, call 911. For crisis support: National Suicide Prevention Lifeline (988), Crisis Text Line (text HOME to 741741), or contact your local emergency room. These services are available 24/7 and staffed by trained professionals.";
      break;
    default:
      response = "I'm here to help you with that. Can you tell me more about what you're experiencing?";
  }
  
  setTimeout(() => {
    addChatMessage(response, 'ai');
  }, 500);
}

function generateAIResponse(message) {
  const lowerMessage = message.toLowerCase();
  
  // Crisis keywords
  if (lowerMessage.includes('kill myself') || lowerMessage.includes('end my life') || 
      lowerMessage.includes('suicide') || lowerMessage.includes('want to die') ||
      lowerMessage.includes('hurt myself')) {
    return {
      message: appData.chatResponses.crisis.response,
      followUp: appData.chatResponses.crisis.followUp
    };
  }
  
  // Anxiety keywords
  if (lowerMessage.includes('anxious') || lowerMessage.includes('anxiety') || 
      lowerMessage.includes('nervous') || lowerMessage.includes('panic') ||
      lowerMessage.includes('worried')) {
    return {
      message: appData.chatResponses.anxious.response,
      followUp: appData.chatResponses.anxious.followUp
    };
  }
  
  // Depression keywords
  if (lowerMessage.includes('depressed') || lowerMessage.includes('sad') || 
      lowerMessage.includes('hopeless') || lowerMessage.includes('empty') ||
      lowerMessage.includes('worthless')) {
    return {
      message: appData.chatResponses.depressed.response,
      followUp: appData.chatResponses.depressed.followUp
    };
  }
  
  // Sleep keywords
  if (lowerMessage.includes('sleep') || lowerMessage.includes('insomnia') || 
      lowerMessage.includes('tired') || lowerMessage.includes('exhausted')) {
    return {
      message: appData.chatResponses.sleep.response,
      followUp: appData.chatResponses.sleep.followUp
    };
  }
  
  // Overwhelmed keywords
  if (lowerMessage.includes('overwhelmed') || lowerMessage.includes('stressed') || 
      lowerMessage.includes('too much') || lowerMessage.includes('can\'t cope')) {
    return {
      message: appData.chatResponses.overwhelmed.response,
      followUp: appData.chatResponses.overwhelmed.followUp
    };
  }
  
  // Default supportive response
  return {
    message: "Thank you for sharing that with me. I'm here to listen and support you. Can you tell me more about how you're feeling right now? Remember, seeking help is a sign of strength, and you don't have to go through this alone.",
    followUp: ["Tell me more", "Coping strategies", "Professional help"]
  };
}

// Quick Action Functions
function openQuickAction(type) {
  openChatModal();
  setTimeout(() => {
    const response = appData.chatResponses[type];
    if (response) {
      addChatMessage(response.response, 'ai');
      if (response.followUp) {
        addFollowUpButtons(response.followUp);
      }
    }
  }, 500);
}

// Assessment Functionality
function setupAssessment() {
  renderAssessmentQuestion();
}

function openAssessment() {
  assessmentModal.classList.add('active');
  currentAssessmentQuestion = 0;
  assessmentAnswers = [];
  renderAssessmentQuestion();
}

function closeAssessmentModal() {
  assessmentModal.classList.remove('active');
}

function renderAssessmentQuestion() {
  const container = document.getElementById('assessment-questions');
  const resultsContainer = document.getElementById('assessment-results');
  
  container.classList.remove('hidden');
  resultsContainer.classList.add('hidden');
  
  if (currentAssessmentQuestion < appData.assessmentQuestions.length) {
    const question = appData.assessmentQuestions[currentAssessmentQuestion];
    
    container.innerHTML = `
      <div class="assessment-question">
        <h4>Question ${currentAssessmentQuestion + 1} of ${appData.assessmentQuestions.length}</h4>
        <p class="mb-lg">${question}</p>
        <div class="assessment-options">
          <label class="assessment-option">
            <input type="radio" name="assessment" value="0">
            <span>Not at all</span>
          </label>
          <label class="assessment-option">
            <input type="radio" name="assessment" value="1">
            <span>Several days</span>
          </label>
          <label class="assessment-option">
            <input type="radio" name="assessment" value="2">
            <span>More than half the days</span>
          </label>
          <label class="assessment-option">
            <input type="radio" name="assessment" value="3">
            <span>Nearly every day</span>
          </label>
        </div>
        <div class="assessment-actions">
          <button class="btn btn--outline" onclick="previousQuestion()" 
                  ${currentAssessmentQuestion === 0 ? 'style="visibility: hidden;"' : ''}>
            Previous
          </button>
          <button class="btn btn--primary" onclick="nextQuestion()">
            ${currentAssessmentQuestion === appData.assessmentQuestions.length - 1 ? 'Complete' : 'Next'}
          </button>
        </div>
      </div>
    `;
  }
}

function nextQuestion() {
  const selectedAnswer = document.querySelector('input[name="assessment"]:checked');
  if (!selectedAnswer) {
    alert('Please select an answer before continuing.');
    return;
  }
  
  assessmentAnswers[currentAssessmentQuestion] = parseInt(selectedAnswer.value);
  
  if (currentAssessmentQuestion < appData.assessmentQuestions.length - 1) {
    currentAssessmentQuestion++;
    renderAssessmentQuestion();
  } else {
    showAssessmentResults();
  }
}

function previousQuestion() {
  if (currentAssessmentQuestion > 0) {
    currentAssessmentQuestion--;
    renderAssessmentQuestion();
    
    // Pre-select previous answer
    setTimeout(() => {
      const previousAnswer = assessmentAnswers[currentAssessmentQuestion];
      if (previousAnswer !== undefined) {
        document.querySelector(`input[name="assessment"][value="${previousAnswer}"]`).checked = true;
      }
    }, 100);
  }
}

function showAssessmentResults() {
  const container = document.getElementById('assessment-questions');
  const resultsContainer = document.getElementById('assessment-results');
  
  container.classList.add('hidden');
  resultsContainer.classList.remove('hidden');
  
  const totalScore = assessmentAnswers.reduce((sum, score) => sum + score, 0);
  let severity, recommendation;
  
  if (totalScore <= 4) {
    severity = 'Minimal';
    recommendation = 'Your responses suggest minimal symptoms. Continue practicing self-care and maintain healthy habits.';
  } else if (totalScore <= 9) {
    severity = 'Mild';
    recommendation = 'Your responses suggest mild symptoms. Consider self-care strategies and monitor your symptoms.';
  } else if (totalScore <= 14) {
    severity = 'Moderate';
    recommendation = 'Your responses suggest moderate symptoms. Consider speaking with a mental health professional.';
  } else if (totalScore <= 19) {
    severity = 'Moderately Severe';
    recommendation = 'Your responses suggest moderately severe symptoms. We recommend consulting with a mental health professional soon.';
  } else {
    severity = 'Severe';
    recommendation = 'Your responses suggest severe symptoms. Please consider seeking professional help immediately. If you\'re having thoughts of self-harm, contact emergency services or call 988.';
  }
  
  resultsContainer.innerHTML = `
    <div class="assessment-results">
      <h3>Assessment Results</h3>
      <div class="assessment-score assessment-score--${severity.toLowerCase().replace(' ', '')}">
        ${totalScore}/27
      </div>
      <h4>Severity: ${severity}</h4>
      <p class="mb-lg">${recommendation}</p>
      <div class="assessment-actions">
        <button class="btn btn--outline" onclick="restartAssessment()">Take Again</button>
        <button class="btn btn--primary" onclick="closeAssessmentModal()">Close</button>
      </div>
      ${totalScore >= 15 ? '<div class="mt-lg"><strong>Emergency Resources:</strong><br>National Suicide Prevention Lifeline: 988<br>Crisis Text Line: Text HOME to 741741</div>' : ''}
    </div>
  `;
}

function restartAssessment() {
  currentAssessmentQuestion = 0;
  assessmentAnswers = [];
  renderAssessmentQuestion();
}

// Mood Tracker Functionality
function setupMoodTracker() {
  renderMoodOptions();
  renderMoodTrends();
}

function openMoodTracker() {
  moodModal.classList.add('active');
  renderMoodOptions();
  renderMoodTrends();
}

function closeMoodModal() {
  moodModal.classList.remove('active');
}

function renderMoodOptions() {
  const container = document.getElementById('mood-options');
  
  container.innerHTML = appData.moodOptions.map(option => `
    <div class="mood-option" onclick="selectMood(${option.value})">
      <div class="mood-emoji">${option.emoji}</div>
      <div class="mood-label">${option.label}</div>
    </div>
  `).join('');
}

function selectMood(value) {
  const today = new Date().toDateString();
  const existingEntry = moodData.find(entry => entry.date === today);
  
  if (existingEntry) {
    existingEntry.mood = value;
  } else {
    moodData.push({ date: today, mood: value });
  }
  
  // Keep only last 30 days
  if (moodData.length > 30) {
    moodData = moodData.slice(-30);
  }
  
  localStorage.setItem('moodData', JSON.stringify(moodData));
  renderMoodTrends();
  
  // Visual feedback
  document.querySelectorAll('.mood-option').forEach(option => {
    option.classList.remove('active');
  });
  event.target.closest('.mood-option').classList.add('active');
  
  setTimeout(() => {
    alert('Mood recorded! Thank you for tracking your mental health.');
  }, 300);
}

function renderMoodTrends() {
  const container = document.getElementById('mood-trends');
  
  if (moodData.length === 0) {
    container.innerHTML = '<p style="text-align: center; color: var(--color-text-muted); margin: 2rem 0;">No mood data yet. Start tracking your mood to see trends!</p>';
    return;
  }
  
  const last7Days = moodData.slice(-7);
  const maxMood = 10;
  
  container.innerHTML = last7Days.map(entry => {
    const height = (entry.mood / maxMood) * 100;
    const date = new Date(entry.date);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    
    return `
      <div class="mood-bar-container" style="display: flex; flex-direction: column; align-items: center; flex: 1;">
        <div class="mood-bar" style="height: ${height}%; background-color: var(--color-primary); border-radius: var(--radius-sm); width: 100%; min-height: 10px;"></div>
        <small style="margin-top: 0.5rem; font-size: 0.75rem; color: var(--color-text-muted);">${dayName}</small>
      </div>
    `;
  }).join('');
}

// Resources Functionality
function setupResources() {
  // Resources are set up when modal is opened
}

function openResources() {
  resourcesModal.classList.add('active');
  renderResources();
}

function closeResourcesModal() {
  resourcesModal.classList.remove('active');
}

function renderResources() {
  const container = document.getElementById('resources-content');
  
  container.innerHTML = `
    <div class="resources-grid-modal">
      ${appData.resources.map(resource => `
        <div class="resource-item" onclick="showResourceDetail('${resource.title}')">
          <h4>${resource.title}</h4>
          <p>${resource.description}</p>
          <span class="resource-category">${resource.category}</span>
        </div>
      `).join('')}
    </div>
  `;
}

function showResourceDetail(title) {
  const resource = appData.resources.find(r => r.title === title);
  if (!resource) return;
  
  let content = '';
  
  switch(title) {
    case 'Breathing Exercises':
      content = 'Try the 4-7-8 technique: Inhale for 4 counts, hold for 7, exhale for 8. Or try box breathing: Inhale 4, hold 4, exhale 4, hold 4. Practice daily for best results.';
      break;
    case 'Mindfulness Meditation':
      content = 'Start with 5 minutes daily. Focus on your breath, notice thoughts without judgment, and gently return attention to breathing. Apps like Headspace or Calm can guide you.';
      break;
    case 'Sleep Hygiene':
      content = 'Maintain consistent sleep schedule, avoid screens 1 hour before bed, keep bedroom cool and dark, limit caffeine after 2 PM, and create a relaxing bedtime routine.';
      break;
    case 'Stress Management':
      content = 'Practice progressive muscle relaxation, set boundaries, prioritize tasks, take regular breaks, exercise regularly, and maintain social connections.';
      break;
    case 'Crisis Resources':
      content = 'National Suicide Prevention Lifeline: 988\nCrisis Text Line: Text HOME to 741741\nEmergency Services: 911\nNAMI Helpline: 1-800-950-NAMI (6264)';
      break;
    default:
      content = resource.description;
  }
  
  alert(`${resource.title}\n\n${content}`);
}

// Emergency Contacts
function showEmergencyContacts() {
  const contactsHtml = appData.emergencyContacts.map(contact => `
    <div style="margin-bottom: 1rem; padding: 1rem; border: 1px solid var(--color-border); border-radius: var(--radius-md);">
      <strong>${contact.name}</strong><br>
      <span style="font-size: 1.2rem; color: var(--color-error);">${contact.number}</span><br>
      <small>${contact.description}</small>
    </div>
  `).join('');
  
  const modalHtml = `
    <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 1rem;">
      <div style="background: white; padding: 2rem; border-radius: 1rem; max-width: 500px; width: 100%;">
        <h3 style="margin-bottom: 1rem; text-align: center;">Emergency Resources</h3>
        ${contactsHtml}
        <button onclick="this.closest('div').remove()" style="width: 100%; padding: 0.75rem; background: var(--color-primary); color: white; border: none; border-radius: 0.5rem; cursor: pointer; margin-top: 1rem;">Close</button>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', modalHtml);
}

// Utility Functions
function scrollToContact() {
  document.getElementById('contact').scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });
}

// Initialize application when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeEventListeners);
} else {
  initializeEventListeners();
}
