import { config } from 'dotenv'
config()

export const pagination = {
	page: 1,
	limit: 100
}

export const TOKEN_TIME = 1 * 24 * 60 * 60

export const PORT = process.env.PORT || 4000