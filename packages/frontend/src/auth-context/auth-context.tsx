import { createContext, useContext, useMemo, useRef, useState, useEffect } from 'react';
import { TokenPayload, TokenResponse, User, useRefreshTokens } from '../api';
import jwtDecode from 'jwt-decode';
import { useStorageAuth } from './use-storage-auth';

type AuthContextProviderProps = {
  children: React.ReactNode;
  onRefreshFail: () => void;
};

type UserUpdateSubscriberCb = (user: User) => void;

type AuthContextReturn = {
  setTokens(tokens: TokenResponse): void;
  getToken(): Promise<string>;
  refreshTokens(): Promise<string>;
  getUser(): User;
  removeTokens(): void;
  subscribeUserUpdate(cb: UserUpdateSubscriberCb): void;
  unsubscribeUserUpdate(cb: UserUpdateSubscriberCb): void;
};

const authContext = createContext({} as AuthContextReturn);

const storageTokensKey = '@nbda/tokens';

export const useAuthContext = () => useContext(authContext);

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({ children, onRefreshFail }) => {
  const { getTokenFromStorage, setTokenToStorage, removeTokenFromStorage } = useStorageAuth(storageTokensKey);

  const subscribers = useRef<UserUpdateSubscriberCb[]>([]);

  const tokens = useRef<TokenResponse>(getTokenFromStorage());
  const pendingTokens = useRef<Promise<TokenResponse>>(null);

  const getUserFromToken = ({ refresh_token }: TokenResponse): User => {
    try {
      const { exp, email, firstName, lastName, id }: TokenPayload = jwtDecode(refresh_token);
      const expDate = new Date(exp * 1000);

      const isExpired = new Date() > expDate;

      if (isExpired) {
        return null;
      }

      return { id, email, firstName, lastName };
    } catch {
      return null;
    }
  };

  const user = useRef<User>(getUserFromToken(tokens.current));

  const getUser = () => user.current;

  const setTokens = (newTokens: TokenResponse) => {
    user.current = getUserFromToken(newTokens);
    tokens.current = newTokens;
    pendingTokens.current = null;

    setTokenToStorage(newTokens);
    notifySubscribers();
  };

  const { refresh } = useRefreshTokens({
    onSuccess: setTokens,
    onError: onRefreshFail,
  });

  const notifySubscribers = () => {
    const currentUser = getUser();
    subscribers.current.forEach((subscriberCb) => subscriberCb(currentUser));
  };

  const getToken = async () => {
    if (pendingTokens.current) {
      const { access_token } = await pendingTokens.current;
      return access_token;
    }

    return tokens.current?.access_token;
  };

  const refreshTokens = async () => {
    if (pendingTokens.current) {
      return getToken();
    }

    const { refresh_token } = tokens.current ?? {};
    pendingTokens.current = refresh(refresh_token);

    return getToken();
  };

  const removeTokens = () => {
    user.current = null;
    tokens.current = null;
    pendingTokens.current = null;
    removeTokenFromStorage();
    notifySubscribers();
  };

  const subscribeUserUpdate = (cb: UserUpdateSubscriberCb) => subscribers.current.push(cb);

  const unsubscribeUserUpdate = (cb: UserUpdateSubscriberCb) => {
    subscribers.current = subscribers.current.filter((subscriberCb) => subscriberCb !== cb);
  };

  const value = useMemo(
    () => ({
      getUser,
      getToken,
      setTokens,
      removeTokens,
      refreshTokens,
      subscribeUserUpdate,
      unsubscribeUserUpdate,
    }),
    [],
  );

  return <authContext.Provider value={value}>{children}</authContext.Provider>;
};

export const useUser = () => {
  const { subscribeUserUpdate, unsubscribeUserUpdate, getUser } = useAuthContext();

  const [user, setUser] = useState<User>(getUser);

  useEffect(() => {
    subscribeUserUpdate(setUser);

    return () => unsubscribeUserUpdate(setUser);
  }, []);

  return user;
};
