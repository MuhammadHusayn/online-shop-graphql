import { fetch, fetchAll } from '#pg'
import { pagination as dp } from '#config'

const USERS = `
	SELECT
		user_id,
		username,
		contact,
		email,
		user_created_at
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

const users = ({ pagination,userId, search, sort }) => {
	const page = pagination.page || dp.page
	const limit = pagination.limit || dp.limit

	let sortOptions = { username: 1, userId: 2 }
	const sortObject = Object.keys(sort).map(key => {
		if(sort[key]) {
			return { sortKey: sortOptions[key], value: sort[key] }
		}
	}).filter( elem => elem !== undefined )[0]


	return fetchAll(
		USERS, 
	 	(page - 1) * limit, limit, userId, search,
		sortObject?.sortKey || 2, sortObject?.value || 1
	)
}


export default {
	users
}