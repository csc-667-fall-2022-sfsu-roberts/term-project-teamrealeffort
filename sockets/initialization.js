const socketIO = require("socket.io");
const sessionMiddleware = require("../config/session");
const Server = socketIO.Server;

const init = (httpServer, app) => {
  const io = new Server(httpServer);
  const wrap = middleware => (socket, next) =>
    middleware(socket.request, {}, next);
  io.use(wrap(sessionMiddleware));

  io.use((socket, next) => {
    const session = socket.request.session;
    if (session && session.authenticated) {
      next();
    } else {
      next(new Error("unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    const { user_id } = socket.request.session;
    socket.join(user_id);
    console.log({ message: "connection happened", session: socket.request.session });
    console.log({ message: "User ID:  ", user_id });

  })

  app.io = io;
};

module.exports = init; 