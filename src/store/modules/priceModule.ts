import { ActionContext } from 'vuex';
import { readData, writeData, deleteData } from '@/firebase';
import { AuthState } from '@/store/modules/auth';

export interface PriceItem {
  name: string;
  price: string;
}

interface PriceState {
  namePrices: PriceItem[];
  isAdmin: boolean;
}


// interface SetIsAdminPayload {
//   isAdmin: boolean;
// }

interface UpdatePricePayload {
  price: string;
  index: number;
}

interface AddPricePayload {
  name: string;
  price: string;
}

export const priceModule = {
  state: (): PriceState => ({
    namePrices: [], // Изначально пустой массив, будет заполнен данными из Firebase
    isAdmin: false,
  }),
  mutations: {
    // setIsAdmin(state: PriceState, payload: SetIsAdminPayload) {
    //   state.isAdmin = payload.isAdmin;
    // },
    setNamePrices(state: PriceState, namePrices: PriceItem[],) {
      state.namePrices = namePrices;
    },
    updatePrice(state: PriceState, payload: UpdatePricePayload) {
      if (payload.index >= 0 && payload.index < state.namePrices.length) {
        state.namePrices[payload.index].price = payload.price; // Обновляем цену по индексу
      }
    },
    addPrice(state: PriceState, payload: PriceItem) {
      state.namePrices.push(payload);
    },
    deletePrice(state: PriceState, index: number) {
      if (index >= 0 && index < state.namePrices.length) {
        state.namePrices.splice(index, 1); // Удаляем элемент по индексу
      }
    },
  },
  actions: {
    // Действие для получения данных из Firebase
    async fetchNamePrices(context: ActionContext<PriceState, any>) {
      try {
        const data = await readData('prices/namePrices');
        context.commit('setNamePrices', data);
        return data;
      } catch (error) {
        console.error('Ошибка при получении данных из Firebase:', error);
        return []
      }
    },
    
    // setAdmin(context: ActionContext<PriceState, any>, isAdmin: boolean) {
    //   context.commit('setIsAdmin', { isAdmin });
    // },
    
    // Действие для обновления цены
    async updatePriceAction(context: ActionContext<PriceState, any>, payload: UpdatePricePayload) {

      context.commit('updatePrice', payload);

      try {
        // Обновляем цену в Firebase
        const itemToUpdate = context.state.namePrices[payload.index];
        await writeData(`prices/namePrices/${payload.index}`, {
          price: payload.price,
          name: itemToUpdate.name, // Сохраняем имя, если оно тоже нужно
        });
      } catch (error) {
        console.error('Ошибка при обновлении данных в Firebase:', error);
      }
    },

    async addPriceAction(context: ActionContext<PriceState, any>, payload: AddPricePayload) {
      // const { rootState } = context;

      // if (!rootState.auth.isAdmin) {
      //   console.error('Ошибка: только администраторы могут добавлять цены.');
      //   alert('У вас нет прав для добавления цены!');
      //   return;
      // }

      const newPriceItem: PriceItem = {
        name: payload.name,
        price: payload.price,
      };

      // Локально добавляем новый элемент
      context.commit('addPrice', newPriceItem);

      try {
        // const currentPrices = context.state.namePrices;
        // const newIndex = currentPrices.length; // Используем длину массива как индекс
        const newIndex = Date.now();
        await writeData(`prices/namePrices/${newIndex}`, newPriceItem);
        console.log('Новая цена успешно добавлена:', newPriceItem);
      } catch (error) {
        console.error('Ошибка при добавлении данных в Firebase:', error);
      }
    },


    async deletePriceAction(context: ActionContext<PriceState, any>, index: number) {
    
      // Удаляем локально
      context.commit('deletePrice', index);
    
      try {
        // Удаляем элемент из Firebase
        await deleteData(`prices/namePrices/${index}`);
        console.log('Цена успешно удалена из Firebase');
      } catch (error) {
        console.error('Ошибка при удалении данных из Firebase:', error);
      }
    
      // После удаления элемента пересчитываем индексы оставшихся элементов
      const updatedPrices = context.state.namePrices.map((item, newIndex) => ({
        ...item,
        index: newIndex // Перенумеровываем элементы
      }));
    
      // Перезаписываем обновленный массив в Firebase
      try {
        await writeData('prices/namePrices', updatedPrices); // Перезаписываем все цены с новыми индексами
        console.log('Цены успешно обновлены после удаления');
      } catch (error) {
        console.error('Ошибка при обновлении данных в Firebase:', error);
      }
    }

  },
  getters: {
    namePrices: (state: PriceState): PriceItem[] => state.namePrices,
    isAdmin: (state: PriceState): boolean => state.isAdmin,
    isAuthenticated: (state: any): boolean => state.isAuthenticated,
  },
  namespaced: true
};