

// Function to check permissions
export const checkPermissions = async (): Promise<boolean> => {
  let geolocationGranted = false;
  let notificationGranted = false;

  // Check Geolocation Permission
  const getLocationPermission = (): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          () => {
            geolocationGranted = true;  // Location access granted
            resolve(true);
          },
          (error) => {
            console.error("Geolocation access denied", error);
            resolve(false);  // Location access denied
          }
        );
      } else {
        console.error("Geolocation not supported by this browser.");
        resolve(false);
      }
    });
  };

  // Check Notification Permission
  const getNotificationPermission = async (): Promise<boolean> => {
    if ('Notification' in window) {
      const permission: NotificationPermission = Notification.permission;
      if (permission === 'granted') {
        notificationGranted = true;
        return true;  // Notification access already granted
      } else if (permission === 'default') {
        const requestPermission = await Notification.requestPermission();
        notificationGranted = requestPermission === 'granted';
        return notificationGranted;  // Request permission
      }
      return false;  // Notification previously denied
    }
    console.error("Notifications not supported by this browser.");
    return false;
  };

  // Run both checks
  await getLocationPermission();
  notificationGranted = await getNotificationPermission();

  // Return true if both permissions are granted
  return geolocationGranted && notificationGranted;
};

