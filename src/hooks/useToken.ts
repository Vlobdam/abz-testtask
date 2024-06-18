import { BASE_TOKEN_URL } from "@/consts";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { setCookie, getCookie, deleteCookie } from "cookies-next";

export const useToken = (): [string, () => void, () => Promise<string>] => {
  const [token, setToken] = useState<string>('');

  const fetchToken = useCallback(async () => {
    const response = await axios.get(BASE_TOKEN_URL);
    const { token, success } = response.data;

    if (success) {
      setToken(token);
      setCookie('token', token, { maxAge: 2400, path: 'https://frontend-test-assignment-api.abz.agency/api/v1/', sameSite: true});
      return token;
    }

    return '';
  }, []);

  useEffect(() => {
    if (token) {
      return
    }
    
    const tokenFromCookies = getCookie('token');
    
    if (tokenFromCookies) {
      setToken(tokenFromCookies);
    } else {
      fetchToken();
    }
  }, [fetchToken, token]);

  const clearToken = () => {
    setToken('');
    deleteCookie('token');
  };

  return [token, clearToken, fetchToken];
};
