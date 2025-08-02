import React from 'react';

const UserInteractionsTable = ({ topInteractions }) => {
  if (!topInteractions || topInteractions.length === 0) {
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
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Rank
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Interaction Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Count
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Percentage
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {topInteractions.map((interaction, index) => {
            const totalInteractions = topInteractions.reduce((sum, i) => sum + i.count, 0);
            const percentage = ((interaction.count / totalInteractions) * 100).toFixed(1);
            
            return (
              <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  <div className="flex items-center">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      index === 0 ? 'bg-yellow-100 text-yellow-800' :
                      index === 1 ? 'bg-gray-100 text-gray-800' :
                      index === 2 ? 'bg-orange-100 text-orange-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {index + 1}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  <div className="flex items-center">
                    <div className="text-lg mr-3">
                      {getInteractionIcon(interaction.type)}
                    </div>
                    <div>
                      <div className="font-medium capitalize">
                        {formatInteractionType(interaction.type)}
                      </div>
                      <div className="text-gray-500 dark:text-gray-400 text-xs">
                        {interaction.type}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  <span className="font-semibold">{interaction.count.toLocaleString()}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-gray-500 dark:text-gray-400">{percentage}%</span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const getInteractionIcon = (type) => {
  switch (type.toLowerCase()) {
    case 'click':
      return '🖱️';
    case 'scroll_depth':
      return '📜';
    case 'form_submit':
      return '📝';
    case 'input_focus':
      return '⌨️';
    case 'page_hidden':
      return '👁️';
    case 'page_visible':
      return '👁️';
    case 'page_exit':
      return '🚪';
    default:
      return '🖱️';
  }
};

const formatInteractionType = (type) => {
  return type
    .replace(/_/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase())
    .replace('Scroll Depth', 'Scroll Depth')
    .replace('Form Submit', 'Form Submit')
    .replace('Input Focus', 'Input Focus')
    .replace('Page Hidden', 'Page Hidden')
    .replace('Page Visible', 'Page Visible')
    .replace('Page Exit', 'Page Exit');
};

export default UserInteractionsTable; 