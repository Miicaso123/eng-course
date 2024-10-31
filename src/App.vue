<template>
  <div>
    <header-lane />
    <router-view />
    <footer-lane-vue />
  </div>

</template>

<script lang="ts">
import FooterLaneVue from './components/FooterLane.vue';
import HeaderLane from './components/HeaderLane.vue';

  export default {
    components: {HeaderLane, FooterLaneVue}
  }
</script>

<style global>
@import url('https://fonts.googleapis.com/css2?family=Arvo:ital,wght@0,400;0,700;1,400;1,700&family=Bona+Nova+SC:ital,wght@0,400;0,700;1,400&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    text-decoration: none;
    /* font-family: 'Arvo'; */
    font-family: "Bona Nova SC", serif;
  }

  .container {
    width: 85%;
    margin: auto ;
  }

  button {
    width: 150px;
    height: 36px;
    background-color: #FFDAB9;
    color: black;
    border-top: none;
    border-right: none;
    border-left: none;
    border-bottom-color: #EE1C43;
    padding: 6px;
    cursor: pointer;
    transition: 0.4s ease, color 0.4s ease;
    margin: 14px;
    border-radius: 14px;
    float: right;
  }

  button:hover {
    color: #EE1C43;
    transform: scale(1.1);
  }
</style>
