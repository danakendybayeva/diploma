export class UserPayload {
    username: string;
    password: string;
    providerId?: string;
    deviceId?: string;
    rememberMe?: boolean;
    idToken?: string;
}
