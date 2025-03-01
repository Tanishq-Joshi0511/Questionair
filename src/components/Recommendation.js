import React, { useState } from 'react';
import { 
  strategiesData, 
  calculatePlatformBonus, 
  analyzeMissionAlignment,
  findSimilarStrategies,
  calculateSimilarityScore,
  checkEducationalFocus,
  checkDonorRelationshipDuration,
  DONOR_CATEGORIES,
  checkFCRACompliance
} from '../data/strategiesData';
import {
  combinedRecommendation,
  scoringBasedRecommendation,
  ruleBasedRecommendation,
  collaborativeRecommendation,
  getConfidenceLevel
} from '../utils/recommendationAlgorithms';
import StrategyComparison from './StrategyComparison';
import './Recommendation.css';

const Recommendation = ({ answers, onBackClick }) => {
  // State for algorithm selection
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('combined');
  const [showComparison, setShowComparison] = useState(false);
  
  // Basic NGO profile calculation functions
  const calculateNGOMaturity = () => {
    const currentYear = new Date().getFullYear();
    const foundingYear = parseInt(answers.ngoYear);
    const ageInYears = currentYear - foundingYear;
    
    // Enhanced maturity calculation based on detailed guidelines
    if (ageInYears < 3) {
      // Startup/Early Stage (Stage 1)
      return 'startup';
    } else if (ageInYears < 7) {
      // Growth Stage (Stage 2)
      return 'growth';
    } else if (ageInYears < 15) {
      // Mature Stage (Stage 3)
      return 'mature';
    } else {
      // Established/Large Stage (Stage 4)
      return 'established';
    }
  };
  
  const calculateNGOSize = () => {
    const budget = parseInt(answers.ngoBudget) || 0;
    const staff = parseInt(answers.ngoStaff) || 0;
    
    // Use exact ranges from guidelines in USD
    // Small: Under $500,000 USD with fewer than 10 staff
    // Medium: $500,000 - $5M USD with 10-50 staff
    // Large: Over $5M USD with 50+ staff
    const budgetUSD = budget / 75; // Convert INR to USD (approximate rate)

    if (budgetUSD < 500000 && staff < 10) {
      return 'small';
    } else if (budgetUSD < 5000000 && staff < 50) {
      return 'medium';
    } else {
      return 'large';
    }
  };
  
  // Digital capacity assessment
  const calculateDigitalCapacity = () => {
    let score = 0;
    
    // Check website presence
    if (answers.ngoWebsite === 'yes') score += 1;
    
    // Check social media presence
    if (answers.ngoSocialMedia === 'yes') score += 1;
    
    // Check donation page
    if (answers.ngoDonationPage === 'yes') score += 1;
    
    // Check email marketing
    if (answers.ngoEmailMarketing === 'yes') score += 1;
    
    // Check online platforms usage
    if (answers.ngoOnlinePlatforms === 'yes') score += 1;
    
    // Check digital skills if rated
    if (answers.ngoDigitalSkills) {
      const { digitalMarketing, contentCreation, websiteManagement, dataAnalysis } = answers.ngoDigitalSkills;
      const avgSkill = (parseInt(digitalMarketing) + parseInt(contentCreation) + 
                      parseInt(websiteManagement) + parseInt(dataAnalysis)) / 4;
      
      if (avgSkill >= 3) score += 1;
    }
    
    // Check if has digital budget
    if (answers.ngoDigitalBudget === 'yes') score += 1;
    
    // Check online campaign experience
    if (answers.ngoOnlineCampaigns === 'yes') score += 1;
    
    return score; // 0-8 scale
  };
  
  // Enhanced volunteer capacity assessment
  const calculateVolunteerCapacity = () => {
    let score = 0;
    
    // Check basic volunteer engagement
    if (answers.ngoVolunteers === 'yes') {
      score += 1;
      
      // Check volunteer count if available
      const volunteerCount = parseInt(answers.ngoVolunteersCount) || 0;
      if (volunteerCount > 10) score += 1;
      if (volunteerCount > 50) score += 1;
    }
    
    // Check reliance on volunteers for operations
    if (answers.ngoVolunteerOperations === 'yes') {
      score += 1;
      
      // Check percentage of work by volunteers
      if (answers.ngoVolunteerPercentage === '25to50') score += 1;
      if (answers.ngoVolunteerPercentage === '51to75') score += 2;
      if (answers.ngoVolunteerPercentage === 'over75') score += 3;
    }
    
    // Check volunteer management program
    if (answers.ngoVolunteerManagement === 'yes') score += 1;
    
    // Check volunteer capacity rating
    if (answers.ngoVolunteerCapacity && parseInt(answers.ngoVolunteerCapacity) >= 3) score += 1;
    
    // Check previous volunteer involvement in fundraising
    if (answers.ngoVolunteerFundraising === 'yes') score += 2;
    
    return score; // 0-10 scale, normalized to 0-5 for scoring
  };
  
  // Event organization capacity
  const calculateEventCapacity = () => {
    let score = 0;
    
    // Check event experience
    if (answers.ngoEventExperience === 'yes') {
      score += 1;
      
      // Check number of events organized
      if (answers.ngoEventCount === '3to5') score += 1;
      if (answers.ngoEventCount === '6to10') score += 2;
      if (answers.ngoEventCount === 'over10') score += 3;
      
      // Check event types diversity (more types = more experience)
      if (answers.ngoEventTypes && answers.ngoEventTypes.length > 3) score += 1;
    }
    
    // Check event capacity ratings if available
    if (answers.ngoEventCapacity) {
      const { eventPlanning, eventMarketing, eventTicketing, eventVolunteers, eventFollowup } = answers.ngoEventCapacity;
      const avgEventSkill = (parseInt(eventPlanning || 0) + parseInt(eventMarketing || 0) + 
                          parseInt(eventTicketing || 0) + parseInt(eventVolunteers || 0) + 
                          parseInt(eventFollowup || 0)) / 5;
      
      if (avgEventSkill >= 3) score += 2;
      if (avgEventSkill >= 4) score += 1;
    }
    
    // Check venue access
    if (answers.ngoEventVenues === 'yes') score += 1;
    
    // Check virtual event experience
    if (answers.ngoVirtualEvents === 'yes') score += 1;
    
    // Check event budget allocation
    if (answers.ngoEventBudget === 'yes') score += 1;
    
    return score; // 0-10 scale, normalized to 0-5 for scoring
  };
  
  // Network strength assessments
  const calculateCorporateNetworkStrength = () => {
    let score = 0;
    
    // Check if NGO has corporate relationships
    if (answers.ngoCorporateRelations === 'yes') {
      score += 1;
      
      // Check corporate partners count if available
      if (answers.ngoCorporatePartnersCount === '1to3') score += 1;
      if (answers.ngoCorporatePartnersCount === '4to10') score += 2;
      if (answers.ngoCorporatePartnersCount === 'over10') score += 3;
    }
    
    // Check corporate relationship strength rating
    if (answers.ngoCorporateRelationshipStrength && parseInt(answers.ngoCorporateRelationshipStrength) >= 3) score += 1;
    
    // Check CSR experience
    if (answers.ngoCSRExperience === 'yes') score += 1;
    
    return score; // 0-6 scale
  };
  
  const calculateIndividualDonorNetworkStrength = () => {
    let score = 0;
    
    // Check if NGO has donor database
    if (answers.ngoDonorDatabase === 'yes') score += 1;
    
    // Check donor count
    if (answers.ngoDonorCount === '100to500') score += 1;
    if (answers.ngoDonorCount === '500to1000') score += 2;
    if (answers.ngoDonorCount === 'over1000') score += 3;
    
    // Check relationship strength
    if (answers.ngoDonorRelationship && parseInt(answers.ngoDonorRelationship) >= 3) score += 1;
    
    // Check donor stewardship system
    if (answers.ngoDonorStewardship === 'yes') score += 1;
    
    return score; // 0-6 scale
  };
  
  const calculateFoundationNetworkStrength = () => {
    let score = 0;
    
    // Check if NGO has foundation relationships
    if (answers.ngoFoundationRelations === 'yes') {
      score += 1;
      
      // Check foundation count
      if (answers.ngoFoundationCount === '1to3') score += 1;
      if (answers.ngoFoundationCount === '4to10') score += 2;
      if (answers.ngoFoundationCount === 'over10') score += 3;
    }
    
    // Check relationship strength
    if (answers.ngoFoundationRelationshipStrength && parseInt(answers.ngoFoundationRelationshipStrength) >= 3) score += 1;
    
    // Check grant writing capacity
    if (answers.ngoGrantWriting === 'yes') score += 1;
    
    return score; // 0-6 scale
  };
  
  const calculateFundraisingCapacity = () => {
    let score = 0;
    
    // Check if NGO has dedicated fundraising department
    if (answers.ngoFundraisingDept === 'yes') {
      score += 1;
      
      // Check fundraising staff count
      const fundraisingStaff = parseInt(answers.ngoFundraisingStaffCount) || 0;
      if (fundraisingStaff >= 2) score += 1;
    }
    
    // Check fundraising skill level
    if (answers.ngoFundraisingSkill === 'some') score += 1;
    if (answers.ngoFundraisingSkill === 'mix') score += 2;
    if (answers.ngoFundraisingSkill === 'specialized') score += 3;
    
    // Check volunteer fundraising support
    if (answers.ngoVolunteerFundraisingSupport === 'yes') score += 1;
    
    // Check fundraising budget as percentage of operating budget
    const budgetPercent = parseFloat(answers.ngoFundraisingBudgetPercent) || 0;
    if (budgetPercent >= 10) score += 1;
    
    // Check available capital
    if (answers.ngoFundraisingCapital === 'yes') score += 2;
    if (answers.ngoFundraisingCapital === 'limited') score += 1;
    
    // Check technology infrastructure
    if (answers.ngoCRM === 'yes') score += 1;
    if (answers.ngoFinancialSystems === 'yes') score += 1;
    
    return score; // 0-12 scale, normalized to 0-5 for scoring
  };

  // Compliance readiness assessment
  const calculateComplianceReadiness = (strategy) => {
    let score = 0;
    const compliance = answers.ngoComplianceStatus || [];
    const inProcess = answers.ngoComplianceInProcess || [];
    
    // Basic compliance score (max 10 points)
    if (compliance.includes('pan')) score += 1;
    if (compliance.includes('12a')) score += 2;
    if (compliance.includes('80g')) score += 2;
    
    // Strategy-specific compliance scoring
    switch(strategy.id) {
      case 'csr':
      case 'employeeGiving':
        // CSR requires CSR-1 registration
        if (!compliance.includes('csr1')) {
          score = 0; // Zero score if no CSR-1
        } else {
          score += 5;
        }
        // Event capacity can help with CSR compliance
        if (calculateEventCapacity() >= 4) score += 2;
        break;
        
      case 'endowmentFunds':
        // Only recommend endowment funds for educational institutions
        if (!checkEducationalFocus(answers)) {
          score = 0; // Not eligible
        } else {
          score += 5; // High score for eligible educational institutions
        }
        break;
        
      case 'legacyGiving':
        // Legacy giving needs long-term donor relationships
        if (!checkDonorRelationshipDuration(answers)) {
          score = 0;
        } else {
          score += 4;
        }
        break;
        
      case 'crowdfunding':
        // Check if NGO has a product/service to offer
        if (!answers.ngoHasProduct) {
          score = 0;
        } else {
          score += 3;
        }
        break;
        
      case 'grants':
        // Foundation grants often require extensive compliance
        if (compliance.includes('fcra')) score += 3;
        if (compliance.includes('80g')) score += 2;
        break;
        
      case 'hniGiving':
      case 'digitalFundraising':
        // Individual donations need 80G
        if (compliance.includes('80g')) score += 3;
        if (compliance.includes('12a')) score += 2;
        break;
        
      default:
        // Basic compliance good enough for simpler strategies
        if (compliance.includes('80g')) score += 2;
        if (compliance.includes('12a')) score += 2;
    }
    
    // Additional compliance strength factors
    if (compliance.includes('darpan')) score += 1;
    if (compliance.includes('itr') && compliance.includes('form10b')) score += 2;
    if (answers.ngoAuditStatus === 'current') score += 2;
    if (answers.ngoComplianceTeam === 'yes' || answers.ngoComplianceTeam === 'outsourced') score += 1;

    return {
      score: Math.min(10, score), // Scale to 0-10
      hasEssentials: compliance.includes('pan') && 
                    (compliance.includes('12a') || inProcess.includes('12a')) &&
                    (compliance.includes('80g') || inProcess.includes('80g')),
      readyForCSR: compliance.includes('csr1'),
      readyForFCRA: compliance.includes('fcra') || inProcess.includes('fcra'),
      auditStatus: answers.ngoAuditStatus,
      hasEventCapability: calculateEventCapacity() >= 4
    };
  };

  const calculateRiskProfile = (strategy, ngoMaturity, ngoSize) => {
    let riskScore = 0;
    const riskTolerance = answers.ngoRiskTolerance || 'moderate';
    const executionRisk = strategy.scoringCriteria.executionRisk || 3;

    // Base risk scoring from matrix guidelines
    if ((riskTolerance === 'riskaverse' && executionRisk <= 2) ||
        (riskTolerance === 'riskseeking' && executionRisk >= 4) ||
        (riskTolerance === 'moderate' && executionRisk === 3)) {
      riskScore += 7;
    }

    // Stage-specific risk evaluation
    switch(ngoMaturity) {
      case 'startup':
        // Higher risk for complex strategies
        if (strategy.scoringCriteria.implementationFeasibility <= 2) {
          riskScore -= 3;
        }
        // Lower risk for digital/individual strategies
        if (['digitalFundraising', 'p2p', 'crowdfunding'].includes(strategy.id)) {
          riskScore += 3;
        }
        break;

      case 'growth':
        // Medium risk tolerance
        if (strategy.scoringCriteria.scalabilityPotential >= 4) {
          riskScore += 2;
        }
        break;

      case 'mature':
        // Can handle more complex strategies
        if (strategy.scoringCriteria.implementationFeasibility <= 2) {
          riskScore += 1;
        }
        break;

      case 'established':
        // Strong risk management capacity
        riskScore += 2;
        break;

      default:
        // Default to conservative risk assessment for unknown maturity levels
        riskScore += 1;
        break;
    }

    // Size-specific risk factors
    switch(ngoSize) {
      case 'small':
        if (strategy.scoringCriteria.resourceRequirements >= 4) {
          riskScore -= 2;
        }
        break;

      case 'medium':
        if (strategy.scoringCriteria.resourceRequirements >= 3) {
          riskScore += 1;
        }
        break;

      case 'large':
        riskScore += 2;
        break;

      default:
        // Default to medium size risk assessment
        riskScore += 1;
    }

    // Grant/CSR specific risk factors
    if (strategy.id === 'grants') {
      const hasGrantWriting = answers.ngoGrantWriting === 'yes';
      const hasComplianceSystem = answers.ngoComplianceSystem === 'yes';
      riskScore += (hasGrantWriting && hasComplianceSystem) ? 3 : -2;
    } else if (strategy.id === 'csr' || strategy.id === 'employeeGiving') {
      const hasCSRExperience = answers.ngoCSRExperience === 'yes';
      const hasCorporateNetwork = calculateCorporateNetworkStrength() >= 3;
      riskScore += (hasCSRExperience && hasCorporateNetwork) ? 3 : -2;
    } else {
      // Default risk assessment for other strategies
      riskScore += 1;
    }

    const riskLevel = riskScore >= 15 ? 'Optimal' :
                     riskScore >= 10 ? 'Acceptable' : 'Cautious';

    // Risk insights based on Decision Matrix criteria
    const riskInsights = [];
    if (executionRisk <= 2) {
      riskInsights.push('Low execution risk, good fit for risk-averse organizations');
    } else if (executionRisk >= 4) {
      riskInsights.push('Higher execution risk, requires strong risk management');
    }

    return {
      score: Math.min(20, riskScore),
      level: riskLevel,
      insights: riskInsights,
      maturityAligned: strategy.suitableFor.ngoMaturity.includes(ngoMaturity)
    };
  };

  // Add new scoring function for mission alignment
  const calculateMissionAlignment = (strategy) => {
    let score = 0;
    const missionDesc = answers.ngoMission || '';
    const primaryBeneficiaries = answers.ngoPrimaryBeneficiaries || [];
    const secondaryBeneficiaries = answers.ngoSecondaryBeneficiaries || [];

    // Base mission alignment scoring
    if (strategy.id === 'csr' || strategy.id === 'grants') {
      if (missionDesc.length > 200) score += 2;
      if ((primaryBeneficiaries.length + secondaryBeneficiaries.length) >= 4) score += 2;
    }

    // Check for instant connection causes
    if (['p2p', 'crowdfunding', 'digitalFundraising', 'doorToDoor'].includes(strategy.id)) {
      const instantConnectCauses = ['children', 'animals', 'education', 'health', 'environment', 'disaster'];
      const hasInstantConnect = primaryBeneficiaries.some(cause => instantConnectCauses.includes(cause));
      if (hasInstantConnect) score += 3;
    }

    // Special handling for educational endowments
    if (strategy.id === 'endowmentFunds') {
      if (answers.ngoRegistrationType !== 'educational') {
        score = 0; // Zero score if not an educational institution
      } else {
        score += 5; // Bonus for educational institution
      }
    }

    return Math.min(5, score);
  };

  // Add new function for foreign funding capability assessment
  const calculateForeignFundingCapability = () => {
    let score = 0;
    const compliance = answers.ngoComplianceStatus || [];
    const inProcess = answers.ngoComplianceInProcess || [];
    const fcraStatus = checkFCRACompliance(compliance, inProcess);
    
    // FCRA and 501c combination provides maximum access
    if (fcraStatus.hasFCRA && fcraStatus.has501c) {
      score += 5;
    } else if (fcraStatus.hasFCRA) {
      score += 3; // FCRA alone provides good access
    }
    
    // Consider foreign funding intent
    if (answers.ngoForeignFundingIntent === 'yes') {
      score += 2;
    } else if (answers.ngoForeignFundingIntent === 'future') {
      score += 1;
    }
    
    // Check foreign compliance readiness
    if (answers.ngoForeignComplianceReadiness) {
      const readinessScores = Object.values(answers.ngoForeignComplianceReadiness);
      const avgReadiness = readinessScores.reduce((a, b) => a + parseInt(b), 0) / readinessScores.length;
      score += Math.min(3, avgReadiness / 2);
    }

    return {
      score: Math.min(10, score),
      readinessLevel: score >= 8 ? 'Full Access' :
                     score >= 6 ? 'Limited Access' :
                     score >= 4 ? 'Restricted Access' : 'Domestic Only',
      hasValidFCRA: fcraStatus.hasFCRA && 
                    (answers.ngoFCRAValidity === 'yes'),
      has501c: fcraStatus.has501c,
      processingFCRA: fcraStatus.processingFCRA,
      processing501c: fcraStatus.processing501c
    };
  };

  // Update calculateLocationImpact to handle multiple locations
  const calculateLocationImpact = (strategy) => {
    let locationScores = [];
    const locations = answers.ngoLocation || [];
    
    locations.forEach(location => {
      let score = 0;
      switch(strategy.id) {
        case 'csr':
        case 'employeeGiving':
          // CSR and employee giving heavily favor tier 1 cities
          if (location === 'tier1') score += 15;
          else if (location === 'tier2') score += 8;
          else if (location === 'tier3') score += 3;
          break;

        case 'governmentGrants':
          // Government grants favor rural and tier 3 locations
          if (location === 'rural') score += 15;
          else if (location === 'tier3') score += 10;
          else if (location === 'tier2') score += 5;
          break;

        case 'crowdfunding':
        case 'p2p':
        case 'digitalFundraising':
          // Digital strategies favor urban areas but can work anywhere
          if (location === 'tier1') score += 10;
          else if (location === 'tier2') score += 8;
          else if (location === 'tier3') score += 5;
          else if (location === 'rural') score += 2;
          break;

        case 'eventBased':
          // Event-based fundraising needs infrastructure
          if (location === 'tier1') score += 12;
          else if (location === 'tier2') score += 8;
          else if (location === 'tier3') score += 4;
          break;

        case 'doorToDoor':
          // Door-to-door works well in all areas but especially tier 2/3 and rural
          if (location === 'rural') score += 10;
          else if (location === 'tier3') score += 8;
          else if (location === 'tier2') score += 6;
          else if (location === 'tier1') score += 4;
          break;

        case 'hniGiving':
          // HNI giving favors larger cities
          if (location === 'tier1') score += 12;
          else if (location === 'tier2') score += 6;
          break;

        case 'checkoutCharity':
          // Retail partnerships work best in urban areas
          if (location === 'tier1') score += 10;
          else if (location === 'tier2') score += 7;
          else if (location === 'tier3') score += 4;
          break;

        case 'grants':
          // Domestic foundation grants slightly favor urban areas
          if (location === 'tier1') score += 8;
          else if (location === 'tier2') score += 6;
          else if (location === 'tier3') score += 4;
          else if (location === 'rural') score += 2;
          break;

        case 'foreignGrants':
          // Foreign grants favor tier 1/2 cities due to infrastructure
          if (location === 'tier1') score += 10;
          else if (location === 'tier2') score += 7;
          else if (location === 'tier3') score += 4;
          break;

        default:
          // Default modest urban bonus for other strategies
          if (location === 'tier1') score += 5;
          else if (location === 'tier2') score += 4;
          else if (location === 'tier3') score += 3;
          else if (location === 'rural') score += 2;
      }
      locationScores.push(score);
    });

    // Calculate weighted average based on number of locations
    const totalScore = locationScores.reduce((sum, score) => sum + score, 0);
    return locations.length > 0 ? Math.round(totalScore / locations.length) : 0;
  };

  // Update location insights generation to handle multiple locations
  const getLocationInsights = (strategy, locationImpact) => {
    const locations = answers.ngoLocation || [];
    if (locations.length === 0) return [];

    const insights = [];
    const locationLabels = {
      tier1: 'Tier 1 city',
      tier2: 'Tier 2 city',
      tier3: 'Tier 3 city',
      rural: 'Rural Area'
    };

    // Add general location impact insight
    if (locationImpact >= 10) {
      insights.push(`Strong alignment with your location profile (${locations.map(l => locationLabels[l]).join(', ')})`);
    } else if (locationImpact >= 5) {
      insights.push(`Moderate alignment with your location profile (${locations.map(l => locationLabels[l]).join(', ')})`);
    } else if (locationImpact <= 0) {
      insights.push(`May face challenges due to your location profile (${locations.map(l => locationLabels[l]).join(', ')})`);
    }

    // Add strategy-specific insights
    switch(strategy.id) {
      case 'csr':
        if (locations.includes('tier1')) {
          insights.push('Presence in Tier 1 city provides strong advantage for CSR funding');
        } else if (!locations.some(l => ['tier1', 'tier2'].includes(l))) {
          insights.push('Consider partnerships with NGOs in Tier 1/2 cities to improve CSR access');
        }
        break;

      case 'governmentGrants':
        if (locations.includes('rural') || locations.includes('tier3')) {
          insights.push('Rural/Tier 3 presence aligns well with government grant priorities');
        }
        break;

      case 'digitalFundraising':
        if (locations.some(l => ['tier1', 'tier2'].includes(l))) {
          insights.push('Urban presence provides good infrastructure for digital initiatives');
        } else {
          insights.push('Consider infrastructure requirements for digital fundraising');
        }
        break;

      case 'doorToDoor':
        if (locations.some(l => ['rural', 'tier3'].includes(l))) {
          insights.push('Rural/Tier 3 presence is advantageous for door-to-door fundraising');
        }
        break;

      case 'foreignGrants':
        if (!locations.some(l => ['tier1', 'tier2'].includes(l))) {
          insights.push('Consider establishing presence in a major city to facilitate foreign funding');
        }
        break;
    }

    return insights;
  };

  // Calculate scores for each strategy based on NGO profile
  const calculateStrategyScores = () => {
    const ngoMaturity = calculateNGOMaturity();
    const ngoSize = calculateNGOSize();
    const digitalCapacity = calculateDigitalCapacity();
    const volunteerCapacity = Math.min(5, calculateVolunteerCapacity() / 2);
    const eventCapacity = Math.min(5, calculateEventCapacity() / 2);
    const corporateNetworkStrength = calculateCorporateNetworkStrength();
    const individualDonorNetwork = calculateIndividualDonorNetworkStrength();
    const foundationNetwork = calculateFoundationNetworkStrength();
    const fundraisingCapacity = Math.min(5, calculateFundraisingCapacity() / 2.4);

    // Enhanced network alignment calculation based on matrix
    const calculateNetworkAlignment = (strategy) => {
      let networkScore = 0;
      let networkReqLevel = 6 - (strategy.scoringCriteria.networkLeverage || 3); // Invert scale so 5 means high dependency
      
      // Consider event capacity for event-based strategies
      if (strategy.id === 'eventBased') {
        networkScore += Math.min(2, eventCapacity);
      }
      
      // Consider fundraising capacity for major donor strategies
      if (['hniGiving', 'grants', 'csr'].includes(strategy.id)) {
        networkScore += Math.min(2, fundraisingCapacity);
      }

      switch(strategy.id) {
        case 'digitalFundraising':
        case 'p2p':
          // Digital/P2P strategies more focused on social networks
          networkScore = Math.min(5, (answers.ngoSocialMedia === 'yes' ? 2 : 0) +
                                   (answers.ngoDonorDatabase === 'yes' ? 2 : 0) +
                                   (digitalCapacity >= 4 ? 1 : 0));
          break;

        case 'csr':
        case 'employeeGiving':
        case 'checkoutCharity':
          // Corporate strategies need strong business networks
          networkScore = Math.min(5, (corporateNetworkStrength * 1.2) +
                                   (answers.ngoCSRExperience === 'yes' ? 1 : 0));
          break;

        case 'grants':
        case 'endowmentFunds':
          // Foundation strategies need institutional relationships
          networkScore = Math.min(5, (foundationNetwork * 1.2) +
                                   (answers.ngoGrantWriting === 'yes' ? 1 : 0));
          break;

        case 'hniGiving':
        case 'legacyGiving':
          // High-value individual strategies need quality over quantity
          networkScore = answers.ngoDonorRelationship >= 4 ? 5 :
                        answers.ngoDonorRelationship >= 3 ? 3 : 1;
          break;

        default:
          // General fundraising - balanced network requirements
          networkScore = Math.min(5, individualDonorNetwork);
      }

      // Weight the score based on how critical networks are for this strategy
      return (networkScore * networkReqLevel) / 5;
    };

    // Enhanced maturity stage alignment based on matrix
    const calculateStageAlignment = (strategy) => {
      let stageBonus = 0;
      
      // Basic stage match check (existing logic)
      if (strategy.suitableFor.ngoMaturity.includes(ngoMaturity)) {
        stageBonus += 5;
      }

      // Stage-specific strategy alignment from matrix
      switch(ngoMaturity) {
        case 'startup':
          if (['digitalFundraising', 'p2p', 'crowdfunding'].includes(strategy.id)) {
            stageBonus += 5; // Best for early stage
          }
          if (strategy.scoringCriteria.networkLeverage <= 2) {
            stageBonus += 3; // Low network dependency good for startups
          }
          if (strategy.scoringCriteria.implementationFeasibility >= 4) {
            stageBonus += 2; // Easy implementation good for startups
          }
          break;

        case 'growth':
          if (['csr', 'hniGiving', 'checkoutCharity'].includes(strategy.id)) {
            stageBonus += 4; // Good for growth stage
          }
          if (strategy.scoringCriteria.scalabilityPotential >= 4) {
            stageBonus += 4; // High scalability important in growth stage
          }
          break;

        case 'mature':
          if (['grants', 'csr', 'eventBased'].includes(strategy.id)) {
            stageBonus += 4; // Suitable for mature organizations
          }
          if (strategy.scoringCriteria.networkLeverage >= 4 && calculateNetworkAlignment(strategy) >= 4) {
            stageBonus += 3; // Can leverage strong networks
          }
          break;

        case 'established':
          if (['endowmentFunds', 'legacyGiving', 'grants'].includes(strategy.id)) {
            stageBonus += 5; // Ideal for established NGOs
          }
          if (strategy.scoringCriteria.fundingScale >= 4) {
            stageBonus += 3; // Can handle large-scale funding
          }
          break;

        default:
          // Default conservative bonus for unknown stages
          if (strategy.scoringCriteria.implementationFeasibility >= 4) {
            stageBonus += 2; // Favor easy-to-implement strategies
          }
          if (strategy.scoringCriteria.resourceRequirements >= 4) {
            stageBonus += 2; // Favor low-resource strategies
          }
          break;
      }

      return Math.min(15, stageBonus); // Cap at 15 points
    };

    const foreignFundingCapability = calculateForeignFundingCapability();

    return strategiesData.map(strategy => {
      let score = 0;
      const criteria = strategy.scoringCriteria || {};
      const complianceReadiness = calculateComplianceReadiness(strategy);
      
      // Calculate risk profile first
      const riskProfile = calculateRiskProfile(strategy, ngoMaturity, ngoSize) || {
        score: 0,
        level: 'Unknown',
        insights: [],
        maturityAligned: false
      };
      
      // Network leverage scoring (0-20 points)
      const networkScore = calculateNetworkAlignment(strategy);
      score += Math.min(20, networkScore * 4);
      
      // Stage alignment scoring (0-25 points)
      const stageScore = calculateStageAlignment(strategy);
      score += Math.min(25, stageScore * 1.67);

      // Resource and Implementation Profile (0-25 points)
      let resourceScore = 0;
      if (strategy.suitableFor.ngoSize.includes(ngoSize)) {
        resourceScore += 5; // Base size compatibility

        // Resource requirements alignment from Decision Matrix
        const resourceReqScore = 5 - (criteria.resourceRequirements || 3);
        const resourceMultiplier = ngoSize === 'small' ? 2.0 : // Higher weight for small NGOs
                                 ngoSize === 'medium' ? 1.5 : 1.2; // Lower weight for larger NGOs
        resourceScore += Math.min(7, resourceReqScore * resourceMultiplier);

        // Specialized resource consideration
        const hasSpecializedResources = (
          (strategy.id === 'grants' && answers.ngoGrantWriting === 'yes') ||
          (strategy.id === 'csr' && answers.ngoCSRExperience === 'yes') ||
          (strategy.id === 'digitalFundraising' && digitalCapacity >= 6)
        );
        if (hasSpecializedResources) resourceScore += 3;

        // Staff capacity consideration
        const staffCount = parseInt(answers.ngoStaff) || 0;
        if (staffCount >= 10 && criteria.resourceRequirements >= 3) resourceScore += 2;
        if (staffCount < 5 && criteria.resourceRequirements <= 2) resourceScore += 2;

        // Budget alignment
        const budget = parseInt(answers.ngoBudget) || 0;
        const budgetUSD = budget / 75; // Convert INR to USD
        if (budgetUSD >= 500000 && criteria.resourceRequirements >= 3) resourceScore += 3;
        if (budgetUSD < 100000 && criteria.resourceRequirements <= 2) resourceScore += 3;

        // Volunteer resource offset
        if (volunteerCapacity >= 4 && criteria.resourceRequirements <= 3) resourceScore += 3;
      }
      score += Math.min(25, resourceScore); // Add resource score to total

      // Location impact (-15 to +15 points)
      const locationImpact = calculateLocationImpact(strategy);
      score += locationImpact;

      // Funding Profile (0-20 points)
      let fundingScore = 0;
      // Scale potential
      fundingScore += Math.min(8, (criteria.fundingScale || 3) * 1.6);
      // Timeline consideration
      fundingScore += Math.min(6, (criteria.fundingTimeline || 3) * 1.2);
      // Long-term funding potential
      if (criteria.scalabilityPotential >= 4) {
        fundingScore += 6;
      }
      score += fundingScore;

      // Enhanced Risk and Market Alignment (0-20 points)
      const riskScore = calculateRiskProfile(strategy, ngoMaturity, ngoSize);
      score += riskScore.score;

      // Compliance and regulatory risk consideration
      score += Math.min(5, (6 - (criteria.complianceRequirements || 3)) * 1.2);
      
      // Market trends alignment with risk adjustment
      const trendScore = criteria.macroTrends || 3;
      score += Math.min(5, trendScore * (ngoMaturity === 'startup' ? 1.5 : 1.0)); // Higher weight for startups

      // Add direct compliance impact to final score
      score += complianceReadiness.score;

      // For high-compliance strategies, potentially apply score reduction
      if (criteria.complianceRequirements <= 2 && complianceReadiness.score < 5) {
        score *= 0.8; // 20% reduction for insufficient compliance readiness
      }

      // Add mission alignment score (0-15 points)
      const missionScore = calculateMissionAlignment(strategy);
      score += Math.min(15, missionScore * 3);

      // Adjust final score weighting
      score = Math.min(100, Math.round(score * 0.95 + (missionScore * 5))); // Give 5% extra weight to mission alignment

      // Add platform diversity bonus for digital strategies
      if (strategy.id === 'digitalFundraising' && answers.ngoOnlinePlatformsUsed) {
        const platformBonus = calculatePlatformBonus(answers.ngoOnlinePlatformsUsed);
        score += platformBonus;
      }

      // Enhanced mission alignment scoring using text analysis
      const missionAlignmentScore = analyzeMissionAlignment(answers.ngoMission, strategy.id);
      score += missionAlignmentScore * 3; // Weight mission alignment more heavily

      // Add beneficiary analysis to scoring
      const beneficiaryScore = calculateBeneficiaryAlignment(
        answers.ngoPrimaryBeneficiaries,
        answers.ngoSecondaryBeneficiaries,
        answers.ngoIndirectBeneficiaries,
        strategy
      );
      score += beneficiaryScore * 2;

      // Apply foreign funding capability scoring
      if (strategy.donorCategory === DONOR_CATEGORIES.FOUNDATION_FOREIGN) {
        if (!foreignFundingCapability.hasValidFCRA) {
          score = 0; // Not eligible without valid FCRA
        } else {
          // Bonus for having both FCRA and 501c
          if (foreignFundingCapability.has501c) {
            score += 10;
          }
        }
      } else if (strategy.donorCategory === DONOR_CATEGORIES.FOUNDATION_RESTRICTED) {
        if (!foreignFundingCapability.hasValidFCRA) {
          score = 0; // Not eligible without valid FCRA
        }
      } else if (strategy.donorCategory === DONOR_CATEGORIES.FOUNDATION_DOMESTIC) {
        // Domestic foundations don't need FCRA
        if (answers.ngoComplianceStatus?.includes('80g')) {
          score += 5;
        }
      }

      // Adjust score based on foreign funding intent
      if ([DONOR_CATEGORIES.FOUNDATION_FOREIGN, DONOR_CATEGORIES.FOUNDATION_RESTRICTED]
          .includes(strategy.donorCategory)) {
        switch(answers.ngoForeignFundingIntent) {
          case 'yes':
            score *= 1.2; // 20% bonus for aligned intent
            break;
          case 'future':
            score *= 0.8; // 20% reduction for future intent
            break;
          case 'no':
            score *= 0.5; // 50% reduction for no intent
            break;
        }
      }

      // Add foreign funding capability insights
      const foreignFundingInsights = [];
      if ([DONOR_CATEGORIES.FOUNDATION_FOREIGN, DONOR_CATEGORIES.FOUNDATION_RESTRICTED]
          .includes(strategy.donorCategory)) {
        foreignFundingInsights.push(
          `Foreign Funding Access Level: ${foreignFundingCapability.readinessLevel}`
        );
        
        if (!foreignFundingCapability.hasValidFCRA && foreignFundingCapability.processingFCRA) {
          foreignFundingInsights.push('Complete FCRA registration process to enable this strategy');
        }
        
        if (foreignFundingCapability.hasValidFCRA && !foreignFundingCapability.has501c &&
            strategy.donorCategory === DONOR_CATEGORIES.FOUNDATION_FOREIGN) {
          foreignFundingInsights.push('Consider 501(c) registration to maximize foreign funding access');
        }
      }

      // Add location context to insights
      const locationInsights = getLocationInsights(strategy, locationImpact);

      // Prepare the final riskProfile with all insights
      const updatedRiskProfile = {
        ...riskProfile,
        insights: [
          ...(locationInsights || []),
          ...(riskProfile.insights || []),
          ...(complianceReadiness.score < 5 ? ['Compliance readiness needs improvement'] : []),
          ...(criteria.complianceRequirements <= 2 && !complianceReadiness.hasEssentials ? 
             ['Missing essential compliance requirements'] : []),
          ...(strategy.id === 'csr' && !complianceReadiness.readyForCSR ? 
             ['CSR-1 registration required for CSR funding'] : []),
          ...(strategy.id === 'grants' && !complianceReadiness.readyForFCRA ? 
             ['FCRA registration recommended for international grants'] : [])
        ],
        missionAlignment: missionScore,
        complianceReadiness: complianceReadiness
      };

      return {
        ...strategy,
        score,
        riskProfile: updatedRiskProfile,
        alignmentDetails: {
          missionScore: missionAlignmentScore,
          beneficiaryScore: beneficiaryScore,
          platformDiversity: answers.ngoOnlinePlatformsUsed ? 
            calculatePlatformBonus(answers.ngoOnlinePlatformsUsed) : 0
        },
        foreignFundingCapability: strategy.donorCategory.includes('foundation') ? foreignFundingCapability : null,
        foreignFundingInsights
      };
    });
  };

  // Add new function to calculate beneficiary alignment
  const calculateBeneficiaryAlignment = (primary, secondary, indirect, strategy) => {
    let score = 0;
    
    // Calculate comprehensive impact based on beneficiary spread
    const totalBeneficiaries = [
      ...(primary || []),
      ...(secondary || []),
      ...(indirect || [])
    ];
    
    // Strategies that benefit from broader impact
    if (['grants', 'csr', 'endowmentFunds'].includes(strategy.id)) {
      score += Math.min(3, totalBeneficiaries.length / 2);
    }

    // Strategies that work better with specific beneficiary groups
    if (['p2p', 'crowdfunding'].includes(strategy.id)) {
      const relatableCauses = ['children', 'education', 'health', 'environment'];
      const hasRelatableCause = primary?.some(b => relatableCauses.includes(b));
      if (hasRelatableCause) score += 2;
    }

    // High-value strategies that need clear social impact
    if (['hniGiving', 'legacyGiving'].includes(strategy.id)) {
      if (indirect?.length >= 2) score += 2; // Shows broader impact
      if (primary?.length >= 2) score += 1; // Shows focused intervention
    }

    return Math.min(5, score);
  };

  // Helper functions for strategy timeline and implementation details
  const getTimelineContext = (strategy) => {
    const timeline = strategy.scoringCriteria?.fundingTimeline || 0;
    if (timeline >= 4) return 'Quick Win';
    if (timeline === 3) return 'Medium-term';
    return 'Long-term';
  };

  const getImplementationPhase = (strategy) => {
    const timeline = strategy.scoringCriteria?.fundingTimeline || 0;
    if (timeline >= 4) return 'Immediate';
    if (timeline === 3) return '3-6 months';
    return '6+ months';
  };

  // Helper function to identify synergies between strategies
  const getSynergies = (primary, secondary) => {
    const synergies = [];
    
    // Resource sharing synergies
    if (primary.scoringCriteria?.resourceRequirements === secondary.scoringCriteria?.resourceRequirements) {
      synergies.push('Can share resources and infrastructure');
    }

    // Network leverage synergies
    if (primary.scoringCriteria?.networkLeverage === secondary.scoringCriteria?.networkLeverage) {
      synergies.push('Can leverage same network connections');
    }

    // Digital capacity synergies
    if (primary.id.includes('digital') && secondary.id.includes('digital')) {
      synergies.push('Can share digital infrastructure and capabilities');
    }

    // Event-based synergies
    if (primary.id.includes('event') && secondary.id.includes('event')) {
      synergies.push('Can combine event planning and execution resources');
    }

    // Compliance synergies
    if (primary.scoringCriteria?.complianceRequirements === secondary.scoringCriteria?.complianceRequirements) {
      synergies.push('Share compliance and regulatory requirements');
    }

    // Donor category synergies
    if (primary.donorCategory === secondary.donorCategory) {
      synergies.push('Can leverage same donor relationships and networks');
    }

    return synergies;
  };

  // Create a profile object to pass to recommendation algorithms
  const createNGOProfile = () => {
    return {
      ngoMaturity: calculateNGOMaturity(),
      ngoSize: calculateNGOSize(),
      digitalCapacity: calculateDigitalCapacity(),
      volunteerCapacity: calculateVolunteerCapacity(),
      eventCapacity: calculateEventCapacity(),
      networkStrengths: {
        corporate: calculateCorporateNetworkStrength(),
        individual: calculateIndividualDonorNetworkStrength(),
        foundation: calculateFoundationNetworkStrength()
      },
      fundraisingCapacity: calculateFundraisingCapacity(),
      complianceStatus: answers.ngoComplianceStatus || [],
      budget: parseInt(answers.ngoBudget) || 0,
      foreignFundingCapability: calculateForeignFundingCapability()
    };
  };

  // Get the top recommended strategies using the selected algorithm
  const getTopStrategies = () => {
    const ngoProfile = createNGOProfile();
    
    let recommendations = [];
    
    switch(selectedAlgorithm) {
      case 'scoring':
        recommendations = scoringBasedRecommendation(answers, ngoProfile);
        break;
      case 'rule':
        recommendations = ruleBasedRecommendation(answers, ngoProfile);
        break;
      case 'collaborative':
        recommendations = collaborativeRecommendation(answers, ngoProfile);
        break;
      case 'combined':
      default:
        recommendations = combinedRecommendation(answers, ngoProfile);
        break;
    }
    
    // Take top 5 strategies
    const top5 = recommendations.slice(0, 5);
    
    // Add implementation timeline and phases
    return top5.map(strategy => ({
      ...strategy,
      timelineContext: getTimelineContext(strategy),
      implementationPhase: getImplementationPhase(strategy),
      // Add synergy details for the strategies
      similarityDetails: {
        primaryStrategy: top5[0].name,
        similarityScore: strategy.id === top5[0].id ? 1 : calculateSimilarityScore(top5[0].id, strategy.id),
        synergies: strategy.id === top5[0].id ? [] : getSynergies(top5[0], strategy)
      },
      confidenceLevel: getConfidenceLevel(strategy.confidence)
    }));
  };

  // Helper function for UI filtering
  const handleAlgorithmChange = (algorithm) => {
    setSelectedAlgorithm(algorithm);
  };

  // Toggle comparison view
  const toggleComparisonView = () => {
    setShowComparison(!showComparison);
  };

  const topStrategies = getTopStrategies();
  
  return (
    <div className="recommendation-container">
      <div className="navigation-buttons">
        <button onClick={onBackClick} className="back-button">
          Back to Questionnaire
        </button>
      </div>
      
      <h1 className="recommendations-title">Recommended Fundraising Strategies</h1>
      <p className="recommendations-intro">
        Based on your NGO's profile and the detailed scoring criteria including maturity stage, size, capacity, and goals, here are your most suitable fundraising strategies:
      </p>
      
      <div className="view-toggle">
        <button 
          className={`view-button ${!showComparison ? 'active' : ''}`}
          onClick={() => setShowComparison(false)}
        >
          Strategy Recommendations
        </button>
        <button 
          className={`view-button ${showComparison ? 'active' : ''}`}
          onClick={() => setShowComparison(true)}
        >
          Visual Comparison
        </button>
      </div>
      
      {showComparison ? (
        <StrategyComparison strategies={topStrategies} />
      ) : (
        <>
          <div className="algorithm-selector">
            <h3>Recommendation Method:</h3>
            <div className="algorithm-options">
              <button 
                className={`algorithm-option ${selectedAlgorithm === 'combined' ? 'selected' : ''}`}
                onClick={() => handleAlgorithmChange('combined')}
              >
                Ensemble (Best)
              </button>
              <button 
                className={`algorithm-option ${selectedAlgorithm === 'scoring' ? 'selected' : ''}`}
                onClick={() => handleAlgorithmChange('scoring')}
              >
                Criteria-Based
              </button>
              <button 
                className={`algorithm-option ${selectedAlgorithm === 'rule' ? 'selected' : ''}`}
                onClick={() => handleAlgorithmChange('rule')}
              >
                Rule-Based
              </button>
              <button 
                className={`algorithm-option ${selectedAlgorithm === 'collaborative' ? 'selected' : ''}`}
                onClick={() => handleAlgorithmChange('collaborative')}
              >
                Archetype-Based
              </button>
            </div>
          </div>
          
          <div className="recommendations-list">
            {topStrategies.map((strategy, index) => (
              <div 
                key={strategy.id} 
                className="strategy-card" 
                data-category={strategy.donorCategory}
              >
                <div className="strategy-rank">{index + 1}</div>
                <div className="strategy-header">
                  <h2 className="strategy-name">{strategy.name}</h2>
                  <div className="confidence-badge" data-confidence={strategy.confidenceLevel.class}>
                    {strategy.confidenceLevel.label} Confidence
                  </div>
                </div>
                <p className="strategy-description">{strategy.description}</p>
                
                {selectedAlgorithm === 'combined' && strategy.consensusScore && (
                  <div className="algorithm-consensus">
                    <span className="algo-tag">Ensemble Recommendation</span>
                    <span className="algo-agreement">
                      {strategy.consensusScore.numAlgorithmsAgreeing}/3 algorithms agree
                    </span>
                  </div>
                )}
                
                {selectedAlgorithm === 'collaborative' && strategy.archetypeMatch && (
                  <div className="archetype-match">
                    <span className="archetype-label">Matches:</span>
                    <span className="archetype-value">{strategy.archetypeMatch}</span>
                    <span className="match-percentage">({strategy.matchPercentage}% match)</span>
                  </div>
                )}
                
                {selectedAlgorithm === 'rule' && strategy.matchedRule && (
                  <div className="rule-match">
                    <span className="rule-label">Matched Rule:</span>
                    <span className="rule-value">{strategy.matchedRule}</span>
                  </div>
                )}
                
                <div className="strategy-score-details">
                  <h3>Strategy Fit Analysis</h3>
                  <div className="score-category">
                    <span className="score-label">Overall Match</span>
                    <div className="score-value">
                      {strategy.score}%
                      <div className="score-bar">
                        <div className="score-fill" style={{ width: `${strategy.score}%` }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="score-category">
                    <span className="score-label">Market Trends</span>
                    <div className="score-value">
                      <span className="criteria-tag" 
                            data-trend={(strategy.scoringCriteria?.macroTrends || 0) >= 4 ? 'growing' : 
                                      (strategy.scoringCriteria?.macroTrends || 0) >= 3 ? 'stable' : 
                                      'declining'}>
                        {(strategy.scoringCriteria?.macroTrends || 0) >= 4 ? 'Growing' :
                         (strategy.scoringCriteria?.macroTrends || 0) >= 3 ? 'Stable' : 'Declining'}
                      </span>
                    </div>
                  </div>

                  <div className="score-category">
                    <span className="score-label">Funding Profile</span>
                    <div className="score-value">
                      <div className="funding-details">
                        <span className="criteria-tag" data-scale={strategy.scoringCriteria?.fundingScale || 0}>
                          {strategy.scoringCriteria?.fundingScale === 1 ? '$1K-$10K' :
                           strategy.scoringCriteria?.fundingScale === 2 ? '$10K-$100K' :
                           strategy.scoringCriteria?.fundingScale === 3 ? '$100K-$1M' :
                           strategy.scoringCriteria?.fundingScale === 4 ? '$1M-$10M' : '$10M+'}
                        </span>
                        <span className="criteria-tag"
                              data-timeline={(strategy.scoringCriteria?.fundingTimeline || 0) >= 4 ? 'quick' :
                                          (strategy.scoringCriteria?.fundingTimeline || 0) >= 3 ? 'medium' : 
                                          'long'}>
                          {(strategy.scoringCriteria?.fundingTimeline || 0) >= 4 ? '< 3 months' :
                           (strategy.scoringCriteria?.fundingTimeline || 0) >= 3 ? '3-6 months' : '6+ months'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="score-category">
                    <span className="score-label">Implementation Timeline</span>
                    <div className="score-value">
                      <div className="timeline-details">
                        <span className="criteria-tag" 
                              data-timeline-context={strategy.timelineContext.toLowerCase().replace(' ', '-')}>
                          {strategy.timelineContext}
                        </span>
                        <span className="criteria-tag" 
                              data-phase={strategy.implementationPhase === 'Immediate' ? 'immediate' :
                                        strategy.implementationPhase === '3-6 months' ? 'medium' : 
                                        'long'}>
                          Start: {strategy.implementationPhase}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="score-category">
                    <span className="score-label">Risk Profile</span>
                    <div className="score-value">
                      <div className="risk-details">
                        {strategy.riskProfile && (
                          <>
                            <span className="criteria-tag" 
                                  data-risk={strategy.riskProfile.level === 'Optimal' ? 'optimal' :
                                           strategy.riskProfile.level === 'Acceptable' ? 'acceptable' : 
                                           'cautious'}>
                              {strategy.riskProfile.level || 'Unknown'}
                            </span>
                            {strategy.riskProfile.maturityAligned && (
                              <span className="criteria-tag" data-fit="good">Stage-Appropriate</span>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {strategy.riskProfile?.insights && strategy.riskProfile.insights.length > 0 && (
                    <div className="risk-insights">
                      <ul>
                        {strategy.riskProfile.insights.map((insight, index) => (
                          <li key={index}>{insight}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="score-category">
                    <span className="score-label">Long-term Potential</span>
                    <div className="score-value">
                      <div className="potential-details">
                        <span className="criteria-tag" 
                              data-scale={(strategy.scoringCriteria?.scalabilityPotential || 0) >= 4 ? 'high' :
                                        (strategy.scoringCriteria?.scalabilityPotential || 0) >= 3 ? 'medium' : 
                                        'low'}>
                          {(strategy.scoringCriteria?.scalabilityPotential || 0) >= 4 ? 'High Growth' :
                           (strategy.scoringCriteria?.scalabilityPotential || 0) >= 3 ? 'Medium Growth' : 'Limited Growth'}
                        </span>
                        <span className="criteria-tag" 
                              data-engagement={(strategy.scoringCriteria?.donorEngagement || 0) >= 4 ? 'high' :
                                             (strategy.scoringCriteria?.donorEngagement || 0) >= 3 ? 'medium' : 
                                             'low'}>
                          {(strategy.scoringCriteria?.donorEngagement || 0) >= 4 ? 'High Engagement' :
                           (strategy.scoringCriteria?.donorEngagement || 0) >= 3 ? 'Medium Engagement' : 'Low Engagement'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="strategy-details">
                  <h3>Why this strategy works for you:</h3>
                  <ul className="strategy-reasons">
                    {strategy.suitableFor.ngoMaturity.includes(calculateNGOMaturity()) && (
                      <li>Aligns with your {calculateNGOMaturity()} stage maturity level</li>
                    )}
                    {strategy.suitableFor.ngoSize.includes(calculateNGOSize()) && (
                      <li>Matches your organizational size and capacity</li>
                    )}
                    {strategy.scoringCriteria.implementationFeasibility >= 3 && (
                      <li>Implementation complexity matches your current capabilities</li>
                    )}
                    {strategy.scoringCriteria.scalabilityPotential >= 4 && (
                      <li>Offers strong potential for scaling and growth</li>
                    )}
                    {strategy.scoringCriteria.donorEngagement >= 4 && (
                      <li>Provides high donor engagement opportunities</li>
                    )}
                    {strategy.scoringCriteria.macroTrends >= 4 && (
                      <li>Aligns with current fundraising trends and donor preferences</li>
                    )}
                    {strategy.scoringCriteria.resourceRequirements <= 3 && (
                      <li>Resource requirements align with your current capacity</li>
                    )}
                  </ul>
                </div>
                {strategy.similarityDetails && (
                  <div className="strategy-synergies">
                    <h4>Strategy Synergies</h4>
                    <p>Complements {strategy.similarityDetails.primaryStrategy} with {Math.round(strategy.similarityDetails.similarityScore * 100)}% similarity</p>
                    {strategy.similarityDetails.synergies.length > 0 && (
                      <div className="synergy-list">
                        <p>Shares resources and capabilities with:</p>
                        <ul>
                          {strategy.similarityDetails.synergies.map((synergy, idx) => (
                            <li key={idx}>{synergy}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
                {strategy.foreignFundingInsights?.length > 0 && (
                  <div className="foreign-funding-insights">
                    <h4>Foreign Funding Insights</h4>
                    <ul>
                      {strategy.foreignFundingInsights.map((insight, idx) => (
                        <li key={idx}>{insight}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="comparison-button-container">
            <button className="compare-button" onClick={toggleComparisonView}>
              Compare Strategies Visually
            </button>
          </div>
        </>
      )}
      
      <div className="next-steps">
        <h2>Next Steps</h2>
        <p>These recommendations are based on a comprehensive analysis of {strategiesData.length} different fundraising strategies, evaluated across multiple criteria including NGO maturity, size, capacity, and alignment with your goals.</p>
        <p>We recommend focusing on your top-rated strategy first, while building capacity for others.</p>
        <button className="restart-button" onClick={() => window.location.reload()}>
          Start New Assessment
        </button>
      </div>
    </div>
  );
};

export default Recommendation;