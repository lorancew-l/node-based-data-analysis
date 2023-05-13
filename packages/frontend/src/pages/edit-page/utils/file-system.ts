const options = {
  types: [
    {
      description: 'Json file',
      accept: { 'application/json': ['.json', '.nbda'] },
    },
  ],
};

export const exportToJson = async (object: object) => {
  const dataToSave = JSON.stringify(object);
  const fileToSave = new Blob([dataToSave], { type: 'application/json' });

  // @ts-ignore
  const fileHandle: FileSystemFileHandle = await window.showSaveFilePicker(options);
  // @ts-ignore
  const fileStream: FileSystemWritableFileStream = await fileHandle.createWritable();

  fileStream.write(fileToSave);
  fileStream.close();
};

export const loadJson = async <T>() => {
  // @ts-ignore
  const [fileHandle]: FileSystemFileHandle = await window.showOpenFilePicker(options);
  const file: File = await fileHandle.getFile();

  const fileText = await file.text();

  return JSON.parse(fileText) as T;
};
