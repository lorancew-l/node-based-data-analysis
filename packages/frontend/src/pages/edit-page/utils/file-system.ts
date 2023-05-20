export const exportToJson = async (object: object) => {
  const dataToSave = JSON.stringify(object);
  const blob = new Blob([dataToSave], { type: 'nbda' });
  return blob;
};

export const loadJson = async <T>(file: File) => {
  const fileText = await file.text();
  return JSON.parse(fileText) as T;
};
