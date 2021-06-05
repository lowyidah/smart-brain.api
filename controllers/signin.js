const handleSignin = (req, res, db, bcrypt) => {
    // bcrypt.compare("bacon", hash, function(err, res) {
    //     console.log('first guess', res)
    // })
    const { email, password } = req.body;
    if(!email || !password){
        res.status(400).json('incorrect form submission');
        return;
    }
   db.select('email', 'hash').from('login').where("email", "=", email)
    .then(data => {
        const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
        if (isValid) {
            return db.select("*").from('users').where('email', '=', email)
                .then(user => {
                    res.json(user[0]);
                })
                .catch(err => res.status(400).json('unable to get user'))
        }
        else{
            res.status(400).json('wrong credentials');
        }
    })
    .catch(err => res.status(400).json("wrong credentials"));
}

module.exports = {
    handleSignin: handleSignin
}