import React from "react";
import { FinancialMetric } from "@shared/schema";

interface FinancialMetricsSectionProps {
  financialMetrics: FinancialMetric[];
}

export default function FinancialMetricsSection({ financialMetrics }: FinancialMetricsSectionProps) {
  // Helper function to get impact badge color
  const getImpactBadgeColor = (impact: string) => {
    switch(impact.toLowerCase()) {
      case 'positive':
      case 'strong':
        return 'bg-status-positive/10 text-status-positive';
      case 'negative':
      case 'weak':
        return 'bg-status-negative/10 text-status-negative';
      default:
        return 'bg-status-neutral/10 text-status-neutral';
    }
  };

  // Helper function to get YoY change color
  const getChangeColor = (change: string | null | undefined) => {
    if (!change) return '';
    return change.startsWith('+') 
      ? 'text-status-positive' 
      : change.startsWith('-') 
        ? 'text-status-negative' 
        : '';
  };

  // Capitalize first letter
  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  return (
    <div>
      <h3 className="font-medium text-lg mb-3">Financial Metrics Analysis</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
          <thead className="bg-[#F5F7FA]">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metric</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">YoY Change</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Industry Avg</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Impact</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {financialMetrics.map((metric, index) => (
              <tr key={index}>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="text-sm font-medium text-gray-900">
                      {metric.name}
                      {metric.source && (
                        <span 
                          className="ml-1 inline-flex text-primary cursor-help"
                          title={`Source: ${metric.source}`}
                        >
                          <span className="material-icons text-sm">info</span>
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm font-mono">{metric.value}</div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className={`text-sm font-medium ${getChangeColor(metric.yoyChange)}`}>{metric.yoyChange}</div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm">{metric.industryAvg}</div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getImpactBadgeColor(metric.impact)}`}>
                    {capitalize(metric.impact)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
