export interface User {
    profileId: number,
    name: string,
}

export interface Comment {
    id: number,
    author: User,
    text: string,
    datetime: string,
    likes: Array<Pick<User, 'profileId'>>,
    dislikes: Array<Pick<User, 'profileId'>>,
    deleted: boolean,
    replies: Comment[]
}
