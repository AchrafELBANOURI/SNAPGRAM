import { useGetCurrentUser, useGetPostLikes, useGetUserPostSaves, useLikePost, useRemoveLikeFromPost, useSavePost, useUnsavePost } from '@/lib/react-query/queriesAndMutations';
import type { Models } from 'appwrite'
import { Loader } from 'lucide-react';
import React, { useEffect, useState } from 'react'


type PostStatsProps = {
    post : Models.DefaultDocument ;
    userId : string ;
}

const PostStats = ( { post , userId } : PostStatsProps) => {
    // States
    const [ isLiked , setIsLiked ] = useState<boolean>(false);
    const [ isSaved , setIsSaved ] = useState<boolean>(false);
    const [ likesCount , setLikesCount ] = useState<number>(0);

    const [ isProcessingLike , setIsProcessingLike ] = useState<boolean>(false);

    // Mutations
    const { mutate : likePost , isPending : isLikingPost } = useLikePost();
    const { mutate : removeLikeFromPost , isPending : isUnlikingPost } = useRemoveLikeFromPost();
    const { mutate : savePost , isPending : isSavingPost } = useSavePost();
    const { mutate : unsavePost , isPending : isUnsavingPost } = useUnsavePost();
    
    // Queries
    const { data : postLikes , refetch : refetchGetPostLikes } = useGetPostLikes( post.$id );
    const { data : userPostSaves , refetch : refetchGetUserPostSaves } = useGetUserPostSaves( userId );

    // Handle Like Click A Post
    const handleLikePost = async ( e : React.MouseEvent ) => {
        e.stopPropagation();

        if(isLikingPost || isUnlikingPost || isProcessingLike) return ;

        setIsProcessingLike(true);
        
        try {
            const result = await refetchGetPostLikes();
            
            const likedPostByUser = result.data?.find(
                (record: Models.DefaultDocument) => record.user === userId
            );

            if (likedPostByUser) {
                // Unlike - we already know the document ID
                setIsLiked(false);
                removeLikeFromPost(likedPostByUser.$id);
                setLikesCount(prev => Math.max(0, prev - 1));
                
                refetchGetPostLikes();
            } else {
                // Like - create new like document
                likePost(
                    { postId: post.$id, userId: userId },
                    {
                        onSuccess : () => {
                            refetchGetPostLikes();
                        }
                    }
                );
                setLikesCount(prev => prev + 1);
                setIsLiked(true);
            }
        } catch(error) {
            console.error("Error handling like operation : ",error);
        } finally {
            // prevent rapid clicks ( multiple request )
            setTimeout(() => {
                setIsProcessingLike(false);
            },1000);
        }
    }

    // Handle Save Click A Post
    const handleSavePost = async (e : React.MouseEvent) => {
        e.stopPropagation();

        if(isSavingPost || isUnsavingPost ) return ;

        try {
            const result = await refetchGetUserPostSaves();
            
            const savedPosts = result.data?.find(
                (record : Models.DefaultDocument) => record.post === post.$id 
            );

            if(savedPosts){
                setIsSaved(false);
                unsavePost(savedPosts.$id);

                refetchGetUserPostSaves();
            } else {
                savePost(
                    { postId : post.$id , userId : userId },
                    {
                        onSuccess : () => {
                            refetchGetUserPostSaves();
                        }
                    }
                );
                setIsSaved(true);
            }
        } catch (error) {
            console.error("Error handling save operation : ",error);
        }

    }

    
    // Check liked status
    useEffect(() => {
        if(postLikes) {
            setLikesCount(postLikes.length);

            const userHasLiked = postLikes.some(
                (record: Models.DefaultDocument) => record.user === userId
            );

            setIsLiked(!!userHasLiked);
        }
    }, [postLikes,userId]);

    // Check saved status
    useEffect(() => {
        if (userPostSaves) {
            const userHasSaved = userPostSaves?.some(
                (record: Models.DefaultDocument) => record.post === post.$id
            );
            
            setIsSaved(!!userHasSaved);
        }
    }, [userPostSaves,post.$id]);

  return (
    <div className='flex justify-between items-center z-20'>
        <div className='flex gap-3 mr-5'>
            { isLikingPost || isUnlikingPost ? <Loader /> : <img 
                src={
                    isLiked ? 
                    "/assets/icons/liked.svg" : 
                    "/assets/icons/like.svg"
                }
                alt="like"
                width={20}
                height={20}
                onClick={handleLikePost}
                className='cursor-pointer'
            />}
            <p className='small-medium lg:base-medium'>{likesCount}</p>
        </div>

        <div className='flex gap-2'>
            { isSavingPost || isUnsavingPost ? <Loader /> :  <img 
                src={
                    isSaved ? 
                    "/assets/icons/saved.svg" : 
                    "/assets/icons/save.svg"
                }
                alt="like"
                width={20}
                height={20}
                onClick={handleSavePost}
                className='cursor-pointer'
            />
            }
        </div>
    </div>
  )
}

export default PostStats
