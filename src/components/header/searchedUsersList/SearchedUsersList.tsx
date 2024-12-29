import { memo, useEffect, useState } from "react";
import { AxiosError } from "axios";
import { UserProfile } from "@/types/ApiResponse.types";
import { getUsersExcludingFriendsBasedOnQuery } from "@/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, Loader } from "lucide-react";
import SearchedUser from "./SearchedUser";
import useDebounce from "@/hooks/useDebounce";

const SearchedUsersList = () => {
  const [query, setQuery] = useState<string>("");
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const debouncedQuery = useDebounce({ query, debounceTime: 1000 });

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setQuery(e.target.value);

  // Fetch users based on query
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

  // Handle errors
  const handleError = (error: unknown) => {
    if (error instanceof AxiosError) {
      console.error("Error during API call:", error.response?.data.message);
    } else {
      console.error("Unexpected error:", error);
    }
  };

  // Effect to trigger user fetching when the query changes
  useEffect(() => {
    if (debouncedQuery) {
      fetchUsers();
    } else {
      setUsers([]);
    }
  }, [debouncedQuery]);

  return (
    <Dialog>
      <DialogTrigger>
        <Search size={24} />
      </DialogTrigger>
      <DialogContent className="w-[400px]">
        <DialogHeader>
          <DialogTitle>Search Users</DialogTitle>
        </DialogHeader>
        <Input
          className="w-full"
          value={query}
          onChange={handleChange}
          placeholder="Search for users..."
        />
        <UserList users={users} loading={loading} query={query} />
      </DialogContent>
    </Dialog>
  );
};

// Component to render the list of users or loading/error states
const UserList = ({
  users,
  loading,
  query,
}: {
  users: UserProfile[];
  loading: boolean;
  query: string;
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <Loader className="animate-spin" size={24} />
        <p className="ml-2">Loading...</p>
      </div>
    );
  }

  if (users.length) {
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
  }

  return query ? <p>No users found</p> : null;
};

export default memo(SearchedUsersList);
