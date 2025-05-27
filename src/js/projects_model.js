class Project {
  constructor(id, title, description, start_date, deadline, status, owner_id) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.start_date = start_date;
    this.deadline = deadline;
    this.status = status;
    this.owner_id = owner_id;
  }
}

module.exports = Project;