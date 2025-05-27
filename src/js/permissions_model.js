class Permission {
  constructor(id, code, description, module) {
    this.id = id;
    this.code = code;
    this.description = description;
    this.module = module;
  }

  static validate(permissionData) {
    const errors = [];
    
    if (!permissionData.code || permissionData.code.trim().length === 0) {
      errors.push('Code is required');
    }
    
    if (!permissionData.module || permissionData.module.trim().length === 0) {
      errors.push('Module is required');
    }
    
    if (permissionData.code && permissionData.code.length > 100) {
      errors.push('Code must be less than 100 characters');
    }
    
    if (permissionData.module && permissionData.module.length > 100) {
      errors.push('Module must be less than 100 characters');
    }
    
    return errors;
  }

  static sanitize(permissionData) {
    return {
      id: permissionData.id,
      code: permissionData.code?.trim(),
      description: permissionData.description?.trim() || null,
      module: permissionData.module?.trim()
    };
  }
}

module.exports = Permission;