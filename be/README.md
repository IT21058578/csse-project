# Helpful resources
- https://stackoverflow.com/questions/67044809/nestjs-correct-schema-for-array-of-subdocuments-in-mongoose-without-default-i
- https://masteringjs.io/tutorials/mongoose/enum
- https://dev.to/piyushkacha/mongoosemap-in-express-and-nestjs-4l31

# How to configure Mongoose statics with NestJs
Assume we have a `Cat` class.
1. Create the necessary schema classes and all the basic scaffolding.
2. Create type `CatModel` which is a union/extension of `Model<Cat>`. Include functions here.
3. Before export `CatSchema`. Make all corresponding static methods in `CatSchema.statics object`. Note that the typing of any `find()` methods have to be done manually.
4. Export the `CatSchema` after that, at the end of the file.
5. In any place that would usually use `Model<Cat>` use `CatModel instead. You should not have access to statics
* Make sure to export `MongooseModule` from the `Cat` module.