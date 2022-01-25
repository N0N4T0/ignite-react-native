import React, { 
    createContext, 
    ReactNode,
    useContext
} from "react"


interface AuthProviderProps{
    children: ReactNode;
}

interface User {
    id: string;
    name: string;
    email: string;
    photo?: string;
}

interface IAuthContextData{
    user: User;
}

// Contexto com valor inicial = []
const AuthContext  = createContext({} as IAuthContextData)

function AuthProvider({children}: AuthProviderProps){
    const user = {
        id: '1234',
        name: 'Oliveira Santos',
        email: 'oliveira@oliveira.com.br',
    }

    return(
        <AuthContext.Provider value={{ user }}>
            {children}
        </AuthContext.Provider>
    )
}

function useAuth(){
    const context = useContext(AuthContext)

    return context
}

export {AuthProvider, useAuth}