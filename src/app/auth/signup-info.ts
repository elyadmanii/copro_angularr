export class SignUpInfo {
    name: string;
    lastName: string;
    username: string;
    email: string;
    role: string[];
    password: string;

    constructor(name: string,lastName: string, username: string, email: string, password: string) {
        this.name = name;
        this.lastName = lastName;
        this.username = username;
        this.email = email;
        this.password = password;
        this.role = ['eleve'];
    }
}
