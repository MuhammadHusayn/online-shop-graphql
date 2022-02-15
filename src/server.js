import { 
	ApolloServerPluginLandingPageGraphQLPlayground,
	ApolloServerPluginDrainHttpServer,
} from 'apollo-server-core'
import { ApolloServer } from 'apollo-server-express'
import express from 'express'
import http from 'http'
import { PORT } from '#config'
import schema from './modules/index.js'
import context from './context.js'


async function startApolloServer(typeDefs, resolvers) {

  	const app = express()
  	const httpServer = http.createServer(app)
	
  	const server = new ApolloServer({
  		context,
  		schema,
  		plugins: [
  			ApolloServerPluginLandingPageGraphQLPlayground(),
  			ApolloServerPluginDrainHttpServer({ httpServer })
  		],
  	})

  	await server.start()
  	server.applyMiddleware({ app, path: '/graphql' })

  	await new Promise(resolve => httpServer.listen({ port: PORT }, resolve))
  	console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`)
}

startApolloServer()