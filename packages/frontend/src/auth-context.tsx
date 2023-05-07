import { createContext, useContext, useMemo, useRef, useState, useEffect } from 'react';
import { TokenResponse, User, useRefreshTokens } from './api';
import jwtDecode from 'jwt-decode';

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

const getTokensFormStorage = (): TokenResponse | null => {
  try {
    return JSON.parse(localStorage.getItem(storageTokensKey));
  } catch {
    return null;
  }
};

const setTokensToStorage = (tokens: TokenResponse) => {
  localStorage.setItem(storageTokensKey, JSON.stringify(tokens));
};

const removeTokensFromStorage = () => {
  localStorage.removeItem(storageTokensKey);
};

export const useAuthContext = () => useContext(authContext);

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({ children, onRefreshFail }) => {
  const subscribers = useRef<UserUpdateSubscriberCb[]>([]);

  const tokens = useRef<TokenResponse>(getTokensFormStorage());

  const getUserFromToken = (token: TokenResponse['access_token']): User => {
    try {
      return jwtDecode(token);
    } catch {
      return null;
    }
  };

  const user = useRef<User>(getUserFromToken(tokens?.current?.access_token));

  const pendingTokens = useRef<Promise<TokenResponse>>(null);

  const { refresh } = useRefreshTokens({ onError: onRefreshFail });

  const getUser = () => user.current;

  const notifySubscribers = () => {
    const currentUser = getUser();
    subscribers.current.forEach((subscriberCb) => subscriberCb(currentUser));
  };

  const subscribeUserUpdate = (cb: UserUpdateSubscriberCb) => subscribers.current.push(cb);

  const unsubscribeUserUpdate = (cb: UserUpdateSubscriberCb) => {
    subscribers.current = subscribers.current.filter((subscriberCb) => subscriberCb !== cb);
  };

  const setTokens = (newTokens: TokenResponse) => {
    user.current = getUserFromToken(newTokens.access_token);
    tokens.current = newTokens;

    setTokensToStorage(newTokens);
    notifySubscribers();
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

    tokens.current = null;
    pendingTokens.current = refresh(refresh_token);

    await pendingTokens.current;
    pendingTokens.current = null;

    return getToken();
  };

  const removeTokens = () => {
    user.current = null;
    tokens.current = null;
    pendingTokens.current = null;
    removeTokensFromStorage();
    notifySubscribers();
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
