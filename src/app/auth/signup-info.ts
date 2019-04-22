export class SignUpInfo {
    id: number;
    name: string;
    lastName: string;
    username: string;
    email: string;
    role: string[];
    password: string;

    constructor(id: number,name: string,lastName: string, username: string, email: string, password: string) {
        this.id = id;
        this.name = name;
        this.lastName = lastName;
        this.username = username;
        this.email = email;
        this.password = password;
        this.role = ['eleve'];
    }
}
