<template>
  <div class="footer-lane">
    <div class="footer-content">
      <div class="footer-inside">
        <h5>Made by Kurmanay</h5>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({});
</script>

<style>
.footer-lane {
  background-color: #8fbc8f;
  width: 100%;
  height: 15vh;
}

.footer-content {
  display: flex;
  margin: auto;
  padding-top: 30px;
}

.footer-inside {
  display: flex;
  margin: auto;
  align-items: center;
}

.footer-inside h5 {
  word-spacing: 8px;
  font-size: medium;
}
</style>
