import Chart from 'chart.js/auto';

// Singleton pattern to manage chart instances
export const ChartManager = {
  instances: {},
  
  // Create or update a chart
  createChart(canvasId, type, data, options) {
    // Destroy existing chart if it exists
    if (this.instances[canvasId]) {
      this.instances[canvasId].destroy();
    }
    
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
      console.error(`Canvas with id ${canvasId} not found`);
      return null;
    }
    
    try {
      const ctx = canvas.getContext('2d');
      const chartInstance = new Chart(ctx, {
        type,
        data,
        options
      });
      
      // Store the chart instance
      this.instances[canvasId] = chartInstance;
      return chartInstance;
    } catch (error) {
      console.error(`Failed to create chart on canvas ${canvasId}:`, error);
      return null;
    }
  },
  
  // Destroy a chart by ID
  destroyChart(canvasId) {
    if (this.instances[canvasId]) {
      this.instances[canvasId].destroy();
      delete this.instances[canvasId];
    }
  },
  
  // Destroy all charts
  destroyAllCharts() {
    Object.keys(this.instances).forEach(canvasId => {
      this.destroyChart(canvasId);
    });
  }
};

// Predefined chart options
export const chartOptions = {
  radar: {
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      r: {
        angleLines: {
          display: true
        },
        suggestedMin: 0,
        suggestedMax: 5,
      }
    },
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.dataset.label || '';
            const value = context.raw || 0;
            return `${label}: ${value} / 5`;
          }
        }
      }
    }
  },
  
  bar: {
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      x: {
        stacked: false,
      },
      y: {
        stacked: false,
        suggestedMin: 0,
      },
    },
    plugins: {
      legend: {
        position: 'bottom',
      }
    }
  },
  
  success: {
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.dataset.label || '';
            const value = context.raw || 0;
            return `${label}: ${value}%`;
          }
        }
      }
    }
  }
};

// Helper functions for chart data preparation
export const chartDataPreparation = {
  // Prepare data for radar chart
  prepareRadarData(strategies) {
    if (!strategies || strategies.length === 0) {
      return { labels: [], datasets: [] };
    }
    
    const categories = [
      'Funding Scale',
      'Implementation Ease',
      'Timeline',
      'Network Leverage',
      'Scalability',
      'Risk Level',
      'Compliance'
    ];
    
    const datasets = strategies.map((strategy, index) => {
      const criteria = strategy.scoringCriteria || {};
      const color = getChartColor(index);
      
      return {
        label: strategy.name || `Strategy ${index + 1}`,
        data: [
          criteria.fundingScale || 3, 
          criteria.implementationFeasibility || 3,
          criteria.fundingTimeline || 3,
          criteria.networkLeverage || 3,
          criteria.scalabilityPotential || 3,
          6 - (criteria.executionRisk || 3), // Invert so higher is better
          6 - (criteria.complianceRequirements || 3) // Invert so higher is better
        ],
        backgroundColor: color.background,
        borderColor: color.border,
        borderWidth: 2,
      };
    });
    
    return {
      labels: categories,
      datasets
    };
  },
  
  // Prepare data for success probability chart
  prepareSuccessProbabilityData(strategies) {
    if (!strategies || strategies.length === 0) {
      return { labels: [], datasets: [] };
    }
    
    const datasets = strategies.map((strategy, index) => {
      let successProbability = strategy.score ? Math.min(100, strategy.score) : 50;
      const color = getChartColor(index);
      
      return {
        label: strategy.name || `Strategy ${index + 1}`,
        data: [successProbability],
        backgroundColor: color.background,
        borderColor: color.border,
        borderWidth: 2,
      };
    });
    
    return {
      labels: ['Success Probability (%)'],
      datasets
    };
  },
  
  // Prepare data for timeline chart
  prepareTimelineData(strategies) {
    if (!strategies || strategies.length === 0) {
      return { labels: [], datasets: [] };
    }
    
    const labels = strategies.map(s => s.name || "Unnamed Strategy");
    
    // Calculate implementation phases in months
    const setupPhase = strategies.map(s => {
      const timeline = s.scoringCriteria?.fundingTimeline || 3;
      return timeline >= 4 ? 1 : timeline === 3 ? 3 : 6;
    });
    
    const growthPhase = strategies.map(s => {
      const scalability = s.scoringCriteria?.scalabilityPotential || 3;
      return scalability >= 4 ? 6 : scalability === 3 ? 9 : 12;
    });
    
    const maturityPhase = strategies.map(() => 6); // Fixed value for visualization
    
    return {
      labels,
      datasets: [
        {
          label: 'Setup Phase (months)',
          data: setupPhase,
          backgroundColor: 'rgba(76, 175, 80, 0.5)',
          borderColor: 'rgb(76, 175, 80)',
          borderWidth: 1,
        },
        {
          label: 'Growth Phase (months)',
          data: growthPhase,
          backgroundColor: 'rgba(33, 150, 243, 0.5)',
          borderColor: 'rgb(33, 150, 243)',
          borderWidth: 1,
        },
        {
          label: 'Maturity Phase (months)',
          data: maturityPhase,
          backgroundColor: 'rgba(156, 39, 176, 0.5)',
          borderColor: 'rgb(156, 39, 176)',
          borderWidth: 1,
        },
      ]
    };
  }
};

// Helper function for chart colors
function getChartColor(index) {
  const colors = [
    {
      background: 'rgba(76, 175, 80, 0.5)',
      border: 'rgb(76, 175, 80)'
    },
    {
      background: 'rgba(33, 150, 243, 0.5)',
      border: 'rgb(33, 150, 243)'
    },
    {
      background: 'rgba(255, 152, 0, 0.5)', 
      border: 'rgb(255, 152, 0)'
    },
    {
      background: 'rgba(156, 39, 176, 0.5)',
      border: 'rgb(156, 39, 176)'
    },
    {
      background: 'rgba(96, 125, 139, 0.5)',
      border: 'rgb(96, 125, 139)'
    }
  ];
  
  return colors[index % colors.length];
}

// Helper function to get success factors for a strategy
export function getSuccessFactors(strategy) {
  if (!strategy || !strategy.scoringCriteria) {
    return ['No criteria available'];
  }
  
  const factors = [];
  const criteria = strategy.scoringCriteria;
  
  if (criteria.macroTrends >= 4) {
    factors.push('Positive market trends');
  }
  
  if (criteria.implementationFeasibility >= 4) {
    factors.push('Easy implementation');
  } else if (criteria.implementationFeasibility <= 2) {
    factors.push('Complex implementation');
  }
  
  if (criteria.fundingTimeline >= 4) {
    factors.push('Quick funding access');
  } else if (criteria.fundingTimeline <= 2) {
    factors.push('Longer funding timeline');
  }
  
  if (criteria.executionRisk <= 2) {
    factors.push('Low execution risk');
  } else if (criteria.executionRisk >= 4) {
    factors.push('High execution risk');
  }
  
  if (criteria.scalabilityPotential >= 4) {
    factors.push('High scalability');
  }
  
  if (criteria.networkLeverage >= 4) {
    factors.push('Requires strong networks');
  }
  
  if (criteria.complianceRequirements <= 2) {
    factors.push('Low compliance burden');
  }
  
  // If no specific factors were identified, provide a default
  if (factors.length === 0) {
    factors.push('Balanced approach');
  }
  
  return factors;
}