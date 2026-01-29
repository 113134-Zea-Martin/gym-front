export interface RegisterRequest {
    email:    string;
    password: string;
}

export interface RegisterResponse {
    id:    number;
    email: string;
}

export interface RegisterWithGoogleRequest {
    tokenId: string;
}

export interface loginRequest{
    email:    string;
    password: string;
}

export interface loginResponse{
    token: string;
}