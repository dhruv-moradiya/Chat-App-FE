import { DeleteMessageModalForSelectedParticipants } from "@/components/homepage/chattingsection/models/DeleteMessageModalForSelectedParticipants";
import { ReactMessageModal } from "@/components/homepage/chattingsection/models/ReactMessageModal";

type ModelType = "DELETE" | "REACT" | string;
//   | "CREATE_GROUP_CHAT"
//   | "SEARCH_USERS"
//   | "CHECK_FRIEND_REQUEST"
//   | "PROFILE"
//   | "SETTING";

interface ModalProps {
  modelType: ModelType;
  dynamicProps?: Record<string, any>;
}

const modalComponents: Record<ModelType, React.ComponentType<any>> = {
  DELETE: DeleteMessageModalForSelectedParticipants,
  REACT: ReactMessageModal,
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
