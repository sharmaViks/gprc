const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader'); //this package is used to load .proto file 

//Step1: load .proto file
const packageDefinition = protoLoader.loadSync('user.proto', {}); // loadSync is used to load .proto file synchronosly

//Step2: load the definitions of service and messages from .proto file. return type is object
const userProto = grpc.loadPackageDefinition(packageDefinition).UserService; //loadPackageDefinition is used to load definitions which we define in .proto file

//Step3. create new instance of server . this instance will handle the incoming RPC calls
const server = new grpc.Server();

const users = [];
let currentUserId = 1;

//step4. attach methods defined in service interface to server instance
server.addService(userProto.service, {
  RegisterUser: (call, callback) => { // call: parameter represents the incoming RPC call. It provides access to the request. 
    //callback: is a function to send the response back to the client.
    const user = call.request;
    user.id = currentUserId++;
    users.push(user);
    callback(null, { id: user.id }); // the first argument is error and second is data that we send
  },

  GetUser: (call, callback) => {
    const userId = call.request.id;
    const user = users.find(u => u.id === userId);
    if (user) {
      callback(null, user);
    } else {
      callback({ // here I am sending error as first argument and its an object having code and message
        code: grpc.status.NOT_FOUND, // there are other status codes as well e.g. OK, Cancelled etc.
        details: 'User not found',
      });
    }
  },
});

//step5: listen on port and Ip using insecure connection
// here createInsecure will allow the incoming calls to fetch/set data without authentication
server.bind('127.0.0.1:50051', grpc.ServerCredentials.createInsecure());
console.log('User gRPC server running at http://127.0.0.1:50051');
// finally start the service
server.start();
