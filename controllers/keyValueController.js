const { KeyValueStore, KeyAlreadyExistsError, KeyNotFoundError, ExpiredKeyError, FileSizeLimitExceededError } = require('../models/KeyValueStore');

const store = new KeyValueStore('.data/dataStore.json');

// Create operation
async function create(key, value, ttl,callback) {
  try {
    await store.create(key, value, ttl);
    console.log(`Key-value pair created: ${key} => ${JSON.stringify(value)}`);
  } catch (error) {
    handleControllerError("Create Error", error);
  }finally{
    callback()
  }
}

// Read operation
async function read(key, callback) {
  try {
    const value = await store.read(key);
    console.log(`Retrieved value for ${key}:`, value);
  } catch (error) {
    handleControllerError("Read Error", error);
  } finally {
    callback();
  }
}

// Delete operation
async function deleteKey(key, callback) {
  try {
    await store.delete(key);
    console.log(`Key-value pair for ${key} deleted.`);
  } catch (error) {
    handleControllerError("Delete Error", error);
  } finally {
    callback();
  }
}

// Batch create operation
async function batchCreate(items, callback) {
  try {
    await store.batchCreate(items);
    console.log("Batch creation successful.");
  } catch (error) {
    handleControllerError("Batch Create Error", error);
  } finally {
    callback();
  }
}

// Helper to handle different errors
function handleControllerError(context, error) {
  if (error instanceof KeyAlreadyExistsError) {
    console.error(`${context}: Key already exists.`);
  } else if (error instanceof KeyNotFoundError) {
    console.error(`${context}: Key not found.`);
  } else if (error instanceof ExpiredKeyError) {
    console.error(`${context}: Key has expired and was deleted.`);
  } else if (error instanceof FileSizeLimitExceededError) {
    console.error(`${context}: File size limit exceeded.`);
  } else {
    console.error(`${context}:`, error.message);
  }
}

module.exports = {
  create,
  read,
  deleteKey,
  batchCreate
};
