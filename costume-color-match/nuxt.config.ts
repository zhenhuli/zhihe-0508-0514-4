export default defineNuxtConfig({
  devtools: { enabled: true },
  css: [
    'materialize-css/dist/css/materialize.min.css'
  ],
  app: {
    head: {
      title: '古风服饰配色搭配器',
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/icon?family=Material+Icons'
        }
      ]
    }
  }
})
