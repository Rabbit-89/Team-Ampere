<template>
  <form @submit.prevent="submit">
    <div class="card" style="max-width: 560px">
      <h1>Flyttanmälan</h1>
      <p style="margin-bottom: 14px">
        Fyll i uppgifterna nedan så flyttar vi ditt elavtal.
      </p>
      <label for="move-address">Ny adress</label>
      <input
        id="move-address"
        v-model="form.address"
        type="text"
        placeholder="Ny adress"
      />
      <label for="move-zip">Postnummer</label>
      <input
        id="move-zip"
        v-model="form.zip"
        type="text"
        placeholder="Postnummer"
      />
      <label for="move-city">Ort</label>
      <input id="move-city" v-model="form.city" type="text" placeholder="Ort" />
      <label for="move-date">Inflyttningsdatum</label>
      <input
        id="move-date"
        v-model="form.date"
        type="text"
        placeholder="Inflyttningsdatum (ÅÅÅÅ-MM-DD)"
      />
      <label for="move-contract">Avtal</label>
      <select id="move-contract" v-model="form.contract">
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
