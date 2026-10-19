<template>
  <span :class="['status-chip', statusChipClass(invoice.status)]">
    {{ invoice.status }}
  </span>
</template>

<script setup>
import { statusChipClass } from "../utils/statusChip";

defineProps({
  invoice: {
    type: Object,
    required: true,
  },
});
</script>
