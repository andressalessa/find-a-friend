import '@/env'
import fastify from "fastify";
import { organizationRoutes } from "./http/routes/organization.routes";

export const app = fastify();

app.register(organizationRoutes);
