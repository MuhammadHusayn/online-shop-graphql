import model from './model.js'
import jwt from '#jwt'

export default {
	Mutation: {
		login: async (_, args, { agent }) => {
			try {
				const user = await model.login(args)
				if(user) {
					return {
						status: 200,
						message: "The user succefully logged in!",
						token: jwt.sign({ agent, user }),
						user,
					}
				} else throw new Error("Wrong username or password!")
			} catch(error) {
				return {
					status: 401,
					message: error.message
				}
			}
		},

		register: async (_, args, { agent }) => {
			try {
				const user = await model.register(args)
				if(user) {
					return {
						status: 200,
						message: "The user succefully registered!",
						token: jwt.sign({ agent, user }),
						user,
					}
				} else throw new Error("Something went wrong!")
			} catch(error) {
				return {
					status: 401,
					message: error.message
				}
			}
		},

		changeUser: async (_, args, context) => {
			try {
				const user = await model.changeUser(args, context)
				if(user) {
					return {
						status: 200,
						message: "The user information succefully updated!",
						data: user,
					}
				} else throw new Error("Something went wrong!")
			} catch(error) {
				return {
					status: 401,
					message: error.message
				}
			}
		},

		deleteUser: async (_, args, context) => {
			try {
				const user = await model.deleteUser(context)
				if(user) {
					return {
						status: 200,
						message: "The user deleted!",
						data: user,
					}
				} else throw new Error("The user already deleted or not exists!")
			} catch(error) {
				return {
					status: 401,
					message: error.message
				}
			}
		},

		restoreUser: async (_, args, context) => {
			try {
				const user = await model.restoreUser(args, context)
				if(user) {
					return {
						status: 200,
						message: "The user restored!",
						data: user,
					}
				} else throw new Error("The user already restored or not exists!")
			} catch(error) {
				return {
					status: 401,
					message: error.message
				}
			}
		},
	},

	Query: {
		users: (_, args, context) => {
			try {
				const users = model.users({ ...args, isDeleted: false }, context)
				return users
			} catch(error) {
				throw error
			}
		},

		deletedUsers: (_, args, context) => {
			try {
				const users = model.users({ ...args, isDeleted: true }, context)
				return users
			} catch(error) {
				throw error
			}
		},
	},

	User: {
		userId:        global => global.user_id,
		userCreatedAt: global => global.user_created_at,
	}
}