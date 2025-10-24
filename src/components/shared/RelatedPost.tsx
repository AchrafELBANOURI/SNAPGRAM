import type { Models } from 'appwrite'
import { Link } from 'react-router-dom'
import PostStats from './PostStats'
import { useGetUser } from '@/lib/react-query/queriesAndMutations'
import { useUserContext } from '@/context/AuthContext'

type RelatedPostProps = {
    post : Models.DefaultDocument ,
    showUser : boolean ,
    showStats : boolean ,
}

const RelatedPost = ( { post , showUser=true , showStats=true } : RelatedPostProps ) => {
    const { data : postOwner } = useGetUser(post?.creator);
    const { user } = useUserContext();

  return (
        <li key={post.$id} className="relative min-w-80 h-80">
          <Link to={`/posts/${post.$id}`} className="grid-post_link">
            <img
              src={post.imageUrl}
              alt="post"
              className="h-full w-full object-cover"
            />
          </Link>

          <div className="grid-post_user">
            {showUser && (
              <div className="flex items-center justify-start gap-2 flex-1">
                <img
                  src={
                    postOwner?.imageUrl ||
                    "/assets/icons/profile-placeholder.svg"
                  }
                  alt="creator"
                  className="w-8 h-8 rounded-full"
                />
                <p className="line-clamp-1">{postOwner?.name}</p>
              </div>
            )}
            {showStats && <PostStats post={post} userId={user.id} />}
          </div>
        </li>
  )
}

export default RelatedPost
