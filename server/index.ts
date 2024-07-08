import { MonoMongo } from "monomongo-lemur";
import { SocketServer } from "socket-lemur";
import { Modules } from "./modules";
import { Session } from "./modules/types";

const PORT = process.env.PORT || 4040;
const Server = new SocketServer<Session>({
  apikey: 'api-key',
  secret: 'jwt-secret',
  roomsEnabled: true
});
const Database = { hostname: "localhost", port: 27017, dbname: "db" };

MonoMongo.exect({ database: Database }).then(() => {

  // Load modules with their channels
  new Modules<Session>(Server);

  // Server run on port
  Server.listen(PORT, function () {
    console.log(`Server Run http://localhost:${PORT}`);
  });

  // On connection
  Server.connection({
    on: function () {
      console.log("on connection");
    },
    off: function () {
      console.log("on disconnect");
    },
  });

});


