// data.js

// export const epicData = [
//   {
//     "name": "Core Calculation Logic & Processing",
//     "summary": "This epic focuses on developing the fundamental mathematical engine that performs addition, subtraction, multiplication, and division, along with the necessary logic to parse and process numerical inputs, adhering to the two distinct numerical values scope.",
//     "features": [
//       "Addition Operation Logic Implementation",
//       "Subtraction Operation Logic Implementation",
//       "Multiplication Operation Logic Implementation",
//       "Division Operation Logic Implementation",
//       "Numerical Input Parsing and Internal Representation"
//     ]
//   },
//   {
//     "name": "User Interface & Interaction",
//     "summary": "This epic covers the design and implementation of the web-based user interface, enabling users to input numbers, select operations, and clearly view the computed results. It ensures an intuitive and accessible interaction model for a single calculation pair.",
//     "features": [
//       "Number Input Buttons (0-9, decimal point)",
//       "Arithmetic Operator Buttons (+, -, *, /)",
//       "Equals Button Functionality to trigger calculation",
//       "Clear (C) and All Clear (AC) Button Functionality",
//       "Result and Input Display Area"
//     ]
//   },
//   {
//     "name": "Input Validation & Error Handling",
//     "summary": "This epic ensures the robustness of the calculator by implementing mechanisms to detect and inform users about invalid operations (e.g., division by zero) or non-numerical inputs, providing clear feedback and preventing application crashes, then allowing for a new calculation.",
//     "features": [
//       "Division by Zero Detection and Notification",
//       "Non-Numeric Input Prevention or Validation",
//       "Clear Error Message Display in UI (e.g., Error or specific message)",
//       "Reset Calculator State After Error for New Calculation"
//     ]
//   }
// ];

// data.js

export const epicStoryData = [
  {
    name: 'epic-1',
    summary: 'Epic 1: User Onboarding Flow',
    features: [
      "Implementation of basic arithmetic operations (Add, Subtract, Multiply, Divide)",
      "Handling of numerical input parsing (e.g., building numbers from digit presses, decimal points)",
      "Management of internal calculation state (storing operands, selected operator, and intermediate results for sequential calculations)",
      "Logic for computing and preparing the final result for display, including handling of floating-point numbers with standard precision"
    ],
    userStories: [
      {
        title: 'story-1-1',
        description: 'Story 1.1: New User Registration',
        acceptanceCriteria: 'As a new user, I want to easily register for an account so that I can access the platform features.',
        featureFile: `Feature: User Registration
  Scenario: Successful registration
    Given I am on the registration page
    When I fill in valid details (username, email, password)
    And I click "Register"
    Then I should be redirected to the dashboard
    And a confirmation email should be sent
    Scenario: Successful registration
    Given I am on the registration page
    When I fill in valid details (username, email, password)
    And I click "Register"
    Then I should be redirected to the dashboard
    And a confirmation email should be sent
    Scenario: Successful registration
    Given I am on the registration page
    When I fill in valid details (username, email, password)
    And I click "Register"
    Then I should be redirected to the dashboard
    And a confirmation email should be sent
    Scenario: Successful registration
    Given I am on the registration page
    When I fill in valid details (username, email, password)
    And I click "Register"
    Then I should be redirected to the dashboard
    And a confirmation email should be sent`
      },
      {
        title: 'story-1-2',
        description: 'Story 1.2: Email Verification Process',
        acceptanceCriteria: 'As a registered user, I expect an email verification link so that my account is fully activated.',
        featureFile: `Feature: Email Verification
  Scenario: User clicks verification link
    Given I have registered an account but not verified my email
    When I receive and click the verification link in my email
    Then my email should be marked as verified
    And I should be logged in`
      }
    ]
  },
  {
    name: 'epic-2',
    summary: 'Epic 2: Data Management Module',
    features: [
      "Development of the calculator keypad layout (digits 0-9, decimal point, operators, equals, clear button)",
      "Implementation of the primary display area for showing current input, selected operation, and computed results",
      "Event handling for user interactions via mouse clicks on virtual buttons",
      "Visual feedback for button presses and clear presentation of current input and calculated results, considering basic display limits"
    ],
    userStories: [
      {
        title: 'story-2-1',
        description: 'Story 2.1: CSV Data Upload',
        acceptanceCriteria: 'As a user, I want to upload CSV files so that I can import my data into the system.',
        featureFile: `Feature: CSV Upload
  Scenario: Successful CSV upload
    Given I am on the data upload page
    When I select a valid CSV file
    And I click "Upload"
    Then the system should process the data
    And I should see a success message`
      },
      {
        title: 'story-2-2',
        description: 'Story 2.2: Data Deletion Capability',
        acceptanceCriteria: 'As a user, I want to delete my uploaded data so that I can manage my storage.',
        featureFile: `Feature: Data Deletion
  Scenario: User deletes specific data entry
    Given I have uploaded data
    When I navigate to the data table
    And I click the delete icon next to a data entry
    Then the data entry should be removed from the table`
      },
      {
        title: 'story-2-3',
        description: 'Story 2.3: Data Export',
        acceptanceCriteria: 'As a user, I want to export my processed data as a PDF so that I can use it offline.',
        featureFile: `Feature: Data Export
  Scenario: Export data to PDF
    Given I have processed data available
    When I click "Export to PDF" button
    Then a PDF file of my data should be downloaded`
      }
    ]
  }
];