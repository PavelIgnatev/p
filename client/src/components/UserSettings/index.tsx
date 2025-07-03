import { useStore } from "effector-react";
import React from "react";
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

interface Props {
  config: ConfigModel;
  isAdminPage?: boolean;
  onClose: () => void;
}

export const b = b_.with("user-settings");

export const UserSettings = ({ config, isAdminPage, onClose }: Props) => {
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

  if (!alias) {
    return null;
  }

  const handleSubmit = async () => {
    const { time1, time2, normalTime, turboTime, superTurboTime } = props;

    if (
      ([time1, time2].some(Boolean) && ![time1, time2].every(Boolean)) ||
      ([time1, time2].every(Boolean) &&
        (time1?.includes("-") || time2?.includes("-")))
    ) {
      return ErrNot(
        'Check that the "Session start time" and "Session end time" fields are filled in correctly.'
      );
    }

    if (
      normalTime?.includes("-") ||
      turboTime?.includes("-") ||
      superTurboTime?.includes("-")
    ) {
      return ErrNot(
        'Check that the "Filter Normal", "Filter Turbo" and "Filter Super Turbo" fields are filled in correctly.'
      );
    }

    setProgress(true);
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
    setProgress(false);

    onClose();
  };

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
        <UserSettingsTable
          networks={networks}
          canChangeLevels={isAdminPage}
        />
      </UserSettingsInfo>

      <BaseButton
        onClick={handleSubmit}
        className={b("save-button")}
        disabled={progress}
      >
        Save changes
      </BaseButton>

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
};
