import React from 'react';

const PageViewsChart = ({ pageViews }) => {
  // Group page views by date
  const groupByDate = (views) => {
    const grouped = {};
    views.forEach(view => {
      const date = new Date(view.timestamp).toLocaleDateString();
      grouped[date] = (grouped[date] || 0) + 1;
    });
    return grouped;
  };

  const pageViewsByDate = groupByDate(pageViews);
  const dates = Object.keys(pageViewsByDate).sort();
  const values = dates.map(date => pageViewsByDate[date]);
  const maxValue = Math.max(...values, 1);

  // Generate chart data
  const chartData = dates.map((date, index) => ({
    date,
    value: values[index],
    percentage: (values[index] / maxValue) * 100
  }));

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
        <div className="text-center">
          <div className="text-4xl mb-2">📊</div>
          <p>No page view data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Chart */}
      <div className="relative h-64">
        <div className="absolute inset-0 flex items-end justify-between px-4 pb-8">
          {chartData.map((data, index) => (
            <div key={index} className="flex flex-col items-center">
              <div
                className="w-8 bg-blue-500 rounded-t transition-all duration-300 hover:bg-blue-600 cursor-pointer"
                style={{ height: `${data.percentage}%` }}
                title={`${data.date}: ${data.value} views`}
              />
              <span className="text-xs text-gray-500 dark:text-gray-400 mt-2 transform -rotate-45 origin-left">
                {new Date(data.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </div>
          ))}
        </div>
        
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>{maxValue}</span>
          <span>{Math.round(maxValue * 0.75)}</span>
          <span>{Math.round(maxValue * 0.5)}</span>
          <span>{Math.round(maxValue * 0.25)}</span>
          <span>0</span>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
          <div className="text-gray-600 dark:text-gray-400">Total Views</div>
          <div className="text-xl font-semibold text-gray-900 dark:text-white">
            {values.reduce((sum, val) => sum + val, 0)}
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
          <div className="text-gray-600 dark:text-gray-400">Avg Daily</div>
          <div className="text-xl font-semibold text-gray-900 dark:text-white">
            {Math.round(values.reduce((sum, val) => sum + val, 0) / values.length)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageViewsChart; 