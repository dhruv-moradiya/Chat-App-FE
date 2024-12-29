import { User } from "@/type";
import { getUsersExcludingFriendsBasedOnQuery } from "@/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Handshake } from "lucide-react";
import useDebounce from "@/hooks/useDebounce";
import { Input } from "@/components/ui/input";
import { memo, useEffect, useState } from "react";
import SearchedUser from "./SearchedUser";

const SearchedUsersList = () => {
  const [query, setQuery] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);

  const debouncedQuery = useDebounce({ query, debounceTime: 1000 });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setQuery(e.target.value);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await getUsersExcludingFriendsBasedOnQuery(
          debouncedQuery
        );
        setUsers(data.statusCode === 200 ? data.data.users : []);
      } catch (error) {
        console.error("Error fetching users:", error);
        setUsers([]);
      }
    };

    if (debouncedQuery) {
      fetchUsers();
    } else {
      setUsers([]);
    }
  }, [debouncedQuery]);

  return (
    <Dialog>
      <DialogTrigger>
        <Handshake />
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
        <div className="w-full mt-4 flex flex-col gap-4">
          {users.length
            ? users.map((user) => (
                <SearchedUser
                  key={user._id}
                  imgSrc={user.profilePicture}
                  name={user.username}
                  _id={user._id}
                />
              ))
            : query && <p>No users found</p>}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default memo(SearchedUsersList);
