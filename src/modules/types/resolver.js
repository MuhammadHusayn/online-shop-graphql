import { GraphQLScalarType, Kind } from 'graphql'

function checkDateTime (value) {
	const dateRegEx = /^\d{4}-(02-(0[1-9]|[12][0-9])|(0[469]|11)-(0[1-9]|[12][0-9]|30)|(0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))$/
	const timeRegEx = /^(?:(?:([01]?\d|2[0-3]):)?([0-5]?\d):)?([0-5]?\d)$/

	if(typeof value != 'string') {
		throw new Error("DateTime must be string!")
	}

	const [date, time] = value.split(' ')

	if(
		!dateRegEx.test(date) ||
		!timeRegEx.test(time)
	) {
		throw new Error("Invalid DateTime. Expected 'YYYY-MM-DD hh:mm:ss'")
	}

	return value
}

function checkEmail (value) {
	const emailRegEx =/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

	if(typeof value != 'string') {
		throw new Error("Email must be string!")
	}

	if(!emailRegEx.test(value)) {
		throw new Error("Invalid Email. Expected email found " + value)
	}

	return value
}

function checkContact (value) {
	const contactRegEx = /^998(9[012345789]|3[3]|7[1]|8[8])[0-9]{7}$/

	if(typeof value != 'string') {
		throw new Error("Contact must be string!")
	}

	if(value.length != 12) {
		throw new Error("Contact length must be 12!")
	}

	if(!contactRegEx.test(value)) {
		throw new Error("Invalid Contact. Expected Contact found " + value)
	}

	return value
}

const dateScalar = new GraphQLScalarType({
  	name: 'DateTime',
  	description: 'DateTime custom scalar type',
  	serialize: checkDateTime,
  	parseValue: checkDateTime,
  	parseLiteral(ast) {
  		if(ast.kind == Kind.STRING) {
  			return checkDateTime(ast.value)
  		} else {
  			throw new Error("DateTime must be string!")
  		}
  	},
})

const emailScalar = new GraphQLScalarType({
  	name: 'Email',
  	description: 'Email custom scalar type',
  	serialize: checkEmail,
  	parseValue: checkEmail,
  	parseLiteral(ast) {
  		if(ast.kind == Kind.STRING) {
  			return checkEmail(ast.value)
  		} else {
  			throw new Error("Email must be string!")
  		}
  	},
})

const contactScalar = new GraphQLScalarType({
  	name: 'Contact',
  	description: 'Contact custom scalar type',
  	serialize: checkContact,
  	parseValue: checkContact,
  	parseLiteral(ast) {
  		if(ast.kind == Kind.STRING) {
  			return checkContact(ast.value)
  		} else {
  			throw new Error("Contact must be string!")
  		}
  	},
})


export default {
	SortOption: {
		toLargest: 1,
		toSmallest: 2
	},

	DateTime: dateScalar, 
	Email: emailScalar, 
	Contact: contactScalar, 
}

'2020-10-10 78:25:11'