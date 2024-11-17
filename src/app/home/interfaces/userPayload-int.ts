export interface userPayload {
    sub: number;
    username: string;
    rol: number;
    profilePhoto: string;
    scToken?: string;
    iat: number;
    exp: number;
}