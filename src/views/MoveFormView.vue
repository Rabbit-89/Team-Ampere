<template>
  <form @submit.prevent="submit">
    <div class="card" style="max-width: 560px">
      <h1>Flyttanmälan</h1>
      <p style="margin-bottom: 14px">
        Fyll i uppgifterna nedan så flyttar vi ditt elavtal.
      </p>
      <KField
        v-model="form.address"
        label="Ny adress"
        autocomplete="street-address"
        :error="errors.address"
      />

      <KField
        v-model="form.zip"
        label="Postnummer"
        inputmode="numeric"
        autocomplete="postal-code"
        :error="errors.zip"
      />

      <KField
        v-model="form.city"
        label="Ort"
        autocomplete="address-level2"
        :error="errors.city"
      />

      <KField
        v-model="form.date"
        label="Inflyttningsdatum (ÅÅÅÅ-MM-DD)"
        :error="errors.date"
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
import KField from "../components/KField.vue";
import { submitMove } from "../services/api";
import { validateMove } from "../utils/validateMove.js";

const form = reactive({
  address: "",
  zip: "",
  city: "",
  date: "",
  contract: "",
});

const reference = ref(null);

const errors = reactive({
  address: "",
  zip: "",
  city: "",
  date: "",
});

const submit = async () => {
  const validation = validateMove(form);

  errors.address = validation.address ? "" : "Ny adress måste fyllas i";
  errors.zip = validation.zip ? "" : "Postnummer ska vara fem siffror";
  errors.city = validation.city ? "" : "Ort måste fyllas i";
  errors.date = validation.date ? "" : "Inflyttningsdatum måste fyllas i";

  if (Object.values(validation).some((valid) => !valid)) {
    return;
  }

  const res = await submitMove(form);
  reference.value = res.ref;
};
</script>
