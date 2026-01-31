import React, {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import Editor from "@monaco-editor/react";
import { useTheme } from "../../../context/ThemeContext";

/* ---------- Language Detection ---------- */
const getLanguageFromName = (name = "") => {
  const n = name.toLowerCase();
  if (n.endsWith(".js") || n.endsWith(".jsx")) return "javascript";
  if (n.endsWith(".ts") || n.endsWith(".tsx")) return "typescript";
  if (n.endsWith(".css")) return "css";
  if (n.endsWith(".json")) return "json";
  if (n.endsWith(".html")) return "html";
  if (n.endsWith(".py")) return "python";
  if (n.endsWith(".cpp") || n.endsWith(".cc")) return "cpp";
  if (n.endsWith(".c")) return "c";
  if (n.endsWith(".java")) return "java";
  if (n.endsWith(".go")) return "go";
  if (n.endsWith(".rs")) return "rust";
  return "plaintext";
};

/* ---------- Component ---------- */
const CodeEditor = forwardRef(
  ({ file, onChange, onCursorChange, onSave }, ref) => {
    const editorRef = useRef(null);
    const monacoRef = useRef(null);
    const currentFileId = useRef(null);
    const isRemoteChange = useRef(false);
    const { isDark } = useTheme();

    /* ---------- Expose methods ---------- */
    useImperativeHandle(ref, () => ({
      getContent: () => editorRef.current?.getValue() || "",
      undo: () => editorRef.current?.trigger("keyboard", "undo"),
      redo: () => editorRef.current?.trigger("keyboard", "redo"),
    }));

    /* ---------- Theme ---------- */
    const handleBeforeMount = (monaco) => {
      // Dark theme
      monaco.editor.defineTheme("codio-dark", {
        base: "vs-dark",
        inherit: true,
        rules: [
          { token: "comment", foreground: "6a9955" },
          { token: "keyword", foreground: "569cd6" },
          { token: "string", foreground: "ce9178" },
          { token: "number", foreground: "b5cea8" },
          { token: "function", foreground: "dcdcaa" },
        ],
        colors: {
          "editor.background": "#0a0a0a",
          "editor.foreground": "#d4d4d4",
          "editorCursor.foreground": "#22d3ee",
          "editor.selectionBackground": "#264f78",
          "editorLineNumber.foreground": "#4a4a4a",
          "editorLineNumber.activeForeground": "#c0c0c0",
          "scrollbarSlider.background": "#2a2a2a55",
        },
      });
      
      // Light theme
      monaco.editor.defineTheme("codio-light", {
        base: "vs",
        inherit: true,
        rules: [
          { token: "comment", foreground: "008000" },
          { token: "keyword", foreground: "0000ff" },
          { token: "string", foreground: "a31515" },
          { token: "number", foreground: "098658" },
          { token: "function", foreground: "795e26" },
        ],
        colors: {
          "editor.background": "#ffffff",
          "editor.foreground": "#1f1f1f",
          "editorCursor.foreground": "#0891b2",
          "editor.selectionBackground": "#add6ff",
          "editorLineNumber.foreground": "#6e7681",
          "editorLineNumber.activeForeground": "#1f1f1f",
          "scrollbarSlider.background": "#d1d5db55",
        },
      });
    };

    /* ---------- Mount ---------- */
    const handleMount = (editor, monaco) => {
      editorRef.current = editor;
      monacoRef.current = monaco;

      monaco.editor.setTheme(isDark ? "codio-dark" : "codio-light");

      /* Cursor tracking */
      editor.onDidChangeCursorPosition((e) => {
        if (!isRemoteChange.current && onCursorChange) {
          onCursorChange(e.position.lineNumber, e.position.column);
        }
      });

      /* Content tracking */
      editor.onDidChangeModelContent(() => {
        if (isRemoteChange.current) {
          isRemoteChange.current = false;
          return;
        }

        if (onChange) {
          onChange(editor.getValue());
        }
      });

      /* Ctrl / Cmd + S */
      editor.addCommand(
        monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
        () => onSave?.()
      );
    };

    /* ---------- Theme Change Effect ---------- */
    useEffect(() => {
      if (monacoRef.current) {
        monacoRef.current.editor.setTheme(isDark ? "codio-dark" : "codio-light");
      }
    }, [isDark]);

    /* ---------- Remote Updates ---------- */
    useEffect(() => {
      const handleRemoteUpdate = (e) => {
        const { fileId, content } = e.detail;

        // CRITICAL: Only update if this is MY currently active file
        if (!file || file.id !== fileId || !editorRef.current) {
          return;
        }

        const current = editorRef.current.getValue();
        if (current === content) return;

        console.log(`🔄 Applying remote update to file: ${fileId}`);

        isRemoteChange.current = true;

        const position = editorRef.current.getPosition();
        const scrollTop = editorRef.current.getScrollTop();

        editorRef.current.setValue(content);
        
        if (position) editorRef.current.setPosition(position);
        editorRef.current.setScrollTop(scrollTop);
      };

      window.addEventListener("remote-code-update", handleRemoteUpdate);
      return () =>
        window.removeEventListener("remote-code-update", handleRemoteUpdate);
    }, [file?.id]);

    /* ---------- File Switch ---------- */
    useEffect(() => {
      if (!editorRef.current || !file) return;

      // Only update if we're switching to a different file
      if (currentFileId.current !== file.id) {
        console.log(`📂 Switching to file: ${file.id}`);
        currentFileId.current = file.id;

        isRemoteChange.current = true;
        editorRef.current.setValue(file.content || "");
      }
    }, [file?.id, file?.content]);

    if (!file) {
      return (
        <div className={`h-full w-full flex items-center justify-center text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
          Select a file to start editing
        </div>
      );
    }

    return (
      <Editor
        height="100%"
        key={file.id}
        defaultValue={file.content || ""}
        language={getLanguageFromName(file.name)}
        beforeMount={handleBeforeMount}
        onMount={handleMount}
        theme={isDark ? "codio-dark" : "codio-light"}
        options={{
          fontSize: 13,
          minimap: { enabled: true },
          automaticLayout: true,
          wordWrap: "on",
          smoothScrolling: true,
          scrollBeyondLastLine: false,
          cursorSmoothCaretAnimation: "on",
          formatOnPaste: true,
          formatOnType: true,
        }}
      />
    );
  }
);

CodeEditor.displayName = "CodeEditor";
export default CodeEditor;