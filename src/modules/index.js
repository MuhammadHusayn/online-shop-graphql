import { makeExecutableSchema } from '@graphql-tools/schema'

import TypesModule from './types/index.js'
import UserModule from './user/index.js'

export default makeExecutableSchema({
    typeDefs: [
        TypesModule.typeDefs,
        UserModule.typeDefs,
    ],
    resolvers: [
        TypesModule.resolvers,
        UserModule.resolvers,
    ]
})