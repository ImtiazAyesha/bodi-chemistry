import React, { useState } from 'react';
import { getSeverityColor, getSeverityLabel } from '../config/patterns.config';

/**
 * Pattern Card Component
 * Displays individual somatic pattern with score, severity, and recommendations
 */
const PatternCard = ({ pattern, rank }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const severityColor = getSeverityColor(pattern.severity);
  const severityLabel = getSeverityLabel(pattern.severity);
  const isActive = pattern.severity !== 'none';

  return (
    <div 
      style={{
        border: `2px solid ${isActive ? pattern.color : '#ddd'}`,
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '16px',
        background: isActive 
          ? `linear-gradient(135deg, ${pattern.color}15, transparent)`
          : '#f9f9f9',
        cursor: isActive ? 'pointer' : 'default',
        transition: 'all 0.3s ease',
        opacity: isActive ? 1 : 0.6,
        transform: isExpanded ? 'scale(1.02)' : 'scale(1)',
        boxShadow: isExpanded ? '0 8px 16px rgba(0,0,0,0.1)' : '0 2px 4px rgba(0,0,0,0.05)'
      }}
      onClick={() => isActive && setIsExpanded(!isExpanded)}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
          {/* Rank Badge (only for active patterns) */}
          {isActive && rank && (
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: pattern.color,
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: '16px'
            }}>
              {rank}
            </div>
          )}
          
          {/* Icon */}
          <span style={{ fontSize: '32px' }}>{pattern.icon}</span>
          
          {/* Name and Description */}
          <div style={{ flex: 1 }}>
            <h3 style={{ 
              margin: 0, 
              color: isActive ? pattern.color : '#666',
              fontSize: '18px',
              fontWeight: 'bold'
            }}>
              {pattern.name}
            </h3>
            <p style={{ 
              margin: '4px 0 0 0', 
              fontSize: '14px', 
              color: '#666',
              lineHeight: '1.4'
            }}>
              {pattern.description}
            </p>
          </div>
        </div>
        
        {/* Score and Severity */}
        <div style={{ textAlign: 'right', minWidth: '80px' }}>
          <div style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: severityColor,
            lineHeight: '1'
          }}>
            {pattern.score.toFixed(0)}
          </div>
          <div style={{
            fontSize: '11px',
            textTransform: 'uppercase',
            color: severityColor,
            fontWeight: 'bold',
            marginTop: '4px',
            letterSpacing: '0.5px'
          }}>
            {severityLabel}
          </div>
        </div>
      </div>

      {/* Expand Indicator */}
      {isActive && (
        <div style={{
          textAlign: 'center',
          marginTop: '12px',
          color: '#999',
          fontSize: '12px',
          fontWeight: '500'
        }}>
          {isExpanded ? '▲ Click to collapse' : '▼ Click for details'}
        </div>
      )}

      {/* Expanded Content */}
      {isExpanded && isActive && (
        <div style={{ 
          marginTop: '20px', 
          paddingTop: '20px', 
          borderTop: `2px solid ${pattern.color}40`,
          animation: 'fadeIn 0.3s ease'
        }}>
          {/* Metric Breakdown */}
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ 
              margin: '0 0 12px 0',
              color: pattern.color,
              fontSize: '16px',
              fontWeight: 'bold'
            }}>
              📊 Contributing Factors
            </h4>
            <div style={{ 
              background: 'white',
              borderRadius: '8px',
              padding: '12px',
              border: '1px solid #eee'
            }}>
              {pattern.metricBreakdown.slice(0, 5).map((metric, idx) => (
                <div 
                  key={idx} 
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px 0',
                    borderBottom: idx < 4 ? '1px solid #f0f0f0' : 'none'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <span style={{ 
                      fontWeight: '500',
                      color: '#333'
                    }}>
                      {metric.name}
                    </span>
                    <span style={{
                      marginLeft: '8px',
                      fontSize: '12px',
                      color: '#999'
                    }}>
                      (weight: {(metric.weight * 100).toFixed(0)}%)
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '60px',
                      height: '8px',
                      background: '#f0f0f0',
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${Math.min(100, metric.normalizedValue)}%`,
                        height: '100%',
                        background: metric.exceedsThreshold ? '#f44336' : pattern.color,
                        transition: 'width 0.3s ease'
                      }} />
                    </div>
                    <span style={{
                      fontWeight: 'bold',
                      color: metric.exceedsThreshold ? '#f44336' : '#666',
                      minWidth: '40px',
                      textAlign: 'right'
                    }}>
                      {metric.normalizedValue.toFixed(0)}
                      {metric.exceedsThreshold && ' ⚠️'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          {pattern.recommendations && pattern.recommendations.length > 0 && (
            <div>
              <h4 style={{ 
                margin: '0 0 12px 0',
                color: pattern.color,
                fontSize: '16px',
                fontWeight: 'bold'
              }}>
                💡 Recommended Actions
              </h4>
              <div style={{
                background: 'white',
                borderRadius: '8px',
                padding: '16px',
                border: '1px solid #eee'
              }}>
                <ul style={{ 
                  margin: 0, 
                  paddingLeft: '20px',
                  listStyleType: 'none'
                }}>
                  {pattern.recommendations.map((rec, idx) => (
                    <li 
                      key={idx} 
                      style={{ 
                        marginBottom: '10px',
                        color: '#444',
                        lineHeight: '1.6',
                        position: 'relative',
                        paddingLeft: '24px'
                      }}
                    >
                      <span style={{
                        position: 'absolute',
                        left: 0,
                        color: pattern.color,
                        fontWeight: 'bold'
                      }}>
                        {idx === 0 ? '→' : '•'}
                      </span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PatternCard;
