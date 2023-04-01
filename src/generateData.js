const { faker } = require('@faker-js/faker');
const fs = require('fs');

// language: Vietnamese
faker.setLocale('vi');

const randomClasses = (n) => {
  if (n <= 0) return [];
  const arr = [];
  Array.from(new Array(n)).forEach((item) => {
    arr.push({
      id: faker.database.mongodbObjectId(),
      class: faker.name.fullName(),
    });
  });
  return arr;
};
const randomDataStudent = (classes, n) => {
  if (n <= 0) return [];
  const arr = [];
  for (const classItem of classes) {
    Array.from(new Array(n)).forEach((item) => {
      arr.push({
        id: faker.database.mongodbObjectId(),
        name: faker.name.fullName(),
        username: faker.name.firstName(),
        email: faker.internet.email(),
        classId: classItem.id,
      });
    });
  }
  return arr;
};

const generateData = (path) => {
  // random data
  const classes = randomClasses(5);
  const dataStudent = randomDataStudent(classes, 5);
  // structure data
  const data = {
    classes: classes,
    dataStudent: dataStudent,
  };
  // write file db.json
  fs.writeFile(path, JSON.stringify(data), () => {
    console.log('Generate data successfully');
  });
};

generateData(__dirname.replace('src', 'db.json'));
