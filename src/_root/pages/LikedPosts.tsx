import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";
import { useGetCurrentUser, useGetUserLikedPosts } from "@/lib/react-query/queriesAndMutations";

const LikedPosts = () => {
  const { data: currentUser } = useGetCurrentUser();
  const { data: likedPostByUser } = useGetUserLikedPosts(currentUser?.$id || '');

  console.log(likedPostByUser);

  if (!currentUser)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );

  return (
    <>
      {likedPostByUser?.length === 0 && (
        <p className="text-light-4">No liked posts</p>
      )}

      <GridPostList posts={likedPostByUser} showStats={false} />
    </>
  );
};

export default LikedPosts;