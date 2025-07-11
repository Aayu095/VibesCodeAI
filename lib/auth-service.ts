// Mock auth service using localStorage for development
// Replace with Supabase auth in production

export interface User {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  subscription_tier: "free" | "pro" | "enterprise"
  created_at: string
  updated_at: string
}

export interface Session {
  id: string
  user_id: string
  expires_at: string
}

export class AuthService {
  private generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36)
  }

  // Mock sign up - stores in localStorage
  async signUp(email: string, password: string, fullName?: string): Promise<{ user: User; session: Session }> {
    // Check if user exists
    const existingUsers = this.getStoredUsers()
    if (existingUsers.find((u) => u.email === email)) {
      throw new Error("User already exists")
    }

    const userId = this.generateId()
    const user: User = {
      id: userId,
      email,
      full_name: fullName || null,
      avatar_url: null,
      subscription_tier: "free",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    // Store user
    existingUsers.push({ ...user, password_hash: password }) // In real app, hash the password
    localStorage.setItem("vibescode-users", JSON.stringify(existingUsers))

    // Create session
    const session = await this.createSession(userId)

    return { user, session }
  }

  // Mock sign in
  async signIn(email: string, password: string): Promise<{ user: User; session: Session }> {
    const users = this.getStoredUsers()
    const userRecord = users.find((u) => u.email === email && (u as any).password_hash === password)

    if (!userRecord) {
      throw new Error("Invalid credentials")
    }

    const user: User = {
      id: userRecord.id,
      email: userRecord.email,
      full_name: userRecord.full_name,
      avatar_url: userRecord.avatar_url,
      subscription_tier: userRecord.subscription_tier,
      created_at: userRecord.created_at,
      updated_at: userRecord.updated_at,
    }

    const session = await this.createSession(user.id)
    return { user, session }
  }

  // Create session
  async createSession(userId: string): Promise<Session> {
    const sessionId = this.generateId()
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days

    const session: Session = {
      id: sessionId,
      user_id: userId,
      expires_at: expiresAt.toISOString(),
    }

    // Store session
    const sessions = this.getStoredSessions()
    sessions.push(session)
    localStorage.setItem("vibescode-sessions", JSON.stringify(sessions))

    return session
  }

  // Validate session
  async validateSession(sessionId: string): Promise<{ user: User; session: Session } | null> {
    const sessions = this.getStoredSessions()
    const session = sessions.find((s) => s.id === sessionId && new Date(s.expires_at) > new Date())

    if (!session) {
      return null
    }

    const user = this.getUserById(session.user_id)
    if (!user) {
      return null
    }

    return { user, session }
  }

  // Sign out
  async signOut(sessionId: string): Promise<void> {
    const sessions = this.getStoredSessions()
    const filteredSessions = sessions.filter((s) => s.id !== sessionId)
    localStorage.setItem("vibescode-sessions", JSON.stringify(filteredSessions))
  }

  // Get user by ID
  getUserById(userId: string): User | null {
    const users = this.getStoredUsers()
    const user = users.find((u) => u.id === userId)

    if (!user) return null

    return {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      avatar_url: user.avatar_url,
      subscription_tier: user.subscription_tier,
      created_at: user.created_at,
      updated_at: user.updated_at,
    }
  }

  // Update user profile
  async updateProfile(userId: string, updates: { full_name?: string; avatar_url?: string }): Promise<User> {
    const users = this.getStoredUsers()
    const userIndex = users.findIndex((u) => u.id === userId)

    if (userIndex === -1) {
      throw new Error("User not found")
    }

    users[userIndex] = {
      ...users[userIndex],
      ...updates,
      updated_at: new Date().toISOString(),
    }

    localStorage.setItem("vibescode-users", JSON.stringify(users))
    return this.getUserById(userId)!
  }

  // Helper methods
  private getStoredUsers(): any[] {
    try {
      return JSON.parse(localStorage.getItem("vibescode-users") || "[]")
    } catch {
      return []
    }
  }

  private getStoredSessions(): Session[] {
    try {
      return JSON.parse(localStorage.getItem("vibescode-sessions") || "[]")
    } catch {
      return []
    }
  }

  // Clean expired sessions
  cleanExpiredSessions(): void {
    const sessions = this.getStoredSessions()
    const validSessions = sessions.filter((s) => new Date(s.expires_at) > new Date())
    localStorage.setItem("vibescode-sessions", JSON.stringify(validSessions))
  }
}

export const authService = new AuthService()
