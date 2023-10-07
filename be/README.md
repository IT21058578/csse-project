# Helpful resources
- https://stackoverflow.com/questions/67044809/nestjs-correct-schema-for-array-of-subdocuments-in-mongoose-without-default-i
- https://masteringjs.io/tutorials/mongoose/enum
- https://dev.to/piyushkacha/mongoosemap-in-express-and-nestjs-4l31

# Important
- For some strange reason, we need to import aswell as export MongooseModule from every module that uses it.
- For some strange reason to resolve the circular dependency you need to forward ref on the module aswell as the service level. Check approvals and itemRequests / procurements modules