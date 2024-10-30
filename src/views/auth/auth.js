// auth.js
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  // You can add additional logic to check token validity (like expiry date)
  const expiryDT = localStorage.getItem('tokenExpiry')
  const parsedExpiryDate = new Date(expiryDT);
  const currentDate = new Date();
  console.log("test expiry")
  // if (currentDate < parsedExpiryDate) {
  //   return false; // Not expired yet
  // } else {
  //   return true; // Already expired
  // }
  
  return token ? true : false;
};

