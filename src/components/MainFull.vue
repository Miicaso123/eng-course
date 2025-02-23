<template>
  <div>
    <main-lane id="main" />
    <price-line />
    <contacs-lane />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import MainLane from './MainLane.vue';
import PriceLine from './PriceLine.vue';
import ContacsLane from './ContacsLane.vue';

export default defineComponent({
  name: 'MainFull',
  components: { MainLane, PriceLine, ContacsLane },
});
</script>

<style></style>
