import { Hono } from 'hono'

const app = new Hono()


app.post("/api/v1/signup", (c)=>{
  return c.text("From signup")
});
app.post("/api/v1/signin", (c)=>{
  return c.text("From signin")
});
app.post("/api/v1/blog", (c)=>{
  return c.text("From blog")
});
app.put("/api/v1/blog", (c)=>{
  return c.text("Edit blog")
});
app.get("/api/v1/blog:id", (c)=>{
  return c.text("From blogs")
});
app.get('/', (c) => {
  return c.text('Hello Hono!')
})

export default app
