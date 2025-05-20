# Проєктування бази даних

В рамках проекту розробляється: 
# модель бізнес-об'єктів 

@startuml

left to right direction

' ===== АКТОРИ =====
entity "Користувач" as User #52f752
entity User.id #aaffaa
entity User.email #aaffaa
entity User.password_hash #aaffaa
entity User.registration_date #aaffaa
entity User.last_login #aaffaa

User.id -d-* User
User.email -d-* User
User.password_hash -d-* User
User.registration_date -d-* User
User.last_login -d-* User

entity "Керівник проекту" as Manager #f74564
entity Manager.projects_created #FFC0CB
entity Manager.team_size #FFC0CB
entity Manager.access_level #FFC0CB

Manager.projects_created -d-* Manager
Manager.team_size -d-* Manager
Manager.access_level -d-* Manager

entity "Адміністратор" as Admin #06bfbf
entity Admin.super_user #9effff
entity Admin.system_access #9effff
entity Admin.audit_logs #9effff

Admin.super_user -d-* Admin
Admin.system_access -d-* Admin
Admin.audit_logs -d-* Admin

' ===== КОРИСТУВАЧ =====
entity "Реєстрація (UserSignUp)" as SignUp #aaffaa
entity SignUp.email_validation #aaffaa
entity SignUp.password_policy #aaffaa
entity SignUp.captcha #aaffaa

SignUp.email_validation -d-* SignUp
SignUp.password_policy -d-* SignUp
SignUp.captcha -d-* SignUp

entity "Перегляд проектів (ViewProjects)" as ViewProjects #aaffaa
entity ViewProjects.search_filters #aaffaa
entity ViewProjects.sorting #aaffaa
entity ViewProjects.pagination #aaffaa

ViewProjects.search_filters -d-* ViewProjects
ViewProjects.sorting -d-* ViewProjects
ViewProjects.pagination -d-* ViewProjects

entity "Виконання завдань (CreateTask)" as CompleteTask #aaffaa
entity CompleteTask.status_update #aaffaa
entity CompleteTask.time_spent #aaffaa
entity CompleteTask.attachments #aaffaa

CompleteTask.status_update -d-* CompleteTask
CompleteTask.time_spent -d-* CompleteTask
CompleteTask.attachments -d-* CompleteTask

entity "Написання повідомлень (SendMessage)" as SendMessage #aaffaa
entity SendMessage.recipients #aaffaa
entity SendMessage.encryption #aaffaa
entity SendMessage.history #aaffaa

SendMessage.recipients -d-* SendMessage
SendMessage.encryption -d-* SendMessage
SendMessage.history -d-* SendMessage

' ===== КЕРІВНИК =====
entity "Створення проекту (CreateProject)" as CreateProject #FFC0CB
entity CreateProject.templates #FFC0CB
entity CreateProject.workflow #FFC0CB
entity CreateProject.permissions #FFC0CB

CreateProject.templates -d-* CreateProject
CreateProject.workflow -d-* CreateProject
CreateProject.permissions -d-* CreateProject

entity "Додавання учасників (AddMemberToProject)" as AddMember #FFC0CB
entity AddMember.invitations #FFC0CB
entity AddMember.role_assignment #FFC0CB
entity AddMember.notifications #FFC0CB

AddMember.invitations -d-* AddMember
AddMember.role_assignment -d-* AddMember
AddMember.notifications -d-* AddMember

entity "Редагування проекту (EditProject)" as EditProject #FFC0CB
entity EditProject.version_control #FFC0CB
entity EditProject.approval #FFC0CB
entity EditProject.audit #FFC0CB

EditProject.version_control -d-* EditProject
EditProject.approval -d-* EditProject
EditProject.audit -d-* EditProject

entity "Призначення завдань (AssignTask)" as AssignTask #FFC0CB
entity AssignTask.priority_levels #FFC0CB
entity AssignTask.dependencies #FFC0CB
entity AssignTask.notifications #FFC0CB

AssignTask.priority_levels -d-* AssignTask
AssignTask.dependencies -d-* AssignTask
AssignTask.notifications -d-* AssignTask

entity "Формування звітів (GenerateReports)" as GenerateReport #FFC0CB
entity GenerateReport.custom_templates #FFC0CB
entity GenerateReport.data_sources #FFC0CB
entity GenerateReport.export_options #FFC0CB

