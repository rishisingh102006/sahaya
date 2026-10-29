export const generateRequestId = () => {
  const year = new Date().getFullYear();
  const randomCode = Math.floor(100000 + Math.random() * 900000);
  return `SHY-${year}-${randomCode}`;
};

export const generateId = (prefix = 'id') => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 7);
  return `${prefix}-${timestamp}-${random}`;
};
