import EditorMonaco from "@monaco-editor/react";
import { useRef, useImperativeHandle, forwardRef } from "react";

const getLanguageFromName = (name = "") => {
  const n = name.toLowerCase();
  if (n.endsWith(".js") || n.endsWith(".jsx")) return "javascript";
  if (n.endsWith(".ts") || n.endsWith(".tsx")) return "typescript";
  if (n.endsWith(".css")) return "css";
  if (n.endsWith(".json")) return "json";
  if (n.endsWith(".html")) return "html";
  if (n.endsWith(".cs")) return "csharp";
  if (n.endsWith(".py")) return "python";
  if (n.endsWith(".md")) return "markdown";
  if (n.endsWith(".cpp") || n.endsWith(".cc") || n.endsWith(".cxx")) return "cpp";
  if (n.endsWith(".c") || n.endsWith(".h")) return "c";
  if (n.endsWith(".java")) return "java";
  if (n.endsWith(".go")) return "go";
  if (n.endsWith(".rs")) return "rust";
  if (n.endsWith(".rb")) return "ruby";
  if (n.endsWith(".php")) return "php";
  if (n.endsWith(".swift")) return "swift";
  if (n.endsWith(".kt") || n.endsWith(".kts")) return "kotlin";
  if (n.endsWith(".sql")) return "sql";
  if (n.endsWith(".sh") || n.endsWith(".bash")) return "shell";
  if (n.endsWith(".yaml") || n.endsWith(".yml")) return "yaml";
  if (n.endsWith(".xml")) return "xml";
  return "plaintext";
};

const CodeEditor = forwardRef(function CodeEditor({ file, onChange, onSave }, ref) {
  const monacoRef = useRef(null);
  const editorRef = useRef(null);

  useImperativeHandle(ref, () => ({
    undo: () => editorRef.current?.trigger('keyboard', 'undo', null),
    redo: () => editorRef.current?.trigger('keyboard', 'redo', null),
    getContent: () => editorRef.current?.getValue(),
    getLanguage: () => file ? getLanguageFromName(file.name) : null,
  }));

  if (!file) return null;

  const handleEditorWillMount = (monaco) => {
    monaco.editor.defineTheme("codio-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "", foreground: "d4d4d4", background: "0a0a0a" },
        { token: "comment", foreground: "6a9955" },
        { token: "keyword", foreground: "569cd6" },
        { token: "string", foreground: "ce9178" },
        { token: "number", foreground: "b5cea8" },
        { token: "type", foreground: "4ec9b0" },
        { token: "function", foreground: "dcdcaa" },
        { token: "variable", foreground: "9cdcfe" },
      ],
      colors: {
        "editor.background": "#0a0a0a",
        "editor.foreground": "#d4d4d4",
        "editorLineNumber.foreground": "#4a4a4a",
        "editorLineNumber.activeForeground": "#c0c0c0",
        "editorCursor.foreground": "#22d3ee",
        "editor.selectionBackground": "#264f78",
        "editor.selectionHighlightBackground": "#264f7855",
        "editorLineHighlightBackground": "#00000000",
        "editorLineHighlightBorder": "#00000000",
        "editorIndentGuide.background": "#1a1a1a",
        "editorIndentGuide.activeBackground": "#2a2a2a",
        "editorWidget.background": "#0f0f0f",
        "editorWidget.border": "#1a1a1a",
        "editorSuggestWidget.background": "#0f0f0f",
        "editorSuggestWidget.border": "#1a1a1a",
        "editorSuggestWidget.selectedBackground": "#1a1a1a",
        "scrollbarSlider.background": "#2a2a2a55",
        "scrollbarSlider.hoverBackground": "#3a3a3a77",
        "scrollbarSlider.activeBackground": "#4a4a4a99",
        "minimap.background": "#0a0a0a",
      },
    });
  };

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    monaco.editor.setTheme("codio-dark");
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
      theme="codio-dark"
      beforeMount={handleEditorWillMount}
      onMount={handleEditorDidMount}
      onChange={onChange}
      options={{
        fontFamily: "Fira Code, JetBrains Mono, Consolas, Monaco, monospace",
        fontSize: 13,
        minimap: { enabled: true, scale: 0.8 },
        folding: true,
        lineNumbers: "on",
        automaticLayout: true,
        renderLineHighlight: "none",
        cursorSmoothCaretAnimation: "on",
        cursorBlinking: "smooth",
        wordWrap: "off",
        padding: { top: 12 },
        scrollbar: {
          verticalScrollbarSize: 10,
          horizontalScrollbarSize: 10,
        },
        smoothScrolling: true,
        bracketPairColorization: { enabled: true },
      }}
    />
  );
});

export default CodeEditor;
