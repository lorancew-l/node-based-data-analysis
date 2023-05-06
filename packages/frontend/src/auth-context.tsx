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

export const useAuthContext = () => useContext(authContext);

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({ children, onRefreshFail }) => {
  const user = useRef<User>(null);
  const subscribers = useRef<UserUpdateSubscriberCb[]>([]);

  const tokens = useRef<TokenResponse>(null);
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
    const newUser: User = jwtDecode(newTokens.access_token);

    user.current = newUser;
    tokens.current = newTokens;

    notifySubscribers();
  };

  const getToken = async () => {
    if (pendingTokens.current) {
      const { access_token } = await pendingTokens.current;
      return access_token;
    }

    return tokens.current.access_token;
  };

  const refreshTokens = async () => {
    if (pendingTokens.current) {
      return getToken();
    }

    const { refresh_token } = tokens.current;

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
