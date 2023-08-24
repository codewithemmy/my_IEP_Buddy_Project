const userRoute = require("../files/user/user.route")
const authRoute = require("../files/auth/auth.route")

const notificationRoute = require("../files/notification/notification.route")

const routes = (app) => {
  const base_url = "/api/v1"

  app.use(`${base_url}/user`, userRoute)
  app.use(`${base_url}/auth`, authRoute)
  app.use(`${base_url}/notification`, notificationRoute)
}

module.exports = routes
