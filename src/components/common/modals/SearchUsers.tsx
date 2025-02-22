import { getUsersExcludingFriendsBasedOnQuery, sendFriendRequest } from "@/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useDebounce from "@/hooks/useDebounce";
import { capitalizeFirstLetter } from "@/lib/utils";
import { UserProfile } from "@/types/ApiResponse.types";
import { AxiosError } from "axios";
import { Check, Loader, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { showErrorToast } from "../ToastProvider";

const SearchUsers = () => {
  const [query, setQuery] = useState<string>("");
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const debouncedQuery = useDebounce({ query, debounceTime: 1000 });

  const handleError = (error: unknown) => {
    if (error instanceof AxiosError) {
      showErrorToast(error.response?.data.message);
    } else {
      showErrorToast("An unexpected error occurred. Please try again later.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setQuery(e.target.value);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response: UserProfile[] =
        await getUsersExcludingFriendsBasedOnQuery(debouncedQuery);
      setUsers(response);
    } catch (error) {
      handleError(error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (debouncedQuery) {
      fetchUsers();
    } else {
      setUsers([]);
    }
  }, [debouncedQuery]);

  return (
    <div className="flex flex-col gap-2 w-96">
      <h2 className="text-xl font-bold mb-4">Search Users</h2>
      <Input
        className="w-full mb-4"
        label="Search"
        value={query}
        onChange={handleChange}
      />
      {!debouncedQuery && (
        <p className="text-gray-500 text-center">
          👋 Start searching for friends! Type a name to find and connect with
          new people. 🔍✨
        </p>
      )}

      <UserList users={users} loading={loading} query={query} />
    </div>
  );
};

export { SearchUsers };

const UserList = ({
  users,
  loading,
}: {
  users: UserProfile[];
  loading: boolean;
  query: string;
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-20 text-gray-500">
        <Loader className="animate-spin" size={18} />
        <p className="ml-2 text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <div className="w-full mt-4 flex flex-col gap-4">
      {users.map((user) => (
        <SearchedUser
          key={user._id}
          imgSrc={user.profilePicture}
          name={user.username}
          _id={user._id}
        />
      ))}
    </div>
  );
};

type SearchedUserProps = {
  imgSrc: string;
  name: string;
  _id: string;
};

const SearchedUser = ({ imgSrc, name, _id }: SearchedUserProps) => {
  const [requestSent, setRequestSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const sendFriendRequestFun = async () => {
    setLoading(true);
    try {
      await sendFriendRequest(_id);
      setRequestSent(true);
    } catch (error) {
      if (error instanceof AxiosError) {
        showErrorToast(error.response?.data.message);
      } else {
        showErrorToast("An unexpected error occurred. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex items-center justify-between gap-4">
      {/* Profile Image */}
      <div className="w-10 h-10 rounded-lg overflow-hidden">
        <img src={imgSrc} alt={name} />
      </div>

      {/* Username */}
      <p className="min-w-40">{capitalizeFirstLetter(name)}</p>

      {/* Friend Request Button */}
      {requestSent ? (
        <Button
          disabled
          variant="outline"
          className="p-0 px-4 text-gray-500 border-gray-400 cursor-not-allowed rounded-lg"
        >
          <Check size={18} /> Request Sent
        </Button>
      ) : (
        <Button
          variant="outline"
          className="p-0 px-4 flex items-center gap-2 text-green-600 border-green-500 hover:border-green-600 hover:text-green-700 rounded-lg transition-all duration-150 active:scale-90"
          onClick={sendFriendRequestFun}
          disabled={loading}
        >
          {loading ? (
            <Loader size={18} className="animate-spin" />
          ) : (
            <UserPlus size={18} />
          )}
          {loading ? "Sending..." : "Send Request"}
        </Button>
      )}
    </div>
  );
};
