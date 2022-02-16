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
	WHERE
	CASE
		WHEN $3 = TRUE THEN user_deleted_at IS NOT NULL
		WHEN $3 = FALSE THEN user_deleted_at IS NULL
	END AND
	CASE
		WHEN $4 > 0 THEN user_id = $4
		ELSE TRUE
	END AND
	CASE
		WHEN LENGTH($5) > 2 THEN (
			username ILIKE CONCAT('%', $5, '%') OR
			contact ILIKE CONCAT('%', $5, '%') OR
			email ILIKE CONCAT('%', $5, '%')
		) ELSE TRUE
	END
	ORDER BY
	CASE
		WHEN $6 = 1 AND $7 = 1 THEN username
	END ASC,
	CASE
		WHEN $6 = 1 AND $7 = 2 THEN username
	END DESC,
	CASE
		WHEN $6 = 2 AND $7 = 1 THEN user_id
	END ASC,
	CASE
		WHEN $6 = 2 AND $7 = 2 THEN user_id
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

const DELETE_USER = `
	UPDATE users SET
		user_deleted_at = current_timestamp
	WHERE user_deleted_at IS NULL AND user_id = $1
	RETURNING user_id, username, contact, email, is_admin
`

const RESTORE_USER = `
	UPDATE users SET
		user_deleted_at = NULL
	WHERE user_deleted_at IS NOT NULL AND 
	username = $1 AND password = crypt($2, password)
	RETURNING user_id, username, contact, email, is_admin
`

const users = ({ pagination, userId, search, sort, isDeleted }, context) => {
	const page = pagination.page || dp.page
	const limit = pagination.limit || dp.limit

	let sortOptions = { username: 1, userId: 2 }
	const sortObject = Object.keys(sort).map(key => {
		return { sortKey: sortOptions[key], value: sort[key] }
	}).filter( elem => elem !== undefined )[0]

	if(context.role == 'user') {
		userId = context.userId
	}

	return fetchAll(
		USERS, 
	 	(page - 1) * limit, limit, isDeleted, userId, search,
		sortObject?.sortKey || 2, sortObject?.value || 1
	)
}

const changeUser = ({ username, password, contact, email }, context) => {
	return fetch(CHANGE_USER, context.userId, username, password, contact, email)
}

const deleteUser = ({ userId }) => {
	return fetch(DELETE_USER, userId)
}

const restoreUser = ({ username, password }) => {
	return fetch(RESTORE_USER, username, password)
}

const login = ({ username, password }) => {
	return fetch(LOGIN, username, password)
}

const register = ({ username, password, contact, email }) => {
	return fetch(REGISTER, username, password, contact, email)
}



export default {
	restoreUser,
	deleteUser,
	changeUser,
	register,
	users,
	login
}