GenerateReport.custom_templates -d-* GenerateReport
GenerateReport.data_sources -d-* GenerateReport
GenerateReport.export_options -d-* GenerateReport

entity "Управління правами (ManagePermissions)" as ManagePermissions #FFC0CB
entity ManagePermissions.role_editor #FFC0CB
entity ManagePermissions.access_matrix #FFC0CB
entity ManagePermissions.audit_trail #FFC0CB

ManagePermissions.role_editor -d-* ManagePermissions
ManagePermissions.access_matrix -d-* ManagePermissions
ManagePermissions.audit_trail -d-* ManagePermissions

' ===== АДМІНІСТРАТОР =====
entity "Керування проектами (ManageProjects)" as ManageProjects #9effff
entity ManageProjects.bulk_actions #9effff
entity ManageProjects.archive #9effff
entity ManageProjects.statistics #9effff

ManageProjects.bulk_actions -d-* ManageProjects
ManageProjects.archive -d-* ManageProjects
ManageProjects.statistics -d-* ManageProjects

entity "Налаштування системи (ManageSystemSettings)" as ManageSystem #9effff
entity ManageSystem.configuration #9effff
entity ManageSystem.integrations #9effff
entity ManageSystem.backups #9effff

ManageSystem.configuration -d-* ManageSystem
ManageSystem.integrations -d-* ManageSystem
ManageSystem.backups -d-* ManageSystem

entity "Керування користувачами (ManageUsers)" as ManageUsers #9effff
entity ManageUsers.import_export #9effff
entity ManageUsers.bulk_operations #9effff
entity ManageUsers.activity_logs #9effff

ManageUsers.import_export -d-* ManageUsers
ManageUsers.bulk_operations -d-* ManageUsers
ManageUsers.activity_logs -d-* ManageUsers

' ===== ЗВ'ЯЗКИ =====
User "1,1" --> "0,*" SignUp : "ID: UserSignUp"
User "1,1" --> "0,*" ViewProjects : "ID: ViewProjects"
User "1,1" --> "0,*" CompleteTask : "ID: CreateTask"
User "1,1" --> "0,*" SendMessage : "ID: SendMessage"

Manager "1,1" --> "0,*" CreateProject : "ID: CreateProject"
Manager "1,1" --> "0,*" AddMember : "ID: AddMemberToProject"
Manager "1,1" --> "0,*" EditProject : "ID: EditProject"
Manager "1,1" --> "0,*" AssignTask : "ID: AssignTask"
Manager "1,1" --> "0,*" GenerateReport : "ID: GenerateReports"
Manager "1,1" --> "0,*" ManagePermissions : "ID: ManagePermissions"

Admin "1,1" --> "0,*" ManageProjects : "ID: ManageProjects"
Admin "1,1" --> "0,*" ManageSystem : "ID: ManageSystemSettings"
Admin "1,1" --> "0,*" ManageUsers : "ID: ManageUsers"

' ===== ДЕТАЛЬНІ ЗВ'ЯЗКИ ====
CreateProject "1,1" <-- "0,*" ViewProjects : "впливає на"
AddMember "0,*" --> "1,1" User : "додає"
AssignTask "0,*" --> "1,1" CompleteTask : "створює"
GenerateReport "0,*" --> "1,1" CompleteTask : "використовує дані"
GenerateReport "0,*" --> "1,1" ViewProjects : "включає"
ManageUsers "0,*" --> "1,1" User : "контролює"
ManageProjects "0,*" --> "1,1" CreateProject : "керує"

' ===== ВИКЛЮЧНІ СИТУАЦІЇ =====
note bottom of SignUp
  <b>Exceptions:</b>
  - UserAlreadyExistsException
  - NotStrongPasswordException
  - InvalidEmailFormatException
end note

note bottom of CompleteTask
  <b>Exceptions:</b>
  - TaskNotFoundException
  - AccessDeniedException
  - DeadlineExceededException
end note

note bottom of AddMember
  <b>Exceptions:</b>
  - UserNotFoundException
  - ProjectNotFoundException
  - DuplicateMemberException
end note

' ===== СПІЛЬНІ МОЖЛИВОСТІ =====
note top of User
  <b>Common Features:</b>
  - Profile management
  - Notification center
  - Dashboard access
end note

