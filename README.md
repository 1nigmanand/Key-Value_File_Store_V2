# Key-Value Store Application

An interactive key-value store application built using Node.js, designed with a focus on simplicity and data persistence. The app allows users to create, read, delete, and batch-create key-value pairs with an optional time-to-live (TTL) feature. This project is organized using a basic MVC (Model-View-Controller) structure for efficient code management and scalability.

Use `remote.js` file to control the code.

## Features

- **Create**: Add a key-value pair with an optional TTL.
- **Read**: Retrieve the value and status of a specified key.
- **Delete**: Remove a key-value pair.
- **Batch Create**: Add multiple key-value pairs at once.
- **Data Persistence**: Stores data in a JSON file for persistence across sessions.
- **Cleanup**: Periodically removes expired keys.

## Project Structure

```plaintext
├── controllers/
│   └── keyValueController.js   # Contains CRUD operations for key-value pairs
├── models/
│   └── KeyValueStore.js        # Defines the data storage and cleanup mechanism
├── views/
│   └── consoleView.js          # Manages interactive console menus
├── .gitignore                  # Specifies files and directories to ignore in git
├── README.md                   # Project documentation
├── package.json                # Project metadata and dependencies
└── index.js                    # Entry point for the application
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 12 or higher)
- npm (comes with Node.js)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Key-Value_File_Store
    ```

2. **Install dependencies**
   ```bash  
   npm install
   ```      

### Usage
1. **Run the application**
   ```bash  
   node app.js
   ```    
2. **Follow the interactive menu to perform operations like creating, reading, deleting, or batch-creating key-value pairs.**


### Example Usage

#### Create a Key-Value Pair
- Select option `1` in the interactive console and provide:
  - **Key**: A string with a maximum length of 32 characters.
  - **Value**: A JSON object, limited to a size of 16KB.
  - **TTL (Time-To-Live)**: Optional, specify in seconds. Leave blank for no expiration.

#### Read a Key-Value Pair
- Select option `2` in the console and enter the **key** to retrieve its value and status (active or expired).

#### Delete a Key-Value Pair
- Select option `3` and enter the **key** you want to delete from the storage.


#### Batch Create Key-Value Pairs
- Select option `4` and enter multiple key-value pairs in JSON format. 
- Example input for batch creation:
  ```json
  [
    { "key": "user1", "value": { "name": "Alice" }, "ttl": 60 },
    { "key": "user2", "value": { "name": "Bob" }, "ttl": 120 }
  ]
  ```

### Configuration

- **TTL (Time-to-Live)**: When creating a key, you can set a TTL (in seconds) to define its lifespan. Once the TTL expires, the key is automatically marked as expired and will be removed during the next cleanup cycle.
- **Automatic Cleanup**: The application runs a cleanup process every minute to remove expired keys from storage, ensuring efficient memory management.

### File Storage

Data is stored in `.data/dataStore.json`, which maintains persistence across application restarts. The necessary directories and files will be created automatically if they don’t already exist.

## Troubleshooting

- **Invalid Key Format**: Ensure keys are strings and contain no more than 32 characters.
- **Value Size Limit**: Values should not exceed 16KB to fit within the allowed limit.
- **JSON Format**: When using batch operations, ensure all input is correctly formatted as JSON objects.

## Dependencies

This application uses:
- [chalk](https://www.npmjs.com/package/chalk) for colored output in the console.
- [async-mutex](https://www.npmjs.com/package/async-mutex) for managing asynchronous operations.

## Time Spent on Project
Approximately 7 hours were spent on the design, implementation, and testing of this project.
