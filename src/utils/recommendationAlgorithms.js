// This file contains different recommendation algorithm implementations
import { strategiesData, calculateSimilarityScore, DONOR_CATEGORIES } from '../data/strategiesData';

/**
 * Scoring-based recommendation algorithm
 * This is the original algorithm that uses weighted criteria
 */
export const scoringBasedRecommendation = (answers, ngoProfile) => {
  const { 
    ngoMaturity, 
    ngoSize, 
    digitalCapacity,
    volunteerCapacity,
    networkStrengths,
    complianceStatus
  } = ngoProfile;
  
  // Filter out strategies that are categorically ineligible
  const eligibleStrategies = strategiesData.filter(strategy => {
    // Educational check
    if (strategy.id === 'endowmentFunds' && answers.ngoRegistrationType !== 'educational') {
      return false;
    }
    
    // CSR check
    if (strategy.id === 'csr' && !complianceStatus.includes('csr1')) {
      return false;
    }
    
    // FCRA check for foreign funding
    if ((strategy.id === 'foreignGrants' || strategy.id === 'foreignRFPs') && 
        !complianceStatus.includes('fcra')) {
      return false;
    }

    // Maturity and size checks
    if (!strategy.suitableFor.ngoMaturity.includes(ngoMaturity)) {
      return false;
    }
    
    if (!strategy.suitableFor.ngoSize.includes(ngoSize)) {
      return false;
    }
    
    return true;
  });

  // Score the remaining strategies
  return eligibleStrategies.map(strategy => {
    let score = 0;
    const criteria = strategy.scoringCriteria || {};
    
    // Base score from strategy's intrinsic properties (up to 40 points)
    score += (criteria.macroTrends || 3) * 3; // Market trends (0-15)
    score += (criteria.fundingScale || 3) * 3; // Funding scale (0-15)
    score += (criteria.fundingTimeline || 3) * 2; // Timeline (0-10)
    
    // Context-specific scoring (up to 60 points)
    
    // Digital capacity alignment
    if (['digitalFundraising', 'p2p', 'crowdfunding'].includes(strategy.id)) {
      score += Math.min(15, digitalCapacity * 3);
    }
    
    // Volunteer capacity alignment
    if (['p2p', 'doorToDoor', 'eventBased'].includes(strategy.id)) {
      score += Math.min(15, volunteerCapacity * 3); 
    }
    
    // Network alignment
    if (strategy.donorCategory === DONOR_CATEGORIES.INDIVIDUAL) {
      score += Math.min(15, networkStrengths.individual * 3);
    } else if (strategy.donorCategory === DONOR_CATEGORIES.CORPORATE) {
      score += Math.min(15, networkStrengths.corporate * 3);
    } else if ([DONOR_CATEGORIES.FOUNDATION_DOMESTIC, DONOR_CATEGORIES.FOUNDATION_FOREIGN].includes(strategy.donorCategory)) {
      score += Math.min(15, networkStrengths.foundation * 3);
    }
    
    // Risk alignment with NGO risk tolerance
    const riskTolerance = answers.ngoRiskTolerance || 'moderate';
    const executionRisk = criteria.executionRisk || 3;
    
    if ((riskTolerance === 'riskaverse' && executionRisk <= 2) ||
        (riskTolerance === 'moderate' && executionRisk === 3) ||
        (riskTolerance === 'riskseeking' && executionRisk >= 4)) {
      score += 15;
    } else if ((riskTolerance === 'riskaverse' && executionRisk === 3) ||
               (riskTolerance === 'moderate' && (executionRisk === 2 || executionRisk === 4)) ||
               (riskTolerance === 'riskseeking' && executionRisk === 3)) {
      score += 7;
    }

    // Confidence calculation for scoring-based algorithm
    // Higher scores get higher confidence, with diminishing returns
    const confidence = Math.min(0.95, score / 100 + 0.3);

    return {
      ...strategy,
      score: Math.min(100, score),
      algorithmType: 'scoring',
      confidence
    };
  }).sort((a, b) => b.score - a.score);
};

/**
 * Rule-based recommendation algorithm
 * Uses explicit decision rules based on NGO characteristics
 */
