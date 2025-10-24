import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";
import { useGetCurrentUser, useGetUserPostSaves } from "@/lib/react-query/queriesAndMutations";

export const SavedPosts = () => {
  const { data: currentUser } = useGetCurrentUser();
  const { data: savedPostsByUser } = useGetUserPostSaves(currentUser?.$id || '');

  console.log(savedPostsByUser);

  if (!currentUser)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );

  return (
    <>
      {savedPostsByUser?.length === 0 && (
        <p className="text-light-4">No saved posts</p>
      )}

      <GridPostList posts={savedPostsByUser} showStats={false} />
    </>
  );
};

export default SavedPosts;