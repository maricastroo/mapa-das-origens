//aqui um pagina de contexto para o auth (login/logout) 
import React, { createContext, useState, useContext, useEffect } from 'react';

// aqui cria o contexto
const AuthContext = createContext(null);

// componente provedor do contexto
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token')); 

  // este useEffect roda quando o app abre, para "lembrar" o usuário
  useEffect(() => {
    if (token) {
      // (Aqui você faria uma chamada à API para validar o token e pegar dados do user)
      // Por enquanto, vamos "fingir" que o token é válido
      // No futuro, você vai decodificar o token (com jwt-decode)
      // Por agora, se temos token, vamos assumir que estamos logados.
      // Apenas para o exemplo, vamos setar um usuário "mock"
      // setUser({ nome: 'Usuário Logado' });
      
      // Quando seu backend estiver 100%, você vai decodificar o token
      // e pegar o usuário de verdade.
    }
  }, [token]);

  // pagina chama
  const login = (userData, userToken) => {
    localStorage.setItem('token', userToken);
    setToken(userToken);
    setUser(userData);
  };

  // perfil vai chamar
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// hook para usar o contexto
export const useAuth = () => {
  return useContext(AuthContext);
};