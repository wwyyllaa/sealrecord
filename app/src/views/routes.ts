const routes: RouteConfig[] = [
  {
    key: 'Home',
    path: '/',
    redirect: { to: '/' },
    windowOptions: {
      title: '先进技术研究院印章登记',
      width: 1200,
      height: 800,
      minWidth: 800,
      minHeight: 600,
    },
    createConfig: {
      showSidebar: false,
      saveWindowBounds: true,
      openDevTools: false,
    },
  },
]

export default routes
