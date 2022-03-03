package com.adamschueller.pokercaddy.controller.response;

import com.adamschueller.pokercaddy.model.Session;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@AllArgsConstructor
public class UserResponse {
    @Getter String sessionId;
    @Getter List<Session> sessions;
    @Getter float bankroll;
}
