import { Link } from 'react-router-dom';
import { Plus, Folder, UserPlus, Building } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const QuickActionCard = ({ icon: Icon, label, description, onClick, to, accent, isDark }) => {
  const accentColors = {
    blue: 'from-blue-500/10 to-blue-600/5 border-blue-500/20 hover:border-blue-500/40',
    purple: 'from-purple-500/10 to-purple-600/5 border-purple-500/20 hover:border-purple-500/40',
    green: 'from-emerald-500/10 to-emerald-600/5 border-emerald-500/20 hover:border-emerald-500/40',
    orange: 'from-orange-500/10 to-orange-600/5 border-orange-500/20 hover:border-orange-500/40',
  };

  const iconColors = {
    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    green: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    orange: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  };

  const content = (
    <>
      <div className={`w-10 h-10 rounded-lg border flex items-center justify-center ${iconColors[accent]}`}>
        <Icon size={20} />
      </div>
      <div className="mt-4">
        <span className={`text-sm font-medium block ${isDark ? 'text-white' : 'text-gray-900'}`}>{label}</span>
        <span className={`text-xs mt-0.5 block ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>{description}</span>
      </div>
    </>
  );

  const className = `flex flex-col items-start p-4 rounded-xl border bg-gradient-to-br transition-all duration-200 cursor-pointer ${accentColors[accent]}`;

  if (to) {
    return (
      <Link to={to} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={`${className} text-left`}>
      {content}
    </button>
  );
};

export default function QuickActions({ onNewProject }) {
  const { isDark } = useTheme();
  
  return (
    <div className="mb-8">
      <h2 className={`text-sm font-medium mb-4 uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Quick Actions</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <QuickActionCard 
          icon={Plus} 
          label="New Project" 
          description="Create a new project"
          onClick={onNewProject} 
          accent="blue"
          isDark={isDark}
        />
        <QuickActionCard 
          icon={Folder} 
          label="Upload Project" 
          description="Import existing code"
          to="/upload" 
          accent="purple"
          isDark={isDark}
        />
        
      </div>
    </div>
  );
}
