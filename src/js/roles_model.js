class Role {
  constructor(id, name, description, is_system = false) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.is_system = is_system;
  }

  static validate(roleData) {
    const errors = [];
    
    if (!roleData.name || roleData.name.trim().length === 0) {
      errors.push('Name is required');
    }
    
    if (roleData.name && roleData.name.length > 100) {
      errors.push('Name must be less than 100 characters');
    }
    
    return errors;
  }

  static sanitize(roleData) {
    return {
      id: roleData.id,
      name: roleData.name?.trim(),
      description: roleData.description?.trim() || null,
      is_system: Boolean(roleData.is_system)
    };
  }
}

module.exports = Role;