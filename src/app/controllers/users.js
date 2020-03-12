import UserService from '../services/userService';

const getUserById = async (req, res) => {
  try {
    const response = await UserService.getUserById(req.params.userId);
    if (response) {
      return res.status(200).send(response);
    }

    console.log('User has not been found');
    return res.status(404).send('User not found!');
  } catch (err) {
    return res.status(500).send('Something wrong!');
  }
};

const getUserByCpf = async (req, res) => {
  try {
    const response = await UserService.getUserByCpf(req.body.cpf);
    if (response) {
      return res.status(200).send(response);
    }

    console.log('User with this cpf has not been found');
    return res.status(404).send('User not found!');
  } catch (err) {
    return res.status(500).send('Something wrong when tried to find a user searching by cpf!');
  }
};

const createUser = async (req, res) => {
  try {
    await UserService.createUser(req.body);
    return res.status(200).send('User has been created successfully!');
  } catch (err) {
    return res.status(500).send('Something wrong when tried create a user!');
  }
};

const deleteUser = async (req, res) => {
  try {
    const userDeleted = await UserService.deleteUser(req.params.userId);
    if (userDeleted !== null) {
      return res.status(200).send('User has been deleted!');
    }

    return res.status(404).send('User can not be deleted because the user does not exist!');
  } catch (err) {
    return res.status(500).send('Something wrong when tried delete a user!');
  }
};

export { getUserById, getUserByCpf, createUser, deleteUser };
