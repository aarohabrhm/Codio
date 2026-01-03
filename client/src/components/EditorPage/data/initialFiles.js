// Initial sample project files
export const INITIAL_FILES = {
  root: {
    id: "root",
    name: "My Project",
    type: "folder",
    isOpen: true,
    children: ["index-html", "styles", "scripts"],
  },
  "index-html": {
    id: "index-html",
    name: "index.html",
    type: "file",
    parent: "root",
    content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Project</title>
    <link rel="stylesheet" href="styles/main.css">
</head>
<body>
    <header>
        <h1>Welcome to My Project</h1>
    </header>
    <main>
        <p>Start editing to see your changes.</p>
    </main>
    <script src="scripts/app.js"></script>
</body>
</html>`,
  },
  styles: {
    id: "styles",
    name: "styles",
    type: "folder",
    parent: "root",
    isOpen: true,
    children: ["main-css"],
  },
  "main-css": {
    id: "main-css",
    name: "main.css",
    type: "file",
    parent: "styles",
    content: `/* Main styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: system-ui, sans-serif;
  line-height: 1.6;
  color: #333;
}

header {
  padding: 2rem;
  background: #f5f5f5;
}

main {
  padding: 2rem;
}`,
  },
  scripts: {
    id: "scripts",
    name: "scripts",
    type: "folder",
    parent: "root",
    isOpen: true,
    children: ["app-js"],
  },
  "app-js": {
    id: "app-js",
    name: "app.js",
    type: "file",
    parent: "scripts",
    content: `// Main application
console.log('App initialized');

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM ready');
});`,
  },
};

export const DEFAULT_OPEN_FILES = ["index-html"];
