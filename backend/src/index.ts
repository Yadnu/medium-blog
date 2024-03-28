import { Hono } from 'hono'
import { decode, sign, verify } from 'hono/jwt'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { use } from 'hono/jsx';
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

app.use('/api/v1/blog/*', async (c,next)=>{
  const header = c.req.header("authorization")|| "";
  const token = header.split(" ")[1];
  const response =  await verify(token,c.env.JWT_SECRET);
  if(response.id){
    await next();
  }
  else{
    c.status(403);
    return c.json({error: "Unauthorized request"})
  }
})


app.post('/api/v1/signup', async (c) => {
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());

	const body = await c.req.json();
	try {
		const user = await prisma.user.create({
			data: {
				email: body.email,
				password: body.password
			}
		});
		const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
		return c.json({ jwt });
	} catch(e) {
		c.status(403);
		return c.json({ error: "error while signing up" });
	}
})
app.post("/api/v1/signin", async (c)=>{
  const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());

  const body = await c.req.json();
  const user = await prisma.user.findUnique({
    where:{
      email: body.email,
      password: body.password
    }
  })
  if(!user){
    c.status(403);
    return c.json({error: "user not found"});
  }
  const jwt = await sign({id: user.id}, c.env.JWT_SECRET);
  return c.json({jwt});
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
