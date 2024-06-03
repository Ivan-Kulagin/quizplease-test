import { Comment } from '../types'

const parseDatetime = (datetime: string) => {
    const [datePart, timePart] = datetime.split(' ');
    const [day, month, year] = datePart.split('.').map(Number);
    const [hours, minutes, seconds] = timePart.split(':').map(Number);
    return new Date(year, month - 1, day, hours, minutes, seconds);
};

const getDiff = (comment: Comment): number => {
    return comment.likes.length - comment.dislikes.length;
};

export const deepSort = (
    comments: Comment[],
    order: 'asc' | 'desc'
): Comment[] => {
    const compare = (a: Comment, b: Comment): number => {
        let comparison = 0;

        const diffA = getDiff(a);
        const diffB = getDiff(b);
        comparison = diffA - diffB;

        return order === 'asc' ? comparison : -comparison;
    };

    const sortedComments = comments
        .slice()
        .sort(compare)
        .map(comment => ({
            ...comment,
            replies: deepSort(comment.replies, order)
        }));

    return sortedComments;
};
