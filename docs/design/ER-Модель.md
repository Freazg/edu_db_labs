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