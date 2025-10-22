// src/features/donation/sheets/DonateContainer.tsx
import React, { useMemo, useState } from 'react';
import { Platform, ToastAndroid, Alert } from 'react-native';
import { useBottomSheetStore } from '@/common/state/bottomSheetStore';
import Contents_Donate_Viewer from '@/features/donation/components/Contents_Donate_Viewer';
import { useDonate } from '@/features/donation/hooks/useDonate';

type Props = {
  currentMemberId: string;
  threadId: string;
  currentPoint?: number;
};

const DonateContainer: React.FC<Props> = ({
  currentMemberId,
  threadId,
  currentPoint = 0,
}) => {
  const { close } = useBottomSheetStore();
  const { donate, loading } = useDonate();

  const [point, setPoint] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const toast = (m: string) =>
    Platform.OS === 'android'
      ? ToastAndroid.show(m, ToastAndroid.SHORT)
      : Alert.alert('', m);

  const onChangePoint = (v: string) => setPoint(v.replace(/[^0-9]/g, ''));

  const disabled = useMemo(() => {
    const n = Number(point);
    return !Number.isFinite(n) || n <= 0 || loading;
  }, [point, loading]);

  const handleDonate = async () => {
    const n = Number(point);
    if (!Number.isFinite(n) || n <= 0)
      return toast('포인트를 올바르게 입력해 주세요.');
    if (currentPoint > 0 && n > currentPoint)
      return toast('보유 포인트가 부족합니다.');

    try {
      await donate({
        current_member_id: currentMemberId,
        thread_id: threadId,
        point: n,
        message,
      });

      toast('기부가 완료되었습니다');
      close();
    } catch (e: any) {
      toast(e?.message ?? '후원 처리 중 오류가 발생했습니다.');
    }
  };

  return (
    <Contents_Donate_Viewer
      loading={loading}
      disabled={disabled}
      currentPoint={currentPoint}
      point={point}
      message={message}
      onChangePoint={onChangePoint}
      onChangeMessage={setMessage}
      onPressDonate={handleDonate}
      onPressCancel={close}
      onPressCharge={() => toast('충전은 별도 시트로 분리 예정')}
    />
  );
};

export default DonateContainer;
