// This file contains the fundraising strategies data and helper functions

// Define donor categories for better classification
const DONOR_CATEGORIES = {
  INDIVIDUAL: 'individual',
  CORPORATE: 'corporate',
  FOUNDATION_DOMESTIC: 'foundation_domestic',
  FOUNDATION_FOREIGN: 'foundation_foreign',
  FOUNDATION_RESTRICTED: 'foundation_restricted',
  GOVERNMENT: 'government',
  EDUCATIONAL: 'educational'
};

// Helper functions
const checkEducationalFocus = (answers = {}) => {
  // Only allow endowment funds for educational institutions
  return answers.ngoRegistrationType === 'educational';
};

const checkDonorRelationshipDuration = (answers = {}) => {
  return (answers.ngoDonorRelationshipYears || 0) >= 5;
};

const checkCSRCompliance = (compliance) => {
  return compliance.includes('csr1');
};

const checkFCRACompliance = (compliance = [], inProcess = []) => {
  return {
    hasFCRA: compliance.includes('fcra'),
    has501c: compliance.includes('501c'),
    processingFCRA: inProcess.includes('fcra'),
    processing501c: inProcess.includes('501c')
  };
};

// Add scoring bonuses for platform diversity
const calculatePlatformBonus = (platforms) => {
  const majorPlatforms = ['benevity', 'caf', 'yourcause', 'globalgiving'];
  const platformCount = platforms.filter(p => majorPlatforms.includes(p)).length;
  return Math.min(10, platformCount * 2.5); // Up to 10% bonus for platform diversity
};

// Add helper functions for text analysis
const missionKeywords = {
  'csr': ['impact', 'sustainable', 'development', 'community', 'social', 'responsibility'],
  'grants': ['research', 'project', 'program', 'impact', 'outcomes', 'evaluation'],
  'p2p': ['community', 'grassroots', 'people', 'social', 'change', 'support'],
  'crowdfunding': ['project', 'creative', 'innovative', 'community', 'impact'],
  'hniGiving': ['legacy', 'impact', 'transformation', 'leadership', 'vision'],
  'endowmentFunds': ['education', 'academic', 'learning', 'school', 'college', 'university', 'research', 'sustainability']
};

const analyzeMissionAlignment = (missionText, strategyType) => {
  if (!missionText || !missionKeywords[strategyType]) return 0;
  
  const keywords = missionKeywords[strategyType];
  const text = missionText.toLowerCase();
  const matchCount = keywords.filter(word => text.includes(word)).length;
  
  return Math.min(5, (matchCount / keywords.length) * 5);
};

// Helper functions for similarity index calculation
const calculateSimilarityScore = (strategy1Id, strategy2Id) => {
  // Find the strategy objects from the ID
  const strategy1 = strategiesData.find(s => s.id === strategy1Id);
  const strategy2 = strategiesData.find(s => s.id === strategy2Id);
  
  if (!strategy1 || !strategy2) return 0;
  
  // Base similarity if they're in the same donor category
  let similarityScore = 0;
  
  // Check if donor categories match and are defined
  if (strategy1.donorCategory && strategy2.donorCategory && strategy1.donorCategory === strategy2.donorCategory) {
    similarityScore += 0.5;
  }
  
  // Direct similarity relationship defined in the data
  if (strategy1.similarStrategies && strategy1.similarStrategies.includes(strategy2.id)) {
    similarityScore += 0.5;
  }
  
  // Look at resource requirements similarity - safely access nested properties
  const resourceReq1 = strategy1.scoringCriteria && strategy1.scoringCriteria.resourceRequirements ? strategy1.scoringCriteria.resourceRequirements : 3;
  const resourceReq2 = strategy2.scoringCriteria && strategy2.scoringCriteria.resourceRequirements ? strategy2.scoringCriteria.resourceRequirements : 3;
  
  const resourceDiff = Math.abs(resourceReq1 - resourceReq2);
  similarityScore += (1 - resourceDiff/4) * 0.3; // Up to 0.3 for resource similarity
  
  // Network leverage similarity - safely access nested properties
  const networkLev1 = strategy1.scoringCriteria && strategy1.scoringCriteria.networkLeverage ? strategy1.scoringCriteria.networkLeverage : 3;
  const networkLev2 = strategy2.scoringCriteria && strategy2.scoringCriteria.networkLeverage ? strategy2.scoringCriteria.networkLeverage : 3;
  
  const networkDiff = Math.abs(networkLev1 - networkLev2);
  similarityScore += (1 - networkDiff/4) * 0.2; // Up to 0.2 for network similarity
  
  return Math.min(1, similarityScore);
};

