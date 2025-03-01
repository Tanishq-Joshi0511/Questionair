// Test scenario generator for NGO questionnaire
const ngoNames = [
  'Hope Foundation', 'Green Earth Initiative', 'Education First', 'Rural Development Trust',
  'Urban Healthcare Alliance', 'Children First', 'Women Empowerment Network', 'Digital Literacy Mission'
];

const locations = [
  ['tier1'], ['tier2'], ['tier3'], ['rural'],
  ['tier1', 'tier2'], ['tier2', 'tier3'], ['tier3', 'rural'],
  ['tier1', 'rural'], ['tier1', 'tier2', 'tier3']
];

const registrationTypes = ['trust', 'society', 'section8', 'educational', 'hospital'];

const primaryBeneficiaries = [
  { value: 'children', label: 'Children & Youth' },
  { value: 'women', label: 'Women & Girls' },
  { value: 'elderly', label: 'Elderly' },
  { value: 'disabilities', label: 'People with Disabilities' },
  { value: 'lgbtq', label: 'LGBTQ+ Community' },
  { value: 'minorities', label: 'Minority Communities' },
  { value: 'refugees', label: 'Refugees & Displaced Persons' },
  { value: 'rural', label: 'Rural Communities' },
  { value: 'urban', label: 'Urban Poor' },
  { value: 'environment', label: 'Environment & Wildlife' },
  { value: 'health', label: 'Healthcare Recipients' },
  { value: 'education', label: 'Education Seekers' }
];

const missionStatements = [
  'Empowering communities through sustainable development and education',
  'Providing quality healthcare access to underserved populations',
  'Creating environmental awareness and promoting conservation',
  'Supporting women and children through education and skill development',
  'Building sustainable livelihoods in rural communities'
];

// Generate a random year between 1990 and 2022
const getRandomYear = () => Math.floor(Math.random() * (2022 - 1990) + 1990);

// Generate different compliance scenarios
const getRandomCompliance = () => {
  const baseCompliance = ['pan', '12a', '80g']; // Basic compliance most NGOs have
  const additionalCompliance = ['darpan', 'gst', 'fcra', '501c', 'csr1'];
  
  // Randomly add additional compliance
  return additionalCompliance.reduce((acc, item) => {
    if (Math.random() > 0.6) acc.push(item);
    return acc;
  }, [...baseCompliance]);
};

const getRandomBeneficiaries = (options, max) => {
  const shuffled = [...options].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.floor(Math.random() * max) + 1);
};

const getRandomRatings = () => {
  return {
    digitalMarketing: Math.floor(Math.random() * 5) + 1,
    contentCreation: Math.floor(Math.random() * 5) + 1,
    websiteManagement: Math.floor(Math.random() * 5) + 1,
    dataAnalysis: Math.floor(Math.random() * 5) + 1
  };
};

const getRandomEventCapacity = () => {
  return {
    eventPlanning: Math.floor(Math.random() * 5) + 1,
    eventMarketing: Math.floor(Math.random() * 5) + 1,
    eventTicketing: Math.floor(Math.random() * 5) + 1,
    eventVolunteers: Math.floor(Math.random() * 5) + 1,
    eventFollowup: Math.floor(Math.random() * 5) + 1
  };
};

