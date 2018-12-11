const express = require('express')
const logger = require('morgan')
const jwt = require('express-jwt')
const jwksRsa = require('jwks-rsa')
const cors = require('cors')
require('dotenv').config()

const app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(cors())

const checkJwt = (audience) => jwt({
  // Dynamically provide a signing key based on the kid in the header and the singing keys provided by the JWKS endpoint.
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
  }),

  // Validate the audience and the issuer.
  audience: audience,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ['RS256']
})

app.get('/api/public', (req, res) => {
  res.json({ message: "Hello from a public endpoint! You don't need to be authenticated to see this." })
})

app.get('/api/private', checkJwt([process.env.AUTH0_CLIENT_ID, process.env.AUTH0_AUDIENCE]), (req, res) => {
  res.json({ message: "Hello from a private endpoint! You need to be authenticated to see this." })
})

app.get('/api/admin', checkJwt(process.env.AUTH0_AUDIENCE), function(req, res) {
  res.json({ message: "Hello from an admin endpoint! You need to be authenticated with an access token to see this" })
})

module.exports = app