const findSimilarStrategies = (strategyId, strategiesData, threshold = 0.7) => {
  if (!strategiesData || !Array.isArray(strategiesData) || !strategyId) {
    return [];
  }
  
  const strategy = strategiesData.find(s => s && s.id === strategyId);
  
  if (!strategy) return [];
  
  return strategiesData
    .filter(s => s && s.id && s.id !== strategyId)
    .map(s => ({
      ...s,
      similarityScore: calculateSimilarityScore(strategyId, s.id)
    }))
    .filter(s => s.similarityScore >= threshold)
    .sort((a, b) => b.similarityScore - a.similarityScore);
};

// Group strategies by donor category for more focused recommendations
const getStrategiesByDonorCategory = () => {
  const categorized = {};
  
  Object.values(DONOR_CATEGORIES).forEach(category => {
    categorized[category] = strategiesData.filter(
      strategy => strategy.donorCategory === category
    );
  });
  
  return categorized;
};

// Define the strategies data
const strategiesData = [
  {
    id: 'p2p',
    name: 'Peer-to-Peer (P2P) Fundraising',
    description: 'Individuals raise money on behalf of an NGO, leveraging their personal networks.',
    donorCategory: DONOR_CATEGORIES.INDIVIDUAL,
    // Strategies with similar preparation, skills, and resources
    similarStrategies: ['crowdfunding', 'digitalFundraising'],
    suitableFor: {
      ngoMaturity: ['startup', 'growth', 'mature', 'established'],
      ngoSize: ['small', 'medium', 'large'],
      criteria: {
        volunteerBase: 2,
        digitalCapacity: 2,
        cause: 2,
        staff: 4
      }
    },
    scoringCriteria: {
      macroTrends: 5, // High relevance to current giving trends
      targetAudience: 5, // Excellent reach potential
      fundingScale: 3, // Updated to $100K-$1M typical range
      fundingTimeline: 4, // Quick (<3 months)
      implementationFeasibility: 4, // Relatively easy to implement
      resourceRequirements: 3, // Moderate resource needs
      networkLeverage: 4, // Strong network dependency
      executionRisk: 3, // Moderate execution risk
      scalabilityPotential: 5, // Highly scalable
      donorEngagement: 5, // High donor engagement
      missionAlignment: 4, // Good mission alignment
      complianceRequirements: 4 // Low compliance burden
    }
  },
  {
    id: 'crowdfunding',
    name: 'Reward-based Crowdfunding',
    description: 'Donors contribute for a tangible item or service in return for their support.',
    donorCategory: DONOR_CATEGORIES.INDIVIDUAL,
    similarStrategies: ['p2p', 'digitalFundraising'],
    suitableFor: {
      ngoMaturity: ['startup', 'growth'],
      ngoSize: ['small', 'medium'],
      criteria: {
        tangibleProduct: 1, // Required for reward-based crowdfunding
        digitalCapacity: 2,
        creativityCapacity: 2,
        productionCapability: 2
      }
    },
    scoringCriteria: {
      macroTrends: 4, // Increased due to platform expansion
      targetAudience: 4,
      fundingScale: 2, // $10K-$100K range
      fundingTimeline: 4,
      implementationFeasibility: 2,
      resourceRequirements: 2,
      networkLeverage: 3,
      executionRisk: 2,
      scalabilityPotential: 2,
      donorEngagement: 3,
      missionAlignment: 3,
      complianceRequirements: 4
    }
  },
  {
    id: 'digitalFundraising',
    name: 'Digital Fundraising',
    description: 'Online methods to raise money through platforms, email, and social media.',
    donorCategory: DONOR_CATEGORIES.INDIVIDUAL,
    similarStrategies: ['p2p', 'crowdfunding'],
    suitableFor: {
      ngoMaturity: ['startup', 'growth', 'mature', 'established'],
      ngoSize: ['small', 'medium', 'large'],
      criteria: {
        onlinePresence: 1,
        digitalCapacity: 1,
        platformDiversity: 1, // New criteria for multiple platform usage
        contentCreation: 1,
        techSavvy: 2,
        relatableCause: 2  // Added for instant connection requirement
      }
    },
    scoringCriteria: {
      macroTrends: 5, // Strong alignment with digital giving trends
      targetAudience: 5, // Wide reach potential
      fundingScale: 4, // Updated to $1M-$10M potential with multiple platforms
      fundingTimeline: 5, // Very quick access
      implementationFeasibility: 3, // Moderate complexity
      resourceRequirements: 3, // Moderate resource needs
      networkLeverage: 3, // Moderate network dependency
      executionRisk: 3, // Moderate risk
      scalabilityPotential: 5, // Highly scalable
      donorEngagement: 4, // Good engagement potential
      missionAlignment: 4, // Good mission alignment
      complianceRequirements: 4 // Low compliance burden
    }
  },
  {
    id: 'doorToDoor',
    name: 'Door-to-Door Fundraising (F2F)',
    description: 'Fundraisers solicit donations by visiting homes or approaching people in public spaces.',
    donorCategory: DONOR_CATEGORIES.INDIVIDUAL,
    similarStrategies: ['eventBased'],
    suitableFor: {
      ngoMaturity: ['growth', 'mature'],
      ngoSize: ['medium', 'large'],
      criteria: {
        relatableCause: 2,  // Increased importance of relatable cause
        localPresence: 1,
        volunteerBase: 1,
        trainingCapacity: 2,
        instantConnection: 2  // Added for cause connection requirement
      }
    },
    scoringCriteria: {
      macroTrends: 2,
      targetAudience: 3,
      fundingScale: 2,
      fundingTimeline: 3,
      implementationFeasibility: 3,
      resourceRequirements: 2,
      networkLeverage: 2,
      executionRisk: 3,
      scalabilityPotential: 3,
      donorEngagement: 4,
      missionAlignment: 3,
      complianceRequirements: 3
    }
  },
  {
    id: 'hniGiving',
    name: 'HNI/UHNI Giving',
    description: 'Targeting wealthy individuals for significant donations.',
    donorCategory: DONOR_CATEGORIES.INDIVIDUAL,
    similarStrategies: ['legacyGiving'],
    suitableFor: {
      ngoMaturity: ['growth', 'mature', 'established'],
      ngoSize: ['medium', 'large'],
      criteria: {
        provenImpact: 1,
        resonatingCause: 2,
        reputation: 1,
        networkAccess: 1
      }
    },
    scoringCriteria: {
      macroTrends: 4,
      targetAudience: 2,
      fundingScale: 5,
      fundingTimeline: 2,
      implementationFeasibility: 2,
      resourceRequirements: 2,
      networkLeverage: 1,
      executionRisk: 3,
      scalabilityPotential: 4,
      donorEngagement: 5,
      missionAlignment: 4,
      complianceRequirements: 3
    }
  },
  {
    id: 'checkoutCharity',
    name: 'Check-out Charity Partnerships',
    description: 'Businesses ask customers for small donations at checkout.',
    donorCategory: DONOR_CATEGORIES.CORPORATE,
    similarStrategies: ['employeeGiving', 'matchingDonations'],
    suitableFor: {
      ngoMaturity: ['growth', 'mature', 'established'],
      ngoSize: ['medium', 'large'],
      criteria: {
        recognizableCause: 1,
        brandName: 2,
        corporateRelationships: 1,
        marketingCapacity: 2
      }
    },
    scoringCriteria: {
      macroTrends: 3,
      targetAudience: 4,
      fundingScale: 3,
      fundingTimeline: 3,
      implementationFeasibility: 2,
      resourceRequirements: 3,
      networkLeverage: 1,
      executionRisk: 3,
      scalabilityPotential: 4,
      donorEngagement: 2,
      missionAlignment: 3,
      complianceRequirements: 4
    }
  },
  {
    id: 'eventBased',
    name: 'Event-based Fundraising',
    description: 'Hosting events for donations such as galas, concerts, sports events, or auctions.',
    donorCategory: DONOR_CATEGORIES.INDIVIDUAL,
    similarStrategies: ['doorToDoor'],
    suitableFor: {
      ngoMaturity: ['growth', 'mature', 'established'],
      ngoSize: ['medium', 'large'],
      criteria: {
        supporterBase: 1,
        publicVisibility: 2,
        eventManagementCapacity: 1,
        volunteerBase: 2
      }
    },
    scoringCriteria: {
      macroTrends: 3, // Stable method
      targetAudience: 4, // Good reach
      fundingScale: 3, // $100k-$1M potential
      fundingTimeline: 3, // Medium timeline
      implementationFeasibility: 3, // Moderate complexity
      resourceRequirements: 2, // High resources
      networkLeverage: 4, // Strong network importance
      executionRisk: 3, // Moderate risk
      scalabilityPotential: 3, // Moderate scaling
      donorEngagement: 5, // High engagement
      missionAlignment: 4, // Good alignment
      complianceRequirements: 3 // Moderate compliance
    }
  },
  {
    id: 'csr',
    name: 'Corporate Social Responsibility (CSR)',
    description: 'Corporations donate profits to NGOs as part of their CSR initiatives.',
    donorCategory: DONOR_CATEGORIES.CORPORATE,
    similarStrategies: ['employeeGiving', 'matchingDonations'],
    suitableFor: {
      ngoMaturity: ['growth', 'mature', 'established'],
      ngoSize: ['medium', 'large'],
      criteria: {
        establishedNGO: 1,
        clearImpactMetrics: 1,
        corporateAlignedSector: 1,
        transparency: 1,
        eventCapacity: 2, // Added as it can help with CSR compliance
        csrCompliance: 1  // Essential for CSR funding
      }
    },
    scoringCriteria: {
      macroTrends: 4, // Growing CSR focus
      targetAudience: 3, // Moderate corporate pool
      fundingScale: 4, // $1M-$10M potential
      fundingTimeline: 2, // Long timeline
      implementationFeasibility: 2, // Complex partnerships
      resourceRequirements: 2, // High resource needs
      networkLeverage: 5, // Critical network importance
      executionRisk: 3, // Moderate risk
      scalabilityPotential: 4, // Good scaling potential
      donorEngagement: 4, // Good engagement level
      missionAlignment: 4, // Good mission alignment
      complianceRequirements: 1 // Increased compliance requirement
    }
  },
  {
    id: 'grants',
    name: 'Domestic Foundation Grants',
    description: 'Non-repayable funds for specific projects from domestic foundations.',
    donorCategory: DONOR_CATEGORIES.FOUNDATION_DOMESTIC,
    similarStrategies: ['endowmentFunds', 'governmentGrants'],
    suitableFor: {
      ngoMaturity: ['growth', 'mature', 'established'],
      ngoSize: ['medium', 'large'],
      criteria: {
        establishedTrackRecord: 1,
        specificProjects: 1,
        grantWritingCapacity: 1,
        complianceCapacity: 1
      }
    },
    scoringCriteria: {
      macroTrends: 3,
      targetAudience: 3,
      fundingScale: 4,
      fundingTimeline: 2,
      implementationFeasibility: 3,
      resourceRequirements: 2,
      networkLeverage: 4,
      executionRisk: 3,
      scalabilityPotential: 4,
      donorEngagement: 3,
      missionAlignment: 5,
      complianceRequirements: 2
    }
  },
  {
    id: 'foreignGrants',
    name: 'International Foundation Grants',
    description: 'Grants from international foundations requiring FCRA compliance.',
    donorCategory: DONOR_CATEGORIES.FOUNDATION_FOREIGN,
    similarStrategies: ['grants', 'foreignRFPs'],
    suitableFor: {
      ngoMaturity: ['growth', 'mature', 'established'],
      ngoSize: ['medium', 'large'],
      criteria: {
        establishedTrackRecord: 1,
        specificProjects: 1,
        grantWritingCapacity: 1,
        complianceCapacity: 1,
        fcraNecessary: 1,
        internationalStandards: 1
      }
    },
    scoringCriteria: {
      macroTrends: 4,
      targetAudience: 3,
      fundingScale: 5,
      fundingTimeline: 1,
      implementationFeasibility: 2,
      resourceRequirements: 1,
      networkLeverage: 5,
      executionRisk: 2,
      scalabilityPotential: 5,
      donorEngagement: 3,
      missionAlignment: 5,
      complianceRequirements: 1
    }
  },
  {
    id: 'foreignRFPs',
    name: 'International RFPs & Limited Pool Grants',
    description: 'Competitive international RFPs and restricted pool grant opportunities.',
    donorCategory: DONOR_CATEGORIES.FOUNDATION_RESTRICTED,
    similarStrategies: ['foreignGrants', 'grants'],
    suitableFor: {
      ngoMaturity: ['mature', 'established'],
      ngoSize: ['medium', 'large'],
      criteria: {
        establishedTrackRecord: 1,
        specificProjects: 1,
        grantWritingCapacity: 1,
        complianceCapacity: 1,
        fcraOnly: 1,
        competitiveBidding: 1
      }
    },
    scoringCriteria: {
      macroTrends: 3,
      targetAudience: 2,
      fundingScale: 4,
      fundingTimeline: 1,
      implementationFeasibility: 1,
      resourceRequirements: 1,
      networkLeverage: 5,
      executionRisk: 1,
      scalabilityPotential: 4,
      donorEngagement: 3,
      missionAlignment: 5,
      complianceRequirements: 1
    }
  },
  {
    id: 'matchingDonations',
    name: 'Matching Donations',
    description: 'Corporation or major donor matches individual donations during campaigns.',
    donorCategory: DONOR_CATEGORIES.CORPORATE,
    similarStrategies: ['employeeGiving', 'csr'],
    suitableFor: {
      ngoMaturity: ['growth', 'mature', 'established'],
      ngoSize: ['small', 'medium', 'large'],
      criteria: {
        corporatePartnerships: 1,
        digitalPresence: 2,
        donorBase: 2,
        campaignCapacity: 2
      }
    },
    scoringCriteria: {
      macroTrends: 4, // Growing popularity
      targetAudience: 4, // Good reach
      fundingScale: 3, // $100k-$1M potential
      fundingTimeline: 3, // Medium timeline
      implementationFeasibility: 3, // Moderate complexity
      resourceRequirements: 3, // Moderate resources
      networkLeverage: 4, // Strong network importance
      executionRisk: 3, // Moderate risk
      scalabilityPotential: 4, // Good scaling
      donorEngagement: 5, // High engagement
      missionAlignment: 4, // Good alignment
      complianceRequirements: 3 // Moderate compliance
    }
  },
  {
    id: 'employeeGiving',
    name: 'Employee Giving',
    description: 'Employees donate a portion of their salary, and the company transfers to an NGO.',
    donorCategory: DONOR_CATEGORIES.CORPORATE,
    similarStrategies: ['matchingDonations', 'csr'],
    suitableFor: {
      ngoMaturity: ['growth', 'mature', 'established'],
      ngoSize: ['small', 'medium', 'large'],
      criteria: {
        corporateVolunteering: 2,
        corporatePartnerships: 1,
        relatedCause: 2,
        marketingCapacity: 3
      }
    },
    scoringCriteria: {
      macroTrends: 3,
      targetAudience: 3,
      fundingScale: 2,
      fundingTimeline: 3,
      implementationFeasibility: 3,
      resourceRequirements: 4,
      networkLeverage: 2,
      executionRisk: 4,
      scalabilityPotential: 3,
      donorEngagement: 3,
      missionAlignment: 3,
      complianceRequirements: 4
    }
  },
  {
    id: 'legacyGiving',
    name: 'Legacy Giving',
    description: 'Donors commit funds or assets after their death through wills and trusts.',
    donorCategory: DONOR_CATEGORIES.INDIVIDUAL,
    similarStrategies: ['hniGiving', 'endowmentFunds'],
    suitableFor: {
      ngoMaturity: ['mature', 'established'],  // Only for older NGOs
      ngoSize: ['medium', 'large'],
      criteria: {
        reputation: 1,
        longTermVision: 1,
        donorEngagement: 1,
        legalKnowledge: 2,
        donorRelationshipYears: 5  // Minimum years of donor relationships
      }
    },
    scoringCriteria: {
      macroTrends: 3,
      targetAudience: 2,
      fundingScale: 5,
      fundingTimeline: 1,
      implementationFeasibility: 3,
      resourceRequirements: 3,
      networkLeverage: 3,
      executionRisk: 3,
      scalabilityPotential: 3,
      donorEngagement: 5,
      missionAlignment: 5,
      complianceRequirements: 2
    }
  },
  {
    id: 'endowmentFunds',
    name: 'Educational Endowment Funds',
    description: 'Build a permanent financial foundation through endowment funds (for educational institutions only)',
    donorCategory: DONOR_CATEGORIES.EDUCATIONAL,
    suitableFor: {
      ngoMaturity: ['established', 'mature'],
      ngoSize: ['medium', 'large'],
      // Only allow for educational institutions
      registrationType: ['educational']
    },
    scoringCriteria: {
      fundingScale: 5,
      fundingTimeline: 1,
      networkLeverage: 4,
      resourceRequirements: 5,
      complianceRequirements: 5,
      implementationFeasibility: 2,
      scalabilityPotential: 5,
      donorEngagement: 4,
      macroTrends: 3,
      executionRisk: 4
    },
    similarStrategies: ['grants', 'legacyGiving'],
    prerequisiteChecks: [
      {
        type: 'registrationType',
        value: 'educational',
        errorMessage: 'Endowment funds are only available for registered educational institutions'
      }
    ]
  },
  {
    id: 'governmentGrants',
    name: 'Government Grants/Schemes',
    description: 'Funding from government entities for specific public service initiatives.',
    donorCategory: DONOR_CATEGORIES.GOVERNMENT,
    similarStrategies: ['grants'],
    suitableFor: {
      ngoMaturity: ['growth', 'mature', 'established'],
      ngoSize: ['medium', 'large'],
      criteria: {
        establishedTrackRecord: 1,
        governmentRelations: 1,
        complianceCapacity: 1,
        publicServiceAlignment: 1
      }
    },
    scoringCriteria: {
      macroTrends: 3, // Stable source
      targetAudience: 2, // Limited opportunity pool
      fundingScale: 4, // $1M-$10M potential
      fundingTimeline: 1, // Long timeline (12+ months)
      implementationFeasibility: 1, // Very complex process
      resourceRequirements: 1, // Very high resource needs
      networkLeverage: 5, // Critical network importance
      executionRisk: 2, // High risk
      scalabilityPotential: 3, // Moderate scaling potential
      donorEngagement: 2, // Limited engagement
      missionAlignment: 5, // Strong alignment needed
      complianceRequirements: 1 // Very high compliance burden
    }
  }
];

// Export all needed functions and data
export {
  strategiesData,
  calculatePlatformBonus,
  analyzeMissionAlignment,
  missionKeywords,
  calculateSimilarityScore,
  findSimilarStrategies,
  getStrategiesByDonorCategory,
  DONOR_CATEGORIES,
  checkCSRCompliance,
  checkEducationalFocus,
  checkDonorRelationshipDuration,
  checkFCRACompliance
};