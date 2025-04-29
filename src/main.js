import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import AV from 'leancloud-storage'
import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'
import router from './router'

console.log("当前请求环境：",import.meta.env.VITE_APP_API_URL)
AV.init({
	appId: import.meta.env.VITE_APP_AV_APP_ID,
	appKey: import.meta.env.VITE_APP_AV_APP_KEY,
	serverURL: import.meta.env.VITE_APP_AV_SERVER_URL,
});
const app = createApp(App);
app.use(ElementPlus)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
	app.component(key, component)
}
const pinia = createPinia()
const piniaPersistedState = createPersistedState({
	key: (storeKey) => {
		return `${import.meta.env.VITE_STORE_PERFIX}_${storeKey}`
	},
	storage: {
		setItem: (key, value) => localStorage.setItem(key, value),
		getItem: (key) => localStorage.getItem(key)
	}
})
pinia.use(piniaPersistedState)
app.use(pinia)
app.use(router)
app.mount('#app')

