package com.adamschueller.pokercaddy;

import com.adamschueller.pokercaddy.model.User;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.rmi.server.UID;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@SpringBootApplication
public class PokerCaddyApplication {

	public static final Map<String, User> activeSessions = new ConcurrentHashMap<>();

	public static void main(String[] args) {
		SpringApplication.run(PokerCaddyApplication.class, args);
	}

}
