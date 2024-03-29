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

app.use('/api/v1/blog/*', async (c,next)=>{
  const header = c.req.header("authorization")|| "";
  const token = header.split(" ")[1];
  const payload =  await verify(token,c.env.JWT_SECRET);
  if(!payload){
    await next();
  }
  else{
    c.status(403);
    return c.json({error: "Unauthorized request"})
  }
})





export default app
