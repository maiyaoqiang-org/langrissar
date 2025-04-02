import {
	createSSRApp
} from "vue";
import App from "./App.vue";
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import AV from 'leancloud-storage'
AV.init({
	appId: import.meta.env.VITE_APP_AV_APP_ID,
	appKey: import.meta.env.VITE_APP_AV_APP_KEY,
	serverURL: import.meta.env.VITE_APP_AV_SERVER_URL,
});
export function createApp() {
	const app = createSSRApp(App);
	app.use(ElementPlus)
	for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
		app.component(key, component)
	}
	return {
		app,
	};
}
