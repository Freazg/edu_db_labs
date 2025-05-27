# Проєктування бази даних

В рамках проекту розробляється: 
# модель бізнес-об'єктів 

@startuml

skinparam style strictuml

' ==================== User ====================
entity User #99CC66
entity User.id #CDE7B0
entity User.email #CDE7B0
entity User.password_hash #CDE7B0
entity User.first_name #CDE7B0
entity User.last_name #CDE7B0
entity User.registration_date #CDE7B0
entity User.last_login #CDE7B0
entity User.is_active #CDE7B0
User.id --* User
User.email --* User
User.password_hash --* User
User.first_name --* User
User.last_name --* User
User.registration_date --* User
User.last_login --* User
User.is_active --* User

' ==================== Role ====================
entity Role #FFCC66
entity Role.id #FFE7B0
entity Role.name #FFE7B0
entity Role.description #FFE7B0
entity Role.is_system #FFE7B0
Role.id --* Role
Role.name --* Role
Role.description --* Role
Role.is_system --* Role

' ==================== Permission ====================
entity Permission #66CCFF
entity Permission.id #B0E0FF
entity Permission.code #B0E0FF
entity Permission.description #B0E0FF
entity Permission.module #B0E0FF
Permission.id --* Permission
Permission.code --* Permission
Permission.description --* Permission
Permission.module --* Permission

' ==================== Project ====================
entity Project #FF99CC
entity Project.id #F6C9DD
entity Project.title #F6C9DD
entity Project.description #F6C9DD
entity Project.start_date #F6C9DD
entity Project.deadline #F6C9DD
entity Project.status #F6C9DD
entity Project.owner_id #F6C9DD
Project.id --* Project
Project.title --* Project
Project.description --* Project
Project.start_date --* Project
Project.deadline --* Project
Project.status --* Project
Project.owner_id --* Project

' ==================== Task ====================
entity Task #9999FF
entity Task.id #CCCCFF
entity Task.title #CCCCFF
entity Task.description #CCCCFF
entity Task.priority #CCCCFF
entity Task.status #CCCCFF
entity Task.created_at #CCCCFF
entity Task.updated_at #CCCCFF
entity Task.project_id #CCCCFF
Task.id --* Task
Task.title --* Task
Task.description --* Task
Task.priority --* Task
Task.status --* Task
Task.created_at --* Task
Task.updated_at --* Task
Task.project_id --* Task

' ==================== Message ====================
entity Message #6699CC
entity Message.id #AFCBE9
entity Message.content #AFCBE9
entity Message.sent_at #AFCBE9
entity Message.is_read #AFCBE9
entity Message.sender_id #AFCBE9
entity Message.recipient_id #AFCBE9
Message.id --* Message
Message.content --* Message
Message.sent_at --* Message
Message.is_read --* Message
Message.sender_id --* Message
Message.recipient_id --* Message

' ==================== Report ====================
entity Report #CC9966
entity Report.id #E6C6A5
entity Report.generated_at #E6C6A5
entity Report.period_start #E6C6A5
entity Report.period_end #E6C6A5
entity Report.format #E6C6A5
entity Report.content_hash #E6C6A5
entity Report.file_path #E6C6A5
entity Report.author_id #E6C6A5
Report.id --* Report
Report.generated_at --* Report
Report.period_start --* Report
Report.period_end --* Report
Report.format --* Report
Report.content_hash --* Report
Report.file_path --* Report
Report.author_id --* Report

' ==================== User_Role ====================
entity User_Role #D5B8FF
entity User_Role.assigned_at #E6CCFF
entity User_Role.assigned_by #E6CCFF
User_Role.assigned_at --* User_Role
User_Role.assigned_by --* User_Role

' ==================== Role_Permission ====================
entity Role_Permission #CCE5FF
entity Role_Permission.granted_at #E6F2FF
entity Role_Permission.granted_by #E6F2FF
Role_Permission.granted_at --* Role_Permission
Role_Permission.granted_by --* Role_Permission

' ==================== Project_Member ====================
entity Project_Member #FFB366
entity Project_Member.joined_at #FFD9B3
entity Project_Member.role #FFD9B3
entity Project_Member.assigned_by #FFD9B3
Project_Member.joined_at --* Project_Member
Project_Member.role --* Project_Member
Project_Member.assigned_by --* Project_Member

