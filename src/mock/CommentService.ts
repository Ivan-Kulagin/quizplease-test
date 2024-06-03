import { Comment } from '../types'

export const fetchComments = async (): Promise<Comment[]> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const comments: Comment[] = [{
                id: 1,
                author: {
                    profileId: 1,
                    name: 'QuizPlease'
                },
                datetime: '01.06.2024 21:25:21',
                deleted: false,
                likes: [2,3,4,5,6],
                dislikes: [1,7,8,9],
                replies: [
                    {
                        id: 2,
                        author: {
                            profileId: 1,
                            name: 'QuizPlease'
                        },
                        datetime: '01.06.2024 21:28:00',
                        deleted: false,
                        likes: [10,22,111,8,1],
                        dislikes: [0,21,31],
                        replies: [
                            {
                                id: 3,
                                deleted: false,
                                author: {
                                    profileId: 2,
                                    name: 'Vasiliy'
                                },
                                datetime: '01.06.2024 21:25:21',
                                likes: [1,4,7,8],
                                dislikes: [20,11,22,10],
                                replies: [],
                                text: 'Ответ на ответ'
                            },
                            {
                                id: 4,
                                deleted: false,
                                author: {
                                    profileId: 2,
                                    name: 'Vasiliy'
                                },
                                datetime: '01.06.2024 21:25:21',
                                likes: [5,76,71],
                                dislikes: [20],
                                replies: [],
                                text: '"At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis pr' +
                                    'aesentium voluptatum deleniti atque corrupti quos dolores et quas molestias exc' +
                                    'epturi sint occaecati cupiditate non provident, similique sunt in culpa qui off' +
                                    'icia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem r' +
                                    'erum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis e' +
                                    'st eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere ' +
                                    'possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus aut' +
                                    'em quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut ' +
                                    'et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum ' +
                                    'hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias c' +
                                    'onsequatur aut perferendis doloribus asperiores repellat."'
                            }
                        ],
                        text: 'Текст ответа'
                    }
                ],
                text: 'Текст комментария'
            }]
            resolve(comments)
        }, 200)
    })
}
