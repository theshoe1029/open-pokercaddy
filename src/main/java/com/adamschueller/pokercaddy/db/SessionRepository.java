package com.adamschueller.pokercaddy.db;

import com.adamschueller.pokercaddy.model.Session;
import com.adamschueller.pokercaddy.model.User;
import org.springframework.data.repository.CrudRepository;

public interface SessionRepository extends CrudRepository<Session, Integer> {
}
