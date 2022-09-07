const db = require('../models');
const User = db.user;
const Role = db.role;
const Op = db.Sequelize.Op;
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
exports.signup = (req, res) => {
  // Save User to Database
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
  })
    .then((user) => {
      if (req.body.roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles,
            },
          },
        }).then((roles) => {
          user.setRoles(roles).then(() => {
            res.send({
              message: 'User was registered successfully!',
            });
          });
        });
      } else {
        // user role = 1
        user.setRoles([1]).then(() => {
          res.send({
            message: 'User was registered successfully!',
          });
        });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};
exports.signin = (req, res) => {
  User.findOne({
    where: {
      username: req.body.username,
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'User Not found.' });
      }
      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );
      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: 'Invalid Password!',
        });
      }
      var refresh_token = jwt.sign(
        { id: user.id },
        process.env.REFRESH_TOKEN_SECRET,
        {
          expiresIn: 86400, // 24 hours
        }
      );
      res.cookie('refreshtoken', refresh_token, {
        httpOnly: true,
        path: '/api/auth/refresh_token',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      var authorities = [];
      user.getRoles().then((roles) => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push('ROLE_' + roles[i].name.toUpperCase());
        }
        res.status(200).send({
          id: user.id,
          username: user.username,
          email: user.email,
          roles: authorities,
          refresh_token: refresh_token,
        });
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};
exports.getAccessToken = (req, res) => {
	console.log(req.cookies);
  try {
    const rf_token = req.cookies.refreshtoken;
    if (!rf_token)
      return res.status(400).json({ msg: 'Thao tác này yêu cầu đăng nhập' });
    jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err)
        return res.status(400).json({
          msg: err,
        });

      const access_token = jwt.sign({ id: user.id }, process.env.SECRET, {
        expiresIn: 86400, // 24 hours
      });
      res.json({ access_token });
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};
