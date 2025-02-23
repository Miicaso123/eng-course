<template>
  <div class="header-lane">
    <div class="container">
      <div class="header-content">
        <div class="header-logo">
          <p>LOGO</p>
        </div>
        <nav>
          <label for="check" class="checkbtn" @click="toggleMenu">
            <font-awesome-icon :icon="['fas', 'bars']" />
          </label>
          <ul :class="{ open: isMenuOpen }">
            <li class="close-icon">
              <font-awesome-icon :icon="['fas', 'times']" @click="toggleMenu" />
            </li>
            <li>
              <router-link
                :class="{ active: isActiveRoute('/') }"
                to="/"
                @click.prevent="scrollToSection('main')"
                >Записаться</router-link
              >
            </li>
            <li>
              <router-link
                :class="{ active: isActiveRoute('/#price') }"
                to="/#price"
                @click.prevent="scrollToSection('price')"
                >Цены</router-link
              >
            </li>
            <li>
              <router-link
                :class="{ active: isActiveRoute('/#contacs') }"
                to="/#contacs"
                @click.prevent="scrollToSection('contacs')"
                >Контакты</router-link
              >
            </li>
            <li>
              <router-link :class="{ active: isActiveRoute('/test') }" to="/test">Тест</router-link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export default defineComponent({
  setup() {
    const isMenuOpen = ref(false);
    const route = useRoute();
    const router = useRouter();

    const toggleMenu = () => {
      isMenuOpen.value = !isMenuOpen.value;
    };

    const setActiveMenu = (menu: string) => {
      console.log(`Active menu set to: ${menu}`);
    };

    const isActiveRoute = (path: string) => {
      if (path === '/') {
        return route.path === '/' && (route.hash === '' || route.hash === '#main');
      }

      if (path.includes('#')) {
        return route.hash === path.replace('/', '');
      }
      if (path.startsWith('#')) {
        return route.hash === path;
      }
      return route.path === path;
    };

    const scrollToSection = async (sectionId: string) => {
      await router.push({ path: '/', hash: `#${sectionId}` });
      await nextTick();

      const element = document.getElementById(`${sectionId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }

      toggleMenu();
    };

    return { isMenuOpen, toggleMenu, setActiveMenu, isActiveRoute, scrollToSection };
  },
});
</script>

<style>
.header-lane {
  width: 100%;
  height: 6.25rem;
  position: fixed;
  background-color: #fbf3f1;
  box-shadow: 0px 2px 5px #d5cfcd;
  z-index: 500;
}

.header-content {
  width: 75%;
  display: flex;
  justify-content: space-between;
  margin-top: 1.5%;
  z-index: 550;
}

.header-content ul {
  list-style: none;
  display: flex;
  gap: 20%;
  padding-top: 3%;
  font-size: 1.1rem;
}

.header-content ul a.active,
a:hover {
  color: #ee1c43;
  transition: 0.5s;
}

.header-content ul a {
  color: #000000;
  text-transform: uppercase;
}

.checkbtn {
  font-size: 1.8rem;
  color: #ee1c43;
  cursor: pointer;
  display: none;
  margin-right: -60px;
}

.header-logo {
  border: 3px solid #ee1c43;
  width: 8rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-logo p {
  color: #ee1c43;
  font-size: 2.5rem;
}

.header-content ul li a {
  transition: all 0.3s ease;
}

.header-content ul li:hover {
  color: #8fbc8f;
}

.header-content ul li:active {
  color: #8fbc8f;
}

.current-path {
  margin-top: 10px;
  font-size: 14px;
  color: gray;
}

.close-icon {
  display: none;
}

@media (max-width: 760px) {
  .header-logo {
    margin-top: 5%;
  }

  .checkbtn {
    display: block;
    margin-top: 20px;
    margin-left: 10px;
  }

  .header-content ul {
    position: fixed;
    width: 100%;
    height: 100vh;
    background: #fbf3f1;
    top: 0;
    right: -100%;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    transition: right 0.5s ease;
  }

  .header-content ul.open {
    right: 0;
  }

  .header-content ul li {
    opacity: 0;
    transition: opacity 0.3s ease, transform 0.3s ease;
  }

  .header-content ul.open li {
    opacity: 1;
    transform: translateX(0);
  }

  .close-icon {
    position: absolute;
    top: 20px;
    right: 20px;
    font-size: 2rem;
    cursor: pointer;
    color: #ee1c43;
    display: block;
  }
}
</style>
