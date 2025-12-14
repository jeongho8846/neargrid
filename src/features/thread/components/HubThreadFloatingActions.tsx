import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import AppIcon from '@/common/components/AppIcon';
import AppText from '@/common/components/AppText';
import { COLORS } from '@/common/styles/colors';
import { SPACING } from '@/common/styles/spacing';

type Props = {
  onPressPasteMyThread?: () => void;
  onPressCreateChildThread?: () => void;
};

type ActionChipProps = {
  i18nKey: string;
  icon: { name: string; type?: 'ion' | 'material' };
  onPress?: () => void;
};

const ActionChip: React.FC<ActionChipProps> = ({ i18nKey, icon, onPress }) => (
  <TouchableOpacity
    activeOpacity={0.85}
    style={styles.actionChip}
    onPress={onPress}
  >
    <AppIcon
      name={icon.name}
      type={icon.type}
      size={18}
      variant="primary"
      style={styles.actionIcon}
    />
    <AppText i18nKey={i18nKey} variant="body" style={styles.actionLabel} />
  </TouchableOpacity>
);

const HubThreadFloatingActions: React.FC<Props> = ({
  onPressPasteMyThread,
  onPressCreateChildThread,
}) => {
  const [expanded, setExpanded] = useState(false);

  const closeActions = () => setExpanded(false);

  return (
    <View pointerEvents="box-none" style={styles.wrapper}>
      {expanded && (
        <TouchableOpacity
          activeOpacity={1}
          style={styles.backdrop}
          onPress={closeActions}
        />
      )}

      <View style={styles.stack}>
        {expanded && (
          <View style={styles.actionsColumn}>
            <ActionChip
              i18nKey="STR_ATTACH_MY_THREAD"
              icon={{ name: 'link-outline', type: 'ion' }}
              onPress={() => {
                onPressPasteMyThread?.();
                closeActions();
              }}
            />
            <ActionChip
              i18nKey="STR_CREATE_CHILD_THREAD"
              icon={{ name: 'git-branch-outline', type: 'ion' }}
              onPress={() => {
                onPressCreateChildThread?.();
                closeActions();
              }}
            />
          </View>
        )}

        <TouchableOpacity
          activeOpacity={0.9}
          style={[styles.fab, expanded && styles.fabActive]}
          onPress={() => setExpanded(prev => !prev)}
        >
          <AppIcon
            name={expanded ? 'close' : 'create-outline'}
            type="ion"
            size={24}
            variant="onDark"
            color={COLORS.title}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HubThreadFloatingActions;

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    paddingRight: SPACING.lg,
    paddingBottom: SPACING.xl,
    zIndex: 1000,
  },
  stack: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.overlay_strong,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.button_active,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SPACING.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 8,
  },
  fabActive: {
    backgroundColor: COLORS.button_pressed,
  },
  actionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 999,
    backgroundColor: COLORS.sheet_background,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 6,
  },
  actionLabel: {
    marginLeft: SPACING.xs,
    color: COLORS.title,
  },
  actionIcon: {
    marginRight: SPACING.xs,
  },
  actionsColumn: {
    alignItems: 'flex-end',
    marginBottom: -25,
    right: 60,
  },
});
