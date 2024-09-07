import { Session } from "@supabase/supabase-js";
import { SplashScreen } from "expo-router";
import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { supabase } from "~/utils/supabase";

interface AuthContextProps {
    session: Session | null;
    user: Session["user"] | undefined;
}

const AuthContext = createContext<AuthContextProps>({session: null, user: undefined});

const AuthContextProvider = ({ children }: PropsWithChildren) => {

    const [session, setSession] = useState<Session | null>(null)
    const [initializing, setInitializing] = useState(true)

    useEffect(() => {
        
        setInitializing(true)
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session)
      })
  
      supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session)
      })
        setInitializing(false)
    }, [])
  
    return <AuthContext.Provider value={{session, user: session?.user}}>
        {initializing ? null : children}
        </AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);

export default AuthContextProvider;