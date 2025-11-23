// src/features/map/hooks/useMapLocationPermission.ts

import { useEffect, useState } from 'react';
import { usePermission } from '@/common/hooks/usePermission';
import { startWatchingLocation } from '@/services/device';

export const useMapLocationPermission = () => {
  const locationPermission = usePermission('location');
  const [locationGranted, setLocationGranted] = useState(false);

  useEffect(() => {
    const requestLocation = async () => {
      const status = await locationPermission.check();

      if (status === 'granted') {
        setLocationGranted(true);
        startWatchingLocation();
        return;
      }

      const result = await locationPermission.request();
      setLocationGranted(result.granted);

      if (result.granted) {
        setLocationGranted(true);
        startWatchingLocation();
      }
    };

    requestLocation();
  }, []);

  return {
    locationGranted,
    dialogVisible: locationPermission.dialogVisible,
    handleConfirm: locationPermission.handleConfirm,
    handleClose: locationPermission.handleClose,
  };
};
