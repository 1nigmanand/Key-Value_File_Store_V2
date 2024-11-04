const keyValueController = require('../controllers/keyValueController');

// Example usage for library-style testing
async function runExample() {
    // await keyValueController.create('this_key_is_too_long_123456789000000', { sample: "data" }, 60, () => console.log("Create completed"));
  // await keyValueController.read('user3', () => console.log("Read completed"));
  // await keyValueController.deleteKey('user2', () => console.log("Delete completed"));

  // const batchItems = [
  //   { key: 'user3', value: { name: 'Bob' }, ttl: 10005 },
  //   { key: 'this_key_is_too_long_123456789000000', value: { name: 'Alice' }, ttl: 1000 },
  //   { key: 'jkhfkjdshfjkhakjfhkjdahdkjhfkjdhaskj', value: { name: 'Alice' }, ttl: 1000 },
  //   { key: 'user2', value: { name: 'Bob' }, ttl: 10005 }
  // ];
  // await keyValueController.batchCreate(batchItems, () => console.log("Batch create completed"));
  

}

module.exports = { runExample };
