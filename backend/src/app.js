import express from "express"
import passport from "passport"
import cors from "cors"
import cookieParser from 'cookie-parser';
import session from "express-session"
const app=express();
app.use(
    cors({
      origin: process.env.CORS_ORIGIN, 
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
      credentials: true, 
    })
  );

  app.use(session({
    secret: 'Shhhh',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
    },
}));

app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.send("Track My Jobs");
});

export {app}