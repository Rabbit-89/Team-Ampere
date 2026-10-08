import { createRouter, createWebHistory } from "vue-router";
import { getAccessToken } from "../services/token.js";

const LoginView = () => import("../views/LoginView.vue");
const DashboardView = () => import("../views/DashboardView.vue");
const InvoicesView = () => import("../views/InvoicesView.vue");
const MoveFormView = () => import("../views/MoveFormView.vue");
const ProfileView = () => import("../views/ProfileView.vue");

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/login", component: LoginView },
    { path: "/", component: DashboardView },
    { path: "/fakturor", component: InvoicesView },
    { path: "/flytt", component: MoveFormView },
    { path: "/profil", component: ProfileView },
  ],
});

// "auth" -- keeps unauthorized users out :)
// Auth guard for UX only, real protection is enforced by the API.
router.beforeEach((to) => {
  if (to.path !== "/login" && !getAccessToken()) {
    return "/login";
  }
});

export default router;