const generateBaseAnswers = () => {
  const baseAnswers = {
    // Basic Info & Mission
    ngoMission: missionStatements[Math.floor(Math.random() * missionStatements.length)],
    ngoPrimaryBeneficiaries: getRandomBeneficiaries(primaryBeneficiaries.map(b => b.value), 3),
    ngoSecondaryBeneficiaries: ['families', 'communities', 'institutions'].slice(0, Math.floor(Math.random() * 3) + 1),
    ngoIndirectBeneficiaries: ['broader_community', 'economy', 'environment'].slice(0, Math.floor(Math.random() * 3) + 1),
    
    // Digital presence
    ngoWebsite: Math.random() > 0.3 ? 'yes' : 'no',
    ngoSocialMedia: Math.random() > 0.3 ? 'yes' : 'no',
    ngoDonationPage: Math.random() > 0.5 ? 'yes' : 'no',
    ngoEmailMarketing: Math.random() > 0.5 ? 'yes' : 'no',
    ngoEmailFrequency: ['weekly', 'monthly', 'quarterly'][Math.floor(Math.random() * 3)],
    ngoDigitalSkills: getRandomRatings(),
    ngoOnlinePlatforms: Math.random() > 0.5 ? 'yes' : 'no',
    ngoOnlinePlatformsUsed: ['benevity', 'caf', 'globalgiving', 'giveindia', 'ketto'].slice(0, Math.floor(Math.random() * 5) + 1),
    ngoOnlineCampaigns: Math.random() > 0.4 ? 'yes' : 'no',
    ngoOnlineCampaignDetails: 'Successfully ran a crowdfunding campaign that raised ₹5,00,000 for COVID-19 relief work',
    ngoDigitalBudget: Math.random() > 0.5 ? 'yes' : 'no',
    ngoDigitalBudgetAmount: Math.floor(Math.random() * 500000) + 50000,
    
    // Volunteer information
    ngoVolunteers: Math.random() > 0.3 ? 'yes' : 'no',
    ngoVolunteersCount: Math.floor(Math.random() * 100) + 10,
    ngoVolunteerOperations: Math.random() > 0.4 ? 'yes' : 'no',
    ngoVolunteerPercentage: ['less25', '25to50', '51to75', 'over75'][Math.floor(Math.random() * 4)],
    ngoVolunteerManagement: Math.random() > 0.5 ? 'yes' : 'no',
    ngoVolunteerCapacity: String(Math.floor(Math.random() * 5) + 1),
    ngoVolunteerFundraising: Math.random() > 0.4 ? 'yes' : 'no',
    ngoVolunteerFundraisingActivities: ['events', 'campaigning', 'peer', 'digital', 'admin', 'donor'].slice(0, Math.floor(Math.random() * 6) + 1),
    ngoVolunteerChallenges: ['recruitment', 'training', 'retention', 'management', 'skills'].slice(0, Math.floor(Math.random() * 5) + 1),
    
    // Event capacity
    ngoEventExperience: Math.random() > 0.3 ? 'yes' : 'no',
    ngoEventCount: ['1to2', '3to5', '6to10', 'over10'][Math.floor(Math.random() * 4)],
    ngoEventTypes: ['galas', 'concerts', 'sports', 'auctions', 'community', 'online'].slice(0, Math.floor(Math.random() * 6) + 1),
    ngoEventCapacity: getRandomEventCapacity(),
    ngoEventVenues: Math.random() > 0.5 ? 'yes' : 'no',
    ngoEventVenueDetails: 'Access to community halls, school auditoriums, and open spaces for events',
    ngoVirtualEvents: Math.random() > 0.4 ? 'yes' : 'no',
    ngoVirtualEventTypes: ['webinars', 'livestreams', 'virtualauctions', 'onlinechallenges'].slice(0, Math.floor(Math.random() * 4) + 1),
    ngoEventBudget: Math.random() > 0.5 ? 'yes' : 'no',
    ngoEventBudgetAmount: Math.floor(Math.random() * 1000000) + 100000,
    
    // Network capacity
    ngoDonorDatabase: Math.random() > 0.4 ? 'yes' : 'no',
    ngoDonorCount: ['under100', '100to500', '500to1000', 'over1000'][Math.floor(Math.random() * 4)],
    ngoDonorRelationship: String(Math.floor(Math.random() * 5) + 1),
    ngoDonorStewardship: Math.random() > 0.5 ? 'yes' : 'no',
    ngoCorporateRelations: Math.random() > 0.5 ? 'yes' : 'no',
    ngoCorporatePartnersCount: ['1to3', '4to10', 'over10'][Math.floor(Math.random() * 3)],
    ngoCSRExperience: Math.random() > 0.6 ? 'yes' : 'no',
    ngoFoundationRelations: Math.random() > 0.5 ? 'yes' : 'no',
    ngoFoundationCount: ['1to3', '4to10', 'over10'][Math.floor(Math.random() * 3)],
    ngoFoundationRelationshipStrength: String(Math.floor(Math.random() * 5) + 1),
    ngoGrantWriting: Math.random() > 0.5 ? 'yes' : 'no',
    ngoGovernmentRelations: Math.random() > 0.6 ? 'yes' : 'no',
    ngoGovernmentFundingCount: ['1to3', '4to10', 'over10'][Math.floor(Math.random() * 3)],
    ngoGovernmentRelationshipStrength: String(Math.floor(Math.random() * 5) + 1),
    
    // Resource capacity
    ngoFundraisingDept: Math.random() > 0.5 ? 'yes' : 'no',
    ngoFundraisingStaffCount: Math.floor(Math.random() * 10) + 1,
    ngoFundraisingSkill: ['general', 'some', 'mix', 'specialized'][Math.floor(Math.random() * 4)],
    ngoVolunteerFundraisingSupport: Math.random() > 0.5 ? 'yes' : 'no',
    ngoVolunteerFundraisingCount: ['1to5', '6to20', '21to50', 'over50'][Math.floor(Math.random() * 4)],
    ngoFundraisingBudget: Math.floor(Math.random() * 1000000) + 100000,
    ngoFundraisingBudgetPercent: Math.floor(Math.random() * 15) + 5,
    ngoFundraisingCapital: ['yes', 'no', 'limited'][Math.floor(Math.random() * 3)],
    ngoRiskTolerance: ['yes', 'no', 'somewhat'][Math.floor(Math.random() * 3)],
    ngoCRM: Math.random() > 0.5 ? 'yes' : 'no',
    ngoTechInfrastructure: Math.random() > 0.3 ? 'yes' : 'no',
    ngoFinancialSystems: Math.random() > 0.4 ? 'yes' : 'no',
    ngoResourceConstraints: ['staff', 'skills', 'budget', 'volunteers', 'digital', 'tech'].slice(0, Math.floor(Math.random() * 6) + 1),
    
    // Goals and priorities
    ngoFundraisingGoals: ['increase', 'diversify', 'recurring', 'major', 'retention', 'awareness'].slice(0, Math.floor(Math.random() * 3) + 1),
    ngoFundingTarget: ['50to100k', '100to500k', '500kto1m', 'over1m'][Math.floor(Math.random() * 4)],
    ngoFundingPriority: ['shortterm', 'longterm', 'balance'][Math.floor(Math.random() * 3)],
    ngoDonorRelationshipType: ['transactional', 'recurring', 'engagement', 'major'].slice(0, Math.floor(Math.random() * 2) + 1),
    ngoRiskTolerance: ['riskaverse', 'moderate', 'riskseeking', 'depends'][Math.floor(Math.random() * 4)],
    ngoPreferredStrategies: 'Interested in digital fundraising, CSR partnerships, and foundation grants',
    ngoAvoidStrategies: 'Not interested in door-to-door fundraising or high-risk investments',
    ngoAdditionalConsiderations: 'Looking for sustainable long-term funding sources with focus on capacity building',
    
    // Compliance and registration
    ngoComplianceInProcess: ['12a', '80g', 'darpan', 'fcra', 'csr1'].slice(0, Math.floor(Math.random() * 3)),
    ngoFCRAProcessStage: ['initial', 'submitted', 'review', 'additional'][Math.floor(Math.random() * 4)],
    ngo501cProcessType: ['501c3', '501c4', 'other'][Math.floor(Math.random() * 3)],
    ngoAuditStatus: ['current', 'partial', 'pending'][Math.floor(Math.random() * 3)],
    ngoComplianceTeam: ['yes', 'no', 'outsourced'][Math.floor(Math.random() * 3)],
    ngoForeignComplianceReadiness: {
      docPreparation: Math.floor(Math.random() * 5) + 1,
      reportingCapacity: Math.floor(Math.random() * 5) + 1,
      bankAccounts: Math.floor(Math.random() * 5) + 1,
      complianceTracking: Math.floor(Math.random() * 5) + 1
    }
  };

  // Handle conditional answers based on yes/no questions
  if (baseAnswers.ngoSocialMedia === 'yes') {
    baseAnswers.ngoSocialMediaPlatforms = ['facebook', 'instagram', 'linkedin', 'twitter'].slice(0, Math.floor(Math.random() * 4) + 1);
  }

  if (baseAnswers.ngoEmailMarketing === 'yes') {
    baseAnswers.ngoEmailFrequency = ['weekly', 'biweekly', 'monthly', 'quarterly', 'less'][Math.floor(Math.random() * 5)];
  }

  if (baseAnswers.ngoDigitalBudget === 'yes') {
    baseAnswers.ngoDigitalBudgetAmount = Math.floor(Math.random() * 500000) + 50000;
  }

  if (baseAnswers.ngoVolunteers === 'yes') {
    baseAnswers.ngoVolunteersCount = Math.floor(Math.random() * 100) + 10;
  }

  if (baseAnswers.ngoEventExperience === 'yes') {
    baseAnswers.ngoEventCount = ['1to2', '3to5', '6to10', 'over10'][Math.floor(Math.random() * 4)];
    baseAnswers.ngoEventTypes = ['galas', 'concerts', 'sports', 'auctions'].slice(0, Math.floor(Math.random() * 4) + 1);
  }

  if (baseAnswers.ngoFundraisingDept === 'yes') {
    baseAnswers.ngoFundraisingStaffCount = Math.floor(Math.random() * 10) + 1;
  }

  return baseAnswers;
};

