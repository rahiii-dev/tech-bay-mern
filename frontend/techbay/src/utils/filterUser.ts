import { User } from "../features/auth/authTypes";

export const filterUsers = (users: User[], filter: string): User[] => {
    switch (filter) {
        case 'blocked':
            return users.filter((user) => user.isBlocked);
        default:
            return users;
    }
};
