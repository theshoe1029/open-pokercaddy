package com.adamschueller.pokercaddy.model;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
public class User {
    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    @Getter
    @Setter
    private Integer id;

    @Column(unique=true)
    @Getter
    @Setter
    private String username;

    @Getter
    @Setter
    private String password;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @Getter
    @Setter
    private List<Session> sessions = new ArrayList<>();

    @Getter
    @Setter
    private float bankroll;
}
