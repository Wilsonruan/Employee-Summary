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
// Push all info here...
var employee = [];

function inits() {
  // Confirm user inputs number or something
  const confirmNumberValidator = async (input) => {
    return (isNaN(input) || input.length == 0) ? 'Please provide a valid number.': true;
  };
  // Confirm user inputs something
  const confirmStringValidator = async (input) => {
    return (input.length == 0) ? 'Please provide a valid input.' : true;
  };
// Confirm user inputs proper email
  const confirmEmailValidator = async (input) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return (!(re.test(String(input).toLowerCase()))) ? 'Please provide a valid email.' : true;
  };
  // Generator Manager profile.
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
        // Goes to Step 2: Give user options to choose and pushes the manager info to the next function.
        generatorOptions(manager);
      });
  }
  //Provide choose to choose between ["Create Engineer Template", "Create Intern Template", "Start Your Team Template"],
  function generatorOptions(newEmployee) {
    // Pushes information to var employee
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
        if (res.member == "Create Engineer Template") {
            generatorEngineer();
          } else if (res.member == "Create Intern Template") {
            generatorIntern();
          } else {
            // After users complete all profiles.  User can select here to create the team template.
            // If output test is not available, the function if statement will create output test.
            if (!fs.existsSync(OUTPUT_DIR)) {
              fs.mkdirSync(OUTPUT_DIR);
            }
            // Will create team.html and end the program here. 
            fs.writeFileSync(outputPath, render(employee), "utf-8");
        }
      });
  }
  // Generator Enginee
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
        // Loops back into options
        generatorOptions(engineer);
      });
  }
  // Generator intern
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
        // Loops back into options
        generatorOptions(intern);
      });
  }
  // Step 1: Generator Manager profile
  generatorManager();
}
// Start the function
inits();