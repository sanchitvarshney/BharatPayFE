// /src/hooks/useAuth.ts
const useAuth = () => {
    const token = localStorage.getItem('token');
    const loggedinusre = localStorage.getItem('loggedinUser');
    return !!token || !!loggedinusre;
  };
  
  export default useAuth;