// storage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Generic typed storage utility
 */
class StorageService {
  /**
   * Save any serializable value
   */
  async set<T>(key: string, value: T): Promise<boolean> {
    try {
      const json = JSON.stringify(value);
      await AsyncStorage.setItem(key, json);
      return true;
    } catch (error) {
      //   console.log(`[Storage:set] ${key}`, error);
      return false;
    }
  }

  /**
   * Get parsed value safely
   */
  async get<T>(key: string, fallback: T): Promise<T> {
    try {
      const value = await AsyncStorage.getItem(key);

      if (value === null) return fallback;

      return JSON.parse(value) as T;
    } catch (error) {
      //   console.log(`[Storage:get] ${key}`, error);
      return fallback;
    }
  }

  /**
   * Remove a key
   */
  async remove(key: string): Promise<boolean> {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      //   console.log(`[Storage:remove] ${key}`, error);
      return false;
    }
  }

  /**
   * Clear all storage
   */
  async clear(): Promise<boolean> {
    try {
      await AsyncStorage.clear();
      return true;
    } catch (error) {
      //   console.log(`[Storage:clear]`, error);
      return false;
    }
  }
}

export const storage = new StorageService();
