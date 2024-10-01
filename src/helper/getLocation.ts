export const getLocation = (): Promise<string | null> => {
    return new Promise((resolve) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const location = `${latitude},${longitude}`;
            resolve(location);
          },
          (error) => {
            console.error("Failed to get location", error);
            resolve(null);  // If permission is denied or any error occurs, return null
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
        resolve(null);
      }
    });
  };
  