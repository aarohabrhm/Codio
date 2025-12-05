import React, { useState, useEffect, useRef } from 'react';
import { 
  Folder, 
  FileCode, 
  FileJson, 
  FileText, 
  Settings, 
  Play, 
  Save, 
  Search, 
  Menu, 
  ChevronRight, 
  ChevronDown, 
  X, 
  Trash2, 
  Plus, 
  Clock, 
  CornerUpLeft, 
  CornerUpRight, 
  MoreVertical,
  Layout,
  HelpCircle,
  BookOpen,
  Share2,
  MessageSquare,
  Maximize2,
  RefreshCw,
  Box,
  Code as CodeIcon
} from 'lucide-react';

// --- Mock Data & Initial State ---

const INITIAL_CODE_C_SHARP = `/// <summary>
/// Generates unique random codes and inserts them into the database.
/// </summary>
/// <param name="numberOfCodes">The number of codes you need.</param>
/// <returns>A list of unique random codes.</returns>
public ICollection<string> GenerateCodes(int numberOfCodes)
{
    var result = new List<string>(numberOfCodes);

    while (result.Count < numberOfCodes)
    {
        var batchSize = Math.Min(_batchSize, numberOfCodes - result.Count);
        var batch = GetBatch(batchSize);
        var oldResultCount = result.Count;

        result.AddRange(FilterAndSecureBatch(batch));

        var filteredBatchSize = result.Count - oldResultCount;
        var collisionRatio = ((double)batchSize - filteredBatchSize) / batchSize;

        if (collisionRatio > _collisionThreshold)
        {
            CodeLength++;
        }
    }

    return result;
}`;

const INITIAL_FILES = {
  'root': {
    id: 'root',
    name: 'Files',
    type: 'folder',
    isOpen: true,
    children: ['backend', 'frontend', 'personal', 'macos', 'windows', 'linux']
  },
  'backend': { id: 'backend', name: 'Backend', type: 'folder', isOpen: true, parent: 'root', children: ['main', 'test', 'app-js', 'package-json'] },
  'main': { id: 'main', name: 'main', type: 'folder', isOpen: false, parent: 'backend', children: ['file-txt', 'index-js'] },
  'test': { id: 'test', name: 'test', type: 'folder', isOpen: false, parent: 'backend', children: [] },
  'file-txt': { id: 'file-txt', name: 'file.txt', type: 'file', parent: 'main', status: 'D' },
  'index-js': { id: 'index-js', name: 'index.js', type: 'file', parent: 'main', status: 'M' },
  'app-js': { id: 'app-js', name: 'app.js', type: 'file', parent: 'backend', status: 'A', content: INITIAL_CODE_C_SHARP },
  'package-json': { id: 'package-json', name: 'package.json', type: 'file', parent: 'backend', content: '{\n  "name": "demo-project",\n  "version": "1.0.0"\n}' },
  
  'frontend': { id: 'frontend', name: 'Frontend', type: 'folder', parent: 'root', children: ['style-css'] },
  'style-css': { id: 'style-css', name: 'style.css', type: 'file', parent: 'frontend', content: 'body { background: #1a1a1a; color: #fff; }' },
  
  'personal': { id: 'personal', name: 'Personal Website', type: 'folder', parent: 'root', children: ['index-html'] },
  'index-html': { id: 'index-html', name: 'index.html', type: 'file', parent: 'personal', content: '<!DOCTYPE html>\n<html>\n<body>\n<h1>Hello World</h1>\n</body>\n</html>' },

  'macos': { id: 'macos', name: 'MacOS', type: 'folder', isOpen: true, parent: 'root', children: ['mac-back', 'mac-front', 'sql'] },
  'mac-back': { id: 'mac-back', name: 'Backend', type: 'folder', parent: 'macos', children: [] },
  'mac-front': { id: 'mac-front', name: 'Frontend', type: 'folder', parent: 'macos', children: [] },
  'sql': { id: 'sql', name: 'SQL', type: 'folder', isOpen: true, parent: 'macos', children: ['_backend', '_frontend', '_sql'] },
  '_backend': { id: '_backend', name: '_backend', type: 'file', parent: 'sql' },
  '_frontend': { id: '_frontend', name: '_frontend', type: 'file', parent: 'sql' },
  '_sql': { id: '_sql', name: '_sql', type: 'file', parent: 'sql' },

  'windows': { id: 'windows', name: 'WindowsOS', type: 'folder', parent: 'root', children: [] },
  'linux': { id: 'linux', name: 'Linux', type: 'folder', parent: 'root', children: [], status: 'D' }, // Folder specific status
};

