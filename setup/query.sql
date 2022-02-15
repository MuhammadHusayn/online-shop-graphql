SELECT
	user_id,
	username,
	contact,
	email,
	user_created_at
FROM users
WHERE user_deleted_at IS NULL
ORDER BY
CASE
	WHEN $1 = 1 AND $2 = 1 THEN username
END ASC,
CASE
	WHEN $1 = 1 AND $2 = 2 THEN username
END DESC


$1
username: 1
userId: 2

$2
asc: 1
desc: 2