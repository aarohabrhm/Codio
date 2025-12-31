import EditorMonaco from "@monaco-editor/react";
import { useRef } from "react";

const getLanguageFromName = (name = "") => {
  const n = name.toLowerCase();
  if (n.endsWith(".js") || n.endsWith(".jsx")) return "javascript";
  if (n.endsWith(".ts") || n.endsWith(".tsx")) return "typescript";
  if (n.endsWith(".css")) return "css";
  if (n.endsWith(".json")) return "json";
  if (n.endsWith(".html")) return "html";
  if (n.endsWith(".cs")) return "csharp";
  return "plaintext";
};

export default function CodeEditor({ file, onChange, onSave }) {
  const monacoRef = useRef(null);
  const editorRef = useRef(null);

  if (!file) return null;

  const handleEditorWillMount = (monaco) => {
    monaco.editor.defineTheme("vscode-clone-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [{ token: "", foreground: "c9d1d9", background: "0b0f14" }],
      colors: {
        "editor.background": "#0b0f14",
        "editorLineNumber.foreground": "#4b5563",
        "editorLineNumber.activeForeground": "#9ca3af",
        "editorCursor.foreground": "#9AE6B4",
        "editor.selectionBackground": "#2dd4bf33",
      },
    });
  };

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    monaco.editor.setTheme("vscode-clone-dark");
    if (onSave) {
      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => onSave());
    }
  };

  const language = getLanguageFromName(file.name);

  return (
    <EditorMonaco
      height="100%"
      language={language}
      value={file.content}
      theme="vscode-clone-dark"
      beforeMount={handleEditorWillMount}
      onMount={handleEditorDidMount}
      onChange={onChange}
      options={{
        fontFamily: "Fira Code, Menlo, Monaco, monospace",
        fontSize: 13,
        minimap: { enabled: true },
        folding: true,
        lineNumbers: "on",
        automaticLayout: true,
        renderLineHighlight: "line",
        cursorSmoothCaretAnimation: true,
        wordWrap: "off",
        
      }}
    />
  )
}
