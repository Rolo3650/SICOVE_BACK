import { User } from "@prisma/client";

const mockedUser = (): Partial<User> => {
    return {
        firstName: "Alan",
        lastName: "Grant",
        birthday: new Date("1949-02-09"),
        phone: 5529792343,
        email: "alangrant@sicudi.com",
        password: "dinoGrant.128",
        role: "admin",
        userStatus: "active",
    };
};

export { mockedUser };
