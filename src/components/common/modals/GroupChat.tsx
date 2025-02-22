import React, { useEffect, useRef, useState } from "react";
import { AxiosError } from "axios";
import { useAppSelector } from "@/store/store";
import { capitalizeFirstLetter, cn } from "@/lib/utils";
import { UserPreview } from "@/types/ApiResponse.types";
import { createGroupChat, fetchMyFriendsList } from "@/api";
import { ArrowLeft, ArrowRight, Check, Loader, X } from "lucide-react";
import {
  showErrorToast,
  showInfoToast,
} from "@/components/common/ToastProvider";
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
    setSelectedFriends((prev) =>
      prev.filter((selectedFriend) => selectedFriend._id !== id)
    );
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
      <div className="min-w-[450px] flex justify-center items-center">
        <Loader className="animate-spin" size={18} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 min-w-[450px]">
      <h2 className="text-xl font-bold mb-4">Group Chat</h2>
      {directChats.length < 2 ? (
        <p className="text-gray-500 text-center flex flex-col">
          <span>
            🚫 Oops! You need at least 2 friends to start a group chat. 👫👭
          </span>
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

              {selectedFriends.length ? (
                <hr className="border-gray-900/50 mt-2" />
              ) : null}

              <FriendList
                friendsList={friendsList}
                handleSelect={handleSelect}
              />

              <Button
                className="p-0 px-6 transition-all duration-200 bg-transparent border border-primary/50 hover:bg-primary/10 text-white w-fit rounded-lg flex items-center justify-center relative group active:scale-95"
                onClick={() => {
                  if (selectedFriends.length < 2) {
                    showInfoToast(
                      "You need at least 2 friends to create a group chat."
                    );
                  } else {
                    setTab(1);
                  }
                }}
              >
                <span className="relative flex items-center">
                  <span className="transition-all duration-200 group-hover:pr-5 text-sm">
                    Next
                  </span>
                  <ArrowRight
                    className="absolute right-0 opacity-0 translate-x-[-10px] transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0"
                    size={20}
                  />
                </span>
              </Button>
            </>
          ) : (
            <>
              <GroupChatForm
                setTab={setTab}
                selectedFriends={selectedFriends}
              />
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

const FriendList: React.FC<FriendListProps> = ({
  friendsList,
  handleSelect,
}) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {friendsList?.map((friend) => (
        <div
          key={friend._id}
          className="flex items-center gap-4 px-3 py-3 rounded-lg cursor-pointer transition-all duration-150 hover:bg-gray-900/10 hover:shadow-md"
          onClick={() => handleSelect(friend)}
        >
          <div className="w-10 h-10 rounded-lg overflow-hidden">
            <img
              className="w-full h-full object-cover"
              src={friend.profilePicture}
              alt={friend.username}
            />
          </div>
          <p className="text-gray-300">
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
    <div className="grid grid-cols-4 gap-4">
      {friendsList?.map((friend) => (
        <div
          key={friend._id}
          className="flex items-center justify-between gap-2 px-3 py-3 rounded-lg cursor-pointer transition-all duration-150  border-2 border-primary/10 animate-pop-up"
        >
          <div className="flex gap-3">
            <div className="w-6 h-6 rounded-lg overflow-hidden">
              <img
                className="w-full h-full object-cover"
                src={friend.profilePicture}
                alt={friend.username}
              />
            </div>
            <p>{capitalizeFirstLetter(friend.username)}</p>
          </div>

          {showRemoveBtn && (
            <button
              type="button"
              className="p-1 rounded-full bg-white text-red-600 hover:bg-gray-200 transition-all"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove(friend._id);
              }}
            >
              <X size={16} />
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
          showErrorToast(
            "An unexpected error occurred. Please try again later."
          );
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
        <div className="w-28 h-28 rounded-xl p-2 overflow-hidden border-2 border-dashed border-gray-500 flex items-center justify-center transition-all hover:border-gray-300">
          {image ? (
            <img
              src={URL.createObjectURL(image)}
              alt="Selected"
              className="w-full h-full object-cover rounded-lg"
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
          className="animate-pop-up flex items-center gap-2 text-red-500 border border-red-500 px-3 py-1 rounded-lg transition-all hover:bg-red-500 hover:text-white active:scale-95"
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
          className="p-0 px-6 transition-all duration-200 bg-transparent border border-primary/50 hover:bg-primary/10 text-white w-fit rounded-lg flex items-center justify-center relative group active:scale-95"
          onClick={() => setTab(0)}
        >
          <span className="relative flex items-center">
            <ArrowLeft
              className="absolute left-0 opacity-0 -translate-x-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0"
              size={20}
            />
            <span className="transition-all duration-200 group-hover:pl-5 text-sm">
              Back
            </span>
          </span>
        </Button>
        <Button
          className="p-0 px-6 py-2 transition-all duration-200 bg-transparent border border-primary/50 hover:bg-primary/20 text-white w-fit rounded-lg flex items-center justify-center relative group active:scale-95"
          type="submit"
        >
          <span className="relative flex items-center">
            <span
              className={cn(
                "transition-all duration-200 flex items-center gap-2",
                !loading && "group-hover:pr-5"
              )}
            >
              {loading && <Loader size={18} className="animate-spin" />}
              {loading ? "Creating Group" : "Create Group"}
            </span>
            {!loading && (
              <Check
                className="absolute right-0 opacity-0 translate-x-[-10px] transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0"
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
