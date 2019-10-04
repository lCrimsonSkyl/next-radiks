const verificaToken = (req, res, next) => {
    next();
};

const verificaAdminRole = (req, res, next) => {
    next();
};

module.exports = {
    verificaToken,
    verificaAdminRole,
};
