package com.example.demo.controllers;

import com.example.demo.pojos.drawables.Curve;
import com.example.demo.pojos.drawables.utils.Drawable;
import com.example.demo.pojos.drawables.utils.Point;
import com.example.demo.utils.Sender;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.Map;

@Controller
public class MainController {
    @GetMapping("/")
    public String greeting(Map<String, Object> model) {
        return "index";
    }

    @GetMapping("/getData")
    public String getCanvas(Map<String, Object> model) {
        System.out.println(Sender.toJSON(
                new Curve(
                        new Drawable(new Point(0, 0)),
                        new Point[]{new Point(1, 1)},
                        "#000",
                        5
                )));
        return "index";
    }
}
