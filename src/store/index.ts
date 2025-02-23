import { createStore } from 'vuex';
import { authModule } from './modules/auth';
import { priceModule } from './modules/priceModule';

export type NamePrice = {
  id: number;
  name: string;
  price: string;
};

export default createStore({
  state: {},
  mutations: {},
  actions: {},
  getters: {},
  modules: {
    auth: authModule,
    price: priceModule,
  },
});
