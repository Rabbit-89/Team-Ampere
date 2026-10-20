<template>
  <form @submit.prevent="submit">
    <div class="card" style="max-width: 560px">
      <h1>Flyttanmälan</h1>
      <p style="margin-bottom: 14px">
        Fyll i uppgifterna nedan så flyttar vi ditt elavtal.
      </p>
      <input v-model="form.address" type="text" placeholder="Ny adress" />
      <input v-model="form.zip" type="text" placeholder="Postnummer" />
      <input v-model="form.city" type="text" placeholder="Ort" />
      <input
        v-model="form.date"
        type="text"
        placeholder="Inflyttningsdatum (ÅÅÅÅ-MM-DD)"
      />
      <select v-model="form.contract">
        <option disabled value="">Välj avtal</option>
        <option>Rörligt pris</option>
        <option>Fast pris 1 år</option>
        <option>Fast pris 3 år</option>
      </select>
      <KButton type="submit">Skicka flyttanmälan</KButton>
      <p class="hint" style="margin-top: 8px">
        Anmälan måste göras senast 14 dagar före flytt
      </p>
      <p v-if="reference" style="color: #12b76a; margin-top: 10px">
        Tack! Referensnummer: {{ reference }}
      </p>
    </div>
  </form>
</template>

<script setup>
import { ref, reactive } from "vue";
import KButton from "../components/KButton.vue";
import { submitMove } from "../services/api";

const form = reactive({
  address: "",
  zip: "",
  city: "",
  date: "",
  contract: "",
});
const reference = ref(null);

const submit = async () => {
  // TODO validation
  const res = await submitMove(form);
  reference.value = res.ref;
};
</script>
