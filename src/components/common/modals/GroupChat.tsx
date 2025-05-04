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
      <div className="flex min-w-[500px] items-center justify-center">
        <Loader className="animate-spin" size={18} />
      </div>
    );
  }

  return (
    <div className="flex w-[500px] flex-col gap-2">
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
              {selectedFriends.length ? <hr className="mt-2 border-gray-900/50" /> : null}

              <FriendList
                friendsList={friendsList}
                selectedFriends={selectedFriends}
                handleSelect={handleSelect}
                handleRemove={handleRemove}
              />

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
  selectedFriends: UserPreview[];
  friendsList: UserPreview[] | null;
  handleSelect: (friend: UserPreview) => void;
  handleRemove: (id: string) => void;
};

const FriendList: React.FC<FriendListProps> = ({
  friendsList,
  selectedFriends,
  handleSelect,
  handleRemove,
}) => {
  console.log("selectedFriends :>> ", selectedFriends);
  return (
    <div className="grid min-w-96 grid-cols-[repeat(auto-fit,_minmax(150px,_1fr))] gap-4">
      {friendsList?.map((friend) => {
        const isSelected = selectedFriends.find((selected) => selected._id === friend._id);
        return (
          <div
            key={friend._id}
            className={cn(
              "flex w-full cursor-pointer flex-col items-center gap-2 rounded-xl border-2 px-4 py-3 transition-all duration-300 ease-in-out md:flex-row md:gap-4",
              isSelected
                ? "border-primary bg-primary/10 shadow-[0_0_0_3px] shadow-primary/20"
                : "border-zinc-200 hover:border-primary/50 hover:bg-zinc-100 hover:shadow-md dark:border-zinc-700 dark:hover:border-primary/30 dark:hover:bg-zinc-800/40"
            )}
            onClick={() => (isSelected ? handleRemove(friend._id) : handleSelect(friend))}
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
        );
      })}
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
    <form onSubmit={handleSubmit} className="flex w-full flex-col items-center gap-6">
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

      <div className="flex w-full flex-wrap items-center justify-center gap-2">
        {selectedFriends.length > 0 &&
          selectedFriends.map((friend) => (
            <div
              key={friend._id}
              className="rounded-lgp-2 flex w-24 flex-col items-center justify-between gap-2 text-center shadow-sm transition-all duration-200"
            >
              <div className="size-14 overflow-hidden rounded-lg">
                <img
                  src={friend.profilePicture}
                  alt={friend.username}
                  className="h-full w-full object-cover"
                />
              </div>
              <p className="w-full truncate text-sm font-medium text-zinc-200">{friend.username}</p>
            </div>
          ))}
      </div>

      <div>
        <p className="text-sm text-gray-500">
          You can add more friends to the group later.{" "}
          <span className="font-semibold">Max: 10 members</span>
        </p>
      </div>

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
