package com.example.demo.domain;

public class Drawable {
    private static Integer lastId = -1;

    private final Integer id;
    private final String element;

    public Drawable(String element) {
        this.id = ++lastId;
        this.element = element;
    }

    public Integer getId() {
        return id;
    }

    public String getElement() {return element;}
}
