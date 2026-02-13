import { app } from "./app";
import { env } from "./env";

app.listen({
    host: '0.0.0.0', // listen on all interfaces, even frontend can access it
    port: env.PORT,
}).then(() => {
    console.log('HTTP server running!')
})
