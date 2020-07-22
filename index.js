const app = require('./courses/courses');

const port = process.env.PORT || 3000; //getting local variables
app.listen(port);
console.log(`Listening on port ${port}`);
