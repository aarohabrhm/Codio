import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const cn = (...args) => args.filter(Boolean).join(' ');

const Tab = ({ label, value, active, isDark }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const onClick = () => {
    const params = new URLSearchParams(location.search);
    params.set('tab', value);
    navigate({ pathname: location.pathname, search: params.toString() });
  };

  return (
    <button 
      onClick={onClick} 
      className={cn(
        'px-4 py-2 relative transition text-sm font-medium',
        active 
          ? (isDark ? 'text-white' : 'text-gray-900')
          : (isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700')
      )}
    >
      {label}
      {active && (
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 rounded-t-full" />
      )}
    </button>
  );
};

export default function ProjectTabs({ currentTab }) {
  const { isDark } = useTheme();
  
  const tabs = [
    { label: 'All', value: 'all' },
    { label: 'Recent', value: 'recent' },
    { label: 'Favorites', value: 'favorites' },
    { label: 'Shared', value: 'shared' },
    { label: 'External', value: 'external' },
    { label: 'Archived', value: 'archived' },
  ];

  return (
    <div className={`border-b ${isDark ? 'border-[#1a1a1a]' : 'border-gray-200'}`}>
      <div className="flex items-center">
        {tabs.map((tab) => (
          <Tab 
            key={tab.value} 
            label={tab.label} 
            value={tab.value} 
            active={currentTab === tab.value}
            isDark={isDark}
          />
        ))}
      </div>
    </div>
  );
}
