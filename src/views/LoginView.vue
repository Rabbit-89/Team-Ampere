<template>
  <div class="login-wrap">
    <div class="card login-card">
      <img src="../assets/logo-dark.svg" class="login-logo" alt="Kraftly" />
      <h1>Logga in på Mina sidor</h1>

      <form @submit.prevent="handleLogin">
        <KField
          v-model="email"
          label="E-postadress"
          type="email"
          autocomplete="username"
        />

        <KField
          v-model="password"
          label="Lösenord"
          type="password"
          autocomplete="current-password"
        />

        <KButton type="submit" block :disabled="loading"> Logga in </KButton>
      </form>

      <p v-if="errorMessage" role="alert" class="error-message">
        {{ errorMessage }}
      </p>

      <p class="hint" style="margin-top: 10px">
        Problem att logga in? Ring kundservice 020-123 456
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { login } from "../services/api";
import { setAccessToken } from "../services/token";
import KButton from "../components/KButton.vue";
import KField from "../components/KField.vue";

const email = ref("");
const password = ref("");
const router = useRouter();
const errorMessage = ref("");
const loading = ref(false);

const handleLogin = async () => {
  // validation coming in v2 :)
  errorMessage.value = "";
  loading.value = true;

  try {
    const response = await login(email.value, password.value);
    setAccessToken(response.accessToken);
    router.push("/");
  } catch {
    errorMessage.value = "Fel e-postadress eller lösenord.";
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
label {
  display: block;
  font-size: 13px;
  color: #4a5468;
  margin-bottom: 4px;
}

.login-wrap {
  display: flex;
  justify-content: center;
  padding-top: 60px;
}

.login-card {
  width: 380px;
}

.login-logo {
  height: 34px;
  margin-bottom: 18px;
}
</style>
