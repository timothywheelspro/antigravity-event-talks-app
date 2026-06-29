import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "Sovereign Infrastructure",
  description: "Attention Routing & Systems Architecture",
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Codelab', link: '/module-1-awareness' }
    ],

    sidebar: [
      {
        text: 'The Codelab',
        items: [
          { text: 'Module 1: The Physics of the Stack', link: '/module-1-awareness' },
          { text: 'Module 2: Sovereign Infrastructure', link: '/module-2-action' },
          { text: 'Module 3: Collapsing the Stack', link: '/module-3-integration' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/timothywheels' }
    ]
  }
})
