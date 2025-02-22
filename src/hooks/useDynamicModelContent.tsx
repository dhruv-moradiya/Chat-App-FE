import { EmojiPicker } from "@/components/common/modals/EmojiPicker";
import { DeleteMessageModalForSelectedParticipants } from "@/components/common/modals/DeleteMessageModalForSelectedParticipants";
import { ModalType } from "@/lib/constants";
import { ModalTypeValue } from "@/types/Common.types";
import { SearchUsers } from "@/components/common/modals/SearchUsers";
import { CheckFriendRequest } from "@/components/common/modals/CheckFriendRequest";
import { GroupChat } from "@/components/common/modals/GroupChat";

type ModelType = ModalTypeValue;

interface ModalProps {
  modelType: ModelType;
  dynamicProps?: Record<string, any>;
}

const modalComponents: Record<ModelType, React.ComponentType<any>> = {
  [ModalType.DELETE_MODEL]: DeleteMessageModalForSelectedParticipants,
  [ModalType.REACT_MODEL]: EmojiPicker,
  [ModalType.SEARCH_USERS_MODEL]: SearchUsers,
  [ModalType.CHECK_FRIEND_REQUEST_MODEL]: CheckFriendRequest,
  [ModalType.CREATE_GROUP_CHAT_MODEL]: GroupChat,
};

const useDynamicModelContent = ({ modelType, dynamicProps }: ModalProps) => {
  const renderModalContent = () => {
    if (!modelType) return null;

    const ModalComponent = modalComponents[modelType];
    if (!ModalComponent) {
      console.warn(`No component found for modal type: ${modelType}`);
      return null;
    }

    return <ModalComponent {...dynamicProps} />;
  };

  return { renderModalContent };
};

export default useDynamicModelContent;
