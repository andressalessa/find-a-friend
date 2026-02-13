import 'dotenv/config'
// validate environment variables
import { z } from 'zod'

// the format for process.env is a object with the environment variables
// {
//     NODE_ENV: 'dev',
//     PORT: 3333,
// }

// thats why we create a schema that is a object with the environment variables

const envSchema = z.object({
    NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
    // coerce.<type> converts the type of the environment variable to the informed type 
    // z.coerce.number() converts the environment variable to a number
    PORT: z.coerce.number().default(3333),
})

// safeParse is a function that parses the environment variables and returns a success or error
const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
    console.error('❌ Invalid environment variables', _env.error.message)
    throw new Error('Invalid environment variables.')
}

export const env = _env.data
