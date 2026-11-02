<template>
  <div>
    <header v-if="$route.path !== '/login'" class="topbar">
      <div class="topbar-inner container">
        <img src="./assets/logo.svg" class="logo" alt="Kraftly" />
        <nav>
          <RouterLink to="/">Översikt</RouterLink>
          <RouterLink to="/fakturor">Fakturor</RouterLink>
          <RouterLink to="/flytt">Flyttanmälan</RouterLink>
          <RouterLink to="/profil">Mina uppgifter</RouterLink>
          <KButton variant="text" class="logout" @click="logout">
            Logga ut
          </KButton>
        </nav>
      </div>
    </header>
    <main class="container">
      <p v-if="logoutError" role="alert" class="error-message">
        {{ logoutError }}
      </p>
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { setAccessToken } from "./services/token.js";
import { logout as endServerSession } from "./services/api.js";
import KButton from "./components/KButton.vue";

const router = useRouter();
const logoutError = ref("");

const logout = async () => {
  logoutError.value = "";
  try {
    await endServerSession();
    // Log out successful, no further action needed
  } catch {
    logoutError.value =
      "Utloggningen kunde inte bekräftas av servern. Försök igen.";
  } finally {
    // Clear the access token and redirect to login page
    setAccessToken(null);
    await router.push("/login");
  }
};
</script>

<style>
.topbar {
  background: #101d3d;
}
.topbar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 14px;
  padding-bottom: 14px;
}
.logo {
  height: 30px;
}
.topbar nav a,
.topbar nav .logout {
  padding: 0;
  color: #c2cbe4;
  text-decoration: none;
  margin-left: 22px;
  font-size: 14.5px;
}
.logout {
  color: #c2cbe4;
  text-decoration: none;
  margin-left: 22px;
  font-size: 14.5px;
  cursor: pointer;
}
.topbar nav a.router-link-active {
  color: #fff;
  font-weight: 600;
}
</style>
