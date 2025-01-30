# REST API Backend with MERN and Typescript
## Description
This REST API has as objective to build endpoinds what allow us interact with a [mongoDB](https://www.mongodb.com/) database through the [web application]((https://github.com/LeopoldoAl/uptask_user_managet)) based on [React](https://react.dev/) framework.
How the name indicates, this REST API was built using both MERN ([MongoDB](https://www.mongodb.com/), [Express](https://expressjs.com/), [React](https://react.dev/) and [Node.js](https://nodejs.org/en)) and Typescript, this builds endpoints in order to work with another [frontend-application-web](https://github.com/LeopoldoAl/uptask_user_managet). Through the endpoinds, we work for managing queries to mongoDB database in order to create operations such as:
* Create a project
* Edit a project
* Delete a project and the tasks inside it
* Show a single project
* Show all the projects that have been created
* Create a task
* Edit a task
* Delete a task
* See a task
* Change the task status
* Create a new user account
* Change user password
* Check the user authentication 
* Check the user authorization to do any actions
* Add a new collaborator to a project
* Create notes inside the tasks
There is some things what are done in the backend and we don't go to mention them, because of not extend this brief description.

For creating backend REST API we used libraries such as the following:
### Production dependencies:
* [bcrypt](https://www.npmjs.com/package/bcrypt)
* [colors](https://www.npmjs.com/package/colors)
* [cors](https://www.npmjs.com/package/cors)
* [dotenv](https://www.npmjs.com/package/dotenv)
* [express](https://www.npmjs.com/package/express)
* [express-validator](https://www.npmjs.com/package/express-validator)
* [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
* [mongoose](https://www.npmjs.com/package/mongoose)
* [morgan](https://www.npmjs.com/package/morgan)
* [nodemailer](https://www.npmjs.com/package/nodemailer?activeTab=dependencies)
### Development dependencies:
- [@types/bcrypt](https://www.npmjs.com/package/@types/bcrypt)
- [@types/cors](https://www.npmjs.com/package/@types/cors)
- [@types/express](https://www.npmjs.com/package/@types/express)
- [@types/jsonwebtoken](https://www.npmjs.com/package/@types/jsonwebtoken)
- [@types/morgan](https://www.npmjs.com/package/@types/morgan)
- [@types/nodemailer](https://www.npmjs.com/package/@types/nodemailer)
- [nodemon](https://www.npmjs.com/package/nodemon)
- [ts-node](https://www.npmjs.com/package/ts-node)
- [typescript](https://www.npmjs.com/package/typescript)