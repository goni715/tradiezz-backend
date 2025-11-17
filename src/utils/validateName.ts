

function validateName(name: string) {
    // if (name === undefined || name === null) {
    //     return { valid: true }; // optional field
    // }

    if (typeof name !== "string") {
        return { valid: false, message: "Name must be a string" };
    }

    const trimmed = name.trim();

    if (trimmed.length === 0) {
        return { valid: false, message: "Name is required" };
    }

    if (/\d/.test(trimmed)) {
        return { valid: false, message: "Name cannot contain numbers" };
    }

    const forbiddenChars = /[~!@#$%^*\+?><=;:"]/;
    if (forbiddenChars.test(trimmed)) {
        return {
            valid: false,
            message: 'Name cannot contain special characters: ~ ! @ # $ % ^ * + ? > < = ; : "',
        };
    }

    return { valid: true, message: "Validation sucess" };
}

export default validateName;
