class userDto {
    _id;
    phone;
    createdAt;
    name;
    avatar;
    activated;

    constructor(user){
        this._id = user._id;
        this.phone = user.phone;
        this.createdAt = user.createdAt;
        this.activated = user.activated;
        this.name = user.name;
        this.avatar = user.avatar
    }
}

module.exports = userDto;