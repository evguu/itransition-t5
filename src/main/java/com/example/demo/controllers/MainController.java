package com.example.demo.controllers;

import com.example.demo.pojos.drawables.Curve;
import com.example.demo.pojos.drawables.Note;
import com.example.demo.pojos.drawables.Text;
import com.example.demo.pojos.drawables.utils.Drawable;
import com.example.demo.pojos.drawables.utils.Point;
import com.example.demo.utils.Sender;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Map;

@Controller
public class MainController {
    @GetMapping("/")
    public String greeting(Map<String, Object> model) {
        return "index";
    }

    @GetMapping("/getData")
    public @ResponseBody
    String getCanvas(Map<String, Object> model) {
        String body = "";
        body += Sender.toJSON(
                new Text(
                        new Drawable(new Point(0, 0)),
                        "I'm a text element"
                ));
        body += "<br>";
        body += Sender.toJSON(
                new Note(
                        new Drawable(new Point(0, 0)),
                        "I'm a note element",
                        2,
                        5
                ));
        body += "<br>";
        body += Sender.toJSON(
                new Curve(
                        new Drawable(new Point(0, 0)),
                        new Point[]{new Point(1, 1)},
                        "#000",
                        5
                ));
        body += "<br>";
        return body;
    }
}
