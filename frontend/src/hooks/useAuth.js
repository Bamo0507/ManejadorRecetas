import { useState, createContext, useContext} from "react";

const AuthContext = createContext();

export function useAuth(){
    return useContext(AuthContext);
}

export function AuthProvider({children}) {
    const [user, setUser] = useState(null);

    //todo: aqui tendre que validar el usuario con las contrasenias
}