import React, {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import Editor from "@monaco-editor/react";
import { useTheme } from "../../../context/ThemeContext";

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

const CodeEditor = forwardRef(
  ({ file, onChange, onCursorChange, onSave }, ref) => {
    const editorRef = useRef(null);
    const monacoRef = useRef(null);
    const currentFileId = useRef(null);
    const isRemoteChange = useRef(false);
    const { isDark } = useTheme();

    useImperativeHandle(ref, () => ({
      getContent: () => editorRef.current?.getValue() || "",
      undo: () => editorRef.current?.trigger("keyboard", "undo"),
      redo: () => editorRef.current?.trigger("keyboard", "redo"),

      applyDiff: (newContent) => {
        const editor = editorRef.current;
        const monaco = monacoRef.current;
        if (!editor || !monaco) return;

        const model = editor.getModel();
        if (!model) return;

        const oldLines = model.getLinesContent();
        const newLines = newContent.split("\n");

        const edits = [];
        const maxLen = Math.max(oldLines.length, newLines.length);

        for (let i = 0; i < maxLen; i++) {
          const oldLine = oldLines[i];
          const newLine = newLines[i];

          if (oldLine === undefined) {
            edits.push({
              range: new monaco.Range(i + 1, 1, i + 1, 1),
              text: (i === oldLines.length ? "" : "\n") + newLine,
            });
          } else if (newLine === undefined) {
            edits.push({
              range: new monaco.Range(i + 1, 1, i + 2, 1),
              text: "",
            });
          } else if (oldLine !== newLine) {
            edits.push({
              range: new monaco.Range(i + 1, 1, i + 1, oldLine.length + 1),
              text: newLine,
            });
          }
        }

        if (edits.length === 0) return;

        const position = editor.getPosition();
        const scrollTop = editor.getScrollTop();

        isRemoteChange.current = true;
        model.pushEditOperations([], edits, () => null);

        if (position) editor.setPosition(position);
        editor.setScrollTop(scrollTop);
      },
    }));

    const handleBeforeMount = (monaco) => {
      // Near-monochrome syntax, matching the landing page's product panel:
      // one blue-family tint carries functions, everything else is a step on
      // the grey ramp. The gutter, widgets and minimap are declared too —
      // left unset they fall back to stock VS Code grey, which reads as a
      // foreign panel dropped into the terminal surface.
      monaco.editor.defineTheme("codio-dark", {
        base: "vs-dark",
        inherit: true,
        rules: [
          { token: "", foreground: "c9cfc9" },
          { token: "comment", foreground: "5e665e", fontStyle: "italic" },
          { token: "keyword", foreground: "efefea" },
          { token: "string", foreground: "a8b0a8" },
          { token: "number", foreground: "a8b0a8" },
          { token: "function", foreground: "8fa7f5" },
          { token: "type", foreground: "8fa7f5" },
          { token: "variable", foreground: "c9cfc9" },
          { token: "operator", foreground: "6e766e" },
          { token: "delimiter", foreground: "6e766e" },
        ],
        colors: {
          "editor.background": "#0c0f0c",
          "editor.foreground": "#c9cfc9",
          "editorCursor.foreground": "#8fa7f5",
          "editor.selectionBackground": "#2b4bf055",
          "editor.lineHighlightBackground": "#101310",
          "editor.lineHighlightBorder": "#00000000",
          "editorLineNumber.foreground": "#3d453d",
          "editorLineNumber.activeForeground": "#8b938b",
          "editorGutter.background": "#0c0f0c",
          "editorIndentGuide.background1": "#1c211c",
          "editorIndentGuide.activeBackground1": "#2b4bf066",
          "editorWidget.background": "#101310",
          "editorWidget.border": "#ffffff14",
          "editorSuggestWidget.background": "#101310",
          "editorSuggestWidget.selectedBackground": "#1c211c",
          "editorHoverWidget.background": "#101310",
          "minimap.background": "#0c0f0c",
          "scrollbarSlider.background": "#ffffff14",
          "scrollbarSlider.hoverBackground": "#ffffff24",
          "editorBracketMatch.background": "#2b4bf033",
          "editorBracketMatch.border": "#2b4bf0",
        },
      });

      // The paper counterpart, on the landing page's light palette.
      monaco.editor.defineTheme("codio-light", {
        base: "vs",
        inherit: true,
        rules: [
          { token: "", foreground: "171a17" },
          { token: "comment", foreground: "8a8f88", fontStyle: "italic" },
          { token: "keyword", foreground: "171a17" },
          { token: "string", foreground: "5b615a" },
          { token: "number", foreground: "5b615a" },
          { token: "function", foreground: "2b4bf0" },
          { token: "type", foreground: "2b4bf0" },
          { token: "variable", foreground: "171a17" },
          { token: "operator", foreground: "8a8f88" },
          { token: "delimiter", foreground: "8a8f88" },
        ],
        colors: {
          "editor.background": "#efefea",
          "editor.foreground": "#171a17",
          "editorCursor.foreground": "#2b4bf0",
          "editor.selectionBackground": "#2b4bf033",
          "editor.lineHighlightBackground": "#e3e4dc66",
          "editor.lineHighlightBorder": "#00000000",
          "editorLineNumber.foreground": "#b0b4ac",
          "editorLineNumber.activeForeground": "#5b615a",
          "editorGutter.background": "#efefea",
          "editorIndentGuide.background1": "#dcddd4",
          "editorIndentGuide.activeBackground1": "#2b4bf055",
          "editorWidget.background": "#f6f6f2",
          "editorWidget.border": "#171a1720",
          "editorSuggestWidget.background": "#f6f6f2",
          "editorSuggestWidget.selectedBackground": "#e3e4dc",
          "editorHoverWidget.background": "#f6f6f2",
          "minimap.background": "#efefea",
          "scrollbarSlider.background": "#171a1720",
          "scrollbarSlider.hoverBackground": "#171a1733",
          "editorBracketMatch.background": "#2b4bf022",
          "editorBracketMatch.border": "#2b4bf0",
        },
      });
    };

    const handleMount = (editor, monaco) => {
      editorRef.current = editor;
      monacoRef.current = monaco;

      monaco.editor.setTheme(isDark ? "codio-dark" : "codio-light");

      editor.onDidChangeCursorPosition((e) => {
        if (!isRemoteChange.current && onCursorChange) {
          onCursorChange(e.position.lineNumber, e.position.column);
        }
      });

      editor.onDidChangeModelContent(() => {
        if (isRemoteChange.current) {
          isRemoteChange.current = false;
          return;
        }
        if (onChange) {
          onChange(editor.getValue());
        }
      });

      editor.addCommand(
        monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
        () => onSave?.()
      );
    };

    useEffect(() => {
      if (monacoRef.current) {
        monacoRef.current.editor.setTheme(isDark ? "codio-dark" : "codio-light");
      }
    }, [isDark]);

    useEffect(() => {
      const handleRemoteUpdate = (e) => {
        const { fileId, content } = e.detail;

        if (!file || file.id !== fileId || !editorRef.current) return;

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
      return () => window.removeEventListener("remote-code-update", handleRemoteUpdate);
    }, [file?.id]);

    useEffect(() => {
      if (!editorRef.current || !file) return;

      if (currentFileId.current !== file.id) {
        console.log(`📂 Switching to file: ${file.id}`);
        currentFileId.current = file.id;

        isRemoteChange.current = true;
        editorRef.current.setValue(file.content || "");
      }
    }, [file?.id, file?.content]);

    if (!file) {
      return (
        <div className={`h-full w-full flex items-center justify-center text-sm text-muted`}>
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
          // CursorOverlay measures the advance width off the rendered font, so
          // changing this no longer drifts remote collaborators' carets.
          fontFamily: '"JetBrains Mono", ui-monospace, "SFMono-Regular", monospace',
          fontLigatures: true,
          lineHeight: 22,
          padding: { top: 14, bottom: 14 },
          renderLineHighlight: "all",
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