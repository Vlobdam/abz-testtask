import { User } from "@/types/User";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { BASE_USERS_URL } from "@/consts";

export const useUsersLoader = () => {
  const [totalPages, setTotalPages] = useState(-1);
  const [currentPage, setCurrentPage] = useState(0);
  const [nextLink, setNextLink] = useState<string>(`${BASE_USERS_URL}?page=1&count=6`);
  const [currentUsers, setCurrentUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(false);

  const loadUsers = useCallback(async (url: string) => {
    setIsLoading(true);

    const resp = await axios.get(url);
    
    const {
      users: newUsers,
      links,
      total_pages,
      page,
    } = resp.data;
    
    setIsLoading(false);
    setTotalPages(total_pages);
    setCurrentPage(page);
    setNextLink(links.next_url);

    return newUsers;
  }, [])

  const loadNext =  useCallback(async () => {
    const newUsers =  await loadUsers(nextLink);

    setCurrentUsers((curUsers) => [...curUsers, ...newUsers])
  }, [nextLink, loadUsers])

  const loadFirstPage = useCallback(async () => {
    const newUsers = await loadUsers(`${BASE_USERS_URL}?page=1&count=6`)
    setCurrentUsers(newUsers)
  }, [loadUsers])

  useEffect(() => {
    if (currentPage === 0) {
      loadFirstPage();
    }
  }, [loadFirstPage, currentPage])
  
  return {
    currentUsers,
    currentPage,
    isLoading,
    totalPages,
    loadNext,
    loadFirstPage,
  }
}