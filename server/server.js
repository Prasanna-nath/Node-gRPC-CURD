var grpc = require("@grpc/grpc-js");
var protoLoader = require("@grpc/proto-loader");
const { v4: uuidv4 } = require("uuid");

const PROTO_PATH = "./customers.proto";

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  arrays: true,
});

const customersProto = grpc.loadPackageDefinition(packageDefinition);

const server = new grpc.Server();
const customers = [
  {
    id: "860fcc9e-623c-44ca-8b1e-a1141b56220f",
    name: "Prasanna Kumar Nath",
    age: 24,
    address: "Kendrapada",
  },
  {
    id: "860fcc9e-623c-44ca-8b1e-a5487b56220f",
    name: "Sreekrushna Das",
    age: 25,
    address: "Kendrapada",
  },
];

server.addService(customersProto.CustomerService.service, {
  GetAll: (_, callback) => {
    callback(null, { customers });
  },

  Get: (call, callback) => {
    let customer = customers.find((n) => n.id == call.request.id);
    
    if (customer) {
      callback(null, customer);
    } else {
      callback({
        code: grpc.status.NOT_FOUND,
        details: "Not found",
      });
    }
  },

  Insert: (call, callback) => {
    let customer = call.request;

    customer.id = uuidv4();
    customers.push(customer);
    callback(null, customer);
  },

  Update: (call, callback) => {
    let existingCustomer = customers.find((n) => n.id == call.request.id);

    if (existingCustomer) {
      existingCustomer.name = call.request.name;
      existingCustomer.age = call.request.age;
      existingCustomer.address = call.request.address;
      callback(null, existingCustomer);
    } else {
      callback({
        code: grpc.status.NOT_FOUND,
        details: "Not found",
      });
    }
  },

  Remove: (call, callback) => {
    let existingCustomerIndex = customers.findIndex(
      (n) => n.id == call.request.id
    );

    if (existingCustomerIndex != -1) {
      customers.splice(existingCustomerIndex, 1);
      callback(null, {});
    } else {
      callback({
        code: grpc.status.NOT_FOUND,
        details: "Not found",
      });
    }
  },
});

server.bindAsync(
  "127.0.0.1:30043",
  grpc.ServerCredentials.createInsecure(),
  (err, port) => {
    if (err) {
      console.error("Failed to bind:", err);
    } else {
      console.log("Server running on port", port);
    }
  }
);
