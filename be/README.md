# Helpful resources
- https://stackoverflow.com/questions/67044809/nestjs-correct-schema-for-array-of-subdocuments-in-mongoose-without-default-i
- https://masteringjs.io/tutorials/mongoose/enum
- https://dev.to/piyushkacha/mongoosemap-in-express-and-nestjs-4l31

# Important
- For some strange reason, we need to import aswell as export MongooseModule from every module that uses it.
- For some strange reason to resolve the circular dependency you need to forward ref on the module aswell as the service level. Check approvals and itemRequests / procurements modules
- There were many ways to mock a module given online. But what I did was to stick the relevant services I need to import into my my module in the test module delcaration with the {provide, useValue} syntax.

# Helpful for testing
- https://stackoverflow.com/questions/55143467/testing-mongoose-models-with-nestjs
- https://github.com/nestjs/nest/blob/master/sample/06-mongoose/src/cats/cats.service.spec.ts
- https://www.npmjs.com/package/jest-when This library was used to get support for considering params when returning values. An important feature i came across when using groovy's spock library.
- All test follow a given, and, when, then pattern.
- https://stackoverflow.com/questions/47144187/can-you-write-async-tests-that-expect-tothrow Very important for testing exception