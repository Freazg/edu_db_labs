class User {
  constructor({
    id,
    email,
    password_hash,
    first_name,
    last_name,
    registration_date,
    last_login,
    is_active
  }) {
    this.id = id;
    this.email = email;
    this.password_hash = password_hash;
    this.first_name = first_name;
    this.last_name = last_name;
    this.registration_date = registration_date;
    this.last_login = last_login;
    this.is_active = is_active;
  }

  // Метод для приховування паролю при серіалізації
  toJSON() {
    const { password_hash, ...userWithoutPassword } = this;
    return userWithoutPassword;
  }

  // Валідація даних користувача
  static validate(userData) {
    const errors = [];
    
    if (!userData.email || !this.isValidEmail(userData.email)) {
      errors.push('Некоректна електронна адреса');
    }
    
    if (!userData.first_name || userData.first_name.length < 2) {
      errors.push('Ім\'я повинно містити мінімум 2 символи');
    }
    
    if (!userData.last_name || userData.last_name.length < 2) {
      errors.push('Прізвище повинно містити мінімум 2 символи');
    }
    
    return errors;
  }

  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

module.exports = User;