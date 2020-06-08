import IStorageProvider from '../IStorageProvider';

export default class FakeStorageProvider implements IStorageProvider {
  private files: string[] = [];

  async store(file: string): Promise<string> {
    this.files.push(file);

    return file;
  }

  async remove(file: string): Promise<void> {
    const fileIndex = this.files.findIndex((f) => f === file);

    if (fileIndex >= 0) {
      this.files.splice(fileIndex, 1);
    }
  }
}
