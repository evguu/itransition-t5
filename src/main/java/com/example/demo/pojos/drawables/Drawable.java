package com.example.demo.pojos.drawables;

import com.fasterxml.jackson.annotation.JsonRawValue;

public class Drawable {
    private static Integer lastId = 0;

    private final Integer id;
    @JsonRawValue
    private final String json;

    public Drawable(String json) {
        this.id = ++lastId;
        this.json = json;
    }

    public Integer getId() {
        return id;
    }

    public String getJson() {return json;}
}
