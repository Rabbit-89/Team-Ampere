<template>
  <div>
    <h1>Fakturor</h1>
    <div class="card">
      <table>
        <thead>
          <tr>
            <th scope="col">Faktura</th>
            <th scope="col">Period</th>
            <th scope="col">Belopp</th>
            <th scope="col">Förfaller</th>
            <th scope="col">Status</th>
            <th scope="col">Åtgärder</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="invoice in invoices" :key="invoice.id">
            <td>{{ invoice.id }}</td>
            <td>{{ invoice.period }}</td>
            <td>{{ invoice.amount }} kr</td>
            <td>{{ invoice.due }}</td>
            <td>
              <span :class="['status-chip', statusChipClass(invoice.status)]">{{
                invoice.status
              }}</span>
            </td>
            <td>
              <KButton variant="text" @click="downloadInvoice(invoice)">
                Ladda ner
              </KButton>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { fetchInvoices } from "../services/api";
import { statusChipClass } from "../utils/statusChip";
import KButton from "../components/KButton.vue";

const invoices = ref([]);

onMounted(async () => {
  invoices.value = await fetchInvoices();
});

const downloadInvoice = (invoice) => {
  // PDF generation coming in phase 2 per the quote
  console.log("download", invoice.id);
  alert("Nedladdning kommer snart");
};
</script>

<style scoped>
.download {
  color: #2f54eb;
  cursor: pointer;
  font-size: 14px;
}
</style>
