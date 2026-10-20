<template>
  <div>
    <h1>Mina uppgifter</h1>
    <div v-if="store.user" class="card" style="max-width: 560px">
      <div class="field">
        <span class="field-label">Kundnummer</span>
        <span>{{ store.user.customerNo }}</span>
      </div>
      <input v-model="name" type="text" />
      <input v-model="email" type="text" />
      <input v-model="address" type="text" />

      <KButton @click="save">Spara ändringar</KButton>

      <KButton variant="secondary" style="margin-left: 10px" @click="reset">
        Återställ
      </KButton>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import KButton from "../components/KButton.vue";
import { useUserStore } from "../stores/user";
import { isValidEmail } from "../utils/validateEmail";

const store = useUserStore();
const name = ref("");
const email = ref("");
const address = ref("");

const reset = () => {
  name.value = store.user.name;
  email.value = store.user.email;
  address.value = store.user.address;
};

const save = () => {
  if (!isValidEmail(email.value)) {
    //Adding an alert for now, will remove it later and add a proper error message in the UI
    alert("Ogiltig e-postadress. Vänligen ange en giltig e-postadress.");
    return;
  }
  store.save({ name: name.value, email: email.value, address: address.value });
};

onMounted(async () => {
  if (!store.user) await store.load();
  reset();
});
</script>

<style scoped>
.field {
  display: flex;
  justify-content: space-between;
  padding: 8px 0 14px;
  font-size: 14px;
}
.field-label {
  color: #7c8698;
}
</style>
