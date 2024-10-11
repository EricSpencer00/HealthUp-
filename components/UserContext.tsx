import React, { createContext, useState } from 'react';

// Create a context for user data
export const UserContext = createContext<any>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [userName, setUserName] = useState('');
  const [weight, setWeight] = useState('');
  const [favoriteFoods, setFavoriteFoods] = useState('');

  return (
    <UserContext.Provider
      value={{
        userName,
        setUserName,
        weight,
        setWeight,
        favoriteFoods,
        setFavoriteFoods,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
