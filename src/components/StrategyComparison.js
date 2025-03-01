import React, { useState, useEffect } from 'react';
import './StrategyComparison.css';
import { ChartManager, chartOptions, chartDataPreparation, getSuccessFactors } from '../utils/chartUtils';

const StrategyComparison = ({ strategies }) => {
  const [selectedStrategies, setSelectedStrategies] = useState([]);
  const [comparisonType, setComparisonType] = useState('radar');
  const [error, setError] = useState(null);
  
  // Initialize selected strategies on component mount or when strategies change
  useEffect(() => {
    if (!Array.isArray(strategies) || strategies.length === 0) {
      setError("No strategies available for comparison");
      return;
    }
    
    // Filter out strategies without required data
    const validStrategies = strategies.filter(s => s && typeof s === 'object');
    
    if (validStrategies.length === 0) {
      setError("No valid strategies available for comparison");
      return;
    }
    
    // Take up to 2 strategies initially
    setSelectedStrategies(validStrategies.slice(0, Math.min(2, validStrategies.length)));
    setError(null);
    
    return () => {
      // Clean up charts when component unmounts or strategies change
      ChartManager.destroyAllCharts();
    };
  }, [strategies]);

  // Render charts when comparison type or selected strategies change
  useEffect(() => {
    if (selectedStrategies.length === 0) return;
    
    // Short delay to ensure DOM is ready
    const timer = setTimeout(() => {
      renderChart();
    }, 300);
    
    return () => clearTimeout(timer);
  }, [comparisonType, selectedStrategies]);

  // Handle toggling strategy selection
  const toggleStrategy = (strategy) => {
    if (selectedStrategies.includes(strategy)) {
      // Remove strategy if it's already selected (but maintain at least one)
      if (selectedStrategies.length > 1) {
        setSelectedStrategies(selectedStrategies.filter(s => s !== strategy));
      }
    } else {
      // Add strategy (up to a maximum of 3)
      if (selectedStrategies.length < 3) {
        setSelectedStrategies([...selectedStrategies, strategy]);
      } else {
        // Replace oldest selection when limit is reached
        setSelectedStrategies([...selectedStrategies.slice(1), strategy]);
      }
    }
  };

  // Change comparison type
  const changeComparisonType = (type) => {
    setComparisonType(type);
  };

  // Render the appropriate chart
  const renderChart = () => {
    try {
      if (selectedStrategies.length === 0) return;
      
      // Destroy any existing charts first
      ChartManager.destroyAllCharts();
      
      let chartData, chartType, chartId, options;
      
      switch (comparisonType) {
        case 'radar':
          chartData = chartDataPreparation.prepareRadarData(selectedStrategies);
          chartType = 'radar';
          chartId = 'radar-chart';
          options = chartOptions.radar;
          break;
          
        case 'success':
          chartData = chartDataPreparation.prepareSuccessProbabilityData(selectedStrategies);
          chartType = 'bar';
          chartId = 'success-chart';
          options = chartOptions.success;
          break;
          
        case 'timeline':
          chartData = chartDataPreparation.prepareTimelineData(selectedStrategies);
          chartType = 'bar';
          chartId = 'timeline-chart';
          options = chartOptions.bar;
          break;
          
        default:
          throw new Error(`Unknown chart type: ${comparisonType}`);
      }
      
      console.log(`Creating ${comparisonType} chart with data:`, chartData);
      
      // Create the chart
      const chart = ChartManager.createChart(chartId, chartType, chartData, options);
      
      if (!chart) {
        setError(`Failed to create ${comparisonType} chart`);
      } else {
        setError(null);
      }
    } catch (err) {
      console.error('Error rendering chart:', err);
      setError(`Error rendering chart: ${err.message || 'Unknown error'}`);
    }
  };

  if (!Array.isArray(strategies) || strategies.length === 0) {
    return <div className="strategy-comparison-container">No strategies to compare</div>;
  }

  // Filter out invalid strategies for selection
  const validStrategies = strategies.filter(s => s && typeof s === 'object');

  return (
    <div className="strategy-comparison-container">
      <h2 className="comparison-title">Strategy Comparison</h2>
      
      <div className="visualization-type-selector">
        <button 
          className={`viz-type-button ${comparisonType === 'radar' ? 'active' : ''}`}
          onClick={() => changeComparisonType('radar')}
        >
          Strategy Profile
        </button>
        <button 
          className={`viz-type-button ${comparisonType === 'success' ? 'active' : ''}`}
          onClick={() => changeComparisonType('success')}
        >
          Success Probability
        </button>
        <button 
          className={`viz-type-button ${comparisonType === 'timeline' ? 'active' : ''}`}
          onClick={() => changeComparisonType('timeline')}
        >
          Implementation Timeline
        </button>
      </div>
      
      <div className="strategy-selector">
        <div className="selector-label">Compare Strategies (select up to 3):</div>
        <div className="strategy-toggle-buttons">
          {validStrategies.map((strategy, index) => (
            <button 
              key={strategy.id || `strategy-${index}`} 
              className={`strategy-toggle ${selectedStrategies.includes(strategy) ? 'selected' : ''}`}
              onClick={() => toggleStrategy(strategy)}
            >
              {strategy.name || `Strategy ${index + 1}`}
            </button>
          ))}
        </div>
      </div>
      
      {error && (
        <div className="chart-error">
          <p>{error}</p>
        </div>
      )}
      
      <div className="visualization-container">
        {comparisonType === 'radar' && (
          <>
            <h3 className="chart-title">Strategy Strengths & Weaknesses</h3>
            <p className="chart-description">
              This radar chart compares key attributes of each strategy on a scale of 1-5. 
              Higher values (outer rings) indicate better performance in that category.
            </p>
            <div className="chart-container">
              <canvas id="radar-chart" height="400"></canvas>
            </div>
          </>
        )}
        
        {comparisonType === 'success' && (
          <>
            <h3 className="chart-title">Success Probability Assessment</h3>
            <p className="chart-description">
              This chart estimates the likelihood of success for each strategy based on alignment with your organization's profile.
            </p>
            <div className="chart-container">
              <canvas id="success-chart" height="400"></canvas>
            </div>
            
            {selectedStrategies.length > 0 && (
              <div className="success-factors-container">
                {selectedStrategies.map((strategy, index) => (
                  <div key={strategy.id || index} className="success-factors">
                    <h4>{strategy.name || `Strategy ${index + 1}`} - Key Success Factors:</h4>
                    <ul>
                      {getSuccessFactors(strategy).map((factor, i) => (
                        <li key={i}>{factor}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
        
        {comparisonType === 'timeline' && (
          <>
            <h3 className="chart-title">Implementation Timeline Comparison</h3>
            <p className="chart-description">
              This chart shows the estimated time required for different implementation phases of each strategy.
            </p>
            <div className="chart-container">
              <canvas id="timeline-chart" height="400"></canvas>
            </div>
            <div className="timeline-legend">
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: 'rgba(76, 175, 80, 0.5)' }}></div>
                <div>Setup Phase: Initial implementation and foundation building</div>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: 'rgba(33, 150, 243, 0.5)' }}></div>
                <div>Growth Phase: Scaling and refining the strategy</div>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: 'rgba(156, 39, 176, 0.5)' }}></div>
                <div>Maturity Phase: Full operation and optimization</div>
              </div>
            </div>
          </>
        )}
      </div>
      
      {selectedStrategies.length > 1 && (
        <div className="comparison-insights">
          <h3>Strategy Comparison Insights</h3>
          <div className="insights-content">
            <p>Based on this visualization, here are key insights to consider:</p>
            <ul>
              {comparisonType === 'radar' && (
                <>
                  <li>
                    Different strategies show complementary strengths that could be combined for greater impact
                  </li>
                  <li>
                    Consider your organization's capacity when evaluating implementation difficulty
                  </li>
                </>
              )}
              
              {comparisonType === 'success' && (
                <>
                  <li>
                    Higher success probability indicates better alignment with your organization's profile
                  </li>
                  <li>
                    For optimal results, combine high-probability strategies that address different funding needs
                  </li>
                </>
              )}
              
              {comparisonType === 'timeline' && (
                <>
                  <li>
                    Balance short-term and long-term strategies for sustainable fundraising
                  </li>
                  <li>
                    Consider your resource capacity when planning implementation timelines
                  </li>
                </>
              )}
              
              <li>
                Strategic funding diversification improves long-term organizational resilience
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default StrategyComparison;