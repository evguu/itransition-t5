package com.example.demo.pojos.drawables;

import com.example.demo.pojos.drawables.utils.Drawable;
import com.example.demo.pojos.drawables.utils.Point;
import lombok.*;

@Data
@AllArgsConstructor
public class Curve {
    Drawable data;
    Point[] points;
    String color;
    Integer weight;
}
