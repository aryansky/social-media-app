type voteType = {
    id?: string;
    userId: string;
    postId?: string;
    commentId?: string;
    vote: number;
};

export const voteTally = (votes: voteType[]): { upvotes: number; downvotes: number } => {
    return votes.reduce(
        (totalVotes, vote) => {
            if (vote.vote === 1) {
                return {
                    ...totalVotes,
                    upvotes: totalVotes.upvotes + 1,
                };
            } else if (vote.vote === -1) {
                return {
                    ...totalVotes,
                    downvotes: totalVotes.downvotes - 1,
                };
            } else {
                return totalVotes;
            }
        },
        {
            upvotes: 0,
            downvotes: 0,
        }
    );
};

export const findUserVote = (votes: voteType[], user: Express.User) => {
    return (
        votes.find((vote) => {
            return vote.userId === user.id;
        }) ?? null
    );
};
