import { createApp } from 'vue';
import router from './router.js';

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import App from './App.vue';

import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader
//import { createVuetify } from 'vuetify'

// export default createVuetify({
//   icons: {
//     defaultSet: 'mdi', // This is already the default value - only for display purposes
//   },
// })

const vuetify = createVuetify({
    components,
    directives,
    icons: {
        defaultSet: 'mdi',
        aliases,
        sets: {
          mdi,
        },
      },
  })

const application = createApp(App).use(router);
application.use(vuetify);
application.mount('#app');
