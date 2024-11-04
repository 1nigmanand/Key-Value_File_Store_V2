const fs = require('fs');
const path = require('path');
const { Mutex } = require('async-mutex');

// Custom error classes for specific error handling
class KeyAlreadyExistsError extends Error {}
class KeyNotFoundError extends Error {}
class ExpiredKeyError extends Error {}
class FileSizeLimitExceededError extends Error {}

class KeyValueStore {
  constructor(filePath) {
    this.filePath = filePath || path.join(__dirname, '../data', 'dataStore.json');
    this.mutex = new Mutex();

    const dir = path.dirname(this.filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    this.data = {};
    this.loadData();
    this.scheduleCleanup();
  }

  // Load data from file, removing expired keys
  loadData() {
    if (fs.existsSync(this.filePath)) {
      this.data = JSON.parse(fs.readFileSync(this.filePath, 'utf8'));
      this.removeExpiredKeys();
    }
  }

  // Save data to file, checking file size limit
  saveData() {
    const fileSize = Buffer.byteLength(JSON.stringify(this.data), 'utf8');
    if (fileSize > 1073741824) { // 1GB file size limit
      throw new FileSizeLimitExceededError("File size limit of 1GB exceeded.");
    }
    fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2));
  }

  // Create key-value pair with optional TTL
  async create(key, value, ttl = null) {
    const release = await this.mutex.acquire();
    try {
      if (this.data[key]) {
        throw new KeyAlreadyExistsError("Key already exists.");
      }
      if (Buffer.byteLength(key, 'utf8') > 32) {
        throw new Error("Key must be at most 32 characters.");
      }
      if (Buffer.byteLength(JSON.stringify(value), 'utf8') > 16384) {
        throw new Error("Value size exceeds 16KB.");
      }

      this.data[key] = {
        value,
        expiry: ttl ? Date.now() + ttl * 1000 : null
      };
      this.saveData();
    } finally {
      release();
    }
  }

  // Read key-value pair, automatically deleting expired keys
  async read(key) {
    const release = await this.mutex.acquire();
    try {
      const item = this.data[key];
      if (!item) {
        throw new KeyNotFoundError("Key not found.");
      }

      // Automatically delete expired keys
      if (item.expiry && Date.now() > item.expiry) {
        delete this.data[key];
        this.saveData();
        throw new ExpiredKeyError("Key has expired and was deleted.");
      }
      return item.value;
    } finally {
      release();
    }
  }

  // Delete key-value pair
  async delete(key) {
    const release = await this.mutex.acquire();
    try {
      if (!this.data[key]) {
        throw new KeyNotFoundError("Key not found.");
      }
      delete this.data[key];
      this.saveData();
    } finally {
      release();
    }
  }

  // Batch create with file size and key validation checks
  async batchCreate(items) {
    const invalidKeys = []; // Array to collect invalid keys
    const alreadyExistsKeys = []; // Array to collect keys that already exist
    const validItems = [];// Array to collect valid items
    
    

    // Check the overall batch size limit
    if (items.length > 50) {
      throw new Error("Batch limit of 50 key-value pairs exceeded.");
    }

    const release = await this.mutex.acquire();
    try {
      let fileSize = Buffer.byteLength(JSON.stringify(this.data), 'utf8');

      for (let { key, value, ttl } of items) {
        // Validate key length
        if (Buffer.byteLength(key, 'utf8') > 32) {
          invalidKeys.push(key); // Collect invalid keys
          continue; // Skip to the next item
        }
        // Check if key already exists
        if (this.data[key]) {
          alreadyExistsKeys.push(key); // Collect already existing keys
          continue; // Skip to the next item
        }
        // Validate value size
        const valueSize = Buffer.byteLength(JSON.stringify(value), 'utf8');
        if (valueSize > 16384) {
          invalidKeys.push(key); // Collect invalid keys
          continue; // Skip to the next item
        }

        // Accumulate file size
        fileSize += valueSize;
        if (fileSize > 1073741824) { // 1GB file size limit
          throw new FileSizeLimitExceededError("File size limit of 1GB exceeded.");
        }

        // If all validations pass, add to valid items
        validItems.push({ key, value, ttl });
      }

      // Only save valid items after all validations
      for (let { key, value, ttl } of validItems) {
        this.data[key] = {
          value,
          expiry: ttl ? Date.now() + ttl * 1000 : null
        };
      }

      this.saveData(); // Save data after processing all items

      // Constructing error messages
      const errors = [];
      if (invalidKeys.length > 0) {
        errors.push(`Invalid keys: ${invalidKeys.join(', ')}`);
      }
      if (alreadyExistsKeys.length > 0) {
        errors.push(`Already existing keys: ${alreadyExistsKeys.join(', ')}`);
      }

      // If there are any errors, throw an error with all messages
      if (errors.length > 0) {
        throw new Error(errors.join('. '));
      }
    } finally {
      release();
    }
  }

  // Schedule cleanup of expired keys
  scheduleCleanup() {
    setInterval(() => this.removeExpiredKeys(), 60 * 1000);
  }

  // Remove expired keys from the data store
  removeExpiredKeys() {
    const now = Date.now();
    let modified = false;

    for (const key in this.data) {
      if (this.data[key].expiry && now > this.data[key].expiry) {
        delete this.data[key];
        modified = true;
      }
    }

    if (modified) this.saveData();
  }
}

module.exports = {
  KeyValueStore,
  KeyAlreadyExistsError,
  KeyNotFoundError,
  ExpiredKeyError,
  FileSizeLimitExceededError
};
