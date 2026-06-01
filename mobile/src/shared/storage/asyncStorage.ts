import AsyncStorage from '@react-native-async-storage/async-storage';
import type { StateStorage } from 'zustand/middleware';

const logError = (operation: string, key: string, error: unknown) => {
  console.error(`[AsyncStorage] ${operation} failed for key "${key}"`, error);
};

export async function getItem(key: string): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(key);
  } catch (error) {
    logError('getItem', key, error);
    return null;
  }
}

export async function setItem(key: string, value: string): Promise<void> {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    logError('setItem', key, error);
  }
}

export async function removeItem(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    logError('removeItem', key, error);
  }
}

export const storage: StateStorage = {
  getItem,
  setItem,
  removeItem,
};