export const ruleBasedRecommendation = (answers, ngoProfile) => {
  const { 
    ngoMaturity, 
    ngoSize, 
    digitalCapacity,
    complianceStatus,
    budget
  } = ngoProfile;

  // Create rules for strategy selection
  const rules = [
    // Rule for small startups
    {
      condition: ngoMaturity === 'startup' && ngoSize === 'small',
      strategies: ['p2p', 'digitalFundraising', 'crowdfunding'],
      confidence: 0.85
    },
    // Rule for small NGOs with good digital capacity
    {
      condition: ngoSize === 'small' && digitalCapacity >= 4,
      strategies: ['digitalFundraising', 'p2p', 'crowdfunding'],
      confidence: 0.8
    },
    // Rule for educational institutions
    {
      condition: answers.ngoRegistrationType === 'educational',
      strategies: ['endowmentFunds', 'grants', 'eventBased'],
      confidence: 0.9
    },
    // Rule for established NGOs with CSR
    {
      condition: ngoMaturity === 'established' && complianceStatus.includes('csr1'),
      strategies: ['csr', 'employeeGiving', 'hniGiving'],
      confidence: 0.85
    },
    // Rule for medium/large NGOs with FCRA
    {
      condition: ['medium', 'large'].includes(ngoSize) && complianceStatus.includes('fcra'),
      strategies: ['foreignGrants', 'foreignRFPs', 'grants'],
      confidence: 0.9
    },
    // Rule for high budget NGOs
    {
      condition: budget > 10000000, // 1 crore+
      strategies: ['hniGiving', 'grants', 'csr'],
      confidence: 0.8
    },
    // Rule for NGOs with government focus
    {
      condition: answers.ngoGovernmentRelations === 'yes',
      strategies: ['governmentGrants', 'grants'],
      confidence: 0.75
    }
  ];

  // Apply rules and collect matching strategies
  const matchedStrategies = [];
  rules.forEach(rule => {
    if (rule.condition) {
      rule.strategies.forEach(strategyId => {
        // Find strategy data by ID
        const strategy = strategiesData.find(s => s.id === strategyId);
        if (strategy) {
          // Check eligibility criteria
          let isEligible = true;
          
          // Educational check
          if (strategy.id === 'endowmentFunds' && answers.ngoRegistrationType !== 'educational') {
            isEligible = false;
          }
          
          // CSR check
          if (strategy.id === 'csr' && !complianceStatus.includes('csr1')) {
            isEligible = false;
          }
          
          // FCRA check for foreign funding
          if ((strategy.id === 'foreignGrants' || strategy.id === 'foreignRFPs') && 
              !complianceStatus.includes('fcra')) {
            isEligible = false;
          }

          // Add to matched strategies if eligible
          if (isEligible) {
            // Check if already added (by another rule)
            const existing = matchedStrategies.find(s => s.id === strategy.id);
            if (existing) {
              // Update with higher confidence if applicable
              if (rule.confidence > existing.confidence) {
                existing.confidence = rule.confidence;
              }
            } else {
              matchedStrategies.push({
                ...strategy,
                score: 90, // High score for rule-matched strategies
                algorithmType: 'rule',
                confidence: rule.confidence,
                matchedRule: rule.condition.toString()
              });
            }
          }
        }
      });
    }
  });

  // Add a few more strategies based on NGO maturity and size if we don't have enough
  if (matchedStrategies.length < 5) {
    const additionalStrategies = strategiesData
      .filter(strategy => {
        // Exclude already matched strategies
        if (matchedStrategies.some(s => s.id === strategy.id)) {
          return false;
        }
        
        // Check eligibility criteria
        if (strategy.id === 'endowmentFunds' && answers.ngoRegistrationType !== 'educational') {
          return false;
        }
        
        if (strategy.id === 'csr' && !complianceStatus.includes('csr1')) {
          return false;
        }
        
        if ((strategy.id === 'foreignGrants' || strategy.id === 'foreignRFPs') && 
            !complianceStatus.includes('fcra')) {
          return false;
        }

        // Check for maturity and size match
        return strategy.suitableFor.ngoMaturity.includes(ngoMaturity) &&
               strategy.suitableFor.ngoSize.includes(ngoSize);
      })
      .map(strategy => ({
        ...strategy,
        score: 70, // Lower score for these additional strategies
        algorithmType: 'rule',
        confidence: 0.6, // Lower confidence for these
        matchedRule: 'maturityAndSizeMatch'
      }))
      .slice(0, 5 - matchedStrategies.length);

    matchedStrategies.push(...additionalStrategies);
  }

  return matchedStrategies.sort((a, b) => b.confidence - a.confidence);
};

/**
 * Collaborative-filtering like recommendation algorithm
 * Recommends strategies based on similarity to NGO profile archetypes
 */
