import { useState, useEffect } from 'react';
import { getUsersData } from '../../api/chat';

const useUserData = () => {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await getUsersData();
        if (response.data && response.data.length > 0) {
          setUserData(response.data);
        } else {
          throw new Error('No se encontraron datos de usuario');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getUserData();
  }, []);

  return { userData, loading, error };
};

export default useUserData;