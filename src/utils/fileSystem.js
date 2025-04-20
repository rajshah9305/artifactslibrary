/**
 * File system utility functions
 */
import fs from 'fs/promises';
import path from 'path';

/**
 * Ensure a directory exists, create it if it doesn't
 * @param {string} dirPath - The directory path
 * @returns {Promise<void>}
 */
export const ensureDir = async (dirPath) => {
  try {
    await fs.access(dirPath);
  } catch (error) {
    // Directory doesn't exist, create it
    await fs.mkdir(dirPath, { recursive: true });
  }
};

/**
 * Read a JSON file
 * @param {string} filePath - The file path
 * @returns {Promise<Object>} - The parsed JSON data
 */
export const readJsonFile = async (filePath) => {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error(`File not found: ${filePath}`);
    }
    throw error;
  }
};

/**
 * Write data to a JSON file
 * @param {string} filePath - The file path
 * @param {Object} data - The data to write
 * @param {Object} options - Options for writing
 * @param {boolean} options.pretty - Whether to pretty-print the JSON
 * @param {boolean} options.ensureDir - Whether to ensure the directory exists
 * @returns {Promise<void>}
 */
export const writeJsonFile = async (filePath, data, options = {}) => {
  const { pretty = true, ensureDirectory = true } = options;
  
  if (ensureDirectory) {
    await ensureDir(path.dirname(filePath));
  }
  
  const jsonData = pretty 
    ? JSON.stringify(data, null, 2) 
    : JSON.stringify(data);
    
  await fs.writeFile(filePath, jsonData, 'utf8');
};

/**
 * Check if a file exists
 * @param {string} filePath - The file path
 * @returns {Promise<boolean>} - Whether the file exists
 */
export const fileExists = async (filePath) => {
  try {
    await fs.access(filePath);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Delete a file if it exists
 * @param {string} filePath - The file path
 * @returns {Promise<boolean>} - Whether the file was deleted
 */
export const deleteFile = async (filePath) => {
  try {
    await fs.unlink(filePath);
    return true;
  } catch (error) {
    if (error.code === 'ENOENT') {
      return false; // File doesn't exist
    }
    throw error;
  }
};

/**
 * List all files in a directory
 * @param {string} dirPath - The directory path
 * @param {Object} options - Options for listing
 * @param {boolean} options.recursive - Whether to list files recursively
 * @param {RegExp} options.filter - A regular expression to filter files
 * @returns {Promise<string[]>} - Array of file paths
 */
export const listFiles = async (dirPath, options = {}) => {
  const { recursive = false, filter = null } = options;
  
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  let files = [];
  
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    
    if (entry.isDirectory() && recursive) {
      const subFiles = await listFiles(fullPath, options);
      files = files.concat(subFiles);
    } else if (entry.isFile()) {
      if (!filter || filter.test(entry.name)) {
        files.push(fullPath);
      }
    }
  }
  
  return files;
};

/**
 * Copy a file
 * @param {string} sourcePath - The source file path
 * @param {string} destPath - The destination file path
 * @param {Object} options - Options for copying
 * @param {boolean} options.overwrite - Whether to overwrite existing files
 * @param {boolean} options.ensureDir - Whether to ensure the destination directory exists
 * @returns {Promise<void>}
 */
export const copyFile = async (sourcePath, destPath, options = {}) => {
  const { overwrite = true, ensureDirectory = true } = options;
  
  if (ensureDirectory) {
    await ensureDir(path.dirname(destPath));
  }
  
  if (!overwrite && await fileExists(destPath)) {
    throw new Error(`Destination file already exists: ${destPath}`);
  }
  
  await fs.copyFile(sourcePath, destPath);
};

/**
 * Read a file as a stream
 * @param {string} filePath - The file path
 * @returns {ReadableStream} - A readable stream of the file
 */
export const createReadStream = (filePath) => {
  return fs.createReadStream(filePath);
};

/**
 * Write to a file as a stream
 * @param {string} filePath - The file path
 * @returns {WritableStream} - A writable stream to the file
 */
export const createWriteStream = (filePath) => {
  return fs.createWriteStream(filePath);
};