export const collaborativeRecommendation = (answers, ngoProfile) => {
  const { 
    ngoMaturity, 
    ngoSize, 
    complianceStatus
  } = ngoProfile;
  
  // Define NGO archetypes (similar to user clusters in collaborative filtering)
  const archetypes = [
    {
      name: 'Digital-First Small NGO',
      matches: {
        size: ['small'],
        digitalPresence: true,
        focus: ['education', 'environment', 'health']
      },
      recommendedStrategies: ['digitalFundraising', 'p2p', 'crowdfunding'],
      confidence: 0.85
    },
    {
      name: 'Traditional Educational Institution',
      matches: {
        registrationType: ['educational'],
        maturity: ['established', 'mature']
      },
      recommendedStrategies: ['endowmentFunds', 'hniGiving', 'eventBased'],
      confidence: 0.9
    },
    {
      name: 'Corporate-Funded NGO',
      matches: {
        csrCompliance: true,
        size: ['medium', 'large']
      },
      recommendedStrategies: ['csr', 'employeeGiving', 'matchingDonations'],
      confidence: 0.85
    },
    {
      name: 'International Development NGO',
      matches: {
        fcraCompliance: true,
        scope: ['national', 'international']
      },
      recommendedStrategies: ['foreignGrants', 'foreignRFPs', 'grants'],
      confidence: 0.9
    },
    {
      name: 'Community-Based Organization',
      matches: {
        size: ['small', 'medium'],
        scope: ['local', 'regional'],
        volunteers: true
      },
      recommendedStrategies: ['p2p', 'eventBased', 'doorToDoor'],
      confidence: 0.8
    },
    {
      name: 'Healthcare Provider',
      matches: {
        registrationType: ['hospital'],
        beneficiaries: ['health']
      },
      recommendedStrategies: ['grants', 'hniGiving', 'csr'],
      confidence: 0.85
    },
    {
      name: 'Rural Development NGO',
      matches: {
        location: ['rural', 'tier3'],
        beneficiaries: ['rural', 'farmers', 'women']
      },
      recommendedStrategies: ['governmentGrants', 'grants', 'doorToDoor'],
      confidence: 0.75
    }
  ];
  
  // Calculate archetype matches
  const matchedStrategies = [];
  
  archetypes.forEach(archetype => {
    let matchScore = 0;
    let matchedCriteria = 0;
    let totalCriteria = 0;
    
    // Size match
    if (archetype.matches.size) {
      totalCriteria++;
      if (archetype.matches.size.includes(ngoSize)) {
        matchScore++;
        matchedCriteria++;
      }
    }
    
    // Maturity match
    if (archetype.matches.maturity) {
      totalCriteria++;
      if (archetype.matches.maturity.includes(ngoMaturity)) {
        matchScore++;
        matchedCriteria++;
      }
    }
    
    // Registration type match
    if (archetype.matches.registrationType) {
      totalCriteria++;
      if (archetype.matches.registrationType.includes(answers.ngoRegistrationType)) {
        matchScore++;
        matchedCriteria++;
      }
    }
    
    // Digital presence match
    if (archetype.matches.digitalPresence !== undefined) {
      totalCriteria++;
      if ((archetype.matches.digitalPresence && answers.ngoWebsite === 'yes') || 
          (!archetype.matches.digitalPresence && answers.ngoWebsite !== 'yes')) {
        matchScore++;
        matchedCriteria++;
      }
    }
    
    // Focus/beneficiaries match
    if (archetype.matches.focus) {
      totalCriteria++;
      const primaryBeneficiaries = answers.ngoPrimaryBeneficiaries || [];
      if (archetype.matches.focus.some(focus => primaryBeneficiaries.includes(focus))) {
        matchScore++;
        matchedCriteria++;
      }
    }
    
    // CSR compliance match
    if (archetype.matches.csrCompliance !== undefined) {
      totalCriteria++;
      if ((archetype.matches.csrCompliance && complianceStatus.includes('csr1')) || 
          (!archetype.matches.csrCompliance && !complianceStatus.includes('csr1'))) {
        matchScore++;
        matchedCriteria++;
      }
    }
    
    // FCRA compliance match
    if (archetype.matches.fcraCompliance !== undefined) {
      totalCriteria++;
      if ((archetype.matches.fcraCompliance && complianceStatus.includes('fcra')) || 
          (!archetype.matches.fcraCompliance && !complianceStatus.includes('fcra'))) {
        matchScore++;
        matchedCriteria++;
      }
    }
    
    // Scope match
    if (archetype.matches.scope) {
      totalCriteria++;
      if (archetype.matches.scope.includes(answers.ngoScope)) {
        matchScore++;
        matchedCriteria++;
      }
    }
    
    // Volunteers match
    if (archetype.matches.volunteers !== undefined) {
      totalCriteria++;
      if ((archetype.matches.volunteers && answers.ngoVolunteers === 'yes') || 
          (!archetype.matches.volunteers && answers.ngoVolunteers !== 'yes')) {
        matchScore++;
        matchedCriteria++;
      }
    }
    
    // Location match
    if (archetype.matches.location) {
      totalCriteria++;
      const locations = answers.ngoLocation || [];
      if (archetype.matches.location.some(loc => locations.includes(loc))) {
        matchScore++;
        matchedCriteria++;
      }
    }
    
    // Beneficiaries match
    if (archetype.matches.beneficiaries) {
      totalCriteria++;
      const primaryBeneficiaries = answers.ngoPrimaryBeneficiaries || [];
      if (archetype.matches.beneficiaries.some(ben => primaryBeneficiaries.includes(ben))) {
        matchScore++;
        matchedCriteria++;
      }
    }
    
    // Calculate match percentage
    const matchPercentage = totalCriteria > 0 ? matchScore / totalCriteria : 0;
    
    // Only consider matches above 50%
    if (matchPercentage >= 0.5) {
      // Add recommended strategies if match is good
      archetype.recommendedStrategies.forEach(strategyId => {
        // Find strategy data
        const strategy = strategiesData.find(s => s.id === strategyId);
        if (strategy) {
          // Basic eligibility check
          let isEligible = true;
          
          if (strategy.id === 'endowmentFunds' && answers.ngoRegistrationType !== 'educational') {
            isEligible = false;
          }
          
          if (strategy.id === 'csr' && !complianceStatus.includes('csr1')) {
            isEligible = false;
          }
          
          if ((strategy.id === 'foreignGrants' || strategy.id === 'foreignRFPs') && 
              !complianceStatus.includes('fcra')) {
            isEligible = false;
          }
          
          // Add eligible strategies
          if (isEligible) {
            // Scale score and confidence based on match percentage
            const scaledConfidence = archetype.confidence * matchPercentage;
            
            // Check if already added by another archetype
            const existing = matchedStrategies.find(s => s.id === strategy.id);
            if (existing) {
              // Update with higher confidence if applicable
              if (scaledConfidence > existing.confidence) {
                existing.confidence = scaledConfidence;
                existing.archetypeMatch = archetype.name;
                existing.matchPercentage = Math.round(matchPercentage * 100);
              }
            } else {
              matchedStrategies.push({
                ...strategy,
                score: Math.round(85 * matchPercentage),
                algorithmType: 'collaborative',
                confidence: scaledConfidence,
                archetypeMatch: archetype.name,
                matchPercentage: Math.round(matchPercentage * 100)
              });
            }
          }
        }
      });
    }
  });
  
  return matchedStrategies.sort((a, b) => b.confidence - a.confidence);
};

