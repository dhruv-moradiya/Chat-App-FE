import React, { useEffect, useRef, useState } from "react";
import { AxiosError } from "axios";
import { useAppSelector } from "@/store/store";
import { capitalizeFirstLetter, cn } from "@/lib/utils";
import { UserPreview } from "@/types/ApiResponse.types";
import { createGroupChat, fetchMyFriendsList } from "@/api";
import { ArrowLeft, ArrowRight, Check, Loader, X } from "lucide-react";
import { showErrorToast, showInfoToast } from "@/components/common/ToastProvider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { closeModal } from "@/store/chatDetailSidebar/ChatDetailSlice";

const GroupChat = () => {
  const directChats = useAppSelector((state) => state.myChats.myChats).filter(
    (chat) => !chat.isGroup
  );

  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [friendsList, setFriendsList] = useState<UserPreview[]>([]);
  const [selectedFriends, setSelectedFriends] = useState<UserPreview[]>([]);

  const handleSelect = (friend: UserPreview) => {
    if (!selectedFriends.find((selected) => selected._id === friend._id)) {
      setSelectedFriends([...selectedFriends, friend]);
    }
  };

  const handleRemove = (id: string) => {
    setSelectedFriends((prev) => prev.filter((selectedFriend) => selectedFriend._id !== id));
  };

  useEffect(() => {
    async function getMyFriendsList() {
      setLoading(true);
      fetchMyFriendsList()
        .then((response) => {
          setFriendsList(response.data.friends);
        })
        .catch((error) => {
          showErrorToast(error.response?.data.message);
        })
        .finally(() => {
          setLoading(false);
        });
    }
    getMyFriendsList();
  }, []);

  if (loading) {
    return (
      <div className="flex min-w-[450px] items-center justify-center">
        <Loader className="animate-spin" size={18} />
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-2">
      <h2 className="mb-4 text-xl font-bold">Group Chat</h2>
      {directChats.length < 2 ? (
        <p className="flex flex-col text-center text-gray-500">
          <span>🚫 Oops! You need at least 2 friends to start a group chat. 👫👭</span>
          <span>Add more friends and try again! 🎉💬</span>
        </p>
      ) : (
        <>
          {tab === 0 ? (
            <>
              {selectedFriends.length ? (
                <SelectedFriendsList
                  showRemoveBtn
                  friendsList={selectedFriends}
                  handleRemove={handleRemove}
                />
              ) : null}

              {selectedFriends.length ? <hr className="mt-2 border-gray-900/50" /> : null}

              <FriendList friendsList={friendsList} handleSelect={handleSelect} />

              <Button
                className="group relative flex w-fit items-center justify-center rounded-lg border border-primary/50 bg-transparent p-0 px-6 text-white transition-all duration-200 hover:bg-primary/10 active:scale-95"
                onClick={() => {
                  if (selectedFriends.length < 2) {
                    showInfoToast("You need at least 2 friends to create a group chat.");
                  } else {
                    setTab(1);
                  }
                }}
              >
                <span className="relative flex items-center">
                  <span className="text-sm transition-all duration-200 group-hover:pr-5">Next</span>
                  <ArrowRight
                    className="absolute right-0 translate-x-[-10px] opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100"
                    size={20}
                  />
                </span>
              </Button>
            </>
          ) : (
            <>
              <GroupChatForm setTab={setTab} selectedFriends={selectedFriends} />
            </>
          )}
        </>
      )}
    </div>
  );
};

// ---------------------------------- Friend List ----------------------------------
type FriendListProps = {
  friendsList: UserPreview[] | null;
  handleSelect: (friend: UserPreview) => void;
};

const FriendList: React.FC<FriendListProps> = ({ friendsList, handleSelect }) => {
  return (
    <div className="grid w-full grid-cols-3 gap-4 md:grid-cols-6">
      {friendsList?.map((friend) => (
        <div
          key={friend._id}
          className="flex cursor-pointer flex-col items-center gap-2 rounded-lg px-3 py-3 transition-all duration-150 hover:bg-gray-900/10 hover:shadow-md md:flex-row md:gap-4"
          onClick={() => handleSelect(friend)}
        >
          <div className="h-10 w-10 overflow-hidden rounded-lg">
            <img
              className="h-full w-full object-cover"
              src={friend.profilePicture}
              alt={friend.username}
            />
          </div>
          <p className="text-[13.5px] text-gray-300 md:text-base">
            {capitalizeFirstLetter(friend.username)}
          </p>
        </div>
      ))}
    </div>
  );
};

// ---------------------------------- Selected Friends List ----------------------------------
const SelectedFriendsList = ({
  friendsList,
  handleRemove,
  showRemoveBtn,
}: {
  friendsList: UserPreview[];
  handleRemove: (id: string) => void;
  showRemoveBtn?: boolean;
}) => {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 md:gap-4">
      {friendsList?.map((friend) => (
        <div
          key={friend._id}
          className="flex animate-pop-up cursor-pointer items-center justify-between gap-2 rounded-lg border-2 border-primary/10 px-1 py-3 transition-all duration-150 md:px-3"
        >
          <div className="flex gap-3">
            <div className="h-6 w-6 overflow-hidden rounded-lg">
              <img
                className="h-full w-full object-cover"
                src={friend.profilePicture}
                alt={friend.username}
              />
            </div>
            <p className="max-w-7 truncate text-[13.5px] text-base">
              {capitalizeFirstLetter(friend.username)}
            </p>
          </div>

          {showRemoveBtn && (
            <button
              type="button"
              className="rounded-full bg-white p-[0.5px] text-red-600 transition-all hover:bg-gray-200 md:p-1"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove(friend._id);
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

// --------------------------- Group Chat Form ---------------------------
const GroupChatForm = ({
  setTab,
  selectedFriends,
}: {
  setTab: React.Dispatch<React.SetStateAction<number>>;
  selectedFriends: UserPreview[];
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [groupName, setGroupName] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!groupName || !image) {
      showErrorToast("Please enter a group name and select an image.");
      return;
    }
    const data = {
      chatName: groupName,
      participantIds: selectedFriends.map((friend) => friend._id),
      coverImage: image,
    };

    setLoading(true);
    createGroupChat(data)
      .then(() => {
        closeModal();
      })
      .catch((error) => {
        if (error instanceof AxiosError) {
          showErrorToast(error.response?.data.message);
        } else {
          showErrorToast("An unexpected error occurred. Please try again later.");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-6">
      {/* Image Upload Section */}
      <label htmlFor="group-image" className="relative cursor-pointer">
        <input
          ref={fileInputRef}
          id="group-image"
          name="group-image"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
        <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-gray-500 p-2 transition-all hover:border-gray-300">
          {image ? (
            <img
              src={URL.createObjectURL(image)}
              alt="Selected"
              className="h-full w-full rounded-lg object-cover"
            />
          ) : (
            <span className="text-gray-500">Select Image</span>
          )}
        </div>
      </label>

      {/* Remove Image Button */}
      {image && (
        <button
          type="button"
          onClick={removeImage}
          className="flex animate-pop-up items-center gap-2 rounded-lg border border-red-500 px-3 py-1 text-red-500 transition-all hover:bg-red-500 hover:text-white active:scale-95"
        >
          <X size={18} /> Remove Image
        </button>
      )}

      {/* Group Name Input */}
      <Input
        required
        label="Group Name"
        type="text"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        className="w-full"
        // error="Group name is required"
      />

      {/* Selected Friends */}
      <SelectedFriendsList
        friendsList={selectedFriends}
        handleRemove={() => {}}
        showRemoveBtn={false}
      />

      <div className="flex gap-4">
        <Button
          className="group relative flex w-fit items-center justify-center rounded-lg border border-primary/50 bg-transparent p-0 px-6 text-white transition-all duration-200 hover:bg-primary/10 active:scale-95"
          onClick={() => setTab(0)}
        >
          <span className="relative flex items-center">
            <ArrowLeft
              className="absolute left-0 -translate-x-2 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100"
              size={20}
            />
            <span className="text-sm transition-all duration-200 group-hover:pl-5">Back</span>
          </span>
        </Button>
        <Button
          className="group relative flex w-fit items-center justify-center rounded-lg border border-primary/50 bg-transparent p-0 px-6 py-2 text-white transition-all duration-200 hover:bg-primary/20 active:scale-95"
          type="submit"
        >
          <span className="relative flex items-center">
            <span
              className={cn(
                "flex items-center gap-2 transition-all duration-200",
                !loading && "group-hover:pr-5"
              )}
            >
              {loading && <Loader size={18} className="animate-spin" />}
              {loading ? "Creating Group" : "Create Group"}
            </span>
            {!loading && (
              <Check
                className="absolute right-0 translate-x-[-10px] opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100"
                size={20}
              />
            )}
          </span>
        </Button>
      </div>
    </form>
  );
};

export { GroupChat };
