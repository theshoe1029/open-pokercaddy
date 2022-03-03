package com.adamschueller.pokercaddy.db;

import com.adamschueller.pokercaddy.model.Session;
import com.adamschueller.pokercaddy.model.User;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface UserRepository extends CrudRepository<User, Integer> {

    User findByUsername(String username);

}