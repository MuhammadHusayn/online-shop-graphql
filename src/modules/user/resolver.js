import model from './model.js'

export default {
	Query: {
		users: (_, args) => {
			try {
				const users = model.users(args)
				return users
			} catch(error) {
				throw error
			}
		}
	},

	User: {
		userId:        global => global.user_id,
		userCreatedAt: global => global.user_created_at,
	}
}