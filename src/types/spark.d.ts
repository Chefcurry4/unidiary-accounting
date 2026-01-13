interface SparkUser {
  avatarUrl: string
  email: string
  id: number
  isOwner: boolean
  login: string
}

interface SparkAPI {
  user(): Promise<SparkUser>
  kv: {
    get(key: string): Promise<any>
    set(key: string, value: any): Promise<void>
  }
}

declare global {
  interface Window {
    spark: SparkAPI
  }
}

export {}