const scenarios = [
  {
    name: 'Educational Institution Scenario',
    generator: () => ({
      ngoName: 'Academic Excellence Foundation',
      ngoLocation: ['tier1'],
      ngoRegistrationType: 'educational',
      ngoYear: getRandomYear(),
      ngoComplianceStatus: [...getRandomCompliance(), '80g', '12a'],
      ngoForeignFundingIntent: 'yes',
      ngoScope: 'national',
      ngoBudget: Math.floor(Math.random() * 50000000) + 1000000,
      ngoStaff: Math.floor(Math.random() * 100) + 20,
      ...generateBaseAnswers(),
      // Educational specific overrides
      ngoPrimaryBeneficiaries: ['education', 'children', 'youth'],
      ngoMission: 'Providing quality education and fostering academic excellence',
      ngoEventTypes: ['seminars', 'workshops', 'conferences'],
      ngoFundraisingGoals: ['endowment', 'scholarships', 'infrastructure']
    })
  },
  {
    name: 'Rural Development Scenario',
    generator: () => ({
      ngoName: 'Rural Empowerment Trust',
      ngoLocation: ['rural', 'tier3'],
      ngoRegistrationType: 'trust',
      ngoYear: getRandomYear(),
      ngoComplianceStatus: getRandomCompliance(),
      ngoForeignFundingIntent: 'no',
      ngoScope: 'regional',
      ngoBudget: Math.floor(Math.random() * 2000000) + 100000,
      ngoStaff: Math.floor(Math.random() * 20) + 5,
      ...generateBaseAnswers(),
      // Rural specific overrides
      ngoPrimaryBeneficiaries: ['rural', 'farmers', 'women'],
      ngoMission: 'Empowering rural communities through sustainable development initiatives',
      ngoEventTypes: ['community_meetings', 'training_workshops'],
      ngoFundraisingGoals: ['sustainable_development', 'livelihood', 'infrastructure']
    })
  },
  {
    name: 'Urban Healthcare Scenario',
    generator: () => ({
      ngoName: 'Urban Health Initiative',
      ngoLocation: ['tier1', 'tier2'],
      ngoRegistrationType: 'hospital',
      ngoYear: getRandomYear(),
      ngoComplianceStatus: [...getRandomCompliance(), 'csr1'],
      ngoForeignFundingIntent: 'future',
      ngoScope: 'national',
      ngoBudget: Math.floor(Math.random() * 100000000) + 5000000,
      ngoStaff: Math.floor(Math.random() * 200) + 50,
      ...generateBaseAnswers(),
      // Healthcare specific overrides
      ngoPrimaryBeneficiaries: ['health', 'urban', 'elderly'],
      ngoMission: 'Providing accessible and quality healthcare to urban communities',
      ngoEventTypes: ['medical_camps', 'health_awareness', 'fundraising_galas'],
      ngoFundraisingGoals: ['medical_equipment', 'patient_care', 'research']
    })
  },
  {
    name: 'Bhumi NGO Scenario',
    generator: () => ({
      ngoName: 'Bhumi',
      ngoLocation: ['tier1', 'tier2', 'tier3'], // Multi-city presence
      ngoRegistrationType: 'trust',
      ngoYear: 2006, // Assuming a reasonable founding year for an established NGO
      // All compliances as specified
      ngoComplianceStatus: ['pan', '12a', '80g', 'darpan', 'fcra', 'csr1', 'gst', '501c'],
      ngoForeignFundingIntent: 'yes',
      ngoScope: 'national',
      ngoBudget: 500000000, // Rs 50 crores total budget based on given breakdown
      ngoStaff: 100, // 100 employees as specified
      
      // Override default generated answers with specific Bhumi details
      ngoMission: 'Transforming India through quality education for underprivileged children, environmental conservation, and volunteer engagement',
      ngoPrimaryBeneficiaries: ['education', 'environment', 'children', 'youth'],
      ngoSecondaryBeneficiaries: ['communities', 'institutions', 'volunteers'],
      ngoIndirectBeneficiaries: ['broader_community', 'economy', 'environment'],
      
      // Digital presence
      ngoWebsite: 'yes',
      ngoSocialMedia: 'yes',
      ngoSocialMediaPlatforms: ['facebook', 'instagram', 'linkedin', 'twitter', 'youtube'],
      ngoDonationPage: 'yes',
      ngoEmailMarketing: 'yes',
      ngoEmailFrequency: 'monthly',
      ngoDigitalSkills: {
        digitalMarketing: 5,
        contentCreation: 5,
        websiteManagement: 5,
        dataAnalysis: 4
      },
      ngoOnlinePlatforms: 'yes',
      ngoOnlinePlatformsUsed: ['giveindia', 'ketto', 'globalgiving', 'danamojo', 'razorpay'],
      ngoOnlineCampaigns: 'yes',
      ngoOnlineCampaignDetails: 'Multiple successful digital fundraising campaigns including annual volunteer fundraisers and special project campaigns',
      ngoDigitalBudget: 'yes',
      ngoDigitalBudgetAmount: 10000000, // Rs 1 crore for digital fundraising
      
      // Volunteer information (core strength of Bhumi)
      ngoVolunteers: 'yes',
      ngoVolunteersCount: 250000, // 250,000 volunteers annually as specified
      ngoVolunteerOperations: 'yes',
      ngoVolunteerPercentage: 'over75', // High volunteer involvement
      ngoVolunteerManagement: 'yes',
      ngoVolunteerCapacity: '5', // Expert level
      ngoVolunteerFundraising: 'yes',
      ngoVolunteerFundraisingActivities: ['events', 'campaigning', 'peer', 'digital', 'admin', 'donor'],
      ngoVolunteerFundraisingCount: 'over50', // 400 volunteers participate in fundraising
      
      // Event capacity
      ngoEventExperience: 'yes',
      ngoEventCount: 'over10',
      ngoEventTypes: ['community', 'online', 'educational', 'fundraising', 'awareness', 'environmental'],
      ngoEventCapacity: {
        eventPlanning: 5,
        eventMarketing: 5,
        eventTicketing: 5,
        eventVolunteers: 5,
        eventFollowup: 5
      },
      ngoEventVenues: 'yes',
      ngoVirtualEvents: 'yes',
      ngoVirtualEventTypes: ['webinars', 'livestreams', 'virtualauctions', 'onlinechallenges'],
      ngoEventBudget: 'yes',
      ngoEventBudgetAmount: 5000000, // Rs 50 lakhs for events
      
      // Network capacity
      ngoDonorDatabase: 'yes',
      ngoDonorCount: 'over1000',
      ngoDonorRelationship: '5', // Strong donor relationships
      ngoDonorStewardship: 'yes',
      ngoCorporateRelations: 'yes',
      ngoCorporatePartnersCount: 'over10', // Multiple CSR partners for Rs 35 crore
      ngoCSRExperience: 'yes',
      ngoCorporateRelationshipStrength: '5',
      ngoFoundationRelations: 'yes',
      ngoFoundationCount: 'over10', // Multiple foundation partners for Rs 10 crore
      ngoFoundationRelationshipStrength: '5',
      ngoGrantWriting: 'yes',
      
      // Resource capacity
      ngoFundraisingDept: 'yes',
      ngoFundraisingStaffCount: 15, // Estimate for a dedicated fundraising team
      ngoFundraisingSkill: 'specialized',
      ngoVolunteerFundraisingSupport: 'yes',
      ngoFundraisingBudget: 25000000, // Rs 2.5 crore (5% of total budget)
      ngoFundraisingBudgetPercent: 5,
      ngoFundraisingCapital: 'yes',
      ngoCRM: 'yes',
      ngoTechInfrastructure: 'yes',
      ngoFinancialSystems: 'yes',
      
      // Goals and priorities
      ngoFundraisingGoals: ['increase', 'diversify', 'recurring', 'major', 'retention'],
      ngoFundingTarget: 'over1m',
      ngoFundingPriority: 'balance',
      ngoDonorRelationshipType: ['recurring', 'engagement', 'major'],
      ngoRiskTolerance: 'moderate',
      
      // Foreign funding
      ngoFCRAValidity: 'yes',
      ngoForeignComplianceReadiness: {
        docPreparation: 5,
        reportingCapacity: 5,
        bankAccounts: 5,
        complianceTracking: 5
      },
      
      // Additional fund distribution information
      customFundingSources: {
        employeeGiving: 15000000, // Rs 1.5 crore
        peerToPeer: 15000000, // Rs 1.5 crore
        digitalFundraising: 5000000, // Rs 50 lakhs
        hniGiving: 5000000, // Rs 50 lakhs
        csr: 350000000, // Rs 35 crore
        foundationGrants: 100000000 // Rs 10 crore
      },
      
      ngoAuditStatus: 'current',
      ngoComplianceTeam: 'yes'
    })
  }
];

// Function to get a random scenario
export const getRandomScenario = () => {
  const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
  return {
    name: scenario.name,
    data: scenario.generator()
  };
};

// Function to generate completely random data
export const generateRandomAnswers = () => {
  return {
    ngoName: ngoNames[Math.floor(Math.random() * ngoNames.length)],
    ngoLocation: locations[Math.floor(Math.random() * locations.length)],
    ngoRegistrationType: registrationTypes[Math.floor(Math.random() * registrationTypes.length)],
    ngoYear: getRandomYear(),
    ngoComplianceStatus: getRandomCompliance(),
    ngoForeignFundingIntent: ['yes', 'no', 'future'][Math.floor(Math.random() * 3)],
    ngoScope: ['local', 'regional', 'national', 'international'][Math.floor(Math.random() * 4)],
    ngoBudget: Math.floor(Math.random() * 100000000) + 100000,
    ngoStaff: Math.floor(Math.random() * 200) + 1,
    ...generateBaseAnswers()
  };
};

// Function to get a specific scenario by name
export const getScenarioByName = (name) => {
  const scenario = scenarios.find(s => s.name === name);
  if (!scenario) return null;
  
  return {
    name: scenario.name,
    data: scenario.generator()
  };
};