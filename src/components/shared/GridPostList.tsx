import type { Models } from "appwrite";
import RelatedPost from "./RelatedPost";

type GridPostListProps = {
  posts: Models.DefaultDocument[] ;
  showUser?: boolean;
  showStats?: boolean;
};

const GridPostList = ({
  posts,
  showUser = true,
  showStats = true,
}: GridPostListProps) => {

  return (
    <ul className="grid-container">
      {posts.map((post : Models.DefaultDocument) => (
        <RelatedPost 
          post={post} 
          showUser={showUser} 
          showStats={showStats} 
        />
      ))}
    </ul>
  );
};

export default GridPostList;