// import { params, validationResult } from 'express-validator';
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import UserService from '../services/userService';
import { generateToken } from '../../config/auth';

const getUserById = async (req, res) => {
  try {
    const inputErrors = validationResult(req);
    if (!inputErrors.isEmpty()) {
      return res.status(422).json({ inputErrors: inputErrors.array() });
    }
    const response = await UserService.getUserById(req.params.userId);
    if (response) {
      return res.status(200).send(response);
    }

    console.log('User has not been found');
    return res.status(404).send('User not found!');
  } catch (err) {
    console.log(err);
    return res.status(500).send('Something wrong!');
  }
};

const getUserByCpf = async (req, res) => {
  try {
    const inputErrors = validationResult(req);
    if (!inputErrors.isEmpty()) {
      return res.status(422).json({ inputErrors: inputErrors.array() });
    }

    const response = await UserService.getUserByCpf(req.body.cpf);
    if (response) {
      return res.status(200).send(response);
    }

    console.log('User with this cpf has not been found');
    return res.status(404).send('User not found!');
  } catch (err) {
    return res.status(500).send('Something wrong when tried to find an user searching by cpf!');
  }
};

const getAllUsers = async (req, res) => {
  try {
    const response = await UserService.getAllUsers();
    if (response) {
      return res.status(200).send(response);
    }

    console.log('Users not found!');
    return res.status(404).send('Users not found!');
  } catch (e) {
    return res.status(500).send('Something wrong when tried to find all users!');
  }
};

const createUser = async (req, res) => {
  try {
    const inputErrors = validationResult(req);
    if (!inputErrors.isEmpty()) {
      return res.status(422).json({ inputErrors: inputErrors.array() });
    }

    await UserService.createUser(req.body);
    return res.status(200).send('User has been created successfully!');
  } catch (err) {
    return res.status(500).send('Something wrong when tried to create an user!');
  }
};

const deleteUser = async (req, res) => {
  try {
    const inputErrors = validationResult(req);
    if (!inputErrors.isEmpty()) {
      return res.status(422).json({ inputErrors: inputErrors.array() });
    }

    const userDeleted = await UserService.deleteUser(req.params.userId);
    if (userDeleted !== null) {
      return res.status(200).send('User has been deleted!');
    }

    return res.status(404).send('User can not be deleted because the user does not exist!');
  } catch (err) {
    return res.status(500).send('Something wrong when tried to delete an user!');
  }
};

const updateUser = async (req, res) => {
  try {
    const inputErrors = validationResult(req);
    if (!inputErrors.isEmpty()) {
      return res.status(422).json({ inputErrors: inputErrors.array() });
    }

    const userUpdated = await UserService.updateUser(req.params.userId);
    if (userUpdated !== null) {
      return res.send(200).send('User has been updated.');
    }

    return res.status(404).send('User can not be updated because the user does not exist!');
  } catch (e) {
    return res.status(500).send('Something wrong when tried to update an user!');
  }
};

const authenticate = async (req, res) => {
  try {
    const inputErrors = validationResult(req);
    if (!inputErrors.isEmpty()) {
      return res.status(422).json({ inputErrors: inputErrors.array() });
    }

    const { cpf, password } = req.body;
    const user = await UserService.getUserByCpf(cpf);
    if (!user) {
      return res.status(404).send('User with this cpf not found!');
    }
    const matchPassword = await bcrypt.compare(password, user.password);
    if (matchPassword) {
      const payload = {
        cpf: user.cpf,
        id: user.id
      };
      const token = await generateToken(payload);
      console.log('User successfully authenticate!');
      return res.status(200).send(token);
    } else {
      console.log('Wrong Password!');
      return res.status(400).send('Wrong Password!');
    }
  } catch (e) {
    return res.status(500).send('Something wrong when tried to authenticate an user!');
  }
};

export { getUserById, getUserByCpf, createUser, deleteUser, updateUser, authenticate, getAllUsers };
