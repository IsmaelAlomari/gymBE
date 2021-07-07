const express = require('express');
const path = require('path');
const cors = require('cors');
const passport = require('passport');
const { localStrategy } = require('./middleware/passport');
const { jwtStrategy } = require('./middleware/passport');
const usersRoutes = require('./routes/users');
const gymRoutes = require('./routes/gyms');
const classesRoutes = require('./routes/classes');
const sessionsRoutes = require('./routes/sessions');

const app = express();

app.use(cors());
app.use(express.json());
// Passport Setup
app.use(passport.initialize());
passport.use(localStrategy);
passport.use(jwtStrategy);

// Routes
app.use('/gyms', gymRoutes);
app.use('/classes', classesRoutes);
app.use('/sessions', sessionsRoutes);

app.use(usersRoutes);

app.use('/media', express.static(path.join(__dirname, 'media')));
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});
app.use((err, req, res, next) => {
  res
    .status(err.status ?? 500)
    .json(err.message ?? { message: 'Internal Server Error.!' });
});
app.listen(8000, () => {});
