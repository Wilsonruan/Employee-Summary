// Sets up Node.js and inquirer
const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
// Sets up the handle data 
const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");
// Call the `render` pass in an array containing all employee objects
const render = require("./lib/htmlRenderer");

var employee = [];

function inits() {
  const confirmNumberValidator = async (input) => {
    return (isNaN(input) || input.length == 0) ? 'Please provide a valid number.': true;
  };

  const confirmStringValidator = async (input) => {
    return (input.length == 0) ? 'Please provide a valid input.' : true;
  };

  const confirmEmailValidator = async (input) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return (!(re.test(String(input).toLowerCase()))) ? 'Please provide a valid email.' : true;
  };

  function generatorManager() {
    inquirer.prompt([
        {
          type: "input",
          message: "Please provide your name:",
          name: "name",
          validate: confirmStringValidator
        },
        {
          number: "input",
          message: "Please provide your employee ID number:",
          name: "id",
          validate: confirmNumberValidator
        },
        {
          type: "input",
          message: "Please provide your email:",
          name: "email",
          validate: confirmEmailValidator
        },
        {
          number: "input",
          message: "Please provide your Office Number:",
          name: "officeNumber",
          validate: confirmNumberValidator
        },
      ])
      .then((res) => {
        const manager = new Manager(res.name, res.id, res.email, res.officeNumber);
        generatorOptions(manager);
      });
  }
  function generatorOptions(newEmployee) {
    employee.push(newEmployee)
    inquirer.prompt([
        {
          type: "list",
          message:
            "Please select the options below:",
          name: "member",
          choices: ["Create Engineer Template", "Create Intern Template", "Start Your Team Template"],
        },
      ])
      .then((res) => {
        switch (res.member) {
          case "Create Engineer Template":
            generatorEngineer();
            break;
          case "Create Intern Template":
            generatorIntern();
            break;
            default:
            fs.writeFileSync(outputPath, render(employee), "utf-8");
        }
      });
  }
  function generatorEngineer() {
    inquirer.prompt([
        {
          type: "input",
          message: "Please provide engineer name:",
          name: "name",
          validate: confirmStringValidator
        },
        {
          type: "input",
          message: "Please provide your employee ID number:",
          name: "id",
          validate: confirmNumberValidator
        },
        {
          type: "input",
          message: "Please provide your email:",
          name: "email",
          validate: confirmEmailValidator
        },
        {
          type: "input",
          message: "Please provide your GitHub:",
          name: "github",
          validate: confirmStringValidator
        },
      ])
      .then((res) => {
        const engineer = new Engineer(res.name, res.id, res.email, res.github);
        generatorOptions(engineer);
      });
  }
  function generatorIntern() {
    inquirer.prompt([
        {
          type: "input",
          message: "Please provide intern name:",
          name: "name",
          validate: confirmStringValidator
        },
        {
          type: "input",
          message: "Please provide your employee ID number:",
          name: "id",
          validate: confirmNumberValidator
        },
        {
          type: "input",
          message: "Please provide your email:",
          name: "email",
          validate: confirmEmailValidator
        },
        {
          type: "input",
          message: "Please provide your school:",
          name: "school",
          validate: confirmStringValidator
        },
      ])
      .then((res) => {
        const intern = new Intern(res.name, res.id, res.email, res.school);
        generatorOptions(intern);
      });
  }
  generatorManager();
}
inits();