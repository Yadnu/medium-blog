import { Hono } from 'hono';
import { decode, sign, verify } from 'hono/jwt';

import { blogRouter } from './routes/blogs';
import { userRouter } from './routes/users';
const app = new Hono<
{
  Bindings:{
    DATABASE_URL: string,
    JWT_SECRET: string
    
  }
  Variables : {
    userId: string
  }
}>();
app.route("/api/v1/user", userRouter);
app.route("/api/v1/blog", blogRouter);

app.get("/", (c)=>{
  return c.json({message: "Hello from Blogs"});
});





export default app
