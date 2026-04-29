export function getCurrentUser() {
    const user = localStorage.getItem('user')

    if (!user) {
        return null
    }

    return JSON.parse(user)
}

export function isAuthenticated() {
    return getCurrentUser() !== null
}

export function login(user) {
    localStorage.setItem('user', JSON.stringify(user))
}

export function logout() {
    localStorage.removeItem('user')
}