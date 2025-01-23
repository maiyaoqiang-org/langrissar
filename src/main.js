import {
	createSSRApp
} from "vue";
import App from "./App.vue";
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import AV from 'leancloud-storage'
AV.init({
	appId: "2x5uatdDE4v2yJf0ngqF68iZ-gzGzoHsz",
	appKey: "AJE1UYmZPvBNKKyzB3ou1VKb",
	serverURL: "https://2x5uatdd.lc-cn-n1-shared.com",
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
