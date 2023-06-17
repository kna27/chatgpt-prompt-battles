var DB = require('./db').DB,
    knex = DB.knex;

var User = DB.Model.extend({
    tableName: 'users',
    idAttribute: 'id',
    Google: function () {
        return this.hasOne(Google, 'id');
    }
});

var Google = DB.Model.extend({
    tableName: 'google',
    idAttribute: 'id',
    User: function () {
        return this.belongsTo(User, 'id');
    }
});

function createNewUser(callback) {
    new User().save().then(function (user) {
        callback(user.toJSON().id);
    });
}


function grabUserCredentials(userId, callback) {
    // Skeleton JSON
    var loginUser = {
        google: {
            id: userId,
            token: null,
            googleId: null,
            email: null,
            name: null,
        }
    };

    // SQL joins to get all credentials/tokens of a single user
    // to fill in loginUser JSON.
    knex.select('users.id', 'users.username', 'users.password',
        'google.token as g_token', 'google.google_id as g_id', 'google.email as g_email', 'google.name as g_name')
        .from('users')
        .leftOuterJoin('google', 'google.id', '=', 'users.id')
        .where('users.id', '=', userId).then(function (row) {
            row = row[0];

            if (!row) {
                callback('Could not find user with that ID', null);
            } else {
                loginUser.google.token = row.g_token;
                loginUser.google.googleId = row.g_id;
                loginUser.google.email = row.g_email;
                loginUser.google.name = row.g_name;

                callback(null, loginUser);
            }
        });
};

module.exports = {
    createNewUser: createNewUser,
    grabUserCredentials: grabUserCredentials,
    User: User,
    Google: Google
};
