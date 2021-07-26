package com.example.demo.pojos.drawables.utils;

public class Drawable {
    private static Integer lastId = 0;

    private final Integer id;
    private final Point pos;

    public Drawable(Point pos) {
        this.id = ++lastId;
        this.pos = pos;
    }

    public Integer getId() {
        return id;
    }

    public Point getPos() {
        return pos;
    }
}
