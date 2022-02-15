import queryParser from './utils/queryParser.js'
import jwt from '#jwt'

export default ({ req }) => {
	try {
		let { operation, fieldName, variables } = queryParser(req.body)

		if(fieldName == '__schema') return
	
		/* public queries */
		if(
			[
				'login',
				'register',
				'categories',
				'products'
			].includes(fieldName)
		) {
			return {
				agent: req.headers['user-agent']
			}
		}
	
		/* private routes */
		const token = req.headers.token

		if(!token) {
			throw new Error("Token is required!")
		}

		const { agent, user: { user_id, is_admin } } = jwt.verify(token)

		if(agent != req.headers['user-agent']) {
			throw new Error("The user has requested from wrong device!")
		}

		return {
			agent: req.headers['user-agent'],
			userId: user_id,
			role: is_admin ? 'admin' : 'user'
		}
	
	} catch(error) {
		throw error
	}
}