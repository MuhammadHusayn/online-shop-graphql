import { config } from 'dotenv'
config()

export const pagination = {
	page: 1,
	limit: 100
}

export const PORT = process.env.PORT || 4000