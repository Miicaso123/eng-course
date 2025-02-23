import { ActionContext } from 'vuex';
import { getAuth, onAuthStateChanged, signOut, signInWithEmailAndPassword } from 'firebase/auth';
import store from '@/store';

export interface AuthState {
  isAuthenticated: boolean;
  email: string;
  isAdmin: boolean;
}

const auth = getAuth();

export const authModule = {
  state: (): AuthState => ({
    isAuthenticated: false,
    email: '',
    isAdmin: false,
  }),
  mutations: {
    login(state: AuthState, { email, isAdmin }: { email: string; isAdmin: boolean }) {
      state.isAuthenticated = true;
      state.email = email;
      state.isAdmin = isAdmin;
    },
    logout(state: AuthState) {
      state.isAuthenticated = false;
      state.email = '';
      state.isAdmin = false;
    },
  },
  actions: {
    async login(
      { commit }: ActionContext<AuthState, any>,
      { email, password }: { email: string; password: string },
    ) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const isAdmin = user.email === 'admin@gmail.com';
        commit('login', { email: user.email, isAdmin });
      } catch (error) {
        console.error('Ошибка аутентификации:', error);
        alert(`Ошибка: ${error}`);
        throw new Error('Неверный логин или пароль');
      }
    },
    async logout({ commit }: ActionContext<AuthState, any>) {
      await signOut(auth);
      commit('logout');
    },
  },
  getters: {
    isAuthenticated: (state: AuthState) => state.isAuthenticated,
    username: (state: AuthState) => state.email,
    isAdmin: (state: AuthState) => state.isAdmin,
  },
};

onAuthStateChanged(auth, (user) => {
  if (user) {
    const isAdmin = user.email === 'admin@gmail.com';
    store.commit('login', { email: user.email, isAdmin });
  } else {
    store.commit('logout');
  }
});
