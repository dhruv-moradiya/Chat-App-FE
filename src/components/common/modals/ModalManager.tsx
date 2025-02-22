import Modal from "@/components/ui/Modal";
import useDynamicModelContent from "@/hooks/useDynamicModelContent";
import { useAppSelector } from "@/store/store";
import { ModalTypeValue } from "@/types/Common.types";

const ModalManager = () => {
  const {
    isOpen,
    props,
    type: activeModal,
  } = useAppSelector((state) => state.chatDetail.modalConfig);

  const { renderModalContent } = useDynamicModelContent({
    modelType: activeModal as ModalTypeValue,
    dynamicProps: props,
  });

  return <Modal isOpen={isOpen}>{renderModalContent()}</Modal>;
};

export default ModalManager;
