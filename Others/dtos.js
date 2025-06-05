// for larger apps we can not rely completely on the orms. we use dtos to validate, check data and make the cotract between two layers e.g controllers and mappers 

const Joi = require('joi');

const createUserDto = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

module.exports = {
  createUserDto
};


const registerUser = async (req, res) => {
  const { error, value } = createUserDto.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const user = await userService.createUser(value);
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};



// Validation: Keeps validation logic separate and reusable.
// Consistency: Ensures incoming data is structured before hitting business logic.
// Security: Prevents unwanted data from sneaking into service/database layers.