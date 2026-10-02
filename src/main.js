import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import "./assets/styles.css";
import { initAuth } from "./services/api";

initAuth().finally(() => {
  const app = createApp(App);
  app.use(createPinia());
  app.use(router);
  app.mount("#app");
});
