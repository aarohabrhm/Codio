import { Folder, FileText } from "lucide-react";

export default function FileIcon({ name, type }) {
  if (type === "folder") return <Folder size={14} />;
  if (name.endsWith(".js")) return <span className="text-yellow-400 text-xs font-semibold">JS</span>;
  return <FileText size={14} />;
}
