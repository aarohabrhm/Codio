import { Link } from 'react-router-dom';
import { Plus, Folder, UserPlus, Building } from 'lucide-react';

const QuickActionCard = ({ icon: Icon, label, description, onClick, to, accent }) => {
  const accentColors = {
    blue: 'from-accent/10 to-accent/5 border-accent/20 hover:border-accent/40',
    purple: 'from-accent/10 to-accent/5 border-accent/20 hover:border-accent/40',
    green: 'from-accent/10 to-accent/5 border-accent/20 hover:border-accent/40',
    orange: 'from-accent/10 to-accent/5 border-accent/20 hover:border-accent/40',
  };

  const iconColors = {
    blue: 'text-accent-fg bg-accent/10 border-accent/20',
    purple: 'text-accent-fg bg-accent/10 border-accent/20',
    green: 'text-accent-fg bg-accent/10 border-accent/20',
    orange: 'text-accent-fg bg-accent/10 border-accent/20',
  };

  const content = (
    <>
      <div className={`w-10 h-10 rounded-lg border flex items-center justify-center ${iconColors[accent]}`}>
        <Icon size={20} />
      </div>
      <div className="mt-4">
        <span className={`text-sm font-medium block text-primary`}>{label}</span>
        <span className={`text-xs mt-0.5 block text-muted`}>{description}</span>
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
  
  return (
    <div className="mb-8">
      <h2 className="mb-4 font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-muted">Quick Actions</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <QuickActionCard 
          icon={Plus} 
          label="New Project" 
          description="Create a new project"
          onClick={onNewProject} 
          accent="blue"
        />
        <QuickActionCard 
          icon={Folder} 
          label="Upload Project" 
          description="Import existing code"
          to="/upload" 
          accent="purple"
        />
        
      </div>
    </div>
  );
}
