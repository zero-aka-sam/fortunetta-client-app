let users = [];

export const addUser = (id) => {
  users.push(id);

  return users;
};

export const removeUser = (id) => {
  const index = users.findIndex((user) => user === id);

  if (index !== -1) {
    users.splice(index, 1)[0];
  }

  return users;
};
