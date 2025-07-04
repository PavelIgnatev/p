import { useStore } from "effector-react";
import React, { forwardRef, useImperativeHandle } from "react";
import b_ from "b_";

import { $password } from "../../store/Password";
import { ConfigModel } from "../../@types/configModel";
import {
  $editableConfig,
  editableConfigEvents,
  patchConfigRequest,
} from "../../store/Config";

import { BaseButton } from "../BaseButton";
import { UserSettingsTable } from "./__Table";
import { UserSettingsInfo } from "./__Info";
import "./index.scss";
import { ErrNot } from "../NotificationService";
import { Modal, ModalRef } from "../Modal";
import { ApprovalSection } from "../ApprovalSection";
import { useModal } from "../../hooks/useModal";

const b = b_.with("user-settings");

interface Props {
  config: ConfigModel;
  isAdminPage?: boolean;
  onClose: () => void;
  onSave?: () => void;
}

export interface UserSettingsRef {
  handleSubmit: () => Promise<void>;
}

const validateTimeFormat = (time: string | null): boolean => {
  if (!time) return true;
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
};

const parseTimeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

export const UserSettings = forwardRef<UserSettingsRef, Props>(({
  config,
  isAdminPage,
  onClose,
  onSave,
}, ref) => {
  const [progress, setProgress] = React.useState(false);
  const editableConfig = useStore($editableConfig);
  const { alias, networks, password: newPassword, ...props } = editableConfig;
  const password = useStore($password);
  const deleteModalRef = React.useRef<ModalRef>(null);
  const { handleModalOpen, handleModalClose } = useModal();

  React.useEffect(() => {
    editableConfigEvents.setConfig(config);
    return editableConfigEvents.clearConfig;
  }, [config]);

  const validateSessionTimes = (time1: string | null, time2: string | null): string | null => {
    // Проверяем, что оба поля времени либо заполнены, либо пусты
    if ([time1, time2].some(Boolean) && ![time1, time2].every(Boolean)) {
      return 'Both "Session start time" and "Session end time" fields must be filled in';
    }

    // Если оба поля пустые - всё ок
    if (!time1 || !time2) return null;

    // Проверяем формат времени
    if (!validateTimeFormat(time1) || !validateTimeFormat(time2)) {
      return 'Please check time format (HH:MM) in "Session start time" and "Session end time" fields';
    }

    // Проверяем, что время начала меньше времени окончания
    const startTime = parseTimeToMinutes(time1);
    const endTime = parseTimeToMinutes(time2);

    if (startTime >= endTime) {
      return 'Session start time must be earlier than session end time';
    }

    return null;
  };

  const validateFilterTimes = (times: (string | null)[]): string | null => {
    for (const time of times) {
      if (time && !validateTimeFormat(time)) {
        return 'Please check time format (HH:MM) in filter time fields';
      }
    }
    return null;
  };

  const handleSubmit = async () => {
    const { time1, time2, normalTime, turboTime, superTurboTime } = props;

    // Валидация времени сессии
    const sessionTimeError = validateSessionTimes(time1, time2);
    if (sessionTimeError) {
      ErrNot(sessionTimeError);
      return;
    }

    // Валидация времени фильтров
    const filterTimeError = validateFilterTimes([normalTime, turboTime, superTurboTime]);
    if (filterTimeError) {
      ErrNot(filterTimeError);
      return;
    }

    setProgress(true);
    try {
      await patchConfigRequest({
        alias,
        config: {
          ...props,
          networks,
          password: isAdminPage ? newPassword : config.password,
          alias,
        },
        password,
      });
      
      onSave?.();
      onClose();
    } catch (error) {
      // Ошибка уже будет показана через ErrNot в configDomain.onCreateEffect
    } finally {
      setProgress(false);
    }
  };

  useImperativeHandle(ref, () => ({
    handleSubmit
  }));

  if (!alias) {
    return null;
  }

  const handleDeleteCache = async () => {
    setProgress(true);
    localStorage.clear();
    await patchConfigRequest({
      alias,
      config: {
        ...props,
        networks,
        password: isAdminPage ? newPassword : config.password,
        alias,
        turboTime: null,
        superTurboTime: null,
        time1: null,
        time2: null,
        normalTime: null,
      },
      password,
    });
    window.location.reload();
    setProgress(false);
  };

  return (
    <>
      <UserSettingsInfo
        config={editableConfig}
        isAdminPage={isAdminPage}
        onDeleteCache={handleDeleteCache}
      >
        <UserSettingsTable networks={networks} canChangeLevels={isAdminPage} />
      </UserSettingsInfo>

      <Modal ref={deleteModalRef}>
        <ApprovalSection
          title="Do you really want to clear the account cache?"
          onApprove={() => {
            onClose();
            handleModalClose(deleteModalRef);
          }}
          onClose={() => handleModalClose(deleteModalRef)}
        />
      </Modal>
    </>
  );
});
