import Loader from "@/components/shared/Loader";
import UserCard from "@/components/shared/UserCard";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import useDebounce from "@/hooks/useDebounce";
import { useGetUsers, useSearchUser } from "@/lib/react-query/queriesAndMutations";
import type { Models } from "appwrite";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

export const AllUsers = () => {
  const { toast } = useToast();
  const { ref , inView } = useInView();
  const [ searchValue , setSearchValue ] = useState('');
  const debouncedValue = useDebounce(searchValue,500);

  // Add a separate query for all users when no search term
  const {
    data: allUsers, 
    fetchNextPage , 
    hasNextPage , 
    isPending : isLoadingUsers 
  } = useGetUsers();

  // Only enable search when there's a value
  const { 
    data: searchResults, 
    isLoading: isSearching,
    isError: isErrorCreators 
  } = useSearchUser(debouncedValue);

  // Decide which data to display based on search state
  const isLoading = debouncedValue ? isSearching : isLoadingUsers;

  // Handle errors properly
  useEffect(() => {
    if(isErrorCreators){
      toast({ 
        title: "Search Error", 
        description: "There was an issue with the search. Please try again later." 
      });
    }
  }, [isErrorCreators , toast]);

  useEffect(() => {
    if(inView && !searchValue) fetchNextPage();
  },[inView , searchValue])

  return (
    <div className="common-container">
      <div className="user-container">
        <h2 className="h3-bold md:h2-bold text-left w-full">Search Users</h2>
        <div className='explore-inner_container'>
          <div className='flex gap-1 px-4 w-full rounded-lg bg-dark-4'>
            <img 
              src="/assets/icons/search.svg"
              alt="Search"
              width={24}
              height={24} 
            />
            <Input
              type='text'
              placeholder='Search'
              className='explore-search'
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
        </div>
      </div>
        {isLoading ? (
          <Loader />
        ) : (
          <ul className="user-grid">
            {
              debouncedValue ? 
              searchResults?.map((creator : Models.DefaultDocument) => (
                <li key={creator?.$id} className="flex-1 min-w-[200px] w-full  ">
                  <UserCard user={creator} />
                </li>
              )) : 
              allUsers?.pages.flatMap((page) => 
                page?.documents?.map((user: Models.DefaultDocument) => (
                  <li key={user?.$id} className="flex-1 min-w-[200px] w-full  ">
                    <UserCard user={user} />
                  </li>
                )) || []
              )
            }
          </ul>
        )}
      </div>

      {hasNextPage && !searchValue && (
        <div ref={ref} className='mt-10'>
          <Loader />
        </div>
      )}
    </div>
  );
};

export default AllUsers;