@enduml


# ER-модель

@startuml
left to right direction
skinparam linetype polyline
skinparam nodesep 80
skinparam ranksep 80

' ===== CORE ENTITIES =====
entity User {
    * id : UUID
    --
    email : VARCHAR(255) <<UNIQUE>>
    password_hash : VARCHAR(255)
    first_name : VARCHAR(100)
    last_name : VARCHAR(100)
    registration_date : DATETIME
    last_login : DATETIME
    is_active : BOOLEAN
}

entity Project {
    * id : UUID
    --
    title : VARCHAR(255)
    description : TEXT
    start_date : DATETIME
    deadline : DATETIME
    status : ENUM('planned','active','completed','archived')
    owner_id : UUID <<FK>>
}

entity Task {
    * id : UUID
    --
    title : VARCHAR(255)
    description : TEXT
    priority : ENUM('low','medium','high','critical')
    status : ENUM('new','in_progress','completed','rejected')
    created_at : DATETIME
    updated_at : DATETIME
    project_id : UUID <<FK>>
}

' ===== SECURITY ENTITIES =====
entity Role {
    * id : UUID
    --
    name : VARCHAR(50) <<UNIQUE>>
    description : TEXT
    is_system : BOOLEAN
}

entity Permission {
    * id : UUID
    --
    code : VARCHAR(100) <<UNIQUE>>
    description : TEXT
    module : VARCHAR(50)
}

' ===== CONTENT ENTITIES =====
entity Message {
    * id : UUID
    --
    content : TEXT
    sent_at : DATETIME
    is_read : BOOLEAN
    sender_id : UUID <<FK>>
    recipient_id : UUID <<FK>>
}

entity Report {
    * id : UUID
    --
    generated_at : DATETIME
    period_start : DATE
    period_end : DATE
    format : ENUM('pdf','csv','excel')
    content_hash : VARCHAR(64)
    author_id : UUID <<FK>>
}

' ===== JOIN TABLES =====
entity UserRole {
    * user_id : UUID <<FK>>
    * role_id : UUID <<FK>>
    --
    assigned_at : DATETIME
    assigned_by : UUID <<FK>>
}

entity RolePermission {
    * role_id : UUID <<FK>>
    * permission_id : UUID <<FK>>
    --
    granted_at : DATETIME
    granted_by : UUID <<FK>>
}

entity ProjectMember {
    * project_id : UUID <<FK>>
    * user_id : UUID <<FK>>
    --
    joined_at : DATETIME
    role : ENUM('member','manager','observer')
}

entity TaskAssignment {
    * task_id : UUID <<FK>>
    * user_id : UUID <<FK>>
    --
    assigned_at : DATETIME
    assigned_by : UUID <<FK>>
    deadline : DATETIME
}

' ===== SYSTEM ENTITIES =====
entity SystemConfig {
    * id : UUID
    --
    param_name : VARCHAR(100) <<UNIQUE>>
    param_value : TEXT
    data_type : ENUM('string','number','boolean','json')
    is_public : BOOLEAN
}

entity AuditLog {
    * id : UUID
    --
    action_type : VARCHAR(50)
    entity_type : VARCHAR(50)
    entity_id : UUID
    changed_values : JSON
    performed_at : DATETIME
    user_id : UUID <<FK>>
}

' ===== RELATIONSHIPS =====
User "1" -- "0..*" Message : sends
User "1" -- "0..*" Message : receives

User "1" -- "0..*" Project : owns
Project "1" -- "0..*" Task : contains

User "1" -- "0..*" Task : creates
User "0..*" -- "0..*" Task : assigned > TaskAssignment

User "0..*" -- "0..*" Role : via > UserRole
Role "0..*" -- "0..*" Permission : via > RolePermission

User "0..*" -- "0..*" Project : members > ProjectMember
User "1" -- "0..*" Report : generates

SystemConfig "0..*" -- "0..1" User : modified_by
AuditLog "0..*" -- "1" User : performed_by

' ===== ENUM NOTES =====
note top of Task
    **Status Values:**
    - new
    - in_progress
    - completed
    - rejected
end note

note top of ProjectMember
    **Role Types:**
    - member
    - manager
    - observer
end note

@enduml

# реляційна схема

![Реляційна схема](https://i.postimg.cc/MTNqmPbm/image.png)