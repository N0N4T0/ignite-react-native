import React from "react"
import { NavigationContainer } from "@react-navigation/native"

import { AuthRoutes } from "./auth.routes"
import { AppRoutes } from "./app.routes"

import { useAuth } from "../hooks/auth"

export function Routes(){
    const {user} = useAuth()

    console.log(user)

    // baseado no meu contexto "user" direcionará qual rota AuthRoutes ou AppRoutes
    return(
        <NavigationContainer>
            {user.id ? <AppRoutes/> : <AuthRoutes/> }
        </NavigationContainer>
    )
}