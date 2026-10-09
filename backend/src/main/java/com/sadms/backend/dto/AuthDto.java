package com.sadms.backend.dto;

import lombok.Data;

public class AuthDto {

    @Data
    public static class LoginRequest {
        private String username;
        private String password;
    }

    @Data
    public static class LoginResponse {
        private String token;
        private String role;
        private String username;

        public LoginResponse(String token, String role, String username) {
            this.token = token;
            this.role = role;
            this.username = username;
        }
    }
}
