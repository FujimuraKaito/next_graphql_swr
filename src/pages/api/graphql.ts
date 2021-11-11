import { NextApiRequest, NextApiResponse } from 'next'

import { ApolloServer } from 'apollo-server-micro'
import Cors from 'micro-cors'

import { typeDefs } from '../../apollo/type-defs'
import { resolvers } from '../../apollo/resolver'

export const config = {
  api: {
    bodyParser: false,
  },
}

const apolloServer = new ApolloServer({ typeDefs, resolvers })
const startServer = apolloServer.start()

// TODO: set cors
// https://github.com/apollographql/apollo-server/issues/4779
// https://nextjs-ja-translation-docs.vercel.app/docs/api-routes/api-middlewares#connectexpress-middleware-support
// TODO: set cookies
// https://github.com/vercel/next.js/blob/canary/examples/api-routes-middleware/pages/api/cookies.js
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', 'https://example.com')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  if (req.method === 'OPTIONS') {
    res.end()
    return false
  }

  await startServer
  await apolloServer.createHandler({
    path: '/api/graphql',
  })(req, res)
}

export default handler
