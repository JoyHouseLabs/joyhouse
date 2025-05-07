interface ElectronAPI {
  getStoreValue: (key: string) => Promise<any>
  setStoreValue: (key: string, value: any) => Promise<boolean>
  checkForUpdates: () => Promise<void>
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
} 