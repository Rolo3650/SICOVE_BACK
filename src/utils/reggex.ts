const generalPasswordRegex = /^(.+)(.{4})$/;
const bcryptPasswordRegex = /^(.+)(.{4})$/;
const mongoPasswordRegex = /^(.{14})(.{4})(.{1})(.{13})(.+)$/;

const hiddeGeneralPassword = (string: string): string => {
    return string.replace(
        generalPasswordRegex,
        (_, a: string, b) => "*".repeat(a.length) + b,
    );
};

const hiddeBcryptPassword = (string: string): string => {
    return string.replace(
        bcryptPasswordRegex,
        (_, a: string, b) => "*".repeat(a.length) + b,
    );
};

const hiddeMongoPassword = (string: string): string => {
    return string.replace(
        mongoPasswordRegex,
        (_, a, b: string, c, d: string, f) =>
            a + "*".repeat(b.length) + c + "*".repeat(d.length) + f,
    );
};

export { hiddeGeneralPassword, hiddeBcryptPassword, hiddeMongoPassword };
