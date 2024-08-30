import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!uri) {
  throw new Error(
    "Por favor, adicione a variávl de ambiente MONGODB_URI no arquivo .env"
  );
}

// configuração da conexão no modo desenvolvimento

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // configuração da conexão no modo de Produção]

  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
