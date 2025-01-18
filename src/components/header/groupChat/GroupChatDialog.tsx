import React, { useEffect, useState } from "react";
import { User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createGroupChat, fetchMyFriendsList } from "@/api";
import { UserProfile } from "@/types/ApiResponse.types";
import { capitalizeFirstLetter } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type Friend = Omit<
  UserProfile,
  "friends" | "mutedChats" | "createdAt" | "updatedAt"
>;

const GroupChatDialog = () => {
  const [tab, setTab] = useState(0);
  const [friendsList, setFriendsList] = useState<Friend[] | null>(null);
  const [selectedFriends, setSelectedFriends] = useState<Friend[]>([]);
  const [removing, setRemoving] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    async function getMyFriendsList() {
      const response = await fetchMyFriendsList();
      setFriendsList(response.data.friends);
    }
    getMyFriendsList();
  }, []);

  const handleSelect = (friend: Friend) => {
    if (!selectedFriends.find((selected) => selected._id === friend._id)) {
      setSelectedFriends([...selectedFriends, friend]);
    }
  };

  const handleRemove = (id: string) => {
    setRemoving((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setRemoving((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
      setSelectedFriends((prev) =>
        prev.filter((selectedFriend) => selectedFriend._id !== id)
      );
    }, 400);
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <User size={24} />
        </DialogTrigger>
        <DialogContent className="scrollbar max-h-[90vh] overflow-y-scroll">
          <DialogHeader>
            <DialogTitle>Create group chat</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>

          {tab === 0 && (
            <SelectedFriends
              selectedFriends={selectedFriends}
              removing={removing}
              handleRemove={handleRemove}
            />
          )}

          <div className="w-full border border-zinc-700" />

          {tab === 0 && (
            <FriendList friendsList={friendsList} handleSelect={handleSelect} />
          )}
          {tab === 1 && (
            <GroupChatForm
              selectedFriends={selectedFriends}
              removing={removing}
              handleRemove={handleRemove}
            />
          )}

          {tab === 0 && (
            <Button onClick={() => setTab(1)} className="w-fit">
              Next
            </Button>
          )}
          {tab === 1 && (
            <Button onClick={() => setTab(0)} className="w-fit">
              Prev
            </Button>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GroupChatDialog;

type FriendListProps = {
  friendsList: Friend[] | null;
  handleSelect: (friend: Friend) => void;
};

const FriendList: React.FC<FriendListProps> = ({
  friendsList,
  handleSelect,
}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {friendsList?.map((friend) => (
        <div
          key={friend._id}
          className="flex items-center gap-4 hover:bg-primary-foreground/50 duration-150 px-1 py-3 rounded-lg cursor-pointer"
          onClick={() => handleSelect(friend)}
        >
          <div className="w-12 h-12 rounded-lg overflow-hidden">
            <img
              className="w-full h-full object-cover"
              src={friend.profilePicture}
              alt={friend.username}
            />
          </div>
          <p>{capitalizeFirstLetter(friend.username)}</p>
        </div>
      ))}
    </div>
  );
};

type SelectedFriendsProps = {
  selectedFriends: Friend[];
  removing: { [key: string]: boolean };
  handleRemove: (id: string) => void;
};

const SelectedFriends: React.FC<SelectedFriendsProps> = ({
  selectedFriends,
  removing,
  handleRemove,
}) => {
  return (
    <div className="flex items-center flex-wrap gap-8">
      {selectedFriends?.map((friend) => (
        <div
          key={friend._id}
          className={`relative flex flex-col items-center ${
            removing[friend._id] ? "animate-fade-out" : "animate-pop-up"
          }`}
        >
          <div className="w-12 h-12 rounded-lg overflow-hidden">
            <img
              className="w-full h-full object-cover"
              src={friend.profilePicture}
              alt={friend.username}
            />
          </div>
          <p>{capitalizeFirstLetter(friend.username)}</p>
          <button
            className="absolute -top-3 -right-2"
            onClick={() => handleRemove(friend._id)}
          >
            X
          </button>
        </div>
      ))}
    </div>
  );
};

type GroupChatFormProps = {
  selectedFriends: Friend[];
  removing: { [key: string]: boolean };
  handleRemove: (id: string) => void;
};

const GroupChatForm: React.FC<GroupChatFormProps> = ({
  selectedFriends,
  removing,
  handleRemove,
}) => {
  const [image, setImage] = useState<File | null>(null);
  const [groupName, setGroupName] = useState("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImage(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!groupName || !image) {
      // alert("Please provide all the required fields.");

      return;
    }
    const data = {
      chatName: groupName,
      participantIds: selectedFriends.map((friend) => friend._id),
      coverImage: image,
    };

    const response = await createGroupChat(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Image Input */}
      <div className="flex flex-col items-center">
        <label htmlFor="group-image" className="relative">
          <input
            id="group-image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-dashed border-gray-500 cursor-pointer">
            {image ? (
              <img
                src={URL.createObjectURL(image)}
                alt="Selected"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                Select Image
              </div>
            )}
          </div>
        </label>
      </div>

      {/* Name Input */}
      <div>
        <label htmlFor="group-name" className="block text-sm font-medium mb-1">
          Group Name
        </label>
        <input
          id="group-name"
          type="text"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="Enter group name"
          className="w-full border border-gray-800 bg-gray-900 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-primary focus:border-primary"
        />
      </div>

      {/* Selected Friends */}
      <SelectedFriends
        selectedFriends={selectedFriends}
        removing={removing}
        handleRemove={handleRemove}
      />

      {/* Submit Button */}
      <div className="flex justify-center">
        <button
          type="submit"
          className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark focus:outline-none"
        >
          Create Group
        </button>
      </div>
    </form>
  );
};
