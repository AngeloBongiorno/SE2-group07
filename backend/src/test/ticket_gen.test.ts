import fs from 'fs';
import path from 'path';
import qrcode from 'qrcode';
import { deleteTicketPdfs, generateQrCode } from '../pdf_qr_generation';
import { Ticket, Status } from '../models/Ticket';

jest.mock('fs');

jest.mock('qrcode', () => ({
  toDataURL: jest.fn(),  // Explicitly mock qrcode.toDataURL as a Jest mock function
}));

describe('deleteTicketPdfs', () => {
  let mockReaddir: jest.Mock;
  let mockUnlink: jest.Mock;

  beforeEach(() => {
    mockReaddir = fs.readdir as unknown as jest.Mock;
    mockUnlink = fs.unlink as unknown as jest.Mock;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should delete all .pdf files in the folder', () => {
    const files = ['file1.pdf', 'file2.pdf', 'file3.txt'];

    // Mock fs.readdir to return a list of files
    mockReaddir.mockImplementation((folder, callback) => {
      callback(null, files);
    });

    // Mock fs.unlink to simulate successful file deletion
    mockUnlink.mockImplementation((filePath, callback) => {
      callback(null);
    });

    deleteTicketPdfs();

    // Check that readdir was called on the correct folder
    expect(fs.readdir).toHaveBeenCalledWith('./tickets/', expect.any(Function));

    // Check that unlink was called only for the .pdf files
    expect(fs.unlink).toHaveBeenCalledTimes(2); // Should only delete the two .pdf files
    expect(fs.unlink).toHaveBeenCalledWith(path.join('./tickets/', 'file1.pdf'), expect.any(Function));
    expect(fs.unlink).toHaveBeenCalledWith(path.join('./tickets/', 'file2.pdf'), expect.any(Function));
  });

  it('should not delete files that do not have a .pdf extension', () => {
    const files = ['file1.txt', 'file2.doc', 'file3.jpg'];

    mockReaddir.mockImplementation((folder, callback) => {
      callback(null, files);
    });

    deleteTicketPdfs();

    // Check that unlink was not called, as no .pdf files exist
    expect(fs.unlink).not.toHaveBeenCalled();
  });

  it('should handle errors when reading the directory', () => {
    const errorMessage = 'Error reading folder';
    
    // Mock readdir to simulate an error
    mockReaddir.mockImplementation((folder, callback) => {
      callback(new Error(errorMessage), null);
    });

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    deleteTicketPdfs();

    // Check that an error was logged
    expect(consoleErrorSpy).toHaveBeenCalledWith(`Error reading folder: ${errorMessage}`);
    
    consoleErrorSpy.mockRestore();
  });

  it('should handle errors when deleting a file', () => {
    const files = ['file1.pdf', 'file2.pdf'];
    const deleteErrorMessage = 'Error deleting file';

    // Mock fs.readdir to return a list of PDF files
    mockReaddir.mockImplementation((folder, callback) => {
      callback(null, files);
    });

    // Mock fs.unlink to simulate an error when deleting one file
    mockUnlink.mockImplementation((filePath, callback) => {
      if (filePath === path.join('./tickets/', 'file1.pdf')) {
        callback(new Error(deleteErrorMessage));
      } else {
        callback(null);
      }
    });

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

    deleteTicketPdfs();

    // Check that an error was logged for the problematic file
    expect(consoleErrorSpy).toHaveBeenCalledWith(`Error deleting file file1.pdf: ${deleteErrorMessage}`);
    
    // Ensure the second file was successfully deleted
    expect(consoleLogSpy).toHaveBeenCalledWith('Deleted PDF file: file2.pdf');

    consoleErrorSpy.mockRestore();
    consoleLogSpy.mockRestore();
  });
});
