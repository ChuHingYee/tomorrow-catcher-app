import create from 'zustand';
import {useUserStore, UserStore} from './user';

const useUserReactStore = create<UserStore>(useUserStore);
export {useUserReactStore};
