import { Folder, FolderOpen, FileText, FileCode, FileJson, Image, File } from "lucide-react";

const FILE_ICONS = {
  // JavaScript
  js: { icon: "JS", color: "text-yellow-400" },
  jsx: { icon: "JSX", color: "text-cyan-400" },
  ts: { icon: "TS", color: "text-blue-400" },
  tsx: { icon: "TSX", color: "text-blue-300" },
  
  // Web
  html: { icon: "HTML", color: "text-orange-400" },
  css: { icon: "CSS", color: "text-blue-400" },
  scss: { icon: "SCSS", color: "text-pink-400" },
  
  // Data
  json: { icon: "JSON", color: "text-yellow-300" },
  xml: { icon: "XML", color: "text-orange-300" },
  yaml: { icon: "YAML", color: "text-red-300" },
  yml: { icon: "YML", color: "text-red-300" },
  
  // Config
  md: { icon: "MD", color: "text-gray-300" },
  txt: { icon: "TXT", color: "text-gray-400" },
  env: { icon: "ENV", color: "text-yellow-500" },
  
  // Languages
  py: { icon: "PY", color: "text-green-400" },
  java: { icon: "JAVA", color: "text-red-400" },
  cpp: { icon: "C++", color: "text-blue-500" },
  c: { icon: "C", color: "text-blue-400" },
  go: { icon: "GO", color: "text-cyan-300" },
  rs: { icon: "RS", color: "text-orange-500" },
  
  // Images
  png: { icon: Image, color: "text-purple-400", isComponent: true },
  jpg: { icon: Image, color: "text-purple-400", isComponent: true },
  svg: { icon: "SVG", color: "text-orange-400" },
  gif: { icon: Image, color: "text-purple-400", isComponent: true },
};

function getFileExtension(name) {
  const parts = name.split(".");
  if (parts.length > 1) {
    return parts[parts.length - 1].toLowerCase();
  }
  return "";
}

export default function FileIcon({ name, type, isOpen = false }) {
  // Folder icon
  if (type === "folder") {
    const FolderIcon = isOpen ? FolderOpen : Folder;
    return <FolderIcon size={14} className="text-gray-400" />;
  }

  // Get file extension
  const ext = getFileExtension(name);
  const config = FILE_ICONS[ext];

  if (config) {
    if (config.isComponent) {
      const IconComponent = config.icon;
      return <IconComponent size={14} className={config.color} />;
    }
    return (
      <span className={`text-[10px] font-bold ${config.color}`}>
        {config.icon}
      </span>
    );
  }

  // Default file icon
  return <FileText size={14} className="text-gray-400" />;
}
