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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response: UserProfile[] = await getUsersExcludingFriendsBasedOnQuery(debouncedQuery);
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
    <div className="flex flex-col gap-2">
      <h2 className="mb-4 text-xl font-bold">Search Users</h2>
      <Input className="mb-4 w-full" label="Search" value={query} onChange={handleChange} />
      {!debouncedQuery && (
        <p className="text-center text-gray-500">
          👋 Start searching for friends! Type a name to find and connect with new people. 🔍✨
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
      <div className="flex min-h-20 items-center justify-center text-gray-500">
        <Loader className="animate-spin" size={18} />
        <p className="ml-2 text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <div className="mt-4 flex w-full flex-col gap-4">
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
    <div className="flex w-full items-center justify-between gap-2 md:gap-4">
      {/* Profile Image */}
      <div className="h-8 w-8 flex-shrink-0 overflow-hidden rounded-lg md:h-10 md:w-10">
        <img src={imgSrc} alt={name} />
      </div>

      {/* Username */}
      <p className="flex-1 text-[13.5px] md:min-w-40 md:text-base">{capitalizeFirstLetter(name)}</p>

      {/* Friend Request Button */}
      {requestSent ? (
        <Button
          disabled
          variant="outline"
          className="cursor-not-allowed rounded-lg border-gray-400 p-0 px-3 text-gray-500 md:px-4"
        >
          <Check size={18} /> <span className="hidden md:block">Request Sent</span>
        </Button>
      ) : (
        <Button
          variant="outline"
          className="flex items-center gap-2 rounded-lg border-[1px] p-0 px-3 text-green-600 transition-all duration-150 hover:text-green-700 active:scale-90 md:px-4"
          onClick={sendFriendRequestFun}
          disabled={loading}
        >
          {loading ? <Loader size={18} className="animate-spin" /> : <UserPlus size={18} />}
          <p className="hidden md:block">{loading ? "Sending..." : "Send Request"}</p>
        </Button>
      )}
    </div>
  );
};
