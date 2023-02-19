import { Role } from './role';

export class User {
    // id?: number;
    // username?: string;
    // password?: string;
    // firstName?: string;
    // lastName?: string;
    // role?: Role;
    accessToken?: string;
    refreshToken?: string;
    language?: string;
    expiryDuration?: Date;
}

export class AuthToken {
    accessToken?: string;
    refreshToken?: string;
}

export class Authority {
    authority?: string;
}
