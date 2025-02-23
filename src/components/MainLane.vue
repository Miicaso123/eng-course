<template>
  <div class="main-lane">
    <div class="container">
      <div class="main-content">
        <div class="main-one">
          <div>
            <img :src="mainImg1" alt="Main Image" class="mainImg1" />
          </div>
          <div class="main-sec2">
            <img :src="mainImg2" alt="Main image" class="mainImg2" />
            <div class="main-one-text">
              <p>
                Do you want to speak <span style="color: #ee1c43">English?</span> <br />Then sign up
                with <span style="color: #ee1c43">US!</span>
              </p>
              <button @click="openModule">Записаться</button>
            </div>
          </div>
        </div>
        <div class="checkModule" v-if="isModuleOpen">
          <module-check @close="closeModule" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import main1 from '@/assets/main1.jpg';
import main2 from '@/assets/main2.png';
import ModuleCheck from './ModuleCheck.vue';

export default defineComponent({
  components: { ModuleCheck },
  data() {
    return {
      mainImg1: main1 as string,
      mainImg2: main2 as string,
      isModuleOpen: false as boolean,
    };
  },
  methods: {
    openModule() {
      this.isModuleOpen = true;
    },
    closeModule() {
      this.isModuleOpen = false;
    },
  },
});
</script>

<style scoped>
.main-lane {
  background-color: #fbf3f1;
  width: 100%;
  height: 730px;
}

.main-one {
  padding-top: 10%;
  margin: 0 auto;
  display: flex;
  width: 85%;
  justify-content: space-between;
  align-content: center;
}

.mainImg1 {
  width: 350px;
  border-radius: 20%;
}

.mainImg2 {
  width: 740px;
  height: 526px;
  border-radius: 50%;
  background-color: #fbf3f1;
}

.main-one-text {
  font-size: 1.8rem;
  position: absolute;
  margin-top: -320px;
  margin-left: 120px;
}

@media (max-width: 760px) {
  .mainImg1 {
    width: 350px;
    border-radius: 20%;
    padding-top: 90px;
  }

  .mainImg2 {
    width: 440px;
    height: 330px;
    border-radius: 50%;
    background-color: #fbf3f1;
  }

  .main-sec2 {
    margin-left: -380px;
    margin-top: 330px;
  }

  .main-one-text {
    font-size: 1.3rem;
    position: absolute;
    z-index: 0;
    margin-top: -220px;
    margin-left: 60px;
  }
}
</style>
