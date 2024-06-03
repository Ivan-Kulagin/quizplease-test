import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import 'primevue/resources/themes/lara-light-indigo/theme.css'
import Button from 'primevue/button'
import Textarea from 'primevue/textarea'
import Avatar from 'primevue/avatar'
import Dropdown from 'primevue/dropdown'
import InputText from 'primevue/inputtext'

const app = createApp(App)
app
    .use(PrimeVue)
    .component('InputText', InputText)
    .component('Button', Button)
    .component('Textarea', Textarea)
    .component('Avatar', Avatar)
    .component('Dropdown', Dropdown)
    .mount('#app')