// --- Components ---

const FileIcon = ({ name, type }) => {
  if (type === 'folder') return <Folder size={16} className="text-gray-400 fill-gray-400/20" />;
  if (name.endsWith('.js')) return <span className="text-yellow-400 text-xs font-bold">JS</span>;
  if (name.endsWith('.css')) return <span className="text-blue-400 text-xs font-bold">#</span>;
  if (name.endsWith('.html')) return <span className="text-orange-500 text-xs font-bold">&lt;&gt;</span>;
  if (name.endsWith('.json')) return <span className="text-green-400 text-xs font-bold">{'{}'}</span>;
  return <FileText size={16} className="text-gray-500" />;
};

const StatusBadge = ({ status }) => {
  if (!status) return null;
  const colors = {
    'M': 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
    'D': 'text-red-500 bg-red-500/10 border-red-500/20',
    'A': 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
  };
  return (
    <span className={`text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded ${colors[status] || ''}`}>
      {status}
    </span>
  );
};

// --- Main Editor Component ---

export default function Editor() {
  const [files, setFiles] = useState(INITIAL_FILES);
  const [openFiles, setOpenFiles] = useState(['app-js', 'style-css', 'index-html']);
  const [activeFileId, setActiveFileId] = useState('app-js');
  const [consoleOutput, setConsoleOutput] = useState([
    "Hello track!",
    "",
    "Connection lost. Will try to reconnect after 1sec.",
    "If the connection keeps failing, please verify the internet connection or reload the page.",
    "",
    'echo "Hello track!"',
    "",
    "Hello track!"
  ]);
  const [activeBottomTab, setActiveBottomTab] = useState('test'); // test, query, submissions

  // Toggle Folder Open/Close
  const toggleFolder = (folderId) => {
    setFiles(prev => ({
      ...prev,
      [folderId]: { ...prev[folderId], isOpen: !prev[folderId].isOpen }
    }));
  };

  // Open a file
  const openFile = (fileId) => {
    if (!openFiles.includes(fileId)) {
      setOpenFiles([...openFiles, fileId]);
    }
    setActiveFileId(fileId);
  };

  // Close a file
  const closeFile = (e, fileId) => {
    e.stopPropagation();
    const newOpen = openFiles.filter(id => id !== fileId);
    setOpenFiles(newOpen);
    if (activeFileId === fileId && newOpen.length > 0) {
      setActiveFileId(newOpen[newOpen.length - 1]);
    } else if (newOpen.length === 0) {
      setActiveFileId(null);
    }
  };

  // Update file content
  const updateFileContent = (newContent) => {
    if (!activeFileId) return;
    setFiles(prev => ({
      ...prev,
      [activeFileId]: { ...prev[activeFileId], content: newContent }
    }));
  };

  const handleRunTest = () => {
    setConsoleOutput(prev => [...prev, "", "> Running tests...", "> All tests passed successfully!"]);
  };

  // Recursive File Tree Renderer
  const renderTree = (nodeId, depth = 0) => {
    const node = files[nodeId];
    if (!node) return null;

    const isFolder = node.type === 'folder';
    const isSelected = activeFileId === nodeId;
    
    // Style adjustments for the exact look
    const paddingLeft = `${depth * 16 + 12}px`;

    return (
      <div key={nodeId}>
        <div 
          className={`
            group flex items-center py-1.5 cursor-pointer text-sm select-none transition-colors
            ${isSelected ? 'bg-[#2b3245] text-white' : 'text-gray-400 hover:text-gray-200 hover:bg-[#2b3245]/50'}
          `}
          style={{ paddingLeft }}
          onClick={() => isFolder ? toggleFolder(nodeId) : openFile(nodeId)}
        >
          <span className="mr-1.5 opacity-70">
            {isFolder && (
              node.isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />
            )}
            {!isFolder && <div className="w-3.5" />} 
          </span>
          
          <span className="mr-2">
            <FileIcon name={node.name} type={node.type} />
          </span>
          
          <span className="flex-1 truncate">{node.name}</span>
          
          <span className="mr-2">
            <StatusBadge status={node.status} />
          </span>
        </div>

        {isFolder && node.isOpen && node.children.map(childId => renderTree(childId, depth + 1))}
      </div>
    );
  };

  return (
    <div className="flex h-screen w-full bg-[#0d1117] text-gray-300 font-sans overflow-hidden p-2 gap-2">
      
      {/* --- Sidebar --- */}
      <div className="w-80 flex bg-[#161b22] rounded-2xl overflow-hidden flex-col border border-gray-800 shadow-xl">
        
        {/* Top Header of Sidebar */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h2 className="text-lg font-semibold text-gray-100">Files</h2>
          <div className="flex gap-2">
            <button className="p-1.5 hover:bg-gray-700 rounded transition-colors text-red-400 bg-red-900/20"><Trash2 size={14} /></button>
            <button className="p-1.5 hover:bg-gray-700 rounded transition-colors bg-gray-700 text-white"><Plus size={14} /></button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
           {/* Mini Nav Strip */}
          <div className="w-14 flex flex-col items-center py-4 gap-6 border-r border-gray-800 bg-[#12161d]">
            <div className="flex flex-col items-center gap-1 cursor-pointer text-teal-400">
              <div className="bg-[#1f2937] p-2 rounded-lg text-teal-400">
                <Layout size={20} />
              </div>
              <span className="text-[10px] font-medium">Files</span>
            </div>
            <div className="flex flex-col items-center gap-1 cursor-pointer hover:text-gray-100 transition-colors">
              <BookOpen size={20} />
              <span className="text-[10px] font-medium">Guide</span>
            </div>
            <div className="flex flex-col items-center gap-1 cursor-pointer hover:text-gray-100 transition-colors">
              <HelpCircle size={20} />
              <span className="text-[10px] font-medium">Help</span>
            </div>
          </div>

          {/* File Tree Area */}
          <div className="flex-1 overflow-y-auto custom-scrollbar py-2">
            {INITIAL_FILES['root'].children.map(childId => renderTree(childId))}
          </div>
        </div>
        
        {/* Sidebar Footer */}
        <div className="p-3 bg-[#12161d] border-t border-gray-800 text-xs">
            <div className="mb-3 flex items-center gap-2 text-gray-500">
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                <span>index.js was modified 5 min ago</span>
            </div>
            <div className="flex gap-3">
                <div className="flex items-center gap-1.5"><StatusBadge status="A" /><span className="text-gray-500">Added</span></div>
                <div className="flex items-center gap-1.5"><StatusBadge status="M" /><span className="text-gray-500">Modified</span></div>
                <div className="flex items-center gap-1.5"><StatusBadge status="D" /><span className="text-gray-500">Deleted</span></div>
            </div>
            <div className="mt-4 flex items-center gap-3 pt-3 border-t border-gray-800">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Jon" alt="User" className="w-8 h-8 rounded-full bg-gray-700" />
                <span className="font-medium text-gray-200">Jon</span>
            </div>
        </div>
      </div>

      {/* --- Main Content Area --- */}
      <div className="flex-1 flex flex-col rounded-2xl overflow-hidden gap-2">
        
        {/* Code Editor Section */}
        <div className="flex-1 bg-[#161b22] rounded-2xl border border-gray-800 flex flex-col overflow-hidden shadow-xl relative">
          
          {/* Tabs Bar */}
          <div className="flex bg-[#0d1117] overflow-x-auto no-scrollbar items-end pt-1">
            {openFiles.map(fileId => (
              <div 
                key={fileId}
                onClick={() => setActiveFileId(fileId)}
                className={`
                  group flex items-center gap-2 px-4 py-2.5 min-w-[120px] max-w-[200px] text-sm cursor-pointer border-r border-gray-800 relative
                  ${activeFileId === fileId ? 'bg-[#1e2330] text-gray-100 border-t-2 border-t-teal-500 rounded-t-lg' : 'bg-[#161b22] text-gray-500 hover:bg-[#1c2128] hover:text-gray-300'}
                `}
              >
                <span className="truncate flex-1">{files[fileId]?.name}</span>
                <button 
                    onClick={(e) => closeFile(e, fileId)}
                    className={`opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-gray-700 ${activeFileId === fileId ? 'opacity-100' : ''}`}
                >
                    <X size={12} />
                </button>
              </div>
            ))}
          </div>

          {/* Toolbar */}
          <div className="h-12 bg-[#1e2330] border-b border-gray-800 flex items-center justify-end px-4 gap-3">
             <button className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded"><CornerUpLeft size={16}/></button>
             <button className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded"><CornerUpRight size={16}/></button>
             <button className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded"><MoreVertical size={16}/></button>
          </div>

          {/* Editor Area */}
          <div className="flex-1 relative bg-[#1e2330] flex overflow-hidden">
             {/* Line Numbers */}
             <div className="w-12 bg-[#1e2330] text-gray-600 text-right pr-3 pt-4 select-none font-mono text-sm leading-6 border-r border-gray-800/50">
                {Array.from({ length: 26 }).map((_, i) => (
                    <div key={i}>{i + 1}</div>
                ))}
             </div>

             {/* Code Textarea & Highlight Overlay */}
             <div className="flex-1 relative font-mono text-sm">
                {activeFileId ? (
                    <textarea
                        spellCheck="false"
                        className="w-full h-full bg-transparent text-gray-300 p-4 leading-6 resize-none focus:outline-none custom-scrollbar"
                        value={files[activeFileId]?.content || ''}
                        onChange={(e) => updateFileContent(e.target.value)}
                        placeholder="Start coding..."
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-600">
                        <div className="text-center">
                            <CodeIcon size={48} className="mx-auto mb-4 opacity-20"/>
                            <p>Select a file to start editing</p>
                        </div>
                    </div>
                )}
             </div>
          </div>
        </div>

        {/* Bottom Panel */}
        <div className="h-[35%] bg-[#161b22] rounded-2xl border border-gray-800 flex flex-col shadow-xl">
           
           {/* Panel Header */}
           <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800 bg-[#1e2330]">
               <div className="flex gap-6">
                   {['Output', 'AI Query Results', 'Terminal'].map((tab) => {
                       const key = tab.toLowerCase().split(' ')[0];
                       return (
                           <button 
                                key={key}
                                onClick={() => setActiveBottomTab(key)}
                                className={`text-sm font-medium pb-1 border-b-2 transition-colors ${activeBottomTab === key ? 'text-gray-100 border-gray-100' : 'text-gray-500 border-transparent hover:text-gray-300'}`}
                           >
                               {tab}
                           </button>
                       )
                   })}
               </div>
               <div className="flex gap-3 text-gray-500">
                   <Share2 size={16} className="cursor-pointer hover:text-gray-300" />
                   <MessageSquare size={16} className="cursor-pointer hover:text-gray-300" />
                   <Maximize2 size={16} className="cursor-pointer hover:text-gray-300" />
               </div>
           </div>

           {/* Panel Content (Console) */}
           <div className="flex-1 flex overflow-hidden">
                <div className="flex-1 p-4 font-mono text-sm text-gray-300 overflow-y-auto custom-scrollbar bg-[#161b22]">
                    {activeBottomTab === 'test' ? (
                        consoleOutput.map((line, idx) => (
                            <div key={idx} className="min-h-[1.2em]">{line}</div>
                        ))
                    ) : (
                        <div className="text-gray-500 italic p-4">No data available for this view.</div>
                    )}
                </div>

                
           </div>

           {/* Panel Footer (Action Buttons) */}
           <div className="p-3 border-t border-gray-800 bg-[#1e2330] flex items-center justify-between">
                <div className="flex gap-2 text-gray-500">
                    <button className="p-2 hover:bg-gray-700 rounded transition-colors"><Settings size={16} /></button>
                    <button className="p-2 hover:bg-gray-700 rounded transition-colors"><CodeIcon size={16} /></button>
                    <button className="p-2 hover:bg-gray-700 rounded transition-colors"><Box size={16} /></button>
                    <button className="p-2 hover:bg-gray-700 rounded transition-colors"><RefreshCw size={16} /></button>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={handleRunTest}
                        className="px-4 py-2 bg-[#21262d] text-gray-200 text-xs font-bold rounded hover:bg-[#30363d] transition-colors uppercase tracking-wider border border-gray-700"
                    >
                        Run Test
                    </button>
                </div>
           </div>
        </div>

      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #30363d;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #484f58;
        }
        textarea::selection {
            background: rgba(45, 212, 191, 0.3);
        }
      `}</style>
    </div>
  );
}