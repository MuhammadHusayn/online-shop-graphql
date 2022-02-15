import { fetch, fetchAll } from '#pg'
import { pagination as dp } from '#config'

const USERS = `
	SELECT
		user_id,
		username,
		contact,
		email,
		TO_CHAR(user_created_at, 'YYYY-MM-DD hh:mm:ss') user_created_at
	FROM users
	WHERE user_deleted_at IS NULL AND
	CASE
		WHEN $3 > 0 THEN user_id = $3
		ELSE TRUE
	END AND
	CASE
		WHEN LENGTH($4) > 2 THEN (
			username ILIKE CONCAT('%', $4, '%') OR
			contact ILIKE CONCAT('%', $4, '%') OR
			email ILIKE CONCAT('%', $4, '%')
		) ELSE TRUE
	END
	ORDER BY
	CASE
		WHEN $5 = 1 AND $6 = 1 THEN username
	END ASC,
	CASE
		WHEN $5 = 1 AND $6 = 2 THEN username
	END DESC,
	CASE
		WHEN $5 = 2 AND $6 = 1 THEN user_id
	END ASC,
	CASE
		WHEN $5 = 2 AND $6 = 2 THEN user_id
	END DESC
	OFFSET $1 LIMIT $2
`

const LOGIN = `
	SELECT
		user_id,
		username,
		contact,
		is_admin,
		email,
		TO_CHAR(user_created_at, 'YYYY-MM-DD hh:mm:ss') user_created_at
	FROM users
	WHERE user_deleted_at IS NULL AND 
	username = $1 AND password = crypt($2, password)
`

const REGISTER = `
	INSERT INTO users (
		username,
		password,
		contact,
		email
	) VALUES ($1, crypt($2, gen_salt('bf')), $3, $4)
	RETURNING user_id, username, contact, email, is_admin
`

const CHANGE_USER = `
	UPDATE users SET
		username = (
			CASE WHEN LENGTH($2) > 0 THEN $2 ELSE username END
		),
		password = (
			CASE WHEN LENGTH($3) > 0 THEN crypt($3, gen_salt('bf')) ELSE password END
		),
		contact = (
			CASE WHEN LENGTH($4) > 0 THEN $4 ELSE contact END
		),
		email = (
			CASE WHEN LENGTH($5) > 0 THEN $5 ELSE email END
		)
	WHERE user_deleted_at IS NULL AND user_id = $1
	RETURNING user_id, username, contact, email, is_admin
`


const users = ({ pagination, userId, search, sort }, context) => {
	const page = pagination.page || dp.page
	const limit = pagination.limit || dp.limit

	let sortOptions = { username: 1, userId: 2 }
	const sortObject = Object.keys(sort).map(key => {
		if(sort[key]) {
			return { sortKey: sortOptions[key], value: sort[key] }
		}
	}).filter( elem => elem !== undefined )[0]

	if(context.role == 'user') {
		userId = context.userId
	}

	return fetchAll(
		USERS, 
	 	(page - 1) * limit, limit, userId, search,
		sortObject?.sortKey || 2, sortObject?.value || 1
	)
}

const changeUser = ({ username, password, contact, email }, context) => {
	return fetch(CHANGE_USER, context.userId, username, password, contact, email)
}

const login = ({ username, password }) => {
	return fetch(LOGIN, username, password)
}

const register = ({ username, password, contact, email }) => {
	return fetch(REGISTER, username, password, contact, email)
}


export default {
	changeUser,
	register,
	users,
	login
}