' ==================== Task_Assignment ====================
entity Task_Assignment #B366FF
entity Task_Assignment.assigned_at #D9B3FF
entity Task_Assignment.assigned_by #D9B3FF
entity Task_Assignment.deadline #D9B3FF
Task_Assignment.assigned_at --* Task_Assignment
Task_Assignment.assigned_by --* Task_Assignment
Task_Assignment.deadline --* Task_Assignment

' ==================== Relationships ====================
User "0,*" -d- "1,*" User_Role
User_Role "1,*" -d- "0,*" Role
Role "0,*" -d- "1,*" Role_Permission
Role_Permission "1,*" -d- "0,*" Permission

User "1,1" -d- "0,*" Project : owner
User "0,*" -d- "1,*" Project_Member
Project_Member "1,*" -d- "0,*" Project

Project "1,1" -d- "0,*" Task
User "0,*" -d- "1,*" Task_Assignment
Task_Assignment "1,*" -d- "0,*" Task

User "1,1" -d- "0,*" Message : sender
User "1,1" -d- "0,*" Message : recipient

User "1,1" -d- "0,*" Report : author

@enduml


# ER-модель

@startuml
    left to right direction
    
    entity User {
        id : UUID
        --
        email : varchar(255)
        password_hash : varchar(255)
        first_name : varchar(100)
        last_name : varchar(100)
        registration_date : timestamp
        last_login : timestamp
        is_active : boolean
    }
    
    entity Role {
        id : UUID
        --
        name : varchar(50)
        description : text
        is_system : boolean
    }
    
    entity Permission {
        id : UUID
        --
        code : varchar(100)
        description : text
        module : varchar(50)
    }
    
    entity Project {
        id : UUID
        --
        title : varchar(255)
        description : text
        start_date : timestamp
        deadline : timestamp
        status : varchar(20)
        owner_id : UUID
    }
    
    entity Task {
        id : UUID
        --
        title : varchar(255)
        description : text
        priority : varchar(10)
        status : varchar(15)
        created_at : timestamp
        updated_at : timestamp
        project_id : UUID
    }
    
    entity Message {
        id : UUID
        --
        content : text
        sent_at : timestamp
        is_read : boolean
        sender_id : UUID
        recipient_id : UUID
    }
    
    entity Report {
        id : UUID
        --
        generated_at : timestamp
        period_start : date
        period_end : date
        format : varchar(10)
        content_hash : varchar(64)
        file_path : varchar(255)
        author_id : UUID
    }
    
    entity User_Role {
        user_id : UUID
        role_id : UUID
        --
        assigned_at : timestamp
        assigned_by : UUID
    }
    
    entity Role_Permission {
        role_id : UUID
        permission_id : UUID
        --
        granted_at : timestamp
        granted_by : UUID
    }
    
    entity Project_Member {
        project_id : UUID
        user_id : UUID
        --
        joined_at : timestamp
        role : varchar(10)
        assigned_by : UUID
    }
    
    entity Task_Assignment {
        task_id : UUID
        user_id : UUID
        --
        assigned_at : timestamp
        assigned_by : UUID
        deadline : timestamp
    }
    
    ' User relationships
    User "0..*" -- "1..*" User_Role
    User_Role "1..*" -- "0..*" Role
    
    Role "0..*" -- "1..*" Role_Permission
    Role_Permission "1..*" -- "0..*" Permission
    
    ' Project relationships
    User "1" -- "0..*" Project : owner
    User "0..*" -- "1..*" Project_Member
    Project_Member "1..*" -- "0..*" Project
    
    ' Task relationships
    Project "1" -- "0..*" Task
    User "0..*" -- "1..*" Task_Assignment
    Task_Assignment "1..*" -- "0..*" Task
    
    ' Message relationships
    User "1" -- "0..*" Message : sender
    User "1" -- "0..*" Message : recipient
    
    ' Report relationships
    User "1" -- "0..*" Report : author
    
@enduml
# реляційна схема

![Реляційна схема](https://i.postimg.cc/MTNqmPbm/image.png)
