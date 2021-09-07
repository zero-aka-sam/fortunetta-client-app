let users = [];

export const addUser = (id) => {
  users.push(id);

  return users;
};

export const removeUser = (id) => {
  users.filter((user) => user === id);

  return users;
};
