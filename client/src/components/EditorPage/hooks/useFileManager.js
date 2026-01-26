import { useState, useCallback, useRef, useEffect } from "react";

export function useFileManager(initialFiles, initialOpenFiles = []) {
  const [files, setFiles] = useState(initialFiles);
  const [openFiles, setOpenFiles] = useState(initialOpenFiles);
  const [activeFileId, setActiveFileId] = useState(initialOpenFiles[0] || null);
  const [modifiedFiles, setModifiedFiles] = useState([]);
  const [originalContents, setOriginalContents] = useState({});
  const untitledCounter = useRef(1);

  // Initialize original contents
  useEffect(() => {
  const contents = {};
  Object.keys(files).forEach((id) => {
    if (files[id].type === "file") {
      contents[id] = files[id].content;
    }
  });
  setOriginalContents(contents);
}, [files]);

  const activeFile = activeFileId ? files[activeFileId] : null;

  // Check if file is modified
  const checkModified = useCallback((fileId, content) => {
    const original = originalContents[fileId];
    if (original !== undefined && original !== content) {
      setModifiedFiles((prev) => (prev.includes(fileId) ? prev : [...prev, fileId]));
    } else {
      setModifiedFiles((prev) => prev.filter((id) => id !== fileId));
    }
  }, [originalContents]);

  // Toggle folder open/closed
  const toggleFolder = useCallback((id) => {
    setFiles((prev) => ({
      ...prev,
      [id]: { ...prev[id], isOpen: !prev[id].isOpen },
    }));
  }, []);

  // Open a file
  const openFile = useCallback((fileId) => {
    const node = files[fileId];
    if (!node) return;
    
    if (node.type === "folder") {
      toggleFolder(fileId);
      return;
    }

    setOpenFiles((prev) => prev.includes(fileId) ? prev : [...prev, fileId]);
    setActiveFileId(fileId);
  }, [files, toggleFolder]);

  // Close a tab
  const closeTab = useCallback((id) => {
    setOpenFiles((prev) => {
      const next = prev.filter((fid) => fid !== id);
      if (activeFileId === id) {
        setActiveFileId(next.length ? next[next.length - 1] : null);
      }
      return next;
    });
  }, [activeFileId]);

  // Get template content for new files based on extension
  const getFileTemplate = (fileName) => {
    const ext = fileName.split(".").pop()?.toLowerCase();
    const baseName = fileName.replace(/\.[^/.]+$/, "");
    const className = baseName.charAt(0).toUpperCase() + baseName.slice(1);
    
    const templates = {
      cpp: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}
`,
      c: `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}
`,
      java: `public class ${className} {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
`,
      py: `# ${fileName}

def main():
    print("Hello, World!")

if __name__ == "__main__":
    main()
`,
      js: `// ${fileName}

console.log("Hello, World!");
`,
      ts: `// ${fileName}

const greeting: string = "Hello, World!";
console.log(greeting);
`,
      html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${baseName}</title>
</head>
<body>
    <h1>Hello, World!</h1>
</body>
</html>
`,
      css: `/* ${fileName} */

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
`,
      json: `{
    "name": "${baseName}",
    "version": "1.0.0"
}
`,
      go: `package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}
`,
      rs: `fn main() {
    println!("Hello, World!");
}
`,
    };
    
    return templates[ext] || "";
  };

  // Create a new file or folder
  const createNode = useCallback((parentId, name, type) => {
  const newId = crypto.randomUUID();

  const content = type === "file" ? getFileTemplate(name) : undefined;

  const newNode = {
    id: newId,
    name,
    type,
    parent: parentId,
    ...(type === "folder"
      ? { children: [], isOpen: true }
      : { content }),
  };

  setFiles((prev) => {
    const updated = { ...prev, [newId]: newNode };
    const parent = prev[parentId];
    if (parent) {
      updated[parentId] = {
        ...parent,
        children: [...(parent.children || []), newId],
        isOpen: true,
      };
    }
    return updated;
  });

  if (type === "file") {
    setOpenFiles((prev) => [...prev, newId]);
    setActiveFileId(newId);
    setOriginalContents((prev) => ({ ...prev, [newId]: content }));
  }
}, []);


  // Rename a file or folder
  const renameNode = useCallback((id, newName) => {
    setFiles((prev) => {
      const node = prev[id];
      if (!node) return prev;
      return { ...prev, [id]: { ...node, name: newName } };
    });
  }, []);

  // Delete a file or folder
  const deleteNode = useCallback((id) => {
    if (id === "root") return;

    setFiles((prev) => {
      const node = prev[id];
      if (!node) return prev;

      const updated = { ...prev };
      
      // Remove from parent
      if (node.parent && updated[node.parent]) {
        updated[node.parent] = {
          ...updated[node.parent],
          children: updated[node.parent].children?.filter((cid) => cid !== id) || [],
        };
      }

      // Collect all ids to delete (recursive for folders)
      const collectIds = (nodeId) => {
        const ids = [nodeId];
        const n = updated[nodeId];
        if (n?.type === "folder" && n.children) {
          n.children.forEach((childId) => ids.push(...collectIds(childId)));
        }
        return ids;
      };

      collectIds(id).forEach((delId) => delete updated[delId]);
      return updated;
    });

    setOpenFiles((prev) => prev.filter((fid) => fid !== id));
    if (activeFileId === id) {
      setActiveFileId((prev) => {
        const remaining = openFiles.filter((fid) => fid !== id);
        return remaining.length > 0 ? remaining[remaining.length - 1] : null;
      });
    }
    setModifiedFiles((prev) => prev.filter((fid) => fid !== id));
  }, [activeFileId, openFiles]);

  // Update file content
  const updateContent = useCallback((content) => {
    if (!activeFileId) return;
    setFiles((prev) => ({
      ...prev,
      [activeFileId]: { ...prev[activeFileId], content },
    }));
    checkModified(activeFileId, content);
  }, [activeFileId, checkModified]);

  // Save current file
  const saveFile = useCallback(() => {
    if (!activeFileId) return null;
    const fileName = files[activeFileId]?.name || "file";
    
    setOriginalContents((prev) => ({
      ...prev,
      [activeFileId]: files[activeFileId]?.content,
    }));
    setModifiedFiles((prev) => prev.filter((id) => id !== activeFileId));
    
    return fileName;
  }, [activeFileId, files]);

  return {
    files,
    setFiles,
    openFiles,
    activeFileId,
    activeFile,
    modifiedFiles,
    setActiveFileId,
    toggleFolder,
    openFile,
    closeTab,
    createFile: (parentId, name) => createNode(parentId || "root", name, "file"),
    createFolder: (parentId, name) => createNode(parentId || "root", name, "folder"),
    renameNode,
    deleteNode,
    updateContent,
    saveFile,
  };
}
