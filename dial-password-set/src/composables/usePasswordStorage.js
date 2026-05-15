import { ref, watch } from 'vue'

const STORAGE_KEY = 'dial-password-combinations'

export function usePasswordStorage() {
  const savedPasswords = ref([])
  const currentPassword = ref([])

  const loadPasswords = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        savedPasswords.value = JSON.parse(stored)
      }
    } catch (e) {
      console.error('Failed to load passwords:', e)
    }
  }

  const savePassword = (name, combination, settings) => {
    const password = {
      id: Date.now(),
      name,
      combination,
      settings,
      createdAt: new Date().toISOString()
    }
    savedPasswords.value.push(password)
    persist()
    return password
  }

  const deletePassword = (id) => {
    savedPasswords.value = savedPasswords.value.filter(p => p.id !== id)
    persist()
  }

  const persist = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedPasswords.value))
    } catch (e) {
      console.error('Failed to save passwords:', e)
    }
  }

  const setCurrentPassword = (values) => {
    currentPassword.value = values
  }

  loadPasswords()

  return {
    savedPasswords,
    currentPassword,
    savePassword,
    deletePassword,
    setCurrentPassword,
    loadPasswords
  }
}
