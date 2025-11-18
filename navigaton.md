app/
├─ _root.tsx            <-- RootLayout (ThemeProvider + Auth check)
│
├─ (auth)/              <-- Authentication flow
│   ├─ layout.tsx       <-- Stack navigator for auth screens
│   ├─ login.tsx        <-- Route: /login
│   └─ signup.tsx       <-- Route: /signup
│
├─ (drawer)/            <-- Drawer navigator (shown after login)
│   ├─ layout.tsx       <-- Drawer navigator
│   │
│   ├─ (tabs)/          <-- Tabs navigator inside drawer
│   │   ├─ layout.tsx   <-- Tabs navigator
│   │   │
│   │   ├─ home/        <-- Home tab with nested stack
│   │   │   ├─ layout.tsx   <-- Stack navigator for Home tab
│   │   │   ├─ index.tsx    <-- /home (Overview screen)
│   │   │   └─ details.tsx  <-- /home/details (Details screen)
│   │   │
│   │   └─ settings.tsx     <-- /settings tab
│   │
│   ├─ user/            <-- Dynamic user screens
│   │   └─ [id].tsx     <-- /user/:id
│   │
│   └─ profile.tsx      <-- /profile route in drawer
│
├─ modal.tsx            <-- Modal screen (Stack with presentation: modal)
└─ global.css           <-- Global styles
