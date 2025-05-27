class Report {
  constructor(id, generated_at, period_start, period_end, format, content_hash, file_path, author_id) {
    this.id = id;
    this.generated_at = generated_at;
    this.period_start = period_start;
    this.period_end = period_end;
    this.format = format;
    this.content_hash = content_hash;
    this.file_path = file_path;
    this.author_id = author_id;
  }
}

module.exports = Report;