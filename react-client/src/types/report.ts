export type Report = {
    id: number;
    reporterId: string;
    reporter: { displayName: string };
    reportedUserId: string;
    reportedUser: { displayName: string };
    reason: number;
    description?: string;
    status: string;
    createdAt: string;
};

export const ReasonLabels: { [key: number]: string } = {
    0: 'Spam',
    1: 'Harassment',
    2: 'Inappropriate Content',
    3: 'Fake Profile',
    4: 'Other'
};