import { 
    useMutation , 
    useQuery, 
    useQueryClient 
} from '@tanstack/react-query'
import { createPost, createUserAccount, deletePost, editPost, getCurrentUser, getPostById, getPostLikes, getUserById, getUserPosts, getUserPostSaves, likePost, loadPosts, removeLikeFromPost, savePost, SignInAccount, signOutAccount, unsavePost } from '../appwrite/api'
import type { INewPost, INewUser, IUpdatePost } from '@/types'
import { QUERY_KEYS } from './queryKeys'

export const useCreateUserAccount = () => {
    return useMutation({
        mutationFn : ( user : INewUser ) => createUserAccount(user)
    })
}

export const useSignInAccount = () => {
    return useMutation({
        mutationFn : ( user : {
            email : string ;
            password : string
        } ) => SignInAccount(user)
    })
}
 
export const useSignOutAccount = () => {
    return useMutation({
        mutationFn : signOutAccount
    })   
}

export const useCreatePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn : ( post : INewPost ) => createPost(post),
        onSuccess : () => queryClient.invalidateQueries({
            queryKey : [QUERY_KEYS.GET_RECENT_POSTS],
        }),
    })
}

export const useGetRecentPosts = () => {
    return useQuery({
        queryKey : [QUERY_KEYS.GET_RECENT_POSTS] ,
        queryFn : loadPosts
    })
}

export const useLikePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn : ( {postId , userId} : {postId : string , userId : string} ) => likePost( postId , userId ),
        onSuccess : (data) => {
            queryClient.invalidateQueries({
                queryKey : [QUERY_KEYS.GET_POST_BY_ID , data?.$id]
            })

            queryClient.invalidateQueries({
                queryKey : [QUERY_KEYS.GET_RECENT_POSTS]
            })

            queryClient.invalidateQueries({
                queryKey : [QUERY_KEYS.GET_POSTS]
            })            
            
            queryClient.invalidateQueries({
                queryKey : [QUERY_KEYS.GET_CURRENT_USER]
            })

        }
    })
}

export const useRemoveLikeFromPost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn : ( likedPostId : string ) => removeLikeFromPost( likedPostId ),
        onSuccess : () => {
            queryClient.invalidateQueries({
                queryKey : [QUERY_KEYS.GET_RECENT_POSTS]
            })

            queryClient.invalidateQueries({
                queryKey : [QUERY_KEYS.GET_POSTS]
            })            
            
            queryClient.invalidateQueries({
                queryKey : [QUERY_KEYS.GET_CURRENT_USER]
            })

        }
    })
}

export const useSavePost = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn : ( {postId , userId} : {postId : string , userId : string} ) => savePost( postId , userId ),
        onSuccess : () => {
            queryClient.invalidateQueries({
                queryKey : [QUERY_KEYS.GET_RECENT_POSTS]
            })

            queryClient.invalidateQueries({
                queryKey : [QUERY_KEYS.GET_POSTS]
            })            
            
            queryClient.invalidateQueries({
                queryKey : [QUERY_KEYS.GET_CURRENT_USER]
            })

        }
    })
}

export const useUnsavePost = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn : ( savedPostId : string ) => unsavePost( savedPostId ),
        onSuccess : () => {
            queryClient.invalidateQueries({
                queryKey : [QUERY_KEYS.GET_RECENT_POSTS]
            })

            queryClient.invalidateQueries({
                queryKey : [QUERY_KEYS.GET_POSTS]
            })            
            
            queryClient.invalidateQueries({
                queryKey : [QUERY_KEYS.GET_CURRENT_USER]
            })

        }
    })
}

export const useGetCurrentUser = () => {
    return useQuery({ 
        queryKey : [QUERY_KEYS.GET_CURRENT_USER],
        queryFn : getCurrentUser
    })
}

export const useGetPostLikes = ( postId : string ) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_POST_LIKES , postId],
        queryFn: () => getPostLikes(postId),
        enabled: !!postId
    });
}

export const useGetUserPostSaves = ( userId : string ) => {
    return useQuery({
        queryKey : [QUERY_KEYS.GET_USER_POST_SAVES , userId] ,
        queryFn : () => getUserPostSaves(userId) , 
        enabled : !!userId 
    })
}

export const useGetPostById = ( postId : string ) => {
    return useQuery({
        queryKey : [QUERY_KEYS.GET_POST_BY_ID,postId],
        queryFn : () => getPostById(postId),
        enabled : !!postId ,
    })
}

export const useUpdatePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn : ( post : IUpdatePost ) => editPost(post),
        onSuccess : ( data ) => {
            queryClient.invalidateQueries({
                queryKey : [QUERY_KEYS.GET_POST_BY_ID , data?.$id],
            })
        }
    })
}

export const useDeletePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn : ( {postId , imageId} : {postId : string , imageId : string} ) => deletePost(postId,imageId),
        onSuccess : () => {
            queryClient.invalidateQueries({
                queryKey : [QUERY_KEYS.GET_RECENT_POSTS],
            })
        }
    })
}

export const useGetUser = (userId : string) => {
    return useQuery({
        queryKey : [QUERY_KEYS.GET_USER_BY_ID,userId],
        queryFn : () => getUserById(userId),
        enabled : !!userId,
    })
}

export const useGetUserPosts = (userId : string) => {
    return useQuery({
        queryKey : [QUERY_KEYS.GET_USER_POSTS,userId],
        queryFn : () => getUserPosts(userId),
        enabled : !!userId
    })
}