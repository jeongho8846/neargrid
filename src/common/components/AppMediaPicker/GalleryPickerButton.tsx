import { usePermission } from '@/common/hooks/usePermission';
import PermissionDialog from '@/common/components/PermissionDialog';
import { StyleSheet, TouchableOpacity } from 'react-native';
import AppIcon from '../AppIcon';
import { SPACING } from '@/common/styles';

export default function GalleryPickerButton({ onPress }: Props) {
  const galleryPermission = usePermission('gallery');

  const handlePress = async () => {
    const status = await galleryPermission.check();
    if (status === 'granted') {
      onPress();
      return;
    }

    const result = await galleryPermission.request();
    if (result.granted) {
      onPress();
    }
  };

  return (
    <>
      <TouchableOpacity onPress={handlePress} style={styles.container}>
        <AppIcon name="image" type="ion" variant="secondary" />
      </TouchableOpacity>

      <PermissionDialog
        visible={galleryPermission.dialogVisible}
        type="gallery"
        onConfirm={galleryPermission.handleConfirm}
        onClose={galleryPermission.handleClose}
      />
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: SPACING.xs,
  },
});
