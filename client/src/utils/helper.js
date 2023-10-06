const routes = [
    { route: "/", title: "Home" },
    { route: "/about", title: "About" },
]

const renderHeaderConditionally = () => {
    const routesToHideHeader = ['/sign-in', '/sign-up'];
    const shouldHideHeader = routesToHideHeader.includes(location.pathname);
    return shouldHideHeader

}

const signUpFormData = [
    { type: 'text', placeholder: "Username", id: 'username' },
    { type: 'email', placeholder: "Email", id: 'email' },
    { type: 'password', placeholder: "Password", id: 'password' },
]

const signInFormData = signUpFormData.filter(({ id }) => id !== 'username')

const getDefaultValue = (id, currentUser) => {
    if(id === 'username') return currentUser?.username
    if(id === 'email') return currentUser?.email
}

export {
    routes,
    renderHeaderConditionally,
    signUpFormData,
    signInFormData,
    getDefaultValue
}