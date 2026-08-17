// Every word on the landing page lives here, so copy edits never require
// hunting through JSX. Display headlines are split into the roman first line
// and the italic second line — that pairing is the page's signature move.

export const GITHUB_URL = 'https://github.com/aarohabrhm/Codio';
export const SIGNUP_PATH = '/login';

export const nav = {
  links: [
    { label: 'Product', href: '#capabilities' },
    { label: 'How it works', href: '#process' },
    { label: 'Docs', href: GITHUB_URL, external: true },
  ],
  cta: 'Sign up',
};

export const hero = {
  eyebrow: 'Free and open source IDE for teams that code together.',
  roman: 'Write code together,',
  italic: 'live, in one browser tab.',
  sub: 'Codio is a shared workspace where your team edits the same file, talks it through, runs it, and asks AI for help — without ever leaving the tab.',
  primary: 'Start coding free',
  secondary: 'View on GitHub',
};

export const about = {
  label: 'About Codio',
  roman: 'Codio turns “can you share your screen?” into',
  italic: 'a link your whole team is already typing in.',
  body: 'No installs, no environment drift, no one narrating their editor over a laggy video call. One URL, and everybody is in the file.',
  presence: {
    file: 'src/users.js',
    status: '3 people editing · 1 in chat',
    people: [
      { initial: 'Y', name: 'You', color: 'caret' },
      { initial: 'A', name: 'Aaroh', color: 'amber' },
      { initial: 'A', name: 'Anurag', color: 'rose' },
    ],
  },
};

export const stack = [
  'React',
  'Vite',
  'Monaco',
  'Socket.IO',
  'XTerm',
  'Node',
  'Express',
  'MongoDB',
  'JWT',
];

export const capabilities = {
  eyebrow: 'Capabilities',
  roman: 'Built for teams that',
  italic: 'type at the same time.',
  aside:
    'Every capability exists because pairing on code in a browser breaks somewhere specific. These are the four places it breaks.',
  items: [
    {
      icon: 'users',
      title: 'Everyone in the same file',
      body: 'Live cursors with name tags. Changes land instantly for everyone, no refresh, no merge conflict theatre.',
    },
    {
      icon: 'chat',
      title: 'Chat that sits beside the code',
      body: 'Ask about line 42 while looking at line 42. The conversation stays with the file it’s about.',
    },
    {
      icon: 'terminal',
      title: 'Run it without leaving the tab',
      body: 'A real execution backend and an in-browser terminal. Write it, run it, read the output in the same window.',
    },
    {
      icon: 'sparkles',
      title: 'AI that’s read what you’re stuck in',
      body: 'Suggestions, explanations and debugging help with your actual file as context.',
    },
  ],
};

export const workspace = {
  eyebrow: 'Inside the workspace',
  roman: 'A workspace where the whole team',
  italic: 'is looking at the same line.',
  cta: 'Get started',
};

export const process = {
  eyebrow: 'Process',
  roman: 'From blank file to shipped,',
  italic: 'in three steps.',
  steps: [
    {
      n: '01',
      title: 'Create',
      body: 'Open a workspace and start a file. No install, no environment setup, no Docker.',
    },
    {
      n: '02',
      title: 'Invite',
      body: 'Send the link. Cursors appear. Everyone’s editing the same file within seconds.',
    },
    {
      n: '03',
      title: 'Run and snapshot',
      body: 'Execute in the browser, then save a checkpoint. “final_v2_ACTUAL_final” is not a version control strategy.',
    },
  ],
};

export const audience = {
  eyebrow: "Who it's for",
  roman: 'Made for people who code',
  italic: 'shoulder to shoulder.',
  columns: [
    {
      title: 'Students & pairs',
      body: 'Work through an assignment together from two different rooms, without one of you narrating a screen share.',
    },
    {
      title: 'Hackathon teams',
      body: 'Skip the setup hour. Everyone’s in the same workspace before the first commit.',
    },
    {
      title: 'Interviews & teaching',
      body: 'Watch someone think, in their editor, with chat and a run button right there.',
    },
  ],
};

export const faq = {
  eyebrow: 'Questions',
  roman: 'The four things people ask',
  italic: 'before they open a workspace.',
  items: [
    {
      q: 'Is it free?',
      a: 'Yes, while Codio is in beta. Every feature on this page is available on a free account — no card, no seat count, no trial clock.',
    },
    {
      q: 'Where does my code run?',
      a: 'On Codio’s execution backend, not in your browser tab. You get the output and the exit code in the in-browser terminal; nothing is installed on your machine.',
    },
    {
      q: 'Which languages?',
      a: 'The editor highlights everything Monaco does. Execution currently covers the common scripting runtimes, and the list grows as the backend does.',
    },
    {
      q: 'Is it open source?',
      a: 'Yes. The whole thing — client, server, and the collaboration layer — is on GitHub. Read it, run it locally, or open a pull request.',
    },
  ],
};

export const footer = {
  roman: 'Write code together,',
  italic: 'without the screen share.',
  cta: 'Start coding free',
  columns: [
    {
      heading: 'Product',
      links: [
        { label: 'Capabilities', href: '#capabilities' },
        { label: 'Workspace', href: '#workspace' },
        { label: 'How it works', href: '#process' },
        { label: 'Questions', href: '#faq' },
      ],
    },
    {
      heading: 'Resources',
      links: [
        { label: 'Docs', href: GITHUB_URL, external: true },
        { label: 'Source', href: GITHUB_URL, external: true },
        { label: 'Issues', href: `${GITHUB_URL}/issues`, external: true },
        { label: 'Sign in', href: SIGNUP_PATH },
      ],
    },
    {
      heading: 'Social',
      links: [{ label: 'GitHub', href: GITHUB_URL, external: true }],
    },
  ],
};
