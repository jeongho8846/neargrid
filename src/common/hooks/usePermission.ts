import { useState, useCallback } from 'react';
import {
  requestPermission,
  checkPermission,
  PermissionType,
  PermissionResult,
} from '@/services/device/permissionService';

export const usePermission = (type: PermissionType) => {
  const [dialogVisible, setDialogVisible] = useState(false);
  const [resolveCallback, setResolveCallback] = useState<
    ((result: PermissionResult) => void) | null
  >(null);

  const check = useCallback(async () => {
    return await checkPermission(type);
  }, [type]);

  const request = useCallback((): Promise<PermissionResult> => {
    return new Promise(resolve => {
      setResolveCallback(() => resolve);
      setDialogVisible(true);
    });
  }, []);

  const handleConfirm = useCallback(async () => {
    setDialogVisible(false);
    const result = await requestPermission(type);
    if (resolveCallback) {
      resolveCallback(result);
      setResolveCallback(null);
    }
  }, [type, resolveCallback]);

  const handleClose = useCallback(() => {
    setDialogVisible(false);
    if (resolveCallback) {
      resolveCallback({
        granted: false,
        status: 'denied',
        shouldShowSettings: false,
      });
      setResolveCallback(null);
    }
  }, [resolveCallback]);

  return {
    dialogVisible,
    check,
    request,
    handleConfirm,
    handleClose,
  };
};
