import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import axios from 'axios'
import VueAxios from 'vue-axios'
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import getPageTitleMixin from './mixins/getPageTitleMixin'
import 'bootstrap/dist/css/bootstrap.css';
import 'jquery';
import 'popper.js';
import 'bootstrap';

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(VueAxios, axios)
app.use(ElementPlus);
app.mixin(getPageTitleMixin)

app.mount('#app')
