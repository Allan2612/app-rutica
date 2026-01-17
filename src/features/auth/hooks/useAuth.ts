import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Session } from '@supabase/supabase-js';

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    // Validar sesión inicial
    const initSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          if (isMounted) {
            setSession(null);
            setIsLoading(false);
          }
          return;
        }

        if (session) {
          // Validar que el usuario realmente exista
          const { data: { user }, error: userError } = await supabase.auth.getUser();
          
          if (userError || !user) {
            await supabase.auth.signOut();
            if (isMounted) {
              setSession(null);
              setIsLoading(false);
            }
            return;
          }
        }

        if (isMounted) {
          setSession(session);
          setIsLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          setSession(null);
          setIsLoading(false);
        }
      }
    };

    initSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (isMounted) {
          setSession(session);
          setIsLoading(false);
        }
      }
    );

    return () => {
      isMounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  return {
    session,
    user: session?.user ?? null,
    isAuthenticated: !!session,
    isLoading,
  };
}
