const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const PROTO_PATH = "C:/Users/prasa/Documents/Node-gRPC-CURD/customers.proto";

var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  arrays: true,
});

const CustomerService =
  grpc.loadPackageDefinition(packageDefinition).CustomerService;
const client = new CustomerService(
  "localhost:30043",
  grpc.credentials.createInsecure()
);

module.exports = client;
