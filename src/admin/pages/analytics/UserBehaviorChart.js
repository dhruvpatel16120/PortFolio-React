import React from 'react';

const UserBehaviorChart = ({ interactions }) => {
  // Group interactions by type
  const groupByType = (interactions) => {
    const grouped = {};
    interactions.forEach(interaction => {
      grouped[interaction.type] = (grouped[interaction.type] || 0) + 1;
    });
    return grouped;
  };

  const interactionsByType = groupByType(interactions);
  const types = Object.keys(interactionsByType);
  const values = types.map(type => interactionsByType[type]);
  const total = values.reduce((sum, val) => sum + val, 0);

  // Generate chart data
  const chartData = types.map((type, index) => ({
    type,
    value: values[index],
    percentage: total > 0 ? (values[index] / total) * 100 : 0
  }));

  // Color palette for different interaction types
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-orange-500',
    'bg-red-500',
    'bg-teal-500',
    'bg-pink-500',
    'bg-indigo-500'
  ];

  // Use colors array for chart styling
  const getColorClass = (index) => colors[index % colors.length];

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
        <div className="text-center">
          <div className="text-4xl mb-2">🖱️</div>
          <p>No interaction data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Chart */}
      <div className="space-y-3">
                 {chartData.map((data, index) => (
           <div key={index} className="flex items-center space-x-3">
             <div className={`w-4 h-4 rounded-full flex-shrink-0 ${getColorClass(index)}`} />
             <div className="flex-1">
               <div className="flex justify-between text-sm mb-1">
                 <span className="text-gray-700 dark:text-gray-300 capitalize">
                   {data.type.replace('_', ' ')}
                 </span>
                 <span className="text-gray-500 dark:text-gray-400">
                   {data.value} ({data.percentage.toFixed(1)}%)
                 </span>
               </div>
               <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                 <div
                   className={`h-2 rounded-full transition-all duration-300 ${getColorClass(index)}`}
                   style={{ width: `${data.percentage}%` }}
                 />
               </div>
             </div>
           </div>
         ))}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
          <div className="text-gray-600 dark:text-gray-400">Total Interactions</div>
          <div className="text-xl font-semibold text-gray-900 dark:text-white">
            {total}
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
          <div className="text-gray-600 dark:text-gray-400">Interaction Types</div>
          <div className="text-xl font-semibold text-gray-900 dark:text-white">
            {types.length}
          </div>
        </div>
      </div>

      {/* Top Interactions */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Most Common Interactions
        </h4>
        <div className="space-y-2">
          {chartData.slice(0, 3).map((data, index) => (
            <div key={index} className="flex justify-between items-center text-sm">
              <span className="text-gray-600 dark:text-gray-400 capitalize">
                {data.type.replace('_', ' ')}
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                {data.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserBehaviorChart; 