import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";
import { useGetCurrentUser, useGetUserPostSaves } from "@/lib/react-query/queriesAndMutations";

export const Saved = () => {
  const { data : user } = useGetCurrentUser();
  const { data : savedPosts } = useGetUserPostSaves(user?.$id || '');
  
  return (
    <div className="saved-container">
      <div className="flex gap-2 w-full items-center max-w-5xl">
        <div className="flex gap-2 w-full">
          <img
            src="/assets/icons/save.svg"
            width={36}
            height={36}
            alt="edit"
            className="invert-white"
          />
          <h2 className="h3-bold md:h2-bold text-left w-full">Saved Posts</h2>
        </div>

        <span className="text-primary-500 body-bold">{savedPosts?.length}</span>

      </div>

      {!user ? (
        <Loader />
      ) : (
        <ul className="w-full flex justify-center max-w-5xl gap-9">
          {savedPosts?.length === 0 ? (
            <p className="text-light-4">No available posts</p>
          ) : (
            <GridPostList posts={savedPosts?.reverse()} showStats={false} />
          )}
        </ul>
      )}
    </div>
  );
};

export default Saved;