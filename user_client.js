const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

//Step1: load .proto file
const packageDefinition = protoLoader.loadSync('user.proto', {});

//Step2:load the definitions of service and messages from .proto file. return type is object
const userProto = grpc.loadPackageDefinition(packageDefinition).UserService;

//Step3: create client instance  that can communicate with server
const client = new userProto('localhost:50051', grpc.credentials.createInsecure());

// Register a new user 
client.RegisterUser({ name: 'Alice', email: 'alice@example.com' }, (error, response) => {
  if (!error) {
    console.log('User registered with ID:', response.id);
  } else {
    console.error('Error registering user:', error.details);
  }
});

// Get user by id
client.GetUser({ id: 1 }, (error, response) => {
  if (!error) {
    console.log('User details:', response);
  } else {
    console.error('Error getting user:', error.details);
  }
});