/**
 * Combined recommendation algorithm
 * Ensemble method that combines all three approaches
 */
export const combinedRecommendation = (answers, ngoProfile) => {
  // Get recommendations from each algorithm
  const scoringRecs = scoringBasedRecommendation(answers, ngoProfile);
  const ruleRecs = ruleBasedRecommendation(answers, ngoProfile);
  const collaborativeRecs = collaborativeRecommendation(answers, ngoProfile);
  
  // Create a map to combine and average scores/confidence
  const strategyMap = new Map();
  
  // Process all recommendations
  [...scoringRecs, ...ruleRecs, ...collaborativeRecs].forEach(rec => {
    if (!strategyMap.has(rec.id)) {
      strategyMap.set(rec.id, {
        strategy: rec,
        algorithms: [],
        scores: [],
        confidences: []
      });
    }
    
    const entry = strategyMap.get(rec.id);
    entry.algorithms.push(rec.algorithmType);
    entry.scores.push(rec.score);
    entry.confidences.push(rec.confidence);
  });
  
  // Calculate ensemble scores and confidences
  const results = Array.from(strategyMap.values()).map(entry => {
    // Calculate average score, weighted by confidence
    const totalConfidence = entry.confidences.reduce((sum, conf) => sum + conf, 0);
    const weightedScore = entry.scores.reduce((sum, score, i) => {
      return sum + (score * entry.confidences[i]);
    }, 0) / totalConfidence;
    
    // Calculate a consensus confidence
    // Higher if multiple algorithms agree, and if confidence is high across algorithms
    const numAlgorithms = new Set(entry.algorithms).size;
    const avgConfidence = entry.confidences.reduce((sum, conf) => sum + conf, 0) / entry.confidences.length;
    const consensusConfidence = avgConfidence * (0.7 + (numAlgorithms / 10));
    
    return {
      ...entry.strategy,
      score: Math.round(weightedScore),
      confidence: Math.min(0.95, consensusConfidence), // Cap at 0.95
      consensusScore: {
        numAlgorithmsAgreeing: numAlgorithms,
        algorithmTypes: Array.from(new Set(entry.algorithms)),
        avgOriginalConfidence: avgConfidence,
        originalScores: entry.scores
      }
    };
  });
  
  // Sort by weighted score and return
  return results.sort((a, b) => b.score - a.score);
};

/**
 * Get the confidence level label based on a confidence score
 */
export const getConfidenceLevel = (confidence) => {
  if (confidence >= 0.85) return { label: 'Very High', class: 'very-high' };
  if (confidence >= 0.7) return { label: 'High', class: 'high' };
  if (confidence >= 0.5) return { label: 'Medium', class: 'medium' };
  return { label: 'Low', class: 'low' };
};