package com.adamschueller.pokercaddy.model;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.Date;
import java.util.Optional;

@Entity
public class Session {
    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    @Getter
    @Setter
    private Integer id;

    @Getter
    @Setter
    private Date date;

    @Getter
    @Setter
    private String location;

    @Getter
    @Setter
    private float smallBlind;

    @Getter
    @Setter
    private float bigBlind;

    @Getter
    @Setter
    private float straddle;

    @Getter
    @Setter
    private float moneyIn;

    @Getter
    @Setter
    private float moneyOut;
}
