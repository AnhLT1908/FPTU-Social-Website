const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../../models/userModel');
const Slot = require('../../models/Slot');
const Semester = require('../../models/Semester');
const Question = require('../../models/Question');
const Course = require('../../models/Course');
const Class = require('../../models/Class');
const Assignment = require('../../models/Assignment');
const Answer = require('../../models/Answer');
dotenv.config({ path: './config.env' });
// const DB = process.env.DATABASE.replace(
//   '<password>',
//   process.env.DATABASE_PASSWORD
// );
const DB = process.env.LOCAL_DATABASE;
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((conn) => {
    console.log('DB connection successful!');
  });
// console.log(process.env);
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const slots = JSON.parse(fs.readFileSync(`${__dirname}/slots.json`, 'utf-8'));
const semesters = JSON.parse(
  fs.readFileSync(`${__dirname}/semesters.json`, 'utf-8')
);
const questions = JSON.parse(
  fs.readFileSync(`${__dirname}/questions.json`, 'utf-8')
);
const courses = JSON.parse(
  fs.readFileSync(`${__dirname}/courses.json`, 'utf-8')
);
const classes = JSON.parse(
  fs.readFileSync(`${__dirname}/classes.json`, 'utf-8')
);
const assignments = JSON.parse(
  fs.readFileSync(`${__dirname}/classes.json`, 'utf-8')
);
const answers = JSON.parse(
  fs.readFileSync(`${__dirname}/answers.json`, 'utf-8')
);
const importData = async () => {
  try {
    await Semester.create(semesters);
    // await Class.create(classes);
    // await Course.create(courses);
    // await Slot.create(slots);
    // await User.create(users, { validateBeforeSave: false });
    // await Question.create(questions);
    // await Assignment.create(assignments);
    // await Answer.create(answers);
    console.log('Data successfully loaded!');
    process.exit();
  } catch (error) {
    console.log(error);
  }
};
const deleteData = async () => {
  try {
    // await User.deleteMany();
    // await Slot.deleteMany();
    await Semester.deleteMany();
    // await Question.deleteMany();
    // await Course.deleteMany();
    // await Class.deleteMany();
    // await Assignment.deleteMany();
    // await Answer.deleteMany();
    console.log('Data successfully deleted!');
    process.exit();
  } catch (error) {
    console.log(error);
  }
};
if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
console.log(process.argv);
