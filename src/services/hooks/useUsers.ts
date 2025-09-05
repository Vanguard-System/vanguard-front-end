import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../users";


export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });
}
