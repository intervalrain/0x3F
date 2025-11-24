declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email?: string | null
      name?: string | null
      image?: string | null
      hasGitHub?: boolean
      githubUsername?: string | null
    }
  }

  interface User {
    id: string
    email?: string | null
    name?: string | null
    image?: string | null
    hasGitHub?: boolean
    githubUsername?: string | null
